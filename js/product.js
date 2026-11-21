(() => {
  const shop = window.BC_SHOP;
  const photo = document.querySelector("[data-product-photo]");
  if (!shop || !photo) return;

  let size = "1kg";
  let qty = 1;
  const priceEl = document.querySelector("[data-product-price]");
  const input = document.querySelector("[data-qty-input]");
  const added = document.querySelector("[data-added]");
  const checkout = document.querySelector("[data-checkout]");

  const packKey = (id) => (id === "3kg" ? "pack3" : "pack1");

  const sync = () => {
    const t = shop.ui();
    const product = shop.products[size];
    photo.src = product.image;
    photo.alt = `${t.productTitle || ""} ${t[packKey(size)] || ""}`.trim();
    if (priceEl) priceEl.textContent = shop.money(product.price);
    document.querySelectorAll("[data-pack-price]").forEach((el) => {
      const item = shop.products[el.dataset.packPrice];
      if (item) el.textContent = shop.money(item.price);
    });
    document.querySelectorAll("[data-size]").forEach((el) => {
      const on = el.dataset.size === size;
      el.classList.toggle("is-active", on);
      if (el.tagName === "BUTTON") el.setAttribute("aria-pressed", on ? "true" : "false");
    });
    if (input) input.value = String(qty);
    if (checkout) checkout.hidden = shop.count(shop.read()) < 1;
    if (added && !added.hidden) added.textContent = t.added || "";
  };

  document.querySelectorAll("[data-size]").forEach((el) => {
    el.addEventListener("click", () => {
      size = el.dataset.size;
      sync();
    });
  });

  document.querySelectorAll("[data-qty]").forEach((btn) => {
    btn.addEventListener("click", () => {
      qty = Math.min(20, Math.max(1, qty + Number(btn.dataset.qty)));
      sync();
    });
  });

  input?.addEventListener("change", () => {
    qty = Math.min(20, Math.max(1, parseInt(input.value, 10) || 1));
    sync();
  });

  document.querySelector("[data-add]")?.addEventListener("click", () => {
    const items = shop.read();
    const row = items.find((item) => item.id === size);
    if (row) row.qty = Math.min(20, row.qty + qty);
    else items.push({ id: size, qty });
    shop.write(items);
    if (added) {
      added.hidden = false;
      added.textContent = shop.ui().added || "";
    }
    sync();
  });

  document.addEventListener("bc:lang", sync);
  document.addEventListener("bc:cart", sync);
  sync();
})();
