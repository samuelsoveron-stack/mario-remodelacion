(() => {
  "use strict";

  const WA_NUMBER = "5491126579405";

  const WA_MESSAGES = {
    general: "Hola Mario, vi tu página y quisiera consultar por un presupuesto. Necesito realizar un trabajo en __________. Es una __________ y me gustaría saber si podés ayudarme.",
    pintura: "Hola Mario, vi tu página y quisiera consultar por un presupuesto de pintura.\n\nEs para:\n- Tipo de espacio: __________\n- Lugar: __________\n\n¿Podés indicarme cómo podemos coordinar?",
    ambiente: "Hola Mario, vi tu página y quisiera consultar por un presupuesto para una habitación/ambiente.\n\nEs un ambiente de aproximadamente __________ m².\n\nQuisiera saber qué información necesitás para poder presupuestarlo.",
    pared: "Hola Mario, vi tu página y quisiera consultar por un presupuesto para un trabajo en una pared.\n\nEl trabajo que necesito realizar es:\n__________\n\nLa pared mide aproximadamente:\n__________\n\n¿Podés indicarme cómo podemos coordinar?",
    techo: "Hola Mario, vi tu página y quisiera consultar por un presupuesto para un trabajo en un techo.\n\nEl trabajo que necesito realizar es:\n__________\n\nEl espacio mide aproximadamente:\n__________\n\n¿Podés indicarme cómo podemos coordinar?",
    patio: "Hola Mario, vi tu página y quisiera consultar por un presupuesto para un trabajo en un patio/exterior.\n\nEl trabajo que necesito realizar es:\n__________\n\n¿Podés indicarme cómo podemos coordinar?",
    arreglo: "Hola Mario, vi tu página y quisiera consultar por un presupuesto para un arreglo/reparación.\n\nEl problema o trabajo que necesito realizar es:\n__________\n\n¿Podés indicarme cómo podemos coordinar?",
    remodelacion: "Hola Mario, vi tu página y quisiera consultar por un presupuesto de remodelación.\n\nLo que necesito realizar es:\n__________\n\n¿Podés indicarme cómo podemos coordinar?",
    otro: "Hola Mario, vi tu página y quisiera consultar por un presupuesto.\n\nEl trabajo que necesito realizar es:\n__________\n\n¿Podés indicarme cómo podemos coordinar?"
  };

  function buildWaLink(key) {
    const msg = WA_MESSAGES[key] || WA_MESSAGES.general;
    return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
  }

  document.querySelectorAll("[data-wa]").forEach((el) => {
    el.setAttribute("href", buildWaLink(el.getAttribute("data-wa")));
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener");
  });

  /* ---------- Mobile menu ---------- */
  const burgerBtn = document.getElementById("burgerBtn");
  const mobileNav = document.getElementById("mobileNav");

  if (burgerBtn && mobileNav) {
    burgerBtn.addEventListener("click", () => {
      const isOpen = mobileNav.classList.toggle("is-open");
      burgerBtn.setAttribute("aria-expanded", String(isOpen));
      burgerBtn.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
    });

    mobileNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mobileNav.classList.remove("is-open");
        burgerBtn.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Scroll reveal ---------- */
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealEls = document.querySelectorAll(".reveal");

  if (reduceMotion) {
    revealEls.forEach((el) => el.classList.add("in-view"));
  } else if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in-view"));
  }

  /* Hero entrance: staggered fade-in as soon as the DOM is ready (don't wait for images) */
  const heroEls = document.querySelectorAll(".reveal-init");
  requestAnimationFrame(() => {
    heroEls.forEach((el, i) => {
      setTimeout(() => el.classList.add("in-view"), reduceMotion ? 0 : i * 90);
    });
  });

  /* ---------- WhatsApp floating button: fade in once, then static ---------- */
  const waFloat = document.getElementById("waFloat");
  if (waFloat) {
    setTimeout(() => waFloat.classList.add("is-visible"), reduceMotion ? 0 : 900);
  }

  /* ---------- Carousel ---------- */
  const carousel = document.getElementById("carousel");
  const dotsWrap = document.getElementById("carouselDots");
  const prevBtn = document.getElementById("carPrev");
  const nextBtn = document.getElementById("carNext");

  if (carousel && dotsWrap) {
    const items = Array.from(carousel.children);
    items.forEach((_, i) => {
      const dot = document.createElement("span");
      if (i === 0) dot.classList.add("is-active");
      dotsWrap.appendChild(dot);
    });
    const dots = Array.from(dotsWrap.children);

    function updateActiveDot() {
      const scrollLeft = carousel.scrollLeft;
      let closestIndex = 0;
      let closestDist = Infinity;
      items.forEach((item, i) => {
        const dist = Math.abs(item.offsetLeft - carousel.offsetLeft - scrollLeft);
        if (dist < closestDist) { closestDist = dist; closestIndex = i; }
      });
      dots.forEach((d, i) => d.classList.toggle("is-active", i === closestIndex));
    }

    let scrollTimeout;
    carousel.addEventListener("scroll", () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(updateActiveDot, 80);
    }, { passive: true });

    function scrollByItem(direction) {
      const item = items[0];
      const gap = 16;
      const amount = (item.getBoundingClientRect().width + gap) * direction;
      carousel.scrollBy({ left: amount, behavior: reduceMotion ? "auto" : "smooth" });
    }

    if (prevBtn) prevBtn.addEventListener("click", () => scrollByItem(-1));
    if (nextBtn) nextBtn.addEventListener("click", () => scrollByItem(1));
  }

  /* ---------- Lightbox ---------- */
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxCaption = document.getElementById("lightboxCaption");
  const lightboxClose = document.getElementById("lightboxClose");

  function openLightbox(src, caption) {
    lightboxImg.src = src;
    lightboxImg.alt = caption || "";
    lightboxCaption.textContent = caption || "";
    lightbox.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.classList.remove("is-open");
    document.body.style.overflow = "";
  }

  document.querySelectorAll(".lightbox-trigger").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      openLightbox(btn.getAttribute("data-full"), btn.getAttribute("data-caption"));
    });
  });

  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
