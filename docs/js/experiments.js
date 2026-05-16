/**
 * experiments.js
 * منطق صفحة التجارب البحثية
 */

var demoAnswered = { 1: false, 2: false, 3: false };
var demoScore = 0;

var demoMessages = {
  1: {
    correct: "✓ صحيح! الصورة الرابعة هي الشكل المفتوح (مخمس ناقص ضلع)، بينما البقية أشكال مغلقة تماماً. هذا المجال (الطوبولوجيا) مستقر عبر الأعمار – حتى الأطفال في سن 3 سنوات يُجيدون التمييز بين الشكل المفتوح والمغلق.",
    wrong:   "✗ الإجابة الصحيحة هي الصورة الرابعة: المخمس المفتوح (polyline) مقابل المخمسات المغلقة (polygon). مجال الطوبولوجيا – كالاستمرارية والانغلاق – يُعدّ من أوائل الخصائص التي يُدركها الأطفال."
  },
  2: {
    correct: "✓ صحيح! الصورة الثالثة تختلف لأن زاويتها منفرجة (~120°)، بينما الصور الأخرى جميعها تشكّل زوايا قائمة (90°). مجال الهندسة الإقليدية يتحسن تدريجياً مع العمر – الأطفال الصغار أقل حساسية لدرجة الزاوية الدقيقة.",
    wrong:   "✗ الإجابة الصحيحة هي الصورة الثالثة: الزاوية المنفرجة (~120°) بين زوايا قائمة (90°). إدراك دقة الزوايا خاصية إقليدية تتطور تدريجياً مع النضج المعرفي."
  },
  3: {
    correct: "✓ صحيح! الصورة السادسة تختلف لأن النقطة الوسطى انزاحت يساراً، فأصبحت المسافات بين النقاط غير متساوية. هذا المجال (الخصائص المترية) هو الأكثر تطوراً مع العمر – الأطفال في 3–6 سنوات يصلون إلى ~47% فقط، بينما البالغون يصلون لـ91%.",
    wrong:   "✗ الإجابة الصحيحة هي الصورة السادسة: النقطة الوسطى منزاحة لليسار (مسافات غير متساوية). الخصائص المترية – كقياس المسافات والنسب – هي الأصعب على الأطفال الصغار وتتطور بوضوح مع العمر."
  }
};

/* ══════════════════════════════════════
   التبديل بين التجارب
══════════════════════════════════════ */
function showExp(n) {
  [2, 3].forEach(function(i) {
    document.getElementById('exp-' + i).classList.remove('active');
    document.getElementById('tab-' + i).classList.remove('active');
  });
  document.getElementById('exp-' + n).classList.add('active');
  document.getElementById('tab-' + n).classList.add('active');
}

/* ══════════════════════════════════════
   التبديل بين بنود المثال التطبيقي
══════════════════════════════════════ */
function showDemoItem(n) {
  [1, 2, 3].forEach(function(i) {
    document.getElementById('demo-item-' + i).classList.remove('active');
    document.getElementById('dtab-' + i).classList.remove('active');
  });
  document.getElementById('demo-item-' + n).classList.add('active');
  document.getElementById('dtab-' + n).classList.add('active');
}

/* ══════════════════════════════════════
   اختيار خلية في المثال التطبيقي
══════════════════════════════════════ */
function chooseDemo(cell) {
  var item = parseInt(cell.dataset.item);
  if (demoAnswered[item]) return;
  demoAnswered[item] = true;

  var isCorrect = cell.dataset.correct === 'true';
  var msg = document.getElementById('demo-result-' + item);

  if (isCorrect) {
    cell.classList.add('selected-correct');
    msg.textContent = demoMessages[item].correct;
    msg.className = 'result-msg correct';
    demoScore++;
  } else {
    cell.classList.add('selected-wrong');
    var correct = document.querySelector(
      "[data-item='" + item + "'][data-correct='true']"
    );
    if (correct) correct.classList.add('selected-correct');
    msg.textContent = demoMessages[item].wrong;
    msg.className = 'result-msg wrong';
  }

  /* إذا أجاب على البندين التاليين – ننتقل تلقائياً للتالي */
  if (!demoAnswered[item < 3 ? item + 1 : item]) {
    if (item < 3) {
      setTimeout(function() { showDemoItem(item + 1); }, 900);
    }
  }

  /* إذا أكمل البنود الثلاثة – نظهر المخطط التنموي */
  if (demoAnswered[1] && demoAnswered[2] && demoAnswered[3]) {
    setTimeout(function() {
      showDevChart();
    }, 1000);
  }
}

/* ══════════════════════════════════════
   عرض المخطط التنموي مع الأنيميشن
══════════════════════════════════════ */
function showDevChart() {
  var chart = document.getElementById('dev-chart');
  chart.classList.remove('hidden');

  /* تحريك الأشرطة إلى عرضها الصحيح */
  var bars = chart.querySelectorAll('.bar');
  bars.forEach(function(bar) {
    var pct = bar.dataset.pct;
    if (!pct) {
      /* استخراج النسبة من العنصر المجاور (bar-pct) */
      var pctEl = bar.parentElement.querySelector('.bar-pct');
      if (pctEl) pct = parseInt(pctEl.textContent);
    }
    /* تأخير صغير ليبدأ الـ transition بعد إضافة العنصر للـ DOM */
    setTimeout(function() {
      bar.style.width = pct + '%';
    }, 50);
  });

  /* عرض النتيجة */
  var scoreEl = document.getElementById('demoScoreMsg');
  var msgs = [
    'واصل المحاولة – هذه المجالات تحتاج إلى تمرين إضافي.',
    'جيد! أجبت على بند واحد بشكل صحيح.',
    'ممتاز! أجبت على بندين بشكل صحيح.',
    '🎯 رائع! أجبت على جميع البنود الثلاثة بشكل صحيح.'
  ];
  scoreEl.innerHTML =
    '<strong>نتيجتك: ' + demoScore + '/3</strong> – ' + msgs[demoScore];

  /* التمرير للمخطط */
  chart.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/* ══════════════════════════════════════
   التجربة الثالثة – الحالة والبيانات
══════════════════════════════════════ */
var exp3State = {
  pure: { answered: {1: false, 2: false, 3: false}, score: 0 },
  int:  { answered: {1: false, 2: false, 3: false}, score: 0 }
};

var exp3Messages = {
  pure: {
    1: {
      correct: '✓ صحيح! الشكل في الخلية ⑤ يختلف في الزاوية فقط (~103° مقابل ~63°). الزاوية هي أسهل الأبعاد إدراكاً – الأطفال من سن 3-4 سنوات يكتشفونها بدقة عالية.',
      wrong:   '✗ الإجابة في الخلية ⑤ – زاويتها أوسع بوضوح (~103° مقابل ~63°). بُعد الزاوية من الأسهل عبر جميع الأعمار حتى قبل دخول المدرسة.'
    },
    2: {
      correct: '✓ صحيح! الخلية ③ لها ذراع أيمن قصير جداً (~20px مقابل ~53px). بُعد الطول أصعب من الزاوية ويتطور تدريجياً مع السن.',
      wrong:   '✗ الإجابة في الخلية ③ – ذراعها الأيمن أقصر بشكل واضح. الأطفال الصغار (3-5 سنوات) يكتشفون فروق الطول بمعدل ~52% فقط.'
    },
    3: {
      correct: '✓ ممتاز! الخلية ⑥ صورة مرآة للبقية (الذراع الطويل على اليمين بدلاً من اليسار). بُعد الاتجاه/الحيرالية هو الأصعب تطورياً.',
      wrong:   '✗ الإجابة في الخلية ⑥ – هي صورة مرآة (الذراع الطويل على اليمين). هذا البُعد من أصعب المهام خاصة قبل سن 8 سنوات.'
    }
  },
  int: {
    1: {
      correct: '✓ ممتاز! رغم أن طول ذراع الخلية ④ مختلف (مشتّت)، الزاوية هي الفرق الأساسي. التداخل يصعّب المهمة بـ 10-15%.',
      wrong:   '✗ الإجابة في الخلية ④ – زاويتها مختلفة (~100°) وذراعها الأيسر أقصر (مشتّت الطول). الزاوية هي الهدف رغم المشتّت.'
    },
    2: {
      correct: '✓ أحسنت! الخلية ③ لها ذراع أقصر بوضوح (هدف الطول) رغم الزاوية المختلفة (مشتّت). الطول مع مشتّت الزاوية من أصعب المهام.',
      wrong:   '✗ الإجابة في الخلية ③ – الذراع الأيسر أقصر (هدف الطول) والزاوية مختلفة (المشتّت). هذا من أصعب أنواع بنود التداخل تطورياً.'
    },
    3: {
      correct: '✓ رائع! الخلية ② مرآة للبقية (هدف الاتجاه) مع ذراع أطول (مشتّت الطول). اكتشاف الاتجاه مع مشتّت هو الأصعب تطورياً.',
      wrong:   '✗ الإجابة في الخلية ② – هي مرآة البقية (الهدف: الاتجاه) وذراعها الأيمن أطول (المشتّت: الطول). أصعب أنواع التداخل خاصة على الأطفال.'
    }
  }
};

/* التبديل بين قسمي التجربة الثالثة */
function showPart(which) {
  ['pure', 'int'].forEach(function(p) {
    document.getElementById('part-' + p).classList.remove('active');
    document.getElementById('pbtn-' + p).classList.remove('active');
  });
  document.getElementById('part-' + which).classList.add('active');
  document.getElementById('pbtn-' + which).classList.add('active');
}

/* التبديل بين بنود كل قسم */
function showExp3Item(part, n) {
  var prefix = part === 'pure' ? 'e3pt' : 'e3it';
  [1, 2, 3].forEach(function(i) {
    var el  = document.getElementById('e3-' + part + '-' + i);
    var tab = document.getElementById(prefix + '-' + i);
    if (el)  el.classList.remove('active');
    if (tab) tab.classList.remove('active');
  });
  var showEl  = document.getElementById('e3-' + part + '-' + n);
  var showTab = document.getElementById(prefix + '-' + n);
  if (showEl)  showEl.classList.add('active');
  if (showTab) showTab.classList.add('active');
}

/* اختيار خلية في التجربة الثالثة */
function chooseExp3(cell, part, n) {
  var state = exp3State[part];
  if (state.answered[n]) return;
  state.answered[n] = true;

  var isCorrect = cell.dataset.ecorrect === 'true';
  var msg = document.getElementById('e3-' + part + '-result-' + n);

  if (isCorrect) {
    cell.classList.add('selected-correct');
    msg.textContent = exp3Messages[part][n].correct;
    msg.className = 'result-msg correct';
    state.score++;
  } else {
    cell.classList.add('selected-wrong');
    var corrCell = document.querySelector(
      '[data-ecorrect="true"][data-epart="' + part + '"][data-eitem="' + n + '"]'
    );
    if (corrCell) corrCell.classList.add('selected-correct');
    msg.textContent = exp3Messages[part][n].wrong;
    msg.className = 'result-msg wrong';
  }

  if (n < 3 && !state.answered[n + 1]) {
    setTimeout(function() { showExp3Item(part, n + 1); }, 900);
  }

  if (state.answered[1] && state.answered[2] && state.answered[3]) {
    setTimeout(function() { showExp3Chart(part); }, 1000);
  }
}

/* عرض مخطط التجربة الثالثة مع الأنيميشن */
function showExp3Chart(part) {
  var chart = document.getElementById('e3-' + part + '-chart');
  if (!chart) return;
  chart.classList.remove('hidden');
  chart.querySelectorAll('.bar').forEach(function(bar) {
    var pct = bar.dataset.pct;
    if (pct) setTimeout(function() { bar.style.width = pct + '%'; }, 50);
  });
  var scoreEl = document.getElementById('e3-' + part + '-score');
  if (scoreEl) {
    var s = exp3State[part].score;
    var msgs = [
      'واصل المحاولة – هذه المهام تحتاج تمريناً إضافياً.',
      'جيد! أجبت على بند واحد بشكل صحيح.',
      'ممتاز! أجبت على بندين بشكل صحيح.',
      '🎯 رائع! أجبت على جميع البنود الثلاثة بشكل صحيح.'
    ];
    scoreEl.innerHTML = '<strong>نتيجتك في هذا القسم: ' + s + '/3</strong> – ' + msgs[s];
  }
  chart.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
