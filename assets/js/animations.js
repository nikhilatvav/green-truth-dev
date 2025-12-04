document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  // --- DATA ---
  const targetDotsData = [
    { x: 124.9, y: 163.6, r: 6.1, color: "#303030", blurLevel: 2 },
    { x: 188.4, y: 100.1, r: 6.1, color: "#303030", blurLevel: 2 },
    { x: 505.8, y: 163.6, r: 6.1, color: "#303030", blurLevel: 2 },
    { x: 289.1, y: 371.9, r: 6.1, color: "#303030", blurLevel: 2 },
    { x: 494.0, y: 376.1, r: 6.1, color: "#303030", blurLevel: 2 },
    { x: 292.4, y: 241.3, r: 6.1, color: "#303030", blurLevel: 2 },
    { x: 515.5, y: 357.9, r: 6.1, color: "#303030", blurLevel: 2 },
    { x: 139.8, y: 440.1, r: 6.1, color: "#303030", blurLevel: 2 },
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
    { x: 178.7, y: 305.7, r: 15.0, color: "#808080", blurLevel: 0.5 },
    { x: 599.7, y: 354.1, r: 15.0, color: "#808080", blurLevel: 0.5 },
    { x: 381.6, y: 381.5, r: 15.0, color: "#808080", blurLevel: 0.5 },
    { x: 467.2, y: 513.5, r: 17.1, color: "#808080", blurLevel: 0.5 },
    { x: 244.2, y: 216.9, r: 15.0, color: "#808080", blurLevel: 0.5 },
    { x: 233.2, y: 173.3, r: 17.1, color: "#999999", blurLevel: 0 },
    { x: 188.2, y: 227.1, r: 17.8, color: "#999999", blurLevel: 0 },
    { x: 381.8, y: 122.9, r: 17.1, color: "#999999", blurLevel: 0 },
    { x: 542.9, y: 277.5, r: 17.8, color: "#999999", blurLevel: 0 },
    { x: 442.3, y: 354.1, r: 17.8, color: "#999999", blurLevel: 0 },
    { x: 55.5, y: 156.2, r: 17.1, color: "#999999", blurLevel: 0 },
    { x: 188.2, y: 354.1, r: 17.8, color: "#999999", blurLevel: 0 },
    { x: 240.0, y: 284.6, r: 22.4, color: "#B3B3B3", blurLevel: 2 },
    { x: 404.2, y: 301.2, r: 22.4, color: "#B3B3B3", blurLevel: 2 },
    { x: 535.9, y: 138.7, r: 22.4, color: "#B3B3B3", blurLevel: 2 },
    { x: 245.9, y: 399.9, r: 23.8, color: "#B3B3B3", blurLevel: 2 },
    { x: 378.8, y: 227.1, r: 23.8, color: "#B3B3B3", blurLevel: 2 },
    { x: 315.3, y: 417.6, r: 22.4, color: "#B3B3B3", blurLevel: 2 },
    { x: 313.0, y: 268.2, r: 23.8, color: "#B3B3B3", blurLevel: 2 },
  ];

  const sourceSvg = document.querySelector("#hero-floating-dots");
  const sourceGroup = sourceSvg.querySelector("g");
  const sourcePaths = sourceSvg.querySelectorAll("path");
  const fixedContainer = document.querySelector("#hero-section > .absolute");
  const targetContainer = document.querySelector("#mandate-target");

  // Data Calculations
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  targetDotsData.forEach((d) => {
    minX = Math.min(minX, d.x - d.r);
    maxX = Math.max(maxX, d.x + d.r);
    minY = Math.min(minY, d.y - d.r);
    maxY = Math.max(maxY, d.y + d.r);
  });
  const dataCenterX = (minX + maxX) / 2;
  const dataCenterY = (minY + maxY) / 2;
  const baseSourceRadius = 12;

  function initAnimation() {
    ScrollTrigger.revert();
    ScrollTrigger.getAll().forEach((t) => t.kill());

    const isMobile = window.innerWidth < 768;

    // Reset all dots to their original state before re-animating
    gsap.set(sourcePaths, {
      x: 0,
      y: 0,
      scale: 1,
      clearProps: "transform"
    });

    // Reset container position
    if (fixedContainer) {
      gsap.set(fixedContainer, {
        top: isMobile ? "10%" : "auto",
        left: isMobile ? "-10%" : "auto",
        y: 0,
        clearProps: isMobile ? "" : "top,left"
      });
    }

    // 1. PIN SETUP
    const pinTrigger = ScrollTrigger.create({
      trigger: "#mandate-section",
      start: isMobile ? "bottom bottom" : "center center+=50",
      end: isMobile ? "+=250" : "+=20",
      pin: true,
      anticipatePin: 1,
      scrub: isMobile ? 1 : 2
    });

    // 2. MOVEMENT SETUP
    const moveTl = gsap.timeline({
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: () => pinTrigger.start,
        scrub: isMobile ? 0.5 : 0,
        invalidateOnRefresh: true
      }
    });

    moveTl.to(sourceGroup, { opacity: 1, duration: 0.1 }, 0);

    // Mobile: Animate container position from offset to centered
    if (isMobile && fixedContainer) {
      moveTl.fromTo(
        fixedContainer, 
        { top: "15%", left: "-15%" },  // Start further away for smoother entry
        { top: "15%", left: "-9%", ease: "power1.inOut", duration: 1 },  // End slightly offset with easing
        0
      );
    }

    // 3. TARGET CALCULATION
    const mandateSection = document.querySelector("#mandate-section");
    const mandateSectionRect = mandateSection.getBoundingClientRect();
    const targetRect = targetContainer.getBoundingClientRect();
    
    const destCenterX = isMobile 
      ? window.innerWidth / 2 
      : targetRect.left + (targetRect.width / 2);
    
    const targetOffsetFromBottom = isMobile 
      ? mandateSectionRect.bottom - targetRect.bottom
      : 0;
      
    const destCenterY = isMobile
      ? window.innerHeight - targetOffsetFromBottom - (targetRect.height / 2)
      : targetRect.top + (targetRect.height / 2);
    
    const scaleFactor = isMobile ? 0.35 : 0.85;  // Changed from 0.45 to 0.35 for smaller dots

    sourcePaths.forEach((path, i) => {
      const d = targetDotsData[i % targetDotsData.length];
      
      const dotRect = path.getBoundingClientRect();
      const dotCurrentX = dotRect.left + (dotRect.width / 2);
      const dotCurrentY = dotRect.top + (dotRect.height / 2);

      const offsetX = (d.x - dataCenterX) * scaleFactor;
      const offsetY = (d.y - dataCenterY) * scaleFactor;

      const finalX = destCenterX + offsetX;
      const finalY = destCenterY + offsetY;

      moveTl.to(path, {
        x: finalX - dotCurrentX,
        y: finalY - dotCurrentY,
        scale: (d.r / baseSourceRadius) * scaleFactor,
        fill: d.color,
        filter: d.blurLevel > 0 ? "blur(4px)" : "none",
        opacity: 1,
        ease: "none", 
        duration: 1
      }, 0);
    });

    // 4. EXIT SETUP (Mobile Only)
    if (isMobile && fixedContainer) {
      gsap.to(fixedContainer, {
        y: -window.innerHeight * 1.5,
        ease: "none",
        scrollTrigger: {
          trigger: "body",
          start: () => pinTrigger.end, 
          end: "+=1000",
          scrub: 0
        }
      });
    }
  }

  window.addEventListener("load", initAnimation);
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(initAnimation, 200);
  });
});