/* $BULLHOOD — interactions */

(function () {
  "use strict";

  // Nav scroll state
  const nav = document.getElementById("nav");
  const onScroll = () => {
    if (!nav) return;
    nav.classList.toggle("scrolled", window.scrollY > 24);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Mobile menu
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");
  if (toggle && links) {
    toggle.addEventListener("click", () => {
      links.classList.toggle("open");
      toggle.setAttribute(
        "aria-expanded",
        links.classList.contains("open") ? "true" : "false"
      );
    });
    links.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => links.classList.remove("open"));
    });
  }

  // Scroll reveal
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("visible"));
  }

  // Copy contract address
  const copyBtn = document.getElementById("copyCa");
  const caEl = document.getElementById("contractAddress");
  const copyLabel = document.getElementById("copyLabel");
  if (copyBtn && caEl) {
    copyBtn.addEventListener("click", async () => {
      const text = caEl.textContent.trim();
      try {
        await navigator.clipboard.writeText(text);
        copyBtn.classList.add("copied");
        if (copyLabel) copyLabel.textContent = "Copied!";
        setTimeout(() => {
          copyBtn.classList.remove("copied");
          if (copyLabel) copyLabel.textContent = "Copy";
        }, 1800);
      } catch {
        // Fallback
        const range = document.createRange();
        range.selectNodeContents(caEl);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        if (copyLabel) copyLabel.textContent = "Select & copy";
      }
    });
  }

  // Floating forest embers
  const embers = document.getElementById("embers");
  if (embers && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const count = window.innerWidth < 720 ? 18 : 32;
    for (let i = 0; i < count; i++) {
      const e = document.createElement("span");
      e.className = "ember";
      e.style.left = Math.random() * 100 + "%";
      e.style.setProperty("--drift", (Math.random() * 80 - 40) + "px");
      e.style.animationDuration = 8 + Math.random() * 14 + "s";
      e.style.animationDelay = Math.random() * 12 + "s";
      e.style.width = e.style.height = 2 + Math.random() * 3 + "px";
      e.style.opacity = String(0.3 + Math.random() * 0.5);
      embers.appendChild(e);
    }
  }

  // Soft parallax on hero banner
  const banner = document.querySelector(".hero-banner");
  if (banner && window.matchMedia("(pointer: fine)").matches) {
    window.addEventListener(
      "scroll",
      () => {
        const y = window.scrollY;
        if (y < window.innerHeight) {
          banner.style.transform = `translateY(${y * 0.08}px)`;
        }
      },
      { passive: true }
    );
  }

  // Flying leaves only when hovering images
  const leafTrail = document.getElementById("leafTrail");
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (leafTrail && finePointer && !reduceMotion) {
    const LEAF_COLORS = ["#3d8c4a", "#5cb85c", "#2d6a3e", "#7dff9a", "#c9a227", "#8fbc6a", "#1f9d4d"];
    const MAX_ACTIVE = 56;
    let lastSpawn = 0;
    let lastX = 0;
    let lastY = 0;
    let active = 0;
    let hoveredImg = null;

    const leafSvg = (color) =>
      `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path fill="${color}" d="M12 2C12 2 5 8.2 5 14.2c0 3.4 2.6 6.3 7 7.8 4.4-1.5 7-4.4 7-7.8C19 8.2 12 2 12 2z"/>
        <path fill="none" stroke="rgba(5,20,10,0.45)" stroke-width="1.2" stroke-linecap="round" d="M12 4.5v15.5"/>
        <path fill="none" stroke="rgba(5,20,10,0.3)" stroke-width="0.9" stroke-linecap="round" d="M12 9c-2 1.2-3.2 2.8-3.5 4.5M12 11c2 1 3.2 2.5 3.5 4"/>
      </svg>`;

    function spawnLeaf(x, y, vx, vy) {
      if (active >= MAX_ACTIVE) return;

      const leaf = document.createElement("span");
      leaf.className = "cursor-leaf";
      leaf.innerHTML = leafSvg(LEAF_COLORS[(Math.random() * LEAF_COLORS.length) | 0]);

      const size = 12 + Math.random() * 18;
      const angle = Math.atan2(vy, vx) + (Math.random() - 0.5) * 1.6;
      const speed = 55 + Math.random() * 120;
      const dx = Math.cos(angle) * speed + (Math.random() - 0.5) * 50;
      const dy = Math.sin(angle) * speed * 0.3 - (70 + Math.random() * 100);
      const dur = 0.95 + Math.random() * 0.95;
      const rot0 = Math.random() * 360;
      const rot1 = rot0 + (Math.random() > 0.5 ? 1 : -1) * (160 + Math.random() * 280);

      leaf.style.left = x - size / 2 + "px";
      leaf.style.top = y - size / 2 + "px";
      leaf.style.setProperty("--size", size + "px");
      leaf.style.setProperty("--dx", dx + "px");
      leaf.style.setProperty("--dy", dy + "px");
      leaf.style.setProperty("--dur", dur + "s");
      leaf.style.setProperty("--rot0", rot0 + "deg");
      leaf.style.setProperty("--rot1", rot1 + "deg");
      leaf.style.setProperty("--opacity", String(0.75 + Math.random() * 0.25));
      leaf.style.setProperty("--scale-end", String(0.35 + Math.random() * 0.45));
      leaf.style.setProperty("--spin", 0.7 + Math.random() * 1.4 + "s");

      leafTrail.appendChild(leaf);
      active += 1;

      leaf.addEventListener(
        "animationend",
        () => {
          leaf.remove();
          active -= 1;
        },
        { once: true }
      );
    }

    function isLeafImage(el) {
      return el instanceof HTMLImageElement;
    }

    // Burst when first entering an image
    document.addEventListener(
      "mouseover",
      (e) => {
        const img = e.target;
        if (!isLeafImage(img)) return;
        if (hoveredImg === img) return;
        hoveredImg = img;

        const rect = img.getBoundingClientRect();
        const cx = e.clientX || rect.left + rect.width / 2;
        const cy = e.clientY || rect.top + rect.height / 2;

        for (let i = 0; i < 10; i++) {
          spawnLeaf(
            cx + (Math.random() - 0.5) * Math.min(rect.width * 0.4, 80),
            cy + (Math.random() - 0.5) * Math.min(rect.height * 0.4, 60),
            (Math.random() - 0.5) * 2,
            -1 - Math.random()
          );
        }
      },
      { passive: true }
    );

    document.addEventListener(
      "mouseout",
      (e) => {
        if (!isLeafImage(e.target)) return;
        if (hoveredImg === e.target) hoveredImg = null;
      },
      { passive: true }
    );

    // Continuous leaves while moving over an image
    document.addEventListener(
      "mousemove",
      (e) => {
        const img = e.target;
        if (!isLeafImage(img)) return;

        const now = performance.now();
        const x = e.clientX;
        const y = e.clientY;
        const dx = x - lastX;
        const dy = y - lastY;
        const dist = Math.hypot(dx, dy);

        if (dist < 8 || now - lastSpawn < 32) {
          lastX = x;
          lastY = y;
          return;
        }

        lastSpawn = now;
        lastX = x;
        lastY = y;

        const bursts = dist > 36 ? 2 : 1;
        for (let i = 0; i < bursts; i++) {
          spawnLeaf(
            x + (Math.random() - 0.5) * 16,
            y + (Math.random() - 0.5) * 16,
            dx || 1,
            dy || -1
          );
        }
      },
      { passive: true }
    );
  }
})();
