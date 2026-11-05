import { detectRepository, GitHubReader, run, issueReference } from './github.js';
export const inject = ['webServer', 'connection', 'sessions', 'workingDirectory', 'credentials'];
const credentialKey = 'github-issues/github-com';
export function apply(ctx) {
  async function operation(input) {
    if (input.action === 'auth-status') return { configured: (await ctx.credentials.describeRecord(credentialKey)).configured };
    if (input.action === 'save-token') {
      const token = typeof input.token === 'string' ? input.token.trim() : '';
      if (!token || token.length > 1000 || /\s/.test(token)) throw new Error('Enter a valid GitHub token.');
      await new GitHubReader(token).get('/user');
      await ctx.credentials.modifyRecord(credentialKey, async () => ({ kind: 'api-key', key: token }));
      return { saved: true };
    }
    if (input.action === 'remove-token') { await ctx.credentials.deleteRecord(credentialKey); return { removed: true }; }
    const session = ctx.sessions.get(input.sessionId);
    if (!session) throw new Error('Open a live workspace session before loading issues.');
    const repository = await detectRepository(ctx.workingDirectory.get(session));
    if (!repository.available) return repository;
    if (input.action === 'repository') return repository;
    const record = await ctx.credentials.readRecord(credentialKey);
    let token = record?.kind === 'api-key' ? record.key : undefined;
    let authentication = token ? 'token' : 'gh';
    if (!token) {
      try { token = await run('gh', ['auth', 'token', '--hostname', 'github.com']); }
      catch { throw new Error('Sign in with gh auth login, or add a GitHub token in this panel.'); }
    }
    const reader = new GitHubReader(token);
    if (input.action === 'list') return { available: true, repository, authentication, ...await reader.list(repository, input) };
    if (input.action === 'detail') return { issue: await reader.detail(repository, input.number) };
    if (input.action === 'comments') return await reader.comments(repository, input.number, input.page);
    if (input.action === 'reference') {
      const issue = await reader.detail(repository, input.number);
      const comments = [];
      for (let page = 1; ; page++) {
        const batch = await reader.comments(repository, input.number, page);
        comments.push(...batch.comments);
        if (Buffer.byteLength(JSON.stringify(comments)) > 2 * 1024 * 1024) throw new Error('Discussion is too large to attach safely. No partial reference was added.');
        if (!batch.next) break;
      }
      return { text: issueReference(repository, issue, comments), comments: comments.length };
    }
    throw new Error('Unknown issues action.');
  }
  ctx.webServer.register({ kind: 'exact', path: '/api/local-github-issues', async handler(req, res) {
    const send = (status, value) => { res.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' }); res.end(JSON.stringify(value)); };
    const admission = ctx.connection.admit(req);
    if ('rejection' in admission) return send(admission.rejection, { error: 'Authentication required.' });
    if (admission.peer.principal.kind !== 'owner') return send(403, { error: 'Only the profile owner can use this panel.' });
    if (req.method !== 'POST') return send(405, { error: 'POST required.' });
    if (!req.headers['content-type']?.startsWith('application/json')) return send(415, { error: 'JSON required.' });
    try {
      let body = '';
      for await (const chunk of req) { body += chunk.toString(); if (Buffer.byteLength(body) > 8192) return send(413, { error: 'Request too large.' }); }
      const input = JSON.parse(body);
      if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('Invalid request.');
      send(200, await operation(input));
    } catch (error) { send(400, { error: error instanceof SyntaxError ? 'Invalid request.' : error.message || 'GitHub request failed.' }); }
  } });
}
