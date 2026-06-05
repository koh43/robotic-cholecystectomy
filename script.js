/* ============================================================
   Towards Autonomous Robot-Assisted Surgery — interactions
   ============================================================ */
(function () {
  "use strict";

  const nav = document.getElementById("nav");
  const navToggle = document.getElementById("navToggle");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Sticky nav shadow on scroll ---------- */
  const onScroll = () => {
    if (window.scrollY > 10) nav.classList.add("is-scrolled");
    else nav.classList.remove("is-scrolled");
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Mobile menu ---------- */
  if (navToggle) {
    navToggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(open));
    });
    nav.querySelectorAll(".nav__links a").forEach((a) =>
      a.addEventListener("click", () => {
        nav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      })
    );
  }

  /* ---------- Scroll-spy: highlight active nav link ---------- */
  const sections = Array.from(document.querySelectorAll("main section[id]"));
  const navLinks = Array.from(document.querySelectorAll(".nav__links a"));
  const linkFor = (id) => navLinks.find((a) => a.getAttribute("href") === "#" + id);

  if ("IntersectionObserver" in window) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            navLinks.forEach((l) => l.classList.remove("active"));
            const link = linkFor(entry.target.id);
            if (link) link.classList.add("active");
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((s) => spy.observe(s));
  }

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll(
    ".explain__card, .pipe, .ccard, .feature, .duo, .gallery figure, .repo, .startcard, .pub, .cite, .about, .ack, .stat, .pipeline, .subfeature, .vision-intro, .vision-results"
  );
  revealEls.forEach((el) => el.classList.add("reveal"));

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("in"));
  } else {
    const revObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach((el) => revObserver.observe(el));
  }

  /* ---------- Animated stat counters ---------- */
  const formatNumber = (value, decimals) => {
    if (decimals > 0) return value.toFixed(decimals);
    return Math.round(value).toLocaleString("en-US");
  };

  const animateCount = (el) => {
    const target = parseFloat(el.dataset.count || "0");
    const decimals = parseInt(el.dataset.decimals || "0", 10);
    const prefix = el.dataset.prefix ? el.dataset.prefix + "" : "";
    const suffix = el.dataset.suffix ? el.dataset.suffix + "" : "";
    const dur = 1400;
    const start = performance.now();

    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      el.innerHTML = prefix + '<span class="u">' + formatNumber(target * eased, decimals) + suffix + "</span>";
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const counters = document.querySelectorAll(".stat__num[data-count]");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    counters.forEach((el) => {
      const decimals = parseInt(el.dataset.decimals || "0", 10);
      const prefix = el.dataset.prefix || "";
      const suffix = el.dataset.suffix || "";
      el.innerHTML = prefix + '<span class="u">' + formatNumber(parseFloat(el.dataset.count || "0"), decimals) + suffix + "</span>";
    });
  } else {
    const countObs = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach((el) => countObs.observe(el));
  }

  /* ---------- Lazy-load + autoplay/pause videos ---------- */
  const lazyVideos = document.querySelectorAll("video[data-lazy-video]");
  if ("IntersectionObserver" in window) {
    const vidObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          if (entry.isIntersecting) {
            // load sources the first time it enters the viewport
            if (!video.dataset.loaded) {
              video.querySelectorAll("source[data-src]").forEach((s) => {
                s.src = s.dataset.src;
              });
              video.load();
              video.dataset.loaded = "true";
            }
            const playPromise = video.play();
            if (playPromise && playPromise.catch) playPromise.catch(() => {});
          } else if (video.dataset.loaded) {
            video.pause();
          }
        });
      },
      { threshold: 0.25 }
    );
    lazyVideos.forEach((v) => vidObs.observe(v));
  } else {
    lazyVideos.forEach((video) => {
      video.querySelectorAll("source[data-src]").forEach((s) => (s.src = s.dataset.src));
      video.load();
    });
  }

  /* ---------- Copy-to-clipboard for code blocks ---------- */
  document.querySelectorAll("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const wrapper = btn.closest(".codeblock, .cite");
      const code = wrapper ? wrapper.querySelector("code, pre") : null;
      if (!code) return;
      const text = code.innerText;
      try {
        await navigator.clipboard.writeText(text);
      } catch (e) {
        // Fallback for non-secure contexts
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand("copy"); } catch (_) {}
        document.body.removeChild(ta);
      }
      const original = btn.textContent;
      btn.textContent = "Copied!";
      btn.classList.add("copied");
      setTimeout(() => {
        btn.textContent = original;
        btn.classList.remove("copied");
      }, 1600);
    });
  });
})();
