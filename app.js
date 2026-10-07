(() => {
  "use strict";
  const content = window.THOC_CONTENT || {};
  const byId = (id) => document.getElementById(id);
  const safeUrl = (value) => {
    if (typeof value !== "string" || !value.trim()) return null;
    try { const url = new URL(value, document.baseURI); return ["http:", "https:", "file:"].includes(url.protocol) ? url.href : null; }
    catch { return null; }
  };
  const photos = (Array.isArray(content.photos) ? content.photos : []).filter((photo) => photo && safeUrl(photo.src));
  const dialog = byId("lightbox");
  let activePhoto = 0;
  let lastPhotoButton = null;
  const updateLightbox = () => {
    const photo = photos[activePhoto];
    byId("lightbox-image").src = safeUrl(photo.src);
    byId("lightbox-image").alt = photo.alt || photo.caption || "Ảnh của Thóc";
    byId("lightbox-caption").textContent = photo.caption || "";
    byId("lightbox-count").textContent = (activePhoto + 1) + " / " + photos.length;
    byId("lightbox-previous").hidden = byId("lightbox-next").hidden = photos.length < 2;
  };
  const changePhoto = (direction) => {
    if (!photos.length) return;
    activePhoto = (activePhoto + direction + photos.length) % photos.length;
    updateLightbox();
  };
  photos.forEach((photo, index) => {
    const figure = document.createElement("figure");
    figure.className = "photo-item reveal";
    const button = document.createElement("button");
    button.type = "button";
    button.className = "photo-button";
    button.setAttribute("aria-label", "Xem ảnh " + (index + 1) + (photo.caption ? ": " + photo.caption : " của Thóc"));
    const image = document.createElement("img");
    image.src = safeUrl(photo.thumbnail) || safeUrl(photo.src);
    image.alt = photo.alt || photo.caption || "Ảnh của Thóc";
    image.loading = "lazy";
    image.decoding = "async";
    image.width = 800;
    image.height = 1000;
    if (photo.position) image.style.objectPosition = photo.position;
    button.append(image);
    button.addEventListener("click", () => {
      activePhoto = index; lastPhotoButton = button; updateLightbox(); dialog.showModal(); byId("lightbox-close").focus();
    });
    const caption = document.createElement("figcaption");
    caption.className = "photo-caption";
    const number = document.createElement("span");
    number.className = "photo-index";
    number.setAttribute("aria-hidden", "true");
    number.textContent = String(index + 1).padStart(2, "0");
    caption.append(number);
    if (photo.caption) caption.append(document.createTextNode(photo.caption));
    figure.append(button, caption);
    byId("photo-grid").append(figure);
  });
  const milestones = (Array.isArray(content.milestones) ? content.milestones : []).filter((item) => item && item.title && safeUrl(item.src));
  milestones.forEach((milestone) => {
    const article = document.createElement("article");
    article.className = "milestone reveal";
    const image = document.createElement("img");
    image.className = "milestone-image";
    image.src = safeUrl(milestone.src);
    image.alt = milestone.alt || milestone.title;
    image.loading = "lazy";
    image.decoding = "async";
    image.width = 960;
    image.height = 800;
    if (milestone.position) image.style.objectPosition = milestone.position;
    const copy = document.createElement("div");
    copy.className = "milestone-copy";
    if (milestone.label) {
      const label = document.createElement("span");
      label.className = "milestone-time";
      label.textContent = milestone.label;
      copy.append(label);
    }
    const title = document.createElement("h3");
    title.textContent = milestone.title;
    copy.append(title);
    if (milestone.story) {
      const story = document.createElement("p");
      story.className = "milestone-story";
      story.textContent = milestone.story;
      copy.append(story);
    }
    article.append(image, copy);
    byId("milestone-list").append(article);
  });
  if (!milestones.length) {
    const note = document.createElement("p");
    note.className = "section-intro";
    note.textContent = "Ba mẹ sẽ thêm ảnh và câu chuyện của Thóc tại đây.";
    byId("milestone-list").append(note);
  }
  byId("lightbox-close").addEventListener("click", () => dialog.close());
  byId("lightbox-previous").addEventListener("click", () => changePhoto(-1));
  byId("lightbox-next").addEventListener("click", () => changePhoto(1));
  dialog.addEventListener("close", () => lastPhotoButton?.focus({ preventScroll: true }));
  dialog.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault(); changePhoto(event.key === "ArrowLeft" ? -1 : 1);
    }
  });
  let touchStart = null;
  byId("lightbox-image").addEventListener("touchstart", (event) => {
    if (event.touches.length === 1) touchStart = { x: event.touches[0].clientX, y: event.touches[0].clientY };
  }, { passive: true });
  byId("lightbox-image").addEventListener("touchend", (event) => {
    if (!touchStart || !event.changedTouches.length) return;
    const dx = event.changedTouches[0].clientX - touchStart.x;
    const dy = event.changedTouches[0].clientY - touchStart.y;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.3) changePhoto(dx < 0 ? 1 : -1);
    touchStart = null;
  }, { passive: true });
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
    document.documentElement.classList.add("motion-ready");
  }
})();
