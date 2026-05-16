/**
 * geometric.js
 * منطق قسم الأشكال الهندسية – 8 بنود
 */

// ══════════════════════════════════════
// الإعداد (Config)
// ══════════════════════════════════════
var TOTAL_ITEMS = 8;
var currentItem  = 1;
var itemAnswered = { 1: false, 2: false, 3: false, 4: false,
                     5: false, 6: false, 7: false, 8: false };
var geoCorrectCount = 0;
var _autoNext = null;

// الملاحظة الديناميكية لكل بند
var subNotes = {
  1: "( السؤال يقيس القدرة على تحديد الشكل الذي لا يعد من <strong>المثلثات</strong> ضمن مجال الأشكال الهندسية )",
  2: "( السؤال يقيس القدرة على تحديد الشكل الذي لا يعد من <strong>المستطيلات</strong> ضمن مجال الأشكال الهندسية )",
  3: "( السؤال يقيس القدرة على تحديد الشكل الذي لا يعد من <strong>الدوائر</strong> ضمن مجال الأشكال الهندسية )",
  4: "( السؤال يقيس القدرة على تحديد الشكل الذي لا يعد من <strong>المعينات</strong> ضمن مجال الأشكال الهندسية )",
  5: "( السؤال يقيس القدرة على تحديد الشكل الذي لا يعد من <strong>المخمسات</strong> ضمن مجال الأشكال الهندسية )",
  6: "( السؤال يقيس القدرة على تحديد الشكل الذي لا يعد من <strong>السداسيات</strong> ضمن مجال الأشكال الهندسية )",
  7: "( السؤال يقيس القدرة على تحديد الشكل الذي لا يعد من <strong>النجوم الخماسية</strong> ضمن مجال الأشكال الهندسية )",
  8: "( السؤال يقيس القدرة على تحديد الشكل الذي لا يعد من <strong>أشباه المنحرفات</strong> ضمن مجال الأشكال الهندسية )"
};

// التغذية الراجعة
var feedback = {
  1: {
    correct: "✓ إجابة صحيحة! الصورة الخامسة تختلف لأنها معين (شكل رباعي الأضلاع) وليس مثلثاً، بينما الصور الأخرى جميعها مثلثات بأنواع مختلفة.",
    wrong:   "✗ إجابة خاطئة. الإجابة الصحيحة هي الصورة الخامسة: المعين الذي يختلف عن المثلثات."
  },
  2: {
    correct: "✓ إجابة صحيحة! الصورة الثانية تختلف لأنها مثلث (شكل ثلاثي الأضلاع)، بينما الصور الأخرى جميعها مستطيلات (بما فيها المربع).",
    wrong:   "✗ إجابة خاطئة. الإجابة الصحيحة هي الصورة الثانية: المثلث الذي يختلف عن المستطيلات."
  },
  3: {
    correct: "✓ إجابة صحيحة! الصورة الرابعة تختلف لأنها بيضاوي (إهليلج) ذو نصفَي قطر مختلفَين، بينما الصور الأخرى دوائر كاملة.",
    wrong:   "✗ إجابة خاطئة. الإجابة الصحيحة هي الصورة الرابعة: البيضاوي (الإهليلج) الذي يختلف عن الدوائر."
  },
  4: {
    correct: "✓ إجابة صحيحة! الصورة السادسة تختلف لأنها شكل رباعي متفاوت الأضلاع، بينما الصور الأخرى جميعها معينات (أضلاعها الأربعة متساوية).",
    wrong:   "✗ إجابة خاطئة. الإجابة الصحيحة هي الصورة السادسة: الشكل الرباعي المتفاوت الأضلاع."
  },
  5: {
    correct: "✓ إجابة صحيحة! الصورة الأولى تختلف لأنها سداسي الأضلاع (6 أضلاع)، بينما الصور الأخرى جميعها خماسيات منتظمة (5 أضلاع).",
    wrong:   "✗ إجابة خاطئة. الإجابة الصحيحة هي الصورة الأولى: سداسي الأضلاع الذي يختلف عن الخماسيات."
  },
  6: {
    correct: "✓ إجابة صحيحة! الصورة الثالثة تختلف لأنها خماسي الأضلاع (5 أضلاع)، بينما الصور الأخرى جميعها سداسيات منتظمة (6 أضلاع).",
    wrong:   "✗ إجابة خاطئة. الإجابة الصحيحة هي الصورة الثالثة: خماسي الأضلاع الذي يختلف عن السداسيات."
  },
  7: {
    correct: "✓ إجابة صحيحة! الصورة الثانية تختلف لأنها نجمة سداسية (12 رأساً / 6 رؤوس بارزة)، بينما الصور الأخرى جميعها نجوم خماسية (5 رؤوس بارزة).",
    wrong:   "✗ إجابة خاطئة. الإجابة الصحيحة هي الصورة الثانية: النجمة السداسية التي تختلف عن النجوم الخماسية."
  },
  8: {
    correct: "✓ إجابة صحيحة! الصورة الخامسة تختلف لأنها متوازي أضلاع (زوجان من الأضلاع المتوازية)، بينما الصور الأخرى أشباه منحرفات (زوج واحد فقط من الأضلاع المتوازية).",
    wrong:   "✗ إجابة خاطئة. الإجابة الصحيحة هي الصورة الخامسة: متوازي الأضلاع الذي يختلف عن أشباه المنحرفات."
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
  geoEnhanceFinish('geometric', geoCorrectCount, TOTAL_ITEMS);
  document.getElementById("finishScreen").classList.add("show");
}
