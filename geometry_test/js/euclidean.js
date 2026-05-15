/**
 * euclidean.js
 * منطق قسم الهندسة الإقليدية – 8 بنود
 */

// ══════════════════════════════════════
// الإعداد (Config)
// ══════════════════════════════════════
var TOTAL_ITEMS = 8;
var currentItem  = 1;
var itemAnswered = { 1: false, 2: false, 3: false, 4: false,
                     5: false, 6: false, 7: false, 8: false };

// الملاحظة الديناميكية لكل بند
var subNotes = {
  1: "( السؤال يقيس القدرة على تحديد الشكل الذي لا يعد من <strong>التوازي</strong> ضمن مجال الهندسة الإقليدية )",
  2: "( السؤال يقيس القدرة على تحديد الشكل الذي لا يعد من <strong>الزاوية القائمة</strong> ضمن مجال الهندسة الإقليدية )",
  3: "( السؤال يقيس القدرة على تحديد الشكل الذي لا يعد من <strong>الأضلاع المتساوية</strong> ضمن مجال الهندسة الإقليدية )",
  4: "( السؤال يقيس القدرة على تحديد الشكل الذي لا يعد من <strong>التعامد</strong> ضمن مجال الهندسة الإقليدية )",
  5: "( السؤال يقيس القدرة على تحديد الشكل الذي لا يعد من <strong>الاستقامة</strong> ضمن مجال الهندسة الإقليدية )",
  6: "( السؤال يقيس القدرة على تحديد الشكل الذي لا يعد من <strong>المثلث القائم</strong> ضمن مجال الهندسة الإقليدية )",
  7: "( السؤال يقيس القدرة على تحديد الشكل الذي لا يعد من <strong>المستطيل</strong> ضمن مجال الهندسة الإقليدية )",
  8: "( السؤال يقيس القدرة على تحديد الشكل الذي لا يعد من <strong>قطر الدائرة</strong> ضمن مجال الهندسة الإقليدية )"
};

// التغذية الراجعة
var feedback = {
  1: {
    correct: "✓ إجابة صحيحة! الصورة الثالثة تختلف لأن خطيها يتلاقيان في نقطة واحدة (غير متوازيين)، بينما الصور الأخرى تُظهر خطوطاً متوازية لا تلتقي أبداً.",
    wrong:   "✗ إجابة خاطئة. الإجابة الصحيحة هي الصورة الثالثة: الخطان المتقاطعان (غير المتوازيين)."
  },
  2: {
    correct: "✓ إجابة صحيحة! الصورة السادسة تختلف لأنها تُظهر زاوية منفرجة (أكبر من 90°)، بينما الصور الأخرى تُظهر جميعها زوايا قائمة (90°) مع إشارة المربع.",
    wrong:   "✗ إجابة خاطئة. الإجابة الصحيحة هي الصورة السادسة: الزاوية المنفرجة التي تختلف عن الزوايا القائمة."
  },
  3: {
    correct: "✓ إجابة صحيحة! الصورة الثانية تختلف لأنها مثلث متفاوت الأضلاع (أضلاع بأطوال مختلفة)، بينما الصور الأخرى مثلثات متساوية الأضلاع.",
    wrong:   "✗ إجابة خاطئة. الإجابة الصحيحة هي الصورة الثانية: المثلث المتفاوت الأضلاع."
  },
  4: {
    correct: "✓ إجابة صحيحة! الصورة الرابعة تختلف لأن خطها المائل لا يلتقي بالخط الأفقي بزاوية قائمة، بينما الصور الأخرى تُظهر خطوطاً متعامدة (90°).",
    wrong:   "✗ إجابة خاطئة. الإجابة الصحيحة هي الصورة الرابعة: الخط المائل الذي لا يصنع زاوية قائمة."
  },
  5: {
    correct: "✓ إجابة صحيحة! الصورة الأولى تختلف لأن نقطتها الوسطى منحرفة عن الخط المستقيم الواصل بين الطرفين، بينما الصور الأخرى تُظهر ثلاث نقاط مستقيمة.",
    wrong:   "✗ إجابة خاطئة. الإجابة الصحيحة هي الصورة الأولى: النقطة الوسطى المنحرفة عن الاستقامة."
  },
  6: {
    correct: "✓ إجابة صحيحة! الصورة الخامسة تختلف لأنها مثلث منفرج الزاوية (زاويته الكبرى أكبر من 90°)، بينما الصور الأخرى مثلثات قائمة الزاوية.",
    wrong:   "✗ إجابة خاطئة. الإجابة الصحيحة هي الصورة الخامسة: المثلث المنفرج الزاوية."
  },
  7: {
    correct: "✓ إجابة صحيحة! الصورة السادسة تختلف لأنها متوازي أضلاع (زواياها منحرفة عن 90°)، بينما الصور الأخرى مستطيلات ذات زوايا قائمة.",
    wrong:   "✗ إجابة خاطئة. الإجابة الصحيحة هي الصورة السادسة: متوازي الأضلاع الذي لا يحتوي على زوايا قائمة."
  },
  8: {
    correct: "✓ إجابة صحيحة! الصورة الثالثة تختلف لأن الخط فيها وتر لا يمر بمركز الدائرة، بينما الصور الأخرى تُظهر قطراً يمر بالمركز.",
    wrong:   "✗ إجابة خاطئة. الإجابة الصحيحة هي الصورة الثالثة: الوتر الذي لا يمر بمركز الدائرة."
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
