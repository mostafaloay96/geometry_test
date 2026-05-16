/**
 * transform.js
 * منطق قسم التحويلات الهندسية – 8 بنود
 */

var TOTAL_ITEMS = 8;
var currentItem  = 1;
var itemAnswered = { 1:false,2:false,3:false,4:false,5:false,6:false,7:false,8:false };
var geoCorrectCount = 0;
  1: "( السؤال يقيس القدرة على مقارنة <strong>اتجاه الإزاحة</strong>: تحديد السهم الذي يشير إلى اتجاه مختلف عن البقية )",
  2: "( السؤال يقيس إدراك <strong>زاوية الدوران</strong>: تحديد الشكل الذي لم يخضع لنفس زاوية الدوران )",
  3: "( السؤال يقيس تمييز <strong>محور الانعكاس</strong>: تحديد الشكل المنعكس حول محور مختلف عن البقية )",
  4: "( السؤال يقيس إدراك <strong>نسبة التكبير</strong>: تحديد الشكل ذو الحجم المختلف عن البقية )",
  5: "( السؤال يقيس التمييز بين <strong>أنواع التحويلات الهندسية</strong>: تحديد الشكل الذي خضع لتحويل مختلف )",
  6: "( السؤال يقيس مقارنة <strong>زاوية الدوران</strong>: تحديد المثلث الذي دُوِّر بزاوية مختلفة عن البقية )",
  7: "( السؤال يقيس إدراك <strong>حجم التكبير المتناسب</strong>: تحديد المخمس ذو الحجم المختلف )",
  8: "( السؤال يقيس تمييز <strong>الانعكاس الأفقي</strong>: تحديد الشكل الذي لم ينعكس مقارنةً بالبقية )"
};

var feedback = {
  1: {
    correct: "✓ إجابة صحيحة! الصورة الرابعة تختلف لأن السهم يشير إلى الأعلى، بينما الصور الأخرى جميعها تشير إلى اليمين – اتجاه الإزاحة مختلف.",
    wrong:   "✗ إجابة خاطئة. الإجابة الصحيحة هي الصورة الرابعة: السهم الذي يشير إلى اتجاه مختلف (للأعلى بدلاً من اليمين)."
  },
  2: {
    correct: "✓ إجابة صحيحة! الصورة الثانية تختلف لأنها تُظهر شكل L في وضعه الأصلي دون دوران، بينما الصور الأخرى تُظهره مدوَّراً 90° في اتجاه عقارب الساعة (شكل Γ).",
    wrong:   "✗ إجابة خاطئة. الإجابة الصحيحة هي الصورة الثانية: شكل L غير المدوَّر بين أشكال مدوَّرة 90°."
  },
  3: {
    correct: "✓ إجابة صحيحة! الصورة السادسة تختلف لأنها انعكست حول المحور الأفقي (قُلبت رأساً على عقب)، بينما الصور الأخرى انعكست حول المحور الرأسي.",
    wrong:   "✗ إجابة خاطئة. الإجابة الصحيحة هي الصورة السادسة: الشكل المنعكس حول المحور الأفقي بدلاً من الرأسي."
  },
  4: {
    correct: "✓ إجابة صحيحة! الصورة الثالثة تختلف لأن الدائرة أصغر بكثير، مما يعني أن نسبة التكبير المطبَّقة عليها تختلف عن نسبة التكبير في الصور الأخرى.",
    wrong:   "✗ إجابة خاطئة. الإجابة الصحيحة هي الصورة الثالثة: الدائرة ذات نسبة التكبير المختلفة (أصغر بكثير)."
  },
  5: {
    correct: "✓ إجابة صحيحة! الصورة الخامسة تختلف لأنها تُظهر مربعاً في وضعه الطبيعي دون دوران، بينما الصور الأخرى تُظهر المربع ذاته مدوَّراً 45° (شكل معيَّن).",
    wrong:   "✗ إجابة خاطئة. الإجابة الصحيحة هي الصورة الخامسة: المربع غير المدوَّر بين أشكال المعيَّن المدوَّرة 45°."
  },
  6: {
    correct: "✓ إجابة صحيحة! الصورة الأولى تختلف لأن المثلث يشير إلى الأسفل (دوران 180°)، بينما الصور الأخرى تُظهر المثلث مدوَّراً 90° في اتجاه عقارب الساعة (يشير يميناً).",
    wrong:   "✗ إجابة خاطئة. الإجابة الصحيحة هي الصورة الأولى: المثلث المدوَّر 180° (يشير للأسفل) بدلاً من 90°."
  },
  7: {
    correct: "✓ إجابة صحيحة! الصورة الرابعة تختلف لأن المخمس أكبر بكثير من المخمسات الأخرى، مما يعني أن نسبة التكبير المطبَّقة عليه مختلفة.",
    wrong:   "✗ إجابة خاطئة. الإجابة الصحيحة هي الصورة الرابعة: المخمس ذو نسبة التكبير الأكبر."
  },
  8: {
    correct: "✓ إجابة صحيحة! الصورة الثالثة تختلف لأنها تُظهر الشكل في وضعه الأصلي (نتوء على اليمين)، بينما الصور الأخرى تُظهر انعكاسه الأفقي (نتوء على اليسار).",
    wrong:   "✗ إجابة خاطئة. الإجابة الصحيحة هي الصورة الثالثة: الشكل الأصلي غير المنعكس بين أشكال منعكسة أفقياً."
  }
};

var AR = ["٠","١","٢","٣","٤","٥","٦","٧","٨","٩"];
function toAr(n) {
  return String(n).split("").map(function(d){ return AR[+d] || d; }).join("");
}

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

  if (item < TOTAL_ITEMS) {
    document.getElementById("btnNext").disabled = false;
  } else {
    setTimeout(showFinish, 1000);
  }
}

function nextItem() { if (currentItem < TOTAL_ITEMS) goToItem(currentItem + 1); }
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

function resetCurrent() {
  var item = currentItem;
  itemAnswered[item] = false;

  document.querySelectorAll("[data-item='" + item + "']").forEach(function(c) {
    c.classList.remove("selected-correct", "selected-wrong");
  });

  var msg = document.getElementById("result-" + item);
  msg.textContent = "";
  msg.className   = "result-msg";

  if (item < TOTAL_ITEMS)
    document.getElementById("btnNext").disabled = true;
}

function showFinish() {
  document.getElementById("item-" + currentItem).classList.remove("active");
  document.querySelector(".nav-bar").style.display     = "none";
  document.querySelector(".question").style.display    = "none";
  document.querySelector(".instruction").style.display = "none";
  document.querySelector(".sub-note").style.display    = "none";
  document.querySelector(".card-header").style.display = "none";
  document.querySelector(".domain-desc").style.display = "none";
  geoEnhanceFinish('transform', geoCorrectCount, TOTAL_ITEMS);
  document.getElementById("finishScreen").classList.add("show");
}
