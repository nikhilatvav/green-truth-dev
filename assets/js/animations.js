document.addEventListener("DOMContentLoaded", () => {
  // Register GSAP plugins
  gsap.registerPlugin(ScrollTrigger);

  // --- 1. DEFINE THE TARGET DATA ---
  // This data is a precise mapping of the dots in your reference image.
  const targetDotsData = [
    // --- LAYER 1: Darkest / Smallest / Blur Level 2 ---
    { x: 124.9, y: 163.6, r: 6.1, color: "#303030", blurLevel: 2 },
    { x: 188.4, y: 100.1, r: 6.1, color: "#303030", blurLevel: 2 },
    { x: 505.8, y: 163.6, r: 6.1, color: "#303030", blurLevel: 2 },
    { x: 289.1, y: 371.9, r: 6.1, color: "#303030", blurLevel: 2 },
    { x: 494.0, y: 376.1, r: 6.1, color: "#303030", blurLevel: 2 },
    { x: 292.4, y: 241.3, r: 6.1, color: "#303030", blurLevel: 2 },
    { x: 515.5, y: 357.9, r: 6.1, color: "#303030", blurLevel: 2 },
    { x: 139.8, y: 440.1, r: 6.1, color: "#303030", blurLevel: 2 },

    // --- LAYER 2: Medium Dark / Medium Size / Blur Level 1 ---
    { x: 199.3, y: 151.8, r: 11.8, color: "#606060", blurLevel: 1 },
    { x: 98.0, y: 238.9, r: 11.8, color: "#606060", blurLevel: 1 },
    { x: 476.2, y: 11.8, r: 11.8, color: "#606060", blurLevel: 1 },
    { x: 424.5, y: 156.2, r: 11.8, color: "#606060", blurLevel: 1 },
    { x: 530.0, y: 203.3, r: 11.8, color: "#606060", blurLevel: 1 },
    { x: 206.0, y: 45.4, r: 11.8, color: "#606060", blurLevel: 1 },
    { x: 442.3, y: 417.6, r: 11.8, color: "#606060", blurLevel: 1 },
    { x: 330.5, y: 94.0, r: 11.8, color: "#606060", blurLevel: 1 },
    { x: 378.8, y: 481.2, r: 11.8, color: "#606060", blurLevel: 1 },
    { x: 217.6, y: 459.2, r: 11.8, color: "#606060", blurLevel: 1 },
    { x: 80.7, y: 376.1, r: 11.8, color: "#606060", blurLevel: 1 },
    { x: 251.6, y: 348.4, r: 11.8, color: "#606060", blurLevel: 1 },

    // --- LAYER 3: Medium Light / Medium Large / Blur Level 0.5 ---
    { x: 178.7, y: 305.7, r: 15.0, color: "#808080", blurLevel: 0.5 },
    { x: 599.7, y: 354.1, r: 15.0, color: "#808080", blurLevel: 0.5 },
    { x: 381.6, y: 381.5, r: 15.0, color: "#808080", blurLevel: 0.5 },
    { x: 467.2, y: 513.5, r: 17.1, color: "#808080", blurLevel: 0.5 },
    { x: 244.2, y: 216.9, r: 15.0, color: "#808080", blurLevel: 0.5 },

    // --- LAYER 4: Light Grey / Sharp / No Blur ---
    { x: 233.2, y: 173.3, r: 17.1, color: "#999999", blurLevel: 0 },
    { x: 188.2, y: 227.1, r: 17.8, color: "#999999", blurLevel: 0 },
    { x: 381.8, y: 122.9, r: 17.1, color: "#999999", blurLevel: 0 },
    { x: 542.9, y: 277.5, r: 17.8, color: "#999999", blurLevel: 0 },
    { x: 442.3, y: 354.1, r: 17.8, color: "#999999", blurLevel: 0 },
    { x: 55.5, y: 156.2, r: 17.1, color: "#999999", blurLevel: 0 },
    { x: 188.2, y: 354.1, r: 17.8, color: "#999999", blurLevel: 0 },

    // --- LAYER 5: Lightest / Largest / Blur Level 2 ---
    { x: 240.0, y: 284.6, r: 22.4, color: "#B3B3B3", blurLevel: 2 },
    { x: 404.2, y: 301.2, r: 22.4, color: "#B3B3B3", blurLevel: 2 },
    { x: 535.9, y: 138.7, r: 22.4, color: "#B3B3B3", blurLevel: 2 },
    { x: 245.9, y: 399.9, r: 23.8, color: "#B3B3B3", blurLevel: 2 },
    { x: 378.8, y: 227.1, r: 23.8, color: "#B3B3B3", blurLevel: 2 },
    { x: 315.3, y: 417.6, r: 22.4, color: "#B3B3B3", blurLevel: 2 },
    { x: 313.0, y: 268.2, r: 23.8, color: "#B3B3B3", blurLevel: 2 },
  ];

  const baseSourceRadius = 12;

  // --- 2. SETUP DOM ELEMENTS ---
  const sourceSvg = document.querySelector("#hero-floating-dots");
  const sourceGroup = sourceSvg.querySelector("g");
  const sourcePaths = sourceSvg.querySelectorAll("path");
  const targetContainer = document.querySelector("#mandate-target");

  // --- 3. ANIMATION FUNCTION ---
  function initDotAnimation() {
    // 1. CLEANUP: Revert GSAP to get clean CSS positions
    // This is critical. It removes all previous transforms/pins so we measure the "natural" layout.
    ScrollTrigger.revert();
    ScrollTrigger.getAll().forEach((t) => t.kill());

    // 2. MEASURE: Get absolute positions
    // We use window.scrollY to get the absolute position on the document,
    // ensuring calculations are independent of the current scroll state.
    const targetRect = targetContainer.getBoundingClientRect();
    const targetCenterX =
      targetRect.left + window.scrollX + targetRect.width / 2;
    const targetCenterY =
      targetRect.top + window.scrollY + targetRect.height / 2;

    // --- 3. CLUSTER CALCULATION (To fit dots inside the box) ---
    let minX = Infinity,
      maxX = -Infinity,
      minY = Infinity,
      maxY = -Infinity;

    targetDotsData.forEach((d) => {
      minX = Math.min(minX, d.x - d.r);
      maxX = Math.max(maxX, d.x + d.r);
      minY = Math.min(minY, d.y - d.r);
      maxY = Math.max(maxY, d.y + d.r);
    });

    const clusterWidth = maxX - minX;
    const clusterHeight = maxY - minY;

    // The center of the data cluster itself
    const dataCenterX = (minX + maxX) / 2;
    const dataCenterY = (minY + maxY) / 2;

    // Calculate Scale to fit container (with 10% padding)
    const availableWidth = targetRect.width * 0.9;
    const availableHeight = targetRect.height * 0.9;
    const scaleX = targetRect.width > 0 ? availableWidth / clusterWidth : 1;
    const scaleY = targetRect.height > 0 ? availableHeight / clusterHeight : 1;
    const responsiveScale = Math.min(1, scaleX, scaleY);

    // --- 4. PINNING CONFIGURATION ---
    const pinDuration = 800; // Increased duration for smoother/slower effect

    // --- 5. PIN TRIGGER ---
    const pinTrigger = ScrollTrigger.create({
      trigger: "#mandate-section",
      start: "center center+=50",
      end: `+=${pinDuration}`,
      pin: true,
      markers: true,
      id: "mandate-pin",
    });

    // --- 6. TIMELINE ---
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: () => pinTrigger.end,
        scrub: 1, // Reduced slightly from 1.5 to prevent excessive lag
        invalidateOnRefresh: true,
      },
    });

    // Fade in source group
    tl.to(sourceGroup, { opacity: 1, duration: 1, ease: "none" }, 0);

    // --- 7. ANIMATE EACH DOT ---
    sourcePaths.forEach((path, i) => {
      const targetData = targetDotsData[i % targetDotsData.length];

      // A. Get the dot's CURRENT position in ABSOLUTE DOCUMENT PIXELS
      const dotRect = path.getBoundingClientRect();
      const dotPixelX = dotRect.left + window.scrollX + dotRect.width / 2;
      const dotPixelY = dotRect.top + window.scrollY + dotRect.height / 2;

      // B. Calculate where it needs to go RELATIVE to the TARGET CENTER
      const relativeDestX = (targetData.x - dataCenterX) * responsiveScale;
      const relativeDestY = (targetData.y - dataCenterY) * responsiveScale;

      // C. Calculate the EXACT PIXEL DISTANCE to move
      const moveX = targetCenterX + relativeDestX - dotPixelX;

      // For Y, we ADD pinDuration.
      // The source dots scroll UP (away) while the target is pinned.
      // To land on the target, the dots must travel 'down' that extra distance.
      const moveY = targetCenterY + relativeDestY - dotPixelY + pinDuration;

      // D. Scaling Calculation
      const targetScale = (targetData.r / baseSourceRadius) * responsiveScale;

      tl.to(
        path,
        {
          x: moveX,
          y: moveY,
          scale: targetScale,
          fill: targetData.color,
          filter: targetData.blur ? "blur(4px)" : "none",
          opacity: 1,
          transformOrigin: "50% 50%",
          ease: "power1.inOut",
          duration: 1,
        },
        0
      );
    });
  }

  // --- 8. EXECUTION ---
  window.addEventListener("load", initDotAnimation);

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    // Debounce resize to prevent performance hits
    resizeTimer = setTimeout(initDotAnimation, 250);
  });
});
