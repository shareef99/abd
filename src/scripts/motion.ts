/* ============================================================================
   NZ Constructions — global motion engine
   Lenis smooth scroll + GSAP ScrollTrigger orchestration.
   Progressive enhancement: content is visible by default; JS only adds motion.
   ============================================================================ */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

/* --------------------------------------------------------- smooth scroll --- */
function setupLenis() {
  const lenis = new Lenis({
    lerp: 0.085,
    wheelMultiplier: 1,
    smoothWheel: true,
  });
  (window as any).__lenis = lenis;
  document.documentElement.classList.add("lenis");

  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // anchor links
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        lenis.scrollTo(target as HTMLElement, { offset: -90, duration: 1.4 });
      }
    });
  });
}

/* ------------------------------------------------------------- split text --- */
function splitToWords(el: HTMLElement) {
  const text = el.textContent ?? "";
  el.setAttribute("aria-label", text);
  el.textContent = "";
  const frag = document.createDocumentFragment();
  text.split(/(\s+)/).forEach((token) => {
    if (token.trim() === "") {
      frag.appendChild(document.createTextNode(token));
      return;
    }
    const outer = document.createElement("span");
    outer.className = "split-word";
    outer.style.display = "inline-block";
    outer.style.overflow = "hidden";
    outer.style.verticalAlign = "top";
    outer.style.paddingBottom = "0.14em";
    outer.style.marginBottom = "-0.14em";
    const inner = document.createElement("span");
    inner.className = "split-inner";
    inner.style.display = "inline-block";
    inner.style.willChange = "transform";
    inner.textContent = token;
    outer.appendChild(inner);
    frag.appendChild(outer);
  });
  el.setAttribute("aria-hidden", "false");
  el.appendChild(frag);
}

/**
 * Fire `cb` once when the element enters the viewport. If it's already in view
 * at setup, run immediately. Avoids the gsap.from()+ScrollTrigger.refresh()
 * "stuck hidden" pitfall by using gsap.set + gsap.to instead of .from().
 */
function whenInView(trigger: HTMLElement, start: string, cb: () => void) {
  const r = trigger.getBoundingClientRect();
  const vh = window.innerHeight || document.documentElement.clientHeight;
  if (r.top <= vh * 0.92 && r.bottom >= 0) {
    cb();
  } else {
    ScrollTrigger.create({ trigger, start, once: true, onEnter: cb });
  }
}

function setupSplit() {
  gsap.utils.toArray<HTMLElement>("[data-split]").forEach((el) => {
    splitToWords(el);
    const inners = gsap.utils.toArray<HTMLElement>(".split-inner", el);
    if (el.hasAttribute("data-hero")) return; // hero timeline handles these
    gsap.set(inners, { yPercent: 118 });
    whenInView(el, "top 88%", () =>
      gsap.to(inners, { yPercent: 0, duration: 1.15, ease: "expo.out", stagger: 0.05 })
    );
  });
}

/* --------------------------------------------------------------- reveals --- */
function setupReveals() {
  gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
    const y = parseFloat(el.dataset.reveal || "36");
    const delay = parseFloat(el.dataset.revealDelay || "0");
    gsap.set(el, { opacity: 0, y });
    whenInView(el, "top 90%", () =>
      gsap.to(el, { opacity: 1, y: 0, duration: 1.1, delay, ease: "power3.out" })
    );
  });

  gsap.utils.toArray<HTMLElement>("[data-reveal-stagger]").forEach((group) => {
    const kids = gsap.utils.toArray<HTMLElement>(":scope > *", group);
    const y = parseFloat(group.dataset.revealStagger || "44");
    gsap.set(kids, { opacity: 0, y });
    whenInView(group, "top 88%", () =>
      gsap.to(kids, { opacity: 1, y: 0, duration: 1, ease: "power3.out", stagger: 0.09 })
    );
  });

  // clip-path image reveals
  gsap.utils.toArray<HTMLElement>("[data-reveal-clip]").forEach((el) => {
    gsap.set(el, { clipPath: "inset(0 0 100% 0)" });
    whenInView(el, "top 88%", () =>
      gsap.to(el, { clipPath: "inset(0 0 0% 0)", duration: 1.4, ease: "expo.out" })
    );
  });
}

/* -------------------------------------------------------------- parallax --- */
function setupParallax() {
  gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
    const speed = parseFloat(el.dataset.parallax || "1");
    gsap.fromTo(
      el,
      { yPercent: 9 * speed },
      {
        yPercent: -9 * speed,
        ease: "none",
        scrollTrigger: {
          trigger: el.closest("[data-parallax-scope]") || el,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.6,
        },
      }
    );
  });

  // oversized images that drift inside a clipped frame
  gsap.utils.toArray<HTMLElement>("[data-parallax-img]").forEach((img) => {
    gsap.fromTo(
      img,
      { yPercent: -8 },
      {
        yPercent: 8,
        ease: "none",
        scrollTrigger: {
          trigger: img.parentElement || img,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      }
    );
  });
}

/* -------------------------------------------------------------- counters --- */
function setupCounters() {
  gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
    const end = parseFloat(el.dataset.count || "0");
    const suffix = el.dataset.suffix || "";
    if (reduced) {
      el.textContent = `${end}${suffix}`;
      return;
    }
    el.textContent = `0${suffix}`;
    const obj = { v: 0 };
    ScrollTrigger.create({
      trigger: el,
      start: "top 90%",
      once: true,
      onEnter: () =>
        gsap.to(obj, {
          v: end,
          duration: 2.1,
          ease: "power2.out",
          onUpdate: () => {
            el.textContent = `${Math.round(obj.v)}${suffix}`;
          },
        }),
    });
  });
}

/* ------------------------------------------------ pinned horizontal track --- */
function setupHorizontal() {
  const mm = gsap.matchMedia();
  mm.add("(min-width: 1024px)", () => {
    gsap.utils.toArray<HTMLElement>("[data-hscroll]").forEach((section) => {
      const track = section.querySelector<HTMLElement>("[data-hscroll-track]");
      if (!track) return;
      const distance = () => track.scrollWidth - window.innerWidth + 96;
      gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => "+=" + distance(),
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
    });
  });
}

/* ----------------------------------------------------- pinned scrollytell --- */
function setupScrollyScale() {
  gsap.utils.toArray<HTMLElement>("[data-scale-in]").forEach((el) => {
    gsap.fromTo(
      el,
      { scale: 0.82, borderRadius: "2.75rem" },
      {
        scale: 1,
        borderRadius: "0rem",
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
          end: "top 10%",
          scrub: 0.8,
        },
      }
    );
  });
}

/* ----------------------------------------------------------------- nav UI --- */
function setupNav() {
  const nav = document.querySelector<HTMLElement>("[data-nav]");
  if (!nav) return;
  const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 24);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

function setupProgress() {
  const bar = document.querySelector<HTMLElement>("[data-progress]");
  if (!bar) return;
  gsap.to(bar, {
    scaleX: 1,
    ease: "none",
    scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
  });
}

/* ----------------------------------------------------------- custom cursor --- */
function setupCursor() {
  const ring = document.createElement("div");
  ring.className = "cursor-ring";
  const dot = document.createElement("div");
  dot.className = "cursor-dot";
  document.body.append(ring, dot);

  const rx = gsap.quickTo(ring, "x", { duration: 0.5, ease: "power3" });
  const ry = gsap.quickTo(ring, "y", { duration: 0.5, ease: "power3" });
  const dx = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power3" });
  const dy = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power3" });

  window.addEventListener("pointermove", (e) => {
    rx(e.clientX - 19);
    ry(e.clientY - 19);
    dx(e.clientX - 2.5);
    dy(e.clientY - 2.5);
  });

  const hoverables = "a, button, [data-cursor], input, textarea, select, label";
  document.querySelectorAll(hoverables).forEach((el) => {
    el.addEventListener("mouseenter", () => ring.classList.add("is-hover"));
    el.addEventListener("mouseleave", () => ring.classList.remove("is-hover"));
  });
}

/* --------------------------------------------------------------- magnetic --- */
function setupMagnetic() {
  gsap.utils.toArray<HTMLElement>("[data-magnetic]").forEach((el) => {
    const strength = parseFloat(el.dataset.magnetic || "0.4");
    const xTo = gsap.quickTo(el, "x", { duration: 0.7, ease: "elastic.out(1, 0.45)" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.7, ease: "elastic.out(1, 0.45)" });
    el.addEventListener("mousemove", (e) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * strength);
      yTo((e.clientY - (r.top + r.height / 2)) * strength);
    });
    el.addEventListener("mouseleave", () => {
      xTo(0);
      yTo(0);
    });
  });
}

/* ------------------------------------------------------------- card tilt --- */
function setupTilt() {
  gsap.utils.toArray<HTMLElement>("[data-tilt]").forEach((card) => {
    const max = parseFloat(card.dataset.tilt || "7");
    card.style.transformStyle = "preserve-3d";
    const rxTo = gsap.quickTo(card, "rotationX", { duration: 0.5, ease: "power3" });
    const ryTo = gsap.quickTo(card, "rotationY", { duration: 0.5, ease: "power3" });
    gsap.set(card, { transformPerspective: 900 });
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      ryTo(px * max);
      rxTo(-py * max);
    });
    card.addEventListener("mouseleave", () => {
      rxTo(0);
      ryTo(0);
    });
  });
}

/* --------------------------------------------------------------- hero in --- */
function setupHeroIntro() {
  const hero = document.querySelector("[data-hero]");
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: "expo.out" }, delay: 0.15 });
  tl.from("[data-hero] .split-inner", { yPercent: 120, duration: 1.25, stagger: 0.07 })
    .from("[data-hero-fade]", { y: 26, opacity: 0, duration: 1, stagger: 0.1 }, "-=0.85")
    .from("[data-hero-chip]", { scale: 0.6, opacity: 0, duration: 0.8, stagger: 0.08 }, "-=0.9");
}

/* ------------------------------------------------------------------ init --- */
function init() {
  gsap.registerPlugin(ScrollTrigger);
  document.documentElement.classList.add("motion-ready");

  if (reduced) {
    setupNav();
    setupCounters();
    return;
  }

  setupLenis();
  setupSplit();
  setupReveals();
  setupParallax();
  setupCounters();
  setupHorizontal();
  setupScrollyScale();
  setupNav();
  setupProgress();
  setupHeroIntro();
  if (fine) {
    setupCursor();
    setupMagnetic();
    setupTilt();
  }

  // Recompute once everything (images/fonts) has settled.
  window.addEventListener("load", () => ScrollTrigger.refresh());
  if (document.fonts?.ready) {
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
  init();
}
