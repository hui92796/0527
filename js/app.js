/**
 * ECHOES://FEED — Cyberpunk Social Terminal
 * Powered by Vanilla JS & LocalStorage
 */

// ==========================================================================
// PRESET GRADIENTS — CYBERPUNK NEON PALETTE
// ==========================================================================
const PRESET_GRADIENTS = [
  "linear-gradient(135deg, #0a0a0a 0%, #1a3a1a 50%, #39ff14 100%)", // Matrix Fade
  "linear-gradient(135deg, #000000 0%, #00e5ff 100%)",              // Cyber Cyan
  "linear-gradient(135deg, #1a002e 0%, #ff00ff 100%)",              // Neon Magenta
  "linear-gradient(135deg, #0a0a0a 0%, #ffbf00 100%)",              // Amber Warning
  "linear-gradient(135deg, #39ff14 0%, #00e5ff 100%)",              // Green-Cyan Flux
  "linear-gradient(135deg, #ff003c 0%, #ff00ff 100%)"               // Red-Magenta Glitch
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
    content: "建構你的極簡工作流 // KILL ALL NOISE\n\n- 關閉所有非必要推播通知\n- 單一資料來源：一個筆記庫統治一切\n- 時間區塊鎖定：一次只做一件事\n\n> 簡約是細緻的極致。 — Leonardo da Vinci\n\n你的專注力就是你的算力。別讓它被垃圾程序吞噬。",
    gradient: "linear-gradient(135deg, #0a0a0a 0%, #1a3a1a 50%, #39ff14 100%)",
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
    content: "CSS Variables 是被嚴重低估的超能力。\n\n它們是動態的，存在於 Runtime。深色/淺色主題切換？幾行搞定：\n\n```css\n:root { --bg: #050505; --neon: #39ff14; }\nhtml[data-theme=\"light\"] { --bg: #e8e8e8; --neon: #00aa00; }\n```\n\n這個終端的賽博朋克配色就是用這個原理打造的。沒有預處理器，沒有框架，純粹的原生力量。",
    gradient: "linear-gradient(135deg, #000000 0%, #00e5ff 100%)",
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
    content: "微互動 (Micro-interactions) 是 UI 的靈魂程序。\n\n這個終端裡的每個動畫都是刻意設計的：\n\n- 愛心點擊：放大心跳 + 螢光紅\n- 分享按鈕：一鍵複製 + 霓虹 Toast 彈出\n- 留言展開：平滑滑動進場\n- CRT 掃描線：全螢幕覆蓋層\n\n這些細節的目的只有一個：讓冰冷的像素產生呼吸感。\n\n歡迎點擊下方按鈕親自體驗。",
    gradient: "linear-gradient(135deg, #1a002e 0%, #ff00ff 100%)",
    likes: 156,
    likedByUser: false,
    comments: [],
    isDefault: true
  }
];

// ==========================================================================
// STATE VARIABLES
// ==========================================================================
let posts = [];
let currentCategory = "All";
let searchQuery = "";
let selectedGradient = null; // Store composer selected gradient

// ==========================================================================
// APPLICATION INITIALIZATION
// ==========================================================================
function init() {
  initTheme();
  loadPosts();
  initRouter();
}

// ==========================================================================
// THEME MANAGEMENT
// ==========================================================================
function initTheme() {
  const themeToggleBtn = document.getElementById("theme-toggle");
  const savedTheme = localStorage.getItem("echoes_theme");
  const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  // Default to Dark Mode for premium "Deep Ocean & Aurora" look
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
// DATA OPERATIONS
// ==========================================================================
const DATA_VERSION = "cyberpunk-v2"; // Bump this to force localStorage reset

function loadPosts() {
  const savedVersion = localStorage.getItem("echoes_data_version");

  // Force reset if data version changed (theme/schema upgrade)
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
            content: post.content || post.excerpt || "",
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
      console.error("// ERR: corrupted data, resetting...", e);
    }
  }

  posts = [...DEFAULT_POSTS];
  localStorage.setItem("echoes_posts", JSON.stringify(posts));
}

function savePosts() {
  localStorage.setItem("echoes_posts", JSON.stringify(posts));
}

function createPost(content, category, gradient) {
  const cleanCategory = category || "Thoughts";
  const newPost = {
    id: "post-" + Date.now(),
    author: "我",
    handle: "@me_creator",
    avatarLetter: "ME",
    date: "剛剛",
    category: cleanCategory.charAt(0).toUpperCase() + cleanCategory.slice(1),
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

  const container = document.getElementById("app-container");

  // Transition effect
  container.classList.remove("fade-in");
  void container.offsetWidth; // force reflow

  if (hash === "#/" || hash === "") {
    renderFeedView(container, false);
  } else if (hash === "#/write") {
    // Render home feed, but focus the post composer
    renderFeedView(container, true);
  } else if (hash === "#/about") {
    renderAboutView(container);
  } else {
    // 404 page
    container.innerHTML = `
      <div class="feed-container" style="text-align: center; padding: 80px 20px;">
        <h2 style="font-family: var(--font-heading); font-size: 48px; margin-bottom: 12px; background: linear-gradient(135deg, var(--text-primary), var(--accent-color)); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">404</h2>
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
  selectedGradient = null; // Reset gradient choice on render

  container.innerHTML = `
    <div class="feed-container">
      <!-- Composer Card -->
      <div class="composer-card">
        <div class="composer-main">
          <div class="user-avatar">ME</div>
          <div class="composer-inputs">
            <textarea id="composer-textarea" class="composer-textarea" placeholder="分享你的想法、隨筆或學習筆記..."></textarea>
            <div id="composer-gradient-preview" class="composer-gradient-preview">
              <!-- Inline gradient preview text gets injected here -->
            </div>
          </div>
        </div>
        
        <!-- Gradient Picker Row (Hidden by default, toggled via style button) -->
        <div id="composer-gradients-row" class="composer-gradients-row">
          <div class="composer-grad-option composer-grad-none selected" data-gradient="none">無</div>
          <!-- JS dynamic gradients -->
        </div>

        <div class="composer-divider"></div>

        <div class="composer-footer">
          <div class="composer-options">
            <button id="toggle-gradients-btn" class="composer-tool-btn" type="button">
              <i data-lucide="palette"></i>
              <span>樣式</span>
            </button>
            
            <select id="composer-category" class="composer-category-select">
              <option value="Thoughts">Thoughts (隨筆)</option>
              <option value="Tech">Tech (科技)</option>
              <option value="Productivity">Productivity (效率)</option>
              <option value="Life">Life (生活)</option>
              <option value="Design">Design (設計)</option>
            </select>
          </div>

          <button id="submit-post-btn" class="post-submit-btn" type="button">
            <i data-lucide="send"></i>
            <span>發佈貼文</span>
          </button>
        </div>
      </div>

      <!-- Search & Filters -->
      <div class="search-filter-section">
        <div class="search-input-wrapper">
          <i data-lucide="search"></i>
          <input type="text" id="feed-search" class="feed-search-input" placeholder="搜尋貼文關鍵字..." value="${searchQuery}">
        </div>
        <div class="categories-scroll" id="categories-scroll">
          <!-- Pills will be rendered here -->
        </div>
      </div>

      <!-- Posts List -->
      <div id="posts-feed-list">
        <!-- Social post cards will be rendered here -->
      </div>
    </div>
  `;

  // Bind Composer interactions
  setupComposer(shouldFocusComposer);

  // Render filter pills & feed items
  renderFilterPills();
  renderPostsList();

  // Bind Search input
  const searchInput = document.getElementById("feed-search");
  searchInput.addEventListener("input", (e) => {
    searchQuery = e.target.value;
    renderPostsList();
  });
}

function setupComposer(shouldFocusComposer) {
  const textarea = document.getElementById("composer-textarea");
  const gradientRow = document.getElementById("composer-gradients-row");
  const toggleGradBtn = document.getElementById("toggle-gradients-btn");
  const preview = document.getElementById("composer-gradient-preview");
  const submitBtn = document.getElementById("submit-post-btn");
  const categorySelect = document.getElementById("composer-category");

  // Auto-grow textarea height
  textarea.addEventListener("input", () => {
    textarea.style.height = "auto";
    textarea.style.height = (textarea.scrollHeight) + "px";

    // Update gradient preview content if active
    if (selectedGradient) {
      preview.innerHTML = escapeHTML(textarea.value) || "預覽文字";
    }
  });

  // Toggle Gradient Picker Row
  toggleGradBtn.addEventListener("click", () => {
    gradientRow.classList.toggle("active");
  });

  // Populate Gradients Options
  let gradHtml = PRESET_GRADIENTS.map(grad => `
    <div class="composer-grad-option" style="background: ${grad};" data-gradient="${grad}"></div>
  `).join("");
  gradientRow.innerHTML += gradHtml;

  // Handle Gradient Selection
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
        preview.innerHTML = escapeHTML(textarea.value) || "預覽文字";
        textarea.style.display = "none"; // Hide standard textarea and enter full-visual typing

        // Setup focus on preview so users can edit it or click it to return to normal
        showToast("編輯區移至預覽圖，再次點選「無」可還原");
      }
    });
  });

  // If user clicks the preview, let them type
  preview.addEventListener("click", () => {
    // Turn back to normal textarea to edit
    options.forEach(o => o.classList.remove("selected"));
    gradientRow.querySelector('[data-gradient="none"]').classList.add("selected");
    selectedGradient = null;
    preview.style.display = "none";
    textarea.style.display = "block";
    textarea.focus();
  });

  // Submit Post
  submitBtn.addEventListener("click", () => {
    const textVal = textarea.value.trim();
    if (!textVal) {
      showToast("請輸入貼文內容！");
      return;
    }

    const cat = categorySelect.value;
    createPost(textVal, cat, selectedGradient);

    // Reset Composer
    textarea.value = "";
    textarea.style.height = "auto";
    selectedGradient = null;
    preview.style.display = "none";
    textarea.style.display = "block";
    options.forEach(o => o.classList.remove("selected"));
    gradientRow.querySelector('[data-gradient="none"]').classList.add("selected");
    gradientRow.classList.remove("active");

    showToast("貼文已發佈！");

    // If we are on #/write hash, redirect back to #/ to clear hash
    if (window.location.hash === "#/write") {
      window.location.hash = "#/";
    } else {
      // Re-render feed
      renderPostsList();
      renderFilterPills();
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
      ${cat === "All" ? "全部動態" : cat}
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

  const filtered = posts.filter(post => {
    const matchesCat = currentCategory === "All" || post.category === currentCategory;
    const matchesSearch = searchQuery === "" ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  if (filtered.length === 0) {
    feedList.innerHTML = `
      <div style="text-align: center; padding: 40px 10px; color: var(--text-muted);">
        <i data-lucide="frown" style="width: 38px; height: 38px; margin-bottom: 12px;"></i>
        <p>沒有找到相符的貼文，寫一篇新的吧！</p>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  feedList.innerHTML = filtered.map(post => {
    const hasGradient = post.gradient !== null && post.gradient !== undefined;

    return `
      <div class="post-card" id="card-${post.id}">
        <div class="post-header">
          <div class="post-author-wrapper">
            <div class="user-avatar" style="background: ${post.isDefault ? 'var(--bg-tertiary)' : 'linear-gradient(135deg, var(--accent-color) 0%, #06b6d4 100%)'}; color: ${post.isDefault ? 'var(--accent-color)' : '#ffffff'}">
              ${post.avatarLetter}
            </div>
            <div class="post-author-details">
              <span class="post-author-name">${escapeHTML(post.author)}</span>
              <span class="post-author-handle">${post.handle}</span>
            </div>
          </div>
          <div class="post-meta-right">
            <span class="post-category-tag">${post.category}</span>
            <span class="post-time">${post.date}</span>
          </div>
        </div>

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

          ${!post.isDefault ? `
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
            <input type="text" class="comment-input" id="comment-input-${post.id}" placeholder="留下你的回覆...">
            <button class="comment-submit-btn" data-post-id="${post.id}">回覆</button>
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
    });
  });

  // 2. Comments Toggle Action
  document.querySelectorAll(".btn-comment").forEach(btn => {
    btn.addEventListener("click", () => {
      const postId = btn.getAttribute("data-post-id");
      const commentsSection = document.getElementById(`comments-sec-${postId}`);
      commentsSection.classList.toggle("active");
      btn.classList.toggle("active");
    });
  });

  // 3. Comments Submit Action
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
        author: "訪客",
        text: text,
        time: "剛剛"
      };

      post.comments.push(newComment);
      savePosts();

      // Update comment counter text in post card action row
      const commentBtnText = document.querySelector(`.btn-comment[data-post-id="${postId}"] span`);
      if (commentBtnText) commentBtnText.textContent = post.comments.length;

      // Re-render comments list
      const listContainer = document.getElementById(`comments-list-${postId}`);
      listContainer.innerHTML = renderCommentsList(post.comments);

      // Reset input
      input.value = "";
      showToast("回覆成功！");
    });
  });

  // 4. Share Action (Copy to clipboard & Toast alert)
  document.querySelectorAll(".btn-share").forEach(btn => {
    btn.addEventListener("click", () => {
      const postId = btn.getAttribute("data-post-id");
      const post = posts.find(p => p.id === postId);
      if (!post) return;

      // Copy text content
      const copyText = `${post.author} (${post.handle}): \n"${post.content}"\n\n來自 Echoes Feed 的分享`;
      navigator.clipboard.writeText(copyText).then(() => {
        showToast("貼文內容與分享連結已複製！");
      }).catch(err => {
        console.error("無法複製文字", err);
        showToast("複製失敗，請手動選取複製");
      });
    });
  });

  // 5. Delete Action (With visual fadeout transition)
  document.querySelectorAll(".post-action-delete").forEach(btn => {
    btn.addEventListener("click", () => {
      if (confirm("確定要刪除這篇貼文嗎？")) {
        const postId = btn.getAttribute("data-post-id");
        const card = document.getElementById(`card-${postId}`);

        // Visual fade out before removing
        card.style.opacity = "0";
        card.style.transform = "translateY(15px)";
        card.style.transition = "all 0.35s ease";

        setTimeout(() => {
          deletePost(postId);
          renderPostsList();
          renderFilterPills();
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

  // Slide up and fade out handled by CSS transition
  // Remove toast from DOM after animations finish
  setTimeout(() => {
    toast.remove();
  }, 2600);
}

// ==========================================================================
// ABOUT VIEW RENDERING
// ==========================================================================
function renderAboutView(container) {
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

    // Headers ##
    if (line.startsWith("## ")) {
      if (inList) { result.push("</ul>"); inList = false; }
      result.push(`<h2>${line.substring(3)}</h2>`);
      continue;
    }

    // Headers ###
    if (line.startsWith("### ")) {
      if (inList) { result.push("</ul>"); inList = false; }
      result.push(`<h3>${line.substring(4)}</h3>`);
      continue;
    }

    // Quotes >
    if (line.startsWith("&gt; ")) {
      if (inList) { result.push("</ul>"); inList = false; }
      result.push(`<blockquote>${line.substring(5)}</blockquote>`);
      continue;
    }

    // Lists -
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

    // Inline elements: `code`
    line = line.replace(/`([^`]+)`/g, "<code>$1</code>");
    result.push(`<p>${line}</p>`);
  }

  if (inList) {
    result.push("</ul>");
  }

  let finalHtml = result.join("\n");

  // Code block parser ```
  finalHtml = finalHtml.replace(/```(\w+)?\n([\s\S]*?)\n```/g, "<pre><code>$2</code></pre>");
  finalHtml = finalHtml.replace(/```([\s\S]*?)```/g, "<pre><code>$1</code></pre>");

  return finalHtml;
}

// Start application
window.addEventListener("DOMContentLoaded", init);
// ==========================================================================
// 🔗 獨立後台傳送門（無痛嵌入導覽列）
// ==========================================================================
(function () {
  window.addEventListener('DOMContentLoaded', () => {
    // 尋找前台導覽列文字包含「關於我」的按鈕或連結
    const navLinks = Array.from(document.querySelectorAll('a, span, li, button'));
    const aboutLink = navLinks.find(el => el.textContent.trim().includes('關於我'));

    if (aboutLink) {
      // 建立對應 admin.html 的傳送連結
      const adminLink = document.createElement('a');
      adminLink.href = 'admin.html';
      adminLink.innerHTML = ' > 後台管理'; // 完美配合你原本的導覽列樣式
      adminLink.className = aboutLink.className;

      Object.assign(adminLink.style, {
        color: '#64748b',
        textDecoration: 'none',
        marginLeft: '15px',
        transition: 'color 0.2s',
        cursor: 'pointer'
      });

      adminLink.addEventListener('mouseenter', () => adminLink.style.color = '#22c55e');
      adminLink.addEventListener('mouseleave', () => adminLink.style.color = '#64748b');

      // 插在「關於我」後面
      aboutLink.parentNode.insertBefore(adminLink, aboutLink.nextSibling);
    }
  });
})();

// ====== 本地圖片上傳功能 ======
const imageBtn = document.getElementById('btn-trigger-image-popup');
const fileInput = document.getElementById('file-upload-input');
const previewBox = document.getElementById('image-preview-box');
const previewImg = document.getElementById('image-preview-img');


// 1. 當點擊圖片圖示時，模擬點擊隱藏的檔案上傳欄位
if (imageBtn && fileInput) {
  imageBtn.addEventListener('click', (e) => {
    e.preventDefault(); // 阻止原本跳出 URL 視窗的預設行為
    e.stopPropagation();
    fileInput.click();
  });
}


// 2. 當使用者選擇好照片後，讀取照片並顯示在預覽視窗
if (fileInput) {
  fileInput.addEventListener('change', function () {
    const file = this.files[0];

    if (file) {
      const reader = new FileReader();

      reader.addEventListener('load', function () {
        // 將讀取到的圖片 Base64 編碼塞入原本的預覽圖片標籤
        if (previewImg && previewBox) {
          previewImg.src = this.result;
          previewBox.style.display = 'block'; // 顯示預覽區塊

          // 如果你的專案有給預覽區塊加上 active 或是 show 的 class，也可以在這裡加上
          previewBox.classList.add('active');
        }
      });

      reader.readAsDataURL(file); // 開始讀取檔案
    }
  });
}

const imageInput = document.getElementById('image-input');
const uploadBtn = document.getElementById('upload-btn');
const previewContainer = document.getElementById('image-preview-container');

// 點擊自訂按鈕時，觸發真正的檔案選擇框
if (uploadBtn) {
  uploadBtn.addEventListener('click', () => imageInput.click());
}

// 當使用者選好圖片時
if (imageInput) {
  imageInput.addEventListener('change', function () {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        // 清除舊預覽並顯示新預覽
        previewContainer.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
      }
      reader.readAsDataURL(file);
    }
  });
}

// 記得呼叫 lucide.createIcons() 讓圖標顯示
if (window.lucide) {
  lucide.createIcons();
}