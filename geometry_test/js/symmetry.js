/**
 * symmetry.js
 * منطق قسم التماثل والأشكال اليدوية – 8 بنود
 */

var TOTAL_ITEMS = 8;
var currentItem  = 1;
var itemAnswered = { 1:false,2:false,3:false,4:false,5:false,6:false,7:false,8:false };
var geoCorrectCount = 0;
var _autoNext = null;

// الملاحظة الديناميكية لكل بند
var subNotes = {
  1: "( السؤال يقيس القدرة على تمييز <strong>الأشكال اليدوية</strong>: تحديد شكل L المنعكس مرآوياً عن بقية الأشكال المتشابهة )",
  2: "( السؤال يقيس إدراك <strong>التماثل الرأسي</strong>: تحديد الشكل الذي لا ينطبق على نفسه عند الطي على المحور الرأسي )",
  3: "( السؤال يقيس إدراك <strong>التماثل الأفقي</strong>: تحديد الشكل الذي لا ينطبق على نفسه عند الطي على المحور الأفقي )",
  4: "( السؤال يقيس القدرة على تمييز <strong>الأشكال اليدوية</strong>: شكل Z وشكل S صورتان مرآويتان لبعضهما )",
  5: "( السؤال يقيس إدراك <strong>تعدد محاور التماثل</strong>: المضلعات المنتظمة تملك محاور تماثل متعددة بينما الأشكال غير المنتظمة لا تملك أياً )",
  6: "( السؤال يقيس القدرة على تمييز <strong>الأشكال اليدوية</strong>: تحديد العلم الذي يتجه نحو اتجاه مختلف عن البقية )",
  7: "( السؤال يقيس إدراك <strong>التماثل الثنائي</strong>: تحديد الشكل الذي يملك محور تماثل واحداً فقط بينما البقية تملك محورين أو أكثر )",
  8: "( السؤال يقيس القدرة على تمييز <strong>الأشكال اليدوية</strong>: السلّم المعكوس يبدو مشابهاً لكنه يتدرج في الاتجاه المعاكس )"
};

// التغذية الراجعة
var feedback = {
  1: {
    correct: "✓ إجابة صحيحة! الصورة الثالثة تختلف لأنها صورة انعكاسية (مرآوية) لشكل L، حيث تفتح نحو اليسار في الأسفل، بينما الصور الأخرى كلها تفتح نحو اليمين.",
    wrong:   "✗ إجابة خاطئة. الإجابة الصحيحة هي الصورة الثالثة: شكل L المعكوس الذي يفتح نحو اليسار بدلاً من اليمين."
  },
  2: {
    correct: "✓ إجابة صحيحة! الصورة الخامسة تختلف لأنها شكل غير منتظم لا يملك أي محور تماثل، بينما الصور الأخرى جميعها متناظرة رأسياً (يمين = يسار عند الطي).",
    wrong:   "✗ إجابة خاطئة. الإجابة الصحيحة هي الصورة الخامسة: الشكل غير المنتظم الذي لا يملك محور تماثل رأسي."
  },
  3: {
    correct: "✓ إجابة صحيحة! الصورة الثانية (المثلث المتجه للأعلى) تختلف لأنها لا تملك تماثلاً أفقياً، إذ يكون الجزء العلوي مختلفاً عن السفلي عند الطي، بينما الصور الأخرى متناظرة أفقياً.",
    wrong:   "✗ إجابة خاطئة. الإجابة الصحيحة هي الصورة الثانية: المثلث الذي لا يملك تماثلاً أفقياً."
  },
  4: {
    correct: "✓ إجابة صحيحة! الصورة السادسة (شكل S) تختلف لأنها صورة انعكاسية مرآوية لشكل Z، حيث يتجه القطري في الاتجاه المعاكس.",
    wrong:   "✗ إجابة خاطئة. الإجابة الصحيحة هي الصورة السادسة: شكل S الذي هو انعكاس مرآوي لشكل Z."
  },
  5: {
    correct: "✓ إجابة صحيحة! الصورة الرابعة تختلف لأنها شكل غير منتظم لا يملك أي محور تماثل، بينما الصور الأخرى جميعها مضلعات منتظمة ذات محاور تماثل متعددة.",
    wrong:   "✗ إجابة خاطئة. الإجابة الصحيحة هي الصورة الرابعة: الشكل غير المنتظم الذي لا يملك أي محور تماثل."
  },
  6: {
    correct: "✓ إجابة صحيحة! الصورة الأولى تختلف لأنها علم يتجه نحو اليسار (صورة مرآوية)، بينما الصور الأخرى كلها أعلام تتجه نحو اليمين.",
    wrong:   "✗ إجابة خاطئة. الإجابة الصحيحة هي الصورة الأولى: العلم المعكوس الذي يتجه نحو اليسار."
  },
  7: {
    correct: "✓ إجابة صحيحة! الصورة الثالثة (المثلث) تختلف لأنها تملك محور تماثل واحداً فقط (الرأسي)، بينما الصور الأخرى تملك محورَي تماثل أو أكثر (رأسي وأفقي).",
    wrong:   "✗ إجابة خاطئة. الإجابة الصحيحة هي الصورة الثالثة: المثلث الذي يملك محور تماثل واحداً فقط."
  },
  8: {
    correct: "✓ إجابة صحيحة! الصورة الثانية تختلف لأنها سلّم متدرج نحو اليسار (صورة مرآوية)، بينما الصور الأخرى كلها سلالم تتدرج نحو اليمين.",
    wrong:   "✗ إجابة خاطئة. الإجابة الصحيحة هي الصورة الثانية: السلّم المعكوس الذي يتدرج نحو اليسار."
  }
};

// أرقام عربية
var AR = ["٠","١","٢","٣","٤","٥","٦","٧","٨","٩"];
function toAr(n) {
  return String(n).split("").map(function(d){ return AR[+d] || d; }).join("");
}

// ══════════════════════════════════════
// اختيار إجابة
// ══════════════════════════════════════
function choose(cell) {
  var item = parseInt(cell.dataset.item);
  if (itemAnswered[item]) return;
  itemAnswered[item] = true;

  var isCorrect = cell.dataset.correct === "true";
  if (isCorrect) geoCorrectCount++;
  var msg = document.getElementById("result-" + item);
  var fb  = feedback[item];

  if (isCorrect) {
    cell.classList.add("selected-correct");
    msg.textContent = fb.correct;
    msg.className   = "result-msg correct";
  } else {
    cell.classList.add("selected-wrong");
    var correct = document.querySelector("[data-item='" + item + "'][data-correct='true']");
    if (correct) correct.classList.add("selected-correct");
    msg.textContent = fb.wrong;
    msg.className   = "result-msg wrong";
  }

  // تلوين خطوة التقدم
  var stepEl = document.getElementById("step-" + item);
  if (stepEl) stepEl.classList.add(isCorrect ? "step-correct" : "step-wrong");

  if (item < TOTAL_ITEMS) {
    document.getElementById("btnNext").disabled = false;
    _autoNext = setTimeout(nextItem, 1000);
  } else {
    setTimeout(showFinish, 1000);
  }
}

// ══════════════════════════════════════
// التنقل
// ══════════════════════════════════════
function nextItem() { clearTimeout(_autoNext); if (currentItem < TOTAL_ITEMS) goToItem(currentItem + 1); }
function prevItem() { if (currentItem > 1)           goToItem(currentItem - 1); }

function goToItem(index) {
  document.getElementById("item-" + currentItem).classList.remove("active");
  var oldStep = document.getElementById("step-" + currentItem);
  oldStep.classList.remove("active");
  if (itemAnswered[currentItem]) oldStep.classList.add("done");

  currentItem = index;
  document.getElementById("item-" + currentItem).classList.add("active");
  var newStep = document.getElementById("step-" + currentItem);
  newStep.classList.remove("done");
  newStep.classList.add("active");

  document.getElementById("subNote").innerHTML = subNotes[currentItem];
  document.getElementById("progressLabel").textContent =
    "البند " + toAr(currentItem) + " من " + toAr(TOTAL_ITEMS);

  document.getElementById("btnPrev").disabled = (currentItem === 1);
  document.getElementById("btnNext").disabled =
    !itemAnswered[currentItem] || (currentItem === TOTAL_ITEMS);
}

// ══════════════════════════════════════
// إعادة البند الحالي
// ══════════════════════════════════════
function resetCurrent() {
  var item = currentItem;
  itemAnswered[item] = false;

  document.querySelectorAll("[data-item='" + item + "']").forEach(function(c) {
    c.classList.remove("selected-correct", "selected-wrong");
  });
  var stepEl = document.getElementById("step-" + item);
  if (stepEl) stepEl.classList.remove("step-correct", "step-wrong");

  var msg = document.getElementById("result-" + item);g.textContent = "";
  msg.className   = "result-msg";

  if (item < TOTAL_ITEMS)
    document.getElementById("btnNext").disabled = true;
}

// ══════════════════════════════════════
// شاشة الإنهاء
// ══════════════════════════════════════
function showFinish() {
  document.getElementById("item-" + currentItem).classList.remove("active");
  document.querySelector(".nav-bar").style.display     = "none";
  document.querySelector(".question").style.display    = "none";
  document.querySelector(".instruction").style.display = "none";
  document.querySelector(".sub-note").style.display    = "none";
  document.querySelector(".card-header").style.display = "none";
  document.querySelector(".domain-desc").style.display = "none";
  geoEnhanceFinish('symmetry', geoCorrectCount, TOTAL_ITEMS);
  document.getElementById("finishScreen").classList.add("show");
}
