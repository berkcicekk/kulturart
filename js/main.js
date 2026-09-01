const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
const siteMenu = document.querySelector(".site-menu");

if (siteMenu) {
  const menuSummary = siteMenu.querySelector("summary");
  const menuLinks = siteMenu.querySelectorAll(".site-menu__overlay a");

  const syncMenuState = () => {
    document.body.classList.toggle("menu-is-open", siteMenu.open);
    menuSummary.setAttribute("aria-expanded", String(siteMenu.open));
    menuSummary.setAttribute(
      "aria-label",
      siteMenu.open ? "Close navigation" : "Open navigation"
    );

    if (siteMenu.open) {
      window.requestAnimationFrame(() => menuLinks[0]?.focus());
    }
  };

  siteMenu.addEventListener("toggle", syncMenuState);
  menuLinks.forEach((link) => {
    link.addEventListener("click", () => {
      siteMenu.open = false;
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && siteMenu.open) {
      siteMenu.open = false;
      menuSummary.focus();
    }

    if (event.key === "Tab" && siteMenu.open) {
      const focusableItems = [menuSummary, ...menuLinks];
      const firstItem = focusableItems[0];
      const lastItem = focusableItems[focusableItems.length - 1];

      if (event.shiftKey && document.activeElement === firstItem) {
        event.preventDefault();
        lastItem.focus();
      } else if (!event.shiftKey && document.activeElement === lastItem) {
        event.preventDefault();
        firstItem.focus();
      }
    }
  });

  syncMenuState();
}

const scrollScenes = document.querySelectorAll("[data-scroll-scene], [data-hero]");
const hero = document.querySelector("[data-hero]");
const compactViewport = window.matchMedia("(max-width: 47.99rem)");
let animationFrame = 0;
let heroMaskStart = 420;
let heroMaskEnd = 0;

const clamp = (value, min = 0, max = 1) => Math.min(Math.max(value, min), max);
const smoothstep = (value) => value * value * (3 - 2 * value);
const rangeProgress = (value, start, end) =>
  smoothstep(clamp((value - start) / (end - start)));

const syncHeroMetrics = () => {
  const isCompact = compactViewport.matches;
  heroMaskStart = isCompact
    ? window.innerWidth * 0.9
    : clamp(window.innerWidth * 0.44, 360, 680);
  heroMaskEnd = Math.max(window.innerWidth, window.innerHeight) * (isCompact ? 2.2 : 3);
};

const sceneProgress = (element) => {
  const rect = element.getBoundingClientRect();
  const travel = Math.max(element.offsetHeight - window.innerHeight, 1);
  return clamp(-rect.top / travel);
};

const updateHeroScene = (progress) => {
  if (!hero) return;

  const reveal = rangeProgress(progress, 0, 0.7);
  const overlay = rangeProgress(progress, 0.6, 0.9);
  const copy = rangeProgress(progress, 0.6, 0.9);
  const scrollHint = 1 - rangeProgress(progress, 0.08, 0.55);
  const maskSize = heroMaskStart + (heroMaskEnd - heroMaskStart) * reveal;

  hero.style.setProperty("--scene-p", progress.toFixed(4));
  hero.style.setProperty("--hero-mask-size", `${maskSize.toFixed(1)}px`);
  hero.style.setProperty("--hero-overlay-opacity", (overlay * 0.5).toFixed(4));
  hero.style.setProperty("--hero-copy-opacity", copy.toFixed(4));
  hero.style.setProperty("--hero-copy-y", `${((1 - copy) * 32).toFixed(1)}px`);
  hero.style.setProperty("--hero-scroll-opacity", scrollHint.toFixed(4));
};

const updateScroll = () => {
  animationFrame = 0;

  if (reduceMotionQuery.matches) {
    document.body.classList.toggle(
      "hero-passed-intro",
      Boolean(hero) && window.scrollY > 80
    );
    return;
  }

  let currentHeroProgress = null;

  scrollScenes.forEach((scene) => {
    const progress = sceneProgress(scene);

    if (scene === hero) {
      currentHeroProgress = progress;
      updateHeroScene(progress);
    } else {
      scene.style.setProperty("--scene-p", progress.toFixed(4));
    }
  });

  if (hero) {
    document.body.classList.toggle(
      "hero-passed-intro",
      currentHeroProgress > 0.35
    );
  } else {
    document.body.classList.remove("hero-passed-intro");
  }
};

const requestScrollUpdate = () => {
  if (!animationFrame) {
    animationFrame = window.requestAnimationFrame(updateScroll);
  }
};

const handleResize = () => {
  syncHeroMetrics();
  requestScrollUpdate();
};

window.addEventListener("scroll", requestScrollUpdate, { passive: true });
window.addEventListener("resize", handleResize);
compactViewport.addEventListener("change", handleResize);
reduceMotionQuery.addEventListener("change", requestScrollUpdate);
syncHeroMetrics();
updateScroll();

const themeSections = document.querySelectorAll("[data-menu-theme]");

if ("IntersectionObserver" in window) {
  const themeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          document.body.dataset.menuTheme = entry.target.dataset.menuTheme;
        }
      });
    },
    { rootMargin: "-48% 0px -48%", threshold: 0 }
  );

  themeSections.forEach((section) => themeObserver.observe(section));
}

const revealItems = document.querySelectorAll("[data-reveal]");

if (!reduceMotionQuery.matches && "IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -8%", threshold: 0.12 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const heroVideo = document.querySelector(".hero__media video");

if (heroVideo) {
  heroVideo.autoplay = true;
  heroVideo.defaultMuted = true;
  heroVideo.muted = true;
  heroVideo.loop = true;
  heroVideo.playsInline = true;

  const heroMedia = heroVideo.closest(".hero__media");
  const showVideoFallback = () => heroMedia?.classList.add("video-unavailable");

  heroVideo.addEventListener("error", showVideoFallback);
  heroVideo.querySelector("source")?.addEventListener("error", showVideoFallback);

  const playAttempt = heroVideo.play();
  if (playAttempt) {
    playAttempt.catch(() => {
      heroVideo.closest(".hero__media").classList.add("video-paused");
    });
  }
}

const newsletterForm = document.querySelector(".newsletter__form");

if (newsletterForm) {
  newsletterForm.addEventListener("submit", (event) => {
    event.preventDefault();
  });
}

const festivalNote = document.querySelector("[data-festival-note]");
const festivalDismiss = document.querySelector("[data-festival-dismiss]");

if (festivalNote && festivalDismiss) {
  let wasDismissed = false;

  try {
    wasDismissed = window.sessionStorage.getItem("festival-note-dismissed") === "true";
  } catch (error) {
    wasDismissed = false;
  }

  if (wasDismissed) {
    festivalNote.hidden = true;
  }

  festivalDismiss.addEventListener("click", () => {
    festivalNote.hidden = true;

    try {
      window.sessionStorage.setItem("festival-note-dismissed", "true");
    } catch (error) {
      /* Dismissal still works when storage is unavailable. */
    }
  });
}

const socialProfiles = [
  ["YouTube", "https://www.youtube.com/@ISFFDetmold"],
  ["Instagram", "https://www.instagram.com/kulturundart/"],
  ["X", "https://x.com/art_kultur"],
  ["Facebook", "https://www.facebook.com/kulturundart"]
];

const addSocialLinks = (target) => {
  if (!target || target.querySelector(".social-block")) return;

  const block = document.createElement("div");
  block.className = "social-block";
  block.innerHTML = '<p class="eyebrow">Follow</p>';

  const nav = document.createElement("nav");
  nav.className = "social-links";
  nav.setAttribute("aria-label", "Social media");

  socialProfiles.forEach(([label, url]) => {
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = label;
    nav.append(link);
  });

  block.append(nav);
  target.append(block);
};

addSocialLinks(document.querySelector(".site-menu__meta"));
addSocialLinks(document.querySelector(".site-footer__links > div:nth-child(3)"));

const scheduleTabs = document.querySelectorAll("[data-schedule-day]");
const scheduleRows = document.querySelectorAll("[data-schedule-row]");
const scheduleDetails = document.querySelectorAll("[data-schedule-detail]");

const showScheduleDay = (day) => {
  scheduleTabs.forEach((tab) => {
    const isActive = tab.dataset.scheduleDay === day;
    tab.setAttribute("aria-selected", String(isActive));
    tab.tabIndex = isActive ? 0 : -1;
  });

  scheduleRows.forEach((row) => {
    row.hidden = row.dataset.scheduleRow !== day;
    const toggle = row.querySelector(".schedule-toggle");
    toggle?.setAttribute("aria-expanded", "false");
    if (toggle) toggle.textContent = "+";
  });

  scheduleDetails.forEach((row) => {
    row.hidden = true;
  });
};

if (scheduleTabs.length) {
  scheduleTabs.forEach((tab, index) => {
    tab.addEventListener("click", () => showScheduleDay(tab.dataset.scheduleDay));
    tab.addEventListener("keydown", (event) => {
      if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
      event.preventDefault();
      const direction = event.key === 'ArrowRight' ? 1 : -1;
      const nextTab = scheduleTabs[(index + direction + scheduleTabs.length) % scheduleTabs.length];
      nextTab.focus();
      showScheduleDay(nextTab.dataset.scheduleDay);
    });
  });

  showScheduleDay(
    document.querySelector('[data-schedule-day][aria-selected="true"]')?.dataset.scheduleDay ||
      scheduleTabs[0].dataset.scheduleDay
  );
}

document.querySelectorAll(".schedule-toggle").forEach((button) => {
  button.addEventListener("click", () => {
    const detailRow = button.closest("tr")?.nextElementSibling;
    if (!detailRow?.matches("[data-schedule-detail]")) return;

    const isOpen = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!isOpen));
    button.textContent = isOpen ? "+" : "−";
    detailRow.hidden = isOpen;
  });
});

const chatForm = document.querySelector("[data-chat-form]");
const chatMessages = document.querySelector("[data-chat-messages]");

if (chatForm && chatMessages) {
  chatForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = chatForm.querySelector("input");
    const message = input.value.trim();
    if (!message) return;

    const entry = document.createElement("p");
    const author = document.createElement("strong");
    author.textContent = "You";
    entry.append(author, document.createTextNode(message));
    chatMessages.append(entry);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    input.value = "";
  });
}
