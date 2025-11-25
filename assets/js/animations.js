gsap.registerPlugin(ScrollTrigger);

const CONFIG = {
  scrollDistance: 2800,

  targetSize: 50,

  heroSection: "#hero-pin-section",

  svg: "#logo-dots-svg",

  text: ".complex-text",

  colors: { orange: "#E66547", green: "#378457" },

  fills: ["#1AAC66", "#178B53", "#155C3A", "#142D21"],
};

document.addEventListener("DOMContentLoaded", () => {
  const hero = document.querySelector(CONFIG.heroSection);

  const svg = document.querySelector(CONFIG.svg);

  const text = document.querySelector(CONFIG.text);

  if (!hero || !svg || !text) return;

  const paths = Array.from(svg.querySelectorAll("path")).filter((p) =>
    CONFIG.fills.includes(p.getAttribute("fill"))
  );

  if (!paths.length) return;

  let targets = [];

  function computeTargets() {
    const svgR = svg.getBoundingClientRect();

    const textR = text.getBoundingClientRect();

    // Get hero's position RELATIVE TO VIEWPORT (not its bounding rect)
    // Since hero is below fixed header, we need its actual scroll position
    const heroTop = window.scrollY + hero.getBoundingClientRect().top;
    const heroLeft = hero.getBoundingClientRect().left;
    const heroW = hero.offsetWidth;
    const heroH = hero.offsetHeight;

    // Calculate scale per path to reach target size

    const scales = paths.map((p) => {
      const w = p.getBBox().width || 1;

      return CONFIG.targetSize / w;
    });

    targets = paths.map((p, i) => {
      const bb = p.getBBox();

      // Current absolute center position of each dot (in fixed header)

      const startX = svgR.left + bb.x + bb.width / 2;

      const startY = svgR.top + bb.y + bb.height / 2;

      // Target scatter position: random spot in hero section

      // Use current viewport position (not scroll-adjusted)
      const viewportHeroTop = hero.getBoundingClientRect().top;
      const scatterTargetX = heroLeft + gsap.utils.random(60, heroW - 60);
      const scatterTargetY =
        viewportHeroTop + gsap.utils.random(100, heroH - 100);

      // Target converge position: distributed across text

      const convergeTargetX =
        textR.left + (i / (paths.length - 1)) * textR.width;

      const convergeTargetY =
        textR.top + textR.height * 0.5 + gsap.utils.random(-12, 12);

      return {
        // Delta from start position to scatter position

        scatter: {
          x: scatterTargetX - startX,

          y: scatterTargetY - startY,
        },

        // Delta from start position to converge position

        converge: {
          x: convergeTargetX - startX,

          y: convergeTargetY - startY,
        },

        // Scales for each phase

        scale: {
          grow: scales[i] * 0.55,

          scatter: scales[i] * 1.15,

          converge: scales[i] * 0.88,

          absorb: scales[i] * 0.35,
        },
      };
    });
  }

  computeTargets();

  gsap.set(paths, {
    transformOrigin: "50% 50%",

    transformBox: "fill-box",

    force3D: true,
  });

  gsap.set(text, { color: CONFIG.colors.orange });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: hero,

      pin: true,

      start: "top top",

      end: `+=${CONFIG.scrollDistance}`,

      scrub: 1,

      onRefresh: () => {
        computeTargets();

        tl.invalidate();
      },
    },
  });

  // Simplified 4-phase animation

  tl

    // Phase 1: Grow (0 → 0.2)

    .to(
      paths,

      {
        scale: (i) => targets[i].scale.grow,

        opacity: 0.95,

        ease: "power1.out",

        stagger: { amount: 0.1, from: "random" },
      },

      0
    )

    // Phase 2: Scatter (0.15 → 0.5)

    .to(
      paths,

      {
        x: (i) => targets[i].scatter.x,

        y: (i) => targets[i].scatter.y,

        scale: (i) => targets[i].scale.scatter,

        ease: "power2.inOut",

        stagger: { amount: 0.12, from: "random" },
      },

      0.15
    )

    // Phase 3: Converge + Color (0.5 → 0.85)

    .to(
      paths,

      {
        x: (i) => targets[i].converge.x,

        y: (i) => targets[i].converge.y,

        scale: (i) => targets[i].scale.converge,

        opacity: 0.9,

        ease: "power3.inOut",

        stagger: { amount: 0.15, from: "center" },
      },

      0.5
    )

    .to(
      text,

      {
        color: CONFIG.colors.green,

        ease: "power1.inOut",

        duration: 0.2,
      },

      0.6
    )

    // Phase 4: Absorb + Dissolve (0.8 → 1)

    .to(
      paths,

      {
        scale: (i) => targets[i].scale.absorb,

        opacity: 0,

        ease: "power2.in",

        stagger: { amount: 0.08, from: "edges" },
      },

      0.8
    )

    .set(paths, { display: "none" });

  // Responsive handling

  const ro = new ResizeObserver(
    gsap.utils.debounce(() => {
      ScrollTrigger.refresh();
    }, 200)
  );

  ro.observe(hero);
});
