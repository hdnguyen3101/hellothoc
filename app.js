(() => {
  "use strict";
  const content = window.THOC_CONTENT || {};
  const byId = (id) => document.getElementById(id);
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const smooth = () => (reduceMotion.matches ? "auto" : "smooth");
  const make = (tag, className, text) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text) element.textContent = text;
    return element;
  };
  const icon = (id, className) => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("aria-hidden", "true");
    if (className) svg.setAttribute("class", className);
    const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
    use.setAttribute("href", "#" + id);
    svg.append(use);
    return svg;
  };
  const fileName = (value) => (typeof value === "string" && /^[\w.-]+\.(jpe?g|png|webp)$/i.test(value.trim()) ? value.trim() : null);
  const photoUrl = (file, size) => "assets/photos/" + size + "/" + file;
  // True only the first time a hint is shown on this device.
  const firstTime = (key) => {
    try { if (localStorage.getItem(key)) return false; localStorage.setItem(key, "1"); } catch { /* private mode: show every time */ }
    return true;
  };

  // Party countdown, counted in Vietnam calendar days.
  const PARTY = { year: 2026, month: 10, day: 24 };
  const countdown = byId("countdown");
  if (countdown) {
    const parts = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Ho_Chi_Minh", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date());
    const part = (type) => Number(parts.find((item) => item.type === type).value);
    const days = Math.round((Date.UTC(PARTY.year, PARTY.month - 1, PARTY.day) - Date.UTC(part("year"), part("month") - 1, part("day"))) / 86400000);
    if (days > 1) countdown.textContent = "Còn " + days + " ngày nữa là tới tiệc của Thóc";
    else if (days === 1) countdown.textContent = "Mai là tiệc rồi, Thóc hồi hộp ghê";
    else if (days === 0) countdown.textContent = "Tối nay là tiệc rồi nè!";
    else countdown.textContent = "Cảm ơn cô chú đã tới chung vui cùng Thóc";
  }

  byId("add-calendar")?.addEventListener("click", () => {
    const ics = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//hellothoc//vi", "CALSCALE:GREGORIAN",
      "BEGIN:VEVENT", "UID:thoc-thoi-noi-20261024@hellothoc.io.vn", "DTSTAMP:20261001T000000Z",
      "DTSTART:20261024T110000Z", "DTEND:20261024T140000Z",
      "SUMMARY:Tiệc thôi nôi của Thóc",
      "LOCATION:Ẩm Thực Nhà Tôi\\, 62-64 Đường Vành Đai Trong\\, An Lạc\\, TP. Hồ Chí Minh",
      "DESCRIPTION:Bản đồ: https://maps.app.goo.gl/rwCZzLZ7KrzvmmYR6",
      "URL:https://www.hellothoc.io.vn/",
      "END:VEVENT", "END:VCALENDAR"
    ].join("\r\n");
    const link = make("a");
    link.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));
    link.download = "tiec-thoi-noi-thoc.ics";
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  });

  const milestones = (Array.isArray(content.milestones) ? content.milestones : []).filter((item) => item && item.key && item.title);
  const moments = (Array.isArray(content.moments) ? content.moments : []).filter((item) => item && item.key && item.title);
  const momentTitle = Object.fromEntries(moments.map((item) => [item.key, item.title]));
  const photos = (Array.isArray(content.photos) ? content.photos : [])
    .filter((photo) => photo && fileName(photo.file))
    .map((photo) => ({ ...photo, file: fileName(photo.file) }));
  const describe = (photo) => photo.caption || (momentTitle[photo.moment] ? "Thóc, " + momentTitle[photo.moment].toLowerCase() : "Ảnh của Thóc");

  // Lightbox, shared by the album and the journey.
  const dialog = byId("lightbox");
  const lightboxImage = byId("lightbox-image");
  const lightboxHint = byId("lightbox-hint");
  let viewer = { list: [], index: 0, returnFocus: null };
  const showPhoto = () => {
    const photo = viewer.list[viewer.index];
    lightboxImage.src = photoUrl(photo.file, "full");
    lightboxImage.alt = describe(photo);
    byId("lightbox-moment").textContent = momentTitle[photo.moment] && momentTitle[photo.moment] !== photo.caption ? momentTitle[photo.moment] : "";
    byId("lightbox-caption").textContent = photo.caption || "";
    byId("lightbox-count").textContent = (viewer.index + 1) + " / " + viewer.list.length;
    byId("lightbox-previous").hidden = byId("lightbox-next").hidden = viewer.list.length < 2;
    const next = viewer.list[(viewer.index + 1) % viewer.list.length];
    if (next) new Image().src = photoUrl(next.file, "full");
  };
  const openViewer = (list, index, returnFocus) => {
    if (!list.length) return;
    viewer = { list, index, returnFocus };
    showPhoto();
    dialog.showModal();
    byId("lightbox-close").focus();
    lightboxHint.classList.toggle("is-shown", list.length > 1 && firstTime("thoc-lightbox-hint"));
  };
  const stepPhoto = (direction) => {
    if (!viewer.list.length) return;
    viewer.index = (viewer.index + direction + viewer.list.length) % viewer.list.length;
    lightboxHint.classList.remove("is-shown");
    showPhoto();
  };
  byId("lightbox-close").addEventListener("click", () => dialog.close());
  byId("lightbox-previous").addEventListener("click", () => stepPhoto(-1));
  byId("lightbox-next").addEventListener("click", () => stepPhoto(1));
  dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener("close", () => {
    lightboxHint.classList.remove("is-shown");
    viewer.returnFocus?.focus({ preventScroll: true });
  });
  dialog.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") { event.preventDefault(); stepPhoto(event.key === "ArrowLeft" ? -1 : 1); }
  });
  // Swipe sideways to change photo, swipe down to close. The photo follows the finger while pulling down.
  let touchStart = null;
  lightboxImage.addEventListener("touchstart", (event) => {
    if (event.touches.length === 1) touchStart = { x: event.touches[0].clientX, y: event.touches[0].clientY };
  }, { passive: true });
  lightboxImage.addEventListener("touchmove", (event) => {
    if (!touchStart || reduceMotion.matches) return;
    const dx = event.touches[0].clientX - touchStart.x;
    const dy = event.touches[0].clientY - touchStart.y;
    lightboxImage.style.transform = dy > 0 && dy > Math.abs(dx) ? "translateY(" + dy + "px) scale(" + Math.max(0.85, 1 - dy / 1200) + ")" : "";
  }, { passive: true });
  lightboxImage.addEventListener("touchend", (event) => {
    lightboxImage.style.transform = "";
    if (!touchStart || !event.changedTouches.length) return;
    const dx = event.changedTouches[0].clientX - touchStart.x;
    const dy = event.changedTouches[0].clientY - touchStart.y;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.3) stepPhoto(dx < 0 ? 1 : -1);
    else if (dy > 110 && dy > Math.abs(dx) * 1.3) dialog.close();
    touchStart = null;
  }, { passive: true });

  // Journey: one card per stop, a road with a stop button for each, and a carriage marking the current stop.
  const viewport = byId("journey-viewport");
  const journey = byId("journey-list");
  const roadStops = byId("road-stops");
  const hint = byId("journey-hint");
  const stopButtons = [];
  const badgeIcon = { "cho-thoc": "heart", "chao-doi": "sparkle", "tron-1-tuoi": "cake" };
  milestones.forEach((milestone, index) => {
    const stop = make("li", "stop");
    stop.id = "chang-" + milestone.key;
    const file = fileName(milestone.photo);
    // The stop's own photo opens first, then the rest of that month.
    const chapterPhotos = photos.filter((photo) => photo.chapter === milestone.key)
      .sort((a, b) => (a.file === file ? -1 : b.file === file ? 1 : a.file.localeCompare(b.file)));
    const figure = make("div", "stop-figure");
    const frame = make(file && chapterPhotos.length ? "button" : "div", "stop-frame");
    if (file) {
      const image = make("img");
      image.src = photoUrl(file, "thumb");
      image.alt = milestone.title;
      image.loading = index < 3 ? "eager" : "lazy";
      image.decoding = "async";
      image.width = 560;
      image.height = 700;
      if (milestone.position) image.style.objectPosition = milestone.position;
      frame.append(image);
    } else {
      frame.classList.add("is-empty");
      frame.append(icon("teddy", "stop-teddy"), make("span", "stop-waiting", "Ba mẹ đang chọn ảnh"));
    }
    const badge = make("span", "stop-badge");
    badge.setAttribute("aria-hidden", "true");
    if (milestone.month) badge.append(make("b", "", String(milestone.month)), make("small", "", "tháng"));
    else badge.append(icon(badgeIcon[milestone.key] || "sparkle"));
    figure.append(frame, badge);
    const copy = make("div", "stop-copy");
    copy.append(make("p", "stop-date", [milestone.label, milestone.date].filter(Boolean).join(", ")), make("h3", "", milestone.title));
    if (milestone.story) copy.append(make("p", "stop-story", milestone.story));
    if (frame.tagName === "BUTTON") {
      frame.type = "button";
      frame.setAttribute("aria-label", "Phóng to ảnh " + milestone.title);
      frame.addEventListener("click", () => openViewer(chapterPhotos, 0, frame));
      const more = make("button", "stop-more", "Xem " + chapterPhotos.length + " ảnh " + (milestone.month ? "tháng này" : "chặng này"));
      more.type = "button";
      more.addEventListener("click", () => openViewer(chapterPhotos, 0, more));
      copy.append(more);
    }
    stop.append(figure, copy);
    journey.append(stop);

    const dot = make("button", "road-stop");
    dot.type = "button";
    dot.setAttribute("aria-label", "Tới chặng " + milestone.title);
    dot.append(make("span", "road-dot"));
    dot.addEventListener("click", () => goTo(index));
    roadStops.append(dot);
    stopButtons.push(dot);
  });

  const cards = [...journey.children];
  let current = -1;
  const setCurrent = (index) => {
    if (index === current || !cards.length) return;
    current = index;
    stopButtons.forEach((button, i) => {
      button.classList.toggle("is-passed", i < index);
      if (i === index) button.setAttribute("aria-current", "step"); else button.removeAttribute("aria-current");
    });
    const dot = stopButtons[index];
    byId("road-carriage").style.left = (dot.offsetLeft + dot.offsetWidth / 2) + "px";
    byId("journey-previous").disabled = index === 0;
    byId("journey-next").disabled = index === cards.length - 1;
    byId("journey-status").textContent = "Chặng " + (index + 1) + " trên " + cards.length + ": " + milestones[index].title;
    if (index > 0) hint.classList.add("is-done");
  };
  const centered = () => window.matchMedia("(max-width: 720px)").matches;
  const goTo = (index) => {
    const card = cards[Math.max(0, Math.min(cards.length - 1, index))];
    if (!card) return;
    const left = centered() ? card.offsetLeft - (viewport.clientWidth - card.offsetWidth) / 2 : card.offsetLeft - parseFloat(getComputedStyle(viewport).paddingLeft);
    viewport.scrollTo({ left, behavior: smooth() });
  };
  const nearestCard = () => {
    const box = viewport.getBoundingClientRect();
    const anchor = centered() ? box.left + box.width / 2 : box.left + parseFloat(getComputedStyle(viewport).paddingLeft);
    let best = 0;
    let bestDistance = Infinity;
    cards.forEach((card, i) => {
      const rect = card.getBoundingClientRect();
      const distance = Math.abs((centered() ? rect.left + rect.width / 2 : rect.left) - anchor);
      if (distance < bestDistance) { bestDistance = distance; best = i; }
    });
    if (viewport.scrollLeft + viewport.clientWidth >= viewport.scrollWidth - 4) best = cards.length - 1;
    return best;
  };
  let ticking = false;
  viewport.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { setCurrent(nearestCard()); ticking = false; });
  }, { passive: true });
  viewport.addEventListener("pointerdown", () => hint.classList.add("is-done"), { passive: true });
  viewport.addEventListener("keydown", (event) => {
    if (event.target !== viewport || (event.key !== "ArrowLeft" && event.key !== "ArrowRight")) return;
    event.preventDefault();
    goTo(current + (event.key === "ArrowLeft" ? -1 : 1));
  });
  byId("journey-previous").addEventListener("click", () => goTo(current - 1));
  byId("journey-next").addEventListener("click", () => goTo(current + 1));
  window.addEventListener("resize", () => { const index = current; current = -1; setCurrent(index < 0 ? 0 : index); });
  setCurrent(0);
  // The first time the journey comes into view, nudge the cards so it is clear they move sideways.
  if ("IntersectionObserver" in window) {
    const nudge = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return;
      nudge.disconnect();
      if (reduceMotion.matches) return;
      setTimeout(() => {
        if (current !== 0 || hint.classList.contains("is-done")) return;
        journey.classList.add("is-nudging");
        journey.addEventListener("animationend", () => journey.classList.remove("is-nudging"), { once: true });
      }, 500);
    }, { threshold: 0.6 });
    nudge.observe(viewport);
  }

  // Album: moment covers to choose from, then a balanced masonry grid shown in batches.
  const BATCH = 24;
  const grid = byId("photo-grid");
  const moreButton = byId("album-more");
  const momentList = byId("moment-list");
  const inMoment = (key) => photos.filter((photo) => photo.moment === key);
  // "Tất cả" deals one photo from each moment in turn, captioned ones first, so the first screen is varied.
  const mixed = (() => {
    const queues = moments.map((moment) => inMoment(moment.key).sort((a, b) => Boolean(b.caption) - Boolean(a.caption)));
    const list = [];
    while (queues.some((queue) => queue.length)) queues.forEach((queue) => { if (queue.length) list.push(queue.shift()); });
    return list;
  })();
  const album = { moment: "all", shown: BATCH };
  const columnCount = () => (window.innerWidth >= 1080 ? 4 : window.innerWidth >= 720 ? 3 : 2);
  let renderedColumns = columnCount();
  const albumList = () => (album.moment === "all" ? mixed : inMoment(album.moment));
  const renderAlbum = (focusFrom) => {
    const list = albumList();
    const visible = list.slice(0, album.shown);
    renderedColumns = columnCount();
    const columns = Array.from({ length: renderedColumns }, () => ({ element: make("div", "photo-column"), height: 0 }));
    let focusTarget = null;
    visible.forEach((photo, index) => {
      const figure = make("figure", "photo-item");
      const button = make("button", "photo-button");
      button.type = "button";
      button.setAttribute("aria-label", "Phóng to ảnh " + (index + 1) + ": " + describe(photo));
      const image = make("img");
      image.src = photoUrl(photo.file, "thumb");
      image.alt = describe(photo);
      image.loading = "lazy";
      image.decoding = "async";
      image.width = photo.width || 560;
      image.height = photo.height || 747;
      button.append(image);
      button.addEventListener("click", () => openViewer(list, index, button));
      figure.append(button);
      if (photo.caption) {
        figure.classList.add("has-caption");
        figure.append(make("figcaption", "photo-caption", photo.caption));
      }
      const column = columns.reduce((shortest, item) => (item.height < shortest.height ? item : shortest));
      column.element.append(figure);
      column.height += (photo.height || 747) / (photo.width || 560) + (photo.caption ? 0.24 : 0.06);
      if (index === focusFrom) focusTarget = button;
    });
    grid.replaceChildren(...columns.map((column) => column.element));
    const moment = moments.find((item) => item.key === album.moment);
    byId("moment-title").textContent = moment ? moment.title : "Đủ thứ khoảnh khắc";
    byId("moment-note").textContent = moment ? moment.note + " (" + list.length + " ảnh)" : "Mỗi khoảnh khắc một chút, đủ " + photos.length + " tấm ảnh của Thóc.";
    const remaining = list.length - visible.length;
    moreButton.hidden = remaining <= 0;
    moreButton.textContent = "Xem thêm " + Math.min(BATCH, remaining) + " ảnh nữa nha";
    focusTarget?.focus();
  };
  const addMoment = (key, title, cover, count) => {
    const item = make("button", "moment");
    item.type = "button";
    item.setAttribute("aria-pressed", String(key === album.moment));
    item.setAttribute("aria-label", title + ", " + count + " ảnh");
    const ring = make("span", "moment-cover");
    if (cover) {
      const image = make("img");
      image.src = photoUrl(cover.file, "thumb");
      image.alt = "";
      image.loading = "lazy";
      ring.append(image);
    } else ring.append(icon("camera", "moment-icon"));
    item.append(ring, make("span", "moment-name", title));
    item.addEventListener("click", () => {
      album.moment = key;
      album.shown = BATCH;
      momentList.querySelectorAll(".moment").forEach((other) => other.setAttribute("aria-pressed", String(other === item)));
      momentList.scrollTo({ left: item.offsetLeft - momentList.offsetLeft - 24, behavior: smooth() });
      renderAlbum();
    });
    momentList.append(item);
  };
  addMoment("all", "Tất cả", null, photos.length);
  moments.forEach((moment) => {
    const list = inMoment(moment.key);
    if (list.length) addMoment(moment.key, moment.title, list.find((photo) => photo.caption) || list[0], list.length);
  });
  moreButton.addEventListener("click", () => {
    const from = album.shown;
    album.shown += BATCH;
    renderAlbum(from);
  });
  window.addEventListener("resize", () => { if (columnCount() !== renderedColumns) renderAlbum(); });
  renderAlbum();

  // Bottom tab bar on phones: highlight the section that fills most of the screen.
  const tabs = [...document.querySelectorAll(".tabbar a")];
  if ("IntersectionObserver" in window && tabs.length) {
    const sections = tabs.map((tab) => byId(tab.dataset.section)).filter(Boolean);
    const ratios = new Map();
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => ratios.set(entry.target.id, entry.isIntersecting ? entry.intersectionRect.height : 0));
      let active = null;
      let best = window.innerHeight * 0.35;
      sections.forEach((section) => { const value = ratios.get(section.id) || 0; if (value > best) { best = value; active = section.id; } });
      tabs.forEach((tab) => { if (tab.dataset.section === active) tab.setAttribute("aria-current", "true"); else tab.removeAttribute("aria-current"); });
    }, { threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1] });
    sections.forEach((section) => spy.observe(section));
  }
})();
