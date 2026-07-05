(function(){

  /* ---------------------------------------------------------------
     Edit this array to add / remove / reorder memories.
  --------------------------------------------------------------- */
  const PHOTOS = [
    { src: "assets/photos/1_compressed.jpg", caption: "I still remember how beautiful you looked that day…" },

    { src: "assets/photos/2_compressed.jpg", caption: "…I couldn’t even focus, you were all I saw." },

    { src: "assets/photos/3_compressed.jpg", caption: "Your smile made me forget everything I was going to say…" },

    { src: "assets/photos/4_compressed.jpg", caption: "…but I knew I wanted you, more than words could explain." },

    { src: "assets/photos/5_compressed.jpg", caption: "That moment when I finally confessed…" },

    { src: "assets/photos/6_compressed.jpg", caption: "…looking at you made it worth it." },

    { src: "assets/photos/7_compressed.jpg", caption: "You were so beautiful, I couldn’t believe you were real." },

    { src: "assets/photos/10_compressed.jpg", caption: "And happily, you said 'me too'…" },

    { src: "assets/photos/11_compressed.jpg", caption: "…and that became the most special day of my life." }
  ];

  const landing   = document.getElementById('landing');
  const line1     = document.getElementById('line1');
  const line2     = document.getElementById('line2');
  const openBtn   = document.getElementById('open-btn');

  const videoStage = document.getElementById('video-stage');
  const video       = document.getElementById('intro-video');

  const flipStage = document.getElementById('flip-stage');
  const flipCard  = document.getElementById('flip-card');

  const photoSlot  = document.getElementById('photo-slot');
  const caption    = document.getElementById('caption');
  const finalMsg   = document.getElementById('final-message');
  const prevBtn    = document.getElementById('prev-btn');
  const nextBtn    = document.getElementById('next-btn');

  const music = document.getElementById('bg-music');

  let index = 0;
  let showingFinal = false;

  /* ---------- 0. Rotate-device note ---------- */
  // The prompt's visibility is controlled entirely by CSS
  // (@media (orientation: portrait) and (max-width: 900px) in
  // styles.css) so it can never fail to show because of a
  // touch/pointer-detection quirk. This listener just watches the
  // SAME breakpoint so we can pause/resume video and music in sync.
  const rotateQuery = window.matchMedia('(orientation: portrait) and (max-width: 900px)');

  function handleOrientationChange(e){
    const blocked = e.matches;
    if (blocked){
      if (!video.paused) video.pause();
      if (!music.paused) music.pause();
    } else {
      if (videoStage.classList.contains('visible') && !video.ended){
        video.play().catch(() => {});
      }
      if (landing.style.display === 'none'){
        music.play().catch(() => {});
      }
    }
  }

  if (rotateQuery.addEventListener){
    rotateQuery.addEventListener('change', handleOrientationChange);
  } else if (rotateQuery.addListener){
    // Safari <14 fallback
    rotateQuery.addListener(handleOrientationChange);
  }

  /* ---------- 1. Landing sequence ---------- */
  setTimeout(() => line1.classList.add('show'), 300);
  setTimeout(() => {
    line1.style.transition = 'opacity 0.8s ease';
    line1.style.opacity = '0';
    line2.classList.add('show');
  }, 2300);
  setTimeout(() => openBtn.classList.add('show'), 3600);

  openBtn.addEventListener('click', startExperience);

  async function startExperience(){
    await requestFullscreenIfAvailable();
    openBtn.disabled = true;
    landing.classList.add('fade-out');

    setTimeout(() => {
      landing.style.display = 'none';

      music.volume = 0.55;
        music.currentTime = 0;
        music.loop = false;
      music.play().catch(() => {});

      videoStage.classList.add('visible');
      video.currentTime = 0;
      setTimeout(() => {
        video.play().catch(() => {
          goToFlip();
        });
      }, 2100);
    }, 900);
  }

  async function requestFullscreenIfAvailable() {
    const element = document.documentElement;

    try {
      if (!document.fullscreenElement && element.requestFullscreen) {
        await element.requestFullscreen();
      }
    } catch (err) {
      // Browser doesn't support fullscreen or denied the request.
      console.log("Fullscreen not available:", err);
    }
  }

  video.addEventListener('ended', goToFlip);
  video.addEventListener('error', goToFlip);

  let flipTriggered = false;
  function goToFlip(){
    if (flipTriggered) return;
    flipTriggered = true;

    // reveal the flip-stage's front face -- it shows the exact same
    // last frame the video just ended on, so there is no visible seam
    flipStage.classList.add('visible');

    setTimeout(() => {
      videoStage.classList.remove('visible');
      spin();
    }, 200);
  }

  /* ---------- 4. Spin the frame 180deg to face the viewer ---------- */
  function spin(){
    flipCard.classList.add('spin');

    setTimeout(() => {
      beginAlbum();
    }, 1750);
  }

  /* ---------- 6/7/8. Photos placed directly on the blank page ---------- */
  function beginAlbum(){
    setTimeout(() => renderPhoto(0), 1000);
  }

  function buildPhotoCard(photo){
    const card = document.createElement('div');
    card.className = 'photo-card';

    const img = document.createElement('img');
    img.alt = photo.caption || 'A memory';
    img.src = photo.src;
    img.onerror = function(){
      const ph = document.createElement('div');
      ph.className = 'placeholder';
      ph.textContent = 'Add ' + photo.src.split('/').pop() + ' to assets/photos/';
      card.replaceChild(ph, img);
    };

    card.appendChild(img);
    return card;
  }

  function renderPhoto(i){
    showingFinal = false;
    finalMsg.classList.remove('show');
    photoSlot.style.opacity = '1';
    caption.classList.remove('show');

    const existing = photoSlot.querySelector('.photo-card');
    const newCard = buildPhotoCard(PHOTOS[i]);
    photoSlot.appendChild(newCard);

    if (existing){
      existing.classList.add('leave');
      existing.addEventListener('animationend', () => existing.remove(), { once:true });
    }

    requestAnimationFrame(() => { newCard.classList.add('drop'); });

    caption.textContent = PHOTOS[i].caption || '';
    setTimeout(() => caption.classList.add('show'), 300);

      prevBtn.classList.add('show');
      nextBtn.classList.add('show');

    // SHOW both by default
      prevBtn.classList.remove('hidden-nav');
      nextBtn.classList.remove('hidden-nav');

      // FIRST photo → hide previous
      if (i === 0) {
        prevBtn.classList.add('hidden-nav');
      }

  }

  function renderFinalPage(){
    showingFinal = true;

      prevBtn.classList.remove('hidden-nav');
      nextBtn.classList.add('hidden-nav');
    const existing = photoSlot.querySelector('.photo-card');
    if (existing){
      existing.classList.add('leave');
      existing.addEventListener('animationend', () => existing.remove(), { once:true });
    }
    caption.classList.remove('show');
    caption.textContent = '';
    photoSlot.style.transition = 'opacity 0.4s ease';
    photoSlot.style.opacity = '0';
    setTimeout(() => finalMsg.classList.add('show'), 350);
  }

  prevBtn.addEventListener('click', () => {
    if (showingFinal) {
      // final page → last photo
      showingFinal = false;
      index = PHOTOS.length - 1;
      renderPhoto(index);
      return;
    }

    if (index === 0) {
      // first photo → final page
      renderFinalPage();
    } else {
      index--;
      renderPhoto(index);
    }
  });

  nextBtn.addEventListener('click', () => {
    if (showingFinal) {
      // from final page → back to first photo
      showingFinal = false;
      index = 0;
      renderPhoto(index);
      return;
    }

    if (index === PHOTOS.length - 1) {
      renderFinalPage();
    } else {
      index++;
      renderPhoto(index);
    }
  });

})();
