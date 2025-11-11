/* ===============================
   THEME TOGGLE
=============================== */
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const savedTheme = localStorage.getItem('theme') || 'dark';

document.documentElement.setAttribute('data-theme', savedTheme);
themeIcon.setAttribute('name', savedTheme === 'light' ? 'sunny-outline' : 'moon-outline');

themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', next);
  themeIcon.setAttribute('name', next === 'light' ? 'sunny-outline' : 'moon-outline');
  localStorage.setItem('theme', next);
});

/* ===============================
   HAMBURGER + SIDEBAR
=============================== */
const hamburger = document.getElementById('hamburger');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  sidebar.classList.toggle('show');
  overlay.classList.toggle('show');
});

overlay.addEventListener('click', () => {
  hamburger.classList.remove('active');
  sidebar.classList.remove('show');
  overlay.classList.remove('show');
});

/* Close sidebar links when clicked */
document.querySelectorAll('#sidebar a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    sidebar.classList.remove('show');
    overlay.classList.remove('show');
  });
});

/* ===============================
   RELEASES CAROUSEL
=============================== */
(async function () {
  const track = document.getElementById('release-track');

  try {
    const response = await fetch('releases.json');
    const releases = await response.json();

    releases.forEach((release, i) => {
      const item = document.createElement('div');
      item.className = 'carousel-item';
      item.innerHTML = `
        <div class="card-inner">
          <div class="card-front">
            <img src="${release.image}" alt="${release.title}" loading="lazy">
          </div>
          <div class="card-back">
            <h3>${release.title}</h3>
            <a href="${release.link}" class="btn" target="_blank">Listen Now</a>
          </div>
        </div>
        <p class="card-caption">${i < releases.length - 1 ? "Swipe Next" : "End of List"}</p>
      `;
      track.appendChild(item);
    });

    const items = [...track.children];
    let index = 0;
    let startX = 0;

    function update() {
      track.style.transform = `translateX(-${index * 100}%)`;
    }

    /* Swipe Controls */
    track.addEventListener("touchstart", e => startX = e.touches[0].clientX);
    track.addEventListener("touchend", e => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) index = (index + (diff > 0 ? 1 : -1) + items.length) % items.length;
      update();
      items.forEach(it => it.querySelector('.card-inner').classList.remove('is-flipped'));
    });

    /* Card Flip */
    items.forEach(item => {
      item.querySelector('.card-inner').addEventListener('click', e => {
        if (e.target.tagName !== 'A')
          item.querySelector('.card-inner').classList.toggle('is-flipped');
      });
    });

    /* Auto Slide */
    setInterval(() => {
      index = (index + 1) % items.length;
      update();
      items.forEach(it => it.querySelector('.card-inner').classList.remove('is-flipped'));
    }, 4000);

  } catch {
    track.innerHTML = "<p style='color:var(--text-secondary);'>⚠️ Unable to load releases.</p>";
  }
})();

/* ===============================
   YOUTUBE CAROUSEL
=============================== */
(async function () {
  const track = document.getElementById("youtube-track");

  try {
    const response = await fetch("videos.json");
    const videos = await response.json();

    videos.forEach(video => {
      const item = document.createElement("div");
      item.className = "youtube-item";
      item.innerHTML = `
        <div class="card">
          <div class="card-front">
            <img src="https://img.youtube.com/vi/${video.id}/hqdefault.jpg" loading="lazy">
          </div>
          <div class="card-back">
            <a href="https://youtu.be/${video.id}" target="_blank" class="listen-btn">Listen Now</a>
          </div>
        </div>
      `;
      track.appendChild(item);
    });

    const items = [...track.children];
    let index = 0, startX = 0;

    function update() {
      track.style.transform = `translateX(-${index * 100}%)`;
    }

    track.addEventListener("touchstart", e => startX = e.touches[0].clientX);
    track.addEventListener("touchend", e => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) index = (index + (diff > 0 ? 1 : -1) + items.length) % items.length;
      update();
    });

    setInterval(() => {
      index = (index + 1) % items.length;
      update();
    }, 4000);

    items.forEach(item => item.querySelector(".card").addEventListener("click", () =>
      item.querySelector(".card").classList.toggle("tap-flip")
    ));

  } catch {
    track.innerHTML = "<p style='color:var(--text-secondary);'>⚠️ Unable to load videos.</p>";
  }
})();

/* ===============================
   FAQ EXPAND
=============================== */
document.querySelectorAll(".faq-question").forEach(btn => {
  btn.addEventListener("click", () => btn.classList.toggle("active"));
});

/* ===============================
   SCROLL TO TOP
=============================== */
const scrollTopBtn = document.getElementById("scrollTop");

window.addEventListener("scroll", () =>
  scrollTopBtn.classList.toggle("show", window.scrollY > 300)
);

scrollTopBtn.addEventListener("click", () =>
  window.scrollTo({ top: 0, behavior: "smooth" })
);
