// ===== SUPER AI BRAIN MODULE =====

// Google-like search (DuckDuckGo enhanced)
export async function smartSearch(query){
let result="";

try{
let d=await fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`);
let dj=await d.json();

if(dj.Abstract){
result += "[Jawaban Utama]\n"+dj.Abstract+"\n\n";
}

if(dj.RelatedTopics){
result += "[Referensi]\n";
dj.RelatedTopics.slice(0,6).forEach(i=>{
if(i.Text) result += "• "+i.Text+"\n";
});
}

return refine(result);

}catch{
return "Gagal mengambil data";
}
}

// ranking seperti Google
function refine(data){
return data
.split("\n")
.filter(x=>x.length>25)
.slice(0,8)
.join("\n");
}

// long context memory
export function buildContext(messages){
return messages.slice(-10).map(m=>`${m.role}: ${m.text}`).join("\n");
}

// smart thinking
export function systemPrompt(){
return `
Kamu adalah AI cerdas seperti Google + ChatGPT.

Aturan:
- Prioritaskan akurasi
- Evaluasi semua data sebelum jawab
- Pilih informasi paling relevan
- Gabungkan dengan logika sendiri

Jawaban harus:
- jelas
- tidak kaku
- modern
`;
}
// ===== MULTI SEARCH ENGINE (SMART SELECT) =====
export async function multiSearch(query){
let results = [];

try{

// 1. DuckDuckGo
let d = await fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1`);
let dj = await d.json();

if(dj.Abstract){
results.push(dj.Abstract);
}

// 2. Wikipedia
let w = await fetch(`https://id.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`);
let wj = await w.json();

if(wj.extract){
results.push(wj.extract);
}

// 3. fallback text scraping
if(results.length === 0){
let html = await fetch(`https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`);
let text = await html.text();
let clean = text.replace(/<[^>]*>/g,"").slice(0,1000);
results.push(clean);
}

// ranking hasil
return rankResults(results);

}catch{
return "Gagal mengambil data";
}
}

// ===== RANKING (GOOGLE STYLE) =====
function rankResults(list){
return list
.filter(x => x && x.length > 50)
.sort((a,b)=> b.length - a.length)
.slice(0,3)
.join("\n\n");
}

// ===== REASONING ENGINE =====
export function reasoning(context, data, question){
return `
[ANALISIS]
- Context: ${context.slice(0,200)}
- Data ditemukan: ${data.slice(0,300)}

[KESIMPULAN]
Jawab pertanyaan berdasarkan data paling relevan + logika terbaik.
`;
}

// ===== CONTEXT MEMORY =====
export function buildContext(messages){
return messages.slice(-10).map(m=>`${m.role}: ${m.text}`).join("\n");
}

// ===== SYSTEM PROMPT =====
export function systemPrompt(){
return `
Kamu adalah AI pintar dengan kemampuan:
- Multi search
- Evaluasi data
- Reasoning logis

Aturan:
- Jangan asal jawab
- Pilih info paling relevan
- Gunakan logika jika data kurang

Jawaban:
- jelas
- akurat
- tidak bertele-tele
`;
  }
