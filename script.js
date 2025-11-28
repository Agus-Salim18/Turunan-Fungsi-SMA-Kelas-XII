let pretestScore = 0;
let posttestScore = 0;
let pretestCount = 0;
let posttestCount = 0;
let wrongAnswers = [];

// Tampilkan section
function showSection(id) {
  document.querySelectorAll(".content-section").forEach(s => s.style.display = "none");
  document.getElementById(id).style.display = "block";
}

// Ambil file JSON
async function loadJSON(file) {
  const response = await fetch(file);
  return await response.json();
}

// PRE-TEST
async function loadPretest() {
  const data = await loadJSON("pretest.json");
  const container = document.getElementById("pretest");
  pretestCount = data.questions.length;
  container.innerHTML = "<h3>Pre-Test</h3>";

  data.questions.forEach((q, i) => {
    const div = document.createElement("div");
    div.className = "question";
    div.innerHTML = `<b>${i + 1}. ${q.question}</b><br>`;
    q.options.forEach(opt => {
      div.innerHTML += `<label><input type='radio' name='pre${i}' value='${opt}'> ${opt}</label><br>`;
    });
    container.appendChild(div);
  });
  container.innerHTML += "<button onclick='submitPretest()'>Kirim Jawaban</button>";
}

function submitPretest() {
  loadJSON("pretest.json").then(data => {
    pretestScore = 0;
    data.questions.forEach((q, i) => {
      const selected = document.querySelector(`input[name='pre${i}']:checked`);
      if (selected && selected.value === q.answer) pretestScore++;
    });
    alert(`Skor Pre-Test kamu: ${pretestScore}/${data.questions.length}`);
  });
}

// MATERI
async function loadMateri() {
  const data = await loadJSON("materi.json");
  const container = document.getElementById("materi");

  let html = `<h2>${data.title}</h2><p>${data.content}</p>`;

  data.sections.forEach(section => {
    html += `<div class='question'>
      <h4>${section.judul}</h4>
      <p>${section.isi.replace(/\n/g, "<br>")}</p>
    </div>`;
  });

  html += "<h3>Contoh Soal:</h3>";
  data.examples.forEach((e, i) => {
    html += `<div class='question'>
      <b>${i + 1}. ${e.soal}</b><br>
      <i>Penyelesaian:</i> ${e.jawaban.replace(/\n/g, "<br>")}
    </div>`;
  });

  container.innerHTML = html;
}


// POST-TEST
async function loadPosttest() {
  const data = await loadJSON("posttest.json");
  const container = document.getElementById("posttest");
  posttestCount = data.questions.length;
  container.innerHTML = "<h3>Post-Test</h3>";

  data.questions.forEach((q, i) => {
    const div = document.createElement("div");
    div.className = "question";
    div.innerHTML = `<b>${i + 1}. ${q.question}</b><br>`;
    q.options.forEach(opt => {
      div.innerHTML += `<label><input type='radio' name='post${i}' value='${opt}'> ${opt}</label><br>`;
    });
    container.appendChild(div);
  });
  container.innerHTML += "<button onclick='submitPosttest()'>Kirim Jawaban</button>";
}

async function submitPosttest() {
  const data = await loadJSON("posttest.json");
  posttestScore = 0;
  wrongAnswers = [];

  data.questions.forEach((q, i) => {
    const selected = document.querySelector(`input[name='post${i}']:checked`);
    if (selected && selected.value === q.answer) {
      posttestScore++;
    } else {
      wrongAnswers.push({
        soal: q.question,
        pembahasan: q.pembahasan,
        jawabanBenar: q.answer
      });
    }
  });

  const prePercent = (pretestScore / pretestCount) * 100;
  const postPercent = (posttestScore / posttestCount) * 100;
  const peningkatan = postPercent - prePercent;

  alert(`Pre-Test: ${prePercent.toFixed(1)}%\nPost-Test: ${postPercent.toFixed(1)}%\nPeningkatan: ${peningkatan.toFixed(1)}%`);

  showSection("evaluasi");
  evaluasi(peningkatan);
}

// EVALUASI ADAPTIF
async function evaluasi(peningkatan) {
  const data = await loadJSON("data/evaluasi.json");
  const container = document.getElementById("evaluasi");

  if (peningkatan < 10) {
    container.innerHTML = `<h3>Belum Mencapai Peningkatan 10%</h3>
    <p>Kamu perlu mempelajari kembali soal-soal berikut:</p>`;
    wrongAnswers.forEach((item, i) => {
      container.innerHTML += `
        <div class='question'>
          <b>${i + 1}. ${item.soal}</b><br>
          <i>Jawaban benar:</i> ${item.jawabanBenar}<br>
          <i>Pembahasan:</i> ${item.pembahasan}
        </div>`;
    });
    container.innerHTML += `
      <p><b>Silakan ulangi post-test setelah mempelajari pembahasan di atas.</b></p>
      <button onclick='loadPosttest(); showSection("posttest")'>Ulangi Post-Test</button>`;
  } else {
    const feedback = data.find(e => peningkatan >= e.min && peningkatan <= e.max);
    container.innerHTML = `
      <h3>Evaluasi Hasil Belajar</h3>
      <p>Peningkatan skor: ${peningkatan.toFixed(1)}%</p>
      <p><b>${feedback ? feedback.message : "Selamat, kamu sudah mencapai peningkatan yang baik!"}</b></p>`;
  }
}

// Load semua saat awal
window.onload = () => {
  loadPretest();
  loadMateri();
  loadPosttest();
  showSection("pretest");
};
