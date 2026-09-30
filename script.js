"use strict";
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
const fine=matchMedia("(hover:hover) and (pointer:fine)").matches&&innerWidth>900;

/* capabilities: 2 = documented focus, 1 = partial / via add-ons, 0 = not a core focus  [coding, reasoning, search, multimodal] */
const MODELS=[
{id:"chatgpt",name:"ChatGPT",co:"OpenAI",label:"General AI",type:"Assistant",h:165,url:"https://chatgpt.com",year:2022,pop:100,cats:["general","coding","multimodal","reasoning","image"],tags:["Chat","Reasoning","Coding"],desc:"General-purpose AI assistant for conversation, reasoning, writing and coding.",caps:[2,2,1,2],open:0},
{id:"claude",name:"Claude",co:"Anthropic",label:"Reasoning AI",type:"Assistant",h:22,url:"https://claude.ai",year:2023,pop:96,cats:["general","coding","reasoning","multimodal"],tags:["Writing","Coding","Analysis"],desc:"AI assistant for thoughtful writing, coding, analysis and long-document work.",caps:[2,2,1,2],open:0},
{id:"gemini",name:"Gemini",co:"Google",label:"Multimodal AI",type:"Assistant",h:215,url:"https://gemini.google.com",year:2023,pop:95,cats:["general","coding","multimodal","research","image","video"],tags:["Search","Vision","Coding"],desc:"Google's multimodal assistant that works with text, images, code and Google apps.",caps:[2,2,2,2],open:0},
{id:"perplexity",name:"Perplexity",co:"Perplexity AI",label:"AI Search",type:"Answer engine",h:190,url:"https://www.perplexity.ai",year:2022,pop:90,cats:["research","general"],tags:["Research","Search","Citations"],desc:"Answer engine that searches the web and responds with cited sources.",caps:[0,1,2,0],open:0},
{id:"grok",name:"Grok",co:"xAI",label:"General AI",type:"Assistant",h:0,url:"https://grok.com",year:2023,pop:82,cats:["general","image","multimodal","research"],tags:["Chat","Real-time","Images"],desc:"xAI's assistant for conversation, web-aware answers and image generation.",caps:[1,2,2,2],open:0},
{id:"copilot",name:"Microsoft Copilot",co:"Microsoft",label:"General AI",type:"Assistant",h:205,url:"https://copilot.microsoft.com",year:2023,pop:86,cats:["general","coding","image","multimodal"],tags:["Productivity","Search","Images"],desc:"Microsoft's AI companion for answers, writing and everyday productivity.",caps:[1,1,2,2],open:0},
{id:"mistral",name:"Mistral",co:"Mistral AI",label:"Open Source",type:"Model + assistant",h:28,url:"https://mistral.ai",year:2023,pop:74,cats:["open","general","coding"],tags:["Open weights","API","Coding"],desc:"European AI lab with open-weight models, an assistant and a developer API.",caps:[2,1,0,1],open:2},
{id:"deepseek",name:"DeepSeek",co:"DeepSeek",label:"Reasoning AI",type:"Model + assistant",h:225,url:"https://www.deepseek.com",year:2023,pop:80,cats:["open","coding","reasoning","general"],tags:["Reasoning","Coding","Open weights"],desc:"Chinese AI lab known for open-weight reasoning and coding models.",caps:[2,2,1,0],open:2},
{id:"qwen",name:"Qwen",co:"Alibaba Cloud",label:"Open Source",type:"Model family",h:255,url:"https://chat.qwen.ai",year:2023,pop:70,cats:["open","coding","multimodal","general"],tags:["Open weights","Multilingual","Coding"],desc:"Alibaba's model family with open-weight releases and a free web chat.",caps:[2,1,1,2],open:2},
{id:"meta",name:"Meta AI",co:"Meta",label:"General AI",type:"Assistant",h:240,url:"https://www.meta.ai",year:2023,pop:78,cats:["general","open","image","multimodal"],tags:["Chat","Images","Llama"],desc:"Meta's assistant, built on its Llama models, for chat and image creation.",caps:[1,1,1,2],open:1},
{id:"poe",name:"Poe",co:"Quora",label:"Multi-model",type:"Aggregator",h:270,url:"https://poe.com",year:2022,pop:66,cats:["general","image","video","multimodal","coding"],tags:["Many models","Bots","Creative"],desc:"One place to chat with many AI models and community-built bots.",caps:[1,1,1,2],open:0},
{id:"cohere",name:"Cohere",co:"Cohere",label:"Enterprise AI",type:"Developer platform",h:175,url:"https://cohere.com",year:2019,pop:58,cats:["open","research","general"],tags:["Enterprise","RAG","API"],desc:"Enterprise language models and tools for search, retrieval and agents.",caps:[1,1,2,0],open:1},
{id:"hf",name:"Hugging Face",co:"Hugging Face",label:"Open Source",type:"Developer platform",h:48,url:"https://huggingface.co",year:2016,pop:72,cats:["open","coding","image","video","multimodal"],tags:["Models","Datasets","Community"],desc:"The community hub for open models, datasets and machine-learning apps.",caps:[1,0,0,2],open:2},
{id:"character",name:"Character.AI",co:"Character.AI",label:"Creative AI",type:"Companion chat",h:320,url:"https://character.ai",year:2022,pop:64,cats:["general"],tags:["Characters","Roleplay","Creative"],desc:"Chat with AI characters for stories, roleplay and creative conversation.",caps:[0,0,0,1],open:0}
];
const FILTERS=[["all","ALL"],["general","GENERAL"],["coding","CODING"],["research","RESEARCH"],["image","IMAGE"],["video","VIDEO"],["open","OPEN SOURCE"],["multimodal","MULTIMODAL"]];
const CATS=[["general","💬","General AI","Chat, writing, reasoning"],["coding","💻","Coding AI","Programming and development"],["research","🔎","Research AI","Search and knowledge discovery"],["creative","🎨","Creative AI","Images, video and creative generation"],["reasoning","🧠","Reasoning AI","Advanced reasoning and analysis"],["open","🧩","Open Source","Open models and developer platforms"]];
const INTENTS={Write:["claude","chatgpt","gemini","copilot","mistral"],Code:["chatgpt","claude","gemini","deepseek","qwen"],Research:["perplexity","gemini","chatgpt","cohere","grok"],Learn:["chatgpt","claude","gemini","perplexity","copilot"],"Create Images":["chatgpt","gemini","grok","meta","poe"],"Analyze Data":["claude","chatgpt","gemini","deepseek","cohere"],Brainstorm:["claude","chatgpt","gemini","poe","character"]};
const state={q:"",cat:"all",sort:"popular"};
const byId=id=>MODELS.find(m=>m.id===id);
const esc=s=>s.replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

/* ---------- rendering ---------- */
const cardHTML=(m,i,big)=>`<article class="card ${big?"big":""}" style="--h:${m.h};--i:${i}" data-tilt>
<div class="top"><div class="logo-i" aria-hidden="true">${esc(m.name[0])}</div><div><h3>${esc(m.name)}</h3><div class="co">${esc(m.co)}</div></div><span class="avail"><i></i>Live</span></div>
<p>${esc(m.desc)}</p><span class="cat">${esc(m.label)}</span><div class="tags">${m.tags.map(t=>`<span>${esc(t)}</span>`).join("")}</div>
<div class="open"><span>OPEN ${big?esc(m.name.toUpperCase()):""}</span><span class="arr">↗</span></div>
<a class="stretch" href="${m.url}" target="_blank" rel="noopener noreferrer" aria-label="Open ${esc(m.name)} official website"></a></article>`;

function filtered(){
  const q=state.q.trim().toLowerCase();
  let list=MODELS.filter(m=>(state.cat==="all"||m.cats.includes(state.cat)||(state.cat==="creative"&&(m.cats.includes("image")||m.cats.includes("video"))))
    &&(!q||[m.name,m.co,m.label,m.desc,m.type,...m.tags,...m.cats].join(" ").toLowerCase().includes(q)));
  const s={popular:(a,b)=>b.pop-a.pop,newest:(a,b)=>b.year-a.year||b.pop-a.pop,open:(a,b)=>b.open-a.open||b.pop-a.pop,az:(a,b)=>a.name.localeCompare(b.name)}[state.sort];
  return list.sort(s);
}
function renderCards(){
  const list=filtered();
  $("#cards").innerHTML=list.map((m,i)=>cardHTML(m,i)).join("");
  $("#empty").hidden=list.length>0;
  $("#found").innerHTML=`<b>${list.length}</b> model${list.length===1?"":"s"} found`;
  bindCards();
}
function renderStatic(){
  $("#liveCount").textContent=MODELS.length;
  $("#featGrid").innerHTML=["chatgpt","claude","gemini","perplexity"].map((id,i)=>cardHTML(byId(id),i,true)).join("");
  $("#pills").innerHTML=FILTERS.map(([k,l])=>`<button class="pill" data-cat="${k}" aria-pressed="false">${l}</button>`).join("");
  $("#catGrid").innerHTML=CATS.map(([k,e,t,d])=>`<button class="cc" data-cat="${k}"><b>${e}</b><h3>${t}</h3><p>${d}</p></button>`).join("");
  $("#intents").innerHTML=Object.keys(INTENTS).map(k=>`<button class="pill" data-intent="${k}">${k}</button>`).join("");
  const sym=v=>v===2?'<span class="f">●</span>':v===1?'<span class="p">◐</span>':'<span class="n">–</span>';
  $("#tbody").innerHTML=MODELS.map(m=>`<tr><td>${esc(m.name)}</td><td>${esc(m.co)}</td><td>${esc(m.type)}</td>${m.caps.map(c=>`<td>${sym(c)}</td>`).join("")}<td>${sym(m.open)}</td></tr>`).join("");
  const names=["CHATGPT","CLAUDE","GEMINI","GROK","DEEPSEEK","MISTRAL","QWEN","PERPLEXITY","COPILOT","META AI"];
  $("#track").innerHTML=[...names,...names].map(n=>`<span>${n} •</span>`).join("");
  spotlight();
  setCat("all",false);
}
function spotlight(){
  const m=MODELS[Math.floor(Date.now()/864e5)%MODELS.length];
  $("#spot").style.setProperty("--h",m.h);
  $("#spot").innerHTML=`<div class="logo-i" style="--h:${m.h}" aria-hidden="true">${esc(m.name[0])}</div><div><span class="badge">MODEL OF THE MOMENT</span><h3>${esc(m.name)}</h3><p>${esc(m.desc)}</p><div class="tags">${m.tags.map(t=>`<span>${esc(t)}</span>`).join("")}</div><a class="btn glow" href="${m.url}" target="_blank" rel="noopener noreferrer">OPEN ${esc(m.name.toUpperCase())} ↗</a></div>`;
}
function setCat(c,scroll=true){
  state.cat=c;
  $$("#pills .pill").forEach(p=>{const on=p.dataset.cat===c;p.classList.toggle("on",on);p.setAttribute("aria-pressed",on)});
  renderCards();
  if(scroll)$("#models").scrollIntoView({behavior:reduce?"auto":"smooth"});
}
function recommend(k){
  $$("#intents .pill").forEach(p=>p.classList.toggle("on",p.dataset.intent===k));
  $("#recs").innerHTML=`<p class="rec-h">Options for “${k}” — based on each platform's documented capabilities:</p>`+INTENTS[k].map((id,i)=>{const m=byId(id);
    return `<a class="rec" style="--i:${i}" href="${m.url}" target="_blank" rel="noopener noreferrer"><b>${esc(m.name)}</b><small>${esc(m.co)} · ${esc(m.label)}</small><span>OPEN ↗</span></a>`}).join("");
}

/* ---------- interactions ---------- */
function bindCards(){
  if(!fine||reduce)return;
  $$("[data-tilt]").forEach(c=>{
    c.onpointermove=e=>{const r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;
      c.style.setProperty("--mx",x*100+"%");c.style.setProperty("--my",y*100+"%");
      c.style.transform=`perspective(900px) rotateX(${(.5-y)*7}deg) rotateY(${(x-.5)*9}deg) translateY(-6px) scale(1.015)`};
    c.onpointerleave=()=>c.style.transform="";
  });
}
function initReveal(){
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");if(e.target.classList.contains("stats"))counters();io.unobserve(e.target)}}),{threshold:.12});
  $$(".reveal").forEach(el=>io.observe(el));
}
function counters(){
  $$("[data-to]").forEach(el=>{const to=+el.dataset.to,suf=el.dataset.suffix||"",t0=performance.now();
    const step=t=>{const p=Math.min((t-t0)/1400,1);el.textContent=Math.round(to*(1-Math.pow(1-p,3)))+(p===1?suf:"");if(p<1)requestAnimationFrame(step)};
    reduce?el.textContent=to+suf:requestAnimationFrame(step)});
}
function initBackground(){
  if(reduce)return;
  $("#particles").innerHTML=Array.from({length:innerWidth<700?14:32},()=>`<i style="left:${Math.random()*100}%;top:${100+Math.random()*20}%;animation-duration:${14+Math.random()*22}s;animation-delay:-${Math.random()*30}s;opacity:${.2+Math.random()*.5}"></i>`).join("");
  const hero=$(".hero-in");
  addEventListener("scroll",()=>{const y=scrollY;if(y<innerHeight*1.2){hero.style.transform=`translateY(${y*.25}px)`;hero.style.opacity=1-y/(innerHeight*.9)}},{passive:true});
}
function initCursor(){
  if(!fine)return;const g=$(".cursor-glow");
  addEventListener("pointermove",e=>{g.style.opacity=1;g.style.transform=`translate(${e.clientX}px,${e.clientY}px)`});
  document.addEventListener("pointerleave",()=>g.style.opacity=0);
}

/* ---------- command palette ---------- */
const pal={el:$("#palette"),input:$("#palInput"),list:$("#palList"),items:[],sel:0};
const COMMANDS=[
  ...["chatgpt","claude","gemini","perplexity"].map(id=>({label:"Open "+byId(id).name,hint:"↗ official site",run:()=>window.open(byId(id).url,"_blank","noopener,noreferrer")})),
  {label:"Filter Coding AI",hint:"filter",run:()=>setCat("coding")},{label:"Filter Research AI",hint:"filter",run:()=>setCat("research")},{label:"Filter Open Source AI",hint:"filter",run:()=>setCat("open")},{label:"Show all AI",hint:"filter",run:()=>setCat("all")},
  ...MODELS.filter(m=>!["chatgpt","claude","gemini","perplexity"].includes(m.id)).map(m=>({label:"Open "+m.name,hint:"↗ "+m.co,run:()=>window.open(m.url,"_blank","noopener,noreferrer")}))
];
function palRender(){
  const q=pal.input.value.trim().toLowerCase();
  pal.items=COMMANDS.filter(c=>!q||c.label.toLowerCase().includes(q)||c.hint.toLowerCase().includes(q));
  const extra=q?MODELS.filter(m=>!COMMANDS.some(c=>c.label==="Open "+m.name)===false&&[m.name,m.co,m.desc,...m.tags].join(" ").toLowerCase().includes(q)&&!pal.items.some(c=>c.label==="Open "+m.name)):[];
  extra.forEach(m=>pal.items.push({label:"Open "+m.name,hint:"↗ "+m.co,run:()=>window.open(m.url,"_blank","noopener,noreferrer")}));
  if(q)pal.items.push({label:`Search directory for “${pal.input.value.trim()}”`,hint:"search",run:()=>{$("#search").value=pal.input.value.trim();state.q=$("#search").value;renderCards();$("#models").scrollIntoView()}});
  pal.sel=Math.min(pal.sel,pal.items.length-1);if(pal.sel<0)pal.sel=0;
  pal.list.innerHTML=pal.items.map((c,i)=>`<li role="option" data-i="${i}" class="${i===pal.sel?"sel":""}"><span>${esc(c.label)}</span><small>${esc(c.hint)}</small></li>`).join("");
}
function palOpen(){pal.el.hidden=false;pal.input.value="";pal.sel=0;palRender();pal.input.focus();document.body.style.overflow="hidden"}
function palClose(){pal.el.hidden=true;document.body.style.overflow=""}
function palRun(i){const c=pal.items[i];if(!c)return;palClose();c.run()}

/* ---------- wiring ---------- */
function init(){
  renderStatic();initReveal();initBackground();initCursor();
  $("#search").addEventListener("input",e=>{state.q=e.target.value;renderCards()});
  $("#sort").addEventListener("change",e=>{state.sort=e.target.value;renderCards()});
  document.addEventListener("click",e=>{
    const p=e.target.closest("[data-cat]");if(p)setCat(p.dataset.cat);
    const i=e.target.closest("[data-intent]");if(i)recommend(i.dataset.intent);
    if(e.target.closest("[data-open-palette]"))palOpen();
    if(e.target.closest("#navlinks a")){$("#navlinks").classList.remove("open");$("#burger").setAttribute("aria-expanded","false")}
  });
  $("#burger").addEventListener("click",()=>{const o=$("#navlinks").classList.toggle("open");$("#burger").setAttribute("aria-expanded",o)});
  const nav=$("#nav"),onScroll=()=>nav.classList.toggle("scrolled",scrollY>40);onScroll();addEventListener("scroll",onScroll,{passive:true});
  document.addEventListener("keydown",e=>{
    if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==="k"){e.preventDefault();pal.el.hidden?palOpen():palClose();return}
    if(pal.el.hidden)return;
    if(e.key==="Escape")palClose();
    else if(e.key==="ArrowDown"||e.key==="ArrowUp"){e.preventDefault();pal.sel=(pal.sel+(e.key==="ArrowDown"?1:-1)+pal.items.length)%pal.items.length;palRender();$(".sel",pal.list)?.scrollIntoView({block:"nearest"})}
    else if(e.key==="Enter"){e.preventDefault();palRun(pal.sel)}
  });
  pal.input.addEventListener("input",()=>{pal.sel=0;palRender()});
  pal.list.addEventListener("click",e=>{const li=e.target.closest("li");if(li)palRun(+li.dataset.i)});
  pal.el.addEventListener("click",e=>{if(e.target===pal.el)palClose()});
}
init();
