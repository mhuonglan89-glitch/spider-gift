/**
 * ROMANTIC FLOWER GIFT WEB - APPLICATION SCRIPT
 * Hỗ trợ trải nghiệm mượt mà trên Mobile & Laptop không cần server
 */

// ==========================================================
// 1. CẤU HÌNH & DỮ LIỆU MẶC ĐỊNH (DEFAULT DATA)
// ==========================================================

// Tạo ảnh chân dung nghệ thuật phong cách ảnh phim nhẹ nhàng, màu sắc thực tế (chuẩn hóa URI an toàn)
function createAestheticPortrait(bgColor, silhouetteColor) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect width="300" height="300" fill="${bgColor}"/><circle cx="150" cy="115" r="48" fill="${silhouetteColor}" opacity="0.9"/><path d="M78,255 C88,175 212,175 222,255 Z" fill="${silhouetteColor}" opacity="0.92"/><circle cx="210" cy="80" r="14" fill="#ffffff" opacity="0.45"/><circle cx="95" cy="160" r="10" fill="#ffffff" opacity="0.35"/><circle cx="155" cy="52" r="8" fill="#ffffff" opacity="0.5"/></svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

function createCouplePortrait() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect width="300" height="300" fill="#fce8ed"/><circle cx="120" cy="118" r="42" fill="#ffffff" opacity="0.95"/><path d="M60,250 C70,180 170,180 180,250 Z" fill="#ffffff" opacity="0.95"/><circle cx="180" cy="128" r="38" fill="#f7cbd6" opacity="0.95"/><path d="M125,250 C135,190 230,190 240,250 Z" fill="#f7cbd6" opacity="0.95"/><circle cx="150" cy="68" r="16" fill="#f27a94" opacity="0.6"/><text x="150" y="278" font-family="'Quicksand',sans-serif" font-size="13" font-weight="700" fill="#a01440" text-anchor="middle" letter-spacing="1">ALWAYS WITH NO ♡</text></svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

const STORAGE_KEY = 'flower_gift_config_spider_v2';

const DEFAULT_CONFIG = {
  // 6 ảnh cho 6 bông hoa
  bouquetPhotos: [
    createAestheticPortrait('#fce4ec', '#f8bbd0'),
    createAestheticPortrait('#fdf0f4', '#f48fb1'),
    createAestheticPortrait('#fce8ee', '#f06292'),
    createAestheticPortrait('#fae3eb', '#ec407a'),
    createAestheticPortrait('#fff0f5', '#f8bbd0'),
    createAestheticPortrait('#fbe4eb', '#f48fb1')
  ],
  // 3 ảnh cho dải phim Photobooth (mặc định lấy 3 ảnh đầu của bó hoa)
  filmstripPhotos: [],
  // Ảnh cho các thẻ bay kỷ niệm
  memoryPhotos: [],
  // Ảnh cặp đôi trong bức thư
  couplePhoto: createCouplePortrait(),
  // Trích dẫn
  bouquetQuote: '"TRỪ KHI SỚM MAI MỞ MẮT THẤY..."',
  flyingBottomQuote: '"TA CỨ THẾ CỨ THẾ YÊU..."',
  envelopeQuote: '"WITH GREAT POWER COMES GREAT LOVE FOR NO 🕷️"',
  letterEndQuote: '"EVEN SPIDER-MAN NEEDS A SAFE PLACE TO LAND 🕸️"',
  // Nội dung bức thư Spider-Man siêu ngầu, bá khí, không sến
  letterGreeting: 'Hey No, 🕷️',
  letterBody: `Ngoài kia No có phải gồng gánh làm siêu anh hùng giải cứu deadline hay cân cả thế giới thì cũng nhớ là: Spider-Man cũng phải ăn no, ngủ đủ giấc thì mới đủ sức bắn tơ nghe chưa!\n\nBiết No giỏi và lì lợm rồi, nhưng lúc nào thấy quá tải thì cứ buông tơ xuống, về đây tui tiếp tế năng lượng cho. Ngoài kia No bảo vệ ai cũng được, còn ở đây tui bảo kê cho No.\n\nDù cả thế giới có quay cuồng, tui vẫn luôn là đồng đội số 1 đứng về phía No. Chiến tiếp thôi người hùng của tui!`,
  letterSignature: 'Your friendly neighborhood ally 🕸️ ♡',
  // Danh sách các câu chữ neon phát sáng bá khí gửi No
  flyingMessages: [
    'Spider-Man cũng phải ăn ngủ đúng giờ nghe chưa',
    'Hôm nay No đã chiến đấu vất vả rồi nè',
    'Cố lên người hùng của tui 🕷️',
    'Ở đây lúc nào cũng bảo kê cho No',
    'No là số 1 luôn á',
    'Mệt thì đáp xuống đây nghỉ ngơi nè 🕸️',
    'Thương No nhất trần đời ♡',
    'Always on your team ⚡',
    'Đừng có gồng quá sức đó No',
    'Bắn tơ tiếp tế năng lượng cho No nè 💖',
    'Dù có chuyện gì xảy ra tui vẫn đứng về phía No',
    'Đồng đội xịn nhất của No là tui chứ ai 🦸‍♂️'
  ],
  flyingDuration: 12,
  musicMode: 'romantic-piano',
  musicUrl: ''
};

// State hiện tại của ứng dụng
let appConfig = JSON.parse(JSON.stringify(DEFAULT_CONFIG));

// Nếu có file config.js được nạp thì ưu tiên sử dụng cấu hình đã lưu
if (typeof USER_SAVED_CONFIG !== 'undefined' && USER_SAVED_CONFIG && typeof USER_SAVED_CONFIG === 'object') {
  appConfig = { ...DEFAULT_CONFIG, ...USER_SAVED_CONFIG };
}

function saveToLocalStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appConfig));
  } catch (e) {
    console.warn('Không thể ghi vào localStorage', e);
  }
}

// Tải dữ liệu đã lưu từ LocalStorage nếu có
try {
  const saved = localStorage.getItem(STORAGE_KEY) || 
                localStorage.getItem('flower_gift_config_spider_v1') || 
                localStorage.getItem('flower_gift_config_v4') ||
                localStorage.getItem('flower_gift_config_v3');
  if (saved) {
    const parsed = JSON.parse(saved);
    appConfig = { ...DEFAULT_CONFIG, ...parsed };
  }
  // Lọc bỏ triệt để placeholder SVG cũ ra khỏi memoryPhotos nếu có
  if (appConfig.memoryPhotos && Array.isArray(appConfig.memoryPhotos)) {
    appConfig.memoryPhotos = appConfig.memoryPhotos.filter(
      p => p && typeof p === 'string' && !p.startsWith('data:image/svg+xml')
    );
  } else {
    appConfig.memoryPhotos = [];
  }
  // Đồng bộ ngay với các ảnh người dùng đã tải
  const existingActive = getActiveFlyingPhotos();
  if (existingActive.length > 0) {
    appConfig.memoryPhotos = existingActive;
  }
  saveToLocalStorage();
} catch (e) {
  console.warn('Không thể đọc từ localStorage', e);
}

// Hàm lấy tất cả ảnh người dùng thực sự đã tải (để làm ảnh bay kỷ niệm, không bao giờ lấy ảnh mẫu rỗng)
function getActiveFlyingPhotos() {
  const pool = [];
  if (appConfig.memoryPhotos) {
    for (const p of appConfig.memoryPhotos) {
      if (p && !p.startsWith('data:image/svg+xml')) pool.push(p);
    }
  }
  if (appConfig.bouquetPhotos) {
    for (const p of appConfig.bouquetPhotos) {
      if (p && !p.startsWith('data:image/svg+xml')) pool.push(p);
    }
  }
  if (appConfig.couplePhoto && !appConfig.couplePhoto.startsWith('data:image/svg+xml')) {
    pool.push(appConfig.couplePhoto);
  }
  if (appConfig.filmstripPhotos) {
    for (const p of appConfig.filmstripPhotos) {
      if (p && !p.startsWith('data:image/svg+xml')) pool.push(p);
    }
  }
  return Array.from(new Set(pool));
}

// Đồng bộ ảnh bay khi người dùng tải ảnh bó hoa hoặc ảnh cặp đôi
function syncMemoryPhotosWithUserUploads() {
  const active = getActiveFlyingPhotos();
  if (active.length > 0) {
    appConfig.memoryPhotos = active;
    renderMemoryThumbs();
  }
}


// ==========================================================
// 2. DOM ELEMENTS
// ==========================================================
const scenes = {
  bouquet: document.getElementById('scene-bouquet'),
  flying: document.getElementById('scene-flying'),
  envelope: document.getElementById('scene-envelope'),
  letter: document.getElementById('scene-letter')
};

const holdTarget = document.getElementById('hold-target');
const holdProgressCircle = document.getElementById('hold-progress-circle');
const holdHint = document.getElementById('hold-hint');

const envelopeWrapper = document.getElementById('envelope-wrapper');
const waxSeal = document.getElementById('wax-seal');

const btnMusic = document.getElementById('btn-music');
const btnViewMode = document.getElementById('btn-viewmode');
const viewmodeIcon = document.getElementById('viewmode-icon');
const btnEdit = document.getElementById('btn-edit');
const btnGuide = document.getElementById('btn-guide-modal-trigger');
const btnCloseEditor = document.getElementById('btn-close-editor');
const btnCloseGuide = document.getElementById('btn-close-guide');
const btnSkipFlying = document.getElementById('btn-skip-flying');
const btnReplay = document.getElementById('btn-replay');
const btnShareTrigger = document.getElementById('btn-share-trigger');

const editorModal = document.getElementById('editor-modal');
const guideModal = document.getElementById('guide-modal');
const bgAudio = document.getElementById('bg-audio');


// ==========================================================
// 3. RENDER NỘI DUNG LÊN GIAO DIỆN
// ==========================================================
function renderUI() {
  // 1. Render 6 ảnh bó hoa
  for (let i = 0; i < 6; i++) {
    const imgEl = document.getElementById(`bouquet-img-${i}`);
    if (imgEl && appConfig.bouquetPhotos[i]) {
      imgEl.src = appConfig.bouquetPhotos[i];
    }
  }

  // 2. Render trích dẫn
  const bouquetQuoteEl = document.getElementById('bouquet-lyrics');
  if (bouquetQuoteEl) bouquetQuoteEl.textContent = appConfig.bouquetQuote;

  const flyingQuoteEl = document.getElementById('flying-bottom-quote');
  if (flyingQuoteEl) flyingQuoteEl.textContent = appConfig.flyingBottomQuote;

  const envelopeQuoteEl = document.getElementById('envelope-footer-quote');
  if (envelopeQuoteEl) envelopeQuoteEl.textContent = appConfig.envelopeQuote;

  const letterEndQuoteEl = document.getElementById('letter-end-quote');
  if (letterEndQuoteEl) letterEndQuoteEl.textContent = appConfig.letterEndQuote;

  // 3. Render thiệp thư
  const greetingEl = document.getElementById('letter-greeting-text');
  if (greetingEl) greetingEl.textContent = appConfig.letterGreeting;

  const bodyEl = document.getElementById('letter-body-text');
  if (bodyEl) {
    bodyEl.innerHTML = appConfig.letterBody.replace(/\n/g, '<br>');
  }

  const signEl = document.getElementById('letter-signature-text');
  if (signEl) signEl.textContent = appConfig.letterSignature;

  const coupleImgEl = document.getElementById('letter-couple-img');
  if (coupleImgEl && appConfig.couplePhoto) {
    coupleImgEl.src = appConfig.couplePhoto;
  }

  // 4. Render 3 ảnh dải phim Photobooth (Ảnh số 2)
  const filmPhotos = (appConfig.filmstripPhotos && appConfig.filmstripPhotos.length >= 3)
    ? appConfig.filmstripPhotos
    : [appConfig.bouquetPhotos[0], appConfig.bouquetPhotos[1], appConfig.bouquetPhotos[2]];

  for (let i = 0; i < 3; i++) {
    const filmEl = document.getElementById(`film-img-${i}`);
    if (filmEl && filmPhotos[i]) {
      filmEl.src = filmPhotos[i];
    }
    const editFilmPrev = document.getElementById(`edit-prev-film-${i}`);
    if (editFilmPrev && filmPhotos[i]) {
      editFilmPrev.src = filmPhotos[i];
    }
  }
}

renderUI();


// ==========================================================
// 4. CHUYỂN PHÂN CẢNH (SCENE CONTROLLER)
// ==========================================================
function switchScene(sceneName) {
  Object.keys(scenes).forEach(key => {
    scenes[key].classList.remove('active');
  });

  if (scenes[sceneName]) {
    scenes[sceneName].classList.add('active');
  }

  // Kích hoạt logic riêng từng màn hình
  if (sceneName === 'flying') {
    startFlyingScene();
  } else {
    stopFlyingScene();
  }

  if (sceneName === 'envelope') {
    envelopeWrapper.classList.remove('opening');
  }

  if (sceneName === 'letter') {
    createFallingSpiderSparks();
  }
}


// ==========================================================
// 5. HIỆU ỨNG ẤN GIỮ LÂU (LONG PRESS ON BOUQUET)
// ==========================================================
let holdStartTime = 0;
let holdAnimFrame = null;
const HOLD_DURATION = 2400; // 2.4 giây để kích hoạt
const CIRCLE_CIRCUMFERENCE = 264; // 2 * PI * 42

function setHoldProgress(percent) {
  const offset = CIRCLE_CIRCUMFERENCE - (percent / 100) * CIRCLE_CIRCUMFERENCE;
  holdProgressCircle.style.strokeDashoffset = offset;
}

function startHold(e) {
  if (e.type === 'touchstart') {
    // Không chặn cuộn trừ khi nhấn trực tiếp vào nút
  }
  
  holdTarget.classList.add('holding');
  holdStartTime = performance.now();
  holdHint.textContent = "Đang mở quà, hãy giữ yên nhé... 💖";
  holdHint.style.color = "#ff758c";

  // Thử phát nhạc khi tương tác lần đầu
  playMusic();

  // Tạo hiệu ứng sóng chạm
  createTouchSparkle(e);

  function step(currentTime) {
    const elapsed = currentTime - holdStartTime;
    const progress = Math.min((elapsed / HOLD_DURATION) * 100, 100);
    setHoldProgress(progress);

    if (progress < 100) {
      holdAnimFrame = requestAnimationFrame(step);
    } else {
      // Đạt 100% -> Thành công!
      finishHoldSuccess();
    }
  }

  cancelAnimationFrame(holdAnimFrame);
  holdAnimFrame = requestAnimationFrame(step);
}

function cancelHold() {
  holdTarget.classList.remove('holding');
  cancelAnimationFrame(holdAnimFrame);
  setHoldProgress(0);
  holdHint.textContent = "Chạm và giữ lâu để mở quà ✨";
  holdHint.style.color = "rgba(255, 230, 240, 0.85)";
}

function finishHoldSuccess() {
  cancelHold();

  // Rung phản hồi haptic nếu thiết bị hỗ trợ
  if (navigator.vibrate) {
    navigator.vibrate([60, 50, 100]);
  }

  // Bắn chùm hạt tim chúc mừng
  createExplosionHearts();

  // Chuyển sang màn hình chữ bay
  setTimeout(() => {
    switchScene('flying');
  }, 350);
}

// Bắt sự kiện Touch (Điện thoại) & Mouse (Máy tính)
holdTarget.addEventListener('touchstart', startHold, { passive: true });
holdTarget.addEventListener('touchend', cancelHold);
holdTarget.addEventListener('touchcancel', cancelHold);

holdTarget.addEventListener('mousedown', startHold);
window.addEventListener('mouseup', cancelHold);


// ==========================================================
// 6. GIAO DIỆN CHỮ BAY ĐỘNG & ẢNH KỶ NIỆM (SCENE 2)
// ==========================================================
let flyingInterval = null;
let flyingTimer = null;
let flyingProgressInterval = null;
let isFlyingActive = false;

const flyingStage = document.getElementById('flying-elements-stage');
const flyingTimelineFill = document.getElementById('flying-timeline-fill');

function startFlyingScene() {
  isFlyingActive = true;
  flyingStage.innerHTML = '';
  flyingTimelineFill.style.width = '0%';

  const durationSec = Math.max(5, appConfig.flyingDuration || 12);
  const startTime = Date.now();

  // Cập nhật thanh timeline
  clearInterval(flyingProgressInterval);
  flyingProgressInterval = setInterval(() => {
    const elapsed = (Date.now() - startTime) / 1000;
    const pct = Math.min((elapsed / durationSec) * 100, 100);
    flyingTimelineFill.style.width = pct + '%';
  }, 100);

  // Sinh liên tục câu chữ neon và ảnh bay
  clearInterval(flyingInterval);
  spawnRandomFlyingElement(); // Sinh ngay đợt đầu
  flyingInterval = setInterval(() => {
    if (isFlyingActive) {
      spawnRandomFlyingElement();
    }
  }, 500);

  // Tự động kết thúc sau durationSec và chuyển sang phong thư
  clearTimeout(flyingTimer);
  flyingTimer = setTimeout(() => {
    if (isFlyingActive) {
      switchScene('envelope');
    }
  }, durationSec * 1000);
}

function stopFlyingScene() {
  isFlyingActive = false;
  clearInterval(flyingInterval);
  clearInterval(flyingProgressInterval);
  clearTimeout(flyingTimer);
}

// Nút xem thiệp ngay (bỏ qua hiệu ứng bay)
btnSkipFlying.addEventListener('click', () => {
  switchScene('envelope');
});

// Hàm sinh phần tử ngẫu nhiên: Chữ neon, Ảnh kỷ niệm, Trái tim
function spawnRandomFlyingElement() {
  const activePhotos = getActiveFlyingPhotos();
  const randType = Math.random();

  // Chỉ cho ảnh kỷ niệm xuất hiện khi người dùng ĐÃ có ảnh thật tải lên (không bao giờ lấy ảnh mẫu rỗng)
  if (activePhotos.length > 0 && randType < 0.35) {
    spawnFlyingMemoryPhoto(activePhotos);
  } 
  // 55% xác suất ra chữ neon phát sáng
  else if (randType < 0.90) {
    spawnFlyingNeonText();
  } 
  // 10% ra trái tim phát sáng
  else {
    spawnFlyingGlowHeart();
  }
}

function spawnFlyingNeonText() {
  const messages = appConfig.flyingMessages;
  if (!messages || messages.length === 0) return;

  const msg = messages[Math.floor(Math.random() * messages.length)];
  const el = document.createElement('div');
  el.className = 'flying-neon-text';

  // Random kích thước
  const sizes = ['size-sm', 'size-md', 'size-lg', 'size-xl'];
  const sizeClass = sizes[Math.floor(Math.random() * sizes.length)];
  el.classList.add(sizeClass);

  // Random vị trí ngang (10% đến 80%)
  const posX = Math.random() * 70 + 5;
  el.style.left = posX + '%';

  // Thời gian bay 6s - 10s
  const dur = (Math.random() * 3 + 6.5).toFixed(1);
  el.style.animationDuration = `${dur}s`;

  el.textContent = msg;
  flyingStage.appendChild(el);

  el.addEventListener('animationend', () => el.remove());
}

function spawnFlyingMemoryPhoto(pool) {
  const photos = (pool && pool.length > 0) ? pool : getActiveFlyingPhotos();
  if (!photos || photos.length === 0) return;

  const photoUrl = photos[Math.floor(Math.random() * photos.length)];
  if (!photoUrl || typeof photoUrl !== 'string' || photoUrl.startsWith('data:image/svg+xml')) return;

  const card = document.createElement('div');
  card.className = 'flying-memory-card';

  const rot = (Math.random() * 24 - 12).toFixed(1);
  card.style.setProperty('--rot', `${rot}deg`);

  const posX = Math.random() * 65 + 10;
  card.style.left = posX + '%';

  const dur = (Math.random() * 3 + 7).toFixed(1);
  card.style.animationDuration = `${dur}s`;

  // Tạo DOM element img an toàn, tuyệt đối không chèn trực tiếp chuỗi vào innerHTML
  const img = document.createElement('img');
  img.alt = 'Kỷ niệm No';
  img.src = photoUrl;
  img.onerror = () => {
    // Tự hủy thẻ ngay lập tức nếu ảnh lỗi, không để lại khung trắng hay vết icon hỏng
    card.remove();
  };

  card.appendChild(img);
  flyingStage.appendChild(card);

  card.addEventListener('animationend', () => card.remove());
}

function spawnFlyingGlowHeart() {
  const heart = document.createElement('div');
  heart.className = 'flying-glow-heart';
  heart.textContent = Math.random() > 0.3 ? '💖' : '💕';

  const posX = Math.random() * 85 + 5;
  heart.style.left = posX + '%';

  const dur = (Math.random() * 2 + 5).toFixed(1);
  heart.style.animationDuration = `${dur}s`;

  flyingStage.appendChild(heart);
  heart.addEventListener('animationend', () => heart.remove());
}


// ==========================================================
// 7. PHONG THƯ & MỞ THIỆP (SCENE 3 & 4)
// ==========================================================
envelopeWrapper.addEventListener('click', openEnvelope);

function openEnvelope() {
  if (envelopeWrapper.classList.contains('opening')) return;

  envelopeWrapper.classList.add('opening');

  // Rung phản hồi haptic
  if (navigator.vibrate) navigator.vibrate(50);

  // Âm thanh bắn tơ nhện (Web-shot THWIP synthesizer)
  playWebShootSound();

  // Hiệu ứng bộc phá tơ nhện & tia lửa khi phá con dấu
  createSealBurst(waxSeal);

  // Sau khi nắp mở (700ms), trượt thư lên và chuyển sang scene letter
  setTimeout(() => {
    switchScene('letter');
  }, 750);
}

// Nút xem lại từ đầu
btnReplay.addEventListener('click', () => {
  switchScene('bouquet');
});

// Nút chia sẻ ở cuối thư
btnShareTrigger.addEventListener('click', () => {
  openGuideModal();
});


// ==========================================================
// 8. CANVAS BỤI SAO & HẠT LÃNG MẠN (CANVAS ENGINE)
// ==========================================================
const ambientCanvas = document.getElementById('ambient-canvas');
const ctxAmbient = ambientCanvas.getContext('2d');
let stars = [];

function resizeCanvas() {
  ambientCanvas.width = window.innerWidth;
  ambientCanvas.height = window.innerHeight;
  initStars();
}
window.addEventListener('resize', resizeCanvas);

function initStars() {
  stars = [];
  const count = Math.floor((window.innerWidth * window.innerHeight) / 9000);
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * ambientCanvas.width,
      y: Math.random() * ambientCanvas.height,
      radius: Math.random() * 1.6 + 0.4,
      alpha: Math.random(),
      speed: Math.random() * 0.02 + 0.005,
      hue: Math.random() > 0.4 ? 340 : 50 // Hồng phấn hoặc vàng kim
    });
  }
}

function animateStars() {
  ctxAmbient.clearRect(0, 0, ambientCanvas.width, ambientCanvas.height);

  for (let star of stars) {
    star.alpha += star.speed;
    if (star.alpha > 1 || star.alpha < 0.1) {
      star.speed = -star.speed;
    }

    ctxAmbient.beginPath();
    ctxAmbient.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctxAmbient.fillStyle = `hsla(${star.hue}, 80%, 75%, ${Math.abs(star.alpha)})`;
    ctxAmbient.shadowBlur = 8;
    ctxAmbient.shadowColor = `hsla(${star.hue}, 80%, 65%, 0.6)`;
    ctxAmbient.fill();
  }

  requestAnimationFrame(animateStars);
}

resizeCanvas();
animateStars();


// ==========================================================
// 9. CÁC HIỆU ỨNG TƯƠNG TÁC (SPARKLES & HEARTS)
// ==========================================================
function createTouchSparkle(e) {
  const touch = e.touches ? e.touches[0] : e;
  const rect = holdTarget.getBoundingClientRect();
  const x = (touch.clientX || (rect.left + rect.width / 2));
  const y = (touch.clientY || (rect.top + rect.height / 2));

  const ripple = document.createElement('div');
  ripple.className = 'touch-ripple';
  ripple.style.left = `${x - 40}px`;
  ripple.style.top = `${y - 40}px`;
  ripple.style.width = '80px';
  ripple.style.height = '80px';
  document.body.appendChild(ripple);

  setTimeout(() => ripple.remove(), 600);
}

function createExplosionHearts() {
  const rect = holdTarget.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;

  for (let i = 0; i < 22; i++) {
    const el = document.createElement('div');
    el.textContent = ['💖', '🌸', '✨', '💕', '🌷'][Math.floor(Math.random() * 5)];
    el.style.position = 'fixed';
    el.style.left = `${cx}px`;
    el.style.top = `${cy}px`;
    el.style.fontSize = `${Math.random() * 16 + 18}px`;
    el.style.pointerEvents = 'none';
    el.style.zIndex = '999';
    el.style.transition = 'all 0.8s cubic-bezier(0.1, 0.8, 0.2, 1)';
    document.body.appendChild(el);

    const angle = (i / 22) * Math.PI * 2 + (Math.random() * 0.4);
    const dist = Math.random() * 160 + 80;
    const tx = Math.cos(angle) * dist;
    const ty = Math.sin(angle) * dist - 40;

    requestAnimationFrame(() => {
      el.style.transform = `translate(${tx}px, ${ty}px) scale(0)`;
      el.style.opacity = '0';
    });

    setTimeout(() => el.remove(), 850);
  }
}

function createSealBurst(target) {
  const rect = target.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;

  // 1. Bắn các mảnh tơ nhện & tia chớp comic
  const spideySymbols = ['🕸️', '⚡', '🕷️', '💥', '✨'];
  for (let i = 0; i < 10; i++) {
    const icon = document.createElement('div');
    icon.textContent = spideySymbols[Math.floor(Math.random() * spideySymbols.length)];
    icon.style.position = 'fixed';
    icon.style.left = `${cx}px`;
    icon.style.top = `${cy}px`;
    icon.style.fontSize = `${Math.random() * 10 + 16}px`;
    icon.style.zIndex = '999';
    icon.style.pointerEvents = 'none';
    icon.style.transition = 'all 0.65s cubic-bezier(0.1, 0.9, 0.2, 1)';
    document.body.appendChild(icon);

    const angle = (i / 10) * Math.PI * 2 + Math.random() * 0.3;
    const dist = Math.random() * 80 + 40;
    const tx = Math.cos(angle) * dist;
    const ty = Math.sin(angle) * dist;

    requestAnimationFrame(() => {
      icon.style.transform = `translate(${tx}px, ${ty}px) scale(0)`;
      icon.style.opacity = '0';
    });

    setTimeout(() => icon.remove(), 700);
  }

  // 2. Tia lửa đỏ & xanh Spider-Man
  for (let i = 0; i < 22; i++) {
    const spark = document.createElement('div');
    spark.style.position = 'fixed';
    spark.style.left = `${cx}px`;
    spark.style.top = `${cy}px`;
    spark.style.width = '6px';
    spark.style.height = '6px';
    spark.style.borderRadius = '50%';
    const isRed = Math.random() > 0.35;
    spark.style.background = isRed ? '#e62429' : '#00d2ff';
    spark.style.boxShadow = isRed ? '0 0 12px #ff2a40' : '0 0 12px #00f0ff';
    spark.style.zIndex = '999';
    spark.style.pointerEvents = 'none';
    spark.style.transition = 'all 0.6s cubic-bezier(0.1, 0.8, 0.2, 1)';
    document.body.appendChild(spark);

    const angle = Math.random() * Math.PI * 2;
    const dist = Math.random() * 95 + 30;
    const tx = Math.cos(angle) * dist;
    const ty = Math.sin(angle) * dist;

    requestAnimationFrame(() => {
      spark.style.transform = `translate(${tx}px, ${ty}px) scale(0)`;
      spark.style.opacity = '0';
    });

    setTimeout(() => spark.remove(), 650);
  }
}

function createFallingSpiderSparks() {
  const container = scenes.letter;
  const items = ['🕸️', '⚡', '✨', '🕷️'];
  for (let i = 0; i < 14; i++) {
    const spark = document.createElement('div');
    spark.textContent = items[Math.floor(Math.random() * items.length)];
    spark.style.position = 'absolute';
    spark.style.top = '-30px';
    spark.style.left = `${Math.random() * 95}%`;
    spark.style.fontSize = `${Math.random() * 12 + 12}px`;
    spark.style.opacity = '0.7';
    spark.style.pointerEvents = 'none';
    spark.style.zIndex = '5';
    spark.style.transition = `transform ${Math.random() * 3 + 4}s linear, opacity 1s`;
    container.appendChild(spark);

    setTimeout(() => {
      spark.style.transform = `translate(${Math.random() * 60 - 30}px, ${window.innerHeight + 50}px) rotate(${Math.random() * 360}deg)`;
    }, 50);

    setTimeout(() => spark.remove(), 7000);
  }
}

// Âm thanh bắn tơ nhện tổng hợp Web Audio (THWIP!)
function playWebShootSound() {
  try {
    initAudioContext();
    if (!audioCtx) return;
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const now = audioCtx.currentTime;
    // Tạo xung nhiễu trắng (white noise) với dải lọc bandpass lướt nhanh
    const bufferSize = Math.floor(audioCtx.sampleRate * 0.16);
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noiseSource = audioCtx.createBufferSource();
    noiseSource.buffer = buffer;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(3600, now);
    filter.frequency.exponentialRampToValueAtTime(700, now + 0.15);
    filter.Q.setValueAtTime(4, now);

    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

    noiseSource.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);

    noiseSource.start(now);
    noiseSource.stop(now + 0.16);
  } catch (err) {
    console.warn("Audio synth web sound:", err);
  }
}


// ==========================================================
// 10. BỘ MÃ HÓA ÂM NHẠC & SYNTHESIZER (AUDIO ENGINE)
// Tự phát giai điệu Piano lãng mạn 100% không cần tải file nhạc!
// ==========================================================
let audioCtx = null;
let synthTimer = null;
let isAudioPlaying = false;

// Nốt giai điệu Romantic Piano (Tần số Hz)
const PIANO_NOTES = [
  261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, // C4 - B4
  523.25, 587.33, 659.25, 698.46, 783.99, 880.00          // C5 - A5
];
const CHORD_PROGRESSION = [
  [523.25, 659.25, 783.99, 987.77], // Cmaj7
  [440.00, 523.25, 659.25, 783.99], // Am7
  [349.23, 440.00, 523.25, 659.25], // Fmaj7
  [392.00, 493.88, 587.33, 783.99]  // G7
];

function initAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
}

function playPianoNote(freq, duration = 1.8, delay = 0) {
  if (!audioCtx || audioCtx.state === 'suspended') return;

  const now = audioCtx.currentTime + delay;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(freq, now);

  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.08, now + 0.04);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start(now);
  osc.stop(now + duration);
}

function startProceduralPiano() {
  initAudioContext();
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  let step = 0;
  clearInterval(synthTimer);

  synthTimer = setInterval(() => {
    if (!isAudioPlaying) return;

    const chordIndex = Math.floor(step / 4) % CHORD_PROGRESSION.length;
    const chord = CHORD_PROGRESSION[chordIndex];

    // Đánh arpeggio nhẹ nhàng
    chord.forEach((note, idx) => {
      playPianoNote(note, 2.2, idx * 0.28);
    });

    step++;
  }, 1400);
}

function stopProceduralPiano() {
  clearInterval(synthTimer);
}

function playMusic() {
  if (isAudioPlaying) return;

  initAudioContext();
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  if (appConfig.musicMode === 'custom-url' && appConfig.musicUrl) {
    bgAudio.src = appConfig.musicUrl;
    bgAudio.play().then(() => {
      isAudioPlaying = true;
      btnMusic.classList.add('playing');
    }).catch(() => {
      // Nếu link lỗi, fallback sang piano synth
      startProceduralPiano();
      isAudioPlaying = true;
      btnMusic.classList.add('playing');
    });
  } else {
    // Mặc định: Piano Synth êm ái
    startProceduralPiano();
    isAudioPlaying = true;
    btnMusic.classList.add('playing');
  }
}

function pauseMusic() {
  isAudioPlaying = false;
  btnMusic.classList.remove('playing');
  stopProceduralPiano();
  bgAudio.pause();
}

btnMusic.addEventListener('click', () => {
  if (isAudioPlaying) {
    pauseMusic();
  } else {
    playMusic();
  }
});


// ==========================================================
// 11. ĐỔI CHẾ ĐỘ XEM (PHONE MOCKUP / TOÀN MÀN HÌNH)
// ==========================================================
let isPhoneMockup = false;
btnViewMode.addEventListener('click', () => {
  isPhoneMockup = !isPhoneMockup;
  if (isPhoneMockup) {
    document.body.classList.add('view-phone-mockup');
    document.body.classList.remove('view-fullscreen');
    viewmodeIcon.textContent = '🖥️';
    btnViewMode.title = 'Chuyển sang Toàn màn hình';
  } else {
    document.body.classList.remove('view-phone-mockup');
    document.body.classList.add('view-fullscreen');
    viewmodeIcon.textContent = '📱';
    btnViewMode.title = 'Chuyển sang Khung điện thoại';
  }
});


// ==========================================================
// 12. BẢNG CHỈNH SỬA (EDITOR DRAWER & FILE LOADER)
// ==========================================================
btnEdit.addEventListener('click', () => {
  populateEditorInputs();
  editorModal.classList.add('open');
});

btnCloseEditor.addEventListener('click', () => {
  editorModal.classList.remove('open');
});

if (btnGuide) btnGuide.addEventListener('click', openGuideModal);
btnCloseGuide.addEventListener('click', () => {
  guideModal.classList.remove('open');
});

function openGuideModal() {
  guideModal.classList.add('open');
}

// Chuyển Tab trong Editor
const tabBtns = document.querySelectorAll('.editor-tabs .tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    tabBtns.forEach(b => b.classList.remove('active'));
    tabContents.forEach(c => c.classList.remove('active'));

    btn.classList.add('active');
    const target = btn.getAttribute('data-tab');
    const activeContent = document.getElementById(target);
    if (activeContent) activeContent.classList.add('active');
  });
});

// Điền dữ liệu hiện tại vào form
function populateEditorInputs() {
  // Ảnh bó hoa
  for (let i = 0; i < 6; i++) {
    const prev = document.getElementById(`edit-prev-${i}`);
    if (prev && appConfig.bouquetPhotos[i]) {
      prev.src = appConfig.bouquetPhotos[i];
    }
  }

  document.getElementById('edit-bouquet-quote').value = appConfig.bouquetQuote;
  document.getElementById('edit-flying-messages').value = appConfig.flyingMessages.join('\n');
  document.getElementById('edit-flying-duration').value = appConfig.flyingDuration || 12;

  document.getElementById('edit-letter-greeting').value = appConfig.letterGreeting;
  document.getElementById('edit-letter-body').value = appConfig.letterBody;
  document.getElementById('edit-letter-signature').value = appConfig.letterSignature;

  const prevCouple = document.getElementById('edit-prev-couple');
  if (prevCouple && appConfig.couplePhoto) {
    prevCouple.src = appConfig.couplePhoto;
  }

  // Cập nhật xem trước 3 ảnh dải phim
  const filmPhotos = (appConfig.filmstripPhotos && appConfig.filmstripPhotos.length >= 3)
    ? appConfig.filmstripPhotos
    : [appConfig.bouquetPhotos[0], appConfig.bouquetPhotos[1], appConfig.bouquetPhotos[2]];

  for (let i = 0; i < 3; i++) {
    const editFilmPrev = document.getElementById(`edit-prev-film-${i}`);
    if (editFilmPrev && filmPhotos[i]) {
      editFilmPrev.src = filmPhotos[i];
    }
  }

  // Render danh sách ảnh kỷ niệm
  renderMemoryThumbs();
}

function renderMemoryThumbs() {
  const container = document.getElementById('memory-photos-preview-list');
  if (!container) return;
  container.innerHTML = '';

  const active = getActiveFlyingPhotos();
  if (active.length === 0) {
    container.innerHTML = '<p class="field-hint" style="font-size: 13px; color: #888; margin-top: 6px;">(Chưa có ảnh tải lên. Bạn có thể thêm ảnh tại đây hoặc tải ở Tab Bó Hoa / Bức Thư, hệ thống sẽ tự động đồng bộ ảnh bay)</p>';
    return;
  }

  active.forEach((src, idx) => {
    const thumb = document.createElement('div');
    thumb.className = 'preview-thumb';
    const img = document.createElement('img');
    img.src = src;
    img.alt = `Ảnh ${idx + 1}`;
    thumb.appendChild(img);
    container.appendChild(thumb);
  });
}

// Xử lý nén ảnh tối ưu để không bị nặng trình duyệt
function compressImage(file, maxWidth = 800, quality = 0.85) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
}

// Bắt sự kiện tải ảnh cho từng bông hoa trong 6 bông
const photoInputs = document.querySelectorAll('.photo-input');
photoInputs.forEach(input => {
  input.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const slotIndex = parseInt(input.getAttribute('data-target'), 10);
    try {
      const compressedDataUrl = await compressImage(file, 600, 0.85);
      appConfig.bouquetPhotos[slotIndex] = compressedDataUrl;

      // Cập nhật xem trước trong modal
      const previewImg = document.getElementById(`edit-prev-${slotIndex}`);
      if (previewImg) previewImg.src = compressedDataUrl;

      // Cập nhật ngay trên bó hoa chính
      renderUI();

      // Tự động đồng bộ ngay sang danh sách ảnh bay kỷ niệm
      syncMemoryPhotosWithUserUploads();

      // Tự động lưu bản nháp vào LocalStorage
      saveToLocalStorage();
    } catch (err) {
      alert('Không thể đọc file ảnh, bạn hãy thử lại với ảnh khác nhé!');
    }
  });
});

// Tải thêm ảnh kỷ niệm cho hiệu ứng bay
const memoryInput = document.getElementById('edit-flying-photos-input');
if (memoryInput) {
  memoryInput.addEventListener('change', async (e) => {
    const files = Array.from(e.target.files);
    for (const f of files) {
      try {
        const compressed = await compressImage(f, 600, 0.85);
        if (!appConfig.memoryPhotos) appConfig.memoryPhotos = [];
        appConfig.memoryPhotos.push(compressed);
      } catch (err) {}
    }
    syncMemoryPhotosWithUserUploads();
    renderMemoryThumbs();
    saveToLocalStorage();
  });
}

// Đổi ảnh cặp đôi
const coupleInput = document.getElementById('edit-couple-input');
if (coupleInput) {
  coupleInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const compressed = await compressImage(file, 800, 0.85);
      appConfig.couplePhoto = compressed;
      document.getElementById('edit-prev-couple').src = compressed;
      syncMemoryPhotosWithUserUploads();
      renderUI();
      saveToLocalStorage();
    } catch (err) {}
  });
}

// Đổi 3 ảnh cho dải phim Photobooth
const filmInputs = document.querySelectorAll('.film-input');
filmInputs.forEach(input => {
  input.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const filmIdx = parseInt(input.getAttribute('data-film'), 10);
    try {
      const compressed = await compressImage(file, 600, 0.85);
      if (!appConfig.filmstripPhotos || appConfig.filmstripPhotos.length < 3) {
        appConfig.filmstripPhotos = [
          appConfig.bouquetPhotos[0],
          appConfig.bouquetPhotos[1],
          appConfig.bouquetPhotos[2]
        ];
      }
      appConfig.filmstripPhotos[filmIdx] = compressed;
      syncMemoryPhotosWithUserUploads();
      renderUI();
      saveToLocalStorage();
    } catch (err) {
      console.warn('Lỗi tải ảnh phim:', err);
    }
  });
});

// Chọn loại nhạc
const musicSelect = document.getElementById('edit-music-select');
const groupCustomUrl = document.getElementById('group-custom-url');
const groupUploadMp3 = document.getElementById('group-upload-mp3');

musicSelect.addEventListener('change', () => {
  appConfig.musicMode = musicSelect.value;
  groupCustomUrl.classList.toggle('hidden', musicSelect.value !== 'custom-url');
  groupUploadMp3.classList.toggle('hidden', musicSelect.value !== 'upload');
});

// Nút nghe thử âm thanh
document.getElementById('btn-test-audio').addEventListener('click', () => {
  if (isAudioPlaying) {
    pauseMusic();
  } else {
    playMusic();
  }
});

// Nút Lưu thay đổi vào Trình duyệt (LocalStorage)
document.getElementById('btn-save-draft').addEventListener('click', () => {
  // Đọc các giá trị text
  appConfig.bouquetQuote = document.getElementById('edit-bouquet-quote').value;
  
  const rawMsgs = document.getElementById('edit-flying-messages').value.split('\n');
  appConfig.flyingMessages = rawMsgs.map(s => s.trim()).filter(s => s.length > 0);
  
  appConfig.flyingDuration = parseInt(document.getElementById('edit-flying-duration').value, 10) || 12;

  appConfig.letterGreeting = document.getElementById('edit-letter-greeting').value;
  appConfig.letterBody = document.getElementById('edit-letter-body').value;
  appConfig.letterSignature = document.getElementById('edit-letter-signature').value;

  // Đồng bộ ảnh bay trước khi lưu
  syncMemoryPhotosWithUserUploads();

  try {
    saveToLocalStorage();
    renderUI();
    alert('Đã lưu thành công! Bạn có thể xem ngay trang web.');
    editorModal.classList.remove('open');
  } catch (err) {
    alert('Dung lượng ảnh hơi lớn so với bộ nhớ tạm. Bạn nên bấm nút "Tải File Web Hoàn Chỉnh" để lưu trữ an toàn nhé!');
  }
});

// Nút Khôi phục mặc định
document.getElementById('btn-reset-default').addEventListener('click', () => {
  if (confirm('Bạn có chắc muốn khôi phục về cấu hình gốc ban đầu?')) {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('flower_gift_config_spider_v1');
    localStorage.removeItem('flower_gift_config_v4');
    localStorage.removeItem('flower_gift_config_v3');
    localStorage.removeItem('flower_gift_config_v2');
    appConfig = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
    appConfig.memoryPhotos = [];
    renderUI();
    populateEditorInputs();
    alert('Đã khôi phục mặc định!');
  }
});


// ==========================================================
// 13. TÍNH NĂNG XUẤT CẤU HÌNH (ZERO FETCH - 100% AN TOÀN TRÊN FILE://)
// Hoạt động 100% trên cả file:/// không bao giờ bị lỗi Failed to fetch
// ==========================================================
function executeDownloadConfigFile() {
  // Cập nhật text mới nhất trước khi tải
  appConfig.bouquetQuote = document.getElementById('edit-bouquet-quote').value;
  const rawMsgs = document.getElementById('edit-flying-messages').value.split('\n');
  appConfig.flyingMessages = rawMsgs.map(s => s.trim()).filter(s => s.length > 0);
  appConfig.flyingDuration = parseInt(document.getElementById('edit-flying-duration').value, 10) || 12;
  appConfig.letterGreeting = document.getElementById('edit-letter-greeting').value;
  appConfig.letterBody = document.getElementById('edit-letter-body').value;
  appConfig.letterSignature = document.getElementById('edit-letter-signature').value;

  // Đồng bộ ảnh kỷ niệm bay trước khi đóng gói file
  syncMemoryPhotosWithUserUploads();
  saveToLocalStorage();

  try {
    const fileContent = '/**\n * CẤU HÌNH NGƯỜI DÙNG - SPIDER-MAN GIFT WEB\n * Tự động tạo và nhúng sẵn 100% ảnh, lời chúc và thiết lập của bạn.\n */\nconst USER_SAVED_CONFIG = ' + JSON.stringify(appConfig, null, 2) + ';\n';
    const blob = new Blob([fileContent], { type: 'application/javascript;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'config.js';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    alert('🎉 ĐÃ TẢI FILE [config.js] THÀNH CÔNG!\n\nFile này đã chứa toàn bộ ảnh và lời chúc của bạn.\nBạn chỉ cần lưu/kéo đè file config.js này vào thư mục dự án flower-gift-web, rồi chạy git push lên GitHub là Vercel sẽ tự động hiển thị đầy đủ cho người nhận!');
  } catch (err) {
    console.error('Lỗi xuất file config.js:', err);
    alert('Không thể tạo file tự động: ' + err.message);
  }
}

function executeCopyConfig() {
  appConfig.bouquetQuote = document.getElementById('edit-bouquet-quote').value;
  const rawMsgs = document.getElementById('edit-flying-messages').value.split('\n');
  appConfig.flyingMessages = rawMsgs.map(s => s.trim()).filter(s => s.length > 0);
  appConfig.flyingDuration = parseInt(document.getElementById('edit-flying-duration').value, 10) || 12;
  appConfig.letterGreeting = document.getElementById('edit-letter-greeting').value;
  appConfig.letterBody = document.getElementById('edit-letter-body').value;
  appConfig.letterSignature = document.getElementById('edit-letter-signature').value;
  syncMemoryPhotosWithUserUploads();
  saveToLocalStorage();

  const fileContent = 'const USER_SAVED_CONFIG = ' + JSON.stringify(appConfig, null, 2) + ';\n';
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(fileContent).then(() => {
      alert('📋 Đã sao chép toàn bộ mã cấu hình kèm ảnh vào bộ nhớ tạm!\nBạn có thể dán (Ctrl+V) vào file config.js trong thư mục dự án.');
    }).catch(() => fallbackCopy(fileContent));
  } else {
    fallbackCopy(fileContent);
  }
}

function fallbackCopy(text) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.left = '-9999px';
  document.body.appendChild(ta);
  ta.select();
  document.execCommand('copy');
  document.body.removeChild(ta);
  alert('📋 Đã sao chép toàn bộ mã cấu hình kèm ảnh vào bộ nhớ tạm!\nBạn có thể dán (Ctrl+V) vào file config.js trong thư mục dự án.');
}

// Gắn sự kiện cho các nút tải config (hỗ trợ cả ID mới và ID cũ)
const btnDlConfig = document.getElementById('btn-download-config');
const btnDlConfigFooter = document.getElementById('btn-download-config-footer');
const btnDlConfigHeader = document.getElementById('btn-download-config-header');
const btnCopyConfig = document.getElementById('btn-copy-config');

const btnOldDlHtml = document.getElementById('btn-download-html');
const btnOldDlFooter = document.getElementById('btn-download-html-footer');
const btnOldDlHeader = document.getElementById('btn-download-html-header');
const btnOldDlScript = document.getElementById('btn-download-script-js');

[btnDlConfig, btnDlConfigFooter, btnDlConfigHeader, btnOldDlHtml, btnOldDlFooter, btnOldDlHeader, btnOldDlScript].forEach(btn => {
  if (btn) btn.addEventListener('click', executeDownloadConfigFile);
});

if (btnCopyConfig) btnCopyConfig.addEventListener('click', executeCopyConfig);
