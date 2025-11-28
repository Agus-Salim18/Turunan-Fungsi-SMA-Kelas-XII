let currentSection = "pretest";
let pretestScore = 0;
let posttestScore = 0;

function showSection(id) {
  document.querySelectorAll(".content-section").forEach(s => s.style.display = "none");
  document.getElementById(id).style.display = "block";
}

async function loadJSON(file) {
  const response = await fetch(file);
  return await response.json();
}

async function loadPretest() {
  const data = await loadJSON("data/pretest.json");
  const container = document.getElementById("pretest");
  container.innerHTML = "<h3>Pre-Test</h3>";
  data.questions.forEach((q, i) => {
    const div = document.createElement("div");
    div.className = "question";
    div.innerHTML = `<b>${i+1}. ${q.question}</b><br>`;
    q.options.forEach(opt => {
      div.innerHTML += `<label><input type='radio' name='pre${i}' value='${opt}'> ${opt}</label><br>`;
    });
    container.appendChild(div);
  });
  container.innerHTML += "<button onclick='submitPretest()'>Kirim Jawaban</button>";
}

function submitPretest() {
  loadJSON("data/pretest.json").then(data => {
    pretestScore = 0;
    data.questions.forEach((q, i) => {
      const selected = document.querySelector(`input[name='pre${i}']:checked`);
      if (selected && selected.value === q.answer) pretestScore++;
    });
    alert(`Skor Pre-Test kamu: ${pretestScore}/${data.questions.length}`);
  });
}

async function loadMateri() {
  const data = await loadJSON("data/materi.json");
  const container = document.getElementById("materi");
  container.innerHTML = `<h3>${data.title}</h3><p>${data.content}</p><h4>Contoh Soal:</h4>`;
  data.examples.forEach((e, i) => {
    container.innerHTML += `<p><b>${i+1}.</b> ${e.soal}<br><i>Penyelesaian:</i> ${e.jawaban}</p>`;
  });
}

async function loadPosttest() {
  const data = await loadJSON("data/posttest.json");
  const container = document.getElementById("posttest");
  container.innerHTML = "<h3>Post-Test</h3>";
  data.questions.forEach((q, i) => {
    const div = document.createElement("div");
    div.className = "question";
    div.innerHTML = `<b>${i+1}. ${q.question}</b><br>`;
    q.options.forEach(opt => {
      div.innerHTML += `<label><input type='radio' name='post${i}' value='${opt}'> ${opt}</label><br>`;
    });
    container.appendChild(div);
  });
  container.innerHTML += "<button onclick='submitPosttest()'>Kirim Jawaban</button>";
}

function submitPosttest() {
  loadJSON("data/posttest.json").then(data => {
    posttestScore = 0;
    data.questions.forEach((q, i) => {
      const selected = document.querySelector(`input[name='post${i}']:checked`);
      if (selected && selected.value === q.answer) posttestScore++;
    });
    alert(`Skor Post-Test kamu: ${posttestScore}/${data.questions.length}`);
  });
}

async function loadEvaluasi() {
  const data = await loadJSON("data/evaluasi.json");
  const container = document.getElementById("evaluasi");
  const peningkatan = posttestScore - pretestScore;
  let feedback = data.find(e => peningkatan >= e.min && peningkatan <= e.max);
  container.innerHTML = `
    <h3>Penilaian</h3>
    <p>Skor Pre-Test: ${pretestScore}</p>
    <p>Skor Post-Test: ${posttestScore}</p>
    <p><b>Umpan Balik:</b> ${feedback ? feedback.message : "Belum ada data penilaian."}</p>
  `;
}

window.onload = () => {
  loadPretest();
  loadMateri();
  loadPosttest();
  loadEvaluasi();
  showSection("pretest");
};
