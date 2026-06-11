/**
 * ECHOES://FEED — Cyberpunk Social Terminal
 * Powered by Vanilla JS & LocalStorage
 */

// ==========================================================================
// GOOGLE IDENTITY SERVICES (GIS) CONFIGURATION
// ==========================================================================
//
// 📌 申請 Google Client ID 步驟：
//   1. 前往 Google Cloud Console: https://console.cloud.google.com/
//   2. 建立或選擇一個專案。
//   3. 左側選單 → 「API 和服務」→「憑證」。
//   4. 點擊「建立憑證」→「OAuth 2.0 用戶端 ID」。
//   5. 應用程式類型選「網頁應用程式」。
//   6. 在「已授權的 JavaScript 來源」加入你的網站網域 (例如 https://yourdomain.com)
//      若要在本地端測試，加入 http://localhost 或使用 Live Server (http://127.0.0.1:5500)。
//   7. 建立完成後，複製「用戶端 ID」字串貼到下方。
//
// ⚠️ 重要：GIS 無法在 file:// 協定下運作，請使用 http:// 本地伺服器測試。
//
const GOOGLE_CLIENT_ID = '472134617764-hv4va5tt8adg5gid1ibsd8bcuq123dj8.apps.googleusercontent.com';

// ==========================================================================
// PRESET GRADIENTS — CYBERPUNK NEON PALETTE
// ==========================================================================
const PRESET_GRADIENTS = [
  "linear-gradient(135deg, #181f2a 0%, #1ea34d 50%, #4ade80 100%)", // Aurora Fade
  "linear-gradient(135deg, #181f2a 0%, #38bdf8 100%)",              // Cyber Sky
  "linear-gradient(135deg, #181f2a 0%, #f472b6 100%)",              // Cyber Lavender
  "linear-gradient(135deg, #1a222f 0%, #fbbf24 100%)",              // Amber Horizon
  "linear-gradient(135deg, #4ade80 0%, #38bdf8 100%)",              // Mint-Cyan Flux
  "linear-gradient(135deg, #f87171 0%, #f472b6 100%)"               // Soft Rose Glitch
];

// ==========================================================================
// PRESET AVATARS FOR PROFILE SETUP MODAL
// ==========================================================================
const PRESET_AVATARS = [
  { id: "av1", label: "🌌", bg: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)", letter: "∞" },
  { id: "av2", label: "🌿", bg: "linear-gradient(135deg, #0d2137 0%, #1ea34d 100%)", letter: "◈" },
  { id: "av3", label: "🔮", bg: "linear-gradient(135deg, #2d1b5e 0%, #9b59b6 100%)", letter: "⬡" },
  { id: "av4", label: "🌸", bg: "linear-gradient(135deg, #1f0a1f 0%, #f472b6 100%)", letter: "❋" },
  { id: "av5", label: "⚡", bg: "linear-gradient(135deg, #1a1200 0%, #fbbf24 100%)", letter: "△" },
  { id: "av6", label: "🌊", bg: "linear-gradient(135deg, #071e3d 0%, #38bdf8 100%)", letter: "≋" },
  { id: "av7", label: "🔥", bg: "linear-gradient(135deg, #2d0a00 0%, #ef4444 100%)", letter: "✦" },
  { id: "av8", label: "🐉", bg: "linear-gradient(135deg, #0a2e1a 0%, #34d399 100%)", letter: "龍" }
];


// ==========================================================================
// DEFAULT POSTS DATA
// ==========================================================================
const DEFAULT_POSTS = [
  {
    id: "def-post-1",
    author: "GHOST_RUNNER",
    handle: "@ghost_r",
    avatarLetter: "GR",
    date: "2h ago",
    category: "Productivity",
    privacy: "public",
    image: null,
    content: "建構你的極簡工作流 // KILL ALL NOISE\n\n- 關閉所有非必要推播通知\n- 單一資料來源：一個筆記庫統治一切\n- 時間區塊鎖定：一次只做一件事\n\n> 簡約是細緻的極致。 — Leonardo da Vinci\n\n你的專注力就是你的算力。別讓它被垃圾程序吞噬。",
    gradient: "linear-gradient(135deg, #181f2a 0%, #1ea34d 50%, #4ade80 100%)",
    likes: 42,
    likedByUser: false,
    comments: [
      { id: "c1", author: "NULL_PTR", text: "自從把手機通知全砍了，每天多出兩個小時的 deep work。", time: "1h ago" },
      { id: "c2", author: "K3N_D3V", text: "Obsidian + 番茄鐘。唯一需要的兩個工具。", time: "45min ago" }
    ],
    isDefault: true
  },
  {
    id: "def-post-2",
    author: "NEON_CODER",
    handle: "@neon_dev",
    avatarLetter: "NC",
    date: "5h ago",
    category: "Tech",
    privacy: "public",
    image: null,
    content: "CSS Variables 是被嚴重低估的超能力。\n\n它們是動態的，存在於 Runtime。深色/淺色主題切換？幾行搞定：\n\n```css\n:root { --bg: #050505; --neon: #39ff14; }\nhtml[data-theme=\"light\"] { --bg: #e8e8e8; --neon: #00aa00; }\n```\n\n這個終端的賽博朋克配色就是用這個原理打造的。沒有預處理器，沒有框架，純粹的原生力量。",
    gradient: "linear-gradient(135deg, #181f2a 0%, #38bdf8 100%)",
    likes: 128,
    likedByUser: false,
    comments: [
      { id: "c3", author: "ZERO_DAY", text: "原生變數 > Sass 變數。Runtime > Compile-time。真理。", time: "3h ago" }
    ],
    isDefault: true
  },
  {
    id: "def-post-3",
    author: "SIGNAL_LOST",
    handle: "@sig_lost",
    avatarLetter: "SL",
    date: "1d ago",
    category: "Life",
    privacy: "public",
    image: null,
    content: "物質與資訊過載時，你的心靈也會 BUFFER OVERFLOW。\n\n我的減法協議：\n\n- 物理層：清空半年沒碰的雜物\n- 資訊層：退訂製造焦慮的社群追蹤\n- 社交層：溫柔地拒絕無意義的 handshake\n\n> 擁有得越少，你所擁有的就越有價值。\n\n執行 `rm -rf /noise/*` 然後你會發現，核心服務終於能正常運行了。",
    gradient: null,
    likes: 95,
    likedByUser: false,
    comments: [
      { id: "c4", author: "EVA_X", text: "資訊減法好難，但真的很需要 garbage collection。", time: "12h ago" },
      { id: "c5", author: "B3N_SYS", text: "每天 30 分鐘離線模式。系統冷卻效果拔群。", time: "8h ago" }
    ],
    isDefault: true
  },
  {
    id: "def-post-4",
    author: "PIXEL_WITCH",
    handle: "@px_witch",
    avatarLetter: "PW",
    date: "3d ago",
    category: "Design",
    privacy: "public",
    image: null,
    content: "微互動 (Micro-interactions) 是 UI 的靈魂程序。\n\n這個終端裡的每個動畫都是刻意設計的：\n\n- 愛心點擊：放大心跳 + 螢光紅\n- 分享按鈕：一鍵複製 + 霓虹 Toast 彈出\n- 留言展開：平滑滑動進場\n- CRT 掃描線：全螢幕覆蓋層\n\n這些細節的目的只有一個：讓冰冷的像素產生呼吸感。\n\n歡迎點擊下方按鈕親自體驗。",
    gradient: "linear-gradient(135deg, #181f2a 0%, #f472b6 100%)",
    likes: 156,
    likedByUser: false,
    comments: [],
    isDefault: true
  }
];

// ==========================================================================
// TRANSLATION DICTIONARY (i18n)
// ==========================================================================
const I18N = {
  "zh-Hant": {
    home: "貼文牆",
    write: "發表想法",
    about: "關於我",
    placeholder_search: "搜尋貼文關鍵字...",
    placeholder_composer: "分享你的想法、隨筆或學習筆記...",
    btn_submit: "發佈貼文",
    btn_style: "樣式",
    category: "分類",
    privacy: "隱私權限",
    public: "🌐 公開（所有人可見）",
    private: "🔒 私人（僅自己可見）",
    online: "🟢 在線",
    offline: "🔴 離線",
    search_history: "搜尋歷史",
    likes_history: "點讚與收藏",
    all_categories: "全部動態",
    logout: "安全登出",
    no_posts: "沒有找到相符的貼文，寫一篇新的吧！",
    reply: "回覆",
    reply_placeholder: "留下你的回覆...",
    toast_post_created: "貼文已發佈！",
    toast_no_text: "請輸入貼文內容！",
    toast_copied: "貼文內容與分享連結已複製！",
    toast_copy_failed: "複製失敗，請手動選取複製",
    toast_reply_success: "回覆成功！",
    toast_logged_in: "登入成功！",
    toast_logged_out: "已安全登出！",
    admin_modal_title: "SYS.SECURITY_CONSOLE // 後台管理登入",
    admin_modal_pwd_label: "請輸入安全通道授權密碼：",
    admin_modal_cancel: "取消驗證",
    admin_modal_login: "安全認證",
    admin_modal_wrong: "認證密碼錯誤！通道關閉。",
    clear_history: "清除歷史",
    image_btn: "附加圖片"
  },
  "en": {
    home: "Feed",
    write: "Post Idea",
    about: "About Me",
    placeholder_search: "Search post keywords...",
    placeholder_composer: "Share your thoughts, notes or designs...",
    btn_submit: "Publish Post",
    btn_style: "Style",
    category: "Category",
    privacy: "Privacy",
    public: "🌐 Public (All Users)",
    private: "🔒 Private (Only Me)",
    online: "🟢 Online",
    offline: "🔴 Offline",
    search_history: "Search History",
    likes_history: "Likes & Bookmarks",
    all_categories: "All Feeds",
    logout: "Log Out",
    no_posts: "No matching posts found. Create a new one!",
    reply: "Reply",
    reply_placeholder: "Write a reply...",
    toast_post_created: "Post published successfully!",
    toast_no_text: "Post content cannot be empty!",
    toast_copied: "Copied post link to clipboard!",
    toast_copy_failed: "Copy failed, please select manually",
    toast_reply_success: "Comment posted!",
    toast_logged_in: "Successfully authenticated!",
    toast_logged_out: "Logged out safely!",
    admin_modal_title: "SYS.SECURITY_CONSOLE // Admin Login",
    admin_modal_pwd_label: "Enter Secure Access Password:",
    admin_modal_cancel: "Abort",
    admin_modal_login: "Authenticate",
    admin_modal_wrong: "Invalid admin password! Access Denied.",
    clear_history: "Clear All",
    image_btn: "Add Photo"
  }
};

// ==========================================================================
// STATE VARIABLES
// ==========================================================================
let posts = [];
let currentCategory = "All";
let searchQuery = "";
let selectedGradient = null;
let searchHistory = [];
let currentLang = "zh-Hant";
let userOnline = true;
let isManualOffline = false;
let idleTimer = null;
let uploadedImageBase64 = null;
let currentUser = {
  name: "我",
  handle: "@me_creator",
  avatarLetter: "ME",
  avatarUrl: null
};

// ==========================================================================
// APPLICATION INITIALIZATION
// ==========================================================================
function init() {
  initTheme();
  initUser();
  initLang();
  initOnlineStatus();
  initSearchHistory();
  loadPosts();
  initRouter();
  initAdminEntrance();
  initProfileModal();
  initContactEditModal();
  initGoogleSignIn(); // Initialize GIS after everything else is ready
}

// ==========================================================================
// USER STATE MANAGEMENT (Real Google Login & Sandbox Simulator)
// ==========================================================================
function initUser() {
  const localUser = localStorage.getItem("echoes_user");
  if (localUser) {
    try {
      currentUser = JSON.parse(localUser);
    } catch (e) {
      console.error("Failed to parse cached user", e);
    }
  }
  applyCurrentUser();
}

function applyCurrentUser() {
  const nameEl = document.getElementById("user-display-name");
  const handleEl = document.getElementById("user-display-handle");
  const avatarEl = document.getElementById("user-avatar-area");
  const logoutBtn = document.getElementById("user-logout-btn");
  const googleContainer = document.getElementById("google-signin-container");

  if (nameEl) nameEl.textContent = currentUser.name;
  if (handleEl) handleEl.textContent = currentUser.handle;

  if (avatarEl) {
    if (currentUser.avatarUrl) {
      avatarEl.innerHTML = `<img src="${currentUser.avatarUrl}" alt="Avatar" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`;
    } else if (currentUser.avatarBg) {
      // Preset gradient avatar
      avatarEl.style.background = currentUser.avatarBg;
      avatarEl.innerHTML = "";
      avatarEl.textContent = currentUser.avatarLetter || "?";
    } else {
      avatarEl.style.background = "";
      avatarEl.innerHTML = "";
      avatarEl.textContent = currentUser.avatarLetter || currentUser.name.substring(0, 2).toUpperCase();
    }
  }

  // Toggle login / logout buttons
  const isLoggedIn = !!(currentUser.googleId && currentUser.handle !== "@me_creator");
  if (googleContainer) googleContainer.style.display = isLoggedIn ? "none" : "block";

  if (logoutBtn) {
    if (isLoggedIn) {
      logoutBtn.style.display = "flex";
      const newLogoutBtn = logoutBtn.cloneNode(true);
      logoutBtn.parentNode.replaceChild(newLogoutBtn, logoutBtn);
      newLogoutBtn.addEventListener("click", logoutUser);
    } else {
      logoutBtn.style.display = "none";
    }
  }

  // Update composer avatar
  const compAvatar = document.getElementById("composer-user-avatar");
  if (compAvatar) {
    compAvatar.textContent = currentUser.avatarLetter || currentUser.name.substring(0, 2).toUpperCase();
    if (currentUser.avatarBg && !currentUser.avatarUrl) {
      compAvatar.style.background = currentUser.avatarBg;
    }
  }

  lucide.createIcons();
}

// ==========================================================================
// GOOGLE IDENTITY SERVICES INITIALIZATION
// ==========================================================================
function initGoogleSignIn() {
  function bindGoogleBtn() {
    if (!window.google || !window.google.accounts) return;

    google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleGoogleLoginResponse,
      cancel_on_tap_outside: true
    });

    const loginBtn = document.getElementById("google-login-btn");
    if (!loginBtn) return;

    // Remove stale listeners
    const fresh = loginBtn.cloneNode(true);
    loginBtn.parentNode.replaceChild(fresh, loginBtn);

    // Render hidden official GIS button as a reliable trigger
    let hiddenDiv = document.getElementById("g_official_btn_hidden");
    if (!hiddenDiv) {
      hiddenDiv = document.createElement("div");
      hiddenDiv.id = "g_official_btn_hidden";
      hiddenDiv.style.cssText = "position:absolute;width:1px;height:1px;overflow:hidden;opacity:0;pointer-events:none;";
      document.body.appendChild(hiddenDiv);
    }
    google.accounts.id.renderButton(hiddenDiv, {
      type: "standard", theme: "outline", size: "large", width: 200
    });

    fresh.addEventListener("click", () => {
      google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          const officialBtn = hiddenDiv.querySelector("[role=button]");
          if (officialBtn) officialBtn.click();
        }
      });
    });

    console.log("[GIS] Google 登入按鈕綁定完成 ✓");
  }

  if (window.google && window.google.accounts) {
    bindGoogleBtn();
  } else {
    window.onGoogleLibraryLoad = bindGoogleBtn;
    const poll = setInterval(() => {
      if (window.google && window.google.accounts) {
        clearInterval(poll);
        bindGoogleBtn();
      }
    }, 300);
    setTimeout(() => clearInterval(poll), 12000);
  }
}

function handleGoogleLoginResponse(response) {
  try {
    const base64Url = response.credential.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    const data = JSON.parse(jsonPayload);

    const googleId = data.sub; // 唯一 Google 用戶 ID
    const isFirstLogin = !localStorage.getItem("echoes_profile_" + googleId);

    currentUser = {
      googleId: googleId,
      name: data.name,
      handle: "@" + data.email.split("@")[0],
      avatarLetter: data.name.substring(0, 2).toUpperCase(),
      avatarUrl: data.picture,
      googlePicture: data.picture,
      isGoogle: true
    };

    localStorage.setItem("echoes_user", JSON.stringify(currentUser));
    applyCurrentUser();
    showToast(t("toast_logged_in"));
    renderPostsList();

    if (isFirstLogin) {
      // Pre-fill the profile setup modal with Google name
      const nameInput = document.getElementById("profile-name-input");
      if (nameInput) nameInput.value = data.name;
      showProfileSetupModal();
    }
  } catch (e) {
    console.error("JWT credential decode error", e);
  }
}

function simulateGoogleLogin() {
  const firstNames = ["Neon", "Cyber", "Ghost", "Zero", "Warp", "Apex", "Nova"];
  const lastNames = ["Hacker", "Runner", "Nomad", "Witch", "Specter", "Operator"];
  const randomName = firstNames[Math.floor(Math.random() * firstNames.length)] + "_" + lastNames[Math.floor(Math.random() * lastNames.length)];
  const handle = "@" + randomName.toLowerCase() + "_" + Math.floor(Math.random() * 100);

  // Generate a consistent mock ID for this sandbox session
  const mockId = "sandbox_" + randomName.toLowerCase().replace("_", "");
  const isFirstLogin = !localStorage.getItem("echoes_profile_" + mockId);

  currentUser = {
    googleId: mockId,
    name: randomName,
    handle: handle,
    avatarLetter: randomName.substring(0, 2).toUpperCase(),
    avatarUrl: null,
    isGoogle: true
  };
  localStorage.setItem("echoes_user", JSON.stringify(currentUser));
  applyCurrentUser();
  showToast(t("toast_logged_in"));
  renderPostsList();

  if (isFirstLogin) {
    const nameInput = document.getElementById("profile-name-input");
    if (nameInput) nameInput.value = randomName;
    showProfileSetupModal();
  }
}

function logoutUser() {
  currentUser = {
    name: "我",
    handle: "@me_creator",
    avatarLetter: "ME",
    avatarUrl: null
  };
  localStorage.removeItem("echoes_user");
  applyCurrentUser();
  showToast(t("toast_logged_out"));
  renderPostsList();
}

// Bind GIS on window load in case scripts loading asynchronously
window.addEventListener("load", () => {
  if (window.google && window.google.accounts && currentUser.handle === "@me_creator") {
    applyCurrentUser();
  }
});

// ==========================================================================
// i18n MULTI-LANGUAGE ENGINE
// ==========================================================================
function initLang() {
  const savedLang = localStorage.getItem("echoes_lang");
  if (savedLang) {
    currentLang = savedLang;
  } else {
    const navLang = navigator.language;
    currentLang = navLang.startsWith("en") ? "en" : "zh-Hant";
  }

  const select = document.getElementById("lang-switcher-select");
  if (select) {
    select.value = currentLang;
    select.addEventListener("change", (e) => {
      currentLang = e.target.value;
      localStorage.setItem("echoes_lang", currentLang);
      translatePage();
      const container = document.querySelector(".main-feed");
      const hash = window.location.hash || "#/";
      if (hash === "#/" || hash === "" || hash === "#/write") {
        renderFeedView(container, hash === "#/write");
      } else if (hash === "#/about") {
        renderAboutView(container);
      }
      applyCurrentUser();
      updateStatusUI();
    });
  }
  translatePage();
}

function t(key) {
  return I18N[currentLang][key] || I18N["zh-Hant"][key] || key;
}

function translatePage() {
  const navHome = document.getElementById("nav-home");
  const navWrite = document.getElementById("nav-write");
  const navAbout = document.getElementById("nav-about");

  if (navHome) navHome.innerHTML = `&gt; ${t("home")}`;
  if (navWrite) navWrite.innerHTML = `&gt; ${t("write")}`;
  if (navAbout) navAbout.innerHTML = `&gt; ${t("about")}`;

  const menuHome = document.getElementById("sidebar-menu-home");
  const menuNotify = document.getElementById("sidebar-menu-notifications");
  const menuMsg = document.getElementById("sidebar-menu-messages");
  const menuBookmark = document.getElementById("sidebar-menu-bookmarks");

  if (menuHome) menuHome.querySelector(".sidebar-menu-text").textContent = t("home");
  if (menuNotify) menuNotify.querySelector(".sidebar-menu-text").textContent = currentLang === "en" ? "Notifications" : "通知訊息";
  if (menuMsg) menuMsg.querySelector(".sidebar-menu-text").textContent = currentLang === "en" ? "Direct Messages" : "私訊功能";
  if (menuBookmark) menuBookmark.querySelector(".sidebar-menu-text").textContent = t("likes_history");

  const trendingTitle = document.getElementById("trending-topics-title");
  const searchTitle = document.getElementById("search-history-title");
  const likesTitle = document.getElementById("likes-history-title");

  if (trendingTitle) trendingTitle.textContent = "🔥 " + (currentLang === "en" ? "Trending Topics" : "熱門話題");
  if (searchTitle) searchTitle.textContent = "🔍 " + t("search_history");
  if (likesTitle) likesTitle.textContent = "💖 " + t("likes_history");

  const clearBtn = document.getElementById("clear-history-btn");
  if (clearBtn) clearBtn.textContent = t("clear_history");

  const logoutBtnText = document.getElementById("logout-btn-text");
  if (logoutBtnText) logoutBtnText.textContent = t("logout");

  const adminTitle = document.getElementById("admin-modal-title");
  const adminPwdLabel = document.getElementById("admin-modal-pwd-label");
  const adminCancel = document.getElementById("admin-cancel-btn");
  const adminLogin = document.getElementById("admin-login-btn");

  if (adminTitle) adminTitle.textContent = t("admin_modal_title");
  if (adminPwdLabel) adminPwdLabel.textContent = t("admin_modal_pwd_label");
  if (adminCancel) adminCancel.textContent = t("admin_modal_cancel");
  if (adminLogin) adminLogin.textContent = t("admin_modal_login");
}

// ==========================================================================
// USER STATUS SENSING (ONLINE/OFFLINE & 5-MIN IDLE CHECK)
// ==========================================================================
function initOnlineStatus() {
  window.addEventListener("online", () => {
    if (!isManualOffline) {
      userOnline = true;
      updateStatusUI();
    }
  });
  window.addEventListener("offline", () => {
    userOnline = false;
    updateStatusUI();
  });

  // User presence interaction events
  window.addEventListener("mousemove", resetIdleTimer);
  window.addEventListener("keypress", resetIdleTimer);
  window.addEventListener("scroll", resetIdleTimer);
  window.addEventListener("click", resetIdleTimer);
  window.addEventListener("focus", resetIdleTimer);

  // Manual toggle status click
  const statusEl = document.getElementById("user-status-indicator");
  if (statusEl) {
    statusEl.style.cursor = "pointer";
    statusEl.addEventListener("click", (e) => {
      e.stopPropagation();
      if (userOnline) {
        userOnline = false;
        isManualOffline = true;
      } else {
        userOnline = true;
        isManualOffline = false;
      }
      updateStatusUI();
    });
  }

  resetIdleTimer();
}

function updateStatusUI() {
  const textEl = document.getElementById("user-status-text");
  const dotEl = document.getElementById("user-status-dot");

  if (textEl && dotEl) {
    if (navigator.onLine && userOnline) {
      textEl.textContent = t("online");
      dotEl.className = "status-dot online";
    } else {
      textEl.textContent = t("offline");
      dotEl.className = "status-dot offline";
    }
  }
}

function resetIdleTimer() {
  if (isManualOffline) return;
  if (!userOnline) {
    userOnline = true;
    updateStatusUI();
  }
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => {
    userOnline = false;
    updateStatusUI();
  }, 300000);
}

// ==========================================================================
// THEME MANAGEMENT
// ==========================================================================
function initTheme() {
  const themeToggleBtn = document.getElementById("theme-toggle");
  const savedTheme = localStorage.getItem("echoes_theme");
  const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  const initialTheme = savedTheme || (systemPrefersDark ? "dark" : "dark");
  document.documentElement.setAttribute("data-theme", initialTheme);

  themeToggleBtn.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";

    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("echoes_theme", newTheme);
  });
}

// ==========================================================================
// DATA OPERATIONS (LocalStorage)
// ==========================================================================
const DATA_VERSION = "cyberpunk-v3";

function loadPosts() {
  const savedVersion = localStorage.getItem("echoes_data_version");

  if (savedVersion !== DATA_VERSION) {
    localStorage.removeItem("echoes_posts");
    localStorage.setItem("echoes_data_version", DATA_VERSION);
  }

  const localPosts = localStorage.getItem("echoes_posts");
  if (localPosts) {
    try {
      const parsed = JSON.parse(localPosts);
      if (Array.isArray(parsed)) {
        posts = parsed.map(post => {
          return {
            id: post.id || ("post-" + Date.now()),
            author: post.author || "ANON",
            handle: post.handle || "@unknown",
            avatarLetter: post.avatarLetter || "??",
            date: post.date || "just now",
            category: post.category || "Thoughts",
            privacy: post.privacy || "public",
            image: post.image || null,
            content: post.content || "",
            gradient: post.gradient || null,
            likes: typeof post.likes === "number" ? post.likes : 0,
            likedByUser: !!post.likedByUser,
            comments: Array.isArray(post.comments) ? post.comments : [],
            isDefault: !!post.isDefault
          };
        });

        DEFAULT_POSTS.forEach(defPost => {
          if (!posts.some(p => p.id === defPost.id)) {
            posts.push(defPost);
          }
        });

        savePosts();
        return;
      }
    } catch (e) {
      console.error("// ERR: Corrupted localStorage data, resetting to defaults...", e);
    }
  }

  posts = [...DEFAULT_POSTS];
  localStorage.setItem("echoes_posts", JSON.stringify(posts));
}

function savePosts() {
  localStorage.setItem("echoes_posts", JSON.stringify(posts));
}

function createPost(content, category, gradient, image, privacy) {
  const cleanCategory = category || "Thoughts";
  const privacyMode = privacy || "public";

  const newPost = {
    id: "post-" + Date.now(),
    author: currentUser.name,
    handle: currentUser.handle,
    avatarLetter: currentUser.avatarLetter || currentUser.name.substring(0, 2).toUpperCase(),
    date: currentLang === "en" ? "just now" : "剛剛",
    category: cleanCategory.charAt(0).toUpperCase() + cleanCategory.slice(1),
    privacy: privacyMode,
    image: image || null,
    content: content,
    gradient: gradient,
    likes: 0,
    likedByUser: false,
    comments: [],
    isDefault: false
  };

  posts.unshift(newPost);
  savePosts();
  return newPost;
}

function deletePost(id) {
  posts = posts.filter(p => p.id !== id);
  savePosts();
}

// ==========================================================================
// ROUTER
// ==========================================================================
function initRouter() {
  window.addEventListener("hashchange", handleRoute);
  handleRoute();
}

function handleRoute() {
  const hash = window.location.hash || "#/";
  updateActiveNavLink(hash);

  // target the middle main feed column to preserve the sidebars
  const container = document.querySelector(".main-feed");
  if (!container) return;

  container.classList.remove("fade-in");
  void container.offsetWidth; // Force Reflow

  if (hash === "#/" || hash === "") {
    renderFeedView(container, false);
  } else if (hash === "#/write") {
    renderFeedView(container, true);
  } else if (hash === "#/about") {
    renderAboutView(container);
  } else {
    // 404 Route
    container.innerHTML = `
      <div class="feed-container" style="text-align: center; padding: 80px 20px;">
        <h2 style="font-family: var(--font-heading); font-size: 48px; margin-bottom: 12px; background: linear-gradient(135deg, var(--text-primary), var(--neon-green)); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">404</h2>
        <p style="color: var(--text-secondary); margin-bottom: 24px;">找不到該網頁，回貼文牆看看吧！</p>
        <a href="#/" class="post-submit-btn" style="display:inline-flex; width:auto; justify-content:center;">返回首頁</a>
      </div>
    `;
  }

  container.classList.add("fade-in");
  lucide.createIcons();
}

function updateActiveNavLink(hash) {
  const links = document.querySelectorAll(".nav-link");
  links.forEach(link => link.classList.remove("active"));

  if (hash === "#/" || hash === "") {
    document.getElementById("nav-home")?.classList.add("active");
  } else if (hash === "#/write") {
    document.getElementById("nav-write")?.classList.add("active");
  } else if (hash === "#/about") {
    document.getElementById("nav-about")?.classList.add("active");
  }
}

// ==========================================================================
// FEED VIEW RENDERING
// ==========================================================================
function renderFeedView(container, shouldFocusComposer) {
  selectedGradient = null;
  uploadedImageBase64 = null;

  container.innerHTML = `
    <div class="feed-container">
      <!-- Composer Card -->
      <div class="composer-card">
        <div class="composer-main">
          <div class="user-avatar" id="composer-user-avatar">${currentUser.avatarLetter || "ME"}</div>
          <div class="composer-inputs">
            <textarea id="composer-textarea" class="composer-textarea" placeholder="${t("placeholder_composer")}"></textarea>
            
            <!-- FileReader image preview -->
            <div id="composer-image-preview-container"></div>
            
            <div id="composer-gradient-preview" class="composer-gradient-preview"></div>
          </div>
        </div>
        
        <!-- Gradient Picker Row -->
        <div id="composer-gradients-row" class="composer-gradients-row">
          <div class="composer-grad-option composer-grad-none selected" data-gradient="none">無</div>
        </div>

        <div class="composer-divider"></div>

        <div class="composer-footer">
          <div class="composer-options">
            <button id="toggle-gradients-btn" class="composer-tool-btn" type="button">
              <i data-lucide="palette"></i>
              <span>${t("btn_style")}</span>
            </button>
            
            <!-- Image Upload Trigger -->
            <div class="image-upload-wrapper">
              <input type="file" id="composer-image-input" class="image-upload-input" accept="image/*">
              <button id="composer-image-btn" class="image-upload-btn" type="button">
                <i data-lucide="image"></i>
                <span>${t("image_btn")}</span>
              </button>
            </div>
            
            <select id="composer-category" class="composer-category-select" aria-label="Category Selection">
              <option value="Thoughts">Thoughts</option>
              <option value="Tech">Tech</option>
              <option value="Productivity">Productivity</option>
              <option value="Life">Life</option>
              <option value="Design">Design</option>
            </select>
            
            <!-- Privacy Selector -->
            <select id="composer-privacy" class="composer-privacy-select" aria-label="Privacy Control">
              <option value="public">${t("public")}</option>
              <option value="private">${t("private")}</option>
            </select>
          </div>

          <button id="submit-post-btn" class="post-submit-btn" type="button">
            <i data-lucide="send"></i>
            <span>${t("btn_submit")}</span>
          </button>
        </div>
      </div>

      <!-- Search & Filters -->
      <div class="search-filter-section">
        <div class="search-input-wrapper">
          <i data-lucide="search"></i>
          <input type="text" id="feed-search" class="feed-search-input" placeholder="${t("placeholder_search")}" value="${searchQuery}">
        </div>
        <div class="categories-scroll" id="categories-scroll"></div>
      </div>

      <!-- Posts List -->
      <div id="posts-feed-list"></div>
    </div>
  `;

  // Bind Composer events
  setupComposer(shouldFocusComposer);

  // Render sidebar lists and pills
  renderFilterPills();
  renderPostsList();
  renderSearchHistory();
  renderLikesHistory();

  // Search input listeners
  const searchInput = document.getElementById("feed-search");
  if (searchInput) {
    searchInput.addEventListener("keyup", (e) => {
      if (e.key === "Enter") {
        const val = searchInput.value.trim();
        // Secret Terminal Password CLI Easter egg
        if (val === "admin" || val === "/admin") {
          searchInput.value = "";
          searchQuery = "";
          showAdminModal();
          return;
        }
        if (val && !searchHistory.includes(val)) {
          searchHistory.unshift(val);
          if (searchHistory.length > 5) searchHistory.pop();
          localStorage.setItem("echoes_search_history", JSON.stringify(searchHistory));
          renderSearchHistory();
        }
      }
    });

    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value;
      renderPostsList();
    });
  }
}

function setupComposer(shouldFocusComposer) {
  const textarea = document.getElementById("composer-textarea");
  const gradientRow = document.getElementById("composer-gradients-row");
  const toggleGradBtn = document.getElementById("toggle-gradients-btn");
  const preview = document.getElementById("composer-gradient-preview");
  const submitBtn = document.getElementById("submit-post-btn");
  const categorySelect = document.getElementById("composer-category");
  const privacySelect = document.getElementById("composer-privacy");

  // Image upload selectors
  const imgInput = document.getElementById("composer-image-input");
  const imgBtn = document.getElementById("composer-image-btn");
  const imgPreviewContainer = document.getElementById("composer-image-preview-container");

  // Auto-grow textarea
  textarea.addEventListener("input", () => {
    textarea.style.height = "auto";
    textarea.style.height = (textarea.scrollHeight) + "px";

    if (selectedGradient) {
      preview.innerHTML = escapeHTML(textarea.value) || "Preview Draft";
    }
  });

  // Toggle Gradient Drawer
  toggleGradBtn.addEventListener("click", () => {
    gradientRow.classList.toggle("active");
  });

  // Load gradients choices
  let gradHtml = PRESET_GRADIENTS.map(grad => `
    <div class="composer-grad-option" style="background: ${grad};" data-gradient="${grad}"></div>
  `).join("");
  gradientRow.innerHTML += gradHtml;

  // Gradient Picker events
  const options = gradientRow.querySelectorAll(".composer-grad-option");
  options.forEach(opt => {
    opt.addEventListener("click", () => {
      options.forEach(o => o.classList.remove("selected"));
      opt.classList.add("selected");

      const gradVal = opt.getAttribute("data-gradient");
      if (gradVal === "none") {
        selectedGradient = null;
        preview.style.display = "none";
        textarea.style.display = "block";
      } else {
        selectedGradient = gradVal;
        preview.style.background = gradVal;
        preview.style.display = "flex";
        preview.innerHTML = escapeHTML(textarea.value) || "Preview Draft";
        textarea.style.display = "none";
      }
    });
  });

  // Direct edit from preview canvas
  preview.addEventListener("click", () => {
    options.forEach(o => o.classList.remove("selected"));
    gradientRow.querySelector('[data-gradient="none"]').classList.add("selected");
    selectedGradient = null;
    preview.style.display = "none";
    textarea.style.display = "block";
    textarea.focus();
  });

  // FileReader Image Processing
  imgBtn.addEventListener("click", () => imgInput.click());
  imgInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showToast(currentLang === "en" ? "Image too large (Max 2MB)" : "圖片檔案過大 (最大限制 2MB)");
        imgInput.value = "";
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        uploadedImageBase64 = event.target.result;
        imgPreviewContainer.innerHTML = `
          <div class="composer-image-preview-wrapper">
            <img src="${uploadedImageBase64}" class="composer-image-preview" alt="Composer Thumbnail">
            <button type="button" id="composer-image-clear" class="composer-image-delete-btn">&times;</button>
          </div>
        `;
        document.getElementById("composer-image-clear").addEventListener("click", () => {
          uploadedImageBase64 = null;
          imgPreviewContainer.innerHTML = "";
          imgInput.value = "";
        });
      };
      reader.readAsDataURL(file);
    }
  });

  // Publish Post
  submitBtn.addEventListener("click", () => {
    const textVal = textarea.value.trim();
    if (!textVal) {
      showToast(t("toast_no_text"));
      return;
    }

    const cat = categorySelect.value;
    const privacy = privacySelect.value;

    createPost(textVal, cat, selectedGradient, uploadedImageBase64, privacy);

    // Reset composer state variables and elements
    textarea.value = "";
    textarea.style.height = "auto";
    selectedGradient = null;
    uploadedImageBase64 = null;
    imgPreviewContainer.innerHTML = "";
    imgInput.value = "";
    preview.style.display = "none";
    textarea.style.display = "block";
    options.forEach(o => o.classList.remove("selected"));
    gradientRow.querySelector('[data-gradient="none"]').classList.add("selected");
    gradientRow.classList.remove("active");

    showToast(t("toast_post_created"));

    if (window.location.hash === "#/write") {
      window.location.hash = "#/";
    } else {
      renderPostsList();
      renderFilterPills();
      renderLikesHistory();
    }
  });

  if (shouldFocusComposer) {
    setTimeout(() => {
      textarea.scrollIntoView({ behavior: "smooth", block: "center" });
      textarea.focus();
    }, 100);
  }
}

// ==========================================================================
// RENDER FILTER PILLS
// ==========================================================================
function renderFilterPills() {
  const container = document.getElementById("categories-scroll");
  if (!container) return;

  const categories = ["All", ...new Set(posts.map(post => post.category))];

  container.innerHTML = categories.map(cat => `
    <button class="feed-category-pill ${currentCategory === cat ? 'active' : ''}" data-category="${cat}">
      ${cat === "All" ? t("all_categories") : cat}
    </button>
  `).join("");

  const pills = container.querySelectorAll(".feed-category-pill");
  pills.forEach(pill => {
    pill.addEventListener("click", () => {
      pills.forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      currentCategory = pill.getAttribute("data-category");
      renderPostsList();
    });
  });
}

// ==========================================================================
// RENDER POSTS FEED LIST
// ==========================================================================
function renderPostsList() {
  const feedList = document.getElementById("posts-feed-list");
  if (!feedList) return;

  const isAdmin = sessionStorage.getItem("admin_authenticated") === "true";

  const filtered = posts.filter(post => {
    const matchesCat = currentCategory === "All" || post.category === currentCategory;
    const matchesSearch = searchQuery === "" ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase());

    // Privacy access rule: Render if public, or if belongs to logged-in user
    const isPrivate = post.privacy === "private";
    const isMine = post.handle === currentUser.handle;
    const matchesPrivacy = !isPrivate || isMine || isAdmin; // Admin can see private posts for moderation

    return matchesCat && matchesSearch && matchesPrivacy;
  });

  if (filtered.length === 0) {
    feedList.innerHTML = `
      <div style="text-align: center; padding: 40px 10px; color: var(--text-muted);">
        <i data-lucide="frown" style="width: 38px; height: 38px; margin-bottom: 12px;"></i>
        <p>${t("no_posts")}</p>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  feedList.innerHTML = filtered.map(post => {
    const hasGradient = post.gradient !== null && post.gradient !== undefined;
    const isPrivate = post.privacy === "private";

    return `
      <div class="post-card" id="card-${post.id}">
        <div class="post-header">
          <div class="post-author-wrapper">
            <div class="user-avatar" style="background: ${post.isDefault ? 'var(--bg-elevated)' : 'linear-gradient(135deg, var(--neon-green-dim) 0%, var(--neon-cyan) 100%)'}; color: ${post.isDefault ? 'var(--neon-green)' : '#ffffff'}">
              ${post.avatarLetter}
            </div>
            <div class="post-author-details">
              <span class="post-author-name">${escapeHTML(post.author)}</span>
              <span class="post-author-handle">${post.handle}</span>
            </div>
          </div>
          <div class="post-meta-right">
            ${isPrivate ? `
              <span class="post-privacy-badge">
                <i data-lucide="lock"></i>
                <span>${t("private").split('（')[0]}</span>
              </span>
            ` : ""}
            <span class="post-category-tag">${post.category}</span>
            <span class="post-time">${post.date}</span>
          </div>
        </div>

        <!-- Attached Image Upload Rendering -->
        ${post.image ? `
          <div class="post-image-container">
            <img src="${post.image}" class="post-image" alt="Attached preview">
          </div>
        ` : ""}

        <!-- Content Area -->
        ${hasGradient ? `
          <div class="post-gradient-container" style="background: ${post.gradient};">
            <div>${parseSimpleMarkdown(post.content)}</div>
          </div>
        ` : `
          <div class="post-text-content">
            ${parseSimpleMarkdown(post.content)}
          </div>
        `}

        <!-- Actions Row -->
        <div class="post-actions-row">
          <button class="post-action-btn btn-like ${post.likedByUser ? 'liked' : ''}" data-post-id="${post.id}">
            <i data-lucide="heart"></i>
            <span class="like-count">${post.likes}</span>
          </button>
          
          <button class="post-action-btn btn-comment" data-post-id="${post.id}">
            <i data-lucide="message-square"></i>
            <span>${post.comments.length}</span>
          </button>
          
          <button class="post-action-btn btn-share" data-post-id="${post.id}">
            <i data-lucide="send"></i>
            <span>分享</span>
          </button>

          ${(post.handle === currentUser.handle || isAdmin) && !post.isDefault ? `
            <button class="post-action-btn post-action-delete" data-post-id="${post.id}">
              <i data-lucide="trash-2"></i>
            </button>
          ` : ""}
        </div>

        <!-- Comments Section Container -->
        <div class="comments-section" id="comments-sec-${post.id}">
          <div class="comments-list" id="comments-list-${post.id}">
            ${renderCommentsList(post.comments)}
          </div>
          <div class="comment-composer">
            <input type="text" class="comment-input" id="comment-input-${post.id}" placeholder="${t("reply_placeholder")}">
            <button class="comment-submit-btn" data-post-id="${post.id}">${t("reply")}</button>
          </div>
        </div>
      </div>
    `;
  }).join("");

  lucide.createIcons();
  bindPostActions();
}

function renderCommentsList(comments) {
  if (comments.length === 0) {
    return `<div style="text-align: center; font-size:12px; color: var(--text-muted); padding: 8px 0;">尚無留言，成為第一個留言的人吧！</div>`;
  }
  return comments.map(c => `
    <div class="comment-item">
      <div class="comment-avatar">${escapeHTML(c.author.charAt(0).toUpperCase())}</div>
      <div class="comment-content-wrapper">
        <div class="comment-header">
          <span class="comment-author">${escapeHTML(c.author)}</span>
          <span class="comment-time">${c.time}</span>
        </div>
        <div class="comment-text">${escapeHTML(c.text)}</div>
      </div>
    </div>
  `).join("");
}

// ==========================================================================
// ACTIONS BINDING (LIKE, COMMENT, SHARE, DELETE)
// ==========================================================================
function bindPostActions() {
  // 1. Like Action
  document.querySelectorAll(".btn-like").forEach(btn => {
    btn.addEventListener("click", () => {
      const postId = btn.getAttribute("data-post-id");
      const post = posts.find(p => p.id === postId);
      if (!post) return;

      post.likedByUser = !post.likedByUser;
      if (post.likedByUser) {
        post.likes += 1;
        btn.classList.add("liked");
      } else {
        post.likes -= 1;
        btn.classList.remove("liked");
      }

      btn.querySelector(".like-count").textContent = post.likes;
      savePosts();
      renderLikesHistory();
    });
  });

  // 2. Comments Toggle
  document.querySelectorAll(".btn-comment").forEach(btn => {
    btn.addEventListener("click", () => {
      const postId = btn.getAttribute("data-post-id");
      const commentsSection = document.getElementById(`comments-sec-${postId}`);
      commentsSection.classList.toggle("active");
      btn.classList.toggle("active");
    });
  });

  // 3. Comments Submit
  document.querySelectorAll(".comment-submit-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const postId = btn.getAttribute("data-post-id");
      const input = document.getElementById(`comment-input-${postId}`);
      const text = input.value.trim();
      if (!text) return;

      const post = posts.find(p => p.id === postId);
      if (!post) return;

      const newComment = {
        id: "c-" + Date.now(),
        author: currentUser.name,
        text: text,
        time: currentLang === "en" ? "just now" : "剛剛"
      };

      post.comments.push(newComment);
      savePosts();

      const commentBtnText = document.querySelector(`.btn-comment[data-post-id="${postId}"] span`);
      if (commentBtnText) commentBtnText.textContent = post.comments.length;

      const listContainer = document.getElementById(`comments-list-${postId}`);
      listContainer.innerHTML = renderCommentsList(post.comments);

      input.value = "";
      showToast(t("toast_reply_success"));
    });
  });

  // 4. Share Action
  document.querySelectorAll(".btn-share").forEach(btn => {
    btn.addEventListener("click", () => {
      const postId = btn.getAttribute("data-post-id");
      const post = posts.find(p => p.id === postId);
      if (!post) return;

      const copyText = `${post.author} (${post.handle}): \n"${post.content}"\n\n來自 Echoes Feed 的分享`;
      navigator.clipboard.writeText(copyText).then(() => {
        showToast(t("toast_copied"));
      }).catch(err => {
        console.error("Copy operation failed", err);
        showToast(t("toast_copy_failed"));
      });
    });
  });

  // 5. Delete Action (Including admin delete permission)
  document.querySelectorAll(".post-action-delete").forEach(btn => {
    btn.addEventListener("click", () => {
      const confirmMsg = currentLang === "en" ? "Delete this post?" : "確定要刪除這篇貼文嗎？";
      if (confirm(confirmMsg)) {
        const postId = btn.getAttribute("data-post-id");
        const card = document.getElementById(`card-${postId}`);

        card.style.opacity = "0";
        card.style.transform = "translateY(15px)";
        card.style.transition = "all 0.35s ease";

        setTimeout(() => {
          deletePost(postId);
          renderPostsList();
          renderFilterPills();
          renderLikesHistory();
        }, 350);
      }
    });
  });
}

// ==========================================================================
// TOAST NOTIFICATIONS
// ==========================================================================
function showToast(message) {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `
    <i data-lucide="check-circle-2"></i>
    <span>${escapeHTML(message)}</span>
  `;

  container.appendChild(toast);
  lucide.createIcons();

  setTimeout(() => {
    toast.remove();
  }, 2600);
}

// ==========================================================================
// ABOUT VIEW RENDERING
// ==========================================================================
function renderAboutView(container) {
  // Load saved contact info from LocalStorage
  const savedContact = JSON.parse(localStorage.getItem("echoes_contact_info") || "{}");
  const phone = savedContact.phone || "";
  const email = savedContact.email || "";
  const website = savedContact.website || "";

  const isOwner = currentUser.handle !== "@me_creator";
  const isAdmin = sessionStorage.getItem("admin_authenticated") === "true";
  const canEdit = isOwner || isAdmin;

  container.innerHTML = `
    <div class="feed-container" style="max-width: 580px;">
      <div class="profile-card">
        <div class="profile-avatar-wrapper">
          <div class="profile-avatar">//</div>
        </div>
        <div class="profile-details">
          <h2 class="profile-name">[ECHOES_NODE]</h2>
          <p style="font-size:11px; color:var(--neon-cyan); font-weight:600; text-transform:uppercase; letter-spacing:2px; margin-bottom: 6px; font-family: var(--font-body);">@sys_operator // STATUS: ACTIVE</p>
          <p class="profile-bio">歡迎進入 ECHOES 終端。這是一個運行在你瀏覽器沙箱中的去中心化社群貼文節點。所有資料加密儲存於 LocalStorage，無後端、無追蹤、零延遲。</p>
        </div>

        <div class="profile-divider"></div>

        <div class="profile-sections">
          <div class="profile-sec-item">
            <h3><i data-lucide="terminal"></i> SYS.ARCH</h3>
            <p>純前端 SPA 架構，以 Vanilla JS 驅動。視覺設計採用賽博朋克終端機美學 — 深黑底色、螢光綠 Neon 點綴、等寬字體、CRT 掃描線特效，以及終端發光碼塊。</p>
          </div>

          <div class="profile-sec-item">
            <h3><i data-lucide="shield"></i> DATA.VAULT</h3>
            <p>完全離線運作。無伺服器、無 Cookie、無第三方追蹤腳本。你的貼文、按讚數與留言都被封裝在瀏覽器 LocalStorage 中，清除瀏覽資料即可完全抹除。</p>
          </div>

          <div class="profile-sec-item">
            <h3><i data-lucide="hash"></i> TAGS.INDEX</h3>
            <div class="profile-tags">
              <span class="profile-tag">#CYBERPUNK</span>
              <span class="profile-tag">#NEON_GREEN</span>
              <span class="profile-tag">#TERMINAL_UI</span>
              <span class="profile-tag">#VANILLA_JS</span>
              <span class="profile-tag">#ZERO_BACKEND</span>
              <span class="profile-tag">#CRT_SCANLINE</span>
            </div>
          </div>

          <!-- CONTACT INFO SECTION -->
          <div class="profile-sec-item" id="about-contact-section">
            <h3 style="display: flex; align-items: center; justify-content: space-between;">
              <span><i data-lucide="radio"></i> CONTACT.LINK</span>
              ${canEdit ? `
                <button id="edit-contact-btn" style="background: none; border: 1px solid var(--border-color); border-radius: 6px; color: var(--text-muted); font-size: 10px; padding: 3px 8px; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 4px;">
                  <i data-lucide="pencil" style="width:11px;height:11px;"></i> 編輯
                </button>
              ` : ""}
            </h3>
            <div id="contact-display" style="display: flex; flex-direction: column; gap: 8px; margin-top: 8px;">
              ${phone ? `
                <a href="tel:${escapeHTML(phone)}" class="profile-social-btn" style="width: fit-content; gap: 8px; padding: 6px 12px; font-size: 12px;">
                  <i data-lucide="phone" style="width:14px;height:14px;"></i>${escapeHTML(phone)}
                </a>` : (canEdit ? `<span style="font-size:11px; color: var(--text-muted);">尚未設定電話 — 點擊右上角「編輯」加入</span>` : "")}
              ${email ? `
                <a href="mailto:${escapeHTML(email)}" class="profile-social-btn" style="width: fit-content; gap: 8px; padding: 6px 12px; font-size: 12px;">
                  <i data-lucide="mail" style="width:14px;height:14px;"></i>${escapeHTML(email)}
                </a>` : ""}
              ${website ? `
                <a href="${escapeHTML(website)}" target="_blank" rel="noopener noreferrer" class="profile-social-btn" style="width: fit-content; gap: 8px; padding: 6px 12px; font-size: 12px;">
                  <i data-lucide="globe" style="width:14px;height:14px;"></i>${escapeHTML(website)}
                </a>` : ""}
            </div>
          </div>
        </div>

        <div class="profile-socials">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" class="profile-social-btn" aria-label="GitHub">
            <i data-lucide="github"></i>
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" class="profile-social-btn" aria-label="Twitter">
            <i data-lucide="twitter"></i>
          </a>
          <a href="mailto:creator@example.com" class="profile-social-btn" aria-label="Email">
            <i data-lucide="mail"></i>
          </a>
        </div>
      </div>
    </div>
  `;

  // Bind the edit contact button if present
  const editContactBtn = document.getElementById("edit-contact-btn");
  if (editContactBtn) {
    editContactBtn.addEventListener("click", () => {
      // Pre-fill modal with saved data
      const saved = JSON.parse(localStorage.getItem("echoes_contact_info") || "{}");
      const phoneInput = document.getElementById("contact-phone");
      const emailInput = document.getElementById("contact-email");
      const websiteInput = document.getElementById("contact-website");
      if (phoneInput) phoneInput.value = saved.phone || "";
      if (emailInput) emailInput.value = saved.email || "";
      if (websiteInput) websiteInput.value = saved.website || "";
      showContactEditModal();
    });

    editContactBtn.addEventListener("mouseenter", () => {
      editContactBtn.style.borderColor = "var(--neon-green)";
      editContactBtn.style.color = "var(--neon-green)";
    });
    editContactBtn.addEventListener("mouseleave", () => {
      editContactBtn.style.borderColor = "var(--border-color)";
      editContactBtn.style.color = "var(--text-muted)";
    });
  }
}

// ==========================================================================
// RIGHT SIDEBAR DYNAMIC WIDGETS
// ==========================================================================
function initSearchHistory() {
  const saved = localStorage.getItem("echoes_search_history");
  if (saved) {
    try {
      searchHistory = JSON.parse(saved);
    } catch (e) {
      searchHistory = [];
    }
  }

  const clearBtn = document.getElementById("clear-history-btn");
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      searchHistory = [];
      localStorage.removeItem("echoes_search_history");
      renderSearchHistory();
    });
  }
}

function renderSearchHistory() {
  const container = document.getElementById("search-history-list");
  const clearBtn = document.getElementById("clear-history-btn");
  if (!container) return;

  if (searchHistory.length === 0) {
    container.innerHTML = `<div style="text-align: center; font-size:11px; color: var(--text-muted); padding: 8px 0; width: 100%;">${currentLang === "en" ? "No search history" : "無搜尋紀錄"}</div>`;
    if (clearBtn) clearBtn.style.display = "none";
    return;
  }

  container.innerHTML = searchHistory.map(kw => `
    <div class="search-history-chip" data-query="${escapeHTML(kw)}">
      <span>${escapeHTML(kw)}</span>
      <button class="clear-chip-btn" data-query="${escapeHTML(kw)}">&times;</button>
    </div>
  `).join("");

  if (clearBtn) clearBtn.style.display = "block";

  // Bind events to chips
  container.querySelectorAll(".search-history-chip").forEach(chip => {
    chip.addEventListener("click", (e) => {
      if (e.target.classList.contains("clear-chip-btn")) {
        e.stopPropagation();
        const kw = e.target.getAttribute("data-query");
        searchHistory = searchHistory.filter(q => q !== kw);
        localStorage.setItem("echoes_search_history", JSON.stringify(searchHistory));
        renderSearchHistory();
        return;
      }
      const query = chip.getAttribute("data-query");
      searchQuery = query;
      const searchInput = document.getElementById("feed-search");
      if (searchInput) searchInput.value = query;
      renderPostsList();
    });
  });
}

function renderLikesHistory() {
  const container = document.getElementById("liked-posts-list");
  if (!container) return;

  const likedPosts = posts.filter(p => p.likedByUser);
  if (likedPosts.length === 0) {
    container.innerHTML = `<div style="text-align: center; font-size:11px; color: var(--text-muted); padding: 8px 0; width: 100%;">${currentLang === "en" ? "No liked posts" : "無點讚或收藏貼文"}</div>`;
    return;
  }

  container.innerHTML = likedPosts.map(post => `
    <button class="liked-history-item" data-post-id="${post.id}">
      <i data-lucide="heart" style="color: var(--neon-red); fill: var(--neon-red);"></i>
      <span class="liked-history-item-text">${escapeHTML(post.author)}: ${escapeHTML(post.content.substring(0, 15))}...</span>
    </button>
  `).join("");

  lucide.createIcons();

  container.querySelectorAll(".liked-history-item").forEach(item => {
    item.addEventListener("click", () => {
      const postId = item.getAttribute("data-post-id");
      const card = document.getElementById(`card-${postId}`);
      if (card) {
        card.scrollIntoView({ behavior: "smooth", block: "center" });
        card.classList.add("liked-post-highlight");
        setTimeout(() => {
          card.classList.remove("liked-post-highlight");
        }, 3000);
      }
    });
  });
}

// ==========================================================================
// HIDDEN ADMIN PORTAL (Ctrl+Shift+X & 5 Clicks Copyright Portal)
// ==========================================================================
let copyrightClickCount = 0;
let copyrightClickTimer = null;

function initAdminEntrance() {
  // Shortcut portal: Ctrl + Shift + X
  window.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.shiftKey && e.code === "KeyX") {
      e.preventDefault();
      showAdminModal();
    }
  });

  // Click portal: Copyright clicks
  const copyrightEl = document.querySelector(".copyright");
  if (copyrightEl) {
    copyrightEl.style.cursor = "pointer";
    copyrightEl.addEventListener("click", () => {
      copyrightClickCount++;
      clearTimeout(copyrightClickTimer);

      if (copyrightClickCount >= 5) {
        copyrightClickCount = 0;
        showAdminModal();
      } else {
        copyrightClickTimer = setTimeout(() => {
          copyrightClickCount = 0;
        }, 2000);
      }
    });
  }

  // Bind admin modal buttons
  const cancelBtn = document.getElementById("admin-cancel-btn");
  const loginBtn = document.getElementById("admin-login-btn");
  const pwdInput = document.getElementById("admin-password");

  if (cancelBtn) cancelBtn.addEventListener("click", hideAdminModal);
  if (loginBtn) loginBtn.addEventListener("click", handleAdminLogin);
  if (pwdInput) {
    pwdInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        handleAdminLogin();
      }
    });
  }
}

function showAdminModal() {
  const modal = document.getElementById("admin-login-modal");
  if (modal) {
    modal.classList.add("active");
    const pwdInput = document.getElementById("admin-password");
    if (pwdInput) {
      pwdInput.value = "";
      pwdInput.focus();
    }
  }
}

function hideAdminModal() {
  const modal = document.getElementById("admin-login-modal");
  if (modal) {
    modal.classList.remove("active");
  }
}

function handleAdminLogin() {
  const pwdInput = document.getElementById("admin-password");
  if (pwdInput) {
    const password = pwdInput.value.trim();
    if (password === "cyberadmin") {
      sessionStorage.setItem("admin_authenticated", "true");
      hideAdminModal();
      location.href = "admin.html";
    } else {
      showToast(t("admin_modal_wrong"));
      pwdInput.value = "";
      pwdInput.focus();
    }
  }
}

// ==========================================================================
// PROFILE SETUP MODAL
// ==========================================================================
let selectedPresetAvatar = null;
let uploadedProfileAvatarBase64 = null;

function initProfileModal() {
  // Render preset avatar options in grid
  const grid = document.getElementById("avatar-picker-grid");
  if (grid) {
    grid.innerHTML = PRESET_AVATARS.map(av => `
      <button type="button" class="avatar-preset-btn" id="av-btn-${av.id}" data-av-id="${av.id}" title="${av.label}"
        style="width: 52px; height: 52px; border-radius: 50%; border: 2px solid var(--border-color); cursor: pointer; background: ${av.bg}; font-size: 18px; display: flex; align-items: center; justify-content: center; transition: all 0.2s; flex-shrink: 0;">
        ${av.label}
      </button>
    `).join("");

    grid.querySelectorAll(".avatar-preset-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        grid.querySelectorAll(".avatar-preset-btn").forEach(b => {
          b.style.borderColor = "var(--border-color)";
          b.style.transform = "scale(1)";
          b.style.boxShadow = "none";
        });
        btn.style.borderColor = "var(--neon-green)";
        btn.style.transform = "scale(1.1)";
        btn.style.boxShadow = "0 0 12px var(--neon-green-dim)";
        selectedPresetAvatar = PRESET_AVATARS.find(av => av.id === btn.getAttribute("data-av-id"));
        uploadedProfileAvatarBase64 = null; // Clear custom upload if preset chosen
        const uploadLabel = document.getElementById("avatar-upload-label-text");
        if (uploadLabel) uploadLabel.textContent = currentLang === "en" ? "Upload Custom Avatar" : "上傳自訂頭像";
      });
    });
  }

  // Avatar upload
  const uploadInput = document.getElementById("avatar-upload-input");
  if (uploadInput) {
    uploadInput.addEventListener("change", e => {
      const file = e.target.files[0];
      if (!file) return;
      if (file.size > 2 * 1024 * 1024) {
        showToast(currentLang === "en" ? "Image too large (Max 2MB)" : "圖片過大 (上限 2MB)");
        return;
      }
      const reader = new FileReader();
      reader.onload = evt => {
        uploadedProfileAvatarBase64 = evt.target.result;
        selectedPresetAvatar = null;
        // Deselect all presets visually
        if (grid) {
          grid.querySelectorAll(".avatar-preset-btn").forEach(b => {
            b.style.borderColor = "var(--border-color)";
            b.style.transform = "scale(1)";
            b.style.boxShadow = "none";
          });
        }
        const uploadLabel = document.getElementById("avatar-upload-label-text");
        if (uploadLabel) uploadLabel.textContent = file.name.substring(0, 18) + "...";
      };
      reader.readAsDataURL(file);
    });
  }

  // Name input real-time handle preview
  const nameInput = document.getElementById("profile-name-input");
  const handlePreview = document.getElementById("profile-handle-preview");
  if (nameInput && handlePreview) {
    nameInput.addEventListener("input", () => {
      const val = nameInput.value.trim();
      if (val) {
        const generatedHandle = "@" + val.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_\u4e00-\u9fff]/g, "").substring(0, 20);
        handlePreview.textContent = "✦ Handle 預覽: " + generatedHandle;
      } else {
        handlePreview.textContent = "";
      }
    });
  }

  // Confirm button
  const confirmBtn = document.getElementById("profile-setup-confirm");
  if (confirmBtn) {
    confirmBtn.addEventListener("click", () => {
      const name = (nameInput ? nameInput.value.trim() : "") || currentUser.name;
      const handle = "@" + name.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_\u4e00-\u9fff]/g, "").substring(0, 20);

      // Apply avatar choice
      if (uploadedProfileAvatarBase64) {
        currentUser.avatarUrl = uploadedProfileAvatarBase64;
        currentUser.avatarLetter = name.substring(0, 2).toUpperCase();
      } else if (selectedPresetAvatar) {
        currentUser.avatarUrl = null;
        currentUser.avatarBg = selectedPresetAvatar.bg;
        currentUser.avatarLetter = selectedPresetAvatar.letter;
      } else {
        currentUser.avatarLetter = name.substring(0, 2).toUpperCase();
      }

      currentUser.name = name;
      currentUser.handle = handle;

      // Mark as profile-setup complete for this user
      if (currentUser.googleId) {
        localStorage.setItem("echoes_profile_" + currentUser.googleId, "true");
      }

      localStorage.setItem("echoes_user", JSON.stringify(currentUser));
      applyCurrentUser();
      hideProfileSetupModal();
      showToast(currentLang === "en" ? "✨ Profile saved!" : "✨ 個人資料已儲存！");
      renderPostsList();
    });
  }
}

function showProfileSetupModal() {
  const modal = document.getElementById("profile-setup-modal");
  if (modal) {
    modal.classList.add("active");
    // Reset selections
    selectedPresetAvatar = null;
    uploadedProfileAvatarBase64 = null;
    const grid = document.getElementById("avatar-picker-grid");
    if (grid) {
      grid.querySelectorAll(".avatar-preset-btn").forEach(b => {
        b.style.borderColor = "var(--border-color)";
        b.style.transform = "scale(1)";
        b.style.boxShadow = "none";
      });
    }
    const uploadLabel = document.getElementById("avatar-upload-label-text");
    if (uploadLabel) uploadLabel.textContent = currentLang === "en" ? "Upload Custom Avatar" : "上傳自訂頭像";
    // Focus name input
    const nameInput = document.getElementById("profile-name-input");
    if (nameInput) setTimeout(() => nameInput.focus(), 100);
  }
}

function hideProfileSetupModal() {
  const modal = document.getElementById("profile-setup-modal");
  if (modal) modal.classList.remove("active");
}

// ==========================================================================
// CONTACT EDIT MODAL
// ==========================================================================
function initContactEditModal() {
  const cancelBtn = document.getElementById("contact-edit-cancel");
  const saveBtn = document.getElementById("contact-edit-save");

  if (cancelBtn) cancelBtn.addEventListener("click", hideContactEditModal);

  if (saveBtn) {
    saveBtn.addEventListener("click", () => {
      const phone = (document.getElementById("contact-phone")?.value || "").trim();
      const email = (document.getElementById("contact-email")?.value || "").trim();
      const website = (document.getElementById("contact-website")?.value || "").trim();

      localStorage.setItem("echoes_contact_info", JSON.stringify({ phone, email, website }));
      hideContactEditModal();
      showToast(currentLang === "en" ? "Contact info saved!" : "聯絡資訊已儲存！");

      // Re-render about view to reflect changes
      const container = document.querySelector(".main-feed");
      if (container && window.location.hash === "#/about") {
        renderAboutView(container);
        lucide.createIcons();
      }
    });
  }
}

function showContactEditModal() {
  const modal = document.getElementById("contact-edit-modal");
  if (modal) modal.classList.add("active");
}

function hideContactEditModal() {
  const modal = document.getElementById("contact-edit-modal");
  if (modal) modal.classList.remove("active");
}

// ==========================================================================
// UTILITY FUNCTIONS
// ==========================================================================
function escapeHTML(str) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function parseSimpleMarkdown(markdown) {
  if (!markdown) return "";

  let html = escapeHTML(markdown);
  const lines = html.split("\n");
  let inList = false;
  let result = [];

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();

    if (line === "") {
      if (inList) { result.push("</ul>"); inList = false; }
      continue;
    }

    if (line.startsWith("## ")) {
      if (inList) { result.push("</ul>"); inList = false; }
      result.push(`<h2>${line.substring(3)}</h2>`);
      continue;
    }

    if (line.startsWith("### ")) {
      if (inList) { result.push("</ul>"); inList = false; }
      result.push(`<h3>${line.substring(4)}</h3>`);
      continue;
    }

    if (line.startsWith("&gt; ")) {
      if (inList) { result.push("</ul>"); inList = false; }
      result.push(`<blockquote>${line.substring(5)}</blockquote>`);
      continue;
    }

    if (line.startsWith("- ")) {
      if (!inList) {
        result.push("<ul>");
        inList = true;
      }
      result.push(`<li>${line.substring(2)}</li>`);
      continue;
    }

    if (inList) {
      result.push("</ul>");
      inList = false;
    }

    line = line.replace(/`([^`]+)`/g, "<code>$1</code>");
    result.push(`<p>${line}</p>`);
  }

  if (inList) {
    result.push("</ul>");
  }

  let finalHtml = result.join("\n");

  finalHtml = finalHtml.replace(/```(\w+)?\n([\s\S]*?)\n```/g, "<pre><code>$2</code></pre>");
  finalHtml = finalHtml.replace(/```([\s\S]*?)```/g, "<pre><code>$1</code></pre>");

  return finalHtml;
}

// Start application
window.addEventListener("DOMContentLoaded", init);
// =======================================================
// 【手動新增】Google 登入核心控制（放在 app.js 最底部）
// =======================================================
document.addEventListener('DOMContentLoaded', () => {
  if (typeof google !== 'undefined') {
    google.accounts.id.initialize({
      client_id: '472134617764-hv4va5tt8adg5gid1ibsd8bcuq123dj8.apps.googleusercontent.com',
      callback: handleGoogleLoginResponse
    });

    const loginBtn = document.getElementById('google-login-btn');
    if (loginBtn) {
      loginBtn.addEventListener('click', () => {
        google.accounts.id.prompt();
      });
    }
  }
});

// 處理 Google 回傳的登入資料並自動填表
function handleGoogleLoginResponse(response) {
  try {
    const base64Url = response.credential.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    const user = JSON.parse(jsonPayload);

    // 1. 自動把 Google 名字填入暱稱輸入框
    const nameInput = document.getElementById('profile-name-input');
    if (nameInput) nameInput.value = user.name;

    // 2. 自動更新網頁左側欄位的使用者資訊
    if (document.getElementById('user-display-name')) {
      document.getElementById('user-display-name').innerText = user.name;
    }
    if (document.getElementById('user-display-handle')) {
      document.getElementById('user-display-handle').innerText = `@${user.given_name || 'user'}`;
    }

    // 3. 自動更換大頭貼
    const avatarArea = document.getElementById('user-avatar-area');
    if (avatarArea) {
      avatarArea.innerHTML = `<img src="${user.picture}" style="width:100%; height:100%; border-radius:50%; object-fit:cover;">`;
    }

    alert(`Google 驗證成功！已自動帶入：${user.name}`);
  } catch (e) {
    console.error("解析 Google 資料失敗", e);
  }
}