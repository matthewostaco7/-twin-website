  // >>> Put your real email here (used for every contact link on the site) <<<
  const EMAIL = "twinbrand.ph@gmail.com";
  document.querySelectorAll("[data-mail]").forEach(a => {
    a.href = "mailto:" + EMAIL + "?subject=" + encodeURIComponent((a.dataset.subject || "Project") + " inquiry");
  });
  // >>> Put your real profile links here <<<
  const SOCIAL = { fb: "https://www.facebook.com/", ig: "https://www.instagram.com/", x: "https://x.com/" };
  document.querySelectorAll("[data-soc]").forEach(a => { a.href = SOCIAL[a.dataset.soc]; });
  document.querySelectorAll("[data-email]").forEach(a => { a.href = "mailto:" + EMAIL; a.textContent = EMAIL; });
  document.documentElement.classList.add("js");

  const els = document.querySelectorAll(".rv");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .1 });
    els.forEach(el => io.observe(el));
  } else els.forEach(el => el.classList.add("in"));

  // sidebar highlights where you are
  const links = [...document.querySelectorAll("[data-spy]")];
  const map = {}; links.forEach(l => map[l.dataset.spy] = l);
  const setActive = id => links.forEach(l => l.setAttribute("aria-current", l.dataset.spy === id));
  // mobile: tapping Services frames the four cards in the middle of the visible area (above the bottom bar)
  function focusServices(smooth) {
    const g = document.querySelector(".svc-grid"); if (!g) return false;
    const bar = (document.querySelector(".side") || {}).offsetHeight || 80;
    const r = g.getBoundingClientRect(), vis = innerHeight - bar;
    const top = Math.max(0, r.top + scrollY - Math.max(24, (vis - r.height) / 2));
    window.scrollTo({ top: top, behavior: smooth ? "smooth" : "auto" });
    setActive("services");
    if (window.__svcActivate) setTimeout(window.__svcActivate, smooth ? 250 : 0);
    return true;
  }
  document.querySelectorAll('[data-spy="services"]').forEach(l => l.addEventListener("click", e => {
    if (innerWidth > 900) return;
    const h = location.hash;
    if (h === "" || h === "#top" || h === "#services" || h === "#teaser") { e.preventDefault(); focusServices(true); }
  }));
  if ("IntersectionObserver" in window) {
    const spy = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) setActive({top:"top",services:"services",teaser:"work",principles:"work",start:"start"}[e.target.id]);
    }), { rootMargin: "-40% 0px -55% 0px" });
    ["top", "services", "teaser", "principles", "start"].forEach(id => { const el = document.getElementById(id); if (el) spy.observe(el); });
  }

  // ---- Gallery data: replace with real clients (name, type). Add an image later inside .ph ----
  const MARK = '<svg viewBox="137 475 1340 759" aria-hidden="true"><polygon points="137,475 1111,475 1477,1234 891,1234 605,642 293,794"/></svg>';
  const esc = t => String(t == null ? "" : t).replace(/[&<>"']/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
  const safeSrc = u => (typeof u === "string" && /^data:image\/(png|jpe?g|webp|gif|avif);/.test(u)) ? u : "";
  const types = ["Brand","Rebrand","Debrand","Logo"];
  // Each service has its own chapters. They drive the contents list, the page sections and the editor.
  const SECTION_DEFS = {
    Brand: [["logo", "Logo"], ["colors", "Colors"], ["typography", "Typography"], ["language", "Brand language"], ["application", "Application"]],
    Rebrand: [["before", "Before"], ["logo", "Logo"], ["colors", "Colors"], ["typography", "Typography"], ["language", "Brand language"], ["application", "Application"]],
    Debrand: [["audit", "Audit"], ["logo", "Logo"], ["colors", "Colors"], ["typography", "Typography"], ["application", "Application"]],
    Logo: [["logo", "Logo"], ["variations", "Variations"], ["application", "Application"]]
  };
  const secsOf = c => SECTION_DEFS[c.type] || SECTION_DEFS.Brand;
  function coverOf(c) {
    if (c.cover) return c.cover;
    const defs = secsOf(c);
    for (let i = 0; i < defs.length; i++) { const l = c.sections && c.sections[defs[i][0]]; if (l && l.length) return l[0]; }
    return null;
  }
  const ratios = [0.8, 1, 0.75, 1.33, 0.67, 1.25, 0.9, 1.1];   // varied tile shapes (width / height)
  const PLACEHOLDERS = Array.from({length: 20}, (_, i) => ({ id: "p" + i, name: "Client " + String(i + 1).padStart(2, "0"), type: types[i % 4], r: ratios[(i * 3) % ratios.length], date: "2026", reason: "", ph: true }));
  let DATA = { projects: [] };
  try { if (window.TWIN_DATA) DATA = window.TWIN_DATA; else { const el = document.getElementById("twin-data"); if (el) DATA = JSON.parse(el.textContent); } } catch (e) {}
  // service images: DATA.serviceImages = { branding: "data:image/...", ... }; each card sizes itself to its image
  try { const SI = DATA.serviceImages || {}; document.querySelectorAll(".sv").forEach(a => {
    const k = (a.getAttribute("href") || "").split("/").pop(), src = SI[k]; if (!src) return;
    const im = new Image(); im.className = "sv-img"; im.alt = ""; im.decoding = "async"; im.src = src;
    im.addEventListener("load", () => { im.width = im.naturalWidth; im.height = im.naturalHeight; });
    a.insertBefore(im, a.firstChild); a.classList.add("has-img");
  }); } catch (e) {}
  const REAL = Array.isArray(DATA.projects) ? DATA.projects : [];   // owner-managed projects
  const clients = REAL.length ? REAL : PLACEHOLDERS;                 // placeholders show until the first real project is added
  // Project fields: name, type, date, reason, images: [urls] (swipeable, IG-style). Use details: [["Label", "Value"], ...] for custom rows. `slides` only sets how many placeholders show.
  const gal = document.getElementById("gallery");
  let shown = clients, savedScroll = 0;

  function coverOrMark(c) {
    const cov = coverOf(c), cv = cov ? safeSrc(cov.src) : "";
    return cv ? '<img class="cv" src="' + cv + '" alt="" loading="lazy" decoding="async">' : '';
  }
  function tile(c, gi, i, small) {
    return '<button class="g" data-id="' + c.id + '" aria-label="' + c.name + '" style="--ar:' + (Number(c.r) > 0 ? Number(c.r) : 1) + ';animation-delay:' + (i * 30) + 'ms"><div class="ph' + (gi % 2 ? ' alt' : '') + '" style="aspect-ratio:' + c.r + '">' + coverOrMark(c) + (small ? '' : '<span class="cap">' + c.name + ' <span>· ' + c.type + '</span></span>') + '</div></button>';
  }
  function renderGallery(f) {
    shown = clients.filter(c => f === "all" || c.type === f);
    gal.innerHTML = shown.map((c, i) => tile(c, clients.indexOf(c), i, false)).join("");
  }
  renderGallery("all");
  if (REAL.length) {
    document.querySelector("#teaser .work").innerHTML = REAL.slice(0, 3).map(c => {
      const cov = coverOf(c), cv = cov ? safeSrc(cov.src) : "";
      return '<a class="fc rv in" href="#/work/' + esc(c.id) + '"><div class="viz">' + (cv ? '<img class="cvr" src="' + cv + '" alt="" loading="lazy">' : '') + '</div><div class="txt"><h3>' + esc(c.name) + '</h3><p>' + esc(c.type) + '</p></div></a>';
    }).join("");
  }
  // short human description under the tabs; it scrolls away with the gallery
  const TAB_COPY = {
    all: ["All work", "A look at what we’ve made so far, from first marks to full brand systems."],
    Brand: ["Brand", "Brands built from the ground up. From who you are to a system you can run."],
    Rebrand: ["Rebrand", "Companies ready for their next look. Same story, told the way it deserves."],
    Debrand: ["Debrand", "Less noise, fewer parts. We strip a brand back until only what matters is left."],
    Logo: ["Logo", "One mark, done right. Simple, ownable and built to hold up everywhere."]
  };
  function setIntro(f) {
    const c = TAB_COPY[f] || TAB_COPY.all, t = c[1], p = document.getElementById("galIntroP");
    let i = t.indexOf(". "); if (i < 0) i = t.indexOf(", ");
    p.textContent = "";
    if (i < 0) { p.textContent = t; return; }
    const lead = document.createElement("span"); lead.className = "gi-lead"; lead.textContent = t.slice(0, i + 1);
    p.appendChild(lead); p.appendChild(document.createTextNode(t.slice(i + 1)));
  }
  setIntro("all");
  document.getElementById("filters").addEventListener("click", e => {
    const b = e.target.closest(".fp"); if (!b) return;
    document.querySelectorAll(".fp").forEach(x => x.setAttribute("aria-pressed", x === b));
    renderGallery(b.dataset.f); setIntro(b.dataset.f);
    moveInd();
  });
  // TWIN signature: a sliding SIGNAL-orange pill behind the active tab
  function moveInd() {
    const b = document.querySelector('.fp[aria-pressed="true"]'), ind = document.getElementById("fpInd");
    if (!b || !ind || !b.offsetWidth) return;
    ind.style.width = b.offsetWidth + "px";
    ind.style.transform = "translateX(" + b.offsetLeft + "px)";
  }
  addEventListener("resize", moveInd);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(moveInd);


  // ---- Project page: fixed details on the left, scrolling sections on the right ----
  const vProj = document.getElementById("view-project"), pjScroll = document.getElementById("pjScroll"), pjToc = document.getElementById("pjToc");
  let pjIO = null, pjLast = "";
  function fig(im, c) {
    const src = im ? safeSrc(im.src) : "", cap = im && im.caption ? im.caption : "";
    const ratio = (im && im.w && im.h) ? (im.w / im.h).toFixed(3) : c.r;
    return '<figure class="pj-fig"><div class="pj-img" style="aspect-ratio:' + ratio + ((im && im.w) ? ';--nw:' + im.w + 'px' : '') + '">' + (src ? '<img src="' + src + '" alt="' + esc(cap || c.name) + '" loading="lazy">' : '') + '</div>' + (cap ? '<figcaption>' + esc(cap) + '</figcaption>' : '') + '</figure>';
  }
  function setPjToc(id) {
    let on = null;
    document.querySelectorAll("#pjToc a").forEach(a => { const m = a.dataset.id === id; if (m) on = a; a.setAttribute("aria-current", String(m)); });
    if (on && innerWidth <= 900) pjToc.scrollTo({ left: on.offsetLeft - pjToc.clientWidth / 2 + on.clientWidth / 2, behavior: "smooth" });
  }
  function startPjSpy() {
    if (pjIO) pjIO.disconnect();
    pjIO = new IntersectionObserver(es => {
      const v = es.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (v[0]) setPjToc(v[0].target.id);
    }, { root: innerWidth > 900 ? pjScroll : null, rootMargin: "-10% 0px -70% 0px" });
    pjScroll.querySelectorAll(".pj-sec").forEach(el => pjIO.observe(el));
  }
  // several images in one chapter: one at a time, dots + soft arrows, swipe works too
  const AR_L = '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>', AR_R = '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>';
  function carousel(list, c, label) {
    return '<div class="pj-car" role="group" aria-roledescription="carousel" aria-label="' + esc(label) + '"><div class="pj-row" tabindex="0">' + list.map(im => fig(im, c)).join("") + '</div>' +
      '<button type="button" class="car-btn prev" aria-label="Previous image" hidden>' + AR_L + '</button><button type="button" class="car-btn next" aria-label="Next image">' + AR_R + '</button>' +
      '<div class="car-dots">' + list.map((_, i) => '<button type="button" class="car-dot" aria-label="Image ' + (i + 1) + ' of ' + list.length + '"' + (i === 0 ? ' aria-current="true"' : '') + '></button>').join("") + '</div></div>';
  }
  function initCarousels(root) {
    root.querySelectorAll(".pj-car").forEach(car => {
      const row = car.querySelector(".pj-row"), dots = [...car.querySelectorAll(".car-dot")], prev = car.querySelector(".prev"), next = car.querySelector(".next");
      const figs = [...row.querySelectorAll(".pj-fig")];
      const centre = f => f.offsetLeft + f.clientWidth / 2 - row.clientWidth / 2;
      const idx = () => { let b = 0, bd = 1e9; figs.forEach((f, k) => { const d = Math.abs(centre(f) - row.scrollLeft); if (d < bd) { bd = d; b = k; } }); return b; };
      const go = i => { const f = figs[Math.max(0, Math.min(figs.length - 1, i))]; row.scrollTo({ left: centre(f), behavior: "smooth" }); };
      const fx = () => { const w = Math.max(1, figs[0].clientWidth); figs.forEach(f => { const d = Math.min(1, Math.abs(centre(f) - row.scrollLeft) / w), im = f.firstElementChild; im.style.opacity = d < .02 ? "" : (1 - .45 * d).toFixed(3); }); };
      row.addEventListener("scroll", fx, { passive: true }); fx(); addEventListener("resize", fx);
      const sync = () => { const i = idx(); dots.forEach((x, k) => k === i ? x.setAttribute("aria-current", "true") : x.removeAttribute("aria-current")); prev.hidden = i === 0; next.hidden = i === dots.length - 1; };
      row.addEventListener("scroll", sync, { passive: true });
      dots.forEach((x, k) => x.addEventListener("click", () => go(k)));
      const tap = b => { b.classList.add("tapped"); setTimeout(() => b.classList.remove("tapped"), 450); };
      prev.addEventListener("click", () => { tap(prev); go(idx() - 1); }); next.addEventListener("click", () => { tap(next); go(idx() + 1); });
      row.addEventListener("keydown", e => { if (e.key === "ArrowRight") { e.preventDefault(); go(idx() + 1); } else if (e.key === "ArrowLeft") { e.preventDefault(); go(idx() - 1); } });
    });
  }
  /* pictures with transparent areas get a light backing in dark mode so dark logos stay visible */
  function markAlpha(root) {
    root.querySelectorAll(".pj-img img").forEach(im => {
      const chk = () => { try {
        const cv = document.createElement("canvas"); cv.width = 8; cv.height = 8; const cx = cv.getContext("2d", { willReadFrequently: true });
        cx.drawImage(im, 0, 0, 8, 8); const d = cx.getImageData(0, 0, 8, 8).data; let a = 0;
        for (let i = 3; i < d.length; i += 4) if (d[i] < 250) { a = 1; break; }
        if (a) im.closest(".pj-img").classList.add("has-alpha");
      } catch (er) {} };
      if (im.complete && im.naturalWidth) chk(); else im.addEventListener("load", chk, { once: true });
    });
  }
  function renderProject(c) {
    document.getElementById("pjName").textContent = c.name;
    document.getElementById("pjType").textContent = c.type;
    document.getElementById("pjDate").textContent = c.date || "";
    const secs = [], cov = coverOf(c);
    if (c.ph || cov || c.reason) {
      secs.push(["pj-overview", "Overview", '<section class="pj-sec" id="pj-overview" aria-label="Overview">' + (c.ph || cov ? fig(cov, c) : "") + (c.reason ? '<p class="pj-reason">' + esc(c.reason) + '</p>' : "") + '</section>', false]);
    }
    secsOf(c).forEach(d => {
      const list = c.ph ? [null] : ((c.sections && c.sections[d[0]]) || []);
      if (!list.length) return;
      secs.push(["pj-" + d[0], d[1], '<section class="pj-sec" id="pj-' + d[0] + '"><h2>' + d[1] + '</h2>' + (list.length > 1 ? carousel(list, c, d[1]) : list.map(im => fig(im, c)).join("")) + '</section>', true]);
    });
    const same = clients.filter(x => x !== c && x.type === c.type), rest = clients.filter(x => x !== c && x.type !== c.type);
    const more = same.concat(rest).slice(0, 5);
    secs.push(["pj-more", "More like this", '<section class="pj-sec" id="pj-more"><h2>More like this</h2><div class="mlt">' + more.map((m, i) => tile(m, clients.indexOf(m), i, true)).join("") + '</div></section>', false]);
    pjScroll.innerHTML = secs.map(x => x[2]).join(""); initCarousels(pjScroll); markAlpha(pjScroll);
    const toc = secs.filter(x => x[3]);
    pjToc.innerHTML = toc.map(x => '<li><a href="#' + x[0] + '" data-id="' + x[0] + '">' + x[1] + '</a></li>').join("");
    pjToc.parentElement.hidden = !toc.length;
    pjLast = toc.length ? toc[toc.length - 1][0] : "";
    setPjToc("");
    startPjSpy();
  }
  pjToc.addEventListener("click", e => {
    const a = e.target.closest("a"); if (!a) return;
    e.preventDefault();
    const el = document.getElementById(a.dataset.id); if (!el) return;
    if (innerWidth > 900) pjScroll.scrollTo({ top: el.offsetTop - parseInt(getComputedStyle(pjScroll).paddingTop, 10), behavior: "smooth" });
    else el.scrollIntoView({ behavior: "smooth", block: "start" });
    setPjToc(a.dataset.id);
  });
  const pjEnd = () => {
    if (vProj.hidden) return;
    const sc = innerWidth > 900 ? pjScroll : document.documentElement;
    if (pjLast && sc.scrollTop + sc.clientHeight >= sc.scrollHeight - 4) setPjToc("pj-more");
  };
  pjScroll.addEventListener("scroll", pjEnd, { passive: true });
  addEventListener("scroll", pjEnd, { passive: true });

  // tiles open the project page
  const openProject = e => {
    const b = e.target.closest(".g"); if (!b) return;
    if (!vWork.hidden) savedScroll = galScroll.scrollTop;
    location.hash = "#/work/" + b.dataset.id;
  };
  gal.addEventListener("click", openProject);
  pjScroll.addEventListener("click", openProject);

  // tap the tab you're already on to jump back to the top
  document.querySelectorAll(".item").forEach(a => a.addEventListener("click", () => {
    if (a.getAttribute("href") === location.hash) toTop();
  }));
  // Home: always works, even when already on #top or deep in a page
  document.querySelector('.item[href="#top"]').addEventListener("click", ev => {
    ev.preventDefault();
    if (location.hash !== "#top") history.pushState(null, "", "#top");
    vHome.hidden = false; route(); toTop(); setActive("top"); requestAnimationFrame(() => { toTop(); setActive("top"); });
  });

  // ---- Simple routing: #/work = gallery page, everything else = home ----
  // ---- Service pages: edit content here ----
  const ALWAYS = [["Brand Guidelines", "PDF"], ["Brand source file", "Figma"], ["Brand asset library", "HTML"], ["Social & marketing kit", "Canva"], ["Design tokens", "JSON"], ["Brand brief for AI & teams", "Markdown"]];
  const NEED = { "branding": "Branding", "debranding": "Debranding", "rebranding": "Rebranding", "logo": "Logo only" };
  const SERVICES = {
    "branding": {
      name: "Branding", line: "Built from the ground up.",
      overview: "For new companies that need a complete visual identity, built from the ground up: logo, color, type, and the system that holds it together.",
      included: ["Visual direction and references", "Logo design", "Color palette and typography system", "Component library, grid, and spacing", "Visual style guide", "Applications across key touchpoints"],
      steps: [["Discover", "Visual research and references."], ["Define", "Choose the visual direction."], ["Build", "Logo and visual system."], ["Systemize", "Everything packaged to ship."]],
      deliverables: ALWAYS, timeline: "3 weeks", revisions: "2 rounds", best: "New companies"
    },
    "debranding": {
      name: "Debranding", line: "Fewer parts. One clear system.",
      overview: "For companies with too many logos, fonts, and colors. We subtract until what's left is one clear visual system that looks like you.",
      included: ["Visual audit of what exists today", "One refined primary logo", "A single, reduced color palette", "Two to three fonts, no more", "Simplified components and clear hierarchy", "A retire guide: what not to use anymore"],
      steps: [["Audit", "We review every visual that exists today."], ["Clarify", "Decide which visuals are essential."], ["Simplify", "Cut, merge, refine."], ["Hand over", "Files, guidelines, retire guide."]],
      deliverables: ALWAYS, timeline: "2–3 weeks", revisions: "2 rounds", best: "Cluttered brands"
    },
    "rebranding": {
      name: "Rebranding", line: "Caught up to who you are now.",
      overview: "For companies whose visuals no longer reflect who they've become. We keep what works and redesign what doesn't.",
      included: ["Visual audit: what works, what's dated", "Updated visual direction", "Logo refresh or full redesign", "Updated palette and modern typography", "Enhanced component library", "Transition guide from the old brand"],
      steps: [["Clarify", "Audit the current visuals."], ["Refine", "Choose the new visual direction."], ["Rebuild", "New identity system."], ["Systemize", "Guidelines and transition plan."]],
      deliverables: ALWAYS, timeline: "3–4 weeks", revisions: "2 rounds", best: "Evolved companies"
    },
    "logo": {
      name: "Logo", line: "One mark. Done right.",
      overview: "A single, well-made mark for companies that already know who they are and just need the logo.",
      included: ["Logo concept directions", "Refinement based on your feedback", "Lockups and variations", "Clear usage rules"],
      steps: [["Brief", "A short call about the company."], ["Explore", "Several directions."], ["Refine", "One direction, polished."], ["Deliver", "Final files and usage rules."]],
      deliverables: [["Brand Guidelines (logo usage)", "PDF"], ["Logo and lockups", "SVG, PNG"], ["Logo variations", "SVG, PNG"], ["Source file", "Figma"]], timeline: "Scoped per project", revisions: "2 rounds", best: "Clear brands"
    }
  };
  const TOC_BASE = [["included", "What's included"], ["process", "How it works"], ["deliverables", "Deliverables"]];
  let TOC = TOC_BASE;
  // Brand language + typography sections (Branding and Rebranding only)
  const BRAND_EXTRA = {
    branding: {
      lang: ["How your company sounds, from the first word. We write down your voice, the lines you own and the words you leave out.", ["Voice and tone", "Messaging pillars", "Tagline and key lines", "Words to use and words to avoid"]],
      type: ["The typefaces that carry your voice. We choose, pair and set them so every page reads like you wrote it.", ["Typeface pairing", "Scale and hierarchy", "Weights, spacing and tracking", "Usage examples across touchpoints"]]
    },
    rebranding: {
      lang: ["Keep what people already trust, say it better. We tune your voice so the new look and the new words finally match.", ["Voice and tone refresh", "Messaging pillars, updated", "Tagline and key lines", "What changes, what stays"]],
      type: ["A clearer, more current type system. We keep what feels familiar and fix what no longer holds up.", ["Type review and pairing", "Scale and hierarchy", "Weights, spacing and tracking", "Before and after usage"]]
    }
  };

  const vHome = document.getElementById("view-home"), vWork = document.getElementById("view-work"), vSvc = document.getElementById("view-service"), vInq = document.getElementById("view-inquire"), vAbout = document.getElementById("view-about");

  // ---- Inquiry form (5 fields). No backend: it opens the visitor's email app, pre-filled. ----
  const form = document.getElementById("inqForm"), done = document.getElementById("inqDone");
  let mailHref = "";
  function fieldErr(el, on) {
    const wrap = el.closest(".f"); if (!wrap) return;
    const err = wrap.querySelector(".ferr"); if (err) err.hidden = !on;
    if (el.setAttribute) el.setAttribute("aria-invalid", on ? "true" : "false");
  }
  ["name", "contact"].forEach(n => form.elements[n].addEventListener("input", e => fieldErr(e.target, false)));
  // soft clear (x) on each text field: one tap empties it
  form.querySelectorAll('input[type="text"], textarea').forEach(el => {
    const w = document.createElement("span"); w.className = "clr" + (el.tagName === "TEXTAREA" ? " ta" : "");
    el.parentNode.insertBefore(w, el); w.appendChild(el);
    const b = document.createElement("button"); b.type = "button"; b.className = "clr-x"; b.setAttribute("aria-label", "Clear " + (el.name || "field"));
    b.innerHTML = '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7l10 10M17 7 7 17"/></svg>';
    w.appendChild(b);
    const sync = () => w.classList.toggle("has", !!el.value);
    el.addEventListener("input", sync);
    b.addEventListener("mousedown", e => e.preventDefault());
    b.addEventListener("click", () => { el.value = ""; sync(); fieldErr(el, false); el.focus(); });
    sync();
  });
  form.addEventListener("change", e => {
    if (e.target.name === "need") {
      const ls = document.getElementById("needSet"); ls.querySelector(".ferr").hidden = true;
      // "Not sure" stands alone; any specific pick clears it
      if (e.target.checked) ls.querySelectorAll('input[name="need"]').forEach(i => { if (i !== e.target && ((e.target.value === "Not sure") !== (i.value === "Not sure"))) i.checked = false; });
    }
  });
  let enquiryText = "";
  document.getElementById("inqCopy").addEventListener("click", ev => {
    const b = ev.currentTarget, ok = () => { b.textContent = "Copied"; setTimeout(() => { b.textContent = "Copy my enquiry"; }, 1800); };
    const fallback = () => { const ta = document.createElement("textarea"); ta.value = enquiryText; ta.style.cssText = "position:fixed;opacity:0"; document.body.appendChild(ta); ta.select(); try { document.execCommand("copy"); ok(); } catch (er) { b.textContent = "Select and copy from your email"; } ta.remove(); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(enquiryText).then(ok, fallback); else fallback();
  });
  /* dark mode lives on the Work gallery and its project pages only */
  let onWork = /^#\/work/.test(location.hash);
  function syncTheme(w) {
    onWork = !!w;
    const root = document.documentElement, pref = window.__twinPref === "dark" ? "dark" : "light";
    if (onWork) root.setAttribute("data-darkable", ""); else root.removeAttribute("data-darkable");
    if (onWork && pref === "dark") root.setAttribute("data-theme", "dark"); else root.removeAttribute("data-theme");
    document.querySelectorAll("[data-theme-set]").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.themeSet === pref)));
  }
  document.addEventListener("keydown", e => {
    if (e.key !== "Escape" || document.querySelector("#editor:not([hidden])")) return;
    const h = location.hash;
    if (/^#\/work\/.+/.test(h)) location.hash = "#/work"; else if (/^#\/service\//.test(h)) location.hash = "#services"; else if (h === "#/inquire") location.hash = "#top";
  });
  function applyTheme(m) {
    window.__twinPref = m === "dark" ? "dark" : "light";
    try { localStorage.setItem("twin-theme", window.__twinPref); } catch (er) {}
    syncTheme(onWork);
  }
  document.querySelectorAll("[data-theme-set]").forEach(b => b.addEventListener("click", () => applyTheme(b.dataset.themeSet)));
  syncTheme(onWork);
  form.addEventListener("submit", e => {
    e.preventDefault();
    const v = n => (form.elements[n].value || "").trim();
    const need = Array.from(form.querySelectorAll('input[name="need"]:checked')).map(i => i.value).join(", ");
    const bad = [];
    if (!v("name")) { fieldErr(form.elements.name, true); bad.push(form.elements.name); }
    if (!v("contact")) { fieldErr(form.elements.contact, true); bad.push(form.elements.contact); }
    if (!need) { document.getElementById("needSet").querySelector(".ferr").hidden = false; bad.push(form.querySelector('input[name="need"]')); }
    if (bad.length) { bad[0].focus(); return; }
    const company = v("company"), project = v("project");
    const subject = "Inquiry: " + need + " — " + (company || v("name"));
    const body = ["Name: " + v("name"), "Email: " + v("contact"), "Company: " + (company || "—"), "Need: " + need, "", "About the project:", project || "—"].join("\r\n");
    mailHref = "mailto:" + EMAIL + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    const a = document.createElement("a"); a.href = mailHref; document.body.appendChild(a); a.click(); a.remove();
    form.hidden = true; done.hidden = false;
    document.getElementById("inqAgain").href = mailHref;
    enquiryText = "To: " + EMAIL + "\r\nSubject: " + subject + "\r\n\r\n" + body;
    toTop();
  });
  document.getElementById("inqEdit").addEventListener("click", () => { done.hidden = true; form.hidden = false; toTop(); });
  const mainEl = document.querySelector(".main");
  const galScroll = document.getElementById("galScroll");
  function toTop() { mainEl.scrollTo(0, 0); window.scrollTo(0, 0); galScroll.scrollTo(0, 0); }

  // ---- TOC behavior ----
  let tocIO = null;
  function setToc(id) {
    document.querySelectorAll(".toc a").forEach(a => { const on = a.dataset.id === id; a.setAttribute("aria-current", on); if (on && a.closest(".svc-jump") && innerWidth <= 900) { const bar = a.parentElement; bar.scrollTo({ left: a.offsetLeft - bar.clientWidth / 2 + a.clientWidth / 2, behavior: "smooth" }); } });
  }
  function startToc() {
    if (tocIO) tocIO.disconnect();
    if (!("IntersectionObserver" in window)) return;
    tocIO = new IntersectionObserver(es => {
      const v = es.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (v[0]) setToc(v[0].target.id);
    }, { rootMargin: "-15% 0px -70% 0px" });
    vSvc.querySelectorAll("section[id]").forEach(el => tocIO.observe(el));
  }
  function atBottom() {
    const sc = window.innerWidth > 900 ? mainEl : document.documentElement;
    return sc.scrollTop + sc.clientHeight >= sc.scrollHeight - 4;
  }
  function onScrollEnd() { if (!vSvc.hidden && atBottom()) setToc(TOC[TOC.length - 1][0]); }
  mainEl.addEventListener("scroll", onScrollEnd, { passive: true });
  addEventListener("scroll", onScrollEnd, { passive: true });

  function renderService(slug) {
    const x = SERVICES[slug];
    const mail = "mailto:" + EMAIL + "?subject=" + encodeURIComponent(x.name + " inquiry");
    const MI = {
      "Timeline": '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
      "Revisions": '<path d="M20 11a8 8 0 0 0-14-4M4 5v3h3M4 13a8 8 0 0 0 14 4M20 19v-3h-3"/>'
    };
    const rows = [["Best for", x.best], ["Timeline", x.timeline], ["Revisions", x.revisions]]
      .map((r, i) => '<div class="r' + (i === 0 ? ' first' : '') + '"><dt>' + (MI[r[0]] ? '<span class="mi" aria-hidden="true"><svg class="ic" viewBox="0 0 24 24">' + MI[r[0]] + '</svg></span>' : '') + '<span>' + r[0] + '</span></dt><dd>' + r[1] + '</dd></div>').join("");
    const inc = x.included.map(t => '<li>' + t + '</li>').join("");
    const steps = x.steps.map((st, i) => '<div class="acc"><h3><button class="acc-h" id="accb' + i + '" aria-expanded="false" aria-controls="accp' + i + '"><span class="acc-t">' + st[0] + '</span><span class="acc-i" aria-hidden="true"><svg class="ic" viewBox="0 0 24 24"><path d="M5 12h14"/><path class="v" d="M12 5v14"/></svg></span></button></h3><div class="acc-p" id="accp' + i + '" role="region" aria-labelledby="accb' + i + '" inert><div><p>' + st[1] + '</p></div></div></div>').join("");
    const dl = x.deliverables.map(d => '<li><span>' + d[0] + '<em>' + d[1] + '</em></span></li>').join("");
    const order = Object.keys(SERVICES), at = order.indexOf(slug);
    const prev = order[at - 1], next = order[at + 1];
    const tabsHtml = order.map(k => '<a class="svc-tab" href="#/service/' + k + '"' + (k === slug ? ' aria-current="page"' : '') + '>' + SERVICES[k].name + '</a>').join("");
    const pn = '<nav class="svc-pn svc-tabs svc-pn-m" aria-label="More services"><span class="svc-pill">' + tabsHtml + '</span></nav>';
    const pnSide = '<nav class="svc-pn-d" aria-label="More services"><span class="mono t3">More services</span>' + tabsHtml + '</nav>';
    const BX = BRAND_EXTRA[slug];
    TOC = BX ? [TOC_BASE[0], ["language", "Brand language"], ["typography", "Typography"], TOC_BASE[1], TOC_BASE[2]] : TOC_BASE;
    const sec = (id, h, c) => '<section id="' + id + '"><h2>' + h + '</h2><p class="lead">' + c[0] + '</p><ol class="inc">' + c[1].map(t => '<li>' + t + '</li>').join("") + '</ol></section>';
    const brandSecs = BX ? sec("language", "Brand language", BX.lang) + sec("typography", "Typography", BX.type) : "";
    const toc = TOC.map(t => '<li><a href="#' + t[0] + '" data-id="' + t[0] + '">' + t[1] + '</a></li>').join("");
    vSvc.innerHTML =
      '<div class="svc-page">' +
                '<div class="svc-cols">' +
          '<article class="svc-main">' +
            '<header><h1 class="svc-h1">' + x.name + '</h1><p class="lead svc-intro">' + x.overview + '</p></header>' +
            '<section id="included"><h2>What\'s included</h2><ol class="inc">' + inc + '</ol></section>' + brandSecs +
            '<section id="process"><h2>How it works</h2><div class="accs">' + steps + '</div></section>' +
            '<section id="deliverables"><h2>Deliverables</h2><p class="dl-note">The handoff documents you receive, and the format each one comes in.</p><ul class="dl">' + dl + '</ul></section>' +
            pn +
          '</article>' +
          '<aside class="svc-side">' +
            '<div class="meta-card"><dl>' + rows + '</dl><a class="btn" href="#/inquire?need=' + encodeURIComponent(NEED[slug]) + '">Start This Project</a></div>' +
            '<nav class="toc" aria-label="Table of contents"><span class="mono t3">On this page</span><ul>' + toc + '</ul></nav>' +
            pnSide +
          '</aside>' +
        '</div>' +
      '</div>';
    vSvc.querySelectorAll(".toc a").forEach(a => a.addEventListener("click", e => {
      e.preventDefault();
      const el = document.getElementById(a.dataset.id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      setToc(a.dataset.id);
    }));
    setToc(TOC[0][0]);
    startToc();
    vSvc.querySelectorAll(".acc-h").forEach(btn => btn.addEventListener("click", () => {
      const item = btn.closest(".acc"), open = btn.getAttribute("aria-expanded") === "true";
      vSvc.querySelectorAll(".acc").forEach(o => {
        o.classList.remove("open");
        o.querySelector(".acc-h").setAttribute("aria-expanded", "false");
        o.querySelector(".acc-p").inert = true;
      });
      if (!open) {
        item.classList.add("open");
        btn.setAttribute("aria-expanded", "true");
        item.querySelector(".acc-p").inert = false;
        setTimeout(() => item.scrollIntoView({ block: "nearest", behavior: "smooth" }), 340);
      }
    }));
  }

  // ---- Routing: #/work = gallery, #/service/<slug> = detail, else home ----
  let wasOther = false, wasProj = false;
  function route() {
    const h = location.hash;
    const m = h.match(/^#\/service\/([\w-]+)$/);
    const slug = m && SERVICES[m[1]] ? m[1] : null;
    const isWork = h === "#/work";
    const isAbout = h === "#/story" || h === "#/profile" || h === "#/about";
    const pm = h.match(/^#\/work\/([\w-]+)$/), proj = pm ? clients.find(x => x.id === pm[1]) : null, isProj = !!proj;
    const iq = h.match(/^#\/inquire(?:\?need=([^&]+))?$/), isInq = !!iq;
    mainEl.classList.toggle("is-work", isWork);
    mainEl.classList.toggle("is-proj", isProj || isAbout);
    if (typeof syncTheme === "function") syncTheme(isWork || isProj || isAbout);
    vHome.hidden = isWork || !!slug || isInq || isProj || isAbout;
    vAbout.hidden = !isAbout;
    mainEl.classList.toggle("is-home", !(isWork || !!slug || isInq || isProj || isAbout));
    vProj.hidden = !isProj;
    vWork.hidden = !isWork;
    vSvc.hidden = !slug;
    vInq.hidden = !isInq;
    if (isAbout) { toTop(); setActive("about"); document.getElementById("aboutTitle").focus({ preventScroll: true }); }
    else if (isInq) {
      if (iq[1]) { const r = form.querySelector('input[name="need"][value="' + decodeURIComponent(iq[1]).replace(/"/g, "") + '"]'); if (r) { form.querySelectorAll('input[name="need"]').forEach(i => { i.checked = false; }); r.checked = true; } }
      toTop(); setActive("start"); document.getElementById("inqTitle").focus({ preventScroll: true });
    }
    else if (isProj) {
      renderProject(proj); pjScroll.scrollTop = 0; window.scrollTo(0, 0); setActive("work");
      document.getElementById("pjName").focus({ preventScroll: true });
    }
    else if (isWork) {
      setActive("work");
      requestAnimationFrame(() => { moveInd(); if (wasProj) galScroll.scrollTop = savedScroll; else toTop(); });
    }
    else if (slug) { renderService(slug); toTop(); setActive("services"); }
    else if (wasOther) {
      const el = h.length > 1 ? document.getElementById(h.slice(1)) : null;
      requestAnimationFrame(() => { if (innerWidth <= 900 && h === "#services" && focusServices(false)) return; el ? el.scrollIntoView() : toTop(); });
    }
    wasOther = isWork || !!slug || isInq || isProj;
    wasProj = isProj;
    CURRENT_PROJ = proj || null;
    document.title = slug ? SERVICES[slug].name + " | TWIN" : isInq ? "Let\u2019s talk | TWIN" : isProj ? proj.name + " | TWIN" : isWork ? "Work | TWIN" : "TWIN \u2014 Look like yourself.";
    syncOwner();
  }
  // ======== OWNER TOOLS ========
  // Sign-in is handled by your claude.ai account. These tools only appear when the platform says the viewer
  // owns / can edit this page, and the platform rejects publishing from anyone else.
  const EDIT_MAX_MB = 15;
  let ADMIN = null, TEMPLATE = "", ED = null, CURRENT_PROJ = null;
  const LT = String.fromCharCode(60), GT = String.fromCharCode(62);
  const b64 = str => { const bytes = new TextEncoder().encode(str); let bin = ""; for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000)); return btoa(bin); };
  const unb64 = b => new TextDecoder().decode(Uint8Array.from(atob(b), c => c.charCodeAt(0)));
  // The page rebuilds its own source from a stored template + the data, never from the live DOM.
  function buildHtml(data) {
    const dataTag = LT + 'script id="twin-data" type="application/json"' + GT + JSON.stringify(data).replace(/</g, "\\u003c") + LT + "/script" + GT;
    const srcTag = LT + 'script id="twin-src" type="text/plain"' + GT + b64(TEMPLATE) + LT + "/script" + GT;
    return TEMPLATE.replace(LT + "!--TWIN_DATA--" + GT, () => dataTag).replace(LT + "!--TWIN_SRC--" + GT, () => srcTag);
  }
  const $ = id => document.getElementById(id);
  function syncOwner() {
    const onWork = !$("view-work").hidden, onProj = !$("view-project").hidden;
    $("ownerBar").hidden = !(ADMIN && (onWork || onProj));
    $("pjEdit").hidden = !(ADMIN && onProj && CURRENT_PROJ && REAL.indexOf(CURRENT_PROJ) >= 0);
  }
  function edMsg(t, ok) { const m = $("edMsg"); m.textContent = t; m.hidden = !t; }
  function edBusy(b) { $("edSave").disabled = b; $("edSave").textContent = b ? "Saving…" : "Save"; }
  function edMeter() {
    const draft = REAL.slice(); if (ED.index >= 0) draft[ED.index] = ED.p; else draft.unshift(ED.p);
    const mb = (JSON.stringify({ projects: draft }).length + TEMPLATE.length * 1.34) / 1048576;
    $("edMeter").textContent = "Page size " + mb.toFixed(1) + " of " + EDIT_MAX_MB + " MB";
  }
  const ICON = { up: '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M6 11l6-6 6 6"/></svg>', down: '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M6 13l6 6 6-6"/></svg>', upl: '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 16V4M6 10l6-6 6 6M5 20h14"/></svg>', rm: '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>' };
  const edList = k => k === "cover" ? (ED.p.cover ? [ED.p.cover] : []) : (ED.p.sections[k] || (ED.p.sections[k] = []));
  function renderEdImgs() {
    const defs = [["cover", "Cover image (grid and overview)"]].concat(secsOf(ED.p));
    $("edSecs").innerHTML = defs.map(d => {
      const k = d[0];
      const rows = edList(k).map((im, i) =>
        '<div class="ed-img" data-i="' + i + '"><img src="' + safeSrc(im.src) + '" alt="">' +
        '<input type="text" class="ed-cap" placeholder="Caption" value="' + esc(im.caption || "") + '" aria-label="Caption for ' + esc(d[1]) + ' image ' + (i + 1) + '">' +
        '<div class="ed-tools">' + (k === "cover" ? "" : '<button type="button" data-a="up" aria-label="Move up">' + ICON.up + '</button><button type="button" data-a="down" aria-label="Move down">' + ICON.down + '</button>') + '<button type="button" data-a="rm" aria-label="Remove image">' + ICON.rm + '</button></div></div>').join("");
      const full = k === "cover" && ED.p.cover;
      return '<div class="f ed-sec" data-sec="' + k + '"><label>' + d[1] + '</label>' +
        (full ? "" : '<label class="ed-drop"><input class="sr ed-file" type="file" accept="image/jpeg,image/png,image/webp"' + (k === "cover" ? "" : " multiple") + '><span class="ed-up">' + ICON.upl + 'Upload</span><span class="ed-sub">JPG, JPEG, PNG and WEBP. Auto-resized.</span></label>') + '<div class="ed-imgs">' + rows + '</div></div>';
    }).join("");
    edMeter();
  }
  function openEditor(index) {
    const base = index >= 0 ? JSON.parse(JSON.stringify(REAL[index])) : { id: "", name: "", type: "Brand", date: "", reason: "", r: 1, cover: null, sections: {} };
    base.sections = base.sections || {};
    ED = { index, p: base, del: false };
    $("edTitle").textContent = index >= 0 ? "Edit project" : "New project";
    $("edName").value = base.name || ""; $("edDate").value = base.date || ""; $("edReason").value = base.reason || "";
    $("edType").querySelectorAll("input").forEach(r => { r.checked = r.value === base.type; });
    $("edType").onchange = e => { ED.p.type = e.target.value; renderEdImgs(); };
    $("edDelete").hidden = index < 0; $("edDelete").textContent = "Delete project";
    edMsg(""); edBusy(false); renderEdImgs();
    $("editor").hidden = false; $("edName").focus();
  }
  function closeEditor() { $("editor").hidden = true; ED = null; }
  function fileToImage(file) {
    return new Promise((res, rej) => {
      const fr = new FileReader();
      fr.onerror = rej;
      fr.onload = () => {
        const im = new Image();
        im.onerror = rej;
        im.onload = () => {
          const k = Math.min(1, 2400 / Math.max(im.naturalWidth, im.naturalHeight));
          const w = Math.max(1, Math.round(im.naturalWidth * k)), h = Math.max(1, Math.round(im.naturalHeight * k));
          const cv = document.createElement("canvas"); cv.width = w; cv.height = h;
          const cx = cv.getContext("2d"); cx.imageSmoothingQuality = "high"; cx.drawImage(im, 0, 0, w, h);
          /* keep original bytes when already within size: no re-compression, no shrink, transparency kept */
          let out = (k === 1 && file.size <= 1.5 * 1048576 && /^image\/(png|jpeg|webp|gif|avif)$/.test(file.type)) ? fr.result : cv.toDataURL("image/webp", 0.92);
          if (out.indexOf("data:image/") !== 0) out = cv.toDataURL("image/png");
          res({ src: out, caption: "", w, h });
        };
        im.src = fr.result;
      };
      fr.readAsDataURL(file);
    });
  }
  function msgFor(e) {
    const c = e && e.code;
    if (c === "not_writer" || c === "not_granted" || c === "consent_required") return "This account can't edit this page.";
    if (c === "too_large") return "The page is too large. Remove some images or use smaller ones.";
    if (c === "rate_limited") return "Too many saves in a row. Wait a moment and try again.";
    if (c === "conflict") return "A newer version was published. The page will reload.";
    return "Couldn't save. Please try again.";
  }
  async function publishList(list) {
    const html = buildHtml({ projects: list });
    if (html.length > EDIT_MAX_MB * 1048576) { edMsg("Too many or too large images. Remove some and try again."); return; }
    edBusy(true); edMsg("");
    try { await ADMIN.artifact.publish(html); edMsg("Saved. Refreshing…"); }
    catch (e) { edBusy(false); edMsg(msgFor(e)); }
  }
  async function saveEditor() {
    const name = $("edName").value.trim();
    if (!name) { edMsg("Add the business name."); $("edName").focus(); return; }
    const p = ED.p;
    p.name = name; p.date = $("edDate").value.trim(); p.reason = $("edReason").value.trim();
    p.type = ($("edType").querySelector("input:checked") || {}).value || "Brand";
    if (!p.id) p.id = "w" + Date.now().toString(36);
    const f = coverOf(p);
    p.r = (f && f.w && f.h) ? Math.max(0.6, Math.min(1.6, Math.round(f.w / f.h * 100) / 100)) : (p.r || 1);
    Object.keys(p.sections).forEach(k => { if (!p.sections[k].length) delete p.sections[k]; });
    const list = REAL.slice();
    if (ED.index >= 0) list[ED.index] = p; else list.unshift(p);
    await publishList(list);
  }
  function initAdmin() {
    $("ownNew").addEventListener("click", () => openEditor(-1));
    $("pjEdit").addEventListener("click", () => { const i = REAL.indexOf(CURRENT_PROJ); if (i >= 0) openEditor(i); });
    $("edClose").addEventListener("click", closeEditor);
    $("edSave").addEventListener("click", saveEditor);
    $("edDelete").addEventListener("click", async () => {
      if (!ED || ED.index < 0) return;
      if (!ED.del) { ED.del = true; $("edDelete").textContent = "Tap again to delete"; return; }
      const list = REAL.slice(); list.splice(ED.index, 1);
      await publishList(list);
    });
    async function addFiles(k, files) {
      files = [...files].filter(f => /^image\/(jpeg|png|webp)$/.test(f.type));
      if (k === "cover") files = files.slice(0, 1);
      for (const f of files) {
        try {
          const im = await fileToImage(f);
          if (k === "cover") ED.p.cover = im; else edList(k).push(im);
          renderEdImgs();
        } catch (err) { edMsg("Couldn't read " + f.name + ". Try a JPG, PNG or WebP."); }
      }
    }
    $("edSecs").addEventListener("change", async e => {
      const inp = e.target; if (!inp.classList.contains("ed-file")) return;
      const k = inp.closest(".ed-sec").dataset.sec, files = [...inp.files]; inp.value = "";
      await addFiles(k, files);
    });
    ["dragenter", "dragover"].forEach(t => $("edSecs").addEventListener(t, e => {
      const z = e.target.closest(".ed-drop"); if (!z) return; e.preventDefault(); z.classList.add("over");
    }));
    ["dragleave", "drop"].forEach(t => $("edSecs").addEventListener(t, e => {
      const z = e.target.closest(".ed-drop"); if (!z) return; e.preventDefault(); z.classList.remove("over");
      if (t === "drop") addFiles(z.closest(".ed-sec").dataset.sec, e.dataTransfer.files);
    }));
    $("edSecs").addEventListener("input", e => {
      if (!e.target.classList.contains("ed-cap")) return;
      const k = e.target.closest(".ed-sec").dataset.sec, i = +e.target.closest(".ed-img").dataset.i;
      edList(k)[i].caption = e.target.value;
    });
    $("edSecs").addEventListener("click", e => {
      const b = e.target.closest("button[data-a]"); if (!b) return;
      const k = b.closest(".ed-sec").dataset.sec, i = +b.closest(".ed-img").dataset.i, a = b.dataset.a;
      if (k === "cover") { ED.p.cover = null; renderEdImgs(); return; }
      const im = edList(k);
      if (a === "rm") im.splice(i, 1);
      if (a === "up" && i > 0) im.splice(i - 1, 0, im.splice(i, 1)[0]);
      if (a === "down" && i < im.length - 1) im.splice(i + 1, 0, im.splice(i, 1)[0]);
      renderEdImgs();
    });
    addEventListener("keydown", e => { if (e.key === "Escape" && !$("editor").hidden) closeEditor(); });
  }
  (async () => {
    try {
      if (!window.claude || !window.claude.use || !$("twin-src")) return;
      const user = await window.claude.use("user"), artifact = await window.claude.use("artifact");
      if (!user || !artifact) return;
      const ok = (await user.isOwner()) || (await user.canEdit());
      if (!ok) return;
      TEMPLATE = unb64($("twin-src").textContent.trim());
      ADMIN = { artifact }; initAdmin(); syncOwner();
    } catch (e) { /* public visitors and any failure: no owner tools, site works as normal */ }
  })();

  addEventListener("hashchange", route);
  route();

  // Buttons turn orange when clicked
  document.addEventListener("click", e => {
    const b = e.target.closest(".btn");
    if (!b) return;
    b.classList.add("clicked");
    setTimeout(() => b.classList.remove("clicked"), 900);
  });

  /* sidebar collapse */
  (function(){
    const app = document.querySelector(".app"), tg = document.getElementById("sideToggle");
    if (!app || !tg) return;
    function set(on){
      app.classList.toggle("is-rail", on);
      tg.setAttribute("aria-expanded", on ? "false" : "true");
      const t = on ? "Expand sidebar" : "Collapse sidebar";
      tg.setAttribute("aria-label", t); tg.title = t;
    }
    let saved = null; try { saved = localStorage.getItem("twinRail"); } catch (e) {}
    set(saved === null ? innerWidth > 900 : saved === "1");
    tg.addEventListener("click", () => {
      const on = !app.classList.contains("is-rail");
      set(on);
      try { localStorage.setItem("twinRail", on ? "1" : "0"); } catch (e) {}
    });
  })();

  /* hero pointer glow */
  (function(){
    const h = document.querySelector(".hero-card"); if (!h) return;
    h.addEventListener("pointermove", e => {
      const r = h.getBoundingClientRect();
      h.style.setProperty("--mx", (e.clientX - r.left) + "px");
      h.style.setProperty("--my", (e.clientY - r.top) + "px");
    });
  })();
