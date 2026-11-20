(() => {
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

  // Заявка — позже отправим в Telegram
  const leadForm = document.querySelector("[data-lead-form]");
  const leadMsg = document.querySelector("[data-lead-msg]");
  leadForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    if (leadMsg) {
      leadMsg.hidden = false;
      leadMsg.textContent = "Спасибо! Заявка принята. Скоро свяжемся.";
    }
    leadForm.reset();
  });

  const officeMap = document.querySelector("[data-office-map]");
  if (officeMap && window.L) {
    const lat = 41.170705;
    const lng = 69.258281;
    const route = "https://www.google.com/maps/dir/?api=1&destination=41.170705,69.258281";
    const map = L.map(officeMap, {
      scrollWheelZoom: true,
      zoomControl: false,
      attributionControl: false,
      maxZoom: 19,
      minZoom: 12,
    }).setView([lat, lng], 16);
    L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}", {
      maxZoom: 19,
    }).addTo(map);
    const icon = L.divIcon({
      className: "office-pin",
      html: '<img src="assets/logo/logo-round.png" alt="" />',
      iconSize: [46, 46],
      iconAnchor: [23, 23],
    });
    L.marker([lat, lng], { icon, title: "Blackcarbon", keyboard: true })
      .addTo(map)
      .on("click", () => window.open(route, "_blank", "noopener"));
    requestAnimationFrame(() => map.invalidateSize());
  }

  const recipes = {
    chicken: {
      cat: "Курица",
      title: "Шашлык из курицы на углях",
      meta: "4 порции · маринад 40 минут · жарка 15 минут",
      lead: "Кавказский и узбекский вариант из бедра: лук, соль и немного зиры. Кислоту не льют — курица и так успевает пропитаться.",
      ingredients: [
        "1 кг куриного бедра без кости",
        "2 крупные луковицы",
        "1 ч. л. соли",
        "½ ч. л. молотой зиры",
        "чёрный перец по вкусу",
        "1 ст. л. растительного масла",
        "пучок кинзы и лепёшка для подачи",
      ],
      steps: [
        "Бедро нарежьте кусками примерно 4 см. Лук — полукольцами, разомните с солью, чтобы дал сок.",
        "Смешайте мясо с луком, зирой, перцем и маслом. Оставьте в холодильнике на 40–60 минут.",
        "Перед жаркой стряхните лук: на шампуре он сгорает раньше мяса.",
        "Нанижите неплотно. Жарьте над ровными углями без пламени 12–15 минут, часто переворачивая.",
        "Подавайте сразу, с кольцами свежего лука, кинзой и горячей лепёшкой.",
      ],
    },
    lamb: {
      cat: "Баранина",
      title: "Классический шашлык из баранины",
      meta: "4–5 порций · маринад 3–4 часа · жарка 15–20 минут",
      lead: "Узбекская классика: жирная баранина, много лука, зира и кусочек курдюка между мясом. Уксус в маринад не кладут.",
      ingredients: [
        "1,2 кг баранины (окорок или корейка)",
        "150 г курдючного сала",
        "3–4 крупные луковицы",
        "1 ч. л. зиры",
        "соль и чёрный перец",
        "сумах, зелень и лепёшка для подачи",
      ],
      steps: [
        "Мясо зачистите от плёнок и нарежьте кусками 3–4 см. Курдюк — кубиками чуть меньше.",
        "Лук нарежьте полукольцами и разомните с солью. Добавьте зиру и перец, перемешайте с бараниной.",
        "Закройте и уберите в холодильник на 3–4 часа. Дольше, на ночь, тоже можно.",
        "Лук с шампура снимите. Чередуйте мясо и курдюк, нанизывайте свободно.",
        "Жарьте над тлеющими углями без открытого огня 15–20 минут. Подавайте с луком, сумахом и лепёшкой.",
      ],
    },
    beef: {
      cat: "Говядина",
      title: "Говяжий шашлык на мангале",
      meta: "4 порции · маринад 4–6 часов · жарка 15–18 минут",
      lead: "Кавказский шашлык из мякоти: луковый сок и газированная вода размягчают говядину, а специй остаётся мало.",
      ingredients: [
        "1 кг говяжьей мякоти (вырезка или тонкий край)",
        "3 луковицы",
        "100 мл газированной воды",
        "1 ч. л. соли",
        "½ ч. л. молотого кориандра",
        "чёрный перец по вкусу",
        "лук, зелень и лаваш для подачи",
      ],
      steps: [
        "Говядину нарежьте поперёк волокон кусками около 4 см.",
        "Одну луковицу натрите и отожмите сок. Две другие нарежьте кольцами.",
        "Смешайте мясо с луковым соком, кольцами лука, солью, кориандром, перцем и водой.",
        "Маринуйте в холодильнике 4–6 часов. Перед жаркой дайте лишней жидкости стечь.",
        "Жарьте на сильном ровном жаре 15–18 минут до румяной корочки. Внутри мясо оставьте сочным.",
      ],
    },
  };

  const modal = document.querySelector("[data-recipe-modal]");
  const openRecipe = (id) => {
    const recipe = recipes[id];
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
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    modal.querySelector(".recipe-modal__close")?.focus();
  };

  const closeRecipe = () => {
    if (!modal) return;
    modal.hidden = true;
    document.body.style.overflow = "";
  };

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
