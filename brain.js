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
