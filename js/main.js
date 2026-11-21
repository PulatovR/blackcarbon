(() => {
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  if (!location.hash) window.scrollTo(0, 0);

  const i18n = window.BC_I18N || {};
  const langs = ["ru", "uz", "en"];
  let currentLang = "ru";
  let openRecipeId = null;

  const applyLang = (lang) => {
    if (!langs.includes(lang) || !i18n[lang]) lang = "ru";
    currentLang = lang;
    const pack = i18n[lang];
    const t = pack.ui;
    document.documentElement.lang = lang;
    const titleKey = document.body.dataset.titleKey;
    if (titleKey && t[titleKey]) document.title = t[titleKey];
    else if (!titleKey && t.metaTitle) document.title = t.metaTitle;
    const meta = document.querySelector('meta[name="description"]');
    if (meta && !titleKey && t.metaDesc) meta.setAttribute("content", t.metaDesc);
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const value = t[el.dataset.i18n];
      if (value != null) el.textContent = value;
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const value = t[el.dataset.i18nPlaceholder];
      if (value != null) el.setAttribute("placeholder", value);
    });
    document.querySelectorAll("[data-i18n-alt]").forEach((el) => {
      const value = t[el.dataset.i18nAlt];
      if (value != null) el.setAttribute("alt", value);
    });
    document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
      const value = t[el.dataset.i18nAria];
      if (value != null) el.setAttribute("aria-label", value);
    });
    document.querySelectorAll("[data-set-lang]").forEach((btn) => {
      const on = btn.dataset.setLang === lang;
      btn.classList.toggle("is-active", on);
      btn.setAttribute("aria-pressed", on ? "true" : "false");
    });
    try {
      localStorage.setItem("bc-lang", lang);
    } catch (err) {
      /* private mode */
    }
    if (openRecipeId) openRecipe(openRecipeId);
    document.dispatchEvent(new CustomEvent("bc:lang", { detail: currentLang }));
  };

  const year = document.querySelector("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());

  // Mobile menu
  const panel = document.querySelector("[data-menu]");
  const openBtn = document.querySelector("[data-menu-open]");
  const closeNodes = document.querySelectorAll("[data-menu-close]");

  const setMenu = (open) => {
    if (!panel) return;
    panel.classList.toggle("is-open", open);
    document.body.style.overflow = open ? "hidden" : "";
  };

  openBtn?.addEventListener("click", () => setMenu(true));
  closeNodes.forEach((node) => node.addEventListener("click", () => setMenu(false)));
  panel?.addEventListener("click", (e) => {
    if (e.target === panel) setMenu(false);
  });

  // Reveal on scroll
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }

  // Заявка открывает чат поддержки в Telegram с готовым текстом. Сервера нет.
  const SUPPORT_USER = "RAR0806";
  const leadForm = document.querySelector("[data-lead-form]");
  leadForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const t = i18n[currentLang]?.ui || {};
    const data = new FormData(leadForm);
    const clean = (value) => String(value || "").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").trim();
    const text = [
      t.leadTgHello || "Здравствуйте! Заявка с сайта Blackcarbon.",
      "",
      `${t.labelLast || "Фамилия"}: ${clean(data.get("lastName"))}`,
      `${t.labelFirst || "Имя"}: ${clean(data.get("firstName"))}`,
      `${t.labelPhone || "Телефон"}: ${clean(data.get("phone"))}`,
      `${t.labelEmail || "Почта"}: ${clean(data.get("email"))}`,
      "",
      `${t.labelMessage || "Сообщение"}:`,
      clean(data.get("message")),
    ].join("\n").slice(0, 3500);
    const url = `https://t.me/${SUPPORT_USER}?text=${encodeURIComponent(text)}`;
    const popup = window.open(url, "_blank", "noopener,noreferrer");
    if (!popup) window.location.href = url;
    leadForm.reset();
  });

  const routeOpen = document.querySelector("[data-route-open]");
  const routeMenu = document.querySelector("[data-route-menu]");
  const setRouteMenu = (open) => {
    if (!routeMenu || !routeOpen) return;
    routeMenu.hidden = !open;
    routeOpen.setAttribute("aria-expanded", open ? "true" : "false");
  };
  routeOpen?.addEventListener("click", (event) => {
    event.stopPropagation();
    setRouteMenu(routeMenu.hidden);
  });
  routeMenu?.addEventListener("click", (event) => event.stopPropagation());
  document.addEventListener("click", (event) => {
    if (event.target.closest("[data-route-open], [data-route-menu], .office-pin")) return;
    setRouteMenu(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setRouteMenu(false);
  });

  const officeMap = document.querySelector("[data-office-map]");
  if (officeMap && window.L) {
    const lat = 41.170705;
    const lng = 69.258281;
    const map = L.map(officeMap, {
      scrollWheelZoom: true,
      zoomControl: false,
      attributionControl: false,
      keyboard: false,
      maxZoom: 19,
      minZoom: 12,
    }).setView([lat, lng], 16);
    officeMap.removeAttribute("tabindex");
    if (!location.hash) window.scrollTo(0, 0);
    L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}", {
      maxZoom: 19,
    }).addTo(map);
    const icon = L.divIcon({
      className: "office-pin",
      html: '<img src="assets/logo/logo-round.png" alt="" />',
      iconSize: [46, 46],
      iconAnchor: [23, 23],
    });
    L.marker([lat, lng], { icon, title: "Blackcarbon", keyboard: false })
      .addTo(map)
      .on("click", (event) => {
        L.DomEvent.stop(event);
        setTimeout(() => setRouteMenu(true), 0);
      });
    requestAnimationFrame(() => {
      map.invalidateSize();
      if (!location.hash) window.scrollTo(0, 0);
    });
  }

  const modal = document.querySelector("[data-recipe-modal]");
  const openRecipe = (id) => {
    const recipe = i18n[currentLang]?.recipes?.[id];
    if (!modal || !recipe) return;
    modal.querySelector("[data-recipe-cat]").textContent = recipe.cat;
    modal.querySelector("[data-recipe-title]").textContent = recipe.title;
    modal.querySelector("[data-recipe-meta]").textContent = recipe.meta;
    modal.querySelector("[data-recipe-lead]").textContent = recipe.lead;
    modal.querySelector("[data-recipe-ingredients]").innerHTML = recipe.ingredients
      .map((item) => `<li>${item}</li>`)
      .join("");
    modal.querySelector("[data-recipe-steps]").innerHTML = recipe.steps
      .map((item) => `<li>${item}</li>`)
      .join("");
    openRecipeId = id;
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    modal.querySelector(".recipe-modal__close")?.focus();
  };

  const closeRecipe = () => {
    if (!modal) return;
    openRecipeId = null;
    modal.hidden = true;
    document.body.style.overflow = "";
  };

  document.querySelectorAll("[data-set-lang]").forEach((btn) => {
    btn.addEventListener("click", () => applyLang(btn.dataset.setLang));
  });
  let saved = "ru";
  try {
    saved = localStorage.getItem("bc-lang") || "ru";
  } catch (err) {
    saved = "ru";
  }
  applyLang(saved);

  document.querySelectorAll("[data-recipe]").forEach((card) => {
    card.addEventListener("click", () => openRecipe(card.dataset.recipe));
  });
  modal?.querySelectorAll("[data-recipe-close]").forEach((node) => {
    node.addEventListener("click", closeRecipe);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal && !modal.hidden) closeRecipe();
  });

  // Hero auto-slider — каждые 3 секунды, без стрелок
  const slider = document.querySelector("[data-hero-slider]");
  if (slider) {
    const slides = [...slider.querySelectorAll(".hero__slide")];
    if (slides.length > 1) {
      let index = slides.findIndex((s) => s.classList.contains("is-active"));
      if (index < 0) index = 0;
      setInterval(() => {
        slides[index].classList.remove("is-active");
        index = (index + 1) % slides.length;
        slides[index].classList.add("is-active");
      }, 3000);
    }
  }
})();
