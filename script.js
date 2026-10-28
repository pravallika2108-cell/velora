/* ==========================================================================
   VELORA — storefront logic (vanilla JS, no dependencies)
   ========================================================================== */
(() => {
  "use strict";

  document.documentElement.classList.add("js");

  /* ---------------------------------------------------------------------
     Config & data
     --------------------------------------------------------------------- */
  const CURRENCY = "USD";
  const FREE_SHIPPING_THRESHOLD = 500;
  const STANDARD_SHIPPING = 25;
  const EXPRESS_SHIPPING = 45;
  const TAX_RATE = 0.08;
  const STORAGE_KEYS = { cart: "velora.cart.v1", wishlist: "velora.wishlist.v1" };

  const CATEGORIES = ["All", "New Arrivals", "Women's Wear", "Men's Wear", "Dresses", "Outerwear", "Bags", "Accessories"];

  const SIZES = {
    women: ["XS", "S", "M", "L", "XL"],
    men: ["S", "M", "L", "XL", "XXL"],
    denim: ["24", "26", "28", "30", "32"],
    hat: ["S", "M", "L"],
    one: ["One Size"],
  };

  const C = {
    ivory: { name: "Ivory", hex: "#f1ebdf" },
    black: { name: "Noir", hex: "#141210" },
    camel: { name: "Camel", hex: "#b48a5a" },
    sand: { name: "Sand", hex: "#d8c8ad" },
    navy: { name: "Midnight", hex: "#1d2433" },
    grey: { name: "Flannel Grey", hex: "#8d8a86" },
    scarlet: { name: "Scarlet", hex: "#a8202a" },
    plum: { name: "Aubergine", hex: "#4b1e3a" },
    blush: { name: "Blush", hex: "#e3b9ad" },
    sky: { name: "Powder Blue", hex: "#b8cbd8" },
    denim: { name: "Washed Indigo", hex: "#6f88a8" },
    olive: { name: "Olive", hex: "#5d5b3d" },
    cognac: { name: "Cognac", hex: "#8a4b26" },
    bordeaux: { name: "Bordeaux", hex: "#5a1620" },
    teal: { name: "Deep Teal", hex: "#1f5a63" },
    gold: { name: "Gold", hex: "#c9a75a" },
    silver: { name: "Silver", hex: "#c4c4c4" },
    tobacco: { name: "Tobacco", hex: "#6b4a2f" },
    coral: { name: "Coral", hex: "#d4573f" },
  };

  // Each product: two Unsplash photo IDs (primary + hover/secondary).
  const PRODUCTS = [
    { id: "vl-001", name: "Silk Pussy-Bow Blouse", category: "Women's Wear", price: 690, date: "2026-10-12", isNew: true,
      images: ["1583846717393-dc2412c95ed7", "1608234807905-4466023792f5"], sizes: SIZES.women, colors: [C.ivory, C.black],
      desc: "Fluid silk crêpe de chine with a softly knotted bow and mother-of-pearl buttons. Tucks effortlessly into tailoring.",
      material: "100% mulberry silk. Made in Italy." },
    { id: "vl-002", name: "Merino Turtleneck Knit", category: "Women's Wear", price: 480, date: "2026-08-22",
      images: ["1550639525-c97d455acf70", "1524504388940-b1c1722653e1"], sizes: SIZES.women, colors: [C.black, C.camel, C.ivory],
      desc: "A fine-gauge extra-fine merino turtleneck with a close, sculpted fit and fully fashioned seams.",
      material: "100% extra-fine merino wool. Made in Scotland." },
    { id: "vl-003", name: "Cloud Rib Cashmere Sweater", category: "Women's Wear", price: 820, date: "2026-10-02", isNew: true,
      images: ["1504703395950-b89145a5425b", "1578587018452-892bacefd3f2"], sizes: SIZES.women, colors: [C.sky, C.ivory, C.sand],
      desc: "Lofty Mongolian cashmere in a relaxed rib. Brushed by hand for a cloud-soft handle that softens with every wear.",
      material: "100% grade-A cashmere. Made in Italy." },
    { id: "vl-004", name: "High-Rise Wide-Leg Jeans", category: "Women's Wear", price: 390, date: "2026-07-18",
      images: ["1598554747436-c9293d6a588f", "1475178626620-a4d074967452"], sizes: SIZES.denim, colors: [C.denim, C.black],
      desc: "Japanese selvedge denim cut high on the waist with a fluid, floor-grazing wide leg.",
      material: "100% organic cotton selvedge denim. Made in Japan." },
    { id: "vl-005", name: "Midnight Wool Suit Jacket", category: "Men's Wear", price: 1650, date: "2026-09-05",
      images: ["1507679799987-c73779587ccf", "1617137968427-85924c800a22"], sizes: SIZES.men, colors: [C.navy, C.black],
      desc: "Half-canvassed single-breasted jacket in Super 130s wool with a soft natural shoulder and hand-finished lapels.",
      material: "100% Super 130s virgin wool. Tailored in Biella." },
    { id: "vl-006", name: "Windowpane Three-Piece Suit", category: "Men's Wear", price: 2450, date: "2026-10-18", isNew: true,
      images: ["1594938298603-c8148c4dae35", "1600091166971-7f9faad6c1e2"], sizes: SIZES.men, colors: [C.navy, C.grey],
      desc: "A modern three-piece in windowpane check — jacket, waistcoat and flat-front trousers, cut for movement.",
      material: "Wool-silk blend. Fully lined in cupro." },
    { id: "vl-007", name: "Suede Trucker Jacket", category: "Men's Wear", price: 1280, date: "2026-06-28",
      images: ["1617114919297-3c8ddb01f599", "1552374196-1ab2a1c593e8"], sizes: SIZES.men, colors: [C.camel, C.tobacco],
      desc: "Buttery goat suede with tonal topstitching and horn buttons. A lifelong companion for denim and knitwear.",
      material: "100% goat suede, cupro lining." },
    { id: "vl-008", name: "Heavyweight Cotton Tee", category: "Men's Wear", price: 140, date: "2026-05-14",
      images: ["1586790170083-2f9ceadc732d", "1521572163474-6864f9cf17ab"], sizes: SIZES.men, colors: [C.ivory, C.black, C.grey],
      desc: "A dense 280gsm jersey tee with a structured neckline that keeps its shape wash after wash.",
      material: "100% Supima cotton. Made in Portugal." },
    { id: "vl-009", name: "Herringbone Tweed Blazer", category: "Men's Wear", price: 1190, date: "2026-10-08", isNew: true,
      images: ["1507114845806-0347f6150324", "1617127365659-c47fa864d8bc"], sizes: SIZES.men, colors: [C.grey, C.tobacco],
      desc: "Unstructured blazer in Donegal-inspired herringbone with patch pockets and a soft roll lapel.",
      material: "Wool-cashmere tweed. Made in Italy." },
    { id: "vl-010", name: "Scarlet Silk Gown", category: "Dresses", price: 2200, date: "2026-10-20", isNew: true,
      images: ["1595777457583-95e059d581b8", "1612336307429-8a898d10e223"], sizes: SIZES.women, colors: [C.scarlet, C.black],
      desc: "A bias-cut silk gown with a sweeping skirt that moves like liquid. Made for entrances.",
      material: "100% silk charmeuse. Made in France." },
    { id: "vl-011", name: "Off-Shoulder Velvet Gown", category: "Dresses", price: 1850, date: "2026-09-12",
      images: ["1566174053879-31528523f8ae", "1550928431-ee0ec6db30d3"], sizes: SIZES.women, colors: [C.plum, C.black],
      desc: "Sculpted silk-velvet with an architectural off-shoulder neckline and a fluid column skirt.",
      material: "Silk-viscose velvet. Made in Italy." },
    { id: "vl-012", name: "Linen Wrap Midi Dress", category: "Dresses", price: 620, date: "2026-07-02",
      images: ["1596783074918-c84cb06531ca", "1617922001439-4a2e6562f328"], sizes: SIZES.women, colors: [C.coral, C.sand],
      desc: "Washed Irish linen in a relaxed wrap silhouette with fluttered sleeves and a self-tie waist.",
      material: "100% Irish linen." },
    { id: "vl-013", name: "Polka Dot Tea Dress", category: "Dresses", price: 540, date: "2026-06-15",
      images: ["1502716119720-b23a93e5fe1b", "1572804013309-59a88b7e92f1"], sizes: SIZES.women, colors: [C.scarlet, C.black],
      desc: "A romantic tea dress in printed silk georgette with puff sleeves and a softly flared hem.",
      material: "100% silk georgette." },
    { id: "vl-014", name: "Camel Belted Wrap Coat", category: "Outerwear", price: 1950, date: "2026-09-28", isNew: true,
      images: ["1539533018447-63fcce2678e3", "1558769132-cb1aea458c5e"], sizes: SIZES.women, colors: [C.camel, C.black],
      desc: "Double-faced camel hair, hand-finished with no lining so it drapes weightlessly. The house signature.",
      material: "100% camel hair. Made in Italy." },
    { id: "vl-015", name: "Lambskin Biker Jacket", category: "Outerwear", price: 1750, date: "2026-08-08",
      images: ["1551028719-00167b16eac5", "1520975954732-35dd22299614"], sizes: SIZES.men, colors: [C.black, C.cognac],
      desc: "Supple nappa lambskin with polished silver hardware and an asymmetric zip. Softens beautifully with age.",
      material: "100% lambskin leather. Made in Spain." },
    { id: "vl-016", name: "Noir Opera Coat", category: "Outerwear", price: 2650, date: "2026-10-22", isNew: true,
      images: ["1554412933-514a83d2f3c8", "1483985988355-763728e1935b"], sizes: SIZES.women, colors: [C.black, C.bordeaux],
      desc: "A dramatic A-line coat in wool-cashmere with a ruffled placket and covered buttons. Evening, elevated.",
      material: "90% wool, 10% cashmere." },
    { id: "vl-017", name: "Ivory Cocoon Coat", category: "Outerwear", price: 1580, date: "2026-07-25",
      images: ["1632149877166-f75d49000351", "1509319117193-57bab727e09d"], sizes: SIZES.women, colors: [C.ivory, C.sand],
      desc: "An oversized cocoon silhouette in brushed wool bouclé with dropped shoulders and deep patch pockets.",
      material: "Wool-alpaca bouclé." },
    { id: "vl-018", name: "Lucia Top-Handle Bag", category: "Bags", price: 2100, date: "2026-09-18",
      images: ["1584917865442-de89df76afd3", "1590874103328-eac38a683ce7"], sizes: SIZES.one, colors: [C.coral, C.camel],
      desc: "A structured calfskin top-handle with a signature turn-lock and detachable shoulder strap.",
      material: "Calfskin leather, gold-tone hardware. Made in Florence." },
    { id: "vl-019", name: "Bordeaux Croc-Effect Bag", category: "Bags", price: 1450, date: "2026-10-15", isNew: true,
      images: ["1575032617751-6ddec2089882", "1591348278863-a8fb3887e2aa"], sizes: SIZES.one, colors: [C.bordeaux, C.black],
      desc: "Glossy croc-embossed leather in a compact bucket shape with a jewelled clasp.",
      material: "Embossed calfskin, suede lining." },
    { id: "vl-020", name: "Atelier Leather Tote", category: "Bags", price: 1290, date: "2026-05-30",
      images: ["1614179689702-355944cd0918", "1492707892479-7bc8d5a4ee93"], sizes: SIZES.one, colors: [C.black, C.cognac],
      desc: "A clean-lined grained-leather tote with room for a laptop, finished with hand-painted edges.",
      material: "Grained calfskin. Made in Italy." },
    { id: "vl-021", name: "Petra Satchel", category: "Bags", price: 980, date: "2026-08-14",
      images: ["1594223274512-ad4803739b7c", "1566150905458-1bf1fc113f0d"], sizes: SIZES.one, colors: [C.teal, C.blush],
      desc: "A ladylike satchel with a pushlock closure and soft rolled handle.",
      material: "Smooth calfskin." },
    { id: "vl-022", name: "Riviera Round Sunglasses", category: "Accessories", price: 420, date: "2026-06-05",
      images: ["1511499767150-a48a237f0083", "1572635196237-14b3f281503f"], sizes: SIZES.one, colors: [C.gold, C.black],
      desc: "Featherweight titanium frames with mineral glass lenses and full UV400 protection.",
      material: "Titanium frame, mineral glass lenses. Made in Japan." },
    { id: "vl-023", name: "Heritage Leather Watch", category: "Accessories", price: 1150, date: "2026-07-10",
      images: ["1524592094714-0f0654e20314", "1523170335258-f5ed11844a49"], sizes: SIZES.one, colors: [C.silver, C.gold],
      desc: "A Swiss automatic movement in a slim 38mm case on a hand-stitched suede strap.",
      material: "Stainless steel, sapphire crystal, suede strap." },
    { id: "vl-024", name: "Baroque Pearl Necklace", category: "Accessories", price: 760, date: "2026-10-10", isNew: true,
      images: ["1515562141207-7a88fb7ce338", "1590548784585-643d2b9f2925"], sizes: SIZES.one, colors: [C.ivory, C.gold],
      desc: "Hand-knotted freshwater baroque pearls finished with an 18k gold-vermeil clasp.",
      material: "Freshwater pearls, 18k gold vermeil." },
    { id: "vl-025", name: "Lune Crescent Pendant", category: "Accessories", price: 340, date: "2026-08-30",
      images: ["1599643478518-a784e5dc4c8f", "1617038220319-276d3cfab638"], sizes: SIZES.one, colors: [C.gold, C.silver],
      desc: "A delicate crescent pendant on a fine trace chain — layered or worn alone.",
      material: "18k gold vermeil on sterling silver." },
    { id: "vl-026", name: "Wool Felt Fedora", category: "Accessories", price: 290, date: "2026-09-02",
      images: ["1514327605112-b887c0e61c0a", "1521369909029-2afed882baee"], sizes: SIZES.hat, colors: [C.sky, C.black],
      desc: "Rabbit-felt fedora with a grosgrain band and hand-shaped brim.",
      material: "100% wool felt, grosgrain ribbon." },
  ];

  const INFO = {
    shipping: { title: "Shipping & Delivery", body: [
      "Complimentary standard shipping on orders over $500. Standard delivery arrives in 3–5 business days; express in 1–2.",
      "Every order is presented in VELORA signature packaging. (Demonstration storefront — no items will ship.)" ] },
    returns: { title: "Returns & Exchanges", body: [
      "Return or exchange unworn pieces within 30 days in their original packaging.",
      "Bespoke and personalised items are final sale." ] },
    care: { title: "Garment Care", body: [
      "Store knitwear folded, never hung. Brush wool coats after each wear and allow them to rest for a day.",
      "Leather goods should be kept in their dust bags away from direct sunlight." ] },
    contact: { title: "Contact Us", body: [
      "Our client advisors are available Monday to Saturday, 10:00–19:00.",
      "client.care@velora.example &nbsp;·&nbsp; +00 000 000 0000 (demo details)" ] },
  };

  /* ---------------------------------------------------------------------
     Utilities
     --------------------------------------------------------------------- */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const priceFmt = new Intl.NumberFormat("en-US", { style: "currency", currency: CURRENCY, maximumFractionDigits: 0 });
  const formatPrice = (n) => priceFmt.format(n);
  const imgUrl = (id, w = 800) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=78`;
  const escapeHTML = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const getProduct = (id) => PRODUCTS.find((p) => p.id === id);
  const debounce = (fn, ms = 200) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };

  const storage = {
    get(key, fallback) {
      try { const v = JSON.parse(localStorage.getItem(key)); return v ?? fallback; } catch { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage unavailable */ }
    },
  };

  // Elegant placeholder used when a remote image fails to load.
  const FALLBACK_IMG = "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800">
      <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#efe8dc"/><stop offset="1" stop-color="#e0d3bf"/></linearGradient></defs>
      <rect width="600" height="800" fill="url(#g)"/>
      <text x="300" y="410" text-anchor="middle" font-family="Georgia, serif" font-size="44" letter-spacing="16" fill="#8a7d6b">VELORA</text>
      <text x="300" y="450" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" letter-spacing="5" fill="#8a7d6b">IMAGE UNAVAILABLE</text>
    </svg>`);

  function initImageFallbacks() {
    document.addEventListener("error", (e) => {
      const el = e.target;
      if (el instanceof HTMLImageElement && !el.dataset.fallback) {
        el.dataset.fallback = "1";
        el.removeAttribute("srcset");
        el.src = FALLBACK_IMG;
        el.classList.add("is-fallback");
      }
    }, true);
    // Catch images that failed before this listener was attached.
    $$("img").forEach((img) => {
      if (img.complete && img.naturalWidth === 0 && img.src) img.dispatchEvent(new Event("error"));
    });
  }

  let toastTimer;
  function showToast(message, action) {
    const toast = $("#toast");
    toast.innerHTML = `<span>${escapeHTML(message)}</span>`;
    if (action) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = action.label;
      btn.addEventListener("click", () => { action.onClick(); toast.classList.remove("is-visible"); });
      toast.appendChild(btn);
    }
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 3200);
  }

  /* ---------------------------------------------------------------------
     State
     --------------------------------------------------------------------- */
  const state = {
    cart: sanitizeCart(storage.get(STORAGE_KEYS.cart, [])),
    wishlist: storage.get(STORAGE_KEYS.wishlist, []).filter((id) => getProduct(id)),
    filters: { query: "", category: "All", maxPrice: 3000, sort: "featured" },
  };

  function sanitizeCart(items) {
    if (!Array.isArray(items)) return [];
    return items.filter((i) => i && getProduct(i.id) && i.qty > 0).map((i) => ({
      id: i.id, size: String(i.size), color: String(i.color), qty: Math.min(10, Math.max(1, parseInt(i.qty, 10) || 1)),
    }));
  }

  const saveCart = () => storage.set(STORAGE_KEYS.cart, state.cart);
  const saveWishlist = () => storage.set(STORAGE_KEYS.wishlist, state.wishlist);

  /* ---------------------------------------------------------------------
     Product cards
     --------------------------------------------------------------------- */
  const heartSVG = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.3a4.3 4.3 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20z"/></svg>`;

  function productCardHTML(p) {
    const wished = state.wishlist.includes(p.id);
    const swatches = p.colors.map((c) => `<span class="swatch-dot" style="background:${c.hex}" title="${escapeHTML(c.name)}"></span>`).join("");
    return `
      <article class="card reveal" data-id="${p.id}">
        <div class="card__media" data-action="quickview" data-id="${p.id}">
          ${p.isNew ? `<span class="card__badge">New</span>` : ""}
          <img class="card__img--main" src="${imgUrl(p.images[0], 700)}" alt="${escapeHTML(p.name)}" loading="lazy" decoding="async">
          <img class="card__img--alt" src="${imgUrl(p.images[1], 700)}" alt="" loading="lazy" decoding="async" aria-hidden="true">
          <button class="card__wish" type="button" data-action="wishlist" data-id="${p.id}"
            aria-pressed="${wished}" aria-label="${wished ? "Remove" : "Add"} ${escapeHTML(p.name)} ${wished ? "from" : "to"} wishlist">${heartSVG}</button>
          <button class="card__quick" type="button" data-action="quickview" data-id="${p.id}">Quick View</button>
        </div>
        <div class="card__info">
          <p class="card__cat">${escapeHTML(p.category)}</p>
          <h3 class="card__name"><button type="button" data-action="quickview" data-id="${p.id}">${escapeHTML(p.name)}</button></h3>
          <p class="card__price">${formatPrice(p.price)}</p>
          <div class="card__swatches" aria-label="${p.colors.length} colours available">${swatches}</div>
        </div>
      </article>`;
  }

  function renderArrivals() {
    const items = PRODUCTS.filter((p) => p.isNew).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 4);
    $("#arrivalsGrid").innerHTML = items.map(productCardHTML).join("");
    observeReveals($("#arrivalsGrid"));
  }

  /* ---------------------------------------------------------------------
     Shop: search, filter, sort
     --------------------------------------------------------------------- */
  function getFilteredProducts() {
    const { query, category, maxPrice, sort } = state.filters;
    const q = query.trim().toLowerCase();
    let list = PRODUCTS.filter((p) => {
      const inCat = category === "All" || (category === "New Arrivals" ? p.isNew : p.category === category);
      const inPrice = p.price <= maxPrice;
      const hay = `${p.name} ${p.category} ${p.desc} ${p.material} ${p.colors.map((c) => c.name).join(" ")}`.toLowerCase();
      const inQuery = !q || q.split(/\s+/).every((term) => hay.includes(term));
      return inCat && inPrice && inQuery;
    });
    const sorters = {
      newest: (a, b) => b.date.localeCompare(a.date),
      "price-asc": (a, b) => a.price - b.price,
      "price-desc": (a, b) => b.price - a.price,
    };
    if (sorters[sort]) list = [...list].sort(sorters[sort]);
    return list;
  }

  function renderChips() {
    $("#categoryChips").innerHTML = CATEGORIES.map((c) =>
      `<button type="button" class="chip" data-chip="${escapeHTML(c)}" aria-pressed="${c === state.filters.category}">${escapeHTML(c)}</button>`
    ).join("");
  }

  let gridTimer;
  function renderShop({ animate = true } = {}) {
    const grid = $("#productGrid");
    const list = getFilteredProducts();
    const paint = () => {
      grid.innerHTML = list.map(productCardHTML).join("");
      $("#emptyState").hidden = list.length > 0;
      $("#resultCount").textContent = `${list.length} ${list.length === 1 ? "piece" : "pieces"}`;
      const f = state.filters;
      $("#clearFilters").hidden = f.query === "" && f.category === "All" && f.maxPrice === 3000 && f.sort === "featured";
      // Cards in the shop appear immediately (already in view) with a gentle stagger.
      $$(".card", grid).forEach((card, i) => {
        card.style.transitionDelay = `${Math.min(i, 8) * 50}ms`;
        observeReveal(card);
      });
      grid.classList.remove("is-updating");
    };
    clearTimeout(gridTimer);
    if (animate && !prefersReducedMotion.matches && grid.children.length) {
      grid.classList.add("is-updating");
      gridTimer = setTimeout(paint, 280);
    } else {
      paint();
    }
    $$("#categoryChips .chip").forEach((chip) => chip.setAttribute("aria-pressed", String(chip.dataset.chip === state.filters.category)));
  }

  function setCategory(category, { scroll = false } = {}) {
    state.filters.category = CATEGORIES.includes(category) ? category : "All";
    renderShop();
    if (scroll) $("#shop").scrollIntoView({ behavior: prefersReducedMotion.matches ? "auto" : "smooth" });
  }

  function resetFilters() {
    state.filters = { query: "", category: "All", maxPrice: 3000, sort: "featured" };
    $("#searchInput").value = "";
    $("#priceRange").value = 3000;
    $("#sortSelect").value = "featured";
    updatePriceOutput();
    renderShop();
  }

  function updatePriceOutput() {
    const v = Number($("#priceRange").value);
    $("#priceOutput").textContent = v >= 3000 ? `${formatPrice(3000)}+` : formatPrice(v);
  }

  function initShopControls() {
    renderChips();
    $("#categoryChips").addEventListener("click", (e) => {
      const chip = e.target.closest(".chip");
      if (chip) setCategory(chip.dataset.chip);
    });
    $("#searchInput").addEventListener("input", debounce((e) => { state.filters.query = e.target.value; renderShop(); }, 220));
    $("#priceRange").addEventListener("input", (e) => {
      state.filters.maxPrice = Number(e.target.value) >= 3000 ? 3000 : Number(e.target.value);
      updatePriceOutput();
    });
    $("#priceRange").addEventListener("input", debounce(() => renderShop(), 250));
    $("#sortSelect").addEventListener("change", (e) => { state.filters.sort = e.target.value; renderShop(); });
    $("#clearFilters").addEventListener("click", resetFilters);
    $("#emptyReset").addEventListener("click", resetFilters);
    updatePriceOutput();
    renderShop({ animate: false });
  }

  /* ---------------------------------------------------------------------
     Overlays (drawers, modals, mobile menu): focus trap + scroll lock
     --------------------------------------------------------------------- */
  const overlayStack = [];
  const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]), summary';

  function openOverlay(el, { trigger = document.activeElement, useBackdrop = true, onClose } = {}) {
    if (overlayStack.some((o) => o.el === el)) return;
    overlayStack.push({ el, trigger, onClose, useBackdrop });
    el.classList.add("is-open");
    el.setAttribute("aria-hidden", "false");
    document.body.classList.add("is-locked");
    if (useBackdrop) {
      const bd = $("#backdrop");
      bd.hidden = false;
      bd.style.zIndex = String(80 + overlayStack.length * 10 - 5);
      requestAnimationFrame(() => bd.classList.add("is-visible"));
    }
    el.style.zIndex = String(80 + overlayStack.length * 10);
    if (trigger && trigger.hasAttribute && trigger.hasAttribute("aria-expanded")) trigger.setAttribute("aria-expanded", "true");
    setTimeout(() => {
      const first = $$(FOCUSABLE, el).find((n) => n.offsetParent !== null);
      (first || el).focus({ preventScroll: true });
    }, 80);
  }

  function closeOverlay(el = overlayStack[overlayStack.length - 1]?.el) {
    const idx = overlayStack.findIndex((o) => o.el === el);
    if (idx === -1) return;
    const [entry] = overlayStack.splice(idx, 1);
    el.classList.remove("is-open");
    el.setAttribute("aria-hidden", "true");
    el.style.zIndex = "";
    if (entry.trigger && entry.trigger.hasAttribute && entry.trigger.hasAttribute("aria-expanded")) entry.trigger.setAttribute("aria-expanded", "false");
    const bd = $("#backdrop");
    const stillBackdrop = overlayStack.filter((o) => o.useBackdrop);
    if (!stillBackdrop.length) {
      bd.classList.remove("is-visible");
      setTimeout(() => { if (!overlayStack.some((o) => o.useBackdrop)) bd.hidden = true; }, 500);
    } else {
      bd.style.zIndex = String(80 + overlayStack.length * 10 - 5);
    }
    if (!overlayStack.length) document.body.classList.remove("is-locked");
    if (entry.onClose) entry.onClose();
    if (entry.trigger && document.contains(entry.trigger) && entry.trigger.focus) entry.trigger.focus({ preventScroll: true });
  }

  function closeAllOverlays() { while (overlayStack.length) closeOverlay(); }

  function initOverlays() {
    document.addEventListener("keydown", (e) => {
      const top = overlayStack[overlayStack.length - 1];
      if (!top) return;
      if (e.key === "Escape") { e.preventDefault(); closeOverlay(top.el); return; }
      if (e.key === "Tab") {
        const nodes = $$(FOCUSABLE, top.el).filter((n) => n.offsetParent !== null || n === document.activeElement);
        if (!nodes.length) return;
        const first = nodes[0], last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        else if (!top.el.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
      }
    });
    $("#backdrop").addEventListener("click", () => {
      const top = overlayStack[overlayStack.length - 1];
      if (top) closeOverlay(top.el);
    });
    document.addEventListener("click", (e) => {
      const closer = e.target.closest("[data-close]");
      if (closer) closeOverlay(closer.closest(".drawer, .modal"));
    });
    // Clicking the empty area around a modal panel closes it.
    $$(".modal:not(.modal--full)").forEach((m) => m.addEventListener("click", (e) => { if (e.target === m) closeOverlay(m); }));
  }

  /* ---------------------------------------------------------------------
     Quick view
     --------------------------------------------------------------------- */
  function openQuickView(id, trigger) {
    const p = getProduct(id);
    if (!p) return;
    const wished = state.wishlist.includes(p.id);
    const oneSize = p.sizes.length === 1;
    $("#qvContent").innerHTML = `
      <div class="qv__gallery">
        <div class="qv__main"><img id="qvMainImg" src="${imgUrl(p.images[0], 1100)}" alt="${escapeHTML(p.name)}"></div>
        <div class="qv__thumbs" role="group" aria-label="Product images">
          ${p.images.map((im, i) => `
            <button type="button" class="qv__thumb" data-img="${im}" aria-pressed="${i === 0}" aria-label="View image ${i + 1}">
              <img src="${imgUrl(im, 160)}" alt="">
            </button>`).join("")}
        </div>
      </div>
      <form class="qv__info" id="qvForm" novalidate>
        <div>
          <p class="eyebrow">${escapeHTML(p.category)}${p.isNew ? " &middot; New Arrival" : ""}</p>
          <h2 class="qv__name" id="qvTitle">${escapeHTML(p.name)}</h2>
        </div>
        <p class="qv__price">${formatPrice(p.price)}</p>
        <p class="qv__desc">${escapeHTML(p.desc)}</p>

        <fieldset class="opt-group">
          <legend class="opt-label" style="width:100%">Colour <b id="qvColorName">${escapeHTML(p.colors[0].name)}</b></legend>
          <div class="swatches">
            ${p.colors.map((c, i) => `
              <label class="swatch-opt" title="${escapeHTML(c.name)}">
                <input type="radio" name="color" value="${escapeHTML(c.name)}" ${i === 0 ? "checked" : ""}>
                <span style="background:${c.hex}"></span><span class="sr-only">${escapeHTML(c.name)}</span>
              </label>`).join("")}
          </div>
        </fieldset>

        <fieldset class="opt-group">
          <legend class="opt-label" style="width:100%">Size <b id="qvSizeName">${oneSize ? "One Size" : "Select a size"}</b></legend>
          <div class="sizes" id="qvSizes">
            ${p.sizes.map((s) => `
              <label class="size-opt"><input type="radio" name="size" value="${escapeHTML(s)}" ${oneSize ? "checked" : ""}><span>${escapeHTML(s)}</span></label>`).join("")}
          </div>
          <p class="opt-error" id="qvSizeError" aria-live="assertive"></p>
        </fieldset>

        <div class="qv__actions">
          <button type="submit" class="btn btn--dark">Add to Bag &mdash; ${formatPrice(p.price)}</button>
          <button type="button" class="qv__wish" data-action="wishlist" data-id="${p.id}" aria-pressed="${wished}"
            aria-label="${wished ? "Remove from" : "Add to"} wishlist">${heartSVG}</button>
        </div>

        <div class="qv__details">
          <details><summary>Composition &amp; Origin</summary><p>${escapeHTML(p.material)}</p></details>
          <details><summary>Delivery &amp; Returns</summary><p>Complimentary shipping over ${formatPrice(FREE_SHIPPING_THRESHOLD)}. Returns accepted within 30 days.</p></details>
        </div>
      </form>`;

    const form = $("#qvForm");
    form.addEventListener("change", (e) => {
      if (e.target.name === "color") $("#qvColorName").textContent = e.target.value;
      if (e.target.name === "size") {
        $("#qvSizeName").textContent = e.target.value;
        $("#qvSizeError").textContent = "";
        $("#qvSizes").classList.remove("is-invalid");
      }
    });
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const size = form.elements.size && (form.querySelector('input[name="size"]:checked') || {}).value;
      const color = (form.querySelector('input[name="color"]:checked') || {}).value;
      if (!size) {
        $("#qvSizeError").textContent = "Please select a size.";
        $("#qvSizes").classList.add("is-invalid");
        const firstSize = form.querySelector('input[name="size"]');
        if (firstSize) firstSize.focus();
        return;
      }
      addToCart(p.id, size, color, 1);
      closeOverlay($("#quickView"));
      setTimeout(() => openBag(), prefersReducedMotion.matches ? 0 : 350);
    });
    $$(".qv__thumb", $("#qvContent")).forEach((btn) => btn.addEventListener("click", () => {
      $$(".qv__thumb", $("#qvContent")).forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
      const main = $("#qvMainImg");
      main.style.animation = "none";
      void main.offsetWidth;
      main.style.animation = "";
      main.src = imgUrl(btn.dataset.img, 1100);
    }));

    const modal = $("#quickView");
    modal.querySelector(".modal__panel").scrollTop = 0;
    openOverlay(modal, { trigger });
  }

  /* ---------------------------------------------------------------------
     Cart
     --------------------------------------------------------------------- */
  const cartKey = (i) => `${i.id}|${i.size}|${i.color}`;
  const cartCount = () => state.cart.reduce((n, i) => n + i.qty, 0);
  const cartSubtotal = () => state.cart.reduce((sum, i) => sum + getProduct(i.id).price * i.qty, 0);

  function addToCart(id, size, color, qty = 1) {
    const p = getProduct(id);
    if (!p) return;
    const existing = state.cart.find((i) => i.id === id && i.size === size && i.color === color);
    if (existing) existing.qty = Math.min(10, existing.qty + qty);
    else state.cart.push({ id, size, color, qty });
    saveCart();
    renderCart();
    bumpBadge("#bagCount");
    showToast(`${p.name} added to your bag`);
  }

  function updateQty(key, delta) {
    const item = state.cart.find((i) => cartKey(i) === key);
    if (!item) return;
    item.qty = Math.min(10, Math.max(1, item.qty + delta));
    saveCart();
    renderCart();
  }

  function removeFromCart(key, { animate = true } = {}) {
    const idx = state.cart.findIndex((i) => cartKey(i) === key);
    if (idx === -1) return;
    const [removed] = state.cart.splice(idx, 1);
    saveCart();
    const row = $(`.line-item[data-key="${CSS.escape(key)}"]`);
    const done = () => renderCart();
    if (row && animate && !prefersReducedMotion.matches) { row.classList.add("is-removing"); setTimeout(done, 380); }
    else done();
    const p = getProduct(removed.id);
    showToast(`${p.name} removed`, {
      label: "Undo",
      onClick: () => { state.cart.splice(Math.min(idx, state.cart.length), 0, removed); saveCart(); renderCart(); },
    });
  }

  function renderCart() {
    const count = cartCount();
    const subtotal = cartSubtotal();
    const badge = $("#bagCount");
    badge.textContent = count;
    badge.classList.toggle("has-items", count > 0);
    $("#bagBtn").setAttribute("aria-label", `Open shopping bag, ${count} ${count === 1 ? "item" : "items"}`);
    $("#bagTitleCount").textContent = count ? `(${count})` : "";
    $("#bagSubtotal").textContent = formatPrice(subtotal);
    $("#bagFoot").hidden = count === 0;

    const remaining = FREE_SHIPPING_THRESHOLD - subtotal;
    $("#shipProgress").innerHTML = count === 0 ? "" : `
      <span>${remaining > 0 ? `You are <strong>${formatPrice(remaining)}</strong> away from complimentary shipping` : "You've unlocked <strong>complimentary shipping</strong>"}</span>
      <div class="progress-bar" aria-hidden="true"><span style="width:${Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)}%"></span></div>`;

    $("#bagItems").innerHTML = count === 0 ? `
      <div class="drawer-empty">
        <p class="display-sm">Your bag is empty</p>
        <p>Discover pieces composed with intention.</p>
        <a href="#shop" class="btn btn--dark" data-category="All" data-close-drawer>Explore Collection</a>
      </div>` :
      state.cart.map((i) => {
        const p = getProduct(i.id);
        const key = cartKey(i);
        return `
          <div class="line-item" data-key="${escapeHTML(key)}">
            <div class="line-item__img"><img src="${imgUrl(p.images[0], 240)}" alt="${escapeHTML(p.name)}"></div>
            <div>
              <div class="line-item__top">
                <h3 class="line-item__name">${escapeHTML(p.name)}</h3>
                <strong class="line-item__price">${formatPrice(p.price * i.qty)}</strong>
              </div>
              <p class="line-item__meta">${escapeHTML(i.color)} &middot; ${escapeHTML(i.size)}${i.qty > 1 ? ` &middot; ${formatPrice(p.price)} each` : ""}</p>
              <div class="line-item__bottom">
                <div class="qty" role="group" aria-label="Quantity for ${escapeHTML(p.name)}">
                  <button type="button" data-qty="-1" data-key="${escapeHTML(key)}" aria-label="Decrease quantity" ${i.qty <= 1 ? "disabled" : ""}>&minus;</button>
                  <span aria-live="polite">${i.qty}</span>
                  <button type="button" data-qty="1" data-key="${escapeHTML(key)}" aria-label="Increase quantity" ${i.qty >= 10 ? "disabled" : ""}>+</button>
                </div>
                <div class="line-item__actions">
                  <button type="button" class="mini-link" data-move-wish="${escapeHTML(key)}">Save for later</button>
                  <button type="button" class="mini-link" data-remove="${escapeHTML(key)}">Remove</button>
                </div>
              </div>
            </div>
          </div>`;
      }).join("");
  }

  function initCart() {
    $("#bagItems").addEventListener("click", (e) => {
      const qtyBtn = e.target.closest("[data-qty]");
      const rmBtn = e.target.closest("[data-remove]");
      const wishBtn = e.target.closest("[data-move-wish]");
      if (qtyBtn) updateQty(qtyBtn.dataset.key, Number(qtyBtn.dataset.qty));
      if (rmBtn) removeFromCart(rmBtn.dataset.remove);
      if (wishBtn) {
        const key = wishBtn.dataset.moveWish;
        const item = state.cart.find((i) => cartKey(i) === key);
        if (item && !state.wishlist.includes(item.id)) toggleWishlist(item.id, { silent: true });
        state.cart = state.cart.filter((i) => cartKey(i) !== key);
        saveCart();
        renderCart();
        showToast("Saved to your wishlist");
      }
    });
    $("#bagBtn").addEventListener("click", (e) => openBag(e.currentTarget));
    $("#checkoutBtn").addEventListener("click", () => openCheckout());
    renderCart();
  }

  function openBag(trigger = $("#bagBtn")) {
    closeMobileMenu();
    if ($("#wishlistDrawer").classList.contains("is-open")) closeOverlay($("#wishlistDrawer"));
    openOverlay($("#bagDrawer"), { trigger });
  }

  function bumpBadge(sel) {
    const b = $(sel);
    b.classList.remove("bump");
    void b.offsetWidth;
    b.classList.add("bump");
  }

  /* ---------------------------------------------------------------------
     Wishlist
     --------------------------------------------------------------------- */
  function toggleWishlist(id, { silent = false } = {}) {
    const p = getProduct(id);
    if (!p) return;
    const has = state.wishlist.includes(id);
    state.wishlist = has ? state.wishlist.filter((w) => w !== id) : [...state.wishlist, id];
    saveWishlist();
    syncWishButtons(id);
    renderWishlist();
    if (!has) bumpBadge("#wishlistCount");
    if (!silent) showToast(has ? `${p.name} removed from wishlist` : `${p.name} saved to wishlist`);
  }

  function syncWishButtons(id) {
    const wished = state.wishlist.includes(id);
    const p = getProduct(id);
    $$(`[data-action="wishlist"][data-id="${id}"]`).forEach((btn) => {
      btn.setAttribute("aria-pressed", String(wished));
      btn.setAttribute("aria-label", btn.classList.contains("qv__wish")
        ? `${wished ? "Remove from" : "Add to"} wishlist`
        : `${wished ? "Remove" : "Add"} ${p.name} ${wished ? "from" : "to"} wishlist`);
      btn.classList.remove("pop");
      void btn.offsetWidth;
      if (wished) btn.classList.add("pop");
    });
  }

  function renderWishlist() {
    const n = state.wishlist.length;
    const badge = $("#wishlistCount");
    badge.textContent = n;
    badge.classList.toggle("has-items", n > 0);
    $("#wishlistBtn").setAttribute("aria-label", `Open wishlist, ${n} ${n === 1 ? "item" : "items"}`);
    $("#wishlistTitleCount").textContent = n ? `(${n})` : "";
    $("#wishlistItems").innerHTML = n === 0 ? `
      <div class="drawer-empty">
        <p class="display-sm">Your wishlist is empty</p>
        <p>Tap the heart on any piece to save it here.</p>
        <a href="#shop" class="btn btn--dark" data-category="All" data-close-drawer>Discover Pieces</a>
      </div>` :
      state.wishlist.map((id) => {
        const p = getProduct(id);
        return `
          <div class="line-item">
            <div class="line-item__img"><img src="${imgUrl(p.images[0], 240)}" alt="${escapeHTML(p.name)}"></div>
            <div>
              <div class="line-item__top">
                <h3 class="line-item__name">${escapeHTML(p.name)}</h3>
                <strong class="line-item__price">${formatPrice(p.price)}</strong>
              </div>
              <p class="line-item__meta">${escapeHTML(p.category)}</p>
              <div class="line-item__bottom">
                <button type="button" class="btn btn--dark" style="min-height:38px;padding:0 1.1rem" data-wish-add="${id}">Select options</button>
                <button type="button" class="mini-link" data-wish-remove="${id}">Remove</button>
              </div>
            </div>
          </div>`;
      }).join("");
  }

  function initWishlist() {
    $("#wishlistBtn").addEventListener("click", (e) => {
      closeMobileMenu();
      if ($("#bagDrawer").classList.contains("is-open")) closeOverlay($("#bagDrawer"));
      openOverlay($("#wishlistDrawer"), { trigger: e.currentTarget });
    });
    $("#wishlistItems").addEventListener("click", (e) => {
      const add = e.target.closest("[data-wish-add]");
      const rm = e.target.closest("[data-wish-remove]");
      if (rm) toggleWishlist(rm.dataset.wishRemove);
      if (add) openQuickView(add.dataset.wishAdd, add);
    });
    renderWishlist();
  }

  /* ---------------------------------------------------------------------
     Global delegated clicks (cards, category links)
     --------------------------------------------------------------------- */
  function initDelegation() {
    document.addEventListener("click", (e) => {
      const wish = e.target.closest('[data-action="wishlist"]');
      if (wish) { e.preventDefault(); e.stopPropagation(); toggleWishlist(wish.dataset.id); return; }

      const qv = e.target.closest('[data-action="quickview"]');
      if (qv) { e.preventDefault(); openQuickView(qv.dataset.id, e.target.closest("button") || qv); return; }

      const catLink = e.target.closest("[data-category]");
      if (catLink) {
        e.preventDefault();
        const fromOverlay = catLink.closest(".drawer, .mobile-menu");
        if (fromOverlay) {
          if (fromOverlay.classList.contains("mobile-menu")) closeMobileMenu({ restoreFocus: false });
          else closeOverlay(fromOverlay);
        }
        if (catLink.dataset.category === "All" && catLink.closest(".hero")) resetFilters();
        setCategory(catLink.dataset.category, { scroll: true });
        return;
      }

      // In-page anchor links from inside the mobile menu
      const anchor = e.target.closest('.mobile-menu a[href^="#"]');
      if (anchor) closeMobileMenu({ restoreFocus: false });
    });

    // Keyboard access to card image area (Enter/Space opens quick view).
    document.addEventListener("keydown", (e) => {
      const media = e.target.classList && e.target.classList.contains("card__media") ? e.target : null;
      if (media && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); openQuickView(media.dataset.id, media); }
    });

    $("#searchBtn").addEventListener("click", () => {
      closeMobileMenu({ restoreFocus: false });
      $("#shop").scrollIntoView({ behavior: prefersReducedMotion.matches ? "auto" : "smooth" });
      setTimeout(() => $("#searchInput").focus({ preventScroll: true }), prefersReducedMotion.matches ? 0 : 650);
    });

    $$(".footer-link").forEach((btn) => btn.addEventListener("click", () => {
      const info = INFO[btn.dataset.info];
      $("#infoTitle").textContent = info.title;
      $("#infoBody").innerHTML = info.body.map((t) => `<p>${t}</p>`).join("");
      openOverlay($("#infoModal"), { trigger: btn });
    }));
  }

  /* ---------------------------------------------------------------------
     Mobile menu & header
     --------------------------------------------------------------------- */
  function openMobileMenu() {
    const menu = $("#mobileMenu");
    document.body.classList.add("menu-open", "is-locked");
    $("#header").classList.add("is-solid");
    menu.classList.add("is-open");
    menu.setAttribute("aria-hidden", "false");
    $("#menuToggle").setAttribute("aria-expanded", "true");
    $("#menuToggle").setAttribute("aria-label", "Close menu");
    setTimeout(() => $("a", menu).focus({ preventScroll: true }), 150);
  }

  function closeMobileMenu({ restoreFocus = true } = {}) {
    const menu = $("#mobileMenu");
    if (!menu.classList.contains("is-open")) return;
    menu.classList.remove("is-open");
    menu.setAttribute("aria-hidden", "true");
    document.body.classList.remove("menu-open");
    if (!overlayStack.length) document.body.classList.remove("is-locked");
    $("#header").classList.remove("is-solid");
    $("#menuToggle").setAttribute("aria-expanded", "false");
    $("#menuToggle").setAttribute("aria-label", "Open menu");
    if (restoreFocus) $("#menuToggle").focus({ preventScroll: true });
  }

  function initHeader() {
    $("#menuToggle").addEventListener("click", () => {
      $("#mobileMenu").classList.contains("is-open") ? closeMobileMenu() : openMobileMenu();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && $("#mobileMenu").classList.contains("is-open") && !overlayStack.length) closeMobileMenu();
    });
    window.addEventListener("resize", debounce(() => { if (window.innerWidth > 900) closeMobileMenu({ restoreFocus: false }); }, 150));

    const header = $("#header");
    const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // Rotating announcement bar
    const msgs = $$(".announcement__msg");
    let current = 0;
    if (msgs.length > 1 && !prefersReducedMotion.matches) {
      setInterval(() => {
        msgs[current].classList.remove("is-active");
        current = (current + 1) % msgs.length;
        msgs[current].classList.add("is-active");
      }, 4200);
    }
  }

  /* ---------------------------------------------------------------------
     Scroll animations: IntersectionObserver reveals & parallax
     --------------------------------------------------------------------- */
  let revealObserver = null;

  function observeReveal(el) {
    if (!revealObserver) { el.classList.add("is-visible"); return; }
    revealObserver.observe(el);
  }
  function observeReveals(root = document) { $$(".reveal", root).forEach(observeReveal); }

  function initReveals() {
    if (prefersReducedMotion.matches || !("IntersectionObserver" in window)) {
      revealObserver = null;
      $$(".reveal").forEach((el) => el.classList.add("is-visible"));
      return;
    }
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    observeReveals();
  }

  function initParallax() {
    const layers = [
      { el: $(".hero__media"), section: $(".hero"), speed: 0.22 },
      { el: $(".campaign__media"), section: $(".campaign"), speed: 0.14 },
    ].filter((l) => l.el && l.section);
    let ticking = false;
    const visible = new Set();

    const update = () => {
      ticking = false;
      if (prefersReducedMotion.matches) return;
      const vh = window.innerHeight;
      layers.forEach((l) => {
        if (!visible.has(l.section)) return;
        const r = l.section.getBoundingClientRect();
        // Offset relative to the section's centre passing through the viewport centre.
        const progress = (r.top + r.height / 2 - vh / 2);
        const y = l.section.classList.contains("hero") ? Math.max(0, -r.top) * l.speed : -progress * l.speed;
        l.el.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
      });
    };
    const request = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };

    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((en) => (en.isIntersecting ? visible.add(en.target) : visible.delete(en.target)));
        request();
      });
      layers.forEach((l) => io.observe(l.section));
    } else {
      layers.forEach((l) => visible.add(l.section));
    }
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    prefersReducedMotion.addEventListener?.("change", () => layers.forEach((l) => (l.el.style.transform = "")));
  }

  /* ---------------------------------------------------------------------
     Form validation helpers
     --------------------------------------------------------------------- */
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function setFieldError(input, message) {
    const field = input.closest(".field");
    if (!field) return;
    field.classList.toggle("is-invalid", Boolean(message));
    input.setAttribute("aria-invalid", message ? "true" : "false");
    const err = $(".field__error", field);
    if (err) {
      if (!err.id) err.id = `${input.id}-error`;
      err.textContent = message || "";
      if (message) input.setAttribute("aria-describedby", err.id); else input.removeAttribute("aria-describedby");
    }
  }

  function validateInput(input) {
    const v = input.value.trim();
    const label = (input.closest(".field")?.querySelector("label")?.textContent || "This field").trim();
    let msg = "";
    if (input.required && !v) msg = `${label} is required.`;
    else if (input.type === "email" && v && !EMAIL_RE.test(v)) msg = "Please enter a valid email address.";
    else if (input.minLength > 0 && v.length < input.minLength) msg = `${label} must be at least ${input.minLength} characters.`;
    else if (input.pattern && v && !new RegExp(`^(?:${input.pattern})$`).test(v)) msg = `Please enter a valid ${label.toLowerCase()}.`;
    setFieldError(input, msg);
    return !msg;
  }

  function attachLiveValidation(form) {
    $$(".field input, .field select", form).forEach((input) => {
      input.addEventListener("blur", () => { if (input.value.trim() || input.dataset.touched) validateInput(input); input.dataset.touched = "1"; });
      input.addEventListener("input", () => { if (input.closest(".field").classList.contains("is-invalid")) validateInput(input); });
      input.addEventListener("change", () => { if (input.tagName === "SELECT") validateInput(input); });
    });
  }

  /* ---------------------------------------------------------------------
     Newsletter
     --------------------------------------------------------------------- */
  function initNewsletter() {
    const form = $("#newsletterForm");
    attachLiveValidation(form);
    const consent = $("#nlConsent");
    const consentErr = $(".field__error--consent", form);
    consent.addEventListener("change", () => { if (consent.checked) consentErr.textContent = ""; });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const inputs = $$(".field input", form);
      const results = inputs.map(validateInput);
      let ok = results.every(Boolean);
      if (!consent.checked) { consentErr.textContent = "Please accept to subscribe."; ok = false; }
      if (!ok) {
        const firstBad = inputs.find((_, i) => !results[i]) || consent;
        firstBad.focus();
        return;
      }
      const name = $("#nlName").value.trim();
      const success = $("#newsletterSuccess");
      success.hidden = false;
      success.innerHTML = `Thank you, ${escapeHTML(name)}. You're on the list &mdash; watch your inbox for the next VELORA Letter. <small>(Demo: no email is actually sent.)</small>`;
      form.reset();
      inputs.forEach((i) => { setFieldError(i, ""); delete i.dataset.touched; });
      showToast("Welcome to the VELORA Letter");
    });
  }

  /* ---------------------------------------------------------------------
     Demo checkout
     --------------------------------------------------------------------- */
  let checkoutStep = 1;

  function shippingCost(method, subtotal) {
    if (method === "express") return EXPRESS_SHIPPING;
    if (method === "boutique") return 0;
    return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING;
  }

  function orderTotals() {
    const subtotal = cartSubtotal();
    const method = ($('#checkoutForm input[name="shipping"]:checked') || {}).value || "standard";
    const shipping = shippingCost(method, subtotal);
    const tax = Math.round(subtotal * TAX_RATE);
    return { subtotal, shipping, tax, total: subtotal + shipping + tax, method };
  }

  function renderOrderSummary() {
    $("#summaryItems").innerHTML = state.cart.map((i) => {
      const p = getProduct(i.id);
      return `<li class="summary-item">
        <img src="${imgUrl(p.images[0], 140)}" alt="">
        <div>${escapeHTML(p.name)}<small>${escapeHTML(i.color)} · ${escapeHTML(i.size)} · Qty ${i.qty}</small></div>
        <span>${formatPrice(p.price * i.qty)}</span>
      </li>`;
    }).join("");
    const t = orderTotals();
    $("#sumSubtotal").textContent = formatPrice(t.subtotal);
    $("#sumShipping").textContent = t.shipping === 0 ? "Complimentary" : formatPrice(t.shipping);
    $("#sumTax").textContent = formatPrice(t.tax);
    $("#sumTotal").textContent = formatPrice(t.total);
    const stdLabel = $('[data-ship-label="standard"]');
    if (stdLabel) stdLabel.textContent = t.subtotal >= FREE_SHIPPING_THRESHOLD ? "Free" : formatPrice(STANDARD_SHIPPING);
  }

  function goToStep(n) {
    checkoutStep = n;
    $$("#checkoutForm .step").forEach((s) => { s.hidden = Number(s.dataset.step) !== n; });
    $$("#checkoutSteps li").forEach((li, i) => {
      li.classList.toggle("is-active", i + 1 === n);
      li.classList.toggle("is-done", i + 1 < n);
      if (i + 1 === n) li.setAttribute("aria-current", "step"); else li.removeAttribute("aria-current");
    });
    if (n === 3) renderReview();
    $(".checkout").scrollTo({ top: 0, behavior: prefersReducedMotion.matches ? "auto" : "smooth" });
    const legend = $(`#checkoutForm .step[data-step="${n}"] input, #checkoutForm .step[data-step="${n}"] button`);
    if (legend) setTimeout(() => legend.focus({ preventScroll: true }), 50);
  }

  function renderReview() {
    const f = $("#checkoutForm").elements;
    const t = orderTotals();
    const methodLabel = { standard: "Standard Delivery (3–5 days)", express: "Express Delivery (1–2 days)", boutique: "Collect in Boutique" }[t.method];
    $("#reviewBlock").innerHTML = `
      <div><h4>Ship to</h4><p>${escapeHTML(f.first.value)} ${escapeHTML(f.last.value)}<br>${escapeHTML(f.address.value)}<br>${escapeHTML(f.city.value)} ${escapeHTML(f.zip.value)}<br>${escapeHTML(f.country.value)}</p></div>
      <div><h4>Contact</h4><p>${escapeHTML(f.email.value)}</p><h4 style="margin-top:1rem">Delivery</h4><p>${methodLabel}${$("#coGift").checked ? "<br>Signature gift wrapping" : ""}</p></div>`;
  }

  function openCheckout() {
    if (!state.cart.length) { showToast("Your bag is empty"); return; }
    closeOverlay($("#bagDrawer"));
    const form = $("#checkoutForm");
    form.hidden = false;
    $("#confirmation").hidden = true;
    $(".checkout__summary").hidden = false;
    $(".checkout__body").classList.remove("is-complete");
    $(".demo-banner").hidden = false;
    $("#checkoutSteps").hidden = false;
    renderOrderSummary();
    goToStep(1);
    openOverlay($("#checkout"), { trigger: $("#bagBtn"), useBackdrop: false });
  }

  function initCheckout() {
    const form = $("#checkoutForm");
    attachLiveValidation(form);

    form.addEventListener("click", (e) => {
      if (e.target.closest("[data-next]")) {
        if (checkoutStep === 1) {
          const inputs = $$('.step[data-step="1"] input, .step[data-step="1"] select', form);
          const results = inputs.map(validateInput);
          if (!results.every(Boolean)) { inputs[results.indexOf(false)].focus(); return; }
        }
        goToStep(checkoutStep + 1);
      }
      if (e.target.closest("[data-prev]")) goToStep(checkoutStep - 1);
    });
    form.addEventListener("change", (e) => {
      if (e.target.name === "shipping") renderOrderSummary();
      if (e.target.id === "coTerms" && e.target.checked) $(".field__error--terms").textContent = "";
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (checkoutStep !== 3) { $("[data-next]", $(`.step[data-step="${checkoutStep}"]`))?.click(); return; }
      if (!$("#coTerms").checked) {
        $(".field__error--terms").textContent = "Please confirm you understand this is a demonstration.";
        $("#coTerms").focus();
        return;
      }
      const t = orderTotals();
      const items = state.cart.map((i) => ({ ...i, product: getProduct(i.id) }));
      const orderNo = `VL-DEMO-${Date.now().toString(36).toUpperCase().slice(-6)}`;

      $("#confName").textContent = form.elements.first.value.trim();
      $("#confNumber").textContent = orderNo;
      $("#confSummary").innerHTML = items.map((i) =>
        `<div class="summary-row"><span>${escapeHTML(i.product.name)} &times; ${i.qty}</span><span>${formatPrice(i.product.price * i.qty)}</span></div>`).join("") +
        `<div class="summary-row summary-row--total"><span>Demo total</span><strong>${formatPrice(t.total)}</strong></div>`;

      form.hidden = true;
      $(".demo-banner").hidden = true;
      $(".checkout__summary").hidden = true;
      $(".checkout__body").classList.add("is-complete");
      $$("#checkoutSteps li").forEach((li) => { li.classList.remove("is-active"); li.classList.add("is-done"); });
      $("#confirmation").hidden = false;
      $(".checkout").scrollTo({ top: 0 });
      $("#confirmation").focus({ preventScroll: true });

      // Demo order "complete": clear the bag and reset the form.
      state.cart = [];
      saveCart();
      renderCart();
      form.reset();
      $$(".field", form).forEach((f) => f.classList.remove("is-invalid"));
      $$(".field input, .field select", form).forEach((i) => { i.removeAttribute("aria-invalid"); delete i.dataset.touched; });
      $$(".field__error", form).forEach((er) => (er.textContent = ""));
    });

    $("#confDone").addEventListener("click", () => {
      closeOverlay($("#checkout"));
      window.scrollTo({ top: 0, behavior: prefersReducedMotion.matches ? "auto" : "smooth" });
    });
  }

  /* ---------------------------------------------------------------------
     Drawer CTA links ("Explore Collection" inside empty drawers)
     --------------------------------------------------------------------- */
  function initMisc() {
    $("#year").textContent = new Date().getFullYear();
    // Keep cart/wishlist in sync across tabs.
    window.addEventListener("storage", (e) => {
      if (e.key === STORAGE_KEYS.cart) { state.cart = sanitizeCart(storage.get(STORAGE_KEYS.cart, [])); renderCart(); }
      if (e.key === STORAGE_KEYS.wishlist) {
        state.wishlist = storage.get(STORAGE_KEYS.wishlist, []).filter((id) => getProduct(id));
        renderWishlist();
        PRODUCTS.forEach((p) => syncWishButtons(p.id));
      }
    });
  }

  /* ---------------------------------------------------------------------
     Boot
     --------------------------------------------------------------------- */
  function init() {
    initImageFallbacks();
    initReveals();
    renderArrivals();
    initShopControls();
    initOverlays();
    initDelegation();
    initCart();
    initWishlist();
    initHeader();
    initParallax();
    initNewsletter();
    initCheckout();
    initMisc();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
