/**
 * transform.js
 * منطق قسم التحويلات الهندسية – 8 بنود
 */

var TOTAL_ITEMS = 8;
var currentItem  = 1;
var itemAnswered = { 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false, 8: false };
var geoCorrectCount = 0;
var _autoNext = null;

// الملاحظة الديناميكية لكل بند
var subNotes = {
  1: "( السؤال يقيس القدرة على تحديد الشكل المختلف في <strong>الانسحاب</strong> ضمن مجال التحويلات الهندسية )",
  2: "( السؤال يقيس القدرة على تحديد الشكل المختلف في <strong>التحاكي (اتجاه ثابت)</strong> ضمن مجال التحويلات الهندسية )",
  3: "( السؤال يقيس القدرة على تحديد الشكل المختلف في <strong>التحاكي (حجم ثابت)</strong> ضمن مجال التحويلات الهندسية )",
  4: "( السؤال يقيس القدرة على تحديد الشكل المختلف في <strong>التناظر حول محور أفقي</strong> ضمن مجال التحويلات الهندسية )",
  5: "( السؤال يقيس القدرة على تحديد الشكل المختلف في <strong>التناظر حول محور عمودي</strong> ضمن مجال التحويلات الهندسية )",
  6: "( السؤال يقيس القدرة على تحديد الشكل المختلف في <strong>التناظر حول محور مائل</strong> ضمن مجال التحويلات الهندسية )",
  7: "( السؤال يقيس القدرة على تحديد الشكل المختلف في <strong>التناظر النقطي</strong> ضمن مجال التحويلات الهندسية )",
  8: "( السؤال يقيس القدرة على تحديد الشكل المختلف في <strong>الدوران</strong> ضمن مجال التحويلات الهندسية )"
};

var feedback = {
  1: {
    correct: "✓ إجابة صحيحة! الصورة الثانية هي المختلفة عن بقية الصور في الانسحاب.",
    wrong:   "✗ إجابة خاطئة. الإجابة الصحيحة هي الصورة الثانية."
  },
  2: {
    correct: "✓ إجابة صحيحة! الصورة السادسة هي المختلفة عن بقية الصور في التحاكي (اتجاه ثابت).",
    wrong:   "✗ إجابة خاطئة. الإجابة الصحيحة هي الصورة السادسة."
  },
  3: {
    correct: "✓ إجابة صحيحة! الصورة الأولى هي المختلفة عن بقية الصور في التحاكي (حجم ثابت).",
    wrong:   "✗ إجابة خاطئة. الإجابة الصحيحة هي الصورة الأولى."
  },
  4: {
    correct: "✓ إجابة صحيحة! الصورة الثانية هي المختلفة عن بقية الصور في التناظر حول محور أفقي.",
    wrong:   "✗ إجابة خاطئة. الإجابة الصحيحة هي الصورة الثانية."
  },
  5: {
    correct: "✓ إجابة صحيحة! الصورة الرابعة هي المختلفة عن بقية الصور في التناظر حول محور عمودي.",
    wrong:   "✗ إجابة خاطئة. الإجابة الصحيحة هي الصورة الرابعة."
  },
  6: {
    correct: "✓ إجابة صحيحة! الصورة الأولى هي المختلفة عن بقية الصور في التناظر حول محور مائل.",
    wrong:   "✗ إجابة خاطئة. الإجابة الصحيحة هي الصورة الأولى."
  },
  7: {
    correct: "✓ إجابة صحيحة! الصورة السادسة هي المختلفة عن بقية الصور في التناظر النقطي.",
    wrong:   "✗ إجابة خاطئة. الإجابة الصحيحة هي الصورة السادسة."
  },
  8: {
    correct: "✓ إجابة صحيحة! الصورة السادسة هي المختلفة عن بقية الصور في الدوران.",
    wrong:   "✗ إجابة خاطئة. الإجابة الصحيحة هي الصورة السادسة."
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
