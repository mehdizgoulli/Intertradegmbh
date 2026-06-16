// ===== Navbar: shadow on scroll + mobile toggle =====
const navbar = document.getElementById("navbar");
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 10);
});

navToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  navToggle.classList.toggle("open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    navToggle.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

// ===== Scroll reveal animations =====
const revealTargets = document.querySelectorAll(
  ".section-head, .about-media, .about-text, .cat-card, .step-card, .why-card, .contact-info, .contact-form, .cta-text"
);
revealTargets.forEach((el) => el.classList.add("reveal"));

// Staggered cascade for the process steps
document.querySelectorAll(".process-grid .step-card").forEach((el, i) => {
  el.classList.add(`delay-${(i % 4) + 1}`);
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);
revealTargets.forEach((el) => revealObserver.observe(el));

// ===== Animated stat counters =====
const counters = document.querySelectorAll(".stats strong[data-count]");

const animateCount = (el) => {
  const target = parseInt(el.dataset.count, 10);
  const suffix = el.dataset.suffix || "";
  const duration = 1500;
  const start = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(target * eased).toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};

const countObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        countObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);
counters.forEach((el) => countObserver.observe(el));

// ===== Contact form (client-side validation + feedback) =====
const form = document.getElementById("contactForm");
const formNote = document.getElementById("formNote");

if (form && formNote) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const required = ["name", "email", "message"];
    let valid = true;

    required.forEach((id) => {
      const field = document.getElementById(id);
      const empty = !field.value.trim();
      const badEmail =
        id === "email" && field.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value);
      if (empty || badEmail) {
        field.classList.add("invalid");
        valid = false;
      } else {
        field.classList.remove("invalid");
      }
    });

    if (!valid) {
      formNote.hidden = false;
      formNote.textContent = "Please fill in your name, a valid email, and a message.";
      formNote.style.color = "#d9534f";
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalLabel = submitBtn ? submitBtn.textContent : "";
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending…";
    }

    formNote.hidden = false;
    formNote.style.color = "";
    formNote.textContent = "Sending your inquiry…";

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      });
      const data = await response.json();

      if (response.ok && data.success) {
        formNote.style.color = "";
        formNote.textContent =
          "Thank you! Your inquiry has been received — we'll respond within 24 hours.";
        form.reset();
      } else {
        formNote.style.color = "#d9534f";
        formNote.textContent =
          data.message || "Something went wrong. Please email us at info@intertradegmbh.de.";
      }
    } catch (err) {
      formNote.style.color = "#d9534f";
      formNote.textContent =
        "Network error. Please try again or email us at info@intertradegmbh.de.";
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalLabel;
      }
    }
  });
}

// ===== Footer year =====
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ===== Partner brand logos =====
// Each brand points to its LOCAL logo file in assets/brands/ (exact file name,
// case-sensitive, .png or .webp). If a file fails to load, the brand name is
// shown as plain text instead (no broken images).
const brands = [
  { name: "Ferrero", file: "frerrero.png" },
  { name: "Milka", file: "milka.png" },
  { name: "Kinder", file: "kinder.png" },
  { name: "KitKat", file: "kitkat.png" },
  { name: "Toblerone", file: "Toblerone.png" },
  { name: "Snickers", file: "snickers.png" },
  { name: "Twix", file: "Twix.png" },
  { name: "Haribo", file: "haribo.png" },
  { name: "Katjes", file: "katjes.png" },
  { name: "Hitschies", file: "Hitschies.png" },
  { name: "Capri-Sun", file: "capri-sun.png" },
  { name: "Pepsi", file: "pepsi.png" },
  { name: "Lay's", file: "Lays.png" },
  { name: "Doritos", file: "doritos.png" },
  { name: "Buldak", file: "Buldak.png" },
  { name: "Hot Blood", file: "hot-blood.png" },
];

function showBrandText(tile, name) {
  tile.innerHTML = "";
  const label = document.createElement("span");
  label.textContent = name;
  label.style.fontFamily = '"Sora", sans-serif';
  label.style.fontWeight = "700";
  label.style.color = "#0d1c3d";
  label.style.fontSize = "1.05rem";
  tile.appendChild(label);
}

function buildBrandTile(brand) {
  const tile = document.createElement("div");
  tile.className = "brand-tile";

  const img = document.createElement("img");
  img.alt = `${brand.name} logo`;
  img.loading = "lazy";

  // Fallback to brand name as text if the local logo can't be loaded
  img.addEventListener("error", () => {
    showBrandText(tile, brand.name);
  });

  img.src = `assets/brands/${brand.file}`;
  tile.appendChild(img);
  return tile;
}

const brandTrack = document.getElementById("brandTrack");
const brandTrackClone = document.getElementById("brandTrackClone");

if (brandTrack && brandTrackClone) {
  brands.forEach((brand) => {
    brandTrack.appendChild(buildBrandTile(brand));
    brandTrackClone.appendChild(buildBrandTile(brand));
  });
}

