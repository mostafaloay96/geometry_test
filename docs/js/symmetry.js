/**
 * symmetry.js
 * منطق قسم التماثل والأشكال اليدوية – 7 بنود
 */

var TOTAL_ITEMS = 7;
var currentItem  = 1;
var itemAnswered = { 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false };
var geoCorrectCount = 0;
var _autoNext = null;

// الملاحظة الديناميكية لكل بند
var subNotes = {
  1: "( السؤال يقيس القدرة على تحديد الشكل المختلف في <strong>التماثل حول محور عمودي</strong> ضمن مجال التماثل والأشكال الكيرالية )",
  2: "( السؤال يقيس القدرة على تحديد الشكل المختلف في <strong>التماثل حول محور أفقي</strong> ضمن مجال التماثل والأشكال الكيرالية )",
  3: "( السؤال يقيس القدرة على تحديد الشكل المختلف في <strong>التماثل حول محور مائل</strong> ضمن مجال التماثل والأشكال الكيرالية )",
  4: "( السؤال يقيس القدرة على تحديد الشكل المختلف في <strong>الأشكال الكيرالية – المحور العمودي</strong> ضمن مجال التماثل والأشكال الكيرالية )",
  5: "( السؤال يقيس القدرة على تحديد الشكل المختلف في <strong>الأشكال الكيرالية – المحور العمودي</strong> ضمن مجال التماثل والأشكال الكيرالية )",
  6: "( السؤال يقيس القدرة على تحديد الشكل المختلف في <strong>الأشكال الكيرالية – المحور المائل</strong> ضمن مجال التماثل والأشكال الكيرالية )",
  7: "( السؤال يقيس القدرة على تحديد الشكل المختلف في <strong>الأشكال الكيرالية – المحور المائل</strong> ضمن مجال التماثل والأشكال الكيرالية )"
};

// التغذية الراجعة
var feedback = {
  1: {
    correct: "✓ إجابة صحيحة! الصورة الثالثة هي المختلفة عن بقية الصور في التماثل حول محور عمودي.",
    wrong:   "✗ إجابة خاطئة. الإجابة الصحيحة هي الصورة الثالثة."
  },
  2: {
    correct: "✓ إجابة صحيحة! الصورة السادسة هي المختلفة عن بقية الصور في التماثل حول محور أفقي.",
    wrong:   "✗ إجابة خاطئة. الإجابة الصحيحة هي الصورة السادسة."
  },
  3: {
    correct: "✓ إجابة صحيحة! الصورة الخامسة هي المختلفة عن بقية الصور في التماثل حول محور مائل.",
    wrong:   "✗ إجابة خاطئة. الإجابة الصحيحة هي الصورة الخامسة."
  },
  4: {
    correct: "✓ إجابة صحيحة! الصورة الثانية هي المختلفة عن بقية الصور في الأشكال الكيرالية – المحور العمودي.",
    wrong:   "✗ إجابة خاطئة. الإجابة الصحيحة هي الصورة الثانية."
  },
  5: {
    correct: "✓ إجابة صحيحة! الصورة الثالثة هي المختلفة عن بقية الصور في الأشكال الكيرالية – المحور العمودي.",
    wrong:   "✗ إجابة خاطئة. الإجابة الصحيحة هي الصورة الثالثة."
  },
  6: {
    correct: "✓ إجابة صحيحة! الصورة السادسة هي المختلفة عن بقية الصور في الأشكال الكيرالية – المحور المائل.",
    wrong:   "✗ إجابة خاطئة. الإجابة الصحيحة هي الصورة السادسة."
  },
  7: {
    correct: "✓ إجابة صحيحة! الصورة الرابعة هي المختلفة عن بقية الصور في الأشكال الكيرالية – المحور المائل.",
    wrong:   "✗ إجابة خاطئة. الإجابة الصحيحة هي الصورة الرابعة."
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
