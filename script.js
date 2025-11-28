/* Simple responsive styling for the ITS Turunan Fungsi project */
:root{
  --bg: #f7fbff;
  --card: #ffffff;
  --accent: #0b6efd;
  --muted: #6b7280;
  --success: #198754;
  --danger: #dc3545;
  font-size: 16px;
  font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
}

*{box-sizing:border-box}
html,body{height:100%;margin:0;background:var(--bg);color:#0f1724}
header{
  background: linear-gradient(90deg, rgba(11,110,253,0.08), rgba(3,155,128,0.04));
  padding:20px;
  text-align:center;
  border-bottom:1px solid rgba(15,23,36,0.06);
}
header h1{margin:0;font-size:1.4rem}
header h2{margin:4px 0 0;color:var(--muted);font-weight:500;font-size:1rem}

nav{
  display:flex;
  gap:8px;
  padding:12px;
  justify-content:center;
  flex-wrap:wrap;
  background:transparent;
}
nav button{
  background:var(--card);
  border:1px solid rgba(15,23,36,0.06);
  padding:8px 12px;
  border-radius:8px;
  cursor:pointer;
  transition:transform .12s ease, box-shadow .12s;
}
nav button:hover{transform:translateY(-2px);box-shadow:0 4px 10px rgba(2,6,23,0.06)}

main{
  max-width:900px;
  margin:20px auto;
  padding:16px;
}
.content-section{
  display:none;
  background:var(--card);
  padding:18px;
  border-radius:10px;
  box-shadow:0 6px 18px rgba(2,6,23,0.04);
  min-height:220px;
}

/* Visible section */
.content-section.active{display:block}

/* Card like elements inside */
.card{padding:12px;border-radius:8px;background:#fff;border:1px solid rgba(2,6,23,0.03);margin-bottom:12px}
h3.section-title{margin:0 0 10px}

/* Quiz styles */
.question{padding:10px;border-radius:8px;border:1px dashed rgba(15,23,36,0.04);margin-bottom:10px}
.answers{display:flex;flex-direction:column;gap:8px;margin-top:8px}
.answers label{display:flex;align-items:center;gap:8px;cursor:pointer;background:rgba(11,110,253,0.03);padding:8px;border-radius:6px;border:1px solid rgba(11,110,253,0.06)}
.answers input[type="radio"]{accent-color:var(--accent)}
.actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}

.btn{
  padding:8px 12px;border-radius:8px;border:none;cursor:pointer;background:var(--accent);color:#fff
}
.btn.secondary{background:#6b7280}
.result{padding:12px;border-radius:8px;margin-top:12px}
.result.success{background:rgba(25,135,84,0.08);border:1px solid rgba(25,135,84,0.12);color:var(--success)}
.result.warn{background:rgba(255,193,7,0.06);border:1px solid rgba(255,193,7,0.12);color:#b45309}
.result.fail{background:rgba(220,53,69,0.06);border:1px solid rgba(220,53,69,0.12);color:var(--danger)}

footer{text-align:center;padding:16px;color:var(--muted);font-size:0.9rem}

/* Responsive */
@media (max-width:600px){
  header h1{font-size:1.1rem}
  main{padding:12px}
  nav{padding:8px}
}
