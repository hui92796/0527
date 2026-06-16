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
// Google Client ID removed

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
    author: "Alice",
    handle: "@alice_daily",
    avatarLetter: "AL",
    date: "2小時前",
    category: "Life",
    privacy: "public",
    image: [
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93",
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38"
    ],
    content: "今天跟朋友去中山區新開的咖啡廳，那個肉桂捲跟熱拿鐵真的絕了！直接原地滿血復活，推推！ #肉桂捲 #中山區咖啡廳",
    gradient: null,
    likes: 42,
    likedByUser: false,
    comments: [
      { id: "c1", author: "Bob", text: "求店名！看起來超好吃！", time: "1小時前" },
    ],
    isDefault: true
  },
  {
    id: "def-post-2",
    author: "Bob",
    handle: "@bob_says",
    avatarLetter: "BO",
    date: "5小時前",
    category: "Thoughts",
    privacy: "public",
    image: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0",
    content: "今天出門竟然忘記帶雨傘，結果一出捷運站直接暴雨暴大，真的原地謝囉QQ\n\n到底為什麼每次沒帶傘就會下雨啊？莫非定律真的不要太準... #暴雨 #日常崩潰",
    gradient: "linear-gradient(135deg, #181f2a 0%, #38bdf8 100%)",
    likes: 128,
    likedByUser: false,
    comments: [
      { id: "c3", author: "Alice", text: "幫QQ 昨天看氣象局就說會下雨啦~", time: "3小時前" }
    ],
    isDefault: true
  },
  {
    id: "def-post-3",
    author: "Charlie",
    handle: "@charlie_dev",
    avatarLetter: "CH",
    date: "1天前",
    category: "Tech",
    privacy: "public",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c",
    content: "剛剛終於搞懂這個 CSS 網格布局 (Grid Layout) 了，調出好看的排版真的好療癒喔～\n\n明天繼續加油！ #前端開發 #CSS排版 #學習筆記",
    gradient: null,
    likes: 95,
    likedByUser: false,
    comments: [
      { id: "c4", author: "Eva", text: "Grid 真的是排版神器！Flexbox 搭配起來無敵了。", time: "12小時前" }
    ],
    isDefault: true
  },
  {
    id: "def-post-4",
    author: "宇軒",
    handle: "@yuxuan_0821",
    avatarLetter: "YX",
    date: "3小時前",
    category: "Life",
    privacy: "public",
    image: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf",
    content: "脆友們有看最近那部新劇嗎？男主帥到我直接原地排卵... 怎麼可以有人長得這麼精緻啦！每天都在期待更新，好想趕快看到下一集喔！😍 #追劇日常 #韓劇推薦 #帥到排卵",
    gradient: null,
    likes: 154,
    likedByUser: false,
    comments: [
      { id: "c5", author: "小婷", text: "真的！我也看到停不下來，男主那個眼神誰受得了啦！", time: "2小時前" }
    ],
    isDefault: true
  },
  {
    id: "def-post-5",
    author: "冠宇",
    handle: "@guanyu_struggle",
    avatarLetter: "GY",
    date: "4小時前",
    category: "Life",
    privacy: "public",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40",
    content: "又是被微積分痛洗的一天，上課教授講得像天書，下課必須吃大碗拉麵補償自己QQ。有沒有微積分大師能救救可憐的大一生？🍜 #日常崩潰 #微積分 #拉麵拯救世界",
    gradient: null,
    likes: 87,
    likedByUser: false,
    comments: [],
    isDefault: true
  },
  {
    id: "def-post-6",
    author: "貓奴美美",
    handle: "@meimi_cat",
    avatarLetter: "MM",
    date: "6小時前",
    category: "Life",
    privacy: "public",
    image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba",
    content: "我們家這隻小胖貓每天早上都在我臉上蹦迪踩踏，真的要被萌死了～ 雖然牠昨天又把我的全新耳機線給咬斷了（微笑中帶淚）🙃 #貓咪日常 #奴才日常 #吸貓成癮",
    gradient: null,
    likes: 210,
    likedByUser: false,
    comments: [
      { id: "c6", author: "Alice", text: "耳機線要收好啦哈哈，不過看到這張臉真的氣不起來～", time: "5小時前" }
    ],
    isDefault: true
  },
  {
    id: "def-post-7",
    author: "剁手狂魔",
    handle: "@buy_everything",
    avatarLetter: "KM",
    date: "8小時前",
    category: "Life",
    privacy: "public",
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b",
    content: "又剁手了啦！明明雙十一還沒到，但購物車裡的寶貝又不小心被我清空了。下個月開始真的只能餐餐吃土了QQ #網購剁手 #買不停 #下個月吃土",
    gradient: "linear-gradient(135deg, #1a222f 0%, #fbbf24 100%)",
    likes: 64,
    likedByUser: false,
    comments: [],
    isDefault: true
  },
  {
    id: "def-post-8",
    author: "憂鬱社畜阿哲",
    handle: "@monday_blue_operator",
    avatarLetter: "AZ",
    date: "12小時前",
    category: "Thoughts",
    privacy: "public",
    image: null,
    content: "明天又是萬惡的禮拜一... 真的好不想上班上班上班啊！可以讓我一覺醒來直接中頭獎變富翁嗎？好想每天躺平當廢物喔😴 #不想上班 #社畜日常 #躺平人生",
    gradient: "linear-gradient(135deg, #181f2a 0%, #f472b6 100%)",
    likes: 312,
    likedByUser: false,
    comments: [
      { id: "c7", author: "Bob", text: "加一，我現在就想躺平了，禮拜一真的有夠憂鬱。", time: "10小時前" }
    ],
    isDefault: true
  },
  {
    id: "def-post-9",
    author: "減肥明天的事",
    handle: "@diet_tomorrow",
    avatarLetter: "DT",
    date: "15小時前",
    category: "Life",
    privacy: "public",
    image: "https://images.unsplash.com/photo-1562967914-608f82629710",
    content: "說好今天開始減肥，晚餐只喝溫開水。結果朋友一通電話問：『宵夜吃鹹酥雞嗎？』 我：『大辣、梅粉地瓜、甜不辣、雞排點爆！』減肥永遠是明天的事啦！🍗 #減肥失敗 #鹹酥雞 #萬惡宵夜",
    gradient: null,
    likes: 189,
    likedByUser: false,
    comments: [],
    isDefault: true
  },
  {
    id: "def-post-10",
    author: "小白鞋殺手",
    handle: "@white_shoes_victim",
    avatarLetter: "WS",
    date: "18小時前",
    category: "Life",
    privacy: "public",
    image: "https://images.unsplash.com/photo-1438786657495-640937046d18",
    content: "今天台北這天氣到底是想怎樣？早上熱到快融化，下午突然傾盆大雨。我的全新小白鞋第一次穿出門直接泡水報銷，原地謝囉！☔ #台北天氣 #小白鞋 #日常崩潰",
    gradient: null,
    likes: 95,
    likedByUser: false,
    comments: [],
    isDefault: true
  },
  {
    id: "def-post-11",
    author: "幸運值滿點",
    handle: "@lucky_star_99",
    avatarLetter: "LS",
    date: "1天前",
    category: "Life",
    privacy: "public",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745",
    content: "搶到告五人演唱會的票了啊啊啊！手速爆發直接點進去！有沒有脆友也是要去的？到時候現場見，一起唱爆！🎉 #告五人 #演唱會 #好運爆棚",
    gradient: null,
    likes: 245,
    likedByUser: false,
    comments: [
      { id: "c8", author: "Charlie", text: "超羨慕！我卡在轉圈圈畫面，直接哭暈在廁所。", time: "18小時前" }
    ],
    isDefault: true
  },
  {
    id: "def-post-12",
    author: "期中考爆肝戰士",
    handle: "@midterm_zombie",
    avatarLetter: "MZ",
    date: "1天前",
    category: "Thoughts",
    privacy: "public",
    image: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6",
    content: "期中考週直接變熊貓眼，每天咖啡當水喝。只求教授看在我這麼努力爆肝的份上，給我一個甜甜的分數過關，千萬不要把我當掉啊！🙏 #期中考 #大學生日常 #爆肝",
    gradient: null,
    likes: 130,
    likedByUser: false,
    comments: [],
    isDefault: true
  },
  {
    id: "def-post-13",
    author: "重訓弱雞",
    handle: "@gym_chicken",
    avatarLetter: "GC",
    date: "2天前",
    category: "Life",
    privacy: "public",
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd",
    content: "今天去健身房被教練操到雙腿發抖，下樓梯時差點直接滾下去，腳軟到不行。真的好累但看著鏡子裡的自己又覺得好爽！💪 #健身日常 #重訓 #痛並快樂著",
    gradient: null,
    likes: 72,
    likedByUser: false,
    comments: [],
    isDefault: true
  },
  {
    id: "def-post-14",
    author: "台北吃貨小雷",
    handle: "@taipei_foodie_ray",
    avatarLetter: "FR",
    date: "2天前",
    category: "Life",
    privacy: "public",
    image: [
      "https://images.unsplash.com/photo-1563245372-f21724e3856d",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836"
    ],
    content: "饒河夜市的胡椒餅跟藥燉排骨湯真的絕配！雖然每次去都要排隊排半天，但咬下去那口肉汁噴出來的瞬間，一切等待都值得了！推爆！ #饒河夜市 #台北美食 #吃貨人生 #拉麵拯救世界",
    gradient: null,
    likes: 165,
    likedByUser: false,
    comments: [
      { id: "c9", author: "小婷", text: "那家胡椒餅真的超讚！每次去必買！", time: "1天前" }
    ],
    isDefault: true
  },
  {
    id: "def-post-15",
    author: "傳說老司機",
    handle: "@arena_of_valor_pro",
    avatarLetter: "AV",
    date: "3天前",
    category: "Thoughts",
    privacy: "public",
    image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc",
    content: "昨晚跟朋友用語音打傳說打到凌晨三點，結果一路連敗掉星。隊友都在搞，氣到我差點當場爆開，現在上班整個人快魂飛魄散了... 🎮 #傳說對決 #遊戲崩潰 #日常崩潰",
    gradient: "linear-gradient(135deg, #181f2a 0%, #1ea34d 50%, #4ade80 100%)",
    likes: 110,
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
    write: "個人想法牆",
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
    write: "My Thoughts",
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
  initTraditionalLogin(); // Initialize traditional account/password login
  initAvatarUpload();
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

  const isLoggedIn = !!(currentUser.googleId && currentUser.handle !== "@me_creator");

  if (avatarEl) {
    if (isLoggedIn) {
      avatarEl.style.cursor = "pointer";
      avatarEl.style.pointerEvents = "auto";
    } else {
      avatarEl.style.cursor = "default";
      avatarEl.style.pointerEvents = "none";
    }

    const inputHtml = `<input type="file" id="avatar-file-input" accept="image/*" style="display: none;">`;
    if (currentUser.avatarUrl) {
      avatarEl.style.background = "";
      avatarEl.innerHTML = `<img src="${currentUser.avatarUrl}" alt="Avatar" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">` + inputHtml;
    } else if (currentUser.avatarBg) {
      // Preset gradient avatar
      avatarEl.style.background = currentUser.avatarBg;
      avatarEl.innerHTML = (currentUser.avatarLetter || "?") + inputHtml;
    } else {
      avatarEl.style.background = "";
      avatarEl.innerHTML = (currentUser.avatarLetter || currentUser.name.substring(0, 2).toUpperCase()) + inputHtml;
    }
  }

  renderAdminPresence();

  // Toggle login / logout buttons
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

  // Handle Composer Permissions
  const composerTextarea = document.getElementById("composer-textarea");
  const composerSubmitBtn = document.getElementById("submit-post-btn");
  const composerImageBtn = document.getElementById("composer-image-btn");
  const composerStyleBtn = document.getElementById("toggle-gradients-btn");

  if (composerTextarea) {
    composerTextarea.disabled = !isLoggedIn;
    composerTextarea.placeholder = isLoggedIn ? t("placeholder_composer") : (currentLang === "en" ? "Please log in to post..." : "請先登入才能發表想法...");
  }
  if (composerSubmitBtn) {
    composerSubmitBtn.disabled = !isLoggedIn;
    composerSubmitBtn.style.opacity = isLoggedIn ? "1" : "0.5";
    composerSubmitBtn.style.cursor = isLoggedIn ? "pointer" : "not-allowed";
  }
  if (composerImageBtn) {
    composerImageBtn.disabled = !isLoggedIn;
    composerImageBtn.style.opacity = isLoggedIn ? "1" : "0.5";
    composerImageBtn.style.cursor = isLoggedIn ? "pointer" : "not-allowed";
  }
  if (composerStyleBtn) {
    composerStyleBtn.disabled = !isLoggedIn;
    composerStyleBtn.style.opacity = isLoggedIn ? "1" : "0.5";
    composerStyleBtn.style.cursor = isLoggedIn ? "pointer" : "not-allowed";
  }

  lucide.createIcons();
}

// ==========================================================================
// TRADITIONAL ACCOUNT LOGIN INITIALIZATION & LOGIC
// ==========================================================================
function initTraditionalLogin() {
  const triggerBtn = document.getElementById("login-modal-trigger-btn");
  if (triggerBtn) {
    triggerBtn.addEventListener("click", showLoginModal);
  }

  const loginSubmitBtn = document.getElementById("login-btn-submit");
  if (loginSubmitBtn) {
    loginSubmitBtn.addEventListener("click", handleTraditionalLogin);
  }

  // Allow enter key to submit in the password field
  const passwordInput = document.getElementById("login-password");
  if (passwordInput) {
    passwordInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        handleTraditionalLogin();
      }
    });
  }
}

function initAvatarUpload() {
  const avatarArea = document.getElementById("user-avatar-area");
  if (!avatarArea) return;

  avatarArea.addEventListener("click", (e) => {
    if (e.target.id === "avatar-file-input") return;
    const fileInput = document.getElementById("avatar-file-input");
    if (fileInput) fileInput.click();
  });

  avatarArea.addEventListener("change", (e) => {
    if (e.target.id === "avatar-file-input") {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
          const dataUrl = event.target.result;
          currentUser.avatarUrl = dataUrl;
          localStorage.setItem("echoes_user", JSON.stringify(currentUser));
          applyCurrentUser();
        };
        reader.readAsDataURL(file);
      }
    }
  });
}

function showLoginModal() {
  const modal = document.getElementById("profile-setup-modal");
  if (modal) {
    modal.classList.add("active");
    const emailInput = document.getElementById("login-email");
    if (emailInput) {
      emailInput.value = "";
      emailInput.focus();
    }
    const passwordInput = document.getElementById("login-password");
    if (passwordInput) passwordInput.value = "";
  }
}

function hideLoginModal() {
  const modal = document.getElementById("profile-setup-modal");
  if (modal) modal.classList.remove("active");
}

function handleTraditionalLogin() {
  const emailInput = document.getElementById("login-email");
  const passwordInput = document.getElementById("login-password");
  const nameInput = document.getElementById("profile-name-input");

  if (!emailInput || !passwordInput) return;

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (email.includes("@") && password !== "") {
    const nickname = email.split("@")[0];
    
    // 1. 自動把暱稱填入 profile-name-input
    if (nameInput) nameInput.value = nickname;

    // 2. 更新使用者狀態
    currentUser = {
      googleId: "sandbox_user_" + Date.now(),
      name: nickname,
      handle: email === "admin@example.com" ? "@admin" : "@" + nickname,
      avatarLetter: nickname.substring(0, 2).toUpperCase() || "U",
      avatarUrl: null
    };

    localStorage.setItem("echoes_user", JSON.stringify(currentUser));
    applyCurrentUser();
    hideLoginModal();
    showToast(currentLang === "en" ? "Logged in successfully!" : "登入成功！");
    renderPostsList();
  } else {
    showToast(currentLang === "en" ? "Invalid email format or empty password!" : "請輸入包含「@」的有效 Email 與密碼！");
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

// Track active users cross-tab for admin panel
setInterval(() => {
  if (currentUser && currentUser.handle && currentUser.handle !== "@admin" && userOnline) {
    const onlineMap = JSON.parse(localStorage.getItem('echoes_online_users') || '{}');
    onlineMap[currentUser.handle] = Date.now();
    localStorage.setItem('echoes_online_users', JSON.stringify(onlineMap));
  }
  
  if (currentUser && currentUser.handle === "@admin") {
    renderAdminPresence();
  }
}, 3000);

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
const DATA_VERSION = "cyberpunk-v8";

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

  // Apply Permissions to Composer (since it's newly rendered)
  applyCurrentUser();

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

  const isWriteTab = window.location.hash === "#/write";

  let filtered = posts.filter(post => {
    const matchesCat = currentCategory === "All" || post.category === currentCategory;
    const matchesSearch = searchQuery === "" ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase());

    // Privacy access rule: Render if public, or if belongs to logged-in user
    const isPrivate = post.privacy === "private";
    const isMine = post.handle === currentUser.handle;
    const matchesPrivacy = !isPrivate || isMine || isAdmin; // Admin can see private posts for moderation

    const matchesTab = isWriteTab ? isMine : true;

    return matchesCat && matchesSearch && matchesPrivacy && matchesTab;
  });

  if (filtered.length === 0 && isWriteTab) {
    filtered.push(
      {
        id: "fake-1",
        author: currentUser.name,
        handle: currentUser.handle,
        avatarLetter: currentUser.avatarLetter || "ME",
        date: "剛剛",
        category: "Thoughts",
        privacy: "public",
        image: null,
        content: "💡 系統提示：目前為範例預覽畫面，當您發布自己的想法後，這裡將只會顯示您的專屬貼文。\n\n這是一篇關於學習筆記的範例。寫作不僅是記錄，更是重塑思考的過程。這片空間屬於你，開始記錄吧！",
        gradient: "linear-gradient(135deg, #181f2a 0%, #1ea34d 50%, #4ade80 100%)",
        likes: 0,
        likedByUser: false,
        comments: [],
        isDefault: true,
        isFakePlaceholder: true
      },
      {
        id: "fake-2",
        author: currentUser.name,
        handle: currentUser.handle,
        avatarLetter: currentUser.avatarLetter || "ME",
        date: "2小時前",
        category: "Life",
        privacy: "private",
        image: null,
        content: "💡 系統提示：這是一篇私密隨筆的範例。有時候只需要給自己一點喘息的空間。\n\n「自由不是想做什麼就做什麼，而是不想做什麼就能不做什麼。」",
        gradient: null,
        likes: 0,
        likedByUser: false,
        comments: [],
        isDefault: true,
        isFakePlaceholder: true
      }
    );
  }

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
        ${Array.isArray(post.image) ? `
          <div class="post-image-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 8px; margin-top: 12px; border-radius: 8px; overflow: hidden;">
            ${post.image.map(img => `<img src="${img}" class="post-image" style="width: 100%; height: 200px; object-fit: cover;" alt="Attached preview">`).join("")}
          </div>
        ` : post.image ? `
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
  renderTrendingTopics();
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

function renderTrendingTopics() {
  const listEl = document.getElementById("trending-topics-list");
  if (!listEl) return;

  const counts = {};

  if (Array.isArray(posts)) {
    posts.forEach(post => {
      // Safety check: ensure content is a valid string
      if (post && typeof post.content === 'string') {
        // Match hashtags starting with #, containing Chinese characters, letters, numbers, and underscores
        const tags = post.content.match(/#[A-Za-z0-9_\u4e00-\u9fa5]+/g);
        if (tags) {
          // De-duplicate tags in a single post to count at most once per post
          const uniqueTags = [...new Set(tags)];
          uniqueTags.forEach(tag => {
            counts[tag] = (counts[tag] || 0) + 1;
          });
        }
      }
    });
  }

  // Sort tags by frequency and get the top 4
  const sorted = Object.keys(counts)
    .map(tag => ({ tag, count: counts[tag] }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);

  if (sorted.length === 0) {
    listEl.innerHTML = `<li style="color: var(--text-muted); font-size: 11px;">${currentLang === "en" ? "No trending topics" : "目前尚無話題"}</li>`;
    return;
  }

  listEl.innerHTML = sorted.map(t => {
    const safeTag = escapeHTML(t.tag);
    return `
      <li class="trending-tag-item" data-tag="${safeTag}" style="cursor: pointer; transition: color 0.2s;" onmouseover="this.style.color='var(--neon-green)'" onmouseout="this.style.color=''">
        ${safeTag} <span style="color: var(--neon-green);">${t.count} ${currentLang === "en" ? "posts" : "貼文"}</span>
      </li>
    `;
  }).join("");

  // Add click event listener to each trending tag item to trigger filtering/searching
  listEl.querySelectorAll(".trending-tag-item").forEach(item => {
    item.addEventListener("click", () => {
      const tag = item.getAttribute("data-tag");
      searchQuery = tag;
      const searchInput = document.getElementById("feed-search");
      if (searchInput) searchInput.value = tag;
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

function renderAdminPresence() {
  const card = document.getElementById("admin-presence-card");
  const list = document.getElementById("admin-presence-list");
  if (!card || !list) return;

  if (currentUser.handle !== "@admin") {
    card.style.display = "none";
    return;
  }
  
  card.style.display = "block";
  
  const allHandles = new Set();
  posts.forEach(p => allHandles.add(p.handle));
  allHandles.delete("@admin");

  const onlineMap = JSON.parse(localStorage.getItem('echoes_online_users') || '{}');
  const now = Date.now();

  list.innerHTML = Array.from(allHandles).map(handle => {
    const lastSeen = onlineMap[handle] || 0;
    const isOnline = (now - lastSeen) < 10000;
    return `
      <li style="display: flex; align-items: center; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid var(--border-color);">
        <span style="font-size: 13px; color: var(--text-primary);">${handle}</span>
        <div style="display: flex; align-items: center; gap: 6px;">
          <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: ${isOnline ? 'var(--neon-green)' : 'var(--neon-red)'}; box-shadow: 0 0 5px ${isOnline ? 'var(--neon-green)' : 'var(--neon-red)'};"></span>
          <span style="font-size: 11px; color: var(--text-muted);">${isOnline ? 'Online' : 'Offline'}</span>
        </div>
      </li>
    `;
  }).join("");
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