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
/* ===============================
   YOUTUBE CAROUSEL (AUTO UPDATE)
=============================== */
(async function () {
  const track = document.getElementById("youtube-track");
  const channelID = "UCgqVuw9Oh9jBlmYlh03Q2aw";
  const rssUrl = `https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.youtube.com%2Ffeeds%2Fvideos.xml%3Fchannel_id%3D${channelID}`;

  try {
    const response = await fetch(rssUrl);
    const data = await response.json();

    // rss2json returns items.link = "https://www.youtube.com/watch?v=VIDEO_ID"
    // We verify status is ok
    if (data.status !== 'ok') throw new Error('Failed to fetch RSS');

    const videos = data.items.map(item => {
      // Extract Video ID from link or guid
      // guid is usually "yt:video:VIDEO_ID"
      const videoId = item.guid.split(':')[2];
      return {
        id: videoId,
        title: item.title
      };
    });

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

    // Initialize 3D Tilt for new elements
    const tiltCards = document.querySelectorAll('.card, .card-inner');
    tiltCards.forEach(card => {
      // Remove old listeners to avoid duplicates if any (simple approach: clone or just add new ones carefully)
      // Here we just re-attach or ensure our tilt query selector in previous block covers it? 
      // Actually the tilt logic at the bottom runs ONCE on load. We need to attach tilt to these NEW items.
      // Let's attach tilt logic directly here for these new items.

      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -15;
        const rotateY = ((x - centerX) / centerX) * 15;
        let baseRotateY = card.classList.contains('is-flipped') || card.classList.contains('tap-flip') ? 180 : 0;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${baseRotateY + rotateY}deg)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
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

  } catch (err) {
    console.error(err);
    track.innerHTML = "<p style='color:var(--text-secondary);'>⚠️ Unable to load latest videos.</p>";
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

/* ===============================
   STATS COUNTER
=============================== */
const statsSection = document.getElementById('stats');
const statNumbers = document.querySelectorAll('.stat-number');
let started = false;

if (statsSection) {
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !started) {
      started = true;
      statNumbers.forEach(num => {
        const target = +num.getAttribute('data-target');
        const duration = 2000; // ms
        const increment = target / (duration / 16);

        let current = 0;
        const updateCount = () => {
          current += increment;
          if (current < target) {
            // Show simple number while counting up
            num.innerText = Math.ceil(current).toLocaleString(); // Removed + during count
            requestAnimationFrame(updateCount);
          } else {
            // Final Formatting matches image
            if (target === 5000000) num.innerText = "5M+";
            else if (target === 400) num.innerText = "400+";
            else if (target === 2024) num.innerText = "2024";
            else num.innerText = target.toLocaleString();
          }
        };
        updateCount();
      });
    }
  });
  observer.observe(statsSection);
}

/* ===============================
   3D TILT EFFECT
=============================== */
document.querySelectorAll('.card, .card-inner').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate rotation (-15 to +15 deg)
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -15; // Invert Y for tilt
    const rotateY = ((x - centerX) / centerX) * 15;

    // Check if flipped to maintain state
    let baseRotateY = card.classList.contains('is-flipped') || card.classList.contains('tap-flip') ? 180 : 0;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${baseRotateY + rotateY}deg)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});
