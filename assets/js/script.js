document.addEventListener("DOMContentLoaded", () => {
  const tabs = [
    { id: "tab-overview", content: "content-overview", type: "overview" },
    { id: "tab-mint", content: "content-mint", type: "middle" },
    { id: "tab-acquire", content: "content-acquire", type: "middle" },
    { id: "tab-discover", content: "content-discover", type: "middle" },
    { id: "tab-integrate", content: "content-integrate", type: "last" },
  ];

  const byId = (id) => document.getElementById(id);

  function setActive(activeId) {
    const activeTab = tabs.find((t) => t.id === activeId);
    if (!activeTab) return;

    tabs.forEach((tab) => {
      const content = byId(tab.content);
      const button = byId(tab.id);

      const isActive = tab.id === activeId;
      content.classList.toggle("hidden", !isActive);

      button.classList.remove(
        "active-overview",
        "inactive-overview",
        "active-middle",
        "inactive-middle",
        "active-last",
        "inactive-last"
      );

      let activeClass, inactiveClass;
      switch (tab.type) {
        case "overview":
          activeClass = "active-overview";
          inactiveClass = "inactive-overview";
          break;
        case "middle":
          activeClass = "active-middle";
          inactiveClass = "inactive-middle";
          break;
        case "last":
          activeClass = "active-last";
          inactiveClass = "inactive-last";
          break;
      }

      button.classList.add(isActive ? activeClass : inactiveClass);
    });

    const overviewTabContainer = byId("overview-tab-container");
    const isOverviewActive = activeTab.type === "overview";
    overviewTabContainer.classList.toggle("bg-[#F5F5ED]", isOverviewActive);
    overviewTabContainer.classList.toggle("bg-white", !isOverviewActive);
  }

  tabs.forEach((t) =>
    byId(t.id).addEventListener("click", () => setActive(t.id))
  );
  setActive("tab-overview");

  // Accordion logic
  document.querySelectorAll(".accordion-header").forEach((header) => {
    header.addEventListener("click", () => {
      const content = header.nextElementSibling;
      content.classList.toggle("hidden");
      header.classList.toggle("is-open");
    });
  });

  // Mobile Menu Toggle
  const mobileMenu = byId("mobile-menu");
  const menuButton = byId("menu-button");
  const closeMenuButton = byId("close-menu");
  const mobileMenuLinks = mobileMenu.querySelectorAll("a");

  const toggleMenu = (show) => mobileMenu.classList.toggle("hidden", !show);

  menuButton?.addEventListener("click", () => toggleMenu(true));
  closeMenuButton?.addEventListener("click", () => toggleMenu(false));
  mobileMenuLinks.forEach((link) => {
    link.addEventListener("click", () => toggleMenu(false));
  });

  /**
   * Mint tab background position handling.
   * Adds 'mint-active' to both hexagon background images when Mint tab selected.
   * Removes it for all other tabs.
   */
  const bg1 = document.getElementById("hexagon-bg-1"); // 2xl version
  const bg2 = document.getElementById("hexagon-bg-2"); // lg–xl version
  if (!bg1 || !bg2) return;

  const tabMap = [
    { id: "tab-overview", mint: false },
    { id: "tab-mint", mint: true },
    { id: "tab-acquire", mint: false },
    { id: "tab-discover", mint: false },
    { id: "tab-integrate", mint: false },
  ];

  tabMap.forEach((cfg) => {
    const btn = document.getElementById(cfg.id);
    if (!btn) return;
    btn.addEventListener("click", () => {
      if (cfg.mint) {
        bg1.classList.add("mint-active");
        bg2.classList.add("mint-active");
      } else {
        bg1.classList.remove("mint-active");
        bg2.classList.remove("mint-active");
      }
    });
  });
});
