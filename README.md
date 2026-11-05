# GitHub issues for DeepSeek Harness

A local persistent bundle adding **GitHub issues** alongside Chat and Trajectory in each open session. Select that view to browse the current session working directory's GitHub repository.

## Features

- GitHub.com remotes detected from Git; prefers `origin`, then the first GitHub remote.
- Read-only GitHub API requests. Pull requests excluded.
- 50 API entries per page with Load more (GitHub includes PR entries in the underlying page).
- Repository-wide filters by label, assignee and author; sort by update time or creation time. Local search covers loaded issues.
- Issue descriptions and comments displayed as safe plain text, preserving Markdown source. Comments paginated in batches of 100.
- Manual refresh and a 60-second visible-page refresh.
- Add to chat fetches a fresh description and all comments and inserts a textual snapshot into the current draft using revision-guarded insertion. It never sends a message. Discussions larger than 2 MiB are rejected rather than silently truncated.
- Non-Git and non-GitHub workspaces show an explanation without making GitHub requests.

## Authentication

Run `gh auth login --hostname github.com` on the Harness host. Alternatively, open **Authentication** in the panel and save a token. A saved token overrides gh for this profile. Remove it to return to gh.

Use a fine-grained token with read-only Issues and Metadata access for the desired repository. The plugin validates the token against GitHub before saving it in Harness's credential record store. It never returns the token to the browser, stores it in browser storage, or logs it to chat. Token entry is a user-only credential action.

The plugin route uses Harness connection authentication and permits only the profile owner. Browsing does not create chat log entries. GitHub content is external data; the snapshot labels it accordingly.

## Development and installation

No dependencies, build scripts, separate React installation or server required.

```sh
npm test
npm run check
```

Install this absolute package directory with Harness's `plugin_manager install_bundle`. Installation affects the current profile, not only one session. This is currently a private local package; review naming, compatibility and licensing before publishing it.

## Limits

GitHub Enterprise is not supported. Sessions must already be live; the plugin does not resume or wake agents. Markdown is shown as text rather than rendered HTML. Refresh reloads the first list page and first comments page while retaining the selected issue. Current repository selection follows the session's effective working directory. The icon is original geometric artwork authored for this plugin.
