/**
 * topology.js
 * منطق قسم الطوبولوجيا – 4 بنود
 */

// ══════════════════════════════════════
// الإعداد (Config)
// ══════════════════════════════════════
var TOTAL_ITEMS = 4;
var currentItem  = 1;
var itemAnswered = { 1: false, 2: false, 3: false, 4: false };

// الملاحظة الديناميكية لكل بند (تظهر تحت السؤال)
var subNotes = {
  1: "( السؤال يقيس القدرة على تحديد الشكل الذي لا يعد من <strong>الداخل</strong> ضمن مجال الطوبولوجيا )",
  2: "( السؤال يقيس القدرة على تحديد الشكل الذي لا يعد من <strong>الانغلاق</strong> ضمن مجال الطوبولوجيا )",
  3: "( السؤال يقيس القدرة على تحديد الشكل الذي لا يعد من <strong>الاتصال</strong> ضمن مجال الطوبولوجيا )",
  4: "( السؤال يقيس القدرة على تحديد الشكل الذي لا يعد من <strong>الثقوب</strong> ضمن مجال الطوبولوجيا )"
};

// التغذية الراجعة لكل بند
var feedback = {
  1: {
    correct: "✓ إجابة صحيحة! الصورة الأولى تختلف لأنها تحتوي على شكل محتوى بالكامل داخل شكل آخر (علاقة الداخل)، بينما الصور الأخرى تُظهر نقطة خارج الشكل.",
    wrong:   "✗ إجابة خاطئة. الإجابة الصحيحة هي الصورة الأولى: الشكل الوحيد الذي يحتوي على شكلين بعلاقة احتواء كامل (داخل)."
  },
  2: {
    correct: "✓ إجابة صحيحة! الصورة الثانية تختلف لأنها منحنى مفتوح (مسار لا يكتمل)، بينما الصور الأخرى أشكال مغلقة تماماً.",
    wrong:   "✗ إجابة خاطئة. الإجابة الصحيحة هي الصورة الثانية: الشكل المفتوح (المنحنى غير المكتمل)."
  },
  3: {
    correct: "✓ إجابة صحيحة! الصورة الخامسة تختلف لأنها تتكون من جزأين منفصلين تماماً، بينما الصور الأخرى كلها أشكال متصلة بجزء واحد.",
    wrong:   "✗ إجابة خاطئة. الإجابة الصحيحة هي الصورة الخامسة: الشكل المكوّن من جزأين منفصلين (انعدام الاتصال)."
  },
  4: {
    correct: "✓ إجابة صحيحة! الصورة الرابعة تختلف لأن فيها ثقباً داخلياً (شكل دونات)، بينما الصور الأخرى أشكال صلبة بلا ثقوب.",
    wrong:   "✗ إجابة خاطئة. الإجابة الصحيحة هي الصورة الرابعة: الشكل الوحيد الذي يحتوي على ثقب داخلي."
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

// ══════════════════════════════════════
// التنقل
// ══════════════════════════════════════
function nextItem() { if (currentItem < TOTAL_ITEMS) goToItem(currentItem + 1); }
function prevItem() { if (currentItem > 1)           goToItem(currentItem - 1); }

function goToItem(index) {
  // إخفاء الحالي
  document.getElementById("item-" + currentItem).classList.remove("active");
  var oldStep = document.getElementById("step-" + currentItem);
  oldStep.classList.remove("active");
  if (itemAnswered[currentItem]) oldStep.classList.add("done");

  // إظهار الجديد
  currentItem = index;
  document.getElementById("item-" + currentItem).classList.add("active");
  var newStep = document.getElementById("step-" + currentItem);
  newStep.classList.remove("done");
  newStep.classList.add("active");

  // تحديث الملاحظة الديناميكية
  document.getElementById("subNote").innerHTML = subNotes[currentItem];

  // تحديث مؤشر التقدم
  document.getElementById("progressLabel").textContent =
    "البند " + toAr(currentItem) + " من " + toAr(TOTAL_ITEMS);

  // تحديث الأزرار
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

  var msg = document.getElementById("result-" + item);
  msg.textContent = "";
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
  document.getElementById("finishScreen").classList.add("show");
}
