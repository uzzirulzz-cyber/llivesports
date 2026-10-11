interface Env { SPORTS_API_URL?: string; SPORTS_API_KEY?: string; SPORTS_API_KEY_HEADER?: string }
interface Context { request: Request; env: Env }
const json = (body:unknown) => Response.json(body, { headers: { 'Cache-Control':'public, max-age=30', 'X-Content-Type-Options':'nosniff' } });
export async function onRequestGet({env}:Context):Promise<Response>{
  const empty={source:'unconfigured',matches:[],highlights:[],lastUpdated:null,error:'Sports provider not configured'};
  if(!env.SPORTS_API_URL)return json(empty);
  try{
    const url=new URL(env.SPORTS_API_URL);
    if(url.protocol!=='https:'||url.username||url.password)throw Error('Invalid provider URL');
    const headers=new Headers({'Accept':'application/json'});
    if(env.SPORTS_API_KEY){
      const key=env.SPORTS_API_KEY_HEADER||'Authorization';
      if(!/^[A-Za-z0-9-]{1,64}$/.test(key))throw Error('Invalid API header');
      headers.set(key,key.toLowerCase()==='authorization'?'Bearer '+env.SPORTS_API_KEY:env.SPORTS_API_KEY);
    }
    const response=await fetch(url,{headers,redirect:'error',signal:AbortSignal.timeout(8000)});
    if(!response.ok)throw Error('Provider failed');
    const body=await response.json() as {matches?:unknown;highlights?:unknown};
    const allowed=new Set(['Football','Cricket','Basketball','Tennis','Motorsports','Combat Sports','Volleyball','Hockey','Rugby','Esports']);
    const clean=(v:unknown,n=100)=>typeof v==='string'?v.slice(0,n):'';
    const matches=Array.isArray(body.matches)?body.matches.slice(0,1000).flatMap((m:unknown)=>{
      if(!m||typeof m!=='object')return[];
      const x=m as Record<string,unknown>;
      if(!allowed.has(String(x.sport))||typeof x.id!=='string'||typeof x.home!=='string'||typeof x.away!=='string'||typeof x.live!=='boolean')return[];
      return [{id:clean(x.id,80),sport:x.sport,home:clean(x.home),away:clean(x.away),league:clean(x.league),score:clean(x.score,40),status:clean(x.status,60),time:clean(x.time,80),live:x.live,completed:x.completed===true}];
    }):[];
    const highlights=Array.isArray(body.highlights)?body.highlights.slice(0,30).flatMap((h:unknown)=>{
      if(!h||typeof h!=='object')return[];
      const x=h as Record<string,unknown>;try{const link=new URL(String(x.url));if(link.protocol!=='https:'||link.username||link.password||!x.title||x.rights!=='embed-authorized')return[];return[{title:clean(x.title),url:link.href,source:clean(x.source)}]}catch{return[]}
    }):[];
    return json({source:'live',matches,highlights,lastUpdated:new Date().toISOString()});
  }catch{return json({source:'unavailable',matches:[],highlights:[],lastUpdated:null,error:'Sports provider unavailable'})}
}
