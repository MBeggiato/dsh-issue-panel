import test from 'node:test';
import assert from 'node:assert/strict';
import { Readable } from 'node:stream';
import { apply } from './index.js';
function fixture(admission) {
 let route;
 const ctx={webServer:{register:r=>{route=r;}},connection:{admit:()=>admission},sessions:{get:()=>({})},workingDirectory:{get:()=>process.cwd()},credentials:{describeRecord:async()=>({configured:false})}};
 apply(ctx);
 return async(input,headers={'content-type':'application/json'},method='POST')=>{
 const req=Readable.from([JSON.stringify(input)]);req.headers=headers;req.method=method;
 let status,body;await route.handler(req,{writeHead:s=>{status=s;},end:b=>{body=JSON.parse(b);}});return {status,body};
 };
}
test('route rejects unauthenticated and non-owner requests',async()=>{
 assert.equal((await fixture({rejection:401})({action:'auth-status'})).status,401);
 assert.equal((await fixture({peer:{principal:{kind:'guest'}}})({action:'auth-status'})).status,403);
});
test('route enforces method and JSON content type',async()=>{
 const call=fixture({peer:{principal:{kind:'owner'}}});assert.equal((await call({}, {},'GET')).status,405);assert.equal((await call({}, {})).status,415);
});
test('route exposes credential presence without values',async()=>{
 assert.deepEqual((await fixture({peer:{principal:{kind:'owner'}}})({action:'auth-status'})).body,{configured:false});
});
test('actual development workspace reports not-git without auth lookup',async()=>{
 const result=await fixture({peer:{principal:{kind:'owner'}}})({action:'list',sessionId:'test'});assert.equal(result.status,200);assert.deepEqual(result.body,{available:false,reason:'not-git'});
});
