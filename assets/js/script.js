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
    tabs.forEach((t) => byId(t.content).classList.add("hidden"));
    tabs.forEach((t) => {
      const btn = byId(t.id);
      btn.classList.remove(
        "active-overview",
        "inactive-overview",
        "active-middle",
        "inactive-middle",
        "active-last",
        "inactive-last"
      );
      if (t.type === "overview") btn.classList.add("inactive-overview");
      else if (t.type === "middle") btn.classList.add("inactive-middle");
      else btn.classList.add("inactive-last");
    });
    const activeTab = tabs.find((t) => t.id === activeId);
    const btn = byId(activeTab.id);
    const overviewTabContainer = byId("overview-tab-container");

    if (activeTab.type === "overview") {
      btn.classList.remove("inactive-overview");
      btn.classList.add("active-overview");
      overviewTabContainer.classList.add("bg-[#F5F5ED]");
      overviewTabContainer.classList.remove("bg-white");
    } else if (activeTab.type === "middle") {
      btn.classList.remove("inactive-middle");
      btn.classList.add("active-middle");
      overviewTabContainer.classList.add("bg-white");
      overviewTabContainer.classList.remove("bg-[#F5F5ED]");
    } else {
      btn.classList.remove("inactive-last");
      btn.classList.add("active-last");
      overviewTabContainer.classList.add("bg-white");
      overviewTabContainer.classList.remove("bg-[#F5F5ED]");
    }
    byId(activeTab.content).classList.remove("hidden");
  }

  tabs.forEach((t) =>
    byId(t.id).addEventListener("click", () => setActive(t.id))
  );
  setActive("tab-overview");

  // Accordion logic
  const accordionHeaders = document.querySelectorAll(".accordion-header");
  accordionHeaders.forEach((header) => {
    header.addEventListener("click", () => {
      const accordionItem = header.closest(".accordion-item");
      if (!accordionItem) return;

      const content = accordionItem.querySelector(".accordion-content");
      content.classList.toggle("hidden");
      header.classList.toggle("is-open");
    });
  });

  //menu icon toggle

  const mobileMenu = byId("mobile-menu");
  const menuButton = byId("menu-button");
  const closeMenuButton = byId("close-menu");
  const mobileMenuLinks = mobileMenu.querySelectorAll("a");

  if (menuButton) {
    menuButton.addEventListener("click", () => {
      mobileMenu.classList.remove("hidden");
    });
  }

  if (closeMenuButton) {
    closeMenuButton.addEventListener("click", () => {
      mobileMenu.classList.add("hidden");
    });
  }

  mobileMenuLinks.forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.add("hidden");
    });
  });
});
