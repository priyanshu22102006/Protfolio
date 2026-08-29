// ── 0. INLINE THEME SYNC & SCROLL LOCK FAILSAFE ──────────────
(function () {
  try {
    var t = localStorage.getItem("pk-theme");
    if (
      t === "dark" ||
      (!t &&
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.setAttribute("data-theme", "dark");
    }
  } catch (e) {}
  setTimeout(function () {
    document.documentElement.style.overflow = "";
    if (document.body) document.body.style.overflow = "";
  }, 3400);
})();

// ── MAIN INTERACTIVE SYSTEM ──────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  // ── 1. GSAP AVAILABILITY GUARD & FALLBACK ──────────────
  if (typeof gsap === "undefined") {
    document.documentElement.style.overflow = "";
    if (document.body) {
      document.body.style.overflow = "";
      document.body.classList.remove("intro-active");
    }
    const overlay = document.getElementById("introOverlay");
    const stage = document.getElementById("introStage");
    if (overlay) overlay.style.display = "none";
    if (stage) stage.style.display = "none";

    document
      .querySelectorAll(
        "nav, .hero-eyebrow, .hero-name, .hero-tagline, .hero-chips, .hero-ctas, .hero-3d-wrap"
      )
      .forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "none";
      });

    document
      .querySelectorAll(
        ".section-chip, .section-title, .about-grid > div, .about-text p, .about-contact-row, .stat-card, .skill-card, .project-card, .timeline-item, .edu-card, .contact-form-wrap, footer"
      )
      .forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "none";
      });

    document.querySelectorAll(".skill-card").forEach((card) => {
      const fill = card.dataset.fill;
      const bar = card.querySelector(".skill-fill");
      if (bar && fill) bar.style.width = fill + "%";
    });
    console.warn("GSAP loaded via fallback rendering.");
    return;
  }

  // Register GSAP plugins
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

  // ── 2. CINEMATIC HERO INTRO TIMELINE ──────────────────
  (function initIntro() {
    const overlay = document.getElementById("introOverlay");
    const stage = document.getElementById("introStage");
    const name = document.getElementById("introName");
    const sub = document.getElementById("introSubtitle");
    const progLine = document.getElementById("introProgressLine");
    const progFill = document.getElementById("introProgressFill");
    const nav = document.querySelector("nav");

    function completeIntro() {
      if (overlay) overlay.style.display = "none";
      if (stage) stage.style.display = "none";
      document.body.classList.remove("intro-active");
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      document
        .querySelectorAll(
          "nav, .hero-eyebrow, .hero-name, .hero-tagline, .hero-chips, .hero-ctas, .hero-3d-wrap"
        )
        .forEach((el) => {
          el.style.opacity = "1";
          el.style.transform = "none";
        });
      ScrollTrigger.refresh();
    }

    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !overlay ||
      !name
    ) {
      completeIntro();
      return;
    }

    document.body.classList.add("intro-active");
    document.documentElement.style.overflow = "hidden";

    let isSkipped = false;
    function skipIntro() {
      if (isSkipped) return;
      isSkipped = true;
      master.kill();
      completeIntro();
      window.removeEventListener("keydown", onKeySkip);
      window.removeEventListener("click", onClickSkip);
    }

    function onKeySkip(e) {
      if (["Escape", " ", "Enter", "ArrowDown"].includes(e.key)) skipIntro();
    }
    function onClickSkip(e) {
      if (e.target.closest("button, a, input, textarea")) return;
      skipIntro();
    }

    window.addEventListener("keydown", onKeySkip, { once: true });
    window.addEventListener("click", onClickSkip, { once: true });

    const master = gsap.timeline({
      onComplete: completeIntro,
    });

    // Stage 1: Progress sweep
    master.to(progLine, { opacity: 1, duration: 0.25, ease: "power2.out" }, 0);
    master.to(
      progFill,
      { scaleX: 1, duration: 1.3, ease: "power2.inOut" },
      0.05
    );

    // Stage 2: Name morph in
    master.to(
      name,
      {
        opacity: 1,
        filter: "blur(0px)",
        scale: 1,
        duration: 0.85,
        ease: "power4.out",
      },
      0.05
    );

    // Stage 3: Subtitle glide
    gsap.set(sub, { y: 12, opacity: 0 });
    master.to(
      sub,
      { opacity: 1, y: 0, duration: 0.5, ease: "power4.out" },
      0.75
    );

    // Stage 4: Intro depart
    master.to(progLine, { opacity: 0, duration: 0.2, ease: "power2.in" }, 1.3);
    master.to(sub, { opacity: 0, y: -10, duration: 0.25, ease: "power2.in" }, 1.3);
    master.to(
      name,
      { opacity: 0, y: -16, filter: "blur(2px)", duration: 0.35, ease: "power2.in" },
      1.38
    );
    master.to(
      overlay,
      { opacity: 0, duration: 0.5, ease: "power2.out" },
      1.45
    );

    // Stage 5: Hero assembly
    const t5 = 1.6;
    master.to(nav, { opacity: 1, y: 0, duration: 0.5, ease: "power4.out" }, t5);
    master.to(
      ".hero-eyebrow",
      { opacity: 1, y: 0, duration: 0.5, ease: "power4.out" },
      t5 + 0.06
    );
    master.to(
      ".hero-name",
      { opacity: 1, y: 0, duration: 0.5, ease: "power4.out" },
      t5 + 0.12
    );
    master.to(
      ".hero-tagline",
      { opacity: 1, y: 0, duration: 0.5, ease: "power4.out" },
      t5 + 0.18
    );
    master.fromTo(
      ".hero-3d-wrap",
      { opacity: 0, y: 16, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "power4.out" },
      t5 + 0.18
    );
    master.to(
      ".hero-chips",
      { opacity: 1, y: 0, duration: 0.5, ease: "power4.out" },
      t5 + 0.24
    );
    master.to(
      ".hero-ctas",
      { opacity: 1, y: 0, duration: 0.5, ease: "power4.out" },
      t5 + 0.3
    );
  })();

  // ── 3. SATIN CAUSTICS BACKGROUND CANVAS ───────────────
  (function initCanvas() {
    const canvas = document.getElementById("bgCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W,
      H,
      t = 0;
    let isRunning = true;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      ctx.scale(dpr, dpr);
    }
    resize();

    let resizeTimer;
    window.addEventListener(
      "resize",
      () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(resize, 100);
      },
      { passive: true }
    );

    const caustics = Array.from({ length: 5 }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.00015,
      vy: (Math.random() - 0.5) * 0.0001,
      r: 0.18 + Math.random() * 0.2,
      phase: Math.random() * Math.PI * 2,
    }));

    function renderScene(advanceTime) {
      if (advanceTime) t += 0.004;

      const isDark =
        document.documentElement.getAttribute("data-theme") === "dark";
      ctx.fillStyle = isDark ? "#0a0a0b" : "#F5F5F7";
      ctx.fillRect(0, 0, W, H);

      const bands = 4;
      for (let i = 0; i < bands; i++) {
        const y = (i / bands + t * 0.025 * (i % 2 === 0 ? 1 : -0.7)) % 1;
        const cy = y * H * 1.6 - H * 0.3;
        const alpha = isDark
          ? 0.035 + Math.sin(t * 0.4 + i * 1.3) * 0.012
          : 0.02 + Math.sin(t * 0.4 + i * 1.3) * 0.007;
        const grad = ctx.createRadialGradient(
          W * 0.5,
          cy,
          0,
          W * 0.5,
          cy,
          W * 0.85
        );
        if (isDark) {
          grad.addColorStop(0, `rgba(0,113,227,${alpha})`);
          grad.addColorStop(0.5, `rgba(30,30,40,${alpha * 0.5})`);
          grad.addColorStop(1, "rgba(10,10,11,0)");
        } else {
          grad.addColorStop(0, `rgba(252,252,253,${alpha + 0.01})`);
          grad.addColorStop(0.5, `rgba(249,249,251,${alpha})`);
          grad.addColorStop(1, "rgba(245,245,247,0)");
        }
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);
      }

      caustics.forEach((c) => {
        if (advanceTime) {
          c.x += c.vx;
          c.y += c.vy;
          if (c.x < 0 || c.x > 1) c.vx *= -1;
          if (c.y < 0 || c.y > 1) c.vy *= -1;
        }
        const pulse = 0.006 + Math.sin(t * 0.8 + c.phase) * 0.003;
        const grad = ctx.createRadialGradient(
          c.x * W,
          c.y * H,
          0,
          c.x * W,
          c.y * H,
          c.r * W
        );
        grad.addColorStop(0, `rgba(255,255,255,${pulse})`);
        grad.addColorStop(0.4, `rgba(250,250,252,${pulse * 0.5})`);
        grad.addColorStop(1, "rgba(245,245,247,0)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);
      });
    }

    window.redrawBgCanvas = function () {
      renderScene(false);
    };

    function draw() {
      if (!isRunning) return;
      renderScene(true);
      requestAnimationFrame(draw);
    }
    draw();

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        isRunning = false;
      } else if (!isRunning) {
        isRunning = true;
        draw();
      }
    });
  })();

  // ── 4. 3D PHOTO TILT CARD ─────────────────────────────
  (function initPhotoTilt() {
    const card = document.getElementById("photoCard");
    if (!card) return;

    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `rotateX(${-y * 18}deg) rotateY(${x * 18}deg) scale(1.03)`;
      const shine = card.querySelector(".photo-3d-shine");
      if (shine) {
        shine.style.background = `radial-gradient(circle at ${(x + 0.5) * 100}% ${(y + 0.5) * 100}%, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.06) 40%, transparent 70%)`;
      }
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "rotateX(0deg) rotateY(0deg) scale(1)";
      card.style.transition = "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)";
      setTimeout(() => {
        card.style.transition = "";
      }, 500);
      const shine = card.querySelector(".photo-3d-shine");
      if (shine) shine.style.background = "";
    });
  })();

  // ── 5. CURSOR & MAGNETIC EFFECTS (Desktop only) ───────
  const isTouch =
    window.matchMedia("(pointer: coarse)").matches || "ontouchstart" in window;
  const cursorDot = document.getElementById("cursorDot");
  const cursorRing = document.getElementById("cursorRing");

  if (isTouch) {
    if (cursorDot) cursorDot.style.display = "none";
    if (cursorRing) cursorRing.style.display = "none";
  } else {
    const glow = document.createElement("div");
    glow.className = "cursor-glow";
    document.body.appendChild(glow);

    let mx = -300,
      my = -300,
      rx = -300,
      ry = -300;
    let cursorReady = false;

    window.addEventListener(
      "mousemove",
      (e) => {
        mx = e.clientX;
        my = e.clientY;
        glow.style.left = mx + "px";
        glow.style.top = my + "px";
        if (cursorDot) {
          cursorDot.style.left = mx + "px";
          cursorDot.style.top = my + "px";
        }
        if (!cursorReady) {
          cursorReady = true;
          rx = mx;
          ry = my;
          if (cursorDot) cursorDot.style.opacity = "1";
          if (cursorRing) cursorRing.style.opacity = "1";
        }
      },
      { passive: true }
    );

    function animCursor() {
      if (cursorReady && cursorRing) {
        rx += (mx - rx) * 0.12;
        ry += (my - ry) * 0.12;
        cursorRing.style.left = rx + "px";
        cursorRing.style.top = ry + "px";
      }
      requestAnimationFrame(animCursor);
    }
    animCursor();

    document
      .querySelectorAll(
        "a, button, .project-card, .skill-card, .edu-card, .stat-card, .timeline-item"
      )
      .forEach((el) => {
        el.addEventListener("mouseenter", () => {
          if (cursorDot) {
            cursorDot.style.width = "14px";
            cursorDot.style.height = "14px";
            cursorDot.style.background = "rgba(0,113,227,0.6)";
          }
          if (cursorRing) {
            cursorRing.style.width = "48px";
            cursorRing.style.height = "48px";
          }
        });
        el.addEventListener("mouseleave", () => {
          if (cursorDot) {
            cursorDot.style.width = "8px";
            cursorDot.style.height = "8px";
            cursorDot.style.background = "var(--accent)";
          }
          if (cursorRing) {
            cursorRing.style.width = "32px";
            cursorRing.style.height = "32px";
          }
        });
      });

    // Magnetic button effect
    function addMagnetic(el, strength = 14) {
      if (!el) return;
      el.addEventListener("mousemove", (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        gsap.to(el, {
          x: x / strength,
          y: y / strength,
          duration: 0.35,
          ease: "power2.out",
        });
      });
      el.addEventListener("mouseleave", () => {
        gsap.to(el, {
          x: 0,
          y: 0,
          duration: 0.6,
          ease: "elastic.out(1, 0.5)",
        });
      });
    }

    addMagnetic(document.getElementById("heroCard"), 36);
    document
      .querySelectorAll(
        ".btn-primary, .btn-ghost, .nav-cta, .theme-toggle"
      )
      .forEach((el) => {
        addMagnetic(el, 10);
      });
  }

  // ── 6. NAV LINK SMOOTH SCROLL ─────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (!href || href === "#") return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      gsap.to(window, {
        scrollTo: { y: target, offsetY: 56 },
        duration: 0.9,
        ease: "power3.inOut",
      });
    });
  });

  // ── 7. SCROLL PROGRESS BAR ────────────────────────────
  window.addEventListener(
    "scroll",
    () => {
      const sc = document.documentElement.scrollTop || window.scrollY;
      const sh = document.documentElement.scrollHeight - window.innerHeight;
      const progressEl = document.getElementById("progress");
      if (progressEl && sh > 0) {
        progressEl.style.width = (sc / sh) * 100 + "%";
      }
    },
    { passive: true }
  );

  // ── 8. SECTION-SPECIFIC ANIMATION ISOLATION ────────────

  // (A) Skills Section — Isolated to .skill-card
  gsap.utils.toArray("#skills .skill-card").forEach((card, i) => {
    const fill = card.dataset.fill;
    const bar = card.querySelector(".skill-fill");
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: card,
        start: "top 88%",
        once: true,
      },
    });
    tl.to(card, {
      opacity: 1,
      y: 0,
      duration: 0.65,
      ease: "back.out(1.2)",
      delay: (i % 3) * 0.06,
    });
    if (bar && fill) {
      tl.to(bar, { width: fill + "%", duration: 1.2, ease: "power2.out" }, "-=0.35");
    }
  });

  // (B) Projects Section — Track interactions & 3D tilt
  (function initProjects() {
    const track = document.querySelector(".projects-track");
    if (!track) return;

    const CARD_WIDTH = 440;

    if (!isTouch) {
      track.querySelectorAll(".project-card").forEach((card) => {
        card.addEventListener("mousemove", (e) => {
          const rect = card.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width - 0.5;
          const y = (e.clientY - rect.top) / rect.height - 0.5;
          card.style.transform = `translateY(-6px) rotateX(${-y * 14}deg) rotateY(${x * 16}deg) scale(1.015)`;
          card.style.setProperty("--shine-x", `${(x + 0.5) * 100}%`);
          card.style.setProperty("--shine-y", `${(y + 0.5) * 100}%`);
          card.classList.add("is-hovered");
        });

        card.addEventListener("mouseleave", () => {
          card.classList.remove("is-hovered");
          card.style.transform = "";
          card.style.removeProperty("--shine-x");
          card.style.removeProperty("--shine-y");
        });
      });

      // Desktop Drag-to-scroll
      let isDown = false,
        startX,
        scrollLeft;
      track.addEventListener("mousedown", (e) => {
        if (e.target.closest("a, button")) return;
        isDown = true;
        track.style.cursor = "grabbing";
        startX = e.pageX - track.offsetLeft;
        scrollLeft = track.scrollLeft;
      });
      window.addEventListener("mousemove", (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - track.offsetLeft;
        const walk = (x - startX) * 1.4;
        track.scrollLeft = scrollLeft - walk;
      });
      window.addEventListener("mouseup", () => {
        isDown = false;
        track.style.cursor = "grab";
      });

      // Boundary-aware wheel scroll on track
      track.addEventListener(
        "wheel",
        (e) => {
          if (e.shiftKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
          const maxScroll = track.scrollWidth - track.clientWidth;
          if (maxScroll <= 0) return;
          const atLeft = track.scrollLeft <= 2 && e.deltaY < 0;
          const atRight =
            Math.ceil(track.scrollLeft) >= maxScroll - 2 && e.deltaY > 0;
          if (!atLeft && !atRight) {
            e.preventDefault();
            track.scrollBy({ left: e.deltaY * 0.9, behavior: "auto" });
          }
        },
        { passive: false }
      );
    }

    const btnL = document.getElementById("projScrollLeft");
    const btnR = document.getElementById("projScrollRight");
    const dragHint = document.getElementById("projDragHint");
    if (btnL)
      btnL.addEventListener("click", () =>
        track.scrollBy({ left: -CARD_WIDTH, behavior: "smooth" })
      );
    if (btnR)
      btnR.addEventListener("click", () =>
        track.scrollBy({ left: CARD_WIDTH, behavior: "smooth" })
      );

    if (dragHint) {
      track.addEventListener(
        "scroll",
        () => {
          if (track.scrollLeft > 25) dragHint.classList.add("hidden");
        },
        { passive: true }
      );
    }
  })();

  // ── AUTOMATIC ADAPTIVE CERTIFICATE IMAGE SIZING ──────────
  (function initAdaptiveCertificates() {
    function adaptCertImage(img) {
      const visual = img.closest(".cert-h-visual");
      if (!visual) return;

      const w = img.naturalWidth;
      const h = img.naturalHeight;
      if (!w || !h) return;

      const ratio = w / h;
      let orientation = "landscape";
      if (ratio < 0.88) {
        orientation = "portrait";
      } else if (ratio >= 0.88 && ratio <= 1.15) {
        orientation = "square";
      } else {
        orientation = "landscape";
      }

      visual.setAttribute("data-orientation", orientation);
      visual.style.setProperty("--cert-aspect-ratio", ratio.toFixed(3));

      const winW = window.innerWidth;
      const winH = window.innerHeight;
      const isSmallMobile = winW <= 580 || winH <= 650;
      const isTablet = winW <= 1024;

      let maxW, maxH;
      if (isSmallMobile) {
        maxW = Math.min(winW - 40, 270);
        maxH = orientation === "portrait" ? 175 : 160;
      } else if (isTablet) {
        maxW = Math.min(winW - 60, 340);
        maxH = orientation === "portrait" ? 220 : 200;
      } else {
        maxW = orientation === "portrait" ? 250 : 380;
        maxH = orientation === "portrait" ? 330 : 250;
      }

      let targetW, targetH;
      if (orientation === "portrait") {
        targetH = maxH;
        targetW = Math.min(targetH * ratio, maxW);
      } else if (orientation === "landscape") {
        targetW = maxW;
        targetH = Math.min(targetW / ratio, maxH);
      } else {
        const size = Math.min(maxW, maxH);
        targetW = size;
        targetH = size;
      }

      visual.style.setProperty("--cert-w", `${Math.round(targetW)}px`);
      visual.style.setProperty("--cert-h", `${Math.round(targetH)}px`);

      img.classList.add("loaded");
      img.classList.remove("error");
    }

    document.querySelectorAll(".cert-img").forEach((img) => {
      if (img.complete && img.naturalWidth > 0) {
        adaptCertImage(img);
      } else {
        img.addEventListener("load", () => adaptCertImage(img));
        img.addEventListener("error", () => {
          img.classList.add("error");
          img.classList.remove("loaded");
        });
      }
    });

    let resizeTimer;
    function handleWindowResize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        document.querySelectorAll(".cert-img.loaded").forEach(adaptCertImage);
        if (typeof ScrollTrigger !== "undefined") {
          ScrollTrigger.refresh();
        }
      }, 120);
    }
    window.addEventListener("resize", handleWindowResize, { passive: true });
    window.addEventListener("orientationchange", handleWindowResize, {
      passive: true,
    });
  })();

  // (C) Certificates Section — Pinned Scrub Timeline (Centered in Viewport)
  const certSection = document.getElementById("certificates");
  const certScaleText = document.getElementById("cert-scale-text");
  const certSub = document.querySelector(".cert-portal-sub");
  const certSlides = document.getElementById("certSlides");
  const slides = gsap.utils.toArray("#certSlides .cert-slide");

  if (certSection && certScaleText && certSlides && slides.length > 0) {
    slides.forEach((s) => gsap.set(s, { opacity: 0, x: 80 }));

    const certTL = gsap.timeline({
      scrollTrigger: {
        trigger: certSection,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.8,
        pin: ".cert-sticky",
        anticipatePin: 1,
        refreshPriority: 1,
      },
    });

    // 1. Zoom out title (anchored at center)
    certTL.to(
      certScaleText,
      { scale: 8, opacity: 0, duration: 0.4, ease: "power2.in" },
      0
    );
    certTL.to(certSub, { opacity: 0, duration: 0.25 }, 0);
    certTL.to(certSlides, { opacity: 1, duration: 0.3 }, 0.2);

    let currentTime = 0.35;
    const slideStep = 0.85;

    slides.forEach((slide, index) => {
      // Slide enters centered
      certTL.to(
        slide,
        { opacity: 1, x: 0, duration: 0.35, ease: "power2.out" },
        currentTime
      );

      if (index < slides.length - 1) {
        // Slide hold -> exit
        certTL.to(
          slide,
          { opacity: 0, x: -80, duration: 0.3, ease: "power2.in" },
          currentTime + 0.55
        );
        currentTime += slideStep;
      } else {
        // Final slide holds comfortably
        certTL.to({}, { duration: 0.4 }, currentTime + 0.5);
      }
    });
  }

  // (D) Activities Section — Timeline items entrance
  gsap.utils.toArray("#activities .timeline-item").forEach((el, i) => {
    gsap.to(el, {
      opacity: 1,
      x: 0,
      duration: 0.75,
      ease: "power3.out",
      delay: i * 0.08,
      scrollTrigger: { trigger: el, start: "top 88%", once: true },
    });
  });

  // (E) Education Section — 3D cards entrance & hover tilt
  gsap.utils.toArray("#education .edu-card").forEach((c, i) => {
    gsap.to(c, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: "back.out(1.2)",
      delay: i * 0.08,
      scrollTrigger: { trigger: c, start: "top 88%", once: true },
    });

    if (!isTouch) {
      c.addEventListener("mousemove", (e) => {
        const rect = c.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        c.style.transform = `translateY(-5px) rotateX(${-y * 12}deg) rotateY(${x * 14}deg) scale(1.014)`;
        c.style.setProperty("--shine-x", `${(x + 0.5) * 100}%`);
        c.style.setProperty("--shine-y", `${(y + 0.5) * 100}%`);
        c.classList.add("is-hovered");
      });
      c.addEventListener("mouseleave", () => {
        c.classList.remove("is-hovered");
        c.style.transform = "";
        c.style.removeProperty("--shine-x");
        c.style.removeProperty("--shine-y");
      });
    }
  });

  // (F) Stats Counter Animation
  function countUp(el) {
    const text = el.textContent.trim();
    const match = text.match(/^(\d+(\.\d+)?)(.*)/);
    if (!match) return;
    const target = parseFloat(match[1]);
    const suffix = match[3];
    const isFloat = match[1].includes(".");
    const duration = 1200;
    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = isFloat
        ? (target * eased).toFixed(1)
        : Math.round(target * eased);
      el.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const statObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          countUp(e.target);
          statObs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  document.querySelectorAll(".stat-num").forEach((el) => statObs.observe(el));

  // (G) About Paragraphs & Contact Box entrance
  const revealObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-done");
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -30px 0px" }
  );

  document
    .querySelectorAll(".about-grid > div, .about-text, .contact-form-wrap")
    .forEach((el) => {
      revealObs.observe(el);
    });

  // ── 9. NAV ACTIVE LINK HIGHLIGHTING ───────────────────
  const allNavLinks = document.querySelectorAll(".nav-links a, #mobileNav a");
  const sections = document.querySelectorAll("section[id]");
  let navRaf = false;

  window.addEventListener(
    "scroll",
    () => {
      if (navRaf) return;
      navRaf = true;
      requestAnimationFrame(() => {
        let activeId = "";
        sections.forEach((s) => {
          const rect = s.getBoundingClientRect();
          if (rect.top <= 140 && rect.bottom >= 140) {
            activeId = s.id;
          }
        });
        if (activeId) {
          allNavLinks.forEach((a) => {
            const href = a.getAttribute("href");
            a.classList.toggle("active", href === "#" + activeId);
          });
        }
        navRaf = false;
      });
    },
    { passive: true }
  );

  // ── 10. UI HELPERS (Theme, Mobile Menu, Email) ────────
  (function initUI() {
    // Mobile Menu
    const navToggle = document.querySelector(".nav-toggle");
    const mobileNav = document.getElementById("mobileNav");

    function closeMobileNav() {
      if (!navToggle || !mobileNav) return;
      navToggle.classList.remove("open");
      mobileNav.hidden = true;
      mobileNav.setAttribute("aria-hidden", "true");
      navToggle.setAttribute("aria-expanded", "false");
    }

    if (navToggle && mobileNav) {
      navToggle.addEventListener("click", (e) => {
        e.stopPropagation();
        const isOpen = navToggle.classList.toggle("open");
        mobileNav.hidden = !isOpen;
        mobileNav.setAttribute("aria-hidden", String(!isOpen));
        navToggle.setAttribute("aria-expanded", String(isOpen));
      });

      mobileNav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closeMobileNav);
      });

      document.addEventListener("click", (e) => {
        if (
          !mobileNav.hidden &&
          !mobileNav.contains(e.target) &&
          !navToggle.contains(e.target)
        ) {
          closeMobileNav();
        }
      });

      window.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && !mobileNav.hidden) closeMobileNav();
      });
    }

    // Dark/Light Theme with Smooth Circular Radial Reveal
    // Light→Dark: new dark snapshot expands | Dark→Light: old dark snapshot contracts
    const themeToggle = document.getElementById("themeToggle");
    let isThemeTransitioning = false;

    if (themeToggle) {
      themeToggle.addEventListener("click", (e) => {
        if (isThemeTransitioning) return;

        const currentTheme =
          document.documentElement.getAttribute("data-theme");
        const systemDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
        const isDark = currentTheme ? currentTheme === "dark" : systemDark;
        const nextTheme = isDark ? "light" : "dark";

        // The function that performs the actual theme state change
        const changeTheme = () => {
          document.documentElement.setAttribute("data-theme", nextTheme);
          localStorage.setItem("pk-theme", nextTheme);
          if (window.redrawBgCanvas) window.redrawBgCanvas();
        };

        const prefersReducedMotion =
          window.matchMedia &&
          window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        // Graceful fallback for unsupported browsers or reduced motion preference
        if (prefersReducedMotion || !document.startViewTransition) {
          changeTheme();
          return;
        }

        // ALWAYS use the exact center of the theme toggle button (viewport coordinates)
        const rect = themeToggle.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;

        // Calculate exact maximum radius to cover all 4 viewport corners
        const maxX = Math.max(x, window.innerWidth - x);
        const maxY = Math.max(y, window.innerHeight - y);
        const radius = Math.hypot(maxX, maxY);

        // Store these values as CSS custom properties
        document.documentElement.style.setProperty("--theme-x", `${x}px`);
        document.documentElement.style.setProperty("--theme-y", `${y}px`);
        document.documentElement.style.setProperty(
          "--theme-radius",
          `${radius}px`
        );

        // Set transition direction so CSS applies the correct z-index layering
        const direction = isDark ? "to-light" : "to-dark";
        document.documentElement.setAttribute("data-transitioning", direction);

        isThemeTransitioning = true;

        const transition = document.startViewTransition(changeTheme);

        transition.ready.then(() => {
          // Determine which pseudo-element to animate and clip-path direction
          // Light→Dark: expand NEW dark snapshot from 0 to full radius
          // Dark→Light: contract OLD dark snapshot from full radius to 0
          const pseudoElement = isDark
            ? "::view-transition-old(root)"
            : "::view-transition-new(root)";

          const clipFrom = isDark
            ? `circle(${radius}px at ${x}px ${y}px)`
            : `circle(0px at ${x}px ${y}px)`;

          const clipTo = isDark
            ? `circle(0px at ${x}px ${y}px)`
            : `circle(${radius}px at ${x}px ${y}px)`;

          document.documentElement.animate(
            { clipPath: [clipFrom, clipTo] },
            {
              duration: 700,
              easing: "cubic-bezier(0.22, 1, 0.36, 1)",
              pseudoElement: pseudoElement,
            }
          );
        });

        transition.finished
          .catch(() => {})
          .finally(() => {
            isThemeTransitioning = false;
            document.documentElement.removeAttribute("data-transitioning");
          });

        // Safety timeout to prevent lock under unexpected browser interruption
        setTimeout(() => {
          isThemeTransitioning = false;
          document.documentElement.removeAttribute("data-transitioning");
        }, 800);
      });
    }

    // Back to Top Button
    const backTop = document.getElementById("footerBackTop");
    if (backTop) {
      backTop.addEventListener("click", () => {
        gsap.to(window, { scrollTo: 0, duration: 1, ease: "power3.inOut" });
      });
    }

    // Dynamic Footer Year
    const footerYear = document.getElementById("footerYear");
    if (footerYear) {
      footerYear.textContent = new Date().getFullYear();
    }
  })();

  // ── 11. CONTACT FORM — GMAIL COMPOSE INTEGRATION ───────
  (function initContactForm() {
    const form = document.getElementById("contactForm");
    const submitBtn = document.getElementById("cfSubmitBtn");
    const feedback = document.getElementById("cfFeedback");
    const nameInput = document.getElementById("cf-name");
    const emailInput = document.getElementById("cf-email");
    const subjectInput = document.getElementById("cf-subject");
    const messageInput = document.getElementById("cf-message");

    if (!form || !submitBtn || !feedback) return;

    const RECIPIENT_EMAIL = "priyanshuchandrasarker2210@gmail.com";

    function showFeedback(type, msg, directUrl) {
      feedback.className = "cf-feedback " + type;
      feedback.innerHTML = "";

      const textSpan = document.createElement("span");
      textSpan.textContent = msg;
      feedback.appendChild(textSpan);

      if (directUrl) {
        const link = document.createElement("a");
        link.href = directUrl;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = "Open Gmail Compose ↗";
        link.setAttribute("aria-label", "Open Gmail Compose in a new tab");
        feedback.appendChild(link);
      }

      feedback.hidden = false;
    }

    function validate() {
      const name = nameInput ? nameInput.value.trim() : "";
      const email = emailInput ? emailInput.value.trim() : "";
      const subject = subjectInput ? subjectInput.value.trim() : "";
      const message = messageInput ? messageInput.value.trim() : "";

      if (!name) {
        showFeedback("error", "Please enter your name.");
        if (nameInput) nameInput.focus();
        return null;
      }
      if (!email) {
        showFeedback("error", "Please enter your email address.");
        if (emailInput) emailInput.focus();
        return null;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showFeedback("error", "Please enter a valid email address.");
        if (emailInput) emailInput.focus();
        return null;
      }
      if (!subject) {
        showFeedback("error", "Please add a subject line.");
        if (subjectInput) subjectInput.focus();
        return null;
      }
      if (!message) {
        showFeedback("error", "Please write a message.");
        if (messageInput) messageInput.focus();
        return null;
      }

      return { name, email, subject, message };
    }

    function handleSubmit(e) {
      if (e) e.preventDefault();
      feedback.hidden = true;

      const values = validate();
      if (!values) return;

      // Formulate clean, direct email body (exact visitor message + signature)
      const bodyContent = `${values.message}\n\nBest regards,\n${values.name}\nEmail: ${values.email}`;

      // Build properly encoded Gmail compose URL
      const gmailUrl =
        "https://mail.google.com/mail/?view=cm&fs=1" +
        "&to=" +
        encodeURIComponent(RECIPIENT_EMAIL) +
        "&su=" +
        encodeURIComponent(values.subject) +
        "&body=" +
        encodeURIComponent(bodyContent);

      // Synchronously open new tab during user gesture to avoid popup blocker
      let newWindow = null;
      try {
        newWindow = window.open(gmailUrl, "_blank", "noopener,noreferrer");
      } catch (err) {
        console.warn("window.open failed:", err);
      }

      if (newWindow && !newWindow.closed) {
        showFeedback(
          "success",
          "Gmail Compose is opening in a new tab. If it didn't open,",
          gmailUrl
        );
      } else {
        showFeedback(
          "info",
          "Popup blocked. Click here to open Gmail Compose:",
          gmailUrl
        );
      }
    }

    submitBtn.addEventListener("click", handleSubmit);
    form.addEventListener("submit", handleSubmit);

    // Clear validation errors when typing in any input field
    [nameInput, emailInput, subjectInput, messageInput].forEach((el) => {
      if (el) {
        el.addEventListener("input", () => {
          feedback.hidden = true;
        });
      }
    });
  })();
});
