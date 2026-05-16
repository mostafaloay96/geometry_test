/**
 * geo-core.js
 * مكتبة مشتركة لجميع أقسام اختبار الحساسية للهندسة
 * Shared utilities: progress bar, timer, score saving, finish screen
 */

// ══════════════════════════════════════
// بيانات الأقسام
// ══════════════════════════════════════
var GEO_SECTIONS = [
  { key: 'practice',  label: 'تدريبي',    total: 2,  index: 1, next: 'topology.html'   },
  { key: 'topology',  label: 'طوبولوجيا', total: 4,  index: 2, next: 'euclidean.html'  },
  { key: 'euclidean', label: 'إقليدية',   total: 8,  index: 3, next: 'geometric.html'  },
  { key: 'geometric', label: 'أشكال',     total: 8,  index: 4, next: 'symmetry.html'   },
  { key: 'symmetry',  label: 'تماثل',     total: 8,  index: 5, next: 'metric.html'     },
  { key: 'metric',    label: 'مترية',     total: 8,  index: 6, next: 'transform.html'  },
  { key: 'transform', label: 'تحويلات',   total: 8,  index: 7, next: 'results.html'    }
];

// ══════════════════════════════════════
// المؤقت الزمني
// ══════════════════════════════════════
var _geoTimerStart    = null;
var _geoTimerInterval = null;

function geoStartTimer() {
  _geoTimerStart = Date.now();
  _geoTimerInterval = setInterval(function () {
    var el = document.getElementById('geo-timer');
    if (!el) return;
    var s = Math.floor((Date.now() - _geoTimerStart) / 1000);
    var m = Math.floor(s / 60); s = s % 60;
    el.textContent = (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s);
  }, 1000);
}

function geoStopTimer() {
  if (_geoTimerInterval) clearInterval(_geoTimerInterval);
  return _geoTimerStart ? Date.now() - _geoTimerStart : 0;
}

// ══════════════════════════════════════
// حفظ الدرجات في localStorage
// ══════════════════════════════════════
function geoSaveScore(sectionKey, score, total) {
  var elapsed = geoStopTimer();
  var all = JSON.parse(localStorage.getItem('geoScores') || '{}');
  all[sectionKey] = { score: score, total: total, time: elapsed };
  localStorage.setItem('geoScores', JSON.stringify(all));

  var done = JSON.parse(localStorage.getItem('geoDone') || '[]');
  if (done.indexOf(sectionKey) === -1) done.push(sectionKey);
  localStorage.setItem('geoDone', JSON.stringify(done));
}

// ══════════════════════════════════════
// شريط التقدم العام (بين الأقسام)
// ══════════════════════════════════════
function geoRenderProgress(currentKey) {
  var bar = document.getElementById('geo-progress-bar');
  if (!bar) return;
  var done = JSON.parse(localStorage.getItem('geoDone') || '[]');
  var html = '<div class="gpbar-inner">';
  GEO_SECTIONS.forEach(function (s, i) {
    var isDone    = done.indexOf(s.key) !== -1;
    var isCurrent = s.key === currentKey;
    var cls = 'gpbar-step' + (isCurrent ? ' gpbar-active' : isDone ? ' gpbar-done' : '');
    html += '<div class="' + cls + '">'
          + '<div class="gpbar-dot">' + (isDone ? '✓' : s.index) + '</div>'
          + '<div class="gpbar-label">' + s.label + '</div>'
          + '</div>';
    if (i < GEO_SECTIONS.length - 1)
      html += '<div class="gpbar-line' + (isDone ? ' gpbar-line-done' : '') + '"></div>';
  });
  html += '</div>';
  bar.innerHTML = html;
}

// ══════════════════════════════════════
// تحسين شاشة الإنهاء (الدرجة + التنقل)
// ══════════════════════════════════════
function geoEnhanceFinish(sectionKey, score, total) {
  geoSaveScore(sectionKey, score, total);

  // إيجاد القسم التالي
  var nextFile = null;
  for (var i = 0; i < GEO_SECTIONS.length; i++) {
    if (GEO_SECTIONS[i].key === sectionKey) { nextFile = GEO_SECTIONS[i].next; break; }
  }

  var pct    = total > 0 ? Math.round(score / total * 100) : 0;
  var screen = document.getElementById('finishScreen');
  if (!screen) return;

  // حساب الوقت
  var elapsed = JSON.parse(localStorage.getItem('geoScores') || '{}')[sectionKey];
  var timeMs  = elapsed ? elapsed.time : 0;
  var ts = Math.floor(timeMs / 1000);
  var tm = Math.floor(ts / 60); ts = ts % 60;
  var timeStr = (tm > 0 ? tm + ' د ' : '') + ts + ' ث';

  // لون بناءً على النسبة
  var color  = pct >= 75 ? '#2e7d32' : pct >= 50 ? '#e65100' : '#c62828';
  var bgColor = pct >= 75 ? '#e8f5e9' : pct >= 50 ? '#fff3e0' : '#ffebee';

  // عنصر الدرجة
  var scoreEl = document.createElement('div');
  scoreEl.className = 'finish-score';
  scoreEl.innerHTML =
    '<div class="fs-ring" style="border-color:' + color + ';background:' + bgColor + '">'
    + '<span class="fs-num" style="color:' + color + '">' + score + '</span>'
    + '<span class="fs-sep">/</span>'
    + '<span class="fs-total">' + total + '</span>'
    + '</div>'
    + '<div class="fs-meta">'
    + '<span class="fs-pct" style="background:' + bgColor + ';color:' + color + '">' + pct + '%</span>'
    + '<span class="fs-time"><span class="material-icons" style="font-size:14px;vertical-align:middle">timer</span> ' + timeStr + '</span>'
    + '</div>';

  var h2 = screen.querySelector('h2');
  if (h2) h2.insertAdjacentElement('afterend', scoreEl);

  // استبدال زر "العودة" بزرين
  var btnHome = screen.querySelector('.btn-home');
  if (btnHome) {
    if (nextFile) {
      var nextBtn = document.createElement('a');
      nextBtn.href = nextFile;
      nextBtn.className = 'btn-next-section';
      nextBtn.innerHTML = '<span class="material-icons" style="font-size:16px;vertical-align:middle">arrow_back</span> القسم التالي';
      btnHome.insertAdjacentElement('beforebegin', nextBtn);
    }
  }
}

// ══════════════════════════════════════
// التحقق من صلاحية الوصول للقسم
// ══════════════════════════════════════
var _GEO_ORDER = ['practice', 'topology', 'euclidean', 'geometric', 'symmetry', 'metric', 'transform'];

function geoCheckAccess(sectionKey) {
  var idx = _GEO_ORDER.indexOf(sectionKey);
  if (idx === -1) return; // قسم غير معروف — اسمح بالدخول

  var p    = JSON.parse(localStorage.getItem('geoParticipant') || 'null');
  var done = JSON.parse(localStorage.getItem('geoDone') || '[]');

  var locked = false;
  if (idx === 0) {
    // القسم التدريبي: يتطلب تعبئة بيانات المشارك
    locked = !p || !p.age;
  } else {
    // بقية الأقسام: يتطلب إتمام القسم السابق
    locked = done.indexOf(_GEO_ORDER[idx - 1]) === -1;
  }

  if (locked) {
    window.location.replace('../index.html?locked=' + encodeURIComponent(sectionKey));
  }
}

// ══════════════════════════════════════
// تهيئة تلقائية عند تحميل الصفحة
// ══════════════════════════════════════
document.addEventListener('DOMContentLoaded', function () {
  var bar = document.getElementById('geo-progress-bar');
  var sectionKey = bar ? bar.dataset.section : null;

  // ── التحقق من صلاحية الوصول أولاً ──
  if (sectionKey) geoCheckAccess(sectionKey);

  if (bar) geoRenderProgress(sectionKey);
  geoStartTimer();
});
