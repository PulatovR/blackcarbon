(() => {
  const shop = window.BC_SHOP;
  const root = document.querySelector("[data-cart-root]");
  if (!shop || !root) return;

  let picked = "";

  const line = (row) => {
    const t = shop.ui();
    const product = shop.products[row.id];
    const name = t.productTitle || "";
    const pack = row.id === "3kg" ? t.pack3 : t.pack1;
    return `
      <article class="cart-line">
        <a class="cart-line__photo" href="product.html">
          <img src="${product.image}" alt="${name} ${pack}" />
        </a>
        <div class="cart-line__body">
          <h2>${name}</h2>
          <p>${pack}</p>
          <div class="qty">
            <button type="button" data-line-qty="${row.id}" data-step="-1" aria-label="${t.qtyMinus || ""}">−</button>
            <span>${row.qty}</span>
            <button type="button" data-line-qty="${row.id}" data-step="1" aria-label="${t.qtyPlus || ""}">+</button>
          </div>
          <button class="cart-line__remove" type="button" data-remove="${row.id}">${t.remove || ""}</button>
        </div>
        <strong>${shop.money(product.price * row.qty)}</strong>
      </article>`;
  };

  const render = () => {
    const t = shop.ui();
    const items = shop.read();
    if (!items.length) {
      root.innerHTML = `
        <div class="cart-empty">
          <p class="cart-empty__title">${t.cartEmpty || ""}</p>
          <p>${t.cartEmptyLead || ""}</p>
          <a class="btn btn--orange" href="product.html">${t.cartEmptyCta || ""}</a>
        </div>`;
      return;
    }
    const total = items.reduce((sum, row) => sum + shop.products[row.id].price * row.qty, 0);
    root.innerHTML = `
      <div class="cart">
        <div class="cart__lines">${items.map(line).join("")}</div>
        <aside class="cart__summary">
          <div class="cart__total">
            <span>${t.cartTotal || ""}</span>
            <strong>${shop.money(total)}</strong>
          </div>
          <h2>${t.payTitle || ""}</h2>
          <p class="cart__note">${t.payNote || ""}</p>
          <div class="pays">
            <button type="button" data-pay="payme">${t.payPayme || ""}</button>
            <button type="button" data-pay="click">${t.payClick || ""}</button>
            <button type="button" data-pay="uzum">${t.payUzum || ""}</button>
            <button type="button" data-pay="card">${t.payCard || ""}</button>
          </div>
          <p class="cart__picked" ${picked ? "" : "hidden"}>${picked ? t.payPicked || "" : ""}</p>
        </aside>
      </div>`;
    if (picked) {
      root.querySelector(`[data-pay="${picked}"]`)?.classList.add("is-on");
    }
  };

  root.addEventListener("click", (event) => {
    const qtyBtn = event.target.closest("[data-line-qty]");
    const removeBtn = event.target.closest("[data-remove]");
    const payBtn = event.target.closest("[data-pay]");
    if (qtyBtn) {
      const items = shop.read();
      const row = items.find((item) => item.id === qtyBtn.dataset.lineQty);
      if (!row) return;
      row.qty = Math.min(20, Math.max(1, row.qty + Number(qtyBtn.dataset.step)));
      shop.write(items);
      return;
    }
    if (removeBtn) {
      shop.write(shop.read().filter((item) => item.id !== removeBtn.dataset.remove));
      return;
    }
    if (payBtn) {
      picked = payBtn.dataset.pay;
      render();
    }
  });

  document.addEventListener("bc:lang", render);
  document.addEventListener("bc:cart", render);
  render();
})();