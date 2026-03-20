// ===== DEEPSEEK ULTIMATE BRAIN (MERGED VERSION) =====

// ===== GLOBAL STATE ===== export let DEV_MODE = false;

// ===== DEV MODE TRIGGER ===== export function checkDevMode(text){ if(text.includes("•Dev✓")){ DEV_MODE = true; return true; } return false; }

// ===== CONTEXT MEMORY ===== export function buildContext(messages){ return messages.slice(-12).map(m => m.role + ": " + m.text).join("\n"); }

// ===== MULTI SEARCH ENGINE ===== export async function multiSearch(query){ let results = [];

try{ // DuckDuckGo let d = await fetch(https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1); let dj = await d.json();

if(dj.Abstract) results.push(dj.Abstract);

if(dj.RelatedTopics){
  dj.RelatedTopics.slice(0,6).forEach(i=>{
    if(i.Text) results.push(i.Text);
  });
}

// Wikipedia fallback
let w = await fetch(`https://id.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`);
let wj = await w.json();

if(wj.extract) results.push(wj.extract);

return rank(results);

}catch{ return "Gagal mengambil data"; } }

// ===== RANKING SYSTEM ===== function rank(list){ return list .filter(x => x && x.length > 30) .sort((a,b)=> b.length - a.length) .slice(0,5) .join("\n\n"); }

// ===== WEB READER ===== export async function readWeb(url){ try{ let proxy = https://api.allorigins.win/raw?url=${encodeURIComponent(url)}; let res = await fetch(proxy); let html = await res.text();

let clean = html.replace(/<[^>]*>/g,"");
return clean.slice(0,1000);

}catch{ return "Gagal membaca halaman web"; } }

// ===== REASONING ENGINE ===== export function reasoning(context, data, question){ return ` [CONTEXT] ${context}

[DATA] ${data}

[PERTANYAAN] ${question}

[TUGAS] Analisa semua informasi dan berikan jawaban paling akurat. `; }

// ===== SYSTEM PROMPT ===== export function systemPrompt(){ if(DEV_MODE){ return ` Kamu adalah AI Developer Mode.

Gunakan reasoning mendalam

Evaluasi semua kemungkinan

Fokus ke akurasi tinggi

Jawaban boleh kompleks dan teknis

Jangan halusinasi `; }

return Kamu adalah AI normal. Jawab dengan jelas, akurat, dan mudah dipahami.; }


// ===== SMART PROCESSOR ===== export async function processInput(text){ if(text.startsWith("http")){ return await readWeb(text); }

return await multiSearch(text); }

// ===== FINAL AI PIPELINE ===== export async function runAI({text, messages, apiKey}){ if(checkDevMode(text)){ return "[DEV MODE AKTIF]"; }

let context = buildContext(messages); let data = await processInput(text); let prompt = reasoning(context, data, text);

if(!apiKey){ return data; }

try{ let res = await fetch("https://openrouter.ai/api/v1/chat/completions",{ method:"POST", headers:{ "Content-Type":"application/json", "Authorization":"Bearer " + apiKey }, body: JSON.stringify({ model: "openai/gpt-3.5-turbo", messages:[ {role:"system", content: systemPrompt()}, {role:"user", content: prompt} ] }) });

let dataRes = await res.json();
return
