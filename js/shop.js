/* Примерные цены. Настоящие подставим перед подключением оплаты. */
(() => {
  const products = {
    "1kg": { price: 22000, image: "assets/photos/1kg.webp" },
    "3kg": { price: 59000, image: "assets/photos/3kg.webp" },
  };

  const ui = () => (window.BC_I18N?.[document.documentElement.lang] || window.BC_I18N?.ru)?.ui || {};

  const money = (amount) => {
    const formatted = new Intl.NumberFormat("ru-RU").format(amount);
    return `${formatted} ${ui().currency || "сум"}`;
  };

  const read = () => {
    try {
      const data = JSON.parse(localStorage.getItem("bc-cart") || "[]");
      return Array.isArray(data) ? data.filter((row) => products[row.id] && row.qty > 0) : [];
    } catch (err) {
      return [];
    }
  };

  const write = (items) => {
    try {
      localStorage.setItem("bc-cart", JSON.stringify(items));
    } catch (err) {
      /* private mode */
    }
    document.dispatchEvent(new CustomEvent("bc:cart"));
  };

  const count = (items) => items.reduce((sum, row) => sum + row.qty, 0);

  const paintBadge = () => {
    const total = count(read());
    document.querySelectorAll("[data-cart-count]").forEach((el) => {
      el.textContent = String(total);
      el.hidden = total < 1;
    });
  };

  window.BC_SHOP = { products, money, read, write, count, ui };
  document.addEventListener("bc:cart", paintBadge);
  document.addEventListener("bc:lang", paintBadge);
  paintBadge();
})();
