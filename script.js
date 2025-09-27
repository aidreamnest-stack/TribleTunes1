// SPLASH FADE OUT

window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("splash").style.opacity = 0;

    setTimeout(() => {
      document.getElementById("splash").style.display = "none";
    }, 500);
  }, 2000);
});

// FADE-IN SECTIONS

const sections = document.querySelectorAll(".fade-section");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.2 }
);

sections.forEach((section) => observer.observe(section));

// CAROUSEL for Releases

let carouselIndex = 0;

function moveCarousel(direction) {
  const track = document.querySelector(".carousel-track");

  const cards = document.querySelectorAll(".release-card");

  const cardWidth = cards[0].offsetWidth + 20;

  carouselIndex += direction;

  if (carouselIndex < 0) carouselIndex = 0;

  if (carouselIndex > cards.length - 1) carouselIndex = cards.length - 1;

  track.style.transform = `translateX(${-carouselIndex * cardWidth}px)`;
}

// CAROUSEL for YouTube

let ytIndex = 0;

function moveYTCarousel(direction) {
  const track = document.querySelector(".yt-track");

  const cards = document.querySelectorAll(".yt-card");

  const cardWidth = cards[0].offsetWidth + 20;

  ytIndex += direction;

  if (ytIndex < 0) ytIndex = 0;

  if (ytIndex > cards.length - 1) ytIndex = cards.length - 1;

  track.style.transform = `translateX(${-ytIndex * cardWidth}px)`;
}

// FAQ Toggle

document.querySelectorAll(".faq-item").forEach((item) => {
  item.addEventListener("click", () => item.classList.toggle("open"));
});

// Newsletter

const newsletterForm = document.getElementById("newsletter-form");

const newsletterMsg = document.getElementById("newsletter-message");

newsletterForm.addEventListener("submit", (e) => {
  e.preventDefault();

  newsletterMsg.style.display = "block";

  newsletterMsg.textContent = "Thank you for subscribing!";

  newsletterForm.reset();

  setTimeout(() => {
    newsletterMsg.style.display = "none";
  }, 4000);
});

// Particle Background

const canvas = document.getElementById("bgCanvas");

const ctx = canvas.getContext("2d");

let particles = [];

canvas.width = window.innerWidth;

canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

function createParticles() {
  particles = [];

  for (let i = 0; i < 100; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 1,
      dx: (Math.random() - 0.5) * 0.5,
      dy: (Math.random() - 0.5) * 0.5
    });
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach((p) => {
    ctx.beginPath();

    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);

    ctx.fillStyle = "rgba(255,64,129,0.7)";

    ctx.fill();

    p.x += p.dx;
    p.y += p.dy;

    if (p.x > canvas.width || p.x < 0) p.dx *= -1;

    if (p.y > canvas.height || p.y < 0) p.dy *= -1;
  });

  requestAnimationFrame(animateParticles);
}

createParticles();
animateParticles();
