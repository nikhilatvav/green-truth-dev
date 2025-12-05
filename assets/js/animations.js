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
  const targetContainer = document.querySelector("#mandate-target");
  const complianceCircle = document.querySelector("#compliance-circle-target");
  const globalCenterX = window.innerWidth / 2;
  const globalCenterY = window.innerHeight / 2;

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

    // Reset initial state
    gsap.set(sourcePaths, {
      x: 0,
      y: 0,
      scale: 1,
      clearProps: "transform"
    });
    
    // Hide content initially
    gsap.set([
      "#compliance-heading",
      "#compliance-li-1",
      "#compliance-li-2",
      "#compliance-li-3",
      "#compliance-text-1",
      "#compliance-text-2",
      "#compliance-link"
    ], { opacity: 0, y: 30 });

    // ======================================
    // PHASE 1: HERO -> MANDATE
    // ======================================
    const pinTrigger = ScrollTrigger.create({
      trigger: "#mandate-section",
      start: isMobile ? "bottom bottom" : "center center+=50",
      end: isMobile ? "+=250" : "+=20",
      pin: true,
      anticipatePin: 1,
      scrub: isMobile ? 1 : 2
    });

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

    // Calculate Mandate Targets
    const mandateSection = document.querySelector("#mandate-section");
    const mandateSectionRect = mandateSection.getBoundingClientRect();
    const targetRect = targetContainer.getBoundingClientRect();
    
    // Mandate Center Coordinates
    let mandateCenterX, mandateCenterY;

    if (isMobile) {
       mandateCenterX = window.innerWidth / 2;
       const mandateOffsetFromBottom = mandateSectionRect.bottom - targetRect.bottom;
       const targetCenterFromBottom = mandateOffsetFromBottom + (targetRect.height / 2);
       mandateCenterY = window.innerHeight - targetCenterFromBottom;
    } else {
       // Desktop: Pin is at center center+=50
       const sectionCenterY = mandateSectionRect.top + (mandateSectionRect.height / 2);
       const targetCenterY_initial = targetRect.top + (targetRect.height / 2);
       const offsetFromSectionCenter = targetCenterY_initial - sectionCenterY;
       const pinPointY = (window.innerHeight / 2) + 50;
       
       mandateCenterY = pinPointY + offsetFromSectionCenter;
       mandateCenterX = targetRect.left + (targetRect.width / 2);
    }
    
    const mandateScaleFactor = isMobile ? 0.35 : 0.85;

    // Apply Phase 1 Animation
    sourcePaths.forEach((path, i) => {
      const d = targetDotsData[i % targetDotsData.length];
      const dotRect = path.getBoundingClientRect();
      const dotOriginX = dotRect.left + (dotRect.width / 2);
      const dotOriginY = dotRect.top + (dotRect.height / 2);

      const offsetX = (d.x - dataCenterX) * mandateScaleFactor;
      const offsetY = (d.y - dataCenterY) * mandateScaleFactor;

      moveTl.to(path, {
        x: (mandateCenterX + offsetX) - dotOriginX,
        y: (mandateCenterY + offsetY) - dotOriginY,
        scale: (d.r / baseSourceRadius) * mandateScaleFactor,
        fill: d.color,
        filter: d.blurLevel > 0 ? "blur(4px)" : "none",
        opacity: 1,
        ease: "none", 
        duration: 1,
        immediateRender: false 
      }, 0);
    });

    // ======================================
    // PHASE 2: MANDATE -> COMPLIANCE
    // ======================================
    
    // Calculate Compliance Center
    const complianceSection = document.querySelector("#compliance-section");
    const complianceSectionRect = complianceSection.getBoundingClientRect();
    const circleRect = complianceCircle.getBoundingClientRect();
    
    const circleOffsetY = (circleRect.top + circleRect.height/2) - complianceSectionRect.top;
    const circleOffsetX = (circleRect.left + circleRect.width/2) - complianceSectionRect.left;

    // Target Viewport Coordinates
    const circleCenterX = complianceSectionRect.left + circleOffsetX; 
    const circleCenterY = circleOffsetY;
    
    const complianceGatherScale = 0.3; 

    // Transition Timeline: Move dots to Compliance Circle center
    const transitionTl = gsap.timeline({
      scrollTrigger: {
        trigger: "#compliance-section",
        start: "top bottom",
        end: "top top",
        scrub: 1
      }
    });

    sourcePaths.forEach((path, i) => {
      const d = targetDotsData[i % targetDotsData.length];
      const dotRect = path.getBoundingClientRect();
      const dotOriginX = dotRect.left + (dotRect.width / 2);
      const dotOriginY = dotRect.top + (dotRect.height / 2);

      const offsetX = (d.x - dataCenterX) * complianceGatherScale;
      const offsetY = (d.y - dataCenterY) * complianceGatherScale;

      transitionTl.to(path, {
        // x: (circleCenterX + offsetX) - dotOriginX,
        // y: (circleCenterY + offsetY) - dotOriginY,
        x:0,
        y:0,
        scale: (d.r / baseSourceRadius) * complianceGatherScale,
        duration: 1,
        ease: "none",
        immediateRender: false
      }, 0);
    });

    // Pin the compliance section and animate sequence
    const complianceTl = gsap.timeline({
      scrollTrigger: {
        trigger: "#compliance-section",
        start: "top top",
        end: "+=3000",
        pin: true,
        scrub: 1,
        anticipatePin: 1
      }
    });

    // STEP 1: Fade out all dots (0-0.5)
    complianceTl.to(sourcePaths, {
      opacity: 0,
      duration: 0.5,
      ease: "power2.out"
    }, 0);

    // STEP 2: Fill circle from center using clip-path for clean expansion
    complianceTl.fromTo(complianceCircle, {
      backgroundColor: "#606060",
      clipPath: "circle(0% at center)"
    }, {
      backgroundColor: "#142D21",
      clipPath: "circle(100% at center)",
      duration: 1.8,
      ease: "power2.inOut"
    }, -0.3);

    // STEP 2.5: Apply inset shadow after circle is formed
    complianceTl.to(complianceCircle, {
      boxShadow: "inset 10px 20px 40px 0 rgba(0, 0, 0, 0.7)",
      duration: 0.3,
      ease: "power2.out"
    }, 1.5); // Starts near the end of circle fill

    // STEP 3: Fade in content elements (duration 2-3 of timeline)
    const contentElements = [
      "#compliance-heading",
      "#compliance-li-1",
      "#compliance-li-2",
      "#compliance-li-3",
      "#compliance-text-1",
      "#compliance-text-2",
      "#compliance-link"
    ];

    complianceTl.to(contentElements, {
      y: 0,
      opacity: 1,
      duration: 1,
      stagger: 0.15,
      ease: "power2.out"
    }, 2);
  }

  // Init
  window.addEventListener("load", initAnimation);
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(initAnimation, 200);
  });
});