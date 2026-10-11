import http from 'node:http';
import { readFile } from 'node:fs/promises';
const workerSource = await readFile(new URL('./src/index.js', import.meta.url), 'utf8');
const nodeCompatibleSource = workerSource.replace("import { connect as tcpConnect } from 'cloudflare:sockets';", 'const tcpConnect = () => { throw new Error("TCP socket mock missing"); };');
if (nodeCompatibleSource === workerSource) throw new Error('Cloudflare socket import not found');
const { default: worker } = await import(`data:text/javascript;base64,${Buffer.from(nodeCompatibleSource).toString('base64')}`);
const calls=[];
const srv=http.createServer((q,s)=>{calls.push(q.url);
 if(q.url.startsWith('/live/tu/tp/7.m3u8')){s.setHeader('content-type','application/vnd.apple.mpegurl');return s.end('#EXTM3U\n#EXT-X-KEY:METHOD=AES-128,URI="key.bin"\n#EXTINF:4,\nseg1.ts\n#EXTINF:4,\nhttp://evil.example/x.ts\n');}
 if(q.url.startsWith('/live/tu/tp/7.ts')){s.statusCode=302;s.setHeader('location','http://87.120.127.18/live/tu/tp/7.ts');return s.end();}
 if(q.url.startsWith('/live/tu/tp/seg1.ts')){s.setHeader('content-type','video/mp2t');return s.end(Buffer.from([1,2,3]));}
 if(q.url.startsWith('/player_api.php')){const u=new URL(q.url,'http://x');const a=u.searchParams.get('action');s.setHeader('content-type','application/json');
  if(a==='get_live_categories')return s.end(JSON.stringify([{category_id:'1',category_name:'Sports'}]));
  if(a==='get_live_streams')return s.end(JSON.stringify([{stream_id:7,name:'Sports 1',stream_icon:'',category_id:'1',epg_channel_id:'x'}]));
  if(a==='get_short_epg')return s.end(JSON.stringify({epg_listings:[{title:Buffer.from('Match Day').toString('base64'),start_timestamp:'100',stop_timestamp:'200'}]}));}
 s.statusCode=404;s.end('no');});
await new Promise(r=>srv.listen(0,r));
let tcpRequest='';
const env={XT_URL:`http://127.0.0.1:${srv.address().port}`,XT_USER:'tu',XT_PASS:'tp',TOKEN_SECRET:'s3cret',ALLOWED_ORIGINS:'https://magxtv.click',PUBLIC_PLAYBACK_ENABLED:'false',TEST_CONNECT(address,options){
 T('provider redirect restricted to validated public IPv4',address.hostname==='87.120.127.18'&&address.port===80&&options.allowHalfOpen===true);
 const packet=Buffer.alloc(188);packet[0]=0x47;
 const raw=Buffer.concat([Buffer.from('HTTP/1.1 200 OK\r\nContent-Type: video/mp2t\r\nTransfer-Encoding: chunked\r\n\r\nbc\r\n'),packet,Buffer.from('\r\n0\r\n\r\n')]);
 return {readable:new ReadableStream({start(c){c.enqueue(Uint8Array.from(raw));c.close()}}),writable:new WritableStream({write(chunk){tcpRequest+=new TextDecoder().decode(chunk)}}),async close(){}};
}};
const ctx={waitUntil(){}};const O={Origin:'https://magxtv.click'};
const call=(path,h={})=>worker.fetch(new Request('https://w.test'+path,{headers:h}),env,ctx);
let ok=0,bad=0;const T=(n,c)=>{c?ok++:(bad++,console.log('FAIL',n))};
T('playback disabled by default',(await call('/api/token',O)).status===403);
T('stream route disabled by default',(await call('/hls/7.m3u8?t=ignored',O)).status===403);
T('TS route disabled by default',(await call('/ts/7.ts?t=ignored',O)).status===403);
env.PUBLIC_PLAYBACK_ENABLED='true';
T('token blocked no origin',(await call('/api/token')).status===403);
const tk=(await (await call('/api/token',O)).json()).t;T('token issued',!!tk);
T('hls unauthorized',(await call('/hls/7.m3u8')).status===401);
T('hls bad token',(await call('/hls/7.m3u8?t=1.abc')).status===401);
const pl=await (await call('/hls/7.m3u8?t='+tk,O)).text();
T('playlist rewritten',pl.includes('https://w.test/seg?u=')&&!pl.includes('seg1.ts\n')&&!pl.includes('tu/tp'));
T('creds not leaked in playlist',!/tp|tu\//.test(pl.replace(/https:\/\/w\.test\/seg\?u=[\w-]+&t=[\w.-]+/g,'')));
const urls=[...pl.matchAll(/https:\/\/w\.test(\/seg\?[^"\n]+)/g)].map(m=>m[1]);
const seg=await call(urls[1],O);T('segment relayed',seg.status===200&&(await seg.arrayBuffer()).byteLength===3);
T('evil host blocked',(await call(urls[2],O)).status===403);
const ts=await call('/ts/7.ts?t='+tk,O);const tsData=new Uint8Array(await ts.arrayBuffer());
T('MPEG-TS stream relayed',ts.status===200&&ts.headers.get('content-type')==='video/mp2t'&&tsData.length===188&&tsData[0]===0x47);
T('provider hostname sent as Host header',tcpRequest.includes(`Host: 127.0.0.1:${srv.address().port}`));
T('categories',(await (await call('/api/live/categories',O)).json())[0].n==='Sports');
T('streams trimmed',JSON.stringify(await (await call('/api/live/streams',O)).json())==='[{"id":7,"n":"Sports 1","i":"","c":"1","e":"x"}]');
T('epg decoded',(await (await call('/api/epg/7',O)).json())[0].t==='Match Day');
T('api forbidden other origin',(await call('/api/live/streams',{Origin:'https://evil.com'})).status===403);
console.log(ok+' passed, '+bad+' failed');srv.close();
