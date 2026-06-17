import { useState, useEffect, useRef, useMemo } from 'react';
import {
  Moon,
  Sun,
  Home,
  Bell,
  Mail,
  Bookmark,
  LogIn,
  LogOut,
  Heart,
  MessageSquare,
  Send,
  Trash2,
  Lock,
  Palette,
  Image as ImageIcon,
  Search,
  Frown,
  CheckCircle2,
  Terminal,
  Shield,
  Hash,
  Radio,
  Pencil,
  Globe,
  Phone,
  Upload,
  X
} from 'lucide-react';
import { db, isFirebaseSetup } from "./firebase";
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, doc, deleteDoc, arrayUnion, arrayRemove, writeBatch } from "firebase/firestore";
import './App.css';

// ==========================================================================
// CONSTANTS & PRESETS
// ==========================================================================
const PRESET_GRADIENTS = [
  "linear-gradient(135deg, #181f2a 0%, #1ea34d 50%, #4ade80 100%)", // Aurora Fade
  "linear-gradient(135deg, #181f2a 0%, #38bdf8 100%)",              // Cyber Sky
  "linear-gradient(135deg, #181f2a 0%, #f472b6 100%)",              // Cyber Lavender
  "linear-gradient(135deg, #1a222f 0%, #fbbf24 100%)",              // Amber Horizon
  "linear-gradient(135deg, #4ade80 0%, #38bdf8 100%)",              // Mint-Cyan Flux
  "linear-gradient(135deg, #f87171 0%, #f472b6 100%)"               // Soft Rose Glitch
];

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

const DEFAULT_REPORTS = [
  { id: "rep-1", postId: "def-post-1", author: "GHOST_RUNNER", reason: "廣告與垃圾訊息 (Spam)", reporter: "@neon_dev", status: "待處理" },
  { id: "rep-2", postId: "def-post-3", author: "SIGNAL_LOST", reason: "敏感或有害內容 (Harassment)", reporter: "@sig_lost", status: "待處理" }
];

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

const navigateToHash = (hash) => {
  window.location.hash = hash;
};



// Dynamic Relative Date formatter
const formatRelativeDate = (dateObj, currentLang) => {
  const diffMs = Date.now() - dateObj.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (currentLang === "en") {
    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  } else {
    if (diffMins < 1) return "剛剛";
    if (diffMins < 60) return `${diffMins}分鐘前`;
    if (diffHours < 24) return `${diffHours}小時前`;
    return `${diffDays}天前`;
  }
};


// Helper to safely parse simple markdown into html structure
const parseSimpleMarkdown = (markdown) => {
  if (!markdown) return "";
  let html = markdown
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

  const lines = html.split("\n");
  let inList = false;
  let result = [];

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();

    if (line === "") {
      if (inList) {
        result.push("</ul>");
        inList = false;
      }
      continue;
    }

    if (line.startsWith("## ")) {
      if (inList) {
        result.push("</ul>");
        inList = false;
      }
      result.push(`<h2>${line.substring(3)}</h2>`);
      continue;
    }

    if (line.startsWith("### ")) {
      if (inList) {
        result.push("</ul>");
        inList = false;
      }
      result.push(`<h3>${line.substring(4)}</h3>`);
      continue;
    }

    if (line.startsWith("&gt; ")) {
      if (inList) {
        result.push("</ul>");
        inList = false;
      }
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
};

export default function App() {
  // ==========================================================================
  // STATE MANAGEMENT
  // ==========================================================================
  
  // App routing and translation
  const [currentRoute, setCurrentRoute] = useState(() => {
    return window.location.hash || "#/";
  });
  const [currentLang, setCurrentLang] = useState(() => {
    return localStorage.getItem("echoes_lang") || (navigator.language.startsWith("en") ? "en" : "zh-Hant");
  });
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("echoes_theme") || "dark";
  });

  // User online status & active trackers
  const [userOnline, setUserOnline] = useState(true);
  const [isManualOffline, setIsManualOffline] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState({});
  const idleTimerRef = useRef(null);

  // Authentication & Moderator
  const [currentUser, setCurrentUser] = useState(() => {
    const cached = localStorage.getItem("echoes_user");
    if (cached) {
      try { return JSON.parse(cached); } catch { /* ignore */ }
    }
    return { name: "我", handle: "@me_creator", avatarLetter: "ME", avatarUrl: null };
  });
  const [adminAuthenticated, setAdminAuthenticated] = useState(() => {
    return sessionStorage.getItem("admin_authenticated") === "true";
  });

  // Main Posts Data
  const [posts, setPosts] = useState(() => {
    if (!isFirebaseSetup) {
      const localPosts = localStorage.getItem("echoes_posts");
      if (localPosts) {
        try {
          return JSON.parse(localPosts);
        } catch { /* ignore */ }
      }
      return [...DEFAULT_POSTS];
    }
    return [];
  });

  // Admin Reports Data
  const [reports, setReports] = useState(() => {
    const stored = localStorage.getItem("echoes_reports");
    if (stored) {
      try { return JSON.parse(stored); } catch { /* ignore */ }
    }
    return DEFAULT_REPORTS;
  });

  // Sidebar dynamic states
  const [searchQuery, setSearchQuery] = useState("");
  const [searchHistory, setSearchHistory] = useState(() => {
    const saved = localStorage.getItem("echoes_search_history");
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return [];
  });
  const [currentCategory, setCurrentCategory] = useState("All");

  // Modals Visibility
  const [modalLoginVisible, setModalLoginVisible] = useState(false);
  const [modalAdminVisible, setModalAdminVisible] = useState(false);
  const [modalContactVisible, setModalContactVisible] = useState(false);
  const [modalProfileVisible, setModalProfileVisible] = useState(false);

  // Form Inputs
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactWebsite, setContactWebsite] = useState("");

  const [profileName, setProfileName] = useState("");
  const [profilePresetAv, setProfilePresetAv] = useState(null);
  const [profileCustomAv, setProfileCustomAv] = useState(null);

  // Composer Form Inputs
  const [composerText, setComposerText] = useState("");
  const [composerCategory, setComposerCategory] = useState("Thoughts");
  const [composerPrivacy, setComposerPrivacy] = useState("public");
  const [composerGradient, setComposerGradient] = useState(null);
  const [composerImage, setComposerImage] = useState(null);
  const [showGradientsRow, setShowGradientsRow] = useState(false);

  // Post Specific States (Expanded comments section, active drafts, highlights)
  const [activeCommentsPostId, setActiveCommentsPostId] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const [highlightedPostId, setHighlightedPostId] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [currentTime, setCurrentTime] = useState(() => Date.now());
  const [contactInfo, setContactInfo] = useState(() => {
    const saved = localStorage.getItem("echoes_contact_info");
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return { phone: "", email: "", website: "" };
  });
  
  // Easter Egg count tracker
  const copyrightClickRef = useRef({ count: 0, timer: null });

  // Translation function wrapper
  const t = (key) => {
    return I18N[currentLang]?.[key] || I18N["zh-Hant"]?.[key] || key;
  };

  // Check login validation
  const isLoggedIn = !!(currentUser.googleId && currentUser.handle !== "@me_creator");

  // ==========================================================================
  // SYNC EFFECTS
  // ==========================================================================

  // Synchronize routing hashes
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash || "#/";
      setCurrentRoute(hash);
      
      // Auto authenticating redirect logic for admin page
      if (hash === "#/admin" && sessionStorage.getItem("admin_authenticated") !== "true") {
        navigateToHash("#/");
        setModalAdminVisible(true);
      }
    };
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  // Synchronize CSS custom theme state
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("echoes_theme", theme);
  }, [theme]);

  // Sync state values with LocalStorage
  useEffect(() => {
    if (!isFirebaseSetup) {
      localStorage.setItem("echoes_posts", JSON.stringify(posts));
    }
  }, [posts]);

  useEffect(() => {
    localStorage.setItem("echoes_user", JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem("echoes_search_history", JSON.stringify(searchHistory));
  }, [searchHistory]);

  useEffect(() => {
    localStorage.setItem("echoes_reports", JSON.stringify(reports));
  }, [reports]);

  // Seeding initial template posts to Firestore Database if empty
  const seedDefaultPosts = async () => {
    try {
      console.log("Seeding default posts to Firestore...");
      const batch = writeBatch(db);
      DEFAULT_POSTS.forEach((post) => {
        const docRef = doc(collection(db, "posts"));
        batch.set(docRef, {
          author: post.author,
          handle: post.handle,
          avatarLetter: post.avatarLetter,
          category: post.category,
          privacy: post.privacy,
          image: post.image || null,
          content: post.content,
          gradient: post.gradient || null,
          likedBy: [],
          likes: post.likes,
          comments: post.comments.map(c => ({
            id: c.id,
            author: c.author,
            text: c.text,
            time: c.time
          })),
          isDefault: true,
          createdAt: new Date(Date.now() - 3600000 * 2) // Offset for sorting order
        });
      });
      await batch.commit();
    } catch (err) {
      console.error("Seeding failed", err);
    }
  };

  // Fetch / Subscribe to Posts Collection
  useEffect(() => {
    if (!isFirebaseSetup) {
      return;
    }

    // Firestore mode subscription
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsList = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        postsList.push({
          id: doc.id,
          ...data,
          date: data.createdAt ? formatRelativeDate(data.createdAt.toDate(), currentLang) : "just now",
        });
      });

      if (postsList.length === 0) {
        seedDefaultPosts();
      } else {
        setPosts(postsList);
      }
    }, (error) => {
      console.error("Firestore loading error:", error);
      // Fallback
      setPosts([...DEFAULT_POSTS]);
    });

    return () => unsubscribe();
  }, [currentLang]);

  useEffect(() => {
    localStorage.setItem("echoes_lang", currentLang);
  }, [currentLang]);

  // Online status updates / Interaction sensors
  useEffect(() => {
    const handleActivity = () => {
      if (isManualOffline) return;
      setUserOnline(currentOnline => {
        if (!currentOnline) return true;
        return currentOnline;
      });
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(() => {
        setUserOnline(false);
      }, 300000); // 5 minutes inactivity
    };

    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keypress", handleActivity);
    window.addEventListener("scroll", handleActivity);
    window.addEventListener("click", handleActivity);
    window.addEventListener("focus", handleActivity);

    // Initial timeout setup
    idleTimerRef.current = setTimeout(() => {
      setUserOnline(false);
    }, 300000);

    return () => {
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keypress", handleActivity);
      window.removeEventListener("scroll", handleActivity);
      window.removeEventListener("click", handleActivity);
      window.removeEventListener("focus", handleActivity);
      clearTimeout(idleTimerRef.current);
    };
  }, [isManualOffline]);

  // Cross-tab active presence tracker
  useEffect(() => {
    const checkPresence = () => {
      const now = Date.now();
      setCurrentTime(now);
      // 1. Register active user timestamp
      if (currentUser && currentUser.handle && currentUser.handle !== "@admin" && userOnline && !isManualOffline) {
        const onlineMap = JSON.parse(localStorage.getItem('echoes_online_users') || '{}');
        onlineMap[currentUser.handle] = now;
        localStorage.setItem('echoes_online_users', JSON.stringify(onlineMap));
      }

      // 2. Fetch all online accounts if administrator active
      if (currentUser && currentUser.handle === "@admin") {
        const onlineMap = JSON.parse(localStorage.getItem('echoes_online_users') || '{}');
        setOnlineUsers(onlineMap);
      }
    };

    checkPresence();
    const interval = setInterval(checkPresence, 3000);
    return () => clearInterval(interval);
  }, [currentUser, userOnline, isManualOffline]);

  // ==========================================================================
  // ACTION HANDLERS
  // ==========================================================================

  const showToast = (message) => {
    // eslint-disable-next-line react-hooks/purity
    const id = Date.now() + Math.random().toString();
    setToasts(prev => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 2600);
  };

  // Keyboard shortcut Ctrl+Shift+X for Admin portal
  useEffect(() => {
    const handleAdminKey = (e) => {
      if (e.ctrlKey && e.shiftKey && e.code === "KeyX") {
        e.preventDefault();
        setModalAdminVisible(true);
      }
    };
    window.addEventListener("keydown", handleAdminKey);
    return () => window.removeEventListener("keydown", handleAdminKey);
  }, []);

  const handleCopyrightClick = () => {
    const state = copyrightClickRef.current;
    state.count++;
    clearTimeout(state.timer);
    if (state.count >= 5) {
      state.count = 0;
      setModalAdminVisible(true);
    } else {
      state.timer = setTimeout(() => {
        state.count = 0;
      }, 2000);
    }
  };

  // Handle Traditional Login
  const submitTraditionalLogin = () => {
    const email = loginEmail.trim();
    const password = loginPassword.trim();

    if (email.includes("@") && password !== "") {
      const nickname = email.split("@")[0];
      const nextUser = {
        // eslint-disable-next-line react-hooks/purity
        googleId: "sandbox_user_" + Date.now(),
        name: nickname,
        handle: email === "admin@example.com" ? "@admin" : "@" + nickname,
        avatarLetter: nickname.substring(0, 2).toUpperCase() || "U",
        avatarUrl: null
      };

      setCurrentUser(nextUser);
      setModalLoginVisible(false);
      setLoginEmail("");
      setLoginPassword("");
      showToast(t("toast_logged_in"));
    } else {
      showToast(currentLang === "en" ? "Invalid email format or empty password!" : "請輸入包含「@」的有效 Email 與密碼！");
    }
  };

  const handleLogout = () => {
    setCurrentUser({
      name: "我",
      handle: "@me_creator",
      avatarLetter: "ME",
      avatarUrl: null
    });
    setAdminAuthenticated(false);
    sessionStorage.removeItem("admin_authenticated");
    if (window.location.hash === "#/admin") {
      navigateToHash("#/");
    }
    showToast(t("toast_logged_out"));
  };

  // Secure admin authenticate login
  const submitAdminLogin = () => {
    if (adminPassword.trim() === "cyberadmin") {
      sessionStorage.setItem("admin_authenticated", "true");
      setAdminAuthenticated(true);
      setModalAdminVisible(false);
      setAdminPassword("");
      navigateToHash("#/admin");
    } else {
      showToast(t("admin_modal_wrong"));
      setAdminPassword("");
    }
  };

  // Contact info details update
  const submitContactSave = () => {
    const nextContact = {
      phone: contactPhone,
      email: contactEmail,
      website: contactWebsite
    };
    localStorage.setItem("echoes_contact_info", JSON.stringify(nextContact));
    setContactInfo(nextContact);
    setModalContactVisible(false);
    showToast(currentLang === "en" ? "Contact info saved!" : "聯絡資訊已儲存！");
  };

  // Update profile setup details
  const submitProfileSave = () => {
    const name = profileName.trim() || currentUser.name;
    const handle = "@" + name.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_\u4e00-\u9fff]/g, "").substring(0, 20);

    const nextUser = { ...currentUser, name, handle };

    if (profileCustomAv) {
      nextUser.avatarUrl = profileCustomAv;
      nextUser.avatarLetter = name.substring(0, 2).toUpperCase();
      nextUser.avatarBg = null;
    } else if (profilePresetAv) {
      nextUser.avatarUrl = null;
      nextUser.avatarBg = profilePresetAv.bg;
      nextUser.avatarLetter = profilePresetAv.letter;
    } else {
      nextUser.avatarLetter = name.substring(0, 2).toUpperCase();
    }

    // Mark cache profile setup complete
    if (currentUser.googleId) {
      localStorage.setItem("echoes_profile_" + currentUser.googleId, "true");
    }

    setCurrentUser(nextUser);
    setModalProfileVisible(false);
    setProfileName("");
    setProfilePresetAv(null);
    setProfileCustomAv(null);
    showToast(currentLang === "en" ? "✨ Profile saved!" : "✨ 個人資料已儲存！");
  };

  // Custom Avatar Upload Reader
  const handleAvatarFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      showToast(currentLang === "en" ? "Image too large (Max 2MB)" : "圖片過大 (上限 2MB)");
      return;
    }
    const reader = new FileReader();
    reader.onload = (evt) => {
      setProfileCustomAv(evt.target.result);
      setProfilePresetAv(null);
    };
    reader.readAsDataURL(file);
  };

  // Direct User Profile Click Upload Trigger
  const handleDirectAvatarUpload = (e) => {
    if (!isLoggedIn) return;
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        setCurrentUser(prev => ({
          ...prev,
          avatarUrl: evt.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Composer photo upload processing
  const handleComposerPhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showToast(currentLang === "en" ? "Image too large (Max 2MB)" : "圖片檔案過大 (最大限制 2MB)");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setComposerImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Publish Post action
  const handlePublishPost = async () => {
    const textVal = composerText.trim();
    if (!textVal) {
      showToast(t("toast_no_text"));
      return;
    }

    const postData = {
      author: currentUser.name,
      handle: currentUser.handle,
      avatarLetter: currentUser.avatarLetter || currentUser.name.substring(0, 2).toUpperCase(),
      category: composerCategory.charAt(0).toUpperCase() + composerCategory.slice(1),
      privacy: composerPrivacy,
      image: composerImage || null,
      content: textVal,
      gradient: composerGradient,
      likedBy: [],
      likes: 0,
      comments: [],
      isDefault: false
    };

    if (isFirebaseSetup) {
      try {
        await addDoc(collection(db, "posts"), {
          ...postData,
          createdAt: new Date()
        });
      } catch (err) {
        console.error("Failed to add post to Firestore:", err);
        showToast("無法同步發佈貼文到雲端，將寫入本地");
        prependLocalPost(postData);
      }
    } else {
      prependLocalPost(postData);
    }

    // Reset composer
    setComposerText("");
    setComposerGradient(null);
    setComposerImage(null);
    setShowGradientsRow(false);
    showToast(t("toast_post_created"));
    if (currentRoute === "#/write") {
      navigateToHash("#/");
    }
  };

  const prependLocalPost = (postData) => {
    const newPost = {
      // eslint-disable-next-line react-hooks/purity
      id: "post-" + Date.now(),
      date: currentLang === "en" ? "just now" : "剛剛",
      ...postData
    };
    setPosts(prev => [newPost, ...prev]);
  };

  // Likes and toggles
  const handleLikePost = async (postId) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    if (isFirebaseSetup && post.likedBy) {
      const hasLiked = post.likedBy.includes(currentUser.handle);
      try {
        const postDocRef = doc(db, "posts", postId);
        await updateDoc(postDocRef, {
          likedBy: hasLiked ? arrayRemove(currentUser.handle) : arrayUnion(currentUser.handle)
        });
      } catch (err) {
        console.error("Failed to update like in Firestore:", err);
      }
    } else {
      setPosts(prev => prev.map(p => {
        if (p.id === postId) {
          const liked = !p.likedByUser;
          return {
            ...p,
            likedByUser: liked,
            likes: liked ? p.likes + 1 : p.likes - 1
          };
        }
        return p;
      }));
    }
  };

  // Comment adding
  const submitComment = async (postId) => {
    const text = (commentInputs[postId] || "").trim();
    if (!text) return;

    const newComment = {
      // eslint-disable-next-line react-hooks/purity
      id: "c-" + Date.now(),
      author: currentUser.name,
      text: text,
      time: currentLang === "en" ? "just now" : "剛剛"
    };

    if (isFirebaseSetup) {
      try {
        const postDocRef = doc(db, "posts", postId);
        await updateDoc(postDocRef, {
          comments: arrayUnion(newComment)
        });
      } catch (err) {
        console.error("Failed to submit comment to Firestore:", err);
        showToast("無法同步留言到雲端");
      }
    } else {
      setPosts(prev => prev.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            comments: [...p.comments, newComment]
          };
        }
        return p;
      }));
      showToast(t("toast_reply_success"));
    }
    setCommentInputs(prev => ({ ...prev, [postId]: "" }));
  };

  // Delete post
  const handleDeletePost = async (postId) => {
    const confirmMsg = currentLang === "en" ? "Delete this post?" : "確定要刪除這篇貼文嗎？";
    if (window.confirm(confirmMsg)) {
      if (isFirebaseSetup) {
        try {
          await deleteDoc(doc(db, "posts", postId));
        } catch (err) {
          console.error("Failed to delete post from Firestore:", err);
          showToast("無法從雲端刪除貼文");
        }
      } else {
        setPosts(prev => prev.filter(p => p.id !== postId));
      }
    }
  };

  // Search input and Easter Egg Admin Portal check
  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter") {
      const val = searchQuery.trim();
      if (val === "admin" || val === "/admin") {
        setSearchQuery("");
        setModalAdminVisible(true);
        return;
      }
      if (val && !searchHistory.includes(val)) {
        setSearchHistory(prev => {
          const next = [val, ...prev];
          if (next.length > 5) next.pop();
          return next;
        });
      }
    }
  };

  const handleClearHistory = () => {
    setSearchHistory([]);
  };

  // Bookmark navigation highlights
  const handleBookmarkItemClick = (postId) => {
    setHighlightedPostId(postId);
    const card = document.getElementById(`card-${postId}`);
    if (card) {
      card.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    setTimeout(() => {
      setHighlightedPostId(null);
    }, 3000);
  };

  // Moderation action triggers
  const handleAdminDeletePost = async (postId) => {
    if (window.confirm('警告：確定要從資料庫永久刪除該貼文嗎？此操作無法還原。')) {
      if (isFirebaseSetup) {
        try {
          await deleteDoc(doc(db, "posts", postId));
          showToast("已從雲端資料庫強制刪除該貼文");
        } catch (err) {
          console.error("Failed to delete post from Firestore:", err);
          showToast("無法從雲端刪除貼文");
        }
      } else {
        setPosts(prev => prev.filter(p => p.id !== postId));
      }
    }
  };

  const handleAdminModerate = async (postId, reportId) => {
    if (window.confirm('確認判定貼文違規並進行下架刪除嗎？')) {
      if (isFirebaseSetup) {
        try {
          await deleteDoc(doc(db, "posts", postId));
          showToast("已下架該違規貼文");
        } catch (err) {
          console.error("Failed to delete post from Firestore:", err);
          showToast("無法從雲端刪除貼文");
        }
      } else {
        setPosts(prev => prev.filter(p => p.id !== postId));
      }
      setReports(prev => prev.map(r => r.id === reportId ? { ...r, status: '已處理' } : r));
    }
  };

  const handleAdminDismissReport = (reportId) => {
    if (window.confirm('確認要駁回此項檢舉嗎？這將標記案件為已處理但保留貼文。')) {
      setReports(prev => prev.map(r => r.id === reportId ? { ...r, status: '已處理' } : r));
    }
  };

  const handleAdminPurgeDatabase = () => {
    if (window.confirm('🔥 終極警告！此操作將抹除 LocalStorage 中所有的貼文與檢舉數據。您確定要執行系統重置？')) {
      setPosts([]);
      setReports([]);
      localStorage.removeItem("echoes_posts");
      localStorage.removeItem("echoes_reports");
      showToast(currentLang === "en" ? "Database reset completed!" : "資料庫重置完成！");
    }
  };

  const handleAdminLogout = () => {
    sessionStorage.removeItem("admin_authenticated");
    setAdminAuthenticated(false);
    navigateToHash("#/");
  };

  // Share post text generator
  const handleSharePost = (post) => {
    const copyText = `${post.author} (${post.handle}): \n"${post.content}"\n\n來自 Echoes Feed 的分享`;
    navigator.clipboard.writeText(copyText).then(() => {
      showToast(t("toast_copied"));
    }).catch(err => {
      console.error("Copy failed", err);
      showToast(t("toast_copy_failed"));
    });
  };

  // ==========================================================================
  // DATA PARSING & FILTER PIPELINE
  // ==========================================================================

  // Trending hashtags extractor
  const trendingTags = useMemo(() => {
    const counts = {};
    posts.forEach(post => {
      if (post && typeof post.content === 'string') {
        const tags = post.content.match(/#[A-Za-z0-9_\u4e00-\u9fa5]+/g);
        if (tags) {
          const uniqueTags = [...new Set(tags)];
          uniqueTags.forEach(tag => {
            counts[tag] = (counts[tag] || 0) + 1;
          });
        }
      }
    });

    return Object.keys(counts)
      .map(tag => ({ tag, count: counts[tag] }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 4);
  }, [posts]);

  // Filter posts based on user constraints
  const isWriteTab = currentRoute === "#/write";
  
  const filteredPosts = useMemo(() => {
    let list = posts.filter(post => {
      const matchesCat = currentCategory === "All" || post.category === currentCategory;
      const matchesSearch = searchQuery === "" ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.author.toLowerCase().includes(searchQuery.toLowerCase());

      const isPrivate = post.privacy === "private";
      const isMine = post.handle === currentUser.handle;
      const matchesPrivacy = !isPrivate || isMine || adminAuthenticated;

      const matchesTab = isWriteTab ? isMine : true;

      return matchesCat && matchesSearch && matchesPrivacy && matchesTab;
    });

    // Feed placeholder for newly logged-in writer views
    if (list.length === 0 && isWriteTab) {
      list = [
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
      ];
    }
    return list;
  }, [posts, currentCategory, searchQuery, currentUser.handle, currentUser.name, currentUser.avatarLetter, adminAuthenticated, isWriteTab]);

  // Categories pill filters list
  const categoryFilterList = useMemo(() => {
    const list = new Set(posts.map(p => p.category));
    return ["All", ...list];
  }, [posts]);

  // ==========================================================================
  // VIEW RENDER PARTS
  // ==========================================================================

  // Admin Dashboard Component view
  const renderAdminConsole = () => {
    const systemCount = posts.filter(p => p.isDefault || p.id.toString().startsWith('def-')).length;
    const userCount = posts.length - systemCount;

    return (
      <div className="admin-container" style={{ width: '100%', maxWidth: '1100px', margin: '0 auto', padding: '0px 20px 40px' }}>
        <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--border-color)', paddingBottom: '20px', marginBottom: '30px' }}>
          <div className="admin-title">
            <h1 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: '24px', color: 'var(--accent)', textShadow: 'var(--glow-green)', letterSpacing: '1px' }}>SYS.ADMIN_CONSOLE // 貼文內容審查</h1>
            <p style={{ margin: '5px 0 0 0', color: 'var(--text-secondary)', fontSize: '13px' }}>權限：系統管理員 (ADMINISTRATOR) | 資料庫同步模式：{isFirebaseSetup ? "Firebase 雲端資料庫" : "LocalStorage (本機暫存)"}</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-logout" id="btn-logout" style={{ border: '1px solid var(--text-muted)', background: 'transparent', color: 'var(--text-secondary)', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontFamily: 'inherit' }} onClick={handleAdminLogout}>登出安全模式</button>
            <button className="btn btn-danger" id="btn-purge" style={{ border: '1px solid var(--neon-red)', background: 'transparent', color: 'var(--neon-red)', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontFamily: 'inherit' }} onClick={handleAdminPurgeDatabase}>清空資料庫</button>
          </div>
        </div>

        <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' }}>
          <div className="stat-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '20px' }}>
            <div className="label" style={{ fontSize: '13px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>當前貼文總數</div>
            <div className="value" style={{ fontSize: '32px', fontWeight: 700, marginTop: '5px', color: 'var(--neon-cyan)', fontFamily: 'var(--font-heading)' }}>{posts.length}</div>
          </div>
          <div className="stat-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '20px' }}>
            <div className="label" style={{ fontSize: '13px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>用戶建立</div>
            <div className="value" style={{ fontSize: '32px', fontWeight: 700, marginTop: '5px', color: 'var(--neon-green)', fontFamily: 'var(--font-heading)' }}>{userCount}</div>
          </div>
          <div className="stat-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '20px' }}>
            <div className="label" style={{ fontSize: '13px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>系統預設貼文</div>
            <div className="value" style={{ fontSize: '32px', fontWeight: 700, marginTop: '5px', color: 'var(--text-muted)', fontFamily: 'var(--font-heading)' }}>{systemCount}</div>
          </div>
        </div>

        <div className="section-header" style={{ margin: '40px 0 15px 0', fontFamily: 'var(--font-heading)', fontSize: '16px', color: 'var(--text-bright)', borderLeft: '3px solid var(--neon-cyan)', paddingLeft: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>貼文目錄清單 (Post Catalog)</div>
        <div className="data-table-container" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '6px', overflow: 'hidden', boxShadow: 'var(--card-shadow)', width: '100%' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#1e2530', textAlign: 'left' }}>
                <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)', fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-bright)', width: '15%' }}>發佈者</th>
                <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)', fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-bright)', width: '10%' }}>分類</th>
                <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)', fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-bright)', width: '10%' }}>權限</th>
                <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)', fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-bright)', width: '10%' }}>附圖</th>
                <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)', fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-bright)' }}>內容摘要</th>
                <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)', fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-bright)', width: '10%' }}>按讚</th>
                <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)', fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-bright)', width: '10%' }}>來源</th>
                <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)', fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-bright)', width: '12%' }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {posts.map(post => {
                const isSystem = post.isDefault || post.id.toString().startsWith('def-');
                const hasImage = !!post.image;
                const privacy = post.privacy || 'public';

                return (
                  <tr key={post.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '12px 16px', fontSize: '13px' }}>
                      <strong>{post.author || '匿名'}</strong><br />
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{post.handle}</span>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '13px' }}>
                      <span style={{ background: 'var(--bg-input)', border: '1px solid var(--border-color)', padding: '2px 6px', borderRadius: '4px', fontSize: '11px' }}>
                        {post.category || 'Thoughts'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '13px' }}>
                      <span style={{
                        padding: '2px 6px', borderRadius: '3px', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase',
                        background: privacy === 'private' ? 'rgba(226, 114, 151, 0.1)' : 'rgba(61, 220, 151, 0.1)',
                        color: privacy === 'private' ? 'var(--neon-magenta)' : 'var(--neon-green)',
                        border: privacy === 'private' ? '1px solid rgba(226, 114, 151, 0.2)' : '1px solid rgba(61, 220, 151, 0.2)'
                      }}>
                        {privacy === 'private' ? '🔒 私人' : '🌐 公開'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '13px' }}>
                      {hasImage ? (
                        <img src={Array.isArray(post.image) ? post.image[0] : post.image} style={{ width: '50px', height: '35px', objectFit: 'cover', borderRadius: '3px', border: '1px solid var(--border-color)' }} alt="Preview" />
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: '11px', fontStyle: 'italic' }}>無</span>
                      )}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '13px' }}>
                      <div style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--text-primary)' }}>{post.content || ''}</div>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '13px' }}>❤️ {post.likedBy ? post.likedBy.length : post.likes || 0}</td>
                    <td style={{ padding: '12px 16px', fontSize: '13px' }}>
                      <span style={{
                        padding: '2px 6px', borderRadius: '3px', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase',
                        background: isSystem ? 'rgba(86, 103, 122, 0.1)' : 'rgba(92, 200, 255, 0.1)',
                        color: isSystem ? 'var(--text-muted)' : 'var(--neon-cyan)',
                        border: isSystem ? '1px solid rgba(86, 103, 122, 0.2)' : '1px solid rgba(92, 200, 255, 0.2)'
                      }}>{isSystem ? '系統常駐' : '用戶建立'}</span>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '13px' }}>
                      <button style={{ color: 'var(--neon-red)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, textDecoration: 'underline' }} onClick={() => handleAdminDeletePost(post.id)}>強制刪除</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {posts.length === 0 && <div className="empty-state" style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>資料庫中尚無任何貼文。</div>}
        </div>

        {/* Content Moderation & Reports Section */}
        <div className="section-header" style={{ margin: '40px 0 15px 0', fontFamily: 'var(--font-heading)', fontSize: '16px', color: 'var(--text-bright)', borderLeft: '3px solid var(--neon-cyan)', paddingLeft: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>內容檢舉與審查中心 (Report Queue)</div>
        <div className="data-table-container" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '6px', overflow: 'hidden', boxShadow: 'var(--card-shadow)', width: '100%', marginBottom: '40px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#1e2530', textAlign: 'left' }}>
                <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)', fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-bright)', width: '15%' }}>被檢舉貼文 ID</th>
                <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)', fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-bright)', width: '15%' }}>發佈者</th>
                <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)', fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-bright)', width: '20%' }}>檢舉原因</th>
                <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)', fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-bright)', width: '15%' }}>提報人</th>
                <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)', fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-bright)', width: '15%' }}>狀態</th>
                <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)', fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-bright)', width: '20%' }}>審查管理</th>
              </tr>
            </thead>
            <tbody>
              {reports.map(rep => {
                const postExists = posts.some(p => p.id === rep.postId);
                const statusColor = rep.status === '已處理' ? 'var(--text-muted)' : 'var(--neon-red)';

                return (
                  <tr key={rep.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '12px 16px', fontSize: '13px' }}><code>{rep.postId}</code></td>
                    <td style={{ padding: '12px 16px', fontSize: '13px' }}><strong>{rep.author}</strong></td>
                    <td style={{ padding: '12px 16px', fontSize: '13px' }}><span style={{ color: '#fda4af' }}>{rep.reason}</span></td>
                    <td style={{ padding: '12px 16px', fontSize: '13px' }}><span style={{ color: 'var(--text-secondary)' }}>{rep.reporter}</span></td>
                    <td style={{ padding: '12px 16px', fontSize: '13px' }}><span style={{ color: statusColor, fontWeight: 600 }}>{rep.status}</span></td>
                    <td style={{ padding: '12px 16px', fontSize: '13px' }}>
                      {rep.status === '待處理' && postExists ? (
                        <>
                          <button style={{ color: 'var(--neon-red)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, textDecoration: 'underline', marginRight: '12px' }} onClick={() => handleAdminModerate(rep.postId, rep.id)}>下架貼文</button>
                          <button className="btn btn-outline" style={{ border: '1px solid var(--neon-cyan)', background: 'transparent', color: 'var(--neon-cyan)', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }} onClick={() => handleAdminDismissReport(rep.id)}>駁回</button>
                        </>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>已結案 {!postExists ? '(貼文已不存在)' : ''}</span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {reports.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px', fontSize: '13px' }}>尚無待審查的檢舉案件。</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* CRT Scanline effect wrapper */}
      <div className="scanline-overlay"></div>

      {/* Header navbar */}
      <header className="navbar">
        <div className="nav-container">
          <a href="#/" className="logo" onClick={() => setCurrentCategory("All")}>
            <span className="logo-bracket">[</span>ECHOES<span className="logo-dot">_</span>FEED<span className="logo-bracket">]</span>
          </a>

          <nav className="nav-links-wrapper" style={{ flex: 1, display: 'flex', justifyContent: 'center', paddingRight: '24px' }}>
            <ul className="nav-links">
              <li>
                <a href="#/" className={`nav-link ${currentRoute === "#/" || currentRoute === "" ? "active" : ""}`} id="nav-home">
                  &gt; {t("home")}
                </a>
              </li>
              <li>
                <a href="#/write" className={`nav-link ${currentRoute === "#/write" ? "active" : ""}`} id="nav-write">
                  &gt; {t("write")}
                </a>
              </li>
              <li>
                <a href="#/about" className={`nav-link ${currentRoute === "#/about" ? "active" : ""}`} id="nav-about">
                  &gt; {t("about")}
                </a>
              </li>
            </ul>
          </nav>

          <div className="nav-actions">
            <button id="theme-toggle" className="theme-toggle-btn" aria-label="切換深淺色主題" onClick={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}>
              {theme === 'dark' ? <Sun className="theme-icon sun-icon" /> : <Moon className="theme-icon moon-icon" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main id="app-container">
        {currentRoute === "#/admin" && adminAuthenticated ? (
          renderAdminConsole()
        ) : (
          <div className="layout-wrapper">
            
            {/* Left Sidebar */}
            <aside className="sidebar-left">
              <div className="sidebar-card">
                <div className="user-profile-preview">
                  <div className="avatar-placeholder" id="user-avatar-area" style={{ cursor: isLoggedIn ? 'pointer' : 'default', pointerEvents: isLoggedIn ? 'auto' : 'none', position: 'relative' }}>
                    {currentUser.avatarUrl ? (
                      <img src={currentUser.avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ background: currentUser.avatarBg || '', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>
                        {currentUser.avatarLetter || currentUser.name.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                    {isLoggedIn && (
                      <input type="file" id="avatar-file-input" accept="image/*" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} onChange={handleDirectAvatarUpload} />
                    )}
                  </div>
                  <h3 id="user-display-name" style={{ borderBottom: 'none', paddingBottom: 0, marginTop: '10px' }}>{currentUser.name}</h3>
                  <p id="user-display-handle" style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{currentUser.handle}</p>

                  <div className="status-indicator" id="user-status-indicator" style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center', marginTop: '8px', cursor: 'pointer' }} onClick={() => {
                    if (userOnline) {
                      setUserOnline(false);
                      setIsManualOffline(true);
                    } else {
                      setUserOnline(true);
                      setIsManualOffline(false);
                    }
                  }}>
                    <span className={`status-dot ${userOnline ? "online" : "offline"}`} id="user-status-dot" style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: userOnline ? 'var(--neon-green)' : 'var(--neon-red)' }}></span>
                    <span id="user-status-text" style={{ fontSize: '12px' }}>{userOnline ? t("online") : t("offline")}</span>
                  </div>
                </div>

                <hr className="divider" style={{ border: 'none', borderBottom: '1px solid var(--border-color)', margin: '15px 0' }} />

                <ul className="sidebar-menu" style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: 0 }}>
                  <li className={currentRoute === "#/" || currentRoute === "" ? "active" : ""} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }} onClick={() => window.location.hash = "#/"}>
                    <Home style={{ width: '16px', height: '16px' }} /> <span className="sidebar-menu-text">{t("home")}</span>
                  </li>
                  <li style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Bell style={{ width: '16px', height: '16px' }} /> <span className="sidebar-menu-text">{currentLang === "en" ? "Notifications" : "通知訊息"}</span>
                  </li>
                  <li style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Mail style={{ width: '16px', height: '16px' }} /> <span className="sidebar-menu-text">{currentLang === "en" ? "Direct Messages" : "私訊功能"}</span>
                  </li>
                  <li style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Bookmark style={{ width: '16px', height: '16px' }} /> <span className="sidebar-menu-text">{t("likes_history")}</span>
                  </li>
                </ul>

                <hr className="divider" style={{ border: 'none', borderBottom: '1px solid var(--border-color)', margin: '15px 0' }} />

                <div className="lang-switcher-container" style={{ marginBottom: '15px' }}>
                  <select id="lang-switcher-select" className="lang-switcher-select" style={{ width: '100%', padding: '6px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '4px', fontSize: '12px' }} value={currentLang} onChange={(e) => setCurrentLang(e.target.value)}>
                    <option value="zh-Hant">繁體中文</option>
                    <option value="en">English</option>
                  </select>
                </div>

                {!isLoggedIn ? (
                  <div id="google-signin-container" className="google-login-btn-wrapper">
                    <button id="login-modal-trigger-btn" style={{ width: '100%', backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--neon-amber)', padding: '10px 16px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyCenter: 'center', gap: '10px', fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: '500', transition: 'all 0.2s', boxShadow: '0 0 5px rgba(255,176,32,0.2)' }} onClick={() => setModalLoginVisible(true)}>
                      <LogIn style={{ width: '16px', height: '16px' }} />
                      <span>帳號密碼登入</span>
                    </button>
                  </div>
                ) : (
                  <button id="user-logout-btn" className="user-logout-btn" style={{ width: '100%', background: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border-color)', padding: '10px 16px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }} onClick={handleLogout}>
                    <LogOut style={{ width: '16px', height: '16px' }} />
                    <span id="logout-btn-text">{t("logout")}</span>
                  </button>
                )}
              </div>
            </aside>

            {/* Middle Main Feed */}
            <section className="main-feed">
              {currentRoute === "#/about" ? (
                /* About View */
                <div className="feed-container" style={{ maxWidth: '580px' }}>
                  <div className="profile-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-neon)', borderRadius: 'var(--radius-md)', padding: '24px', position: 'relative' }}>
                    <div className="profile-avatar-wrapper" style={{ marginBottom: '16px' }}>
                      <div className="profile-avatar" style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--neon-green)', fontWeight: 700, border: '1px solid var(--border-neon)' }}>//</div>
                    </div>
                    <div className="profile-details">
                      <h2 className="profile-name" style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', color: 'var(--text-bright)' }}>[ECHOES_NODE]</h2>
                      <p style={{ fontSize: '11px', color: 'var(--neon-cyan)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '6px', fontFamily: 'var(--font-body)' }}>@sys_operator // STATUS: ACTIVE</p>
                      <p className="profile-bio" style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>歡迎進入 ECHOES 終端。這是一個運行在你瀏覽器沙箱中的去中心化社群貼文節點。所有資料加密儲存於 LocalStorage，無後端、無追蹤、零延遲。</p>
                    </div>

                    <div className="profile-divider" style={{ height: '1px', background: 'var(--border-color)', margin: '20px 0' }}></div>

                    <div className="profile-sections" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                      <div className="profile-sec-item">
                        <h3 style={{ fontSize: '14px', fontFamily: 'var(--font-heading)', color: 'var(--text-bright)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}><Terminal style={{ width: '15px', height: '15px' }} /> SYS.ARCH</h3>
                        <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>純前端 SPA 架構，以 React 驅動。視覺設計採用賽博朋克終端機美學 — 深黑底色、螢光綠 Neon 點綴、等寬字體、CRT 掃描線特效，以及終端發光碼塊。</p>
                      </div>

                      <div className="profile-sec-item">
                        <h3 style={{ fontSize: '14px', fontFamily: 'var(--font-heading)', color: 'var(--text-bright)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}><Shield style={{ width: '15px', height: '15px' }} /> DATA.VAULT</h3>
                        <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>完全離線運作。無伺服器、無 Cookie、無第三方追蹤腳本。你的貼文、按讚數與留言都被封裝在瀏覽器 LocalStorage 中，清除瀏覽資料即可完全抹除。</p>
                      </div>

                      <div className="profile-sec-item">
                        <h3 style={{ fontSize: '14px', fontFamily: 'var(--font-heading)', color: 'var(--text-bright)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}><Hash style={{ width: '15px', height: '15px' }} /> TAGS.INDEX</h3>
                        <div className="profile-tags" style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                          {["#CYBERPUNK", "#NEON_GREEN", "#TERMINAL_UI", "#REACT", "#ZERO_BACKEND", "#CRT_SCANLINE"].map(tag => (
                            <span key={tag} className="profile-tag" style={{ fontSize: '11px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', padding: '2px 8px', borderRadius: '4px', color: 'var(--text-secondary)' }}>{tag}</span>
                          ))}
                        </div>
                      </div>

                      {/* Contact card link section */}
                      <div className="profile-sec-item" id="about-contact-section">
                        <h3 style={{ fontSize: '14px', fontFamily: 'var(--font-heading)', color: 'var(--text-bright)', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Radio style={{ width: '15px', height: '15px' }} /> CONTACT.LINK</span>
                          {(isLoggedIn || adminAuthenticated) && (
                            <button id="edit-contact-btn" style={{ background: 'none', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-secondary)', fontSize: '10px', padding: '3px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }} onClick={() => {
                              setContactPhone(contactInfo.phone || "");
                              setContactEmail(contactInfo.email || "");
                              setContactWebsite(contactInfo.website || "");
                              setModalContactVisible(true);
                            }}>
                              <Pencil style={{ width: '11px', height: '11px' }} /> 編輯
                            </button>
                          )}
                        </h3>
                        <div id="contact-display" style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
                          {contactInfo.phone ? (
                            <a href={`tel:${contactInfo.phone}`} className="profile-social-btn" style={{ width: 'fit-content', display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', fontSize: '12px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
                              <Phone style={{ width: '14px', height: '14px' }} />{contactInfo.phone}
                            </a>
                          ) : (
                            (isLoggedIn || adminAuthenticated) && <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>尚未設定電話 — 點擊右上角「編輯」加入</span>
                          )}
                          {contactInfo.email && (
                            <a href={`mailto:${contactInfo.email}`} className="profile-social-btn" style={{ width: 'fit-content', display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', fontSize: '12px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
                              <Mail style={{ width: '14px', height: '14px' }} />{contactInfo.email}
                            </a>
                          )}
                          {contactInfo.website && (
                            <a href={contactInfo.website} target="_blank" rel="noopener noreferrer" className="profile-social-btn" style={{ width: 'fit-content', display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', fontSize: '12px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
                              <Globe style={{ width: '14px', height: '14px' }} />{contactInfo.website}
                            </a>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="profile-socials" style={{ display: 'flex', gap: '10px', marginTop: '24px', justifyContent: 'center' }}>
                      <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="profile-social-btn" style={{ padding: '8px', border: '1px solid var(--border-color)', borderRadius: '6px' }} aria-label="GitHub">
                        <Terminal style={{ width: '18px', height: '18px' }} />
                      </a>
                      <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="profile-social-btn" style={{ padding: '8px', border: '1px solid var(--border-color)', borderRadius: '6px' }} aria-label="Twitter">
                        <Globe style={{ width: '18px', height: '18px' }} />
                      </a>
                      <a href="mailto:creator@example.com" className="profile-social-btn" style={{ padding: '8px', border: '1px solid var(--border-color)', borderRadius: '6px' }} aria-label="Email">
                        <Mail style={{ width: '18px', height: '18px' }} />
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                /* Feed View */
                <div className="feed-container">
                  
                  {/* Composer Card */}
                  <div className="composer-card">
                    <div className="composer-main">
                      <div className="user-avatar" style={{ background: currentUser.avatarBg || '' }}>
                        {currentUser.avatarLetter || currentUser.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="composer-inputs">
                        {composerGradient ? (
                          <div id="composer-gradient-preview" className="composer-gradient-preview" style={{ background: composerGradient, display: 'flex' }} onClick={() => setComposerGradient(null)}>
                            {composerText || "Preview Draft"}
                          </div>
                        ) : (
                          <textarea id="composer-textarea" className="composer-textarea" placeholder={isLoggedIn ? t("placeholder_composer") : (currentLang === "en" ? "Please log in to post..." : "請先登入才能發表想法...")} disabled={!isLoggedIn} value={composerText} onChange={(e) => setComposerText(e.target.value)} style={{ height: 'auto' }}></textarea>
                        )}

                        {composerImage && (
                          <div id="composer-image-preview-container">
                            <div className="composer-image-preview-wrapper" style={{ position: 'relative', width: 'fit-content' }}>
                              <img src={composerImage} className="composer-image-preview" style={{ maxHeight: '150px', borderRadius: '6px' }} alt="Composer Thumbnail" />
                              <button type="button" id="composer-image-clear" className="composer-image-delete-btn" style={{ position: 'absolute', top: '5px', right: '5px', background: 'rgba(0,0,0,0.6)', border: 'none', color: '#fff', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer' }} onClick={() => setComposerImage(null)}>&times;</button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div id="composer-gradients-row" className={`composer-gradients-row ${showGradientsRow ? "active" : ""}`} style={{ display: showGradientsRow ? 'flex' : 'none' }}>
                      <div className={`composer-grad-option composer-grad-none ${!composerGradient ? "selected" : ""}`} onClick={() => setComposerGradient(null)}>無</div>
                      {PRESET_GRADIENTS.map(grad => (
                        <div key={grad} className={`composer-grad-option ${composerGradient === grad ? "selected" : ""}`} style={{ background: grad }} onClick={() => setComposerGradient(grad)}></div>
                      ))}
                    </div>

                    <div className="composer-divider"></div>

                    <div className="composer-footer">
                      <div className="composer-options">
                        <button id="toggle-gradients-btn" className="composer-tool-btn" type="button" disabled={!isLoggedIn} style={{ opacity: isLoggedIn ? 1 : 0.5 }} onClick={() => setShowGradientsRow(prev => !prev)}>
                          <Palette style={{ width: '16px', height: '16px' }} />
                          <span>{t("btn_style")}</span>
                        </button>

                        <div className="image-upload-wrapper" style={{ position: 'relative' }}>
                          <input type="file" id="composer-image-input" className="image-upload-input" accept="image/*" style={{ display: 'none' }} onChange={handleComposerPhotoChange} />
                          <button id="composer-image-btn" className="image-upload-btn composer-tool-btn" type="button" disabled={!isLoggedIn} style={{ opacity: isLoggedIn ? 1 : 0.5 }} onClick={() => document.getElementById("composer-image-input").click()}>
                            <ImageIcon style={{ width: '16px', height: '16px' }} />
                            <span>{t("image_btn")}</span>
                          </button>
                        </div>

                        <select id="composer-category" className="composer-category-select" aria-label="Category Selection" value={composerCategory} onChange={(e) => setComposerCategory(e.target.value)}>
                          <option value="Thoughts">Thoughts</option>
                          <option value="Tech">Tech</option>
                          <option value="Productivity">Productivity</option>
                          <option value="Life">Life</option>
                          <option value="Design">Design</option>
                        </select>

                        <select id="composer-privacy" className="composer-privacy-select" aria-label="Privacy Control" value={composerPrivacy} onChange={(e) => setComposerPrivacy(e.target.value)}>
                          <option value="public">{t("public")}</option>
                          <option value="private">{t("private")}</option>
                        </select>
                      </div>

                      <button id="submit-post-btn" className="post-submit-btn" type="button" disabled={!isLoggedIn} style={{ opacity: isLoggedIn ? 1 : 0.5 }} onClick={handlePublishPost}>
                        <Send style={{ width: '14px', height: '14px' }} />
                        <span>{t("btn_submit")}</span>
                      </button>
                    </div>
                  </div>

                  {/* Search & Filters block */}
                  <div className="search-filter-section">
                    <div className="search-input-wrapper">
                      <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: 'var(--text-muted)' }} />
                      <input type="text" id="feed-search" className="feed-search-input" placeholder={t("placeholder_search")} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={handleSearchKeyPress} />
                    </div>
                    <div className="categories-scroll" id="categories-scroll">
                      {categoryFilterList.map(cat => (
                        <button key={cat} className={`feed-category-pill ${currentCategory === cat ? 'active' : ''}`} onClick={() => setCurrentCategory(cat)}>
                          {cat === "All" ? t("all_categories") : cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Posts List */}
                  <div id="posts-feed-list">
                    {filteredPosts.map(post => {
                      const hasGradient = !!post.gradient;
                      const isPrivate = post.privacy === "private";

                      return (
                        <div key={post.id} className={`post-card ${highlightedPostId === post.id ? "liked-post-highlight" : ""}`} id={`card-${post.id}`}>
                          <div className="post-header">
                            <div className="post-author-wrapper">
                              <div className="user-avatar" style={{
                                background: post.isDefault ? 'var(--bg-elevated)' : 'linear-gradient(135deg, var(--neon-green-dim) 0%, var(--neon-cyan) 100%)',
                                color: post.isDefault ? 'var(--neon-green)' : '#ffffff'
                              }}>
                                {post.avatarLetter}
                              </div>
                              <div className="post-author-details">
                                <span className="post-author-name">{post.author}</span>
                                <span className="post-author-handle">{post.handle}</span>
                              </div>
                            </div>
                            <div className="post-meta-right">
                              {isPrivate && (
                                <span className="post-privacy-badge" style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '11px', color: 'var(--neon-magenta)' }}>
                                  <Lock style={{ width: '11px', height: '11px' }} />
                                  <span>{t("private").split('（')[0]}</span>
                                </span>
                              )}
                              <span className="post-category-tag">{post.category}</span>
                              <span className="post-time">{post.date}</span>
                            </div>
                          </div>

                          {/* Attached Image Rendering */}
                          {post.image && (
                            Array.isArray(post.image) ? (
                              <div className="post-image-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '8px', marginTop: '12px', borderRadius: '8px', overflow: 'hidden' }}>
                                {post.image.map((img, idx) => (
                                  <img key={idx} src={img} className="post-image" style={{ width: '100%', height: '200px', objectFit: 'cover' }} alt="Attached preview" />
                                ))}
                              </div>
                            ) : (
                              <div className="post-image-container">
                                <img src={post.image} className="post-image" alt="Attached preview" />
                              </div>
                            )
                          )}

                          {/* Content Area */}
                          {hasGradient ? (
                            <div className="post-gradient-container" style={{ background: post.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', borderRadius: '8px', color: '#fff', fontWeight: 'bold' }}>
                              <div dangerouslySetInnerHTML={{ __html: parseSimpleMarkdown(post.content) }}></div>
                            </div>
                          ) : (
                            <div className="post-text-content" dangerouslySetInnerHTML={{ __html: parseSimpleMarkdown(post.content) }}></div>
                          )}

                          {/* Action Panel Buttons */}
                          <div className="post-actions-row" style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
                            <button className={`post-action-btn btn-like ${post.likedBy ? (post.likedBy.includes(currentUser.handle) ? 'liked' : '') : (post.likedByUser ? 'liked' : '')}`} style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }} onClick={() => handleLikePost(post.id)}>
                              <Heart style={{ width: '16px', height: '16px' }} />
                              <span className="like-count">{post.likedBy ? post.likedBy.length : post.likes}</span>
                            </button>

                            <button className="post-action-btn btn-comment" style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }} onClick={() => {
                              setActiveCommentsPostId(prev => ({ ...prev, [post.id]: !prev[post.id] }));
                            }}>
                              <MessageSquare style={{ width: '16px', height: '16px' }} />
                              <span>{post.comments.length}</span>
                            </button>

                            <button className="post-action-btn btn-share" style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }} onClick={() => handleSharePost(post)}>
                              <Send style={{ width: '16px', height: '16px' }} />
                              <span>分享</span>
                            </button>

                            {((post.handle === currentUser.handle || adminAuthenticated) && !post.isDefault) && (
                              <button className="post-action-btn post-action-delete" style={{ color: 'var(--text-muted)', cursor: 'pointer', marginLeft: 'auto' }} onClick={() => handleDeletePost(post.id)}>
                                <Trash2 style={{ width: '16px', height: '16px' }} />
                              </button>
                            )}
                          </div>

                          {/* Comments Drawer List */}
                          <div className={`comments-section ${activeCommentsPostId[post.id] ? "active" : ""}`} id={`comments-sec-${post.id}`} style={{ display: activeCommentsPostId[post.id] ? 'block' : 'none', marginTop: '12px', borderTop: '1px solid var(--border-color)', paddingTop: '10px' }}>
                            <div className="comments-list" id={`comments-list-${post.id}`}>
                              {post.comments.length === 0 ? (
                                <div style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)', padding: '8px 0' }}>尚無留言，成為第一個留言的人吧！</div>
                              ) : (
                                post.comments.map(c => (
                                  <div key={c.id} className="comment-item" style={{ display: 'flex', gap: '10px', margin: '8px 0' }}>
                                    <div className="comment-avatar" style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold' }}>
                                      {c.author.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="comment-content-wrapper" style={{ flex: 1 }}>
                                      <div className="comment-header" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-secondary)' }}>
                                        <span className="comment-author" style={{ fontWeight: 600 }}>{c.author}</span>
                                        <span className="comment-time">{c.time}</span>
                                      </div>
                                      <div className="comment-text" style={{ fontSize: '12px', color: 'var(--text-primary)', marginTop: '2px' }}>{c.text}</div>
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
                            <div className="comment-composer" style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                              <input type="text" className="comment-input" style={{ flex: 1, padding: '6px 12px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '4px', fontSize: '12px' }} placeholder={t("reply_placeholder")} value={commentInputs[post.id] || ""} onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))} onKeyDown={(e) => e.key === 'Enter' && submitComment(post.id)} />
                              <button className="comment-submit-btn" style={{ padding: '6px 12px', background: 'rgba(61, 220, 151, 0.1)', border: '1px solid var(--neon-green)', color: 'var(--neon-green)', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }} onClick={() => submitComment(post.id)}>{t("reply")}</button>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {filteredPosts.length === 0 && (
                      <div style={{ textAlign: 'center', padding: '40px 10px', color: 'var(--text-muted)' }}>
                        <Frown style={{ width: '38px', height: '38px', marginBottom: '12px' }} />
                        <p>{t("no_posts")}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </section>

            {/* Right Sidebar */}
            <aside className="sidebar-right">
              
              {/* Administrator Presence panel wrapper */}
              {adminAuthenticated && (
                <div className="sidebar-card" id="admin-presence-card" style={{ borderColor: 'var(--neon-cyan)', display: 'block' }}>
                  <h3 style={{ color: 'var(--neon-cyan)', marginBottom: '12px', fontSize: '14px' }}>🛡️ 管理員專屬：使用者狀態監控</h3>
                  <ul id="admin-presence-list" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {Object.keys(onlineUsers).filter(h => h !== "@admin").map(handle => {
                      const lastSeen = onlineUsers[handle] || 0;
                      const isOnline = (currentTime - lastSeen) < 10000;
                      return (
                        <li key={handle} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-color)' }}>
                          <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{handle}</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: isOnline ? 'var(--neon-green)' : 'var(--neon-red)', boxShadow: `0 0 5px ${isOnline ? 'var(--neon-green)' : 'var(--neon-red)'}` }}></span>
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{isOnline ? 'Online' : 'Offline'}</span>
                          </div>
                        </li>
                      );
                    })}
                    {Object.keys(onlineUsers).filter(h => h !== "@admin").length === 0 && (
                      <li style={{ color: 'var(--text-muted)', fontSize: '11px', padding: '8px 0' }}>無在線使用者</li>
                    )}
                  </ul>
                </div>
              )}

              {/* Trending topics widget */}
              <div className="sidebar-card">
                <h3 id="trending-topics-title">🔥 {currentLang === "en" ? "Trending Topics" : "熱門話題"}</h3>
                <ul className="trending-list" id="trending-topics-list" style={{ padding: 0 }}>
                  {trendingTags.map(tInfo => (
                    <li key={tInfo.tag} className="trending-tag-item" style={{ cursor: 'pointer', transition: 'color 0.2s', padding: '4px 0' }} onClick={() => { setSearchQuery(tInfo.tag); setCurrentRoute("#/"); }}>
                      {tInfo.tag} <span style={{ color: 'var(--neon-green)' }}>{tInfo.count} {currentLang === "en" ? "posts" : "貼文"}</span>
                    </li>
                  ))}
                  {trendingTags.length === 0 && (
                    <li style={{ color: 'var(--text-muted)', fontSize: '11px' }}>{currentLang === "en" ? "No trending topics" : "目前尚無話題"}</li>
                  )}
                </ul>
              </div>

              {/* Search History widget */}
              <div className="sidebar-card" id="search-history-card">
                <h3 id="search-history-title">🔍 {t("search_history")}</h3>
                <div id="search-history-list" className="search-history-container" style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {searchHistory.map(kw => (
                    <div key={kw} className="search-history-chip" style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '4px 10px', fontSize: '11px', cursor: 'pointer' }} onClick={() => { setSearchQuery(kw); setCurrentRoute("#/"); }}>
                      <span>{kw}</span>
                      <button className="clear-chip-btn" style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)', fontWeight: 'bold' }} onClick={(e) => {
                        e.stopPropagation();
                        setSearchHistory(prev => prev.filter(q => q !== kw));
                      }}>&times;</button>
                    </div>
                  ))}
                  {searchHistory.length === 0 && (
                    <div style={{ textAlign: 'center', fontSize: '11px', color: 'var(--text-muted)', padding: '8px 0', width: '100%' }}>{currentLang === "en" ? "No search history" : "無搜尋紀錄"}</div>
                  )}
                </div>
                {searchHistory.length > 0 && (
                  <button id="clear-history-btn" className="clear-all-history-btn" style={{ border: '1px solid var(--border-color)', width: '100%', padding: '6px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer', marginTop: '12px', background: 'transparent' }} onClick={handleClearHistory}>{t("clear_history")}</button>
                )}
              </div>

              {/* Liked & Bookmarked posts widget */}
              <div className="sidebar-card" id="likes-history-card">
                <h3 id="likes-history-title">💖 {t("likes_history")}</h3>
                <div id="liked-posts-list" className="liked-history-list" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {posts.filter(p => p.likedBy ? p.likedBy.includes(currentUser.handle) : p.likedByUser).map(post => (
                    <button key={post.id} className="liked-history-item" style={{ display: 'flex', alignItems: 'center', gap: '6px', width: '100%', background: 'transparent', border: '1px solid var(--border-color)', padding: '6px 10px', borderRadius: '6px', textAlign: 'left', cursor: 'pointer' }} onClick={() => handleBookmarkItemClick(post.id)}>
                      <Heart style={{ color: 'var(--neon-red)', fill: 'var(--neon-red)', width: '14px', height: '14px' }} />
                      <span className="liked-history-item-text" style={{ fontSize: '11px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--text-primary)' }}>{post.author}: {post.content.substring(0, 15)}...</span>
                    </button>
                  ))}
                  {posts.filter(p => p.likedBy ? p.likedBy.includes(currentUser.handle) : p.likedByUser).length === 0 && (
                    <div style={{ textAlign: 'center', fontSize: '11px', color: 'var(--text-muted)', padding: '8px 0', width: '100%' }}>{currentLang === "en" ? "No liked posts" : "無點讚或收藏貼文"}</div>
                  )}
                </div>
              </div>
            </aside>

          </div>
        )}
      </main>

      {/* Toast Notifications */}
      <div id="toast-container" className="toast-container" style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1200, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {toasts.map(toast => (
          <div key={toast.id} className="toast" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-card)', border: '1px solid var(--neon-green)', padding: '10px 16px', borderRadius: '6px', color: 'var(--text-bright)', boxShadow: 'var(--card-shadow)' }}>
            <CheckCircle2 style={{ width: '16px', height: '16px', color: 'var(--neon-green)' }} />
            <span>{toast.message}</span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer className="footer" style={{ borderTop: '1px solid var(--border-neon)', padding: '20px 0', background: 'var(--bg-card)', marginTop: 'auto' }}>
        <div className="footer-container">
          <p className="copyright" onClick={handleCopyrightClick}>© 2026 ECHOES://FEED <span className="neon-green">|</span> SYS.STATUS: <span className="neon-green">ONLINE</span></p>
          <div className="footer-links">
            <a href="#/" className="footer-link">[貼文牆]</a>
            <a href="#/write" className="footer-link">[個人想法牆]</a>
            <a href="#/about" className="footer-link">[關於我]</a>
          </div>
        </div>
      </footer>

      {/* Modals Dialogs */}

      {/* 1. Account login dialog */}
      {modalLoginVisible && (
        <div id="profile-setup-modal" className="admin-modal-overlay active" style={{ zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="admin-modal-card" style={{ maxWidth: '400px', width: '92%', background: 'var(--bg-card)', border: '1px solid var(--border-neon)', padding: '24px', borderRadius: '8px', position: 'relative' }}>
            <button className="modal-close-btn" style={{ position: 'absolute', top: '12px', right: '12px', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => setModalLoginVisible(false)}>
              <X style={{ width: '18px', height: '18px' }} />
            </button>
            <div className="admin-modal-title" style={{ fontSize: '16px', fontFamily: 'var(--font-heading)', color: 'var(--text-bright)', textAlign: 'center', marginBottom: '12px' }}>🔐 系統登入 // SYSTEM LOGIN</div>
            <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '16px', textAlign: 'center' }}>* 測試請輸入任意 Email 與密碼即可登入</p>

            <div className="admin-modal-input-group" style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label htmlFor="login-email" style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>📧 帳號 (電子郵件) / Email</label>
              <input type="email" id="login-email" className="admin-modal-input" style={{ width: '100%', padding: '10px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '4px', fontSize: '13px' }} placeholder="admin@example.com" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required />
            </div>

            <div className="admin-modal-input-group" style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label htmlFor="login-password" style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>🔑 密碼 / Password</label>
              <input type="password" id="login-password" className="admin-modal-input" style={{ width: '100%', padding: '10px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '4px', fontSize: '13px' }} placeholder="••••••••" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && submitTraditionalLogin()} required />
            </div>

            <div className="admin-modal-actions" style={{ marginTop: '24px' }}>
              <button id="login-btn-submit" className="admin-modal-btn admin-modal-btn-submit" style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '10px', background: 'rgba(61, 220, 151, 0.1)', border: '1px solid var(--neon-green)', color: 'var(--neon-green)', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }} onClick={submitTraditionalLogin}>登入 / Log In</button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Admin Security Password verify dialog */}
      {modalAdminVisible && (
        <div id="admin-login-modal" className="admin-modal-overlay active" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="admin-modal-card" style={{ maxWidth: '400px', width: '92%', background: 'var(--bg-card)', border: '1px solid var(--border-neon)', padding: '24px', borderRadius: '8px' }}>
            <div className="admin-modal-title" id="admin-modal-title" style={{ fontSize: '16px', fontFamily: 'var(--font-heading)', color: 'var(--text-bright)', textAlign: 'center', marginBottom: '12px' }}>ACCESS_DENIED // 身份驗證</div>
            <div className="admin-modal-input-group" style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label htmlFor="admin-password" id="admin-modal-pwd-label" style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>請輸入安全通道授權密碼：</label>
              <input type="password" id="admin-password" className="admin-modal-input" style={{ width: '100%', padding: '10px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '4px', fontSize: '13px' }} placeholder="••••••••" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && submitAdminLogin()} />
            </div>
            <div className="admin-modal-actions" style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button id="admin-cancel-btn" className="admin-modal-btn admin-modal-btn-cancel" style={{ padding: '8px 16px', background: 'transparent', border: '1px solid var(--border-color)', borderRadius: '4px', cursor: 'pointer' }} onClick={() => setModalAdminVisible(false)}>取消</button>
              <button id="admin-login-btn" className="admin-modal-btn admin-modal-btn-submit" style={{ padding: '8px 16px', background: 'rgba(61, 220, 151, 0.1)', border: '1px solid var(--neon-green)', color: 'var(--neon-green)', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }} onClick={submitAdminLogin}>安全認證</button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Contact link editor dialog */}
      {modalContactVisible && (
        <div id="contact-edit-modal" className="admin-modal-overlay active" style={{ zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="admin-modal-card" style={{ maxWidth: '400px', width: '92%', background: 'var(--bg-card)', border: '1px solid var(--border-neon)', padding: '24px', borderRadius: '8px' }}>
            <div className="admin-modal-title" style={{ fontSize: '16px', fontFamily: 'var(--font-heading)', color: 'var(--text-bright)', textAlign: 'center', marginBottom: '12px' }}>📡 編輯聯絡資訊</div>
            <div className="admin-modal-input-group" style={{ marginBottom: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label htmlFor="contact-phone" style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>📞 電話 / Phone</label>
              <input type="tel" id="contact-phone" className="admin-modal-input" style={{ width: '100%', padding: '8px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '4px', fontSize: '13px' }} placeholder="+886 912 345 678" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} />
            </div>
            <div className="admin-modal-input-group" style={{ marginBottom: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label htmlFor="contact-email" style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>✉️ 聯絡信箱 / Email</label>
              <input type="email" id="contact-email" className="admin-modal-input" style={{ width: '100%', padding: '8px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '4px', fontSize: '13px' }} placeholder="your@email.com" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
            </div>
            <div className="admin-modal-input-group" style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label htmlFor="contact-website" style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>🌐 個人網站 / Website</label>
              <input type="url" id="contact-website" className="admin-modal-input" style={{ width: '100%', padding: '8px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '4px', fontSize: '13px' }} placeholder="https://yoursite.com" value={contactWebsite} onChange={(e) => setContactWebsite(e.target.value)} />
            </div>

            <div className="admin-modal-actions" style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button id="contact-edit-cancel" className="admin-modal-btn admin-modal-btn-cancel" style={{ padding: '8px 16px', background: 'transparent', border: '1px solid var(--border-color)', borderRadius: '4px', cursor: 'pointer' }} onClick={() => setModalContactVisible(false)}>取消</button>
              <button id="contact-edit-save" className="admin-modal-btn admin-modal-btn-submit" style={{ padding: '8px 16px', background: 'rgba(61, 220, 151, 0.1)', border: '1px solid var(--neon-green)', color: 'var(--neon-green)', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }} onClick={submitContactSave}>儲存資訊</button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Profile Username Setup and Avatar selection modal */}
      {modalProfileVisible && (
        <div id="profile-setup-modal" className="admin-modal-overlay active" style={{ zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="admin-modal-card" style={{ maxWidth: '400px', width: '92%', background: 'var(--bg-card)', border: '1px solid var(--border-neon)', padding: '24px', borderRadius: '8px' }}>
            <div className="admin-modal-title" style={{ fontSize: '16px', fontFamily: 'var(--font-heading)', color: 'var(--text-bright)', textAlign: 'center', marginBottom: '12px' }}>✨ 編輯個人資料</div>
            
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>選擇預設頭像</p>
            <div id="avatar-picker-grid" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '16px', justifyContent: 'center' }}>
              {PRESET_AVATARS.map(av => (
                <button key={av.id} type="button" className="avatar-preset-btn" style={{
                  width: '42px', height: '42px', borderRadius: '50%', border: profilePresetAv?.id === av.id ? '2px solid var(--neon-green)' : '1px solid var(--border-color)',
                  cursor: 'pointer', background: av.bg, fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: profilePresetAv?.id === av.id ? '0 0 8px rgba(61, 220, 151, 0.4)' : 'none'
                }} onClick={() => { setProfilePresetAv(av); setProfileCustomAv(null); }}>
                  {av.label}
                </button>
              ))}
            </div>

            <label id="avatar-upload-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', cursor: 'pointer', marginBottom: '18px', padding: '6px 10px', border: '1px dashed var(--border-color)', borderRadius: '4px' }}>
              <Upload style={{ width: '14px', height: '14px' }} />
              <span>{profileCustomAv ? "自訂頭像已附加" : "上傳自訂頭像"}</span>
              <input type="file" id="avatar-upload-input" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarFileChange} />
            </label>

            <div className="admin-modal-input-group" style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label htmlFor="profile-name-input" style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>自訂暱稱</label>
              <input type="text" id="profile-name-input" className="admin-modal-input" style={{ width: '100%', padding: '10px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '4px', fontSize: '13px' }} placeholder="你的名字 / Your Name" maxLength="24" value={profileName} onChange={(e) => setProfileName(e.target.value)} />
            </div>

            <div className="admin-modal-actions" style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button className="admin-modal-btn admin-modal-btn-cancel" style={{ padding: '8px 16px', background: 'transparent', border: '1px solid var(--border-color)', borderRadius: '4px', cursor: 'pointer' }} onClick={() => setModalProfileVisible(false)}>取消</button>
              <button className="admin-modal-btn admin-modal-btn-submit" style={{ padding: '8px 16px', background: 'rgba(61, 220, 151, 0.1)', border: '1px solid var(--neon-green)', color: 'var(--neon-green)', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }} onClick={submitProfileSave}>確認並儲存</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
