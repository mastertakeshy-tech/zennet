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
