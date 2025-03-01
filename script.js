document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("theme-toggle");
  const icon = themeToggle.querySelector("i");
  const logo = document.getElementById("logo");

  // ===============================
  // 1. Función para actualizar el logo según el tema
  // ===============================
  function updateLogo(theme) {
    if (theme === "dark") {
      logo.src = "logo-oscuro.png";
    } else {
      logo.src = "logo-claro.png";
    }
  }

  // ===============================
  // 2. Verifica si hay un tema guardado en localStorage
  // ===============================
  const currentTheme = localStorage.getItem("theme");
  if (currentTheme === "dark") {
    document.body.classList.add("dark-theme");
    icon.classList.replace("fa-moon", "fa-sun");
    updateLogo("dark");
  } else {
    updateLogo("light");
  }

  // ===============================
  // 3. Alternar entre tema claro y oscuro
  // ===============================
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");
    if (document.body.classList.contains("dark-theme")) {
      icon.classList.replace("fa-moon", "fa-sun");
      localStorage.setItem("theme", "dark");
      updateLogo("dark");
    } else {
      icon.classList.replace("fa-sun", "fa-moon");
      localStorage.setItem("theme", "light");
      updateLogo("light");
    }
  });

  // ===============================
  // 4. Manejo de slides y navegación
  // ===============================
  const slides = document.querySelectorAll(".slide");
  const progressBar = document.getElementById("progress-bar");
  const leftButton = document.querySelector(".nav-button.left");
  const rightButton = document.querySelector(".nav-button.right");
  let currentSlide = 0;

  function updateProgressBar() {
    const progress = ((currentSlide + 1) / slides.length) * 100;
    progressBar.style.width = `${progress}%`;
  }

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.style.transform = `translateY(${(i - index) * 100}%)`;
    });
    updateProgressBar();
  }

  function goToNextSlide() {
    currentSlide = currentSlide < slides.length - 1 ? currentSlide + 1 : 0;
    showSlide(currentSlide);
  }

  function goToPrevSlide() {
    currentSlide = currentSlide > 0 ? currentSlide - 1 : slides.length - 1;
    showSlide(currentSlide);
  }

  function handleKeydown(event) {
    const {key} = event;
    if (key === "ArrowDown" || key === "PageDown" || key === "ArrowRight") {
      goToNextSlide();
    } else if (key === "ArrowUp" || key === "PageUp" || key === "ArrowLeft") {
      goToPrevSlide();
    }
  }

  document.addEventListener("keydown", handleKeydown);
  leftButton.addEventListener("click", goToPrevSlide);
  rightButton.addEventListener("click", goToNextSlide);
  showSlide(currentSlide);

  // ===============================
  // (Opcional) Indicadores de navegación
  // ===============================
  /*
      function updateIndicators() {
        const indicatorsContainer = document.querySelector(".indicators");
        indicatorsContainer.innerHTML = "";
        slides.forEach((_, index) => {
          const dot = document.createElement("span");
          if (index === currentSlide) {
            dot.classList.add("active");
          }
          indicatorsContainer.appendChild(dot);
        });
      }
    */

  // ===============================
  // 5. Manejo del formulario
  // ===============================
  const contactForm = document.getElementById("contact-form");
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;

    try {
      const response = await fetch("https://api.tuservidor.com/contact", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({name, email}),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      alert(
        `¡Gracias, ${data.name}! Te contactaremos pronto al correo: ${data.email}.`
      );
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      alert(
        "Hubo un problema al enviar el formulario. Por favor, inténtalo más tarde."
      );
    }
    contactForm.reset();
  });

  // ===============================
  // 6. Controles personalizados para el video
  // ===============================
  const video = document.getElementById("intro-video");
  const playPauseBtn = document.getElementById("play-pause-btn");
  const soundToggleBtn = document.getElementById("sound-toggle-btn");
  const rewindBtn = document.getElementById("rewind-btn");
  const forwardBtn = document.getElementById("forward-btn");

  if (video) {
    // Pausa/Reanuda el video
    playPauseBtn.addEventListener("click", () => {
      if (video.paused) {
        video.play();
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
      } else {
        video.pause();
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
      }
    });

    // Activa/Desactiva el sonido
    soundToggleBtn.addEventListener("click", () => {
      video.muted = !video.muted;
      soundToggleBtn.innerHTML = video.muted
        ? '<i class="fas fa-volume-mute"></i>'
        : '<i class="fas fa-volume-up"></i>';
    });

    // Retrocede 10 segundos
    rewindBtn.addEventListener("click", () => {
      video.currentTime = Math.max(video.currentTime - 10, 0);
    });

    // Adelanta 10 segundos
    forwardBtn.addEventListener("click", () => {
      video.currentTime = Math.min(video.currentTime + 10, video.duration);
    });
  }
});
