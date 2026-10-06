import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
import {Script} from 'node:vm';
const read=n=>readFileSync(new URL(n,import.meta.url),'utf8');
const tokens=JSON.parse(read('design-tokens.json'));
const routes=JSON.parse(read('routes.json'));
const inventory=JSON.parse(read('content-inventory.json'));
const css=read('tokens.css'),html=read('review.html');
const paths=new Set(routes.pages.map(p=>p.path));
assert.equal(paths.size,routes.pages.length,'Duplicate route');
for(const item of routes.primaryNavigation)assert(paths.has(item.path),'Missing navigation destination');
const sources=new Set();
for(const r of routes.redirects){assert(!sources.has(r.from),'Duplicate redirect');sources.add(r.from);assert(paths.has(r.to),'Missing redirect destination');assert(!paths.has(r.from),'Redirect collides with proposed page');}
assert.equal(inventory.countries.length,9);
assert.equal(routes.pages.filter(p=>p.kind==='country').length,9);
for(const c of inventory.countries){assert(paths.has('/edition-one/'+c.slug));assert.equal(c.readyToPublish,false,'Unapproved country marked publishable');}
assert.equal(routes.globalAction.approvedDownloadUrl,null);
for(const [key,value] of Object.entries(tokens.colors)){const variable=key.replace(/[A-Z]/g,m=>'-'+m.toLowerCase());assert(css.includes('--'+variable+':'+value),'CSS/token mismatch: '+key);}
const luminance=hex=>{const rgb=hex.slice(1).match(/../g).map(v=>parseInt(v,16)/255).map(v=>v<=0.04045?v/12.92:((v+0.055)/1.055)**2.4);return rgb[0]*0.2126+rgb[1]*0.7152+rgb[2]*0.0722;};
for(const [a,b,min] of [['text','canvas',4.5],['muted','canvas',4.5],['surface','accent',4.5],['accent','canvas',4.5],['inputBorder','surface',3],['focus','canvas',3]]){const x=luminance(tokens.colors[a]),y=luminance(tokens.colors[b]);const ratio=(Math.max(x,y)+0.05)/(Math.min(x,y)+0.05);assert(ratio>=min,`${a}/${b} contrast ${ratio}`);console.log(`${a}/${b}: ${ratio.toFixed(2)}:1`);}
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(ids.length,new Set(ids).size,'Duplicate HTML ID');
for(const m of html.matchAll(/href="#([^"]+)"/g))assert(ids.includes(m[1]),'Missing internal anchor '+m[1]);
for(const m of html.matchAll(/aria-(?:controls|describedby)="([^"]+)"/g))for(const id of m[1].split(' '))assert(ids.includes(id),'Missing ARIA reference '+id);
assert(!/<(?:script|img)[^>]+src="https?:/i.test(html),'Unexpected remote media/script');
for(const m of html.matchAll(/<script>([\s\S]*?)<\/script>/g))new Script(m[1]);
console.log(`PASS: ${paths.size} proposed routes, ${sources.size} redirects, 9 country packages, token parity, contrast, anchor/ARIA references and script syntax.`);
console.log('Not tested: browser rendering, keyboard behavior, screen readers, Wix layouts or live bindings.');
