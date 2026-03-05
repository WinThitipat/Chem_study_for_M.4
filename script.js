/* ═══════════════════════════════════════
   Chemistry M4 — Global JavaScript
   ตามหลักสูตร สสวท.
═══════════════════════════════════════ */

// ── PRELOADER ──
window.addEventListener('load', () => {
  setTimeout(() => {
    const pre = document.getElementById('preloader');
    if (pre) pre.classList.add('hide');
  }, 1500);
});

// ── SMOOTH SCROLL ──
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 130;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
      // close mobile nav
      const collapse = document.getElementById('navMenu');
      if (collapse && collapse.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getInstance(collapse);
        if (bsCollapse) bsCollapse.hide();
      }
    });
  });
});

// ── SCROLL TO TOP BUTTON ──
window.addEventListener('scroll', () => {
  const btn = document.getElementById('scrollTop');
  if (btn) btn.classList.toggle('show', window.scrollY > 400);
});

// ── ACTIVE NAV LINK on scroll (index page) ──
(function () {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link, .chapter-nav .nav-link');
  if (!sections.length || !navLinks.length) return;
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 200) current = s.id;
    });
    navLinks.forEach(l => {
      l.classList.remove('active');
      if (l.getAttribute('href') === '#' + current) l.classList.add('active');
    });
  });
})();

// ── FADE IN on scroll ──
document.addEventListener('DOMContentLoaded', () => {
  const faders = document.querySelectorAll('.fade-in');
  if (!faders.length) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('visible');
    });
  }, { threshold: 0.08 });
  faders.forEach(f => observer.observe(f));
});

// ── QUIZ CHECKER ──
function checkQuiz(quizId) {
  const quiz = document.getElementById(quizId);
  if (!quiz) return;
  const questions = quiz.querySelectorAll('.quiz-question');
  let correct = 0;
  const total = questions.length;

  questions.forEach(q => {
    const ans  = q.dataset.ans;
    const name = q.querySelector('input[type=radio]').name;
    const selected = quiz.querySelector(`input[name="${name}"]:checked`);
    const opts     = q.querySelectorAll('.quiz-opt');
    const resultEl = q.querySelector('.quiz-result');

    // reset styles
    opts.forEach(o => o.classList.remove('correct', 'wrong'));
    resultEl.className = 'quiz-result';
    resultEl.textContent = '';

    if (!selected) {
      resultEl.textContent = '⚠️ กรุณาเลือกคำตอบ';
      resultEl.classList.add('show', 'wrong-r');
      return;
    }

    // highlight options
    opts.forEach(o => {
      const v = o.querySelector('input').value;
      if (v === ans) o.classList.add('correct');
      else if (v === selected.value && v !== ans) o.classList.add('wrong');
    });

    if (selected.value === ans) {
      correct++;
      resultEl.textContent = '✅ ถูกต้อง!';
      resultEl.classList.add('show', 'correct-r');
    } else {
      const correctOpt  = q.querySelector(`input[value="${ans}"]`).closest('.quiz-opt');
      const correctText = correctOpt.textContent.trim();
      resultEl.textContent = `❌ ผิด — คำตอบที่ถูก: ${correctText}`;
      resultEl.classList.add('show', 'wrong-r');
    }
  });

  // show score
  const scoreEl = quiz.querySelector('[id^="score"]');
  if (!scoreEl) return;
  const pct = Math.round((correct / total) * 100);
  let msg = '';
  if (pct === 100) msg = '🏆 ยอดเยี่ยม! เต็ม 100%';
  else if (pct >= 75) msg = '👍 ผ่านได้สบาย!';
  else if (pct >= 50) msg = '📖 พอใช้ได้ ลองทบทวนอีกครั้ง';
  else                msg = '💪 ยังไม่ผ่าน ลองอ่านใหม่นะ';
  scoreEl.textContent = `คะแนน: ${correct}/${total} (${pct}%) — ${msg}`;
  scoreEl.classList.add('show');
}