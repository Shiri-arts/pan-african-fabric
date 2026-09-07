import { readFile, readdir } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { parseEnv } from 'node:util';
const root = new URL('../', import.meta.url);
const environment=parseEnv(await readFile(new URL('.env.local',root),'utf8'));
assert(environment.WIX_CLIENT_SECRET, 'Pull the managed local environment before this check.');
const drafts = ['One Fabric. Many African Stories.', 'Nine countries. A shared creative conversation.', 'Created by Shiri Achu, The Pan-African Fabric'];
async function walk(url) {
 for (const entry of await readdir(url,{withFileTypes:true})) {
  const child=new URL(entry.name+(entry.isDirectory()?'/':''),url);
  if(entry.isDirectory()) await walk(child);
  else if(/\.(m?js|html|json|css)$/.test(entry.name)) {
   const content=await readFile(child,'utf8');
   for(const draft of drafts) assert(!content.includes(draft),`Draft text in ${child.pathname}`);
   assert(!content.includes('WIX_CMS_ADMIN_TOKEN'),`Admin code in ${child.pathname}`);
   assert(!content.includes(environment.WIX_CLIENT_SECRET),`Managed secret in ${child.pathname}`);
  }
 }
}
await walk(new URL('dist/',root));
const {default:worker}=await import(new URL('dist/_worker.js/index.mjs',root));
const results=[];
for(const path of ['/','/initiative','/edition-one','/exhibitions','/media','/future-editions','/unknown']) {
 const response=await worker.fetch(new Request('http://127.0.0.1:4322'+path),environment);
 const html=await response.text();
 assert(!html.includes(environment.WIX_CLIENT_SECRET),`${path} leaks managed secret`);
 assert(response.headers.get('content-security-policy')?.includes("connect-src 'self'"),'Same-origin request policy missing');
 assert.equal(response.status,path==='/unknown'?404:200,`${path} HTTP status`);
 for(const draft of drafts)assert(!html.includes(draft),`${path} leaks draft`);
 if(path!='/unknown') assert(html.includes('Content is not available yet.'),`${path} lacks production gate`);
 results.push({path,status:response.status,draftLeak:false});
}
console.log(JSON.stringify({productionBundle:'no draft, admin code or managed secret',responses:results}));
