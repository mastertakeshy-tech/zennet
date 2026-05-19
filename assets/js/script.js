// ============================================
// ESTUDIANTE:LORENA VILLEGAS
// TUTOR: CARLOS EDUARDO PAREDES MENDEZ
// APLICACIONES MULTIMEDIA GRUPO 213026_7
// UNAD
// ============================================
// ============================================
// VARIABLES GLOBALES
// ============================================
let completedModules = new Set(
  JSON.parse(localStorage.getItem("zennetCompleted")) || []
);

// ============================================
// TOAST
// ============================================
function showToast(msg) {
  const toast = document.getElementById("toast");

  if (!toast) return;

  toast.textContent = msg;

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

// ============================================
// CONFETTI
// ============================================
function launchConfetti() {
  const duration = 4000;

  const end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 6,
      angle: 60,
      spread: 70,
      origin: { x: 0 }
    });

    confetti({
      particleCount: 6,
      angle: 120,
      spread: 70,
      origin: { x: 1 }
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}

// ============================================
// PROGRESO TOTAL
// ============================================
function updateGlobalProgress() {

  const total = 5;

  const completed = completedModules.size;

  // CURSO COMPLETADO
  if (completed >= total) {

    // EVITAR REPETIR 
    if (
  localStorage.getItem("zennetFinished") &&
  completedModules.size >= total
) {
  return;
}
    // CONFETTI
    if (typeof confetti === "function") {
      launchConfetti();
    }

    // MENSAJE AL FINAL
    setTimeout(() => {

      alert(
        "🎉 FELICIDADES 🎉\n\n" +
        "Has completado todos los módulos de ZENNET."
      );

    }, 500);
  }
}

function markModuleComplete(moduleNum) {

  if (!completedModules.has(moduleNum)) {

    completedModules.add(moduleNum);

    // GUARDAR EN LOCALSTORAGE
    localStorage.setItem(
      "zennetCompleted",
      JSON.stringify([...completedModules])
    );

    updateGlobalProgress();

    showToast("¡Módulo " + moduleNum + " completado!");
  }
}

// ============================================
// ACTIVIDAD MODULO 1
// ============================================
function checkAnswer(element, isCorrect, feedbackId, moduleNum) {
  const options =
    element.parentElement.querySelectorAll(".quiz-opt");

  options.forEach((opt) => {
    opt.style.pointerEvents = "none";
    opt.classList.remove("correct", "wrong");
  });

  const feedback =
    document.getElementById("feedback-" + feedbackId);

  if (isCorrect) {
    element.classList.add("correct");

    feedback.textContent =
      "¡Correcto! Has completado este quiz.";

    feedback.className =
      "quiz-feedback-msg correct show";

    markModuleComplete(moduleNum);

  } else {

    element.classList.add("wrong");

    feedback.textContent =
      "Incorrecto. Intenta nuevamente.";

    feedback.className =
      "quiz-feedback-msg wrong show";
  }
}

// ============================================
// ACTIVIDAD MODULO 2
// ============================================
let healthyCount = 0;

function toggleHabit(element, isHealthy) {

  if (element.classList.contains("selected")) return;

  element.classList.add("selected");

  const result =
    document.getElementById("habitResult");

  if (isHealthy) {

    element.classList.add("correct");

    healthyCount++;

  } else {

    element.classList.add("wrong");
  }

  if (healthyCount >= 3) {

    result.textContent =
      "🎉 ¡Actividad completada!";

    result.className =
      "quiz-feedback-msg correct show";

    markModuleComplete(2);
  }
}

// ============================================
// ACTIVIDAD MODULO 3
// ============================================
const phishEmails = [
  {
    text: '⚠️ "Tu cuenta bancaria será suspendida hoy. Haz clic aquí para verificar."',
    answer: true
  },

  {
    text: '📚 "La biblioteca informa cambio de horario para devolución de libros."',
    answer: false
  },

  {
    text: '🎁 "Ganaste un iPhone gratis. Ingresa tu contraseña ahora."',
    answer: true
  }
];

let phishIndex = 0;

function checkPhish(userAnswer) {

  const result =
    document.getElementById("phishResult");

  if (userAnswer === phishEmails[phishIndex].answer) {

    result.textContent = "✅ Correcto";

    result.className =
      "quiz-feedback-msg correct show";

  } else {

    result.textContent = "❌ Incorrecto";

    result.className =
      "quiz-feedback-msg wrong show";
  }

  setTimeout(() => {

    phishIndex++;

    if (phishIndex >= phishEmails.length) {

      document.getElementById("emailText").innerHTML =
        "<strong>🎉 Juego completado</strong><br><br>" +
        "Has identificado correctamente los mensajes.";

      result.style.display = "none";

      markModuleComplete(3);

    } else {

      document.getElementById("emailText").innerHTML =
        "<strong>Correo:</strong><br><br>" +
        phishEmails[phishIndex].text;

      result.className = "quiz-feedback-msg";
    }

  }, 1500);
}

// ============================================
// ACTIVIDAD MODULO 5
// ============================================
function startBreathing() {

  const circle =
    document.getElementById("breathCircle");

  if (!circle) return;

  let cycles = 0;

  function inhale() {

    circle.style.transform = "scale(1.4)";

    circle.textContent = "INHALA";

    setTimeout(exhale, 4000);
  }

  function exhale() {

    circle.style.transform = "scale(1)";

    circle.textContent = "EXHALA";

    cycles++;

    if (cycles >= 3) {

      circle.textContent = "✓";

      markModuleComplete(5);

      return;
    }

    setTimeout(inhale, 4000);
  }

  inhale();
}

// ============================================
// ACTIVIDAD MODULO 4
// ============================================
let ergoSVG, ergoDragTarget = null;

let ergoJoints = {
  head: { x: 520, y: 90 },
  shoulder: { x: 440, y: 160 },
  hip: { x: 410, y: 310 },
  elbow: { x: 530, y: 260 },
  hand: { x: 600, y: 300 },
  knee: { x: 510, y: 420 }
};

const ergoAnkle = { x: 490, y: 500 };

let ergoFurniture = {
  chairSeatY: 400,
  monitorX: 720,
  monitorY: 280
};

const ergoDeskY = 300;

let ergoJointEls = {};
let ergoControlEls = {};

function initErgoGame() {

  ergoSVG =
    document.getElementById('ergoSVG');

  if (!ergoSVG) return;

  drawErgoScene();

  createErgoControls();

  updateErgoGraphics();

  updateErgoScore();
}

function drawErgoScene() {

  const floor =
    document.createElementNS(
      "http://www.w3.org/2000/svg",
      "rect"
    );

  floor.setAttribute("x", "0");
  floor.setAttribute("y", "490");
  floor.setAttribute("width", "900");
  floor.setAttribute("height", "30");
  floor.setAttribute("fill", "#1e2438");

  ergoSVG.appendChild(floor);

  const shadow =
    document.createElementNS(
      "http://www.w3.org/2000/svg",
      "ellipse"
    );

  shadow.setAttribute("cx", "450");
  shadow.setAttribute("cy", "495");
  shadow.setAttribute("rx", "300");
  shadow.setAttribute("ry", "12");
  shadow.setAttribute("fill", "rgba(0,0,0,0.4)");

  ergoSVG.appendChild(shadow);
}

function createErgoControls() {

  const parts =
    ['torso','arm','forearm','thigh','shin'];

  parts.forEach(p => {

    const line =
      document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
      );

    line.setAttribute("stroke", "#333");

let strokeWidth;

if (p === 'torso') {
  strokeWidth = "24";
} else if (p === 'arm' || p === 'thigh') {
  strokeWidth = "18";
} else {
  strokeWidth = "14";
}

line.setAttribute("stroke-width", strokeWidth);

    line.setAttribute("stroke-linecap", "round");

    line.setAttribute("id", "ergo_" + p);

    ergoSVG.appendChild(line);
  });

  const head =
    document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );

  head.setAttribute("fill", "#ddd");
  head.setAttribute("stroke", "#333");
  head.setAttribute("stroke-width", "2");
  head.setAttribute("r", "26");
  head.setAttribute("id", "ergo_headCircle");

  ergoSVG.appendChild(head);

  const chairSeat =
    document.createElementNS(
      "http://www.w3.org/2000/svg",
      "rect"
    );

  chairSeat.setAttribute("x", "310");
  chairSeat.setAttribute("width", "130");
  chairSeat.setAttribute("height", "16");
  chairSeat.setAttribute("rx", "8");
  chairSeat.setAttribute("fill", "#666");
  chairSeat.setAttribute("id", "ergo_chairSeat");

  ergoSVG.appendChild(chairSeat);

  const chairBack =
    document.createElementNS(
      "http://www.w3.org/2000/svg",
      "rect"
    );

  chairBack.setAttribute("x", "310");
  chairBack.setAttribute("width", "20");
  chairBack.setAttribute("rx", "6");
  chairBack.setAttribute("fill", "#444");
  chairBack.setAttribute("id", "ergo_chairBack");

  ergoSVG.appendChild(chairBack);

  const desk =
    document.createElementNS(
      "http://www.w3.org/2000/svg",
      "rect"
    );

  desk.setAttribute("x", "500");
  desk.setAttribute("y", ergoDeskY);
  desk.setAttribute("width", "240");
  desk.setAttribute("height", "14");
  desk.setAttribute("rx", "6");
  desk.setAttribute("fill", "#888");

  ergoSVG.appendChild(desk);

  const monitor =
    document.createElementNS(
      "http://www.w3.org/2000/svg",
      "rect"
    );

  monitor.setAttribute("width", "28");
  monitor.setAttribute("height", "80");
  monitor.setAttribute("rx", "3");
  monitor.setAttribute("fill", "#222");
  monitor.setAttribute("stroke", "#555");
  monitor.setAttribute("stroke-width", "2");
  monitor.setAttribute("id", "ergo_monitor");

  ergoSVG.appendChild(monitor);

  const movable =
    ['head','shoulder','hip','elbow','hand','knee'];

  movable.forEach(j => {

    const c =
      document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle"
      );

    c.setAttribute("r", "8");
    c.setAttribute("fill", "#ef4444");
    c.setAttribute("stroke", "white");
    c.setAttribute("stroke-width", "2");

    c.style.cursor = "grab";

    c.addEventListener(
      "mousedown",
      (e) => startErgoDrag(e, j)
    );

    ergoSVG.appendChild(c);

    ergoJointEls[j] = c;
  });

  const chairC =
    document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );

  chairC.setAttribute("r", "9");
  chairC.setAttribute("fill", "#10b981");
  chairC.setAttribute("stroke", "white");
  chairC.setAttribute("stroke-width", "2");

  chairC.style.cursor = "grab";

  chairC.addEventListener(
    "mousedown",
    (e) => startErgoDrag(e, 'chair')
  );

  ergoSVG.appendChild(chairC);

  ergoControlEls.chair = chairC;

  const monC =
    document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );

  monC.setAttribute("r", "9");
  monC.setAttribute("fill", "#f97316");
  monC.setAttribute("stroke", "white");
  monC.setAttribute("stroke-width", "2");

  monC.style.cursor = "grab";

  monC.addEventListener(
    "mousedown",
    (e) => startErgoDrag(e, 'monitor')
  );

  ergoSVG.appendChild(monC);

  ergoControlEls.monitor = monC;
}

function updateErgoGraphics() {
  const setLine = (id, x1, y1, x2, y2) => {
    const line = document.getElementById('ergo_' + id);
    if (line) {
      line.setAttribute("x1", x1); line.setAttribute("y1", y1);
      line.setAttribute("x2", x2); line.setAttribute("y2", y2);
    }
  };
  setLine('torso', ergoJoints.shoulder.x, ergoJoints.shoulder.y, ergoJoints.hip.x, ergoJoints.hip.y);
  setLine('arm', ergoJoints.shoulder.x, ergoJoints.shoulder.y, ergoJoints.elbow.x, ergoJoints.elbow.y);
  setLine('forearm', ergoJoints.elbow.x, ergoJoints.elbow.y, ergoJoints.hand.x, ergoJoints.hand.y);
  setLine('thigh', ergoJoints.hip.x, ergoJoints.hip.y, ergoJoints.knee.x, ergoJoints.knee.y);
  setLine('shin', ergoJoints.knee.x, ergoJoints.knee.y, ergoAnkle.x, ergoAnkle.y);
  const headC = document.getElementById('ergo_headCircle');
  if (headC) {
    headC.setAttribute("cx", ergoJoints.head.x);
    headC.setAttribute("cy", ergoJoints.head.y - 10);
  }
  const seat = document.getElementById('ergo_chairSeat');
  if (seat) seat.setAttribute("y", ergoFurniture.chairSeatY);
  const back = document.getElementById('ergo_chairBack');
  if (back) {
    back.setAttribute("y", ergoFurniture.chairSeatY - 120);
    back.setAttribute("height", "120");
  }
  const mon = document.getElementById('ergo_monitor');
  if (mon) {
    mon.setAttribute("x", ergoFurniture.monitorX - 14);
    mon.setAttribute("y", ergoFurniture.monitorY - 40);
  }
  for (let j in ergoJointEls) {
    if (ergoJointEls[j]) {
      ergoJointEls[j].setAttribute("cx", ergoJoints[j].x);
      ergoJointEls[j].setAttribute("cy", ergoJoints[j].y + (j==='head'?14:0));
    }
  }
  if (ergoControlEls.chair) {
    ergoControlEls.chair.setAttribute("cx", 375);
    ergoControlEls.chair.setAttribute("cy", ergoFurniture.chairSeatY + 8);
  }
  if (ergoControlEls.monitor) {
    ergoControlEls.monitor.setAttribute("cx", ergoFurniture.monitorX + 10);
    ergoControlEls.monitor.setAttribute("cy", ergoFurniture.monitorY - 50);
  }
}

function startErgoDrag(e, id) {
  e.preventDefault();
  ergoDragTarget = id;
  document.addEventListener("mousemove", onErgoDrag);
  document.addEventListener("mouseup", stopErgoDrag);
}

function onErgoDrag(e) {
  if (!ergoDragTarget) return;
  const rect = ergoSVG.getBoundingClientRect();
  let mx = (e.clientX - rect.left) * (900 / rect.width);
  let my = (e.clientY - rect.top) * (420 / rect.height);
  mx = Math.min(850, Math.max(50, mx));
  my = Math.min(480, Math.max(40, my));
  if (ergoDragTarget === 'chair') {
    ergoFurniture.chairSeatY = Math.min(430, Math.max(320, my - 8));
  } else if (ergoDragTarget === 'monitor') {
    ergoFurniture.monitorX = Math.min(800, Math.max(520, mx - 10));
    ergoFurniture.monitorY = Math.min(340, Math.max(180, my + 50));
  } else if (ergoJoints[ergoDragTarget]) {
    ergoJoints[ergoDragTarget].x = mx;
    ergoJoints[ergoDragTarget].y = my;
    if (ergoDragTarget === 'head') {
      let dx = ergoJoints.head.x - ergoJoints.shoulder.x;
      if (Math.abs(dx) > 70) ergoJoints.head.x = ergoJoints.shoulder.x + Math.sign(dx)*70;
    }
  }
  updateErgoGraphics();
  updateErgoScore();
}

function stopErgoDrag() {
  ergoDragTarget = null;
  document.removeEventListener("mousemove", onErgoDrag);
  document.removeEventListener("mouseup", stopErgoDrag);
}

function getErgoAngle(p1, p2, p3) {
  const a = Math.hypot(p2.x-p1.x, p2.y-p1.y);
  const b = Math.hypot(p2.x-p3.x, p2.y-p3.y);
  const c = Math.hypot(p3.x-p1.x, p3.y-p1.y);
  if (a*b === 0) return 90;
  const ang = Math.acos(Math.max(-1, Math.min(1, (a*a + b*b - c*c)/(2*a*b)))) * 180/Math.PI;
  return Math.round(ang);
}

function updateErgoScore() {
  let headOffset = Math.abs(ergoJoints.head.x - ergoJoints.shoulder.x);
  let headScore = Math.max(0, 20 - (headOffset / 2.5));
  let elbowAng = getErgoAngle(ergoJoints.shoulder, ergoJoints.elbow, ergoJoints.hand);
  let elbowScore = 0;
  if (elbowAng >= 85 && elbowAng <= 100) elbowScore = 20;
  else if (elbowAng >= 75 && elbowAng <= 115) elbowScore = 10;
  else elbowScore = Math.max(0, 20 - Math.abs(elbowAng - 92) * 1.2);
  let kneeAng = getErgoAngle(ergoJoints.hip, ergoJoints.knee, ergoAnkle);
  let kneeScore = 0;
  if (kneeAng >= 85 && kneeAng <= 105) kneeScore = 20;
  else if (kneeAng >= 75 && kneeAng <= 120) kneeScore = 10;
  else kneeScore = Math.max(0, 20 - Math.abs(kneeAng - 95) * 1.2);
  let backOffset = Math.abs(ergoJoints.shoulder.x - ergoJoints.hip.x);
  let backScore = Math.max(0, 20 - (backOffset / 2.2));
  let monitorDist = Math.abs(ergoFurniture.monitorX - (ergoJoints.head.x+10));
  let distScore = 0;
  if (monitorDist >= 150 && monitorDist <= 250) distScore = 20;
  else if (monitorDist >= 120 && monitorDist <= 300) distScore = 12;
  else distScore = Math.max(0, 20 - Math.abs(monitorDist - 200) * 0.2);
  let total = Math.round(Math.min(100, Math.max(0, headScore + elbowScore + kneeScore + backScore + distScore)));

  const scoreEl = document.getElementById('ergoScore');
  const status = document.getElementById('ergoStatus');
  if (scoreEl) scoreEl.textContent = total + '%';

  if (status) {
    if (total >= 95) {
      status.textContent = '¡PERFECTO!';
      status.style.background = 'rgba(34,197,94,0.1)';
      status.style.color = '#22c55e';
    } else if (total >= 70) {
      status.textContent = 'MUY BIEN';
      status.style.background = 'rgba(234,179,8,0.1)';
      status.style.color = '#eab308';
    } else {
      status.textContent = 'CAOS TOTAL';
      status.style.background = 'rgba(239,68,68,0.1)';
      status.style.color = '#ef4444';
    }
  }

  let tip = '';
  if (total < 50) tip = '💀 Postura desastrosa: sube la silla, acerca monitor, flexiona codo y rodilla a 90°.';
  else if (elbowAng < 80 || elbowAng > 105) tip = '🦾 Arrastra el CODO para lograr ángulo de 90°.';
  else if (kneeAng < 80 || kneeAng > 110) tip = '🦵 Ajusta la rodilla y sube/baja la silla para 90°.';
  else if (headOffset > 30) tip = '📌 Lleva la CABEZA hacia atrás alineada con el hombro.';
  else if (monitorDist < 140) tip = '🖥️ Aleja un poco el monitor para la distancia ideal.';
  else tip = '🌟 ¡Excelente trabajo! Todos los parámetros están correctos.';

  if (total >= 95) {
    markModuleComplete(4);
  }

  const tipsEl = document.getElementById('ergoTips');
  if (tipsEl) tipsEl.innerHTML = tip;
}

function resetErgoDisaster() {
  ergoJoints = { head: { x: 520, y: 90 }, shoulder: { x: 440, y: 160 }, hip: { x: 410, y: 310 }, elbow: { x: 530, y: 260 }, hand: { x: 600, y: 300 }, knee: { x: 510, y: 420 } };
  ergoFurniture = { chairSeatY: 400, monitorX: 720, monitorY: 280 };
  updateErgoGraphics();
  updateErgoScore();
}

// ============================================
// SISTEMA DE IDIOMA
// ============================================

let currentLang =
  localStorage.getItem("zennetLang") || "es";

function applyLanguage(lang) {

  currentLang = lang;

  localStorage.setItem("zennetLang", lang);

  document.querySelectorAll("[data-es]").forEach(el => {

   el.innerHTML = el.dataset[lang];
  });

  const btn =
    document.getElementById("langToggle");

  if (btn) {

   btn.textContent = lang.toUpperCase();
  }
}

function toggleLanguage() {

  let newLang;

  if (currentLang === "es") {
    newLang = "en";
  } else {
    newLang = "es";
  }

  applyLanguage(newLang);
}

// ============================================
// INICIALIZACION
// ============================================
window.addEventListener("DOMContentLoaded", () => {

  // ERGONOMIA
  initErgoGame();

  // BOTON IDIOMA
  const btn =
    document.getElementById("langToggle");

  if (btn) {

    btn.addEventListener(
      "click",
      toggleLanguage
    );
  }

  // APLICAR IDIOMA GUARDADO
  applyLanguage(currentLang);

  // VERIFICAR PROGRESO
  updateGlobalProgress();

});