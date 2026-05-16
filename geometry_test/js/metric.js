/**
 * metric.js
 * منطق قسم الخصائص المترية – 8 بنود
 */

var TOTAL_ITEMS = 8;
var currentItem  = 1;
var itemAnswered = { 1:false,2:false,3:false,4:false,5:false,6:false,7:false,8:false };

var subNotes = {
  1: "( السؤال يقيس القدرة على مقارنة <strong>أطوال القطع المستقيمة</strong> وتحديد الطول المختلف )",
  2: "( السؤال يقيس إدراك <strong>نسبة الطول للعرض</strong>: تحديد المستطيل الذي يختلف في نسبة أضلاعه )",
  3: "( السؤال يقيس إدراك <strong>نقطة المنتصف</strong>: تحديد القطعة التي لا تقع نقطتها في منتصفها الحقيقي )",
  4: "( السؤال يقيس مقارنة <strong>أنصاف الأقطار</strong>: تحديد الدائرة ذات القطر المختلف عن البقية )",
  5: "( السؤال يقيس مقارنة <strong>زوايا القطاعات الدائرية</strong>: تحديد القطاع ذو الزاوية المختلفة )",
  6: "( السؤال يقيس إدراك <strong>مركز الشكل الهندسي</strong>: تحديد الشكل الذي لا تقع نقطته في مركزه )",
  7: "( السؤال يقيس مقارنة <strong>أذرع شكل الصليب</strong>: تحديد الصليب ذو الأذرع غير المتساوية )",
  8: "( السؤال يقيس إدراك <strong>تساوي المسافات</strong>: تحديد الشكل الذي لا تتساوى فيه المسافة بين النقاط )"
};

var feedback = {
  1: {
    correct: "✓ إجابة صحيحة! الصورة الثالثة تختلف لأن القطعة المستقيمة فيها أقصر بشكل واضح، بينما الصور الأخرى جميعها لها نفس الطول.",
    wrong:   "✗ إجابة خاطئة. الإجابة الصحيحة هي الصورة الثالثة: القطعة الأقصر طولاً."
  },
  2: {
    correct: "✓ إجابة صحيحة! الصورة الخامسة تختلف لأنها مربع (نسبة الطول للعرض 1:1)، بينما الصور الأخرى مستطيلات عريضة بنسبة تقريبية 2:1.",
    wrong:   "✗ إجابة خاطئة. الإجابة الصحيحة هي الصورة الخامسة: المربع ذو النسبة المختلفة عن المستطيلات."
  },
  3: {
    correct: "✓ إجابة صحيحة! الصورة الرابعة تختلف لأن النقطة لا تقع في منتصف القطعة بل هي أقرب إلى أحد الطرفين، بينما في الصور الأخرى النقطة في المنتصف تماماً.",
    wrong:   "✗ إجابة خاطئة. الإجابة الصحيحة هي الصورة الرابعة: القطعة التي لا تقع نقطتها في منتصفها."
  },
  4: {
    correct: "✓ إجابة صحيحة! الصورة الأولى تختلف لأن دائرتها أصغر بكثير (نصف قطرها أقل من نصف قطر الدوائر الأخرى).",
    wrong:   "✗ إجابة خاطئة. الإجابة الصحيحة هي الصورة الأولى: الدائرة الأصغر حجماً."
  },
  5: {
    correct: "✓ إجابة صحيحة! الصورة السادسة تختلف لأن زاوية قطاعها أكبر بكثير (≈150°) مقارنة بزاوية 90° في الصور الأخرى.",
    wrong:   "✗ إجابة خاطئة. الإجابة الصحيحة هي الصورة السادسة: القطاع ذو الزاوية الأكبر (≈150°)."
  },
  6: {
    correct: "✓ إجابة صحيحة! الصورة الثالثة تختلف لأن النقطة تقع بعيداً عن مركز المستطيل الهندسي، بينما في الصور الأخرى تقع النقطة في المركز الحقيقي للشكل.",
    wrong:   "✗ إجابة خاطئة. الإجابة الصحيحة هي الصورة الثالثة: المستطيل الذي لا تقع نقطته في مركزه."
  },
  7: {
    correct: "✓ إجابة صحيحة! الصورة الخامسة تختلف لأن الذراع الرأسي لشكل الصليب أقصر من الذراع الأفقي، بينما في الصور الأخرى تتساوى جميع الأذرع.",
    wrong:   "✗ إجابة خاطئة. الإجابة الصحيحة هي الصورة الخامسة: الصليب ذو الأذرع غير المتساوية."
  },
  8: {
    correct: "✓ إجابة صحيحة! الصورة الثانية تختلف لأن المسافة بين النقطتين اليمنى والوسطى أقل من المسافة بين اليسرى والوسطى، بينما في الصور الأخرى المسافات متساوية.",
    wrong:   "✗ إجابة خاطئة. الإجابة الصحيحة هي الصورة الثانية: الشكل ذو المسافات غير المتساوية بين النقاط."
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
  document.getElementById("finishScreen").classList.add("show");
}
