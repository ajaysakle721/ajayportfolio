const root = document.documentElement;

function setTheme(theme) {
  root.dataset.theme = theme;
  localStorage.setItem("theme", theme);

  const dark = theme === "dark";

  document
    .querySelectorAll("#theme-icon, #theme-icon-mobile")
    .forEach((el) => {
      el.textContent = dark ? "☼" : "☾";
    });
}

setTheme(localStorage.getItem("theme") || "dark");


function toggleTheme() {
  setTheme(root.dataset.theme === "dark" ? "light" : "dark");
}


const themeToggle = document.querySelector("#theme-toggle");
const mobileThemeToggle = document.querySelector("#theme-toggle-mobile");

if (themeToggle) {
  themeToggle.addEventListener("click", toggleTheme);
}

if (mobileThemeToggle) {
  mobileThemeToggle.addEventListener("click", toggleTheme);
}


/* ================= HEADER & MOBILE MENU ================= */

const header = document.querySelector("#site-header");
const menu = document.querySelector("#mobile-menu");
const menuButton = document.querySelector("#menu-toggle");

if (menuButton && menu) {
  menuButton.addEventListener("click", () => {
    const open = menu.classList.toggle("open");

    menuButton.classList.toggle("open", open);
    menuButton.setAttribute("aria-expanded", open);
  });

  menu.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", (e) => {

      menu.classList.remove("open");
      menuButton.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");

      const href = a.getAttribute("href");

      if (
        !href ||
        !href.startsWith("#") ||
        !document.querySelector(href)
      ) {
        return;
      }

      e.preventDefault();

      const target = document.querySelector(href);

      setTimeout(() => {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });

        if (header) {
          header.classList.toggle("scrolled", scrollY > 50);
        }
      }, 320);
    });
  });
}


/* ================= SCROLL ================= */

window.addEventListener(
  "scroll",
  () => {

    if (header) {
      header.classList.toggle("scrolled", scrollY > 50);
    }

    const scrollTop = document.querySelector("#scroll-top");

    if (scrollTop) {
      scrollTop.classList.toggle(
        "visible",
        scrollY > 450
      );
    }
  },
  {
    passive: true,
  }
);


/* ================= SCROLL TOP ================= */

const scrollTopButton = document.querySelector("#scroll-top");

if (scrollTopButton) {
  scrollTopButton.addEventListener("click", () => {
    scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}


/* ================= CURRENT YEAR ================= */

const yearElement = document.querySelector("#year");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}


/* ================= COOKIE BANNER ================= */

const cookie = document.querySelector("#cookie-banner");

if (cookie) {

  if (localStorage.getItem("cookieDismissed") === "true") {

    cookie.remove();

  } else {

    const dismissButton =
      document.querySelector("#cookie-dismiss");

    if (dismissButton) {

      dismissButton.addEventListener("click", () => {

        localStorage.setItem(
          "cookieDismissed",
          "true"
        );

        cookie.remove();
      });
    }
  }
}


/* ================= REVEAL ANIMATION ================= */

const observer = new IntersectionObserver(
  (entries) => {

    entries.forEach((entry) => {

      if (entry.isIntersecting) {

        entry.target.classList.add("visible");

        observer.unobserve(entry.target);
      }
    });

  },
  {
    threshold: 0.12,
  }
);


document
  .querySelectorAll(".reveal")
  .forEach((el) => observer.observe(el));


/* ================= ACTIVE NAVIGATION ================= */

const secObs = new IntersectionObserver(
  (entries) => {

    entries.forEach((entry) => {

      if (!entry.isIntersecting) {
        return;
      }

      document
        .querySelectorAll(
          ".nav-links a, .mobile-menu a"
        )
        .forEach((a) => {

          a.classList.toggle(
            "active",
            a.getAttribute("href") ===
              "#" + entry.target.id
          );

        });

    });

  },
  {
    rootMargin: "-40% 0px -55% 0px",
  }
);


[
  "home",
  "about",
  "experience",
  "projects",
  "education",
  "contact",
].forEach((id) => {

  const sec = document.getElementById(id);

  if (sec) {
    secObs.observe(sec);
  }

});


/* ================= CONTACT FORM ================= */

const contactForm =
  document.querySelector("#contact-form");

const cfStatus =
  document.querySelector("#form-status");


if (contactForm) {

  contactForm.addEventListener(
    "submit",
    async (e) => {

      e.preventDefault();

      const btn =
        contactForm.querySelector(
          "button[type=submit]"
        );

      const orig = btn.innerHTML;

      btn.disabled = true;
      btn.textContent = "Sending...";

      if (cfStatus) {
        cfStatus.textContent = "";
        cfStatus.className = "form-status";
      }


      try {

        const res = await fetch(
          contactForm.action,
          {
            method: "POST",

            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },

            body: JSON.stringify(
              Object.fromEntries(
                new FormData(contactForm)
              )
            ),
          }
        );


        const data = await res.json();


        if (res.ok && data.success) {

          if (cfStatus) {

            cfStatus.textContent =
              "Message sent! I will get back to you soon.";

            cfStatus.classList.add("success");
          }

          contactForm.reset();

        } else {

          throw new Error(
            data.error || "Send failed"
          );
        }


      } catch (err) {

        if (cfStatus) {

          cfStatus.textContent =
            "Something went wrong. Please email me directly at sakleajay721@gmail.com.";

          cfStatus.classList.add("error");
        }

      }


      btn.disabled = false;
      btn.innerHTML = orig;
    }
  );
}


/* ================= TYPING EFFECT ================= */

const typedEl =
  document.querySelector("#typed-text");


if (typedEl) {

  const phrases = [

    "Generative AI Engineer",
    "RAG Developer",
    "LLM Application Developer",
    "Python Developer",
    "AI Automation Builder",

  ];


  let pi = 0;
  let ci = 0;
  let deleting = false;


  const reduced =
    matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;


  if (reduced) {

    typedEl.textContent = phrases[0];

  } else {

    (function typeLoop() {

      const word = phrases[pi];

      ci += deleting ? -1 : 1;

      typedEl.textContent =
        word.slice(0, ci);


      let d =
        deleting ? 35 : 85;


      if (
        !deleting &&
        ci === word.length
      ) {

        d = 1700;
        deleting = true;

      } else if (
        deleting &&
        ci === 0
      ) {

        deleting = false;

        pi =
          (pi + 1) %
          phrases.length;

        d = 450;
      }


      setTimeout(typeLoop, d);

    })();

  }
}


/* ================= SCROLL PROGRESS ================= */

const progress =
  document.querySelector("#scroll-progress");


if (progress) {

  const updateProgress = () => {

    const max =
      document.documentElement.scrollHeight -
      innerHeight;

    progress.style.width =
      (
        max > 0
          ? (scrollY / max) * 100
          : 0
      ) + "%";
  };


  addEventListener(
    "scroll",
    updateProgress,
    {
      passive: true,
    }
  );


  addEventListener(
    "resize",
    updateProgress
  );


  updateProgress();
}


/* ================= SKILL IMAGE FALLBACK ================= */

const fallbackSkillImg = (img) => {

  const card =
    img.closest(".skill-card");

  if (!card) {
    return;
  }


  const name =
    (
      card.querySelector("span")?.textContent ||
      ""
    ).trim();


  const badge =
    document.createElement("div");


  badge.className =
    "skill-fallback";


  badge.textContent =
    name
      .split(" ")
      .map((w) => w[0])
      .filter(Boolean)
      .join("")
      .slice(0, 3)
      .toUpperCase();


  img.replaceWith(badge);
};


document
  .querySelectorAll(".skill-card img")
  .forEach((img) => {

    if (
      img.complete &&
      img.naturalWidth === 0
    ) {

      fallbackSkillImg(img);

    } else {

      img.addEventListener(
        "error",
        () => fallbackSkillImg(img),
        {
          once: true,
        }
      );

    }

  });


/* ================= SKILL CARD ANIMATION ================= */

if (
  matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches
) {

  document
    .querySelectorAll(".skill-card")
    .forEach((el) =>
      el.classList.add("stagger-in")
    );

} else {

  const staggerObs =
    new IntersectionObserver(
      (entries) => {

        entries.forEach((entry) => {

          if (entry.isIntersecting) {

            entry.target.classList.add(
              "stagger-in"
            );

            staggerObs.unobserve(
              entry.target
            );
          }

        });

      },
      {
        threshold: 0.1,
      }
    );


  document
    .querySelectorAll(".skill-card")
    .forEach((el, i) => {

      const delay =
        (i % 12) * 50;

      el.style.transitionDelay =
        delay + "ms";


      staggerObs.observe(el);


      setTimeout(() => {

        el.style.transitionDelay =
          "0ms";

      }, delay + 600);

    });

}


/* ================= BUTTON RIPPLE ================= */

document.querySelectorAll(".button").forEach((btn) => {
  btn.addEventListener("pointerdown", (e) => {
    const r = btn.getBoundingClientRect();
    const dot = document.createElement("span");
    dot.className = "ripple-dot";
    dot.style.left = e.clientX - r.left + "px";
    dot.style.top = e.clientY - r.top + "px";
    btn.appendChild(dot);
    setTimeout(() => dot.remove(), 650);
  });
});


/* ================= CARD SPOTLIGHT ================= */

document
  .querySelectorAll(".glass-card, .skill-card, .contact-form")
  .forEach((card) => {
    card.addEventListener(
      "pointermove",
      (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", e.clientX - r.left + "px");
        card.style.setProperty("--my", e.clientY - r.top + "px");
      },
      { passive: true }
    );
  });
