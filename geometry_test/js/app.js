/**
 * app.js
 * منطق اختبار الحساسية للهندسة – البنود التدريبية
 * Logic for Geometry Sensitivity Test – Practice Items
 */

// ══════════════════════════════════════
// الحالة (State)
// ══════════════════════════════════════
const TOTAL_ITEMS = 2;

var currentItem  = 1;           // البند الحالي
var itemAnswered = { 1: false, 2: false };  // هل تمت الإجابة على كل بند

// رسائل التغذية الراجعة لكل بند
var feedbackMessages = {
  1: {
    correct: "✓ إجابة صحيحة! الصورة الرابعة تختلف لأنها تحتوي على مربع مملوء بالكامل.",
    wrong:   "✗ إجابة خاطئة. الإجابة الصحيحة هي الصورة الرابعة (المربع المملوء بالأسود)."
  },
  2: {
    correct: "✓ إجابة صحيحة! الصورة الثالثة تختلف لأن الشريط بداخلها مائل وليس رأسياً.",
    wrong:   "✗ إجابة خاطئة. الإجابة الصحيحة هي الصورة الثالثة (الشريط المائل)."
  }
};

// ══════════════════════════════════════
// اختيار إجابة (Choose Answer)
// ══════════════════════════════════════
function choose(cell) {
  var item = parseInt(cell.dataset.item);
  if (itemAnswered[item]) return;
  itemAnswered[item] = true;

  var isCorrect = cell.dataset.correct === "true";
  var msg       = document.getElementById("result-" + item);
  var fb        = feedbackMessages[item];

  if (isCorrect) {
    cell.classList.add("selected-correct");
    msg.textContent = fb.correct;
    msg.className   = "result-msg correct";
  } else {
    cell.classList.add("selected-wrong");
    // إبراز الإجابة الصحيحة للبند الحالي
    var correctCell = document.querySelector(
      "[data-item='" + item + "'][data-correct='true']"
    );
    if (correctCell) correctCell.classList.add("selected-correct");
    msg.textContent = fb.wrong;
    msg.className   = "result-msg wrong";
  }

  // تفعيل زر التالي إذا كان هناك بند تالٍ
  if (item < TOTAL_ITEMS) {
    document.getElementById("btnNext").disabled = false;
  } else {
    // آخر بند: أظهر شاشة الإنهاء بعد ثانية
    setTimeout(showFinish, 1000);
  }
}

// ══════════════════════════════════════
// التنقل بين البنود (Navigation)
// ══════════════════════════════════════
function nextItem() {
  if (currentItem >= TOTAL_ITEMS) return;
  goToItem(currentItem + 1);
}

function prevItem() {
  if (currentItem <= 1) return;
  goToItem(currentItem - 1);
}

function goToItem(index) {
  // إخفاء البند الحالي
  document.getElementById("item-" + currentItem).classList.remove("active");
  document.getElementById("step-" + currentItem).classList.remove("active");
  if (itemAnswered[currentItem]) {
    document.getElementById("step-" + currentItem).classList.add("done");
  }

  // إظهار البند الجديد
  currentItem = index;
  document.getElementById("item-" + currentItem).classList.add("active");

  var step = document.getElementById("step-" + currentItem);
  step.classList.remove("done");
  step.classList.add("active");

  // تحديث مؤشر التقدم
  document.getElementById("progressLabel").textContent =
    "البند " + toArabicNumeral(currentItem) + " من " + toArabicNumeral(TOTAL_ITEMS);

  // تحديث أزرار التنقل
  document.getElementById("btnPrev").disabled = (currentItem === 1);
  document.getElementById("btnNext").disabled = !itemAnswered[currentItem] || (currentItem === TOTAL_ITEMS);
}

// ══════════════════════════════════════
// إعادة البند الحالي (Reset Current)
// ══════════════════════════════════════
function resetCurrent() {
  var item = currentItem;
  itemAnswered[item] = false;

  // إزالة تمييز الخلايا
  document.querySelectorAll("[data-item='" + item + "']").forEach(function(c) {
    c.classList.remove("selected-correct", "selected-wrong");
  });

  // مسح رسالة النتيجة
  var msg = document.getElementById("result-" + item);
  msg.textContent = "";
  msg.className   = "result-msg";

  // تعطيل زر التالي
  if (item < TOTAL_ITEMS) {
    document.getElementById("btnNext").disabled = true;
  }
}

// ══════════════════════════════════════
// شاشة الإنهاء (Finish Screen)
// ══════════════════════════════════════
function showFinish() {
  // إخفاء عناصر الاختبار
  document.getElementById("item-" + currentItem).classList.remove("active");
  document.querySelector(".nav-bar").style.display     = "none";
  document.querySelector(".question").style.display    = "none";
  document.querySelector(".instruction").style.display = "none";
  document.querySelector(".card-header").style.display = "none";

  // إظهار شاشة الإنهاء
  document.getElementById("finishScreen").classList.add("show");
}

// ══════════════════════════════════════
// مساعد: تحويل الرقم لعربي
// ══════════════════════════════════════
function toArabicNumeral(n) {
  var numerals = ["٠","١","٢","٣","٤","٥","٦","٧","٨","٩"];
  return String(n).split("").map(function(d) {
    return numerals[parseInt(d)] || d;
  }).join("");
}
