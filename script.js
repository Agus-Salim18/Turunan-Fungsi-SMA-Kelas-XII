// Versi yang lebih toleran terhadap variasi struktur JSON dan memperbaiki path submit
let pretestScore = 0;
let posttestScore = 0;
let pretestCount = 0;
let posttestCount = 0;
let wrongAnswers = [];

let preQuestions = [];
let postQuestions = [];

const PRE_PATH = "data/pretest.json";
const POST_PATH = "data/posttest.json";
const MATERI_PATH = "data/materi.json";
const EVAL_PATH = "data/evaluasi.json";

function showSection(id) {
  document.querySelectorAll(".content-section").forEach(s => s.style.display = "none");
  const el = document.getElementById(id);
  if (el) el.style.display = "block";
}

async function loadJSON(file) {
  try {
    const response = await fetch(file);
    if (!response.ok) throw new Error(`Gagal memuat ${file}: ${response.status}`);
    return await response.json();
  } catch (err) {
    console.error(err);
    return null;
  }
}

function normalizeQuestionItem(q) {
  // normalisasi beberapa variasi nama properti dari JSON yang ada di repo
  return {
    question: q.question || q.pertanyaan || q.soal || "",
    options: q.options || q.opsi || q.ops || [],
    answer: q.answer || q.jawaban || q.jawabanBenar || "",
    pembahasan: q.pembahasan || q.pembahasanJawaban || ""
  };
}

function getQuestionsFromData(data) {
  if (!data) return [];
  if (Array.isArray(data)) {
    return data.map(normalizeQuestionItem);
  }
  if (data.questions) return data.questions.map(normalizeQuestionItem);
  if (data.pretest) return data.pretest.map(normalizeQuestionItem);
  if (data.posttest) return data.posttest.map(normalizeQuestionItem);
  return [];
}

// PRETEST
async function loadPretest() {
  const data = await loadJSON(PRE_PATH);
  const container = document.getElementById("pretest.json");
  preQuestions = getQuestionsFromData(data);
  pretestCount = preQuestions.length;
  container.innerHTML = "<h3>Pre-Test</h3>";

  preQuestions.forEach((q, i) => {
    const div = document.createElement("div");
    div.className = "question";
    div.innerHTML = `<b>${i + 1}. ${q.question}</b><br>`;
    q.options.forEach((opt, idx) => {
      const id = `pre-${i}-${idx}`;
      div.innerHTML += `<label for='${id}'><input id='${id}' type='radio' name='pre${i}' value='${opt}'> ${opt}</label><br>`;
    });
    container.appendChild(div);
  });

  const btn = document.createElement("button");
  btn.id = "btn-submit-pre";
  btn.textContent = "Kirim Jawaban";
  btn.addEventListener("click", submitPretest);
  container.appendChild(btn);
}

function submitPretest() {
  if (!preQuestions.length) {
    alert("Data pretest tidak ditemukan atau belum dimuat dengan benar.");
    return;
  }
  pretestScore = 0;
  preQuestions.forEach((q, i) => {
    const selected = document.querySelector(`input[name='pre${i}']:checked`);
    if (selected && q.answer && selected.value === q.answer) pretestScore++;
  });
  // Jika jawaban tidak tersedia di JSON, beri peringatan
  const missingAnswers = preQuestions.filter(q => !q.answer).length;
  if (missingAnswers) {
    alert(`Skor Pre-Test: ${pretestScore}/${preQuestions.length}\nCatatan: ${missingAnswers} soal tidak memiliki jawaban di file JSON, penilaian mungkin tidak lengkap.`);
  } else {
    alert(`Skor Pre-Test kamu: ${pretestScore}/${preQuestions.length}`);
  }
}

// MATERI
async function loadMateri() {
  const data = await loadJSON(MATERI_PATH);
  const container = document.getElementById("materi");
  if (!data) {
    container.innerHTML = "<p>Materi tidak dapat dimuat.</p>";
    return;
  }

  let html = `<h2>${data.title || "Materi"}</h2><p>${data.content || ""}</p>`;

  (data.sections || []).forEach(section => {
    html += `<div class='question'>
      <h4>${section.judul || ""}</h4>
      <p>${(section.isi || "").replace(/\n/g, "<br>")}</p>
    </div>`;
  });

  html += "<h3>Contoh Soal:</h3>";
  (data.examples || []).forEach((e, i) => {
    html += `<div class='question'>
      <b>${i + 1}. ${e.soal || ""}</b><br>
      <i>Penyelesaian:</i> ${(e.jawaban || "").replace(/\n/g, "<br>")}
    </div>`;
  });

  container.innerHTML = html;
}

// POSTTEST
async function loadPosttest() {
  const data = await loadJSON(POST_PATH);
  const container = document.getElementById("posttest");
  postQuestions = getQuestionsFromData(data);
  posttestCount = postQuestions.length;
  container.innerHTML = "<h3>Post-Test</h3>";

  postQuestions.forEach((q, i) => {
    const div = document.createElement("div");
    div.className = "question";
    div.innerHTML = `<b>${i + 1}. ${q.question}</b><br>`;
    q.options.forEach((opt, idx) => {
      const id = `post-${i}-${idx}`;
      div.innerHTML += `<label for='${id}'><input id='${id}' type='radio' name='post${i}' value='${opt}'> ${opt}</label><br>`;
    });
    container.appendChild(div);
  });

  const btn = document.createElement("button");
  btn.id = "btn-submit-post";
  btn.textContent = "Kirim Jawaban";
  btn.addEventListener("click", submitPosttest);
  container.appendChild(btn);
}

async function submitPosttest() {
  if (!postQuestions.length) {
    alert("Data posttest tidak ditemukan atau belum dimuat dengan benar.");
    return;
  }
  posttestScore = 0;
  wrongAnswers = [];

  postQuestions.forEach((q, i) => {
    const selected = document.querySelector(`input[name='post${i}']:checked`);
    if (selected && q.answer && selected.value === q.answer) {
      posttestScore++;
    } else {
      wrongAnswers.push({
        soal: q.question,
        pembahasan: q.pembahasan || "Pembahasan tidak tersedia",
        jawabanBenar: q.answer || "Tidak tersedia"
      });
    }
  });

  const prePercent = pretestCount ? (pretestScore / pretestCount) * 100 : 0;
  const postPercent = posttestCount ? (posttestScore / posttestCount) * 100 : 0;
  const peningkatan = postPercent - prePercent;

  alert(`Pre-Test: ${prePercent.toFixed(1)}%\nPost-Test: ${postPercent.toFixed(1)}%\nPeningkatan: ${peningkatan.toFixed(1)}%`);

  showSection("evaluasi");
  evaluasi(peningkatan);
}

// EVALUASI ADAPTIF
async function evaluasi(peningkatan) {
  const data = await loadJSON(EVAL_PATH);
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
    const btn = document.createElement("button");
    btn.textContent = "Ulangi Post-Test";
    btn.addEventListener("click", () => {
      loadPosttest().then(() => showSection("posttest"));
    });
    container.appendChild(btn);
  } else {
    const feedbackArr = data || [];
    const feedback = (Array.isArray(feedbackArr) ? feedbackArr : (feedbackArr.items || [])).find(e => peningkatan >= (e.min || 0) && peningkatan <= (e.max || 100));
    container.innerHTML = `
      <h3>Evaluasi Hasil Belajar</h3>
      <p>Peningkatan skor: ${peningkatan.toFixed(1)}%</p>
      <p><b>${feedback ? feedback.message : "Selamat, kamu sudah mencapai peningkatan yang baik!"}</b></p>`;
  }
}

window.addEventListener("DOMContentLoaded", () => {
  loadPretest();
  loadMateri();
  loadPosttest();
  showSection("pretest");
});

