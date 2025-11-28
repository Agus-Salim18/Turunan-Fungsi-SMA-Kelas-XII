// script.js - simple single-page logic for the ITS Turunan Fungsi
// Data: questions and materi are embedded for offline use

const pretestQuestions = [
  {
    id: 1,
    q: "Turunan dari f(x) = x^3 adalah...",
    choices: ["3x^2", "x^2", "3x^3", "2x"],
    answer: 0
  },
  {
    id: 2,
    q: "Turunan dari f(x) = 5x adalah...",
    choices: ["5", "x", "0", "1"],
    answer: 0
  },
  {
    id: 3,
    q: "Turunan dari f(x) = sin(x) adalah...",
    choices: ["cos(x)", "-cos(x)", "sin(x)", "-sin(x)"],
    answer: 0
  },
  {
    id: 4,
    q: "Turunan dari f(x) = e^x adalah...",
    choices: ["e^x", "x e^{x-1}", "e^{x-1}", "1"],
    answer: 0
  },
  {
    id: 5,
    q: "Turunan dari f(x) = x^2 + 3x adalah...",
    choices: ["2x + 3", "x^2 + 3", "2x", "3x^2 + 3"],
    answer: 0
  }
];

const posttestQuestions = [
  {
    id: 1,
    q: "Turunan dari f(x) = (3x^2 + 2x) adalah...",
    choices: ["6x + 2", "3x + 2", "6x^2 + 2", "3x^2 + 2x"],
    answer: 0
  },
  {
    id: 2,
    q: "Jika f(x) = ln(x), maka f'(x) = ...",
    choices: ["1/x", "x", "ln(x)", "e^x"],
    answer: 0
  },
  {
    id: 3,
    q: "Turunan dari f(x) = 7 adalah...",
    choices: ["0", "7", "1", "7x"],
    answer: 0
  },
  {
    id: 4,
    q: "Jika f(x) = x^4, f'(x) = ...",
    choices: ["4x^3", "x^3", "4x^4", "x^4"],
    answer: 0
  },
  {
    id: 5,
    q: "Turunan dari f(x) = cos(x) adalah...",
    choices: ["-sin(x)", "sin(x)", "cos(x)", "-cos(x)"],
    answer: 0
  }
];

const materiContent = `
<h3 class="section-title">Materi: Aturan-aturan Turunan</h3>
<div class="card">
  <h4>1. Aturan pangkat</h4>
  <p>Jika f(x) = x^n, maka f'(x) = n x^{n-1}.</p>
  <p>Contoh: (x^3)' = 3x^2</p>
</div>

<div class="card">
  <h4>2. Aturan konstanta</h4>
  <p>Jika f(x) = c (konstanta), maka f'(x) = 0.</p>
</div>

<div class="card">
  <h4>3. Aturan konstanta kali fungsi</h4>
  <p>(c * f(x))' = c * f'(x)</p>
</div>

<div class="card">
  <h4>4. Aturan jumlah</h4>
  <p>(f + g)' = f' + g'</p>
</div>

<div class="card">
  <h4>5. Turunan fungsi trigonometrik dasar</h4>
  <ul>
    <li>(sin x)' = cos x</li>
    <li>(cos x)' = -sin x</li>
  </ul>
</div>

<div class="card">
  <h4>Contoh soal singkat</h4>
  <p>Hitung turunan dari f(x) = 2x^3 - 5x + 7.</p>
  <p>Jawab: f'(x) = 6x^2 - 5</p>
</div>
`;

// Utility: show a section and populate if empty
function showSection(id){
  const sections = document.querySelectorAll('.content-section');
  sections.forEach(s => s.classList.remove('active'));
  const sec = document.getElementById(id);
  if(!sec) return;
  sec.classList.add('active');

  if(id === 'pretest' && sec.innerHTML.trim() === ''){
    renderQuiz(sec, pretestQuestions, { title: 'Pre-Test', storageKey: 'pretest' });
  } else if(id === 'materi' && sec.innerHTML.trim() === ''){
    sec.innerHTML = materiContent;
  } else if(id === 'posttest' && sec.innerHTML.trim() === ''){
    renderQuiz(sec, posttestQuestions, { title: 'Post-Test', storageKey: 'posttest' });
  } else if(id === 'evaluasi' && sec.innerHTML.trim() === ''){
    renderEvaluation(sec);
  }
}

// Render quiz in a given container
function renderQuiz(container, questions, opts = {}){
  const { title = 'Quiz', storageKey = null } = opts;
  container.innerHTML = `<h3 class="section-title">${title}</h3>`;
  const form = document.createElement('div');

  questions.forEach((q, idx) => {
    const qDiv = document.createElement('div');
    qDiv.className = 'question';
    qDiv.innerHTML = `<strong>${idx + 1}. ${q.q}</strong>`;
    const answersDiv = document.createElement('div');
    answersDiv.className = 'answers';

    q.choices.forEach((choice, cidx) => {
      const id = `q${q.id}_c${cidx}_${storageKey || 'tmp'}`;
      const label = document.createElement('label');
      label.innerHTML = `<input type="radio" name="q${q.id}" value="${cidx}" id="${id}"> <span>${choice}</span>`;
      answersDiv.appendChild(label);
    });

    qDiv.appendChild(answersDiv);
    form.appendChild(qDiv);
  });

  const actions = document.createElement('div');
  actions.className = 'actions';
  const submitBtn = document.createElement('button');
  submitBtn.className = 'btn';
  submitBtn.textContent = 'Kirim Jawaban';
  submitBtn.onclick = () => {
    const answers = {};
    questions.forEach(q => {
      const ele = form.querySelector(`input[name="q${q.id}"]:checked`);
      answers[q.id] = ele ? Number(ele.value) : null;
    });
    const result = grade(questions, answers);
    showResult(container, result);
    if(storageKey) {
      saveAttempt(storageKey, { questionsCount: questions.length, correct: result.correct, timestamp: new Date().toISOString() });
    }
  };

  const resetBtn = document.createElement('button');
  resetBtn.className = 'btn secondary';
  resetBtn.textContent = 'Reset';
  resetBtn.onclick = () => {
    form.querySelectorAll('input[type="radio"]').forEach(i => i.checked = false);
    container.querySelectorAll('.result').forEach(r => r.remove());
  };

  actions.appendChild(submitBtn);
  actions.appendChild(resetBtn);

  container.appendChild(form);
  container.appendChild(actions);

  // If there's a saved attempt, show a brief note
  if(storageKey){
    const prev = getSavedAttempt(storageKey);
    if(prev){
      const note = document.createElement('div');
      note.className = 'card';
      note.innerHTML = `<strong>Catatan:</strong> Terdapat hasil sebelumnya. Skor terakhir: ${prev.correct}/${prev.questionsCount} (${new Date(prev.timestamp).toLocaleString()})`;
      container.insertBefore(note, form);
    }
  }
}

// Grade function returns stats and per-question feedback
function grade(questions, answers){
  let correct = 0;
  const per = questions.map(q => {
    const sel = answers[q.id];
    const ok = sel === q.answer;
    if(ok) correct++;
    return { id: q.id, selected: sel, correct: q.answer, ok };
  });
  return { correct, total: questions.length, per };
}

function showResult(container, result){
  // Remove old result
  container.querySelectorAll('.result').forEach(r => r.remove());
  const ratio = result.correct / result.total;
  const resDiv = document.createElement('div');
  let cls = 'result ';
  if(ratio >= 0.8) cls += 'success';
  else if(ratio >= 0.5) cls += 'warn';
  else cls += 'fail';

  resDiv.className = cls;
  resDiv.innerHTML = `<strong>Hasil:</strong> ${result.correct} dari ${result.total} benar.`;
  // optionally list incorrects
  const wrongs = result.per.filter(p => !p.ok);
  if(wrongs.length){
    const ul = document.createElement('ul');
    wrongs.forEach(w => {
      ul.innerHTML += `<li>Soal ${w.id}: jawaban benar = pilihan ke-${w.correct + 1}</li>`;
    });
    resDiv.appendChild(ul);
  } else {
    resDiv.innerHTML += `<p>Semua benar. Bagus!</p>`;
  }
  container.appendChild(resDiv);
}

// Simple localStorage save/load
function saveAttempt(key, payload){
  try {
    const store = JSON.parse(localStorage.getItem('its_attempts') || '{}');
    store[key] = payload;
    localStorage.setItem('its_attempts', JSON.stringify(store));
  } catch (e) {
    console.warn('Tidak bisa menyimpan ke localStorage', e);
  }
}

function getSavedAttempt(key){
  try {
    const store = JSON.parse(localStorage.getItem('its_attempts') || '{}');
    return store[key] || null;
  } catch (e) {
    return null;
  }
}

function renderEvaluation(container){
  container.innerHTML = `<h3 class="section-title">Penilaian</h3>`;
  const attempts = JSON.parse(localStorage.getItem('its_attempts') || '{}');
  if(!attempts || Object.keys(attempts).length === 0){
    container.innerHTML += `<div class="card">Belum ada penilaian. Lakukan Pre-Test dan Post-Test terlebih dahulu.</div>`;
    return;
  }
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `<h4>Ringkasan Hasil</h4>`;
  const list = document.createElement('ul');
  Object.entries(attempts).forEach(([k,v]) => {
    list.innerHTML += `<li><strong>${k}</strong> — ${v.correct}/${v.questionsCount} (terakhir: ${new Date(v.timestamp).toLocaleString()})</li>`;
  });
  card.appendChild(list);

  // Compute simple improvement if both pretest & posttest exist
  if(attempts.pretest && attempts.posttest){
    const pre = attempts.pretest.correct / attempts.pretest.questionsCount;
    const post = attempts.posttest.correct / attempts.posttest.questionsCount;
    const diff = Math.round((post - pre) * 100);
    const note = document.createElement('div');
    note.style.marginTop = '10px';
    if(diff > 0){
      note.className = 'result success';
      note.innerHTML = `<strong>Peningkatan:</strong> skor naik ${diff} poin persentase (Pre → Post).`;
    } else if(diff === 0){
      note.className = 'result warn';
      note.innerHTML = `<strong>Performa:</strong> tidak ada perubahan antara Pre dan Post test.`;
    } else {
      note.className = 'result fail';
      note.innerHTML = `<strong>Penurunan:</strong> skor turun ${Math.abs(diff)} poin persentase (Pre → Post).`;
    }
    card.appendChild(note);
  }

  container.appendChild(card);
}

// Initial load: show pretest
window.addEventListener('DOMContentLoaded', () => {
  showSection('pretest');
});
