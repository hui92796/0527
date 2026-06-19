import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
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
  X,
  User,
  EyeOff,
  UserX,
  Pin
} from 'lucide-react';
import { db, isFirebaseSetup } from "./firebase";
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, doc, deleteDoc, arrayUnion, arrayRemove, writeBatch, getDoc, setDoc, where, getDocs } from "firebase/firestore";
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

const PRESET_GIFS = [
  // Cats
  { id: 'cat_1', url: 'https://i.giphy.com/media/3oriO0OEd9QIDdllqo/giphy.gif', keywords: ['cat', 'happy', 'cute', '貓咪', '開心', '可愛'], tags: ['cat', 'happy', 'cute', '貓咪', '開心', '可愛'], category: 'cat' },
  { id: 'cat_2', url: 'https://i.giphy.com/media/13CoXDiaCcC2EA/giphy.gif', keywords: ['cat', 'cute', 'sleep', '貓咪', '可愛', '睡覺', '慵懶'], tags: ['cat', 'cute', 'sleep', '貓咪', '可愛', '睡覺', '慵懶'], category: 'cat' },
  { id: 'cat_3', url: 'https://i.giphy.com/media/5i7umUqAOYYHC/giphy.gif', keywords: ['cat', 'dance', 'party', '貓咪', '跳舞', '派對'], tags: ['cat', 'dance', 'party', '貓咪', '跳舞', '派對'], category: 'cat' },
  { id: 'cat_4', url: 'https://i.giphy.com/media/9gISqB3tncMmY/giphy.gif', keywords: ['cat', 'sad', 'cry', '貓咪', '難過', '哭泣', '委屈'], tags: ['cat', 'sad', 'cry', '貓咪', '難過', '哭泣', '委屈'], category: 'cat' },
  { id: 'cat_5', url: 'https://i.giphy.com/media/ule4vhcY1xEIw/giphy.gif', keywords: ['cat', 'typing', 'work', '貓咪', '打字', '工作', '社畜', '崩潰'], tags: ['cat', 'typing', 'work', '貓咪', '打字', '工作', '社畜', '崩潰'], category: 'cat' },
  { id: 'cat_6', url: 'https://i.giphy.com/media/yFQ0ywscgobJK/giphy.gif', keywords: ['cat', 'shocked', 'funny', '驚訝', '貓咪', '傻眼', '搞笑'], tags: ['cat', 'shocked', 'funny', '驚訝', '貓咪', '傻眼', '搞笑'], category: 'cat' },
  { id: 'cat_7', url: 'https://i.giphy.com/media/VbnUQpnihPSIgIXNV1/giphy.gif', keywords: ['cat', 'wave', 'hello', '貓咪', '打招呼', '哈囉', '拜拜'], tags: ['cat', 'wave', 'hello', '貓咪', '打招呼', '哈囉', '拜拜'], category: 'cat' },
  { id: 'cat_8', url: 'https://i.giphy.com/media/GeimqsH0TLDt4tScGw/giphy.gif', keywords: ['cat', 'judge', 'stare', '貓咪', '瞪人', '鄙視', '問號'], tags: ['cat', 'judge', 'stare', '貓咪', '瞪人', '鄙視', '問號'], category: 'cat' },

  // Happy / Celebration
  { id: 'happy_1', url: 'https://i.giphy.com/media/t3s3tC50UkY3C/giphy.gif', keywords: ['happy', 'yes', 'success', 'celebrate', '開心', '耶', '成功', '讚', '慶祝'], tags: ['happy', 'yes', 'success', 'celebrate', '開心', '耶', '成功', '讚', '慶祝'], category: 'happy' },
  { id: 'happy_2', url: 'https://i.giphy.com/media/14412cZqAhi34s/giphy.gif', keywords: ['dance', 'happy', 'party', '跳舞', '開心', '派對', '搖擺'], tags: ['dance', 'happy', 'party', '跳舞', '開心', '派對', '搖擺'], category: 'happy' },
  { id: 'happy_3', url: 'https://i.giphy.com/media/nbvFVPiEiJH6JOGIok/giphy.gif', keywords: ['clap', 'good', 'bravo', 'clapping', '鼓掌', '拍手', '讚', '棒'], tags: ['clap', 'good', 'bravo', 'clapping', '鼓掌', '拍手', '讚', '棒'], category: 'happy' },
  { id: 'happy_4', url: 'https://i.giphy.com/media/111ebonMs90YLu/giphy.gif', keywords: ['thumbsup', 'ok', 'yes', 'good', '讚', '好的', '沒問題'], tags: ['thumbsup', 'ok', 'yes', 'good', '讚', '好的', '沒問題'], category: 'happy' },
  { id: 'happy_5', url: 'https://i.giphy.com/media/l0AMDAf3clIpL2aaQ/giphy.gif', keywords: ['celebrate', 'minions', 'party', '慶祝', '小小兵', '派對'], tags: ['celebrate', 'minions', 'party', '慶祝', '小小兵', '派對'], category: 'happy' },

  // Sad / Cry
  { id: 'sad_1', url: 'https://i.giphy.com/media/2WxWlkKWUsQ5q/giphy.gif', keywords: ['cry', 'sad', 'tears', '哭', '難過', '眼淚', '落淚'], tags: ['cry', 'sad', 'tears', '哭', '難過', '眼淚', '落淚'], category: 'sad' },
  { id: 'sad_2', url: 'https://i.giphy.com/media/OPU6wFID8rJcI/giphy.gif', keywords: ['cry', 'sad', 'baby', '哭', '難過', '寶寶', '委屈'], tags: ['cry', 'sad', 'baby', '哭', '難過', '寶寶', '委屈'], category: 'sad' },
  { id: 'sad_3', url: 'https://i.giphy.com/media/d2LCipPTihEBq/giphy.gif', keywords: ['sad', 'lonely', 'rain', '難過', '孤單', '下雨', '憂鬱'], tags: ['sad', 'lonely', 'rain', '難過', '孤單', '下雨', '憂鬱'], category: 'sad' },
  { id: 'sad_4', url: 'https://i.giphy.com/media/BEob5wK5CJAQs/giphy.gif', keywords: ['sad', 'depressed', 'sit', '難過', '沮喪', '抱膝', '無奈'], tags: ['sad', 'depressed', 'sit', '難過', '沮喪', '抱膝', '無奈'], category: 'sad' },

  // Angry / Rage
  { id: 'angry_1', url: 'https://i.giphy.com/media/l1J9u3TZfpmeDLkD6/giphy.gif', keywords: ['angry', 'mad', 'rage', '生氣', '憤怒', '抓狂', '氣炸'], tags: ['angry', 'mad', 'rage', '生氣', '憤怒', '抓狂', '氣炸'], category: 'angry' },
  { id: 'angry_2', url: 'https://i.giphy.com/media/11tI5s0zPJUXg4/giphy.gif', keywords: ['angry', 'tableflip', 'rage', '生氣', '翻桌', '暴怒'], tags: ['angry', 'tableflip', 'rage', '生氣', '翻桌', '暴怒'], category: 'angry' },
  { id: 'angry_3', url: 'https://i.giphy.com/media/3o72FiXyc7OIfi7aQs/giphy.gif', keywords: ['angry', 'scream', 'kid', '生氣', '尖叫', '憤怒', '暴躁'], tags: ['angry', 'scream', 'kid', '生氣', '尖叫', '憤怒', '暴躁'], category: 'angry' },

  // Shock / Wow
  { id: 'shock_1', url: 'https://i.giphy.com/media/Um3ljJl8jrkKidv7hT/giphy.gif', keywords: ['wow', 'shocked', 'mindblown', '驚訝', '哇', '震撼', '爆腦'], tags: ['wow', 'shocked', 'mindblown', '驚訝', '哇', '震撼', '爆腦'], category: 'shock' },
  { id: 'shock_2', url: 'https://i.giphy.com/media/14ut8LMmgQJqq4/giphy.gif', keywords: ['scared', 'shocked', 'omg', '驚嚇', '驚訝', '天啊', '恐懼'], tags: ['scared', 'shocked', 'omg', '驚嚇', '驚訝', '天啊', '恐懼'], category: 'shock' },
  { id: 'shock_3', url: 'https://i.giphy.com/media/80mXWkJHCgNtS/giphy.gif', keywords: ['eyes', 'shocked', 'what', '眼睛', '驚訝', '什麼', '瞪大'], tags: ['eyes', 'shocked', 'what', '眼睛', '驚訝', '什麼', '瞪大'], category: 'shock' },
  { id: 'shock_4', url: 'https://i.giphy.com/media/jquwTstU7fO6a22g26/giphy.gif', keywords: ['wow', 'shocked', 'gasp', '大驚', '驚訝', '倒吸一口氣'], tags: ['wow', 'shocked', 'gasp', '大驚', '驚訝', '倒吸一口氣'], category: 'shock' },

  // Love / Cute
  { id: 'love_1', url: 'https://i.giphy.com/media/l4pTkaQMK2S4bqV8c/giphy.gif', keywords: ['love', 'heart', 'cute', '愛心', '可愛', '心動', '喜歡'], tags: ['love', 'heart', 'cute', '愛心', '可愛', '心動', '喜歡'], category: 'love' },
  { id: 'love_2', url: 'https://i.giphy.com/media/KztT2c4Yc5ppZ1eQKL/giphy.gif', keywords: ['love', 'heart', 'kiss', '愛心', '親親', '親一個', '飛吻'], tags: ['love', 'heart', 'kiss', '愛心', '親親', '親一個', '飛吻'], category: 'love' },
  { id: 'love_3', url: 'https://i.giphy.com/media/I17T9wRkW6nCw/giphy.gif', keywords: ['love', 'heart', 'hug', '愛心', '抱抱', '溫暖', '擁抱'], tags: ['love', 'heart', 'hug', '愛心', '抱抱', '溫暖', '擁抱'], category: 'love' },

  // Memes / Funny
  { id: 'meme_1', url: 'https://i.giphy.com/media/3xz2BLBOKhvgJXMIXc/giphy.gif', keywords: ['meme', 'facepalm', 'oops', '無奈', '捂臉', '搞笑', '天啊'], tags: ['meme', 'facepalm', 'oops', '無奈', '捂臉', '搞笑', '天啊'], category: 'meme' },
  { id: 'meme_2', url: 'https://i.giphy.com/media/20k1gTOlfqiGY/giphy.gif', keywords: ['confused', 'where', 'travolta', '迷茫', '問號', '在哪裡', '傻眼'], tags: ['confused', 'where', 'travolta', '迷茫', '問號', '在哪裡', '傻眼'], category: 'meme' },
  { id: 'meme_3', url: 'https://i.giphy.com/media/hVTouqNmVKiZy/giphy.gif', keywords: ['popcorn', 'watching', 'drama', '爆米花', '看戲', '吃瓜', '圍觀'], tags: ['popcorn', 'watching', 'drama', '爆米花', '看戲', '吃瓜', '圍觀'], category: 'meme' },
  { id: 'meme_4', url: 'https://i.giphy.com/media/3o7TKSjRrfIPjei1Hi/giphy.gif', keywords: ['doge', 'meme', 'dog', '狗狗', '迷因', '逗趣'], tags: ['doge', 'meme', 'dog', '狗狗', '迷因', '逗趣'], category: 'meme' },
  { id: 'meme_5', url: 'https://i.giphy.com/media/26n6Gx9yn6up1g6TC/giphy.gif', keywords: ['laugh', 'funny', 'haha', '笑', '哈哈', '大笑', '搞笑'], tags: ['laugh', 'funny', 'haha', '笑', '哈哈', '大笑', '搞笑'], category: 'meme' },
  { id: 'meme_6', url: 'https://i.giphy.com/media/l3q2LzK1t6y59AXLO/giphy.gif', keywords: ['shrug', 'whatever', '攤手', '無奈', '隨便', '聳肩'], tags: ['shrug', 'whatever', '攤手', '無奈', '隨便', '聳肩'], category: 'meme' }
];

const SAFE_PRESET_GIFS = PRESET_GIFS.map(gif => {
  const match = gif.url.match(/\/media\/([^\/]+)\//);
  const id = match ? match[1] : gif.id;
  return {
    ...gif,
    url: `https://i.giphy.com/${id}.gif`
  };
});

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

  const [userOnline, setUserOnline] = useState(true);
  const [isManualOffline, setIsManualOffline] = useState(false);
  const [allUserStatuses, setAllUserStatuses] = useState([]);
  const idleTimerRef = useRef(null);
  const chatEndRef = useRef(null);
  const isInitialNotificationsUidLoad = useRef(true);

  // Authentication & Moderator
  const [currentUser, setCurrentUser] = useState(() => {
    const cached = localStorage.getItem("echoes_user");
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed && parsed.googleId && !parsed.uid) {
          parsed.uid = parsed.googleId;
        }
        return parsed;
      } catch { /* ignore */ }
    }
    return { name: "我", handle: "@me_creator", avatarLetter: "ME", avatarUrl: null, uid: "", googleId: "" };
  });
  if (currentUser) {
    if (currentUser.googleId && !currentUser.uid) {
      currentUser.uid = currentUser.googleId;
    }
    if (!currentUser.uid) {
      currentUser.uid = currentUser.handle || "";
    }
    if (!currentUser.displayName && currentUser.name) {
      currentUser.displayName = currentUser.name;
    }
    if (!currentUser.id) {
      currentUser.id = currentUser.uid || currentUser.googleId || currentUser.handle;
    }
    if (!currentUser.photoURL) {
      currentUser.photoURL = currentUser.avatarUrl || "";
    }
  }
  const [adminAuthenticated, setAdminAuthenticated] = useState(() => {
    return sessionStorage.getItem("admin_authenticated") === "true";
  });

  // Main Posts Data
  const [posts, setPosts] = useState(() => {
    let rawPosts = [];
    if (!isFirebaseSetup) {
      const localPosts = localStorage.getItem("echoes_posts");
      if (localPosts) {
        try {
          rawPosts = JSON.parse(localPosts);
        } catch {
          rawPosts = [...DEFAULT_POSTS];
        }
      } else {
        rawPosts = [...DEFAULT_POSTS];
      }
    } else {
      rawPosts = [];
    }
    // Ensure mock posts and comments have a uid
    return rawPosts.map(p => {
      const pUid = p.uid || p.handle || p.author;
      const updatedComments = (p.comments || []).map(c => ({
        ...c,
        uid: c.uid || c.authorHandle || c.author
      }));
      return { ...p, uid: pUid, comments: updatedComments };
    });
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
  const [searchResults, setSearchResults] = useState(null);
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
  const [loginMode, setLoginMode] = useState("login"); // "login" or "register"
  const [registerNickname, setRegisterNickname] = useState("");

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
  const [categories, setCategories] = useState([
    { name: "個人想法", value: "Thoughts" },
    { name: "技術科技", value: "Tech" },
    { name: "生產力", value: "Productivity" },
    { name: "生活日常", value: "Life" },
    { name: "設計美學", value: "Design" }
  ]);

  // Post Specific States (Expanded comments section, active drafts, highlights)
  const [activeCommentsPostId, setActiveCommentsPostId] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const [highlightedPostId, setHighlightedPostId] = useState(null);
  const [toasts, setToasts] = useState([]);

  const [activeBookmarkTab, setActiveBookmarkTab] = useState("likes");
  const [notificationsList, setNotificationsList] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [activeChatFriend, setActiveChatFriend] = useState(null);
  const [friendSearchQuery, setFriendSearchQuery] = useState("");
  const [findFriendSearchQuery, setFindFriendSearchQuery] = useState("");
  const [messageText, setMessageText] = useState("");
  const [groupChats, setGroupChats] = useState([]);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState([]);
  const [currentPage, setCurrentPage] = useState("home"); // 頁面切換
  const [profileViewUid, setProfileViewUid] = useState(null); // 當前瀏覽的主頁 UID
  const [editBio, setEditBio] = useState("");
  const [editUsername, setEditUsername] = useState("");
  const [isSaveSuccess, setIsSaveSuccess] = useState(false);

  const [activeEmojiMenuMsgId, setActiveEmojiMenuMsgId] = useState(null);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [activeCommentEmojiMsgId, setActiveCommentEmojiMsgId] = useState(null);
  const [activeCommentGifPostId, setActiveCommentGifPostId] = useState(null);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [selectedGroupMembers, setSelectedGroupMembers] = useState([]);

  // GIF Search engine states
  const [giphyApiKey, setGiphyApiKey] = useState(() => localStorage.getItem("echoes_giphy_api_key") || "");
  const [showGiphyKeyInput, setShowGiphyKeyInput] = useState(false);
  const [showCommentGiphyKeyInput, setShowCommentGiphyKeyInput] = useState(false);
  const [gifSearchQuery, setGifSearchQuery] = useState("");
  const [chatSearchedGifs, setChatSearchedGifs] = useState([]);
  const [commentGifSearchQuery, setCommentGifSearchQuery] = useState("");
  const [commentSearchedGifs, setCommentSearchedGifs] = useState([]);
  const [isSearchingGifs, setIsSearchingGifs] = useState(false);
  const [isCommentSearchingGifs, setIsCommentSearchingGifs] = useState(false);

  // Admin blacklist & block states
  const [blacklistKeywords, setBlacklistKeywords] = useState(() => {
    const saved = localStorage.getItem("echoes_blacklist_keywords");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return ["詐騙", "政治敏感", "廣告", "fucking", "scam"];
  });
  const [newKeywordInput, setNewKeywordInput] = useState("");
  const [blockedUids, setBlockedUids] = useState(() => {
    const saved = localStorage.getItem("echoes_blocked_uids");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });

  const saveGiphyApiKey = (key) => {
    localStorage.setItem("echoes_giphy_api_key", key);
    setGiphyApiKey(key);
  };

  const loadInitialGifs = async (isComment = false) => {
    const setResults = isComment ? setCommentSearchedGifs : setChatSearchedGifs;
    const setLoading = isComment ? setIsCommentSearchingGifs : setIsSearchingGifs;
    setLoading(true);

    const key = (giphyApiKey && giphyApiKey.trim()) || "dc6zaTOxFJmzC";
    try {
      const url = `https://api.giphy.com/v1/gifs/trending?api_key=${encodeURIComponent(key)}&limit=24&rating=g`;
      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        if (json.data && Array.isArray(json.data)) {
          const mapped = json.data.map(item => ({
            url: `https://i.giphy.com/${item.id}.gif`,
            keywords: [item.title, ...item.tags].filter(Boolean),
            category: 'trending'
          }));
          setResults(mapped);
          setLoading(false);
          return;
        }
      }
    } catch (err) {
      console.error("Giphy initial load error:", err);
    }

    setResults(SAFE_PRESET_GIFS);
    setLoading(false);
  };

  const handleFetchGifs = async (queryText, isComment = false) => {
    const query = queryText.trim().toLowerCase();
    const setResults = isComment ? setCommentSearchedGifs : setChatSearchedGifs;
    const setLoading = isComment ? setIsCommentSearchingGifs : setIsSearchingGifs;

    if (!query) {
      loadInitialGifs(isComment);
      return;
    }

    setLoading(true);
    const key = (giphyApiKey && giphyApiKey.trim()) || "dc6zaTOxFJmzC";
    try {
      const url = `https://api.giphy.com/v1/gifs/search?api_key=${encodeURIComponent(key)}&q=${encodeURIComponent(query)}&limit=24&rating=g`;
      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        if (json.data && Array.isArray(json.data)) {
          const mapped = json.data.map(item => ({
            url: `https://i.giphy.com/${item.id}.gif`,
            keywords: [item.title, ...item.tags].filter(Boolean),
            category: 'search'
          }));
          setResults(mapped);
          setLoading(false);
          return;
        }
      }
    } catch (err) {
      console.error("Giphy search fetch error:", err);
    }

    const queryWords = query.split(/\s+/).filter(Boolean);
    const matched = SAFE_PRESET_GIFS.filter(gif => {
      return queryWords.every(word => 
        gif.keywords.some(kw => kw.toLowerCase().includes(word)) ||
        (gif.category && gif.category.toLowerCase().includes(word))
      );
    });
    setResults(matched);
    setLoading(false);
  };

  const showToast = (message) => {
    const id = Date.now() + Math.random().toString();
    setToasts(prev => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 2600);
  };

  const usersMap = useMemo(() => {
    const handleMap = new Map();
    const nameMap = new Map();
    usersList.forEach(u => {
      if (u.handle) handleMap.set(u.handle, u);
      if (u.name) nameMap.set(u.name, u);
    });
    return { handleMap, nameMap };
  }, [usersList]);

  const getLatestUserAvatar = useCallback((handle, name = null, uid = null) => {
    const myUid = currentUser.googleId || currentUser.uid;
    if ((uid && uid === myUid) || handle === currentUser.handle || (name && name === currentUser.name)) {
      return {
        name: currentUser.name,
        avatarLetter: currentUser.avatarLetter,
        avatarBg: currentUser.avatarBg,
        avatarUrl: currentUser.avatarUrl
      };
    }
    let found = null;
    if (handle) {
      found = usersMap.handleMap.get(handle);
    }
    if (!found && name) {
      found = usersMap.nameMap.get(name);
    }
    if (found) {
      return {
        name: found.name,
        avatarLetter: found.avatarLetter,
        avatarBg: found.avatarBg,
        avatarUrl: found.avatarUrl
      };
    }
    return null;
  }, [usersMap, currentUser]);

  const users = useMemo(() => {
    const registry = new Map();

    // 1. Add all users from usersList
    usersList.forEach(u => {
      const id = u.uid || u.googleId;
      if (id) {
        registry.set(id, {
          ...u,
          id,
          displayName: u.name || u.displayName || "未知使用者",
          photoURL: u.avatarUrl || u.photoURL || "",
          bio: u.bio || ""
        });
      }
    });

    // 2. Add users from posts (including DEFAULT_POSTS)
    posts.forEach(p => {
      const id = p.uid || p.handle || p.author;
      if (id && !registry.has(id)) {
        const latestProfile = getLatestUserAvatar(p.handle, p.author, p.uid);
        registry.set(id, {
          id,
          displayName: latestProfile ? latestProfile.name : p.author,
          handle: p.handle,
          avatarLetter: latestProfile ? latestProfile.avatarLetter : (p.avatarLetter || p.author.substring(0, 2).toUpperCase()),
          avatarBg: latestProfile ? latestProfile.avatarBg : (p.avatarBg || null),
          photoURL: latestProfile ? (latestProfile.avatarUrl || latestProfile.photoURL) : (p.avatarUrl || ""),
          bio: ""
        });
      }
    });

    // 3. Add users from comments
    posts.forEach(p => {
      if (p.comments) {
        p.comments.forEach(c => {
          const id = c.uid || c.authorHandle || c.author;
          if (id && !registry.has(id)) {
            const latestProfile = getLatestUserAvatar(c.authorHandle, c.author, c.uid);
            registry.set(id, {
              id,
              displayName: latestProfile ? latestProfile.name : c.author,
              handle: c.authorHandle || `@${c.author}`,
              avatarLetter: latestProfile ? latestProfile.avatarLetter : c.author.substring(0, 2).toUpperCase(),
              avatarBg: latestProfile ? latestProfile.avatarBg : null,
              photoURL: latestProfile ? (latestProfile.avatarUrl || latestProfile.photoURL) : "",
              bio: ""
            });
          }
        });
      }
    });

    return Array.from(registry.values());
  }, [usersList, posts]);

  const displayPosts = useMemo(() => {
    return posts.map(p => {
      const myUid = currentUser.googleId || currentUser.uid;
      let resolvedUid = p.uid;
      if (p.handle === currentUser.handle) {
        resolvedUid = myUid;
      } else {
        const postUser = usersMap.handleMap.get(p.handle);
        if (postUser) {
          resolvedUid = postUser.uid || postUser.googleId;
        }
      }
      return {
        ...p,
        uid: resolvedUid || p.uid || p.handle || p.author
      };
    });
  }, [posts, usersMap, currentUser]);

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
      if (hash === "#/profile") {
        setCurrentPage("profile");
      } else {
        setCurrentPage("");
      }

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
    localStorage.setItem("echoes_blacklist_keywords", JSON.stringify(blacklistKeywords));
  }, [blacklistKeywords]);

  useEffect(() => {
    localStorage.setItem("echoes_blocked_uids", JSON.stringify(blockedUids));
  }, [blockedUids]);

  // Auto scroll to top when changing profile pages or switching to profile view
  useEffect(() => {
    if (currentPage === "profile") {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentPage, profileViewUid]);

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
        const latestPostProfile = getLatestUserAvatar(post.handle, post.author, post.uid);
        const postUid = post.uid || (latestPostProfile ? (latestPostProfile.googleId || latestPostProfile.uid) : post.handle || post.author);
        batch.set(docRef, {
          uid: postUid,
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
          comments: post.comments.map(c => {
            const latestProfile = getLatestUserAvatar(c.authorHandle, c.author, c.uid);
            const authorHandle = c.authorHandle || (latestProfile ? latestProfile.handle : `@${c.author.toLowerCase()}`);
            const commentUid = c.uid || (latestProfile ? (latestProfile.googleId || latestProfile.uid) : authorHandle || c.author);
            return {
              id: c.id,
              author: c.author,
              authorHandle: authorHandle,
              uid: commentUid,
              text: c.text,
              time: c.time
            };
          }),
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
    if (!isFirebaseSetup || !isLoggedIn) {
      return;
    }

    let isInitialLoad = true;

    // Firestore mode subscription
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsList = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        postsList.push({
          id: doc.id,
          ...data,
          uid: data.uid || data.handle || data.author,
          comments: (data.comments || []).map(c => ({
            ...c,
            uid: c.uid || c.authorHandle || c.author
          })),
          date: data.createdAt ? formatRelativeDate(data.createdAt.toDate(), currentLang) : "just now",
        });
      });

      if (postsList.length === 0) {
        seedDefaultPosts();
      } else {
        isInitialLoad = false;
        setPosts(postsList);
      }
    }, (error) => {
      console.error("Firestore loading error:", error);
      if (error.message.includes("permission") || error.code === "permission-denied") {
        showToast("⚠️ 雲端資料庫拒絕讀取，請確認 Firebase 中 Firestore 的 Rules 規則是否已開啟！");
      } else {
        showToast("⚠️ 雲端資料庫載入失敗，已切換至本機暫存模式");
      }
      // Fallback
      setPosts(DEFAULT_POSTS.map(p => {
        const pUid = p.uid || p.handle || p.author;
        const updatedComments = (p.comments || []).map(c => ({
          ...c,
          uid: c.uid || c.authorHandle || c.author
        }));
        return { ...p, uid: pUid, comments: updatedComments };
      }));
    });

    return () => unsubscribe();
  }, [currentLang, currentUser.handle, isLoggedIn]);

  // Subscribe to user notifications
  useEffect(() => {
    if (!isFirebaseSetup || !isLoggedIn) {
      setNotificationsList([]);
      isInitialNotificationsUidLoad.current = true;
      return;
    }

    const currentUserUid = currentUser.googleId || currentUser.uid;
    let unsubHandle = () => {};
    let unsubUid = () => {};
    let handleList = [];
    let uidList = [];

    const updateCombinedList = () => {
      const map = new Map();
      handleList.forEach(n => map.set(n.id, n));
      uidList.forEach(n => map.set(n.id, n));
      const sorted = Array.from(map.values()).sort((a, b) => {
        const getMs = (t) => {
          if (!t) return 0;
          if (t.toDate) return t.toDate().getTime();
          if (typeof t === 'number') return t;
          const parsed = new Date(t).getTime();
          return isNaN(parsed) ? 0 : parsed;
        };
        return getMs(b.timestamp) - getMs(a.timestamp);
      });
      setNotificationsList(sorted);
    };

    if (currentUser.handle) {
      const qHandle = query(
        collection(db, "notifications"),
        where("userHandle", "==", currentUser.handle)
      );
      unsubHandle = onSnapshot(qHandle, (snapshot) => {
        const list = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          if (data.type === "new_post" || data.type === "mention" || data.type === "friend_request" || data.type === "reply" || data.type === "comment") {
            list.push({ id: doc.id, ...data });
          }
        });
        handleList = list;
        updateCombinedList();
      }, (error) => {
        console.error("Error fetching notifications by handle:", error);
      });
    }

    if (currentUserUid) {
      const qUid = query(
        collection(db, "notifications"),
        where("toUid", "==", currentUserUid)
      );
      unsubUid = onSnapshot(qUid, (snapshot) => {
        const list = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          if (data.type === "new_post" || data.type === "mention" || data.type === "friend_request" || data.type === "reply" || data.type === "comment") {
            list.push({ id: doc.id, ...data });
          }
        });

        if (!isInitialNotificationsUidLoad.current) {
          snapshot.docChanges().forEach((change) => {
            if (change.type === "added") {
              const newNotif = change.doc.data();
              if (newNotif.type === "new_post") {
                showToast(currentLang === "en" ? `New post from your friend ${newNotif.fromName || 'Friend'}!` : `好友 ${newNotif.fromName || '好友'} 發布了新貼文！`);
              } else if (newNotif.type === "mention") {
                showToast(currentLang === "en" ? `${newNotif.fromName || 'Someone'} mentioned you in a post!` : `${newNotif.fromName || '有人'} 在貼文中標記了您！`);
              } else if (newNotif.type === "friend_request") {
                showToast(currentLang === "en" ? `${newNotif.fromName || 'Someone'} sent you a friend request!` : `${newNotif.fromName || '有人'} 向您發送了好友請求！`);
              } else if (newNotif.type === "reply" || newNotif.type === "comment") {
                showToast(currentLang === "en" ? `${newNotif.fromName || 'Someone'} replied to your post!` : `${newNotif.fromName || '有人'} 回覆了您的貼文！`);
              }
            }
          });
        }
        isInitialNotificationsUidLoad.current = false;
        uidList = list;
        updateCombinedList();
      }, (error) => {
        console.error("Error fetching notifications by toUid:", error);
      });
    }

    return () => {
      unsubHandle();
      unsubUid();
    };
  }, [currentUser.handle, currentUser.googleId, currentUser.uid, isLoggedIn, currentLang]);

  // Subscribe to categories in Firestore and seed if empty
  useEffect(() => {
    if (!isFirebaseSetup || !isLoggedIn) return;

    const unsubscribe = onSnapshot(collection(db, "categories"), async (snapshot) => {
      if (snapshot.empty) {
        // Seed default categories
        const defaults = [
          { name: "個人想法", value: "Thoughts" },
          { name: "技術科技", value: "Tech" },
          { name: "生產力", value: "Productivity" },
          { name: "生活日常", value: "Life" },
          { name: "設計美學", value: "Design" }
        ];
        
        try {
          const batch = writeBatch(db);
          defaults.forEach((cat) => {
            const catDocRef = doc(collection(db, "categories"));
            batch.set(catDocRef, {
              ...cat,
              createdAt: Date.now()
            });
          });
          await batch.commit();
        } catch (err) {
          console.error("Failed to seed default categories:", err);
        }
      } else {
        const list = [];
        const currentUserUid = currentUser?.uid || currentUser?.googleId;
        snapshot.forEach((doc) => {
          const data = doc.data();
          // 情況 A：無 userId 欄位（系統公共分類）
          // 情況 B：userId === currentUser.uid（當前使用者自訂分類）
          if (!data.userId || data.userId === currentUserUid) {
            list.push({ id: doc.id, ...data });
          }
        });
        // Sort categories by createdAt so they appear in a consistent order
        list.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
        setCategories(list);
      }
    }, (error) => {
      console.error("Error listening to categories:", error);
    });

    return () => unsubscribe();
  }, [currentUser.uid, currentUser.googleId, isLoggedIn]);

  // Subscribe to all users list (for friends adding)
  useEffect(() => {
    if (!isFirebaseSetup || !isLoggedIn || !currentUser.handle) return;

    const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
      const list = [];
      const dbBlockedUids = [];
      snapshot.forEach((doc) => {
        const u = doc.data();
        const myUid = currentUser.googleId || currentUser.uid;
        const userUid = u.uid || u.googleId;
        if (userUid !== myUid && u.handle !== currentUser.handle) {
          list.push(u);
        }
        if (u.blocked) {
          if (u.uid) dbBlockedUids.push(u.uid);
          if (u.handle) dbBlockedUids.push(u.handle);
        }
      });
      setUsersList(list);
      if (dbBlockedUids.length > 0) {
        setBlockedUids(prev => {
          const union = new Set([...prev, ...dbBlockedUids]);
          return Array.from(union);
        });
      }
    }, (error) => {
      console.error("Error fetching users:", error);
    });

    return () => unsubscribe();
  }, [currentUser.handle, isLoggedIn]);

  // Subscribe to incoming pending friend requests
  useEffect(() => {
    if (!isFirebaseSetup || !isLoggedIn) {
      setIncomingRequests([]);
      return;
    }
    const currentUserUid = currentUser.googleId || currentUser.uid;
    if (!currentUserUid) return;

    const q = query(
      collection(db, "friendRequests"),
      where("toUid", "==", currentUserUid),
      where("status", "==", "pending")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = [];
      snapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      setIncomingRequests(list);
    }, (error) => {
      console.error("Error fetching incoming requests:", error);
    });

    return () => unsubscribe();
  }, [currentUser.googleId, currentUser.uid, isLoggedIn]);

  // Subscribe to sent friend requests (all)
  useEffect(() => {
    if (!isFirebaseSetup || !isLoggedIn) {
      setSentRequests([]);
      return;
    }
    const currentUserUid = currentUser.googleId || currentUser.uid;
    if (!currentUserUid) return;

    const q = query(
      collection(db, "friendRequests"),
      where("fromUid", "==", currentUserUid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = [];
      snapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      setSentRequests(list);
    }, (error) => {
      console.error("Error fetching sent requests:", error);
    });

    return () => unsubscribe();
  }, [currentUser.googleId, currentUser.uid, isLoggedIn]);

  // Subscribe to received friend requests (all)
  useEffect(() => {
    if (!isFirebaseSetup || !isLoggedIn) {
      setReceivedRequests([]);
      return;
    }
    const currentUserUid = currentUser.googleId || currentUser.uid;
    if (!currentUserUid) return;

    const q = query(
      collection(db, "friendRequests"),
      where("toUid", "==", currentUserUid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = [];
      snapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      setReceivedRequests(list);
    }, (error) => {
      console.error("Error fetching received requests:", error);
    });

    return () => unsubscribe();
  }, [currentUser.googleId, currentUser.uid, isLoggedIn]);

  // Subscribe to group chats
  useEffect(() => {
    if (!isFirebaseSetup || !isLoggedIn) {
      setGroupChats([]);
      return;
    }
    const currentUserUid = currentUser.googleId || currentUser.uid;
    if (!currentUserUid) return;

    const q = query(
      collection(db, "chats"),
      where("members", "array-contains", currentUserUid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = [];
      snapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      setGroupChats(list);
    }, (error) => {
      console.error("Error fetching group chats:", error);
    });

    return () => unsubscribe();
  }, [currentUser.googleId, currentUser.uid, isLoggedIn]);

  // Subscribe to chat messages
  useEffect(() => {
    const currentUserUid = currentUser.googleId || currentUser.uid;
    if (!isFirebaseSetup || !isLoggedIn || !currentUserUid || !activeChatFriend) {
      setChatMessages([]);
      return;
    }

    const isGroup = activeChatFriend.type === "group";
    const activeChatFriendUid = activeChatFriend.googleId || activeChatFriend.uid;

    if (isGroup) {
      const q = query(
        collection(db, "messages"),
        where("chatId", "==", activeChatFriend.id)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const list = [];
        snapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        list.sort((a, b) => {
          const timeA = a.timestamp?.toDate ? a.timestamp.toDate().getTime() : (typeof a.timestamp === 'number' ? a.timestamp : new Date(a.timestamp).getTime());
          const timeB = b.timestamp?.toDate ? b.timestamp.toDate().getTime() : (typeof b.timestamp === 'number' ? b.timestamp : new Date(b.timestamp).getTime());
          return (timeA || 0) - (timeB || 0);
        });
        setChatMessages(list);
      }, (error) => {
        console.error("Error fetching group messages:", error);
      });

      return () => unsubscribe();
    }

    if (!activeChatFriendUid) {
      setChatMessages([]);
      return;
    }

    let listA = [];
    let listB = [];

    const updateCombinedMessages = () => {
      const map = new Map();
      listA.forEach(m => map.set(m.id, m));
      listB.forEach(m => map.set(m.id, m));
      const combined = Array.from(map.values()).sort((a, b) => {
        const timeA = a.timestamp?.toDate ? a.timestamp.toDate().getTime() : (typeof a.timestamp === 'number' ? a.timestamp : new Date(a.timestamp).getTime());
        const timeB = b.timestamp?.toDate ? b.timestamp.toDate().getTime() : (typeof b.timestamp === 'number' ? b.timestamp : new Date(b.timestamp).getTime());
        return (timeA || 0) - (timeB || 0);
      });
      setChatMessages(combined);
    };

    // Query 1: senderId == currentUserUid && receiverId == activeChatFriendUid
    const q1 = query(
      collection(db, "messages"),
      where("senderId", "==", currentUserUid),
      where("receiverId", "==", activeChatFriendUid)
    );

    const unsub1 = onSnapshot(q1, (snapshot) => {
      const list = [];
      snapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      listA = list;
      updateCombinedMessages();
    }, (error) => {
      console.error("Error fetching messages q1:", error);
    });

    // Query 2: senderId == activeChatFriendUid && receiverId == currentUserUid
    const q2 = query(
      collection(db, "messages"),
      where("senderId", "==", activeChatFriendUid),
      where("receiverId", "==", currentUserUid)
    );

    const unsub2 = onSnapshot(q2, (snapshot) => {
      const list = [];
      snapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      listB = list;
      updateCombinedMessages();
    }, (error) => {
      console.error("Error fetching messages q2:", error);
    });

    return () => {
      unsub1();
      unsub2();
    };
  }, [activeChatFriend, currentUser.googleId, currentUser.uid, isLoggedIn]);

  // Auto scroll to bottom of chat when messages update or chat friend changes
  useEffect(() => {
    if (chatEndRef.current) {
      const container = chatEndRef.current.parentElement;
      if (container) {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: "smooth"
        });
      }
    }
  }, [chatMessages, activeChatFriend]);

  // Subscribe to unread messages and count
  useEffect(() => {
    if (!isFirebaseSetup || !isLoggedIn) {
      setUnreadMessages([]);
      setUnreadMessagesCount(0);
      return;
    }
    const currentUserUid = currentUser.googleId || currentUser.uid;
    if (!currentUserUid) return;

    const q = query(
      collection(db, "messages"),
      where("isRead", "==", false)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = [];
      let totalCount = 0;
      const groupChatIds = new Set(groupChats.map(g => g.id));

      snapshot.forEach((doc) => {
        const msg = doc.data();
        const msgId = doc.id;
        msgs.push({ id: msgId, ...msg });

        if (msg.receiverId === currentUserUid) {
          totalCount++;
        } else if (msg.chatId && groupChatIds.has(msg.chatId)) {
          const readBy = msg.readBy || [];
          if (msg.senderId !== currentUserUid && !readBy.includes(currentUserUid)) {
            totalCount++;
          }
        }
      });
      setUnreadMessages(msgs);
      setUnreadMessagesCount(totalCount);
    }, (error) => {
      console.error("Error fetching unread messages:", error);
    });

    return () => unsubscribe();
  }, [currentUser.googleId, currentUser.uid, isLoggedIn, groupChats]);

  const getFriendUnreadCount = (friend) => {
    const currentUserUid = currentUser.googleId || currentUser.uid;
    if (!currentUserUid) return 0;
    const friendUid = friend.googleId || friend.uid;
    if (!friendUid) return 0;
    return unreadMessages.filter(msg => 
      msg.senderId === friendUid && 
      msg.receiverId === currentUserUid && 
      msg.isRead === false
    ).length;
  };

  const getGroupUnreadCount = (groupId) => {
    const currentUserUid = currentUser.googleId || currentUser.uid;
    if (!currentUserUid) return 0;
    return unreadMessages.filter(msg => 
      msg.chatId === groupId && 
      msg.senderId !== currentUserUid && 
      !(msg.readBy || []).includes(currentUserUid)
    ).length;
  };

  const handleSaveProfileSettings = async () => {
    const isLoggedIn = !!(currentUser.googleId && currentUser.handle !== "@me_creator");
    if (!isLoggedIn) return;
    const cleanUsername = editUsername.trim().replace(/\s+/g, "").replace(/[^a-zA-Z0-9_]/g, "");
    if (!cleanUsername) {
      showToast("請輸入有效的 @帳號名稱！");
      return;
    }

    const nextUser = {
      ...currentUser,
      bio: editBio.trim(),
      username: cleanUsername,
      handle: "@" + cleanUsername
    };

    nextUser.id = nextUser.uid || nextUser.googleId;
    nextUser.displayName = nextUser.name || nextUser.displayName;
    nextUser.photoURL = nextUser.avatarUrl || nextUser.photoURL;

    setCurrentUser(nextUser);
    localStorage.setItem("echoes_user", JSON.stringify(nextUser));

    if (isFirebaseSetup && currentUser.email) {
      try {
        const userDocRef = doc(db, "users", currentUser.email);
        await setDoc(userDocRef, nextUser);

        // Update posts with new handles
        const q = query(
          collection(db, "posts"),
          where("handle", "==", currentUser.handle)
        );
        const snapshot = await getDocs(q);
        const batch = writeBatch(db);
        snapshot.forEach(docSnap => {
          batch.update(docSnap.ref, {
            handle: "@" + cleanUsername
          });
        });
        await batch.commit();
        showToast("✨ 個人資料設定已更新！");
        setIsSaveSuccess(true);
        setTimeout(() => setIsSaveSuccess(false), 2000);
      } catch (err) {
        console.error("Failed to save profile settings:", err);
        showToast("儲存設定失敗");
      }
    } else {
      showToast("✨ 本地個人資料已更新！");
      setIsSaveSuccess(true);
      setTimeout(() => setIsSaveSuccess(false), 2000);
    }
  };

  const getPostAuthorUid = (post) => {
    if (!post) return null;
    const myUid = currentUser.googleId || currentUser.uid;
    if (post.handle === currentUser.handle) {
      return myUid;
    }
    const postUser = usersList.find(u => u.handle === post.handle);
    return post.uid || (postUser ? (postUser.googleId || postUser.uid) : post.handle || post.author);
  };

  const getCommentAuthorUid = (c) => {
    if (!c) return null;
    const myUid = currentUser.googleId || currentUser.uid;
    if (c.authorHandle === currentUser.handle || (c.author && c.author === currentUser.name)) {
      return myUid;
    }
    const commentUser = usersList.find(u => u.handle === c.authorHandle || u.name === c.author);
    return c.uid || (commentUser ? (commentUser.googleId || commentUser.uid) : c.authorHandle || c.author);
  };

  useEffect(() => {
    const myUid = currentUser.googleId || currentUser.uid;
    if (profileViewUid === myUid || !profileViewUid) {
      setEditBio(currentUser.bio || "");
      setEditUsername(currentUser.username || currentUser.handle?.replace("@", "") || "");
    }
  }, [profileViewUid, currentUser]);

  // Mark active chat messages as read
  useEffect(() => {
    if (!isFirebaseSetup || !isLoggedIn || !activeChatFriend || chatMessages.length === 0) return;
    const currentUserUid = currentUser.googleId || currentUser.uid;
    if (!currentUserUid) return;

    const isGroup = activeChatFriend.type === "group";
    
    chatMessages.forEach(async (msg) => {
      if (isGroup) {
        const readBy = msg.readBy || [];
        if (msg.senderId !== currentUserUid && !readBy.includes(currentUserUid)) {
          try {
            const msgRef = doc(db, "messages", msg.id);
            await updateDoc(msgRef, {
              readBy: arrayUnion(currentUserUid)
            });
          } catch (err) {
            console.error("Failed to mark group message as read:", err);
          }
        }
      } else {
        if (msg.receiverId === currentUserUid && msg.isRead === false) {
          try {
            const msgRef = doc(db, "messages", msg.id);
            await updateDoc(msgRef, {
              isRead: true
            });
          } catch (err) {
            console.error("Failed to mark DM as read:", err);
          }
        }
      }
    });
  }, [chatMessages, activeChatFriend, currentUser.googleId, currentUser.uid]);

  useEffect(() => {
    localStorage.setItem("echoes_lang", currentLang);
  }, [currentLang]);

  useEffect(() => {
    if (showGifPicker) {
      setGifSearchQuery("");
      loadInitialGifs(false);
    }
  }, [showGifPicker, giphyApiKey]);

  useEffect(() => {
    if (activeCommentGifPostId) {
      setCommentGifSearchQuery("");
      loadInitialGifs(true);
    }
  }, [activeCommentGifPostId, giphyApiKey]);

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

  // 1. Heartbeat timer presence writer to Firestore
  useEffect(() => {
    if (!isFirebaseSetup || !isLoggedIn || !currentUser.googleId) return;

    const writeHeartbeat = async (isOnline = true) => {
      try {
        const statusDocRef = doc(db, "userStatus", currentUser.googleId);
        await setDoc(statusDocRef, {
          uid: currentUser.googleId,
          displayName: currentUser.name || currentUser.email.split('@')[0],
          photoURL: currentUser.avatarUrl || "",
          status: isOnline ? "online" : "offline",
          lastSeen: Date.now()
        }, { merge: true });
      } catch (err) {
        console.error("Heartbeat presence write failed:", err);
      }
    };

    // Run immediately on login/mount
    writeHeartbeat(true);

    // Run every 20 seconds
    const interval = setInterval(() => writeHeartbeat(true), 20000);

    return () => {
      clearInterval(interval);
      // cleanup: mark offline
      if (currentUser && currentUser.googleId) {
        const statusDocRef = doc(db, "userStatus", currentUser.googleId);
        setDoc(statusDocRef, {
          status: "offline",
          lastSeen: Date.now()
        }, { merge: true }).catch(err => console.error("Heartbeat cleanup error:", err));
      }
    };
  }, [currentUser, isLoggedIn, userOnline, isManualOffline]);

  // 2. Ticker to update currentTime state every 5 seconds for UI dynamic status check
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // 3. Listen to userStatus collection in Firestore
  useEffect(() => {
    if (!isFirebaseSetup) return;

    const unsubscribe = onSnapshot(collection(db, "userStatus"), (snapshot) => {
      const statusList = [];
      snapshot.forEach((doc) => {
        statusList.push(doc.data());
      });
      setAllUserStatuses(statusList);
    }, (error) => {
      console.error("Error listening to userStatus:", error);
    });

    return () => unsubscribe();
  }, []);

  // 4. Dynamically compute currently active online users (updated within 60 seconds)
  const onlineUsers = useMemo(() => {
    const list = allUserStatuses.filter(u => u.status === "online" && (currentTime - (u.lastSeen || 0)) < 60000);
    console.log("當前在線人數:", list);
    return list;
  }, [allUserStatuses, currentTime]);

  // ==========================================================================
  // ACTION HANDLERS
  // ==========================================================================

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
  const submitTraditionalLogin = async () => {
    const email = loginEmail.trim().toLowerCase();
    const password = loginPassword.trim();

    if (!email.includes("@") || password === "") {
      showToast("請輸入完整的 Email 與密碼！");
      return;
    }

    if (isFirebaseSetup) {
      try {
        const userDocRef = doc(db, "users", email);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.password === password) {
            setCurrentUser(userData);
            setModalLoginVisible(false);
            setLoginEmail("");
            setLoginPassword("");
            showToast(t("toast_logged_in"));
          } else {
            showToast("密碼錯誤，請重新輸入！");
          }
        } else {
          showToast("此帳號不存在，請先切換至註冊！");
        }
      } catch (err) {
        console.error("Login connection failed", err);
        if (err.message.includes("permission") || err.code === "permission-denied") {
          showToast("⚠️ 登入失敗：雲端資料庫拒絕存取，請檢查 Firestore 規則是否開啟！");
        } else {
          showToast("資料庫連線失敗，請檢查金鑰或網路");
        }
      }
    } else {
      // LocalStorage mode login
      const localUsers = JSON.parse(localStorage.getItem("echoes_local_users") || "{}");
      const userData = localUsers[email];
      if (userData) {
        if (userData.password === password) {
          setCurrentUser(userData);
          setModalLoginVisible(false);
          setLoginEmail("");
          setLoginPassword("");
          showToast(t("toast_logged_in"));
        } else {
          showToast("密碼錯誤，請重新輸入！");
        }
      } else {
        showToast("本地帳號不存在，請先切換至註冊！");
      }
    }
  };

  // Handle Registration
  const handleRegister = async () => {
    const email = loginEmail.trim().toLowerCase();
    const password = loginPassword.trim();
    const nickname = registerNickname.trim();

    if (!email.includes("@") || password === "" || nickname === "") {
      showToast("請輸入完整的註冊資訊（Email、密碼與暱稱）！");
      return;
    }

    if (isFirebaseSetup) {
      try {
        // 檢查信箱是否已註冊
        const userDocRef = doc(db, "users", email);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          showToast("此 Email 已經註冊過，請直接登入！");
          return;
        }

        const handle = "@" + nickname.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_\u4e00-\u9fff]/g, "").substring(0, 20);
        const randomAv = PRESET_AVATARS[Math.floor(Math.random() * PRESET_AVATARS.length)];
        const userData = {
          email: email,
          password: password,
          name: nickname,
          handle: handle,
          avatarLetter: nickname.substring(0, 2).toUpperCase() || "U",
          avatarBg: randomAv.bg,
          avatarUrl: null,
          googleId: "uid_" + email.replace(/[^a-z0-9]/g, "_"),
          uid: "uid_" + email.replace(/[^a-z0-9]/g, "_")
        };

        // 寫入資料庫
        await setDoc(userDocRef, userData);

        // 登入
        setCurrentUser(userData);
        setModalLoginVisible(false);
        setLoginEmail("");
        setLoginPassword("");
        setRegisterNickname("");
        setLoginMode("login");
        showToast("註冊並登入成功！");
      } catch (err) {
        console.error("Registration error:", err);
        if (err.message.includes("permission") || err.code === "permission-denied") {
          showToast("⚠️ 註冊失敗：雲端資料庫拒絕存取，請檢查 Firestore 規則是否開啟！");
        } else {
          showToast("資料庫連線失敗，請稍後再試！");
        }
      }
    } else {
      // LocalStorage mode registration
      const localUsers = JSON.parse(localStorage.getItem("echoes_local_users") || "{}");
      if (localUsers[email]) {
        showToast("此 Email 已經在本地註冊過，請直接登入！");
        return;
      }

      const handle = "@" + nickname.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_\u4e00-\u9fff]/g, "").substring(0, 20);
      const randomAv = PRESET_AVATARS[Math.floor(Math.random() * PRESET_AVATARS.length)];
      const userData = {
        email: email,
        password: password,
        name: nickname,
        handle: handle,
        avatarLetter: nickname.substring(0, 2).toUpperCase() || "U",
        avatarBg: randomAv.bg,
        avatarUrl: null,
        googleId: "uid_" + email.replace(/[^a-z0-9]/g, "_"),
        uid: "uid_" + email.replace(/[^a-z0-9]/g, "_")
      };

      localUsers[email] = userData;
      localStorage.setItem("echoes_local_users", JSON.stringify(localUsers));

      setCurrentUser(userData);
      setModalLoginVisible(false);
      setLoginEmail("");
      setLoginPassword("");
      setRegisterNickname("");
      setLoginMode("login");
      showToast("本地模擬註冊與登入成功！");
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
  // Update profile setup details
  const submitProfileSave = async () => {
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

    // 同步到 Firestore
    if (isFirebaseSetup && currentUser.email) {
      try {
        const userDocRef = doc(db, "users", currentUser.email);
        await setDoc(userDocRef, nextUser);

        // 解決方案 A：批次更新貼文集合中當前使用者的頭像與暱稱資訊
        const q = query(
          collection(db, "posts"),
          where("handle", "==", currentUser.handle)
        );
        const snapshot = await getDocs(q);
        const batch = writeBatch(db);
        snapshot.forEach(docSnap => {
          batch.update(docSnap.ref, {
            author: nextUser.name,
            avatarLetter: nextUser.avatarLetter || null,
            avatarBg: nextUser.avatarBg || null,
            avatarUrl: nextUser.avatarUrl || null
          });
        });
        await batch.commit();
      } catch (err) {
        console.error("Failed to sync profile updates to Firestore:", err);
      }
    }

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
      reader.onload = async (evt) => {
        const nextUser = {
          ...currentUser,
          avatarUrl: evt.target.result,
          avatarBg: null
        };
        setCurrentUser(nextUser);

        if (isFirebaseSetup && currentUser.email) {
          try {
            const userDocRef = doc(db, "users", currentUser.email);
            await setDoc(userDocRef, nextUser);

            // 更新貼文中的頭像
            const q = query(
              collection(db, "posts"),
              where("handle", "==", currentUser.handle)
            );
            const snapshot = await getDocs(q);
            const batch = writeBatch(db);
            snapshot.forEach(docSnap => {
              batch.update(docSnap.ref, {
                avatarUrl: evt.target.result,
                avatarBg: null
              });
            });
            await batch.commit();
          } catch (err) {
            console.error("Failed to sync avatar upload to Firestore:", err);
          }
        }
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

  // Helper to translate category values to Chinese
  const getCategoryLabel = (catValue) => {
    const found = categories.find(c => c.value === catValue || c.name === catValue);
    if (found) return found.name;
    
    const fallbackMap = {
      "Thoughts": "個人想法",
      "Tech": "技術科技",
      "Productivity": "生產力",
      "Life": "生活日常",
      "Design": "設計美學"
    };
    return fallbackMap[catValue] || catValue;
  };

  // Add new category
  const handleAddCategory = async () => {
    const newCat = prompt(currentLang === "en" ? "Enter new category name:" : "請輸入新的分類名稱：");
    if (!newCat) return null;
    const trimmed = newCat.trim();
    if (!trimmed) {
      showToast(currentLang === "en" ? "Category name cannot be empty" : "分類名稱不能為空");
      return null;
    }
    
    // Check if category already exists
    const exists = categories.some(cat => 
      cat.name.toLowerCase() === trimmed.toLowerCase() || 
      cat.value.toLowerCase() === trimmed.toLowerCase()
    );
    if (exists) {
      showToast(currentLang === "en" ? "Category already exists" : "該分類已存在");
      return null;
    }

    if (isFirebaseSetup) {
      try {
        const currentUserUid = currentUser?.uid || currentUser?.googleId;
        await addDoc(collection(db, "categories"), {
          name: trimmed,
          value: trimmed,
          userId: currentUserUid,
          createdAt: Date.now()
        });
        setComposerCategory(trimmed);
        showToast(currentLang === "en" ? `Category "${trimmed}" added` : `已成功新增分類「${trimmed}」`);
        return trimmed;
      } catch (err) {
        console.error("Failed to add category:", err);
        showToast(currentLang === "en" ? "Failed to add category to database" : "無法新增分類到資料庫");
        return null;
      }
    } else {
      // Local fallback
      const currentUserUid = currentUser?.uid || currentUser?.googleId;
      const newCatObj = { name: trimmed, value: trimmed, userId: currentUserUid, createdAt: Date.now() };
      setCategories(prev => [...prev, newCatObj]);
      setComposerCategory(trimmed);
      showToast(currentLang === "en" ? `Category "${trimmed}" added locally` : `已於本地新增分類「${trimmed}」`);
      return trimmed;
    }
  };

  // Handle category select change
  const handleCategoryChange = async (e) => {
    const val = e.target.value;
    if (val === "ADD_NEW_CATEGORY") {
      const added = await handleAddCategory();
      if (!added) {
        // Fallback to the first category
        const defaultVal = categories[0]?.value || "Thoughts";
        setComposerCategory(defaultVal);
      }
    } else {
      setComposerCategory(val);
    }
  };

  // Delete category
  const handleDeleteCategory = async () => {
    const targetCat = categories.find(c => c.value === composerCategory);
    if (!targetCat) return;

    const confirmMsg = currentLang === "en" 
      ? `Are you sure you want to delete the category "${targetCat.name}"?` 
      : `確定要刪除「${targetCat.name}」分類嗎？`;

    if (!window.confirm(confirmMsg)) return;

    if (isFirebaseSetup) {
      try {
        if (targetCat.id) {
          await deleteDoc(doc(db, "categories", targetCat.id));
        } else {
          const q = query(collection(db, "categories"), where("value", "==", composerCategory));
          const snap = await getDocs(q);
          const deletePromises = [];
          snap.forEach(docSnap => {
            deletePromises.push(deleteDoc(doc(db, "categories", docSnap.id)));
          });
          await Promise.all(deletePromises);
        }
        
        const defaultVal = "Thoughts";
        setComposerCategory(defaultVal);
        showToast(currentLang === "en" ? `Category "${targetCat.name}" deleted` : `已成功刪除分類「${targetCat.name}」`);
      } catch (err) {
        console.error("Failed to delete category:", err);
        showToast(currentLang === "en" ? "Failed to delete category from database" : "無法自資料庫刪除分類");
      }
    } else {
      setCategories(prev => prev.filter(c => c.value !== composerCategory));
      const defaultVal = "Thoughts";
      setComposerCategory(defaultVal);
      showToast(currentLang === "en" ? `Category "${targetCat.name}" deleted locally` : `已於本地刪除分類「${targetCat.name}」`);
    }
  };

  // Publish Post action
  const handlePublishPost = async () => {
    const textVal = composerText.trim();
    if (!textVal) {
      showToast(t("toast_no_text"));
      return;
    }

    const containsBlacklist = blacklistKeywords.some(kw => textVal.toLowerCase().includes(kw.toLowerCase()));
    const postData = {
      uid: currentUser.googleId || currentUser.uid,
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
      isDefault: false,
      hidden: containsBlacklist
    };

    if (isFirebaseSetup) {
      try {
        const postDocRef = await addDoc(collection(db, "posts"), {
          ...postData,
          createdAt: new Date()
        });
        const postId = postDocRef.id;

        // 1. 去 friendRequests 集合中查詢當前使用者的所有「已確認好友」
        const currentUserUid = currentUser.uid || currentUser.googleId;
        if (currentUserUid) {
          const friendUids = [];

          // 查詢 A：由當前使用者送出的好友關係
          const q1 = query(
            collection(db, "friendRequests"),
            where("fromUid", "==", currentUserUid),
            where("status", "==", "accepted")
          );
          const snap1 = await getDocs(q1);
          snap1.forEach(docSnap => {
            const data = docSnap.data();
            // 當 fromUid === currentUser.uid 時，好友的 UID 就是 toUid
            const friendUid = data.toUid;
            if (friendUid && !friendUids.includes(friendUid)) {
              friendUids.push(friendUid);
            }
          });

          // 查詢 B：由他人送出並被當前使用者接受的好友關係
          const q2 = query(
            collection(db, "friendRequests"),
            where("toUid", "==", currentUserUid),
            where("status", "==", "accepted")
          );
          const snap2 = await getDocs(q2);
          snap2.forEach(docSnap => {
            const data = docSnap.data();
            // 當 toUid === currentUser.uid 時，好友的 UID 就是 fromUid
            const friendUid = data.fromUid;
            if (friendUid && !friendUids.includes(friendUid)) {
              friendUids.push(friendUid);
            }
          });

          // 2. 向 notifications 為「每一位好友」寫入一筆新通知
          if (friendUids.length > 0) {
            const senderName = currentUser.displayName || currentUser.name || '您的好友';
            const notificationPromises = friendUids.map(friendUid => {
              return addDoc(collection(db, "notifications"), {
                toUid: friendUid,
                fromUid: currentUserUid,
                fromName: senderName,
                type: "new_post",
                message: `${senderName} 發佈了新貼文，快去看看吧！`,
                timestamp: Date.now(),
                isRead: false,
                read: false
              });
            });
            await Promise.all(notificationPromises);
          }

          // 3. 偵測貼文內容中的 @ 標記並寫入通知
          const mentionMatches = [...textVal.matchAll(/@(\S+)/g)];
          const uidsToNotify = new Set();

          const findUserUid = (nickname) => {
            const normalizedQuery = nickname.toLowerCase();
            for (const u of usersList) {
              const userHandle = (u.handle || "").toLowerCase();
              const userName = (u.name || u.displayName || "").toLowerCase();
              if (userHandle === normalizedQuery || 
                  userHandle === "@" + normalizedQuery || 
                  userName === normalizedQuery) {
                return u.uid || u.googleId;
              }
            }
            if (currentUser) {
              const myHandle = (currentUser.handle || "").toLowerCase();
              const myName = (currentUser.name || currentUser.displayName || "").toLowerCase();
              if (myHandle === normalizedQuery ||
                  myHandle === "@" + normalizedQuery ||
                  myName === normalizedQuery) {
                return currentUser.uid || currentUser.googleId;
              }
            }
            return null;
          };

          mentionMatches.forEach(match => {
            let nickname = match[1];
            nickname = nickname.replace(/[,.!?:;)$]+$/, "");
            const uid = findUserUid(nickname);
            if (uid && uid !== currentUserUid) {
              uidsToNotify.add(uid);
            }
          });

          if (uidsToNotify.size > 0) {
            const senderName = currentUser.displayName || currentUser.name || '有人';
            const truncatedContent = textVal.substring(0, 15);
            const mentionPromises = Array.from(uidsToNotify).map(toUid => {
              return addDoc(collection(db, "notifications"), {
                toUid: toUid,
                fromUid: currentUserUid,
                fromName: senderName,
                type: "mention",
                targetPostId: postId,
                message: `${senderName} 在貼文中標記了您："${truncatedContent}..."`,
                timestamp: Date.now(),
                isRead: false,
                read: false
              });
            });
            await Promise.all(mentionPromises);
          }
        }
      } catch (err) {
        console.error("Failed to add post to Firestore:", err);
        if (err.message.includes("permission") || err.code === "permission-denied") {
          showToast("⚠️ 發佈失敗：雲端資料庫拒絕寫入，請檢查 Firestore 規則！");
        } else {
          showToast("無法同步發佈貼文到雲端，將寫入本地");
        }
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
    if (containsBlacklist) {
      showToast("⚠️ 貼文包含敏感字詞，已自動隱藏下架！");
    } else {
      showToast(t("toast_post_created"));
    }
    if (currentRoute === "#/write") {
      navigateToHash("#/");
    }
  };

  const prependLocalPost = (postData) => {
    const newPost = {
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

    if (isFirebaseSetup) {
      const likedBy = post.likedBy || [];
      const hasLiked = likedBy.includes(currentUser.handle);
      try {
        const postDocRef = doc(db, "posts", postId);
        await updateDoc(postDocRef, {
          likedBy: hasLiked ? arrayRemove(currentUser.handle) : arrayUnion(currentUser.handle),
          likes: hasLiked ? Math.max(0, (post.likes || 0) - 1) : (post.likes || 0) + 1
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

  // Bookmark toggles
  const handleBookmarkPost = async (postId) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    if (isFirebaseSetup) {
      const bookmarkedBy = post.bookmarkedBy || [];
      const hasBookmarked = bookmarkedBy.includes(currentUser.handle);
      try {
        const postDocRef = doc(db, "posts", postId);
        await updateDoc(postDocRef, {
          bookmarkedBy: hasBookmarked ? arrayRemove(currentUser.handle) : arrayUnion(currentUser.handle)
        });
      } catch (err) {
        console.error("Failed to update bookmark in Firestore:", err);
      }
    } else {
      setPosts(prev => prev.map(p => {
        if (p.id === postId) {
          const bookmarkedBy = p.bookmarkedBy || [];
          const hasBookmarked = bookmarkedBy.includes(currentUser.handle);
          return {
            ...p,
            bookmarkedBy: hasBookmarked
              ? bookmarkedBy.filter(h => h !== currentUser.handle)
              : [...bookmarkedBy, currentUser.handle]
          };
        }
        return p;
      }));
    }
  };

  // Mark all notifications read
  const handleMarkAllNotificationsRead = async () => {
    const unreadNotifications = notificationsList.filter(n => {
      const isOldUnread = n.read === false || n.read === undefined;
      const isNewUnread = n.isRead === false;
      const hasReadField = 'read' in n;
      const hasIsReadField = 'isRead' in n;
      if (hasReadField && hasIsReadField) {
        return !n.read || !n.isRead;
      } else if (hasIsReadField) {
        return !n.isRead;
      } else {
        return !n.read;
      }
    });

    if (unreadNotifications.length === 0) return;

    try {
      const batch = writeBatch(db);
      unreadNotifications.forEach(n => {
        const docRef = doc(db, "notifications", n.id);
        const updates = {};
        if ('read' in n) updates.read = true;
        if ('isRead' in n) updates.isRead = true;
        updates.read = true;
        updates.isRead = true;
        batch.update(docRef, updates);
      });
      await batch.commit();
      showToast("已將所有通知標記為已讀");
    } catch (err) {
      console.error("Failed to mark notifications read:", err);
    }
  };

  // Handle single notification click (marking as read and navigating to Feed)
  const handleNotificationClick = async (n) => {
    try {
      const docRef = doc(db, "notifications", n.id);
      const updates = {};
      if ('read' in n) updates.read = true;
      if ('isRead' in n) updates.isRead = true;
      updates.read = true;
      updates.isRead = true;
      await updateDoc(docRef, updates);
      
      if ((n.type === "mention" || n.type === "reply" || n.type === "comment") && n.targetPostId) {
        // Reset filters & search results
        setCurrentCategory("All");
        setSearchQuery("");
        setSearchResults(null);
        
        // Navigate to home feed
        navigateToHash("#/");
        
        // Set highlighted state and scroll into view with a short timeout to ensure rendering
        setHighlightedPostId(n.targetPostId);
        
        setTimeout(() => {
          const card = document.getElementById(`card-${n.targetPostId}`);
          if (card) {
            card.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }, 300);
        
        // Clear highlighted border after 3 seconds
        setTimeout(() => {
          setHighlightedPostId(null);
        }, 3300);
      } else if (n.type === "friend_request") {
        // Navigate to friend request / friend management page
        navigateToHash("#/messages");
      } else {
        // Navigate to home feed
        navigateToHash("#/");
      }
    } catch (err) {
      console.error("Failed to mark notification as read on click:", err);
    }
  };

  // Send friend request
  const handleSendFriendRequest = async (targetUser) => {
    try {
      const fromUid = currentUser.googleId || currentUser.uid;
      const toUid = targetUser.googleId || targetUser.uid;
      if (!fromUid || !toUid) {
        showToast("使用者資訊不完整，無法發送申請");
        return;
      }
      await addDoc(collection(db, "friendRequests"), {
        fromUid,
        toUid,
        status: "pending",
        timestamp: new Date()
      });

      await addDoc(collection(db, "notifications"), {
        toUid: toUid || targetUser.googleId || targetUser.uid || "",
        fromUid: currentUser.uid || currentUser.googleId || "",
        fromName: currentUser.displayName || currentUser.name || '有人',
        type: "friend_request",
        message: `${currentUser.displayName || currentUser.name || '有人'} 向您發送了好友請求！`,
        timestamp: Date.now(),
        isRead: false,
        read: false
      });

      showToast(`已向 ${targetUser.name} 送出好友申請！`);
    } catch (err) {
      console.error("Failed to send friend request:", err);
      showToast("無法送出好友申請");
    }
  };

  // Accept friend request
  const handleAcceptFriendRequest = async (request) => {
    try {
      const docRef = doc(db, "friendRequests", request.id);
      await updateDoc(docRef, {
        status: "accepted",
        timestamp: new Date()
      });

      // Find target user's handle from usersList (or currentUser if requested to ourselves)
      const targetUser = usersList.find(u => (u.googleId || u.uid) === request.fromUid);
      const targetHandle = targetUser?.handle || "";

      if (targetHandle) {
        await addDoc(collection(db, "notifications"), {
          userHandle: targetHandle,
          content: `${currentUser.name} 同意了您的好友申請！`,
          timestamp: new Date(),
          read: false,
          type: "friend_accept"
        });
      }

      showToast("已成功加為好友！");
    } catch (err) {
      console.error("Failed to accept friend request:", err);
      showToast("接受好友申請失敗");
    }
  };

  // Decline or delete friend request
  const handleDeclineFriendRequest = async (request) => {
    try {
      await deleteDoc(doc(db, "friendRequests", request.id));
      showToast("好友申請已拒絕/取消");
    } catch (err) {
      console.error("Failed to decline friend request:", err);
      showToast("操作失敗");
    }
  };

  // Create Group Chat
  const handleCreateGroup = () => {
    setNewGroupName("");
    setSelectedGroupMembers([]);
    setShowCreateGroupModal(true);
  };

  // Confirm group creation with selected members
  const handleConfirmCreateGroup = async () => {
    if (!newGroupName || !newGroupName.trim()) {
      showToast(currentLang === "en" ? "Please enter a group name" : "請輸入群組名稱");
      return;
    }

    const currentUserUid = currentUser.googleId || currentUser.uid;
    if (!currentUserUid) {
      showToast("請先登入");
      return;
    }

    const groupMembers = [currentUserUid, ...selectedGroupMembers];

    try {
      await addDoc(collection(db, "chats"), {
        type: "group",
        name: newGroupName.trim(),
        members: groupMembers,
        createdAt: Date.now()
      });
      showToast(currentLang === "en" ? "Group created successfully!" : "群組建立成功！");
      setShowCreateGroupModal(false);
      setNewGroupName("");
      setSelectedGroupMembers([]);
    } catch (err) {
      console.error("Failed to create group:", err);
      showToast(currentLang === "en" ? "Failed to create group" : "無法建立群組");
    }
  };

  // Invite Friend to Group Chat
  const handleInviteToGroup = async () => {
    if (!activeChatFriend || activeChatFriend.type !== "group") return;

    // Get all mutual friends
    const myFriends = usersList.filter(u => {
      const uUid = u.googleId || u.uid;
      return sentRequests.some(r => r.toUid === uUid && r.status === "accepted") ||
             receivedRequests.some(r => r.fromUid === uUid && r.status === "accepted");
    });

    const currentMembers = activeChatFriend.members || [];
    const addableFriends = myFriends.filter(f => {
      const fUid = f.googleId || f.uid;
      return !currentMembers.includes(fUid);
    });

    if (addableFriends.length === 0) {
      alert(currentLang === "en" ? "No other friends to invite." : "沒有其他好友可以邀請。");
      return;
    }

    // List friends for prompt selection
    const friendsStr = addableFriends.map((f, i) => `${i + 1}. ${f.name} (${f.handle})`).join("\n");
    const choice = prompt(
      (currentLang === "en" ? "Select friend index to invite:\n" : "請輸入要邀請的好友編號：\n") + friendsStr
    );

    if (!choice) return;
    const index = parseInt(choice, 10) - 1;
    if (isNaN(index) || index < 0 || index >= addableFriends.length) {
      alert(currentLang === "en" ? "Invalid selection." : "無效的選擇。");
      return;
    }

    const selectedFriend = addableFriends[index];
    const friendUid = selectedFriend.googleId || selectedFriend.uid;

    try {
      const groupDocRef = doc(db, "chats", activeChatFriend.id);
      await updateDoc(groupDocRef, {
        members: arrayUnion(friendUid)
      });
      
      // Update local state to immediately show change
      setActiveChatFriend(prev => ({
        ...prev,
        members: [...(prev.members || []), friendUid]
      }));
      showToast(currentLang === "en" ? "Friend invited successfully!" : "好友邀請成功！");
    } catch (err) {
      console.error("Failed to invite friend:", err);
      showToast(currentLang === "en" ? "Failed to invite friend" : "邀請失敗");
    }
  };

  // Delete Group Chat
  const handleDeleteGroup = async (group) => {
    if (!group) return;
    const confirmDelete = window.confirm(
      currentLang === "en" 
        ? `Are you sure you want to delete the group "${group.name}"? This will also delete all messages in it.` 
        : `確定要刪除群組「${group.name}」嗎？這將會刪除該群組內的所有訊息。`
    );
    if (!confirmDelete) return;

    try {
      // 1. Delete group chat document from "chats"
      await deleteDoc(doc(db, "chats", group.id));

      // 2. Delete messages in "messages" belonging to this group
      const msgQuery = query(collection(db, "messages"), where("chatId", "==", group.id));
      const msgSnap = await getDocs(msgQuery);
      const batch = writeBatch(db);
      msgSnap.forEach(d => {
        batch.delete(doc(db, "messages", d.id));
      });
      await batch.commit();

      showToast(currentLang === "en" ? "Group deleted successfully!" : "已成功刪除群組！");
      if (activeChatFriend && activeChatFriend.id === group.id) {
        setActiveChatFriend(null);
      }
    } catch (err) {
      console.error("Failed to delete group:", err);
      showToast(currentLang === "en" ? "Failed to delete group" : "刪除群組失敗");
    }
  };

  // Leave Group Chat
  const handleLeaveGroup = async (group) => {
    if (!group) return;
    const confirmLeave = window.confirm(
      currentLang === "en" 
        ? `Are you sure you want to leave the group "${group.name}"?` 
        : `確定要退出群組「${group.name}」嗎？`
    );
    if (!confirmLeave) return;

    try {
      const currentUserUid = currentUser.googleId || currentUser.uid;
      if (!currentUserUid) {
        showToast("請先登入");
        return;
      }

      const groupDocRef = doc(db, "chats", group.id);
      await updateDoc(groupDocRef, {
        members: arrayRemove(currentUserUid)
      });

      showToast(currentLang === "en" ? "You have left the group" : "已成功退出群組");
      if (activeChatFriend && activeChatFriend.id === group.id) {
        setActiveChatFriend(null);
      }
    } catch (err) {
      console.error("Failed to leave group:", err);
      showToast(currentLang === "en" ? "Failed to leave group" : "退出群組失敗");
    }
  };

  // Pin / Unpin Post
  const handlePinPost = async (postId, currentPinned = false) => {
    try {
      if (!isFirebaseSetup) {
        // LocalStorage mode
        const updatedPosts = posts.map(p => {
          if (p.id === postId) {
            return { ...p, pinned: !currentPinned };
          } else {
            // Unpin all other posts of the current user
            const myUid = currentUser.googleId || currentUser.uid;
            if (!currentPinned && (p.uid === myUid || p.handle === currentUser.handle)) {
              return { ...p, pinned: false };
            }
            return p;
          }
        });
        setPosts(updatedPosts);
        localStorage.setItem("echoes_posts", JSON.stringify(updatedPosts));
        showToast(!currentPinned ? "貼文已置頂" : "已取消置頂");
        return;
      }

      // Firestore mode
      const myHandle = currentUser.handle;
      const myUid = currentUser.googleId || currentUser.uid;
      
      // If pinning a new post, first find and unpin all other posts of the current user
      if (!currentPinned) {
        const q = query(
          collection(db, "posts"),
          where("uid", "==", myUid),
          where("pinned", "==", true)
        );
        const snapshot = await getDocs(q);
        const batch = writeBatch(db);
        snapshot.forEach(docSnap => {
          batch.update(docSnap.ref, { pinned: false });
        });
        await batch.commit();
      }

      // Toggle pinned status of current post
      const postRef = doc(db, "posts", postId);
      await updateDoc(postRef, {
        pinned: !currentPinned
      });

      showToast(!currentPinned ? "貼文已置頂！" : "已取消置頂！");
    } catch (err) {
      console.error("Failed to pin post:", err);
      showToast("操作失敗");
    }
  };

  // Delete a friend
  const handleDeleteFriend = async (friend) => {
    if (!friend) return;
    const confirmDelete = window.confirm(
      currentLang === "en" 
        ? `Are you sure you want to delete "${friend.name}" from your friends?` 
        : `確定要將「${friend.name}」從好友名單中刪除嗎？`
    );
    if (!confirmDelete) return;

    try {
      const currentUserUid = currentUser.googleId || currentUser.uid;
      const friendUid = friend.googleId || friend.uid;
      if (!currentUserUid || !friendUid) return;

      // Query accepted friend requests between currentUser and the friend
      const q1 = query(
        collection(db, "friendRequests"),
        where("fromUid", "==", currentUserUid),
        where("toUid", "==", friendUid),
        where("status", "==", "accepted")
      );
      const q2 = query(
        collection(db, "friendRequests"),
        where("fromUid", "==", friendUid),
        where("toUid", "==", currentUserUid),
        where("status", "==", "accepted")
      );

      const [snap1, snap2] = await Promise.all([getDocs(q1), getDocs(q2)]);
      
      const batch = writeBatch(db);
      let found = false;

      snap1.forEach(d => {
        batch.delete(doc(db, "friendRequests", d.id));
        found = true;
      });
      snap2.forEach(d => {
        batch.delete(doc(db, "friendRequests", d.id));
        found = true;
      });

      if (found) {
        await batch.commit();
        showToast(currentLang === "en" ? "Friend deleted successfully!" : "已成功刪除好友！");
        if (activeChatFriend && (activeChatFriend.googleId === friendUid || activeChatFriend.uid === friendUid)) {
          setActiveChatFriend(null);
        }
      } else {
        showToast(currentLang === "en" ? "Friend relationship not found" : "找不到好友關係");
      }
    } catch (err) {
      console.error("Failed to delete friend:", err);
      showToast(currentLang === "en" ? "Failed to delete friend" : "刪除好友失敗");
    }
  };

  // Add / Toggle Emoji Reaction
  const handleEmojiReact = async (messageId, emoji, currentReactions = {}) => {
    const currentUserUid = currentUser.googleId || currentUser.uid;
    if (!currentUserUid) return;

    try {
      const msgRef = doc(db, "messages", messageId);
      const newReactions = { ...currentReactions };
      
      if (!newReactions[emoji]) {
        newReactions[emoji] = [];
      }

      if (newReactions[emoji].includes(currentUserUid)) {
        // Remove reaction (toggle off)
        newReactions[emoji] = newReactions[emoji].filter(uid => uid !== currentUserUid);
      } else {
        // Add reaction (toggle on)
        newReactions[emoji] = [...newReactions[emoji], currentUserUid];
      }

      if (newReactions[emoji].length === 0) {
        delete newReactions[emoji];
      }

      await updateDoc(msgRef, {
        reactions: newReactions
      });
    } catch (err) {
      console.error("Failed to update reaction:", err);
    }
  };

  // Send private message
  const handleSendMessage = async (customText = null, customType = "text") => {
    const text = customText !== null ? customText : messageText.trim();
    if (!text || !activeChatFriend) return;

    const currentUserUid = currentUser.googleId || currentUser.uid;
    const isGroup = activeChatFriend.type === "group";
    const activeChatFriendUid = activeChatFriend.googleId || activeChatFriend.uid;

    if (!isGroup) {
      const isFriend = sentRequests.some(r => r.toUid === activeChatFriendUid && r.status === "accepted") ||
                       receivedRequests.some(r => r.fromUid === activeChatFriendUid && r.status === "accepted");

      if (!isFriend) {
        showToast("只有好友才能發送訊息");
        return;
      }
    }

    try {
      const messageData = {
        senderId: currentUserUid,
        senderName: currentUser.displayName || currentUser.name || "有人",
        senderHandle: currentUser.handle || "",
        text: text,
        timestamp: new Date(),
        messageType: customType,
        isRead: false,
        readBy: [currentUserUid]
      };

      if (isGroup) {
        messageData.chatId = activeChatFriend.id;
      } else {
        messageData.receiverId = activeChatFriendUid;
      }

      await addDoc(collection(db, "messages"), messageData);
      if (customText === null) {
        setMessageText("");
      }
    } catch (err) {
      console.error("Failed to send message:", err);
      showToast("無法傳送私訊");
    }
  };

  // Comment adding
  const submitComment = async (postId, customText = null, customType = "text") => {
    const text = customText !== null ? customText : (commentInputs[postId] || "").trim();
    if (!text) return;

    const newComment = {
      id: "c-" + Date.now(),
      uid: currentUser.googleId || currentUser.uid,
      author: currentUser.name,
      authorHandle: currentUser.handle || "",
      text: text,
      time: currentLang === "en" ? "just now" : "剛剛",
      commentType: customType
    };

    if (isFirebaseSetup) {
      try {
        const postDocRef = doc(db, "posts", postId);
        await updateDoc(postDocRef, {
          comments: arrayUnion(newComment)
        });

        // Send notification to post author
        const targetPost = posts.find(p => p.id === postId);
        if (targetPost) {
          const postAuthorUid = targetPost.uid;
          const myUid = currentUser.googleId || currentUser.uid;
          if (postAuthorUid && postAuthorUid !== myUid) {
            const senderName = currentUser.displayName || currentUser.name || "有人";
            const truncatedComment = text.substring(0, 15);
            await addDoc(collection(db, "notifications"), {
              toUid: postAuthorUid,
              fromUid: myUid,
              fromName: senderName,
              type: "reply",
              targetPostId: postId,
              message: `${senderName} 回覆了您的貼文："${truncatedComment}${text.length > 15 ? '...' : ''}"`,
              timestamp: Date.now(),
              isRead: false,
              read: false
            });
          }
        }
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

      // Send local notification
      const targetPost = posts.find(p => p.id === postId);
      if (targetPost) {
        const postAuthorUid = targetPost.uid;
        const myUid = currentUser.googleId || currentUser.uid;
        if (postAuthorUid && postAuthorUid !== myUid) {
          const senderName = currentUser.displayName || currentUser.name || "有人";
          const truncatedComment = text.substring(0, 15);
          const newNotif = {
            id: "notif-" + Date.now(),
            toUid: postAuthorUid,
            fromUid: myUid,
            fromName: senderName,
            type: "reply",
            targetPostId: postId,
            message: `${senderName} 回覆了您的貼文："${truncatedComment}${text.length > 15 ? '...' : ''}"`,
            timestamp: Date.now(),
            isRead: false,
            read: false
          };
          setNotificationsList(prev => [newNotif, ...prev]);
        }
      }
      showToast(t("toast_reply_success"));
    }
    if (customText === null) {
      setCommentInputs(prev => ({ ...prev, [postId]: "" }));
    }
  };

  // React to comment with emoji
  const handleCommentEmojiReact = async (postId, commentId, emoji, currentReactions = {}) => {
    const currentUserUid = currentUser.googleId || currentUser.uid;
    if (!currentUserUid) return;

    try {
      const postRef = doc(db, "posts", postId);
      const postObj = posts.find(p => p.id === postId);
      if (!postObj || !postObj.comments) return;

      const newComments = postObj.comments.map(c => {
        if (c.id === commentId) {
          const reactions = c.reactions ? { ...c.reactions } : {};
          if (!reactions[emoji]) {
            reactions[emoji] = [];
          }
          if (reactions[emoji].includes(currentUserUid)) {
            reactions[emoji] = reactions[emoji].filter(uid => uid !== currentUserUid);
          } else {
            reactions[emoji] = [...reactions[emoji], currentUserUid];
          }
          if (reactions[emoji].length === 0) {
            delete reactions[emoji];
          }
          return { ...c, reactions };
        }
        return c;
      });

      if (isFirebaseSetup) {
        await updateDoc(postRef, {
          comments: newComments
        });
      } else {
        setPosts(prev => prev.map(p => {
          if (p.id === postId) {
            return { ...p, comments: newComments };
          }
          return p;
        }));
      }
    } catch (err) {
      console.error("Failed to react to comment:", err);
    }
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

  // Search input and global search handlers
  const handleSearch = (queryText) => {
    const query = queryText.trim().toLowerCase();
    if (!query) {
      setSearchResults(null);
      return;
    }

    // 1. Search posts: check author, handle, content, category, tags
    const matchedPosts = displayPosts.filter(post => {
      const isPrivate = post.privacy === "private";
      const myUid = currentUser.googleId || currentUser.uid;
      const isMine = (post.uid && post.uid === myUid) || post.handle === currentUser.handle;
      const matchesPrivacy = !isPrivate || isMine || adminAuthenticated;
      
      if (!matchesPrivacy) return false;

      return (
        (post.content && post.content.toLowerCase().includes(query)) ||
        (post.author && post.author.toLowerCase().includes(query)) ||
        (post.handle && post.handle.toLowerCase().includes(query)) ||
        (post.category && post.category.toLowerCase().includes(query))
      );
    });

    // 2. Search users (from usersList)
    const matchedUsers = usersList.filter(user => {
      return (
        (user.name && user.name.toLowerCase().includes(query)) ||
        (user.handle && user.handle.toLowerCase().includes(query)) ||
        (user.email && user.email.toLowerCase().includes(query))
      );
    });

    setSearchResults({ posts: matchedPosts, users: matchedUsers });

    // 3. Update search history
    const trimmedVal = queryText.trim();
    if (trimmedVal && !searchHistory.includes(trimmedVal)) {
      setSearchHistory(prev => {
        const next = [trimmedVal, ...prev];
        if (next.length > 5) next.pop();
        return next;
      });
    }
  };

  const handleSearchInputChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (!val.trim()) {
      setSearchResults(null);
    }
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter") {
      const val = searchQuery.trim();
      if (val === "admin" || val === "/admin") {
        setSearchQuery("");
        setSearchResults(null);
        setModalAdminVisible(true);
        return;
      }
      handleSearch(searchQuery);
    }
  };

  const handleClearHistory = () => {
    setSearchHistory([]);
    setSearchResults(null);
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

  const handleAddKeyword = () => {
    const word = newKeywordInput.trim();
    if (!word) return;
    if (blacklistKeywords.includes(word)) {
      showToast("此關鍵字已在列表中！");
      return;
    }
    setBlacklistKeywords(prev => [...prev, word]);
    setNewKeywordInput("");
    showToast(`已新增黑名單字詞: "${word}"`);
  };

  const handleRemoveKeyword = (word) => {
    setBlacklistKeywords(prev => prev.filter(kw => kw !== word));
    showToast(`已移除黑名單字詞: "${word}"`);
  };

  const handleHideAndBlock = async (post) => {
    if (window.confirm(`確定要下架此貼文，並封鎖該用戶「${post.author}」(${post.handle}) 嗎？`)) {
      // 1. Hide the post
      if (isFirebaseSetup) {
        try {
          await updateDoc(doc(db, "posts", post.id), { hidden: true });
          const userDoc = usersList.find(u => u.uid === post.uid || u.handle === post.handle);
          if (userDoc && userDoc.email) {
            await updateDoc(doc(db, "users", userDoc.email), { blocked: true });
          }
          showToast("已成功下架貼文，並在雲端封鎖該帳號");
        } catch (err) {
          console.error("Failed to update post/user in Firestore:", err);
          showToast("無法同步至雲端，已在本地下架與封鎖");
        }
      } else {
        setPosts(prev => prev.map(p => p.id === post.id ? { ...p, hidden: true } : p));
      }

      setBlockedUids(prev => {
        const next = new Set(prev);
        if (post.uid) next.add(post.uid);
        if (post.handle) next.add(post.handle);
        return Array.from(next);
      });
      showToast("貼文已下架，該帳號已被封鎖！");
    }
  };

  const handleUnblockUser = async (uid) => {
    if (window.confirm(`確定要解除封鎖此用戶嗎？`)) {
      if (isFirebaseSetup) {
        try {
          const userDoc = usersList.find(u => u.uid === uid || u.handle === uid);
          if (userDoc && userDoc.email) {
            await updateDoc(doc(db, "users", userDoc.email), { blocked: false });
          }
          showToast("已在雲端解除封鎖該帳號");
        } catch (err) {
          console.error("Failed to unblock user in Firestore:", err);
          showToast("無法同步至雲端，已在本地解除封鎖");
        }
      }

      setBlockedUids(prev => prev.filter(item => item !== uid));
      showToast("已成功解除封鎖！");
    }
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
    let list = displayPosts.filter(post => {
      const matchesCat = currentCategory === "All" || post.category === currentCategory;
      const matchesSearch = searchQuery === "" ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.author.toLowerCase().includes(searchQuery.toLowerCase());

      const isPrivate = post.privacy === "private";
      const myUid = currentUser.googleId || currentUser.uid;
      const isMine = (post.uid && post.uid === myUid) || post.handle === currentUser.handle;
      const matchesPrivacy = !isPrivate || isMine || adminAuthenticated;

      const matchesTab = isWriteTab ? isMine : true;

      const isPostHidden = post.hidden === true || (post.content && blacklistKeywords.some(kw => post.content.toLowerCase().includes(kw.toLowerCase())));
      const isAuthorBlocked = blockedUids.includes(post.uid) || blockedUids.includes(post.handle);

      if (isPostHidden || isAuthorBlocked) {
        return false;
      }

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

    // Sort: pinned posts first if viewing own tab
    if (isWriteTab) {
      list.sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return 0;
      });
    }

    return list;
  }, [displayPosts, currentCategory, searchQuery, currentUser.handle, currentUser.name, currentUser.avatarLetter, adminAuthenticated, isWriteTab, blacklistKeywords, blockedUids]);

  // Categories pill filters list
  const categoryFilterList = useMemo(() => {
    const list = new Set(posts.map(p => p.category));
    return ["All", ...list];
  }, [posts]);

  // ==========================================================================
  // VIEW RENDER PARTS
  // ==========================================================================

  const renderPostCard = (post) => {
    const hasGradient = !!post.gradient;
    const isPrivate = post.privacy === "private";
    const bookmarkedBy = post.bookmarkedBy || [];
    const isBookmarked = bookmarkedBy.includes(currentUser.handle);

    // Look up status of this post author in onlineUsers
    const isAuthorOnline = onlineUsers.some(u => u.handle === post.handle);

    return (
      <div key={post.id} className={`post-card ${highlightedPostId === post.id ? "liked-post-highlight" : ""}`} id={`card-${post.id}`}>
        <div className="post-header">
          <div className="post-author-wrapper">
            {(() => {
              const latestProfile = getLatestUserAvatar(post.handle, post.author, post.uid);
              const avatarUrl = latestProfile ? latestProfile.avatarUrl : post.avatarUrl;
              const avatarBg = latestProfile ? latestProfile.avatarBg : post.avatarBg;
              const avatarLetter = latestProfile ? latestProfile.avatarLetter : post.avatarLetter;

              return (
                <div className="user-avatar" style={{
                  background: avatarUrl ? `url(${avatarUrl})` : (avatarBg || (post.isDefault ? 'var(--bg-elevated)' : 'linear-gradient(135deg, var(--neon-green-dim) 0%, var(--neon-cyan) 100%)')),
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  color: post.isDefault ? 'var(--neon-green)' : '#ffffff',
                  position: 'relative',
                  cursor: 'pointer',
                  flexShrink: 0
                }} onClick={() => {
                  setProfileViewUid(post.uid);
                  setCurrentPage("profile");
                  window.scrollTo(0, 0);
                  window.location.hash = "#/profile";
                }}>
                  {!avatarUrl && (avatarLetter || post.avatarLetter || post.author?.substring(0, 2).toUpperCase())}
                  {!post.isDefault && (
                    <span style={{
                      position: 'absolute',
                      bottom: '-2px',
                      right: '-2px',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: isAuthorOnline ? 'var(--neon-green)' : 'var(--neon-red)',
                      border: '2px solid var(--bg-card)',
                      boxShadow: `0 0 4px ${isAuthorOnline ? 'var(--neon-green)' : 'var(--neon-red)'}`
                    }} title={isAuthorOnline ? '在線 (Online)' : '離線 (Offline)'}></span>
                  )}
                </div>
              );
            })()}
            <div className="post-author-details" style={{ cursor: 'pointer' }} onClick={() => {
              setProfileViewUid(post.uid);
              setCurrentPage("profile");
              window.scrollTo(0, 0);
              window.location.hash = "#/profile";
            }}>
              <span className="post-author-name">{post.author}</span>
              <span className="post-author-handle">{post.handle}</span>
            </div>
          </div>
          <div className="post-meta-right">
            {post.pinned && (
              <span className="post-pinned-badge" style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '11px', color: 'var(--neon-amber)', marginRight: '6px' }}>
                <Pin style={{ width: '11px', height: '11px', transform: 'rotate(45deg)' }} />
                <span>{currentLang === "en" ? "Pinned" : "置頂"}</span>
              </span>
            )}
            {isPrivate && (
              <span className="post-privacy-badge" style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '11px', color: 'var(--neon-magenta)' }}>
                <Lock style={{ width: '11px', height: '11px' }} />
                <span>{t("private").split('（')[0]}</span>
              </span>
            )}
            <span className="post-category-tag">{getCategoryLabel(post.category)}</span>
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
        <div className="post-actions-row" style={{ display: 'flex', gap: '16px', marginTop: '12px', flexWrap: 'wrap' }}>
          <button className={`post-action-btn btn-like ${post.likedBy ? (post.likedBy.includes(currentUser.handle) ? 'liked' : '') : (post.likedByUser ? 'liked' : '')}`} style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }} onClick={() => handleLikePost(post.id)}>
            <Heart style={{ width: '16px', height: '16px' }} />
            <span className="like-count">{post.likedBy ? post.likedBy.length : post.likes}</span>
          </button>

          <button className={`post-action-btn btn-bookmark ${isBookmarked ? 'bookmarked' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', color: isBookmarked ? 'var(--neon-amber)' : '' }} onClick={() => handleBookmarkPost(post.id)}>
            <Bookmark style={{ width: '16px', height: '16px', fill: isBookmarked ? 'var(--neon-amber)' : 'none' }} />
            <span>{isBookmarked ? (currentLang === "en" ? "Bookmarked" : "已收藏") : (currentLang === "en" ? "Bookmark" : "收藏")}</span>
          </button>

          <button className="post-action-btn btn-comment" style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }} onClick={() => {
            setActiveCommentsPostId(prev => ({ ...prev, [post.id]: !prev[post.id] }));
          }}>
            <MessageSquare style={{ width: '16px', height: '16px' }} />
            <span>{post.comments ? post.comments.length : 0}</span>
          </button>

          <button className="post-action-btn btn-share" style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }} onClick={() => handleSharePost(post)}>
            <Send style={{ width: '16px', height: '16px' }} />
            <span>分享</span>
          </button>

          {((post.uid && post.uid === (currentUser.googleId || currentUser.uid)) || post.handle === currentUser.handle) && (
            <button 
              className={`post-action-btn btn-pin ${post.pinned ? 'pinned' : ''}`} 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '4px', 
                cursor: 'pointer', 
                color: post.pinned ? 'var(--neon-amber)' : 'var(--text-muted)',
                marginLeft: 'auto'
              }} 
              onClick={() => handlePinPost(post.id, post.pinned)}
              title={post.pinned ? (currentLang === "en" ? "Unpin Post" : "取消置頂") : (currentLang === "en" ? "Pin Post" : "置頂貼文")}
            >
              <Pin style={{ width: '15px', height: '15px', transform: post.pinned ? 'rotate(0deg)' : 'rotate(45deg)' }} />
              <span>{post.pinned ? (currentLang === "en" ? "Pinned" : "已置頂") : (currentLang === "en" ? "Pin" : "置頂")}</span>
            </button>
          )}

          {((post.uid === (currentUser.googleId || currentUser.uid) || post.handle === currentUser.handle || adminAuthenticated) && !post.isDefault) && (
            <button className="post-action-btn post-action-delete" style={{ color: 'var(--text-muted)', cursor: 'pointer', marginLeft: ((post.uid && post.uid === (currentUser.googleId || currentUser.uid)) || post.handle === currentUser.handle) ? '0px' : 'auto' }} onClick={() => handleDeletePost(post.id)}>
              <Trash2 style={{ width: '16px', height: '16px' }} />
            </button>
          )}
        </div>

        {/* Comments Drawer List */}
        <div className={`comments-section ${activeCommentsPostId[post.id] ? "active" : ""}`} id={`comments-sec-${post.id}`} style={{ display: activeCommentsPostId[post.id] ? 'block' : 'none', marginTop: '12px', borderTop: '1px solid var(--border-color)', paddingTop: '10px' }}>
          <div className="comments-list" id={`comments-list-${post.id}`}>
            {!post.comments || post.comments.length === 0 ? (
              <div style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)', padding: '8px 0' }}>尚無留言，成為第一個留言的人吧！</div>
            ) : (
              post.comments.map(c => (
                <div key={c.id} className="comment-item" style={{ display: 'flex', gap: '10px', margin: '8px 0' }}>
                  {(() => {
                    const latestProfile = getLatestUserAvatar(c.authorHandle, c.author, c.uid);
                    const avatarUrl = latestProfile ? latestProfile.avatarUrl : null;
                    const avatarBg = latestProfile ? latestProfile.avatarBg : null;
                    const avatarLetter = latestProfile ? latestProfile.avatarLetter : null;
                    const displayName = latestProfile ? latestProfile.name : c.author;

                    return (
                      <div className="comment-avatar" style={{ 
                        width: '28px', 
                        height: '28px', 
                        borderRadius: '50%', 
                        background: avatarUrl ? `url(${avatarUrl})` : (avatarBg || 'var(--bg-elevated)'),
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        fontSize: '10px', 
                        fontWeight: 'bold',
                        color: '#ffffff',
                        cursor: 'pointer',
                        flexShrink: 0
                      }} onClick={() => {
                        setProfileViewUid(c.uid);
                        setCurrentPage("profile");
                        window.scrollTo(0, 0);
                        window.location.hash = "#/profile";
                      }}>
                        {!avatarUrl && (avatarLetter || displayName.charAt(0).toUpperCase())}
                      </div>
                    );
                  })()}
                  <div className="comment-content-wrapper" style={{ flex: 1 }}>
                    <div className="comment-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: 'var(--text-secondary)' }}>
                      <div>
                        <span className="comment-author" style={{ fontWeight: 600, cursor: 'pointer' }} onClick={() => {
                          setProfileViewUid(c.uid);
                          setCurrentPage("profile");
                          window.scrollTo(0, 0);
                          window.location.hash = "#/profile";
                        }}>{c.author}</span>
                        <span className="comment-time" style={{ marginLeft: '10px' }}>{c.time}</span>
                      </div>
                      
                      {/* Comment Reaction Trigger */}
                      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <button
                          type="button"
                          onClick={() => setActiveCommentEmojiMsgId(activeCommentEmojiMsgId === c.id ? null : c.id)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--text-muted)',
                            cursor: 'pointer',
                            fontSize: '12px',
                            padding: '2px 4px',
                            borderRadius: '4px'
                          }}
                          onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                          onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                          😊
                        </button>

                        {activeCommentEmojiMsgId === c.id && (
                          <div style={{
                            position: 'absolute',
                            right: '28px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            zIndex: 1000,
                            display: 'flex',
                            gap: '4px',
                            padding: '4px 6px',
                            background: 'var(--bg-card)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '15px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.5)'
                          }}>
                            {['👍', '❤️', '😂', '😮', '😢'].map(emoji => (
                              <button
                                key={emoji}
                                type="button"
                                onClick={() => {
                                  handleCommentEmojiReact(post.id, c.id, emoji, c.reactions);
                                  setActiveCommentEmojiMsgId(null);
                                }}
                                style={{
                                  background: 'transparent',
                                  border: 'none',
                                  fontSize: '14px',
                                  cursor: 'pointer',
                                  padding: '1px',
                                  borderRadius: '3px',
                                  transition: 'transform 0.1s'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
                                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    {c.commentType === "gif" ? (
                      <img src={c.text} className="max-w-[120px] rounded" style={{ maxWidth: '120px', borderRadius: '4px', display: 'block', marginTop: '4px' }} alt="Comment GIF" />
                    ) : (
                      <div className="comment-text" style={{ fontSize: '12px', color: 'var(--text-primary)', marginTop: '2px' }}>{c.text}</div>
                    )}

                    {/* Reactions list for comment */}
                    {c.reactions && Object.keys(c.reactions).length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
                        {Object.entries(c.reactions).map(([emoji, uids]) => {
                          if (!uids || uids.length === 0) return null;
                          const userReacted = uids.includes(currentUser.googleId || currentUser.uid);
                          return (
                            <button
                              key={emoji}
                              onClick={() => handleCommentEmojiReact(post.id, c.id, emoji, c.reactions)}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '3px',
                                padding: '1px 5px',
                                borderRadius: '8px',
                                background: userReacted ? 'rgba(61, 220, 151, 0.2)' : 'var(--bg-card)',
                                border: userReacted ? '1px solid var(--neon-green)' : '1px solid var(--border-color)',
                                color: 'var(--text-bright)',
                                fontSize: '10px',
                                cursor: 'pointer',
                                lineHeight: 1
                              }}
                            >
                              <span>{emoji}</span>
                              <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>{uids.length}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* GIF Picker Tray for Comment Composer */}
          {activeCommentGifPostId === post.id && (
            <div style={{
              padding: '12px 15px',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              background: 'var(--bg-card)',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              marginTop: '10px'
            }}>
              {/* Header row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--text-bright)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  🎬 {currentLang === "en" ? "Comment GIF Picker" : "留言 GIF 選擇器"}
                </span>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <button
                    type="button"
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--neon-amber)',
                      fontSize: '11px',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '2px'
                    }}
                    onClick={() => setShowCommentGiphyKeyInput(!showCommentGiphyKeyInput)}
                  >
                    🔑 {currentLang === "en" ? "GIPHY Key" : "GIPHY 金鑰"}
                  </button>
                  <button
                    type="button"
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--neon-cyan)',
                      fontSize: '10px',
                      cursor: 'pointer',
                      textDecoration: 'underline'
                    }}
                    onClick={() => {
                      const gifUrl = window.prompt(currentLang === "en" ? "Enter GIF Image URL:" : "請輸入 GIF 圖片網址：");
                      if (gifUrl && gifUrl.trim()) {
                        submitComment(post.id, gifUrl.trim(), "gif");
                        setActiveCommentGifPostId(null);
                      }
                    }}
                  >
                    {currentLang === "en" ? "Custom URL..." : "自訂網址..."}
                  </button>
                </div>
              </div>

              {/* Giphy Key settings input (collapsible) */}
              {showCommentGiphyKeyInput && (
                <div style={{
                  padding: '8px 12px',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                    {currentLang === "en" 
                      ? "Enter GIPHY API Key for live web search. Get a free beta key from GIPHY Developer portal." 
                      : "輸入 GIPHY API 金鑰以啟用雲端搜尋。可至 GIPHY 開發者後台免費申請。"}
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      style={{
                        flex: 1,
                        padding: '6px 10px',
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '4px',
                        fontSize: '11px',
                        color: 'var(--text-bright)'
                      }}
                      placeholder="Enter GIPHY API Key..."
                      value={giphyApiKey}
                      onChange={(e) => saveGiphyApiKey(e.target.value)}
                    />
                    <button
                      type="button"
                      style={{
                        padding: '6px 12px',
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid var(--neon-red)',
                        color: 'var(--neon-red)',
                        borderRadius: '4px',
                        fontSize: '11px',
                        cursor: 'pointer'
                      }}
                      onClick={() => {
                        saveGiphyApiKey("");
                        showToast("GIPHY API 金鑰已清除");
                      }}
                    >
                      {currentLang === "en" ? "Clear" : "清除"}
                    </button>
                  </div>
                </div>
              )}

              {/* Search input field */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  style={{
                    flex: 1,
                    padding: '6px 10px',
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '6px',
                    fontSize: '12px',
                    color: 'var(--text-bright)'
                  }}
                  placeholder={
                    giphyApiKey 
                      ? (currentLang === "en" ? "Search millions of GIFs from GIPHY..." : "搜尋 GIPHY 數百萬張 GIF 動圖...")
                      : (currentLang === "en" ? "Search built-in GIFs (e.g. cat, happy, cry)..." : "搜尋內建 GIF（如：cat, happy, cry）...")
                  }
                  value={commentGifSearchQuery}
                  onChange={(e) => {
                    setCommentGifSearchQuery(e.target.value);
                    handleFetchGifs(e.target.value, true);
                  }}
                />
              </div>

              {/* Categories tags row */}
              <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px', whiteSpace: 'nowrap' }}>
                {[
                  { label: '🔥 熱門/全部', val: '' },
                  { label: '🐱 貓咪', val: 'cat' },
                  { label: '😂 搞笑', val: 'meme' },
                  { label: '🎉 慶祝', val: 'happy' },
                  { label: '😢 難過', val: 'sad' },
                  { label: '生氣', val: 'angry' },
                  { label: '😮 驚訝', val: 'shock' },
                  { label: '❤️ 戀愛', val: 'love' }
                ].map(pill => (
                  <button
                    key={pill.label}
                    type="button"
                    onClick={() => {
                      setCommentGifSearchQuery(pill.val);
                      if (pill.val === '') {
                        loadInitialGifs(true);
                      } else {
                        handleFetchGifs(pill.val, true);
                      }
                    }}
                    style={{
                      padding: '4px 8px',
                      borderRadius: '12px',
                      border: commentGifSearchQuery === pill.val ? '1px solid var(--neon-green)' : '1px solid var(--border-color)',
                      background: commentGifSearchQuery === pill.val ? 'rgba(61, 220, 151, 0.1)' : 'var(--bg-input)',
                      color: commentGifSearchQuery === pill.val ? 'var(--neon-green)' : 'var(--text-secondary)',
                      fontSize: '11px',
                      cursor: 'pointer'
                    }}
                  >
                    {pill.label}
                  </button>
                ))}
              </div>

              {/* GIF Grid List */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
                gap: '8px',
                maxHeight: '150px',
                overflowY: 'auto',
                padding: '2px'
              }}>
                {isCommentSearchingGifs ? (
                  <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '15px 0', fontSize: '11px', color: 'var(--text-muted)' }}>
                    ⏳ {currentLang === "en" ? "Searching GIFs..." : "正在搜尋 GIF..."}
                  </div>
                ) : commentSearchedGifs.length === 0 ? (
                  <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '15px 0', fontSize: '11px', color: 'var(--text-muted)' }}>
                    📭 {currentLang === "en" ? "No GIFs found. Try another query." : "找不到相符的 GIF，換個關鍵字試試吧！"}
                  </div>
                ) : (
                  commentSearchedGifs.map((gif, idx) => (
                    <img
                      key={idx}
                      src={gif.url}
                      onClick={() => {
                        submitComment(post.id, gif.url, "gif");
                        setActiveCommentGifPostId(null);
                      }}
                      style={{
                        width: '100%',
                        height: '60px',
                        objectFit: 'cover',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        border: '2px solid transparent',
                        transition: 'all 0.15s ease'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.borderColor = 'var(--neon-green)';
                        e.currentTarget.style.transform = 'scale(1.05)';
                        e.currentTarget.style.boxShadow = '0 0 6px rgba(61, 220, 151, 0.4)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.borderColor = 'transparent';
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                      alt="gif search result"
                    />
                  ))
                )}
              </div>

              {/* Caption Footer */}
              {!giphyApiKey && (
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', textAlign: 'center', borderTop: '1px dashed var(--border-color)', paddingTop: '6px' }}>
                  💡 {currentLang === "en" 
                    ? "Currently showing presets. Configure GIPHY key to search online." 
                    : "目前顯示精選內建庫。設定 GIPHY 金鑰後可搜尋全網動圖。"}
                </div>
              )}
            </div>
          )}

          <div className="comment-composer" style={{ display: 'flex', gap: '10px', marginTop: '10px', alignItems: 'center' }}>
            <button
              type="button"
              className="p-1 border rounded text-xs hover:bg-gray-100"
              style={{
                cursor: 'pointer',
                background: 'rgba(61, 220, 151, 0.1)',
                border: '1px solid var(--neon-green)',
                color: 'var(--neon-green)',
                borderRadius: '4px',
                fontWeight: 'bold',
                padding: '6px 10px',
                fontSize: '12px'
              }}
              onClick={() => setActiveCommentGifPostId(activeCommentGifPostId === post.id ? null : post.id)}
            >
              GIF
            </button>
            <input type="text" className="comment-input" style={{ flex: 1, padding: '6px 12px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '4px', fontSize: '12px' }} placeholder={t("reply_placeholder")} value={commentInputs[post.id] || ""} onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))} onKeyDown={(e) => e.key === 'Enter' && submitComment(post.id)} />
            <button className="comment-submit-btn" style={{ padding: '6px 12px', background: 'rgba(61, 220, 151, 0.1)', border: '1px solid var(--neon-green)', color: 'var(--neon-green)', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }} onClick={() => submitComment(post.id)}>{t("reply")}</button>
          </div>
        </div>
      </div>
    );
  };

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

        {/* 後台內容安全管理面板 (Content Safety Panel) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '30px' }}>
          {/* 左欄：自動黑名單管理 (Keyword Blacklist) */}
          <div className="blacklist-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h3 style={{ margin: 0, fontSize: '14px', fontFamily: 'var(--font-heading)', color: 'var(--neon-amber)', textShadow: '0 0 8px rgba(251, 191, 36, 0.2)' }}>🛡️ 自動黑名單管理 (Keyword Blacklist)</h3>
              </div>
              <p style={{ margin: '0 0 12px 0', fontSize: '12px', color: 'var(--text-muted)' }}>任何包含以下敏感字詞的貼文將自動隱藏：</p>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '15px', maxHeight: '100px', overflowY: 'auto', padding: '4px' }}>
                {blacklistKeywords.map(kw => (
                  <span key={kw} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(251, 191, 36, 0.08)', border: '1px solid rgba(251, 191, 36, 0.3)', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', color: 'var(--neon-amber)' }}>
                    {kw}
                    <button onClick={() => handleRemoveKeyword(kw)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}>
                      <X size={10} />
                    </button>
                  </span>
                ))}
                {blacklistKeywords.length === 0 && (
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontStyle: 'italic' }}>尚無設定任何關鍵字</span>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
              <input 
                type="text" 
                placeholder="新增敏感字詞..." 
                value={newKeywordInput} 
                onChange={(e) => setNewKeywordInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddKeyword()}
                style={{ flex: 1, padding: '6px 10px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '4px', color: 'var(--text-primary)', fontSize: '12px' }}
              />
              <button 
                onClick={handleAddKeyword}
                style={{ padding: '6px 12px', background: 'rgba(251, 191, 36, 0.1)', border: '1px solid var(--neon-amber)', color: 'var(--neon-amber)', borderRadius: '4px', fontSize: '12px', cursor: 'pointer', fontWeight: 600 }}
              >
                新增
              </button>
            </div>
          </div>

          {/* 右欄：已封鎖社群帳號管理 (Blocked Users) */}
          <div className="blocked-users-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '20px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3 style={{ margin: 0, fontSize: '14px', fontFamily: 'var(--font-heading)', color: 'var(--neon-red)', textShadow: '0 0 8px rgba(239, 68, 68, 0.2)' }}>🚫 已封鎖用戶名單 (Blocked Accounts)</h3>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>共 {blockedUids.length} 個</span>
            </div>
            
            <div style={{ maxHeight: '135px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px', paddingRight: '4px' }}>
              {blockedUids.map(uid => {
                const userObj = usersList.find(u => u.uid === uid || u.handle === uid);
                const displayName = userObj ? userObj.name : uid;
                const displayHandle = userObj ? userObj.handle : (uid.startsWith('@') ? uid : '');
                
                return (
                  <div key={uid} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-input)', border: '1px solid var(--border-color)', padding: '4px 10px', borderRadius: '4px' }}>
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '70%' }}>
                      <span style={{ fontSize: '12px', color: 'var(--text-primary)', fontWeight: 600 }}>{displayName}</span>
                      {displayHandle && <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginLeft: '6px' }}>{displayHandle}</span>}
                    </div>
                    <button 
                      onClick={() => handleUnblockUser(uid)}
                      style={{ background: 'none', border: 'none', color: 'var(--neon-green)', cursor: 'pointer', fontSize: '11px', fontWeight: 600, textDecoration: 'underline', padding: 0 }}
                    >
                      解除封鎖
                    </button>
                  </div>
                );
              })}
              {blockedUids.length === 0 && (
                <div style={{ padding: '20px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '11px', fontStyle: 'italic' }}>
                  目前無被封鎖的社群帳號
                </div>
              )}
            </div>
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
              {displayPosts.map(post => {
                const isSystem = post.isDefault || post.id.toString().startsWith('def-');
                const hasImage = !!post.image;
                const privacy = post.privacy || 'public';

                const isPostHidden = post.hidden === true || (post.content && blacklistKeywords.some(kw => post.content.toLowerCase().includes(kw.toLowerCase())));
                const isAuthorBlocked = blockedUids.includes(post.uid) || blockedUids.includes(post.handle);

                return (
                  <tr key={post.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td 
                      style={{ padding: '12px 16px', fontSize: '13px', cursor: 'pointer', transition: 'all 0.15s ease' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.textDecoration = 'underline';
                        e.currentTarget.style.color = 'var(--neon-green)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.textDecoration = 'none';
                        e.currentTarget.style.color = '';
                      }}
                      onClick={() => {
                        setProfileViewUid(post.uid);
                        setCurrentPage("profile");
                        window.scrollTo(0, 0);
                        window.location.hash = "#/profile";
                      }}
                    >
                      <strong>{post.author || '匿名'}</strong><br />
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{post.handle}</span>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '13px' }}>
                      <span style={{ background: 'var(--bg-input)', border: '1px solid var(--border-color)', padding: '2px 6px', borderRadius: '4px', fontSize: '11px' }}>
                        {getCategoryLabel(post.category || 'Thoughts')}
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
                      {isPostHidden && (
                        <div style={{ marginTop: '4px' }}>
                          <span style={{
                            padding: '2px 6px', borderRadius: '3px', fontSize: '10px', fontWeight: 600,
                            background: 'rgba(239, 68, 68, 0.1)', color: 'var(--neon-red)', border: '1px solid rgba(239, 68, 68, 0.2)'
                          }}>
                            🚫 隱藏 (黑名單)
                          </span>
                        </div>
                      )}
                      {isAuthorBlocked && (
                        <div style={{ marginTop: '4px' }}>
                          <span style={{
                            padding: '2px 6px', borderRadius: '3px', fontSize: '10px', fontWeight: 600,
                            background: 'rgba(239, 68, 68, 0.15)', color: 'var(--neon-red)', border: '1px solid rgba(239, 68, 68, 0.3)'
                          }}>
                            🔒 封鎖帳號
                          </span>
                        </div>
                      )}
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
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <button 
                          style={{ color: 'var(--neon-red)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, textDecoration: 'underline', padding: 0 }} 
                          onClick={() => handleAdminDeletePost(post.id)}
                        >
                          徹底刪除
                        </button>
                        <button 
                          style={{ 
                            color: isAuthorBlocked ? 'var(--text-muted)' : 'var(--neon-amber)', 
                            background: 'none', 
                            border: 'none', 
                            cursor: isAuthorBlocked ? 'not-allowed' : 'pointer', 
                            fontWeight: 600, 
                            textDecoration: isAuthorBlocked ? 'none' : 'underline',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: 0
                          }} 
                          disabled={isAuthorBlocked}
                          onClick={() => handleHideAndBlock(post)}
                          title={isAuthorBlocked ? "該帳號已被封鎖" : "下架貼文並封鎖此帳號"}
                        >
                          {isAuthorBlocked ? <UserX size={13} /> : <EyeOff size={13} />}
                          {isAuthorBlocked ? '已封鎖' : '隱藏封鎖'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {posts.length === 0 && <div className="empty-state" style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>數據庫中尚無任何動態...</div>}
        </div>

        {/* Content Moderation & Reports Section */}
        <div className="section-header" style={{ margin: '40px 0 15px 0', fontFamily: 'var(--font-heading)', fontSize: '16px', color: 'var(--text-bright)', borderLeft: '3px solid var(--neon-cyan)', paddingLeft: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>貼文檢舉與內容管制中心 (Report Queue)</div>
        <div className="data-table-container" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '6px', overflow: 'hidden', boxShadow: 'var(--card-shadow)', width: '100%', marginBottom: '40px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#1e2530', textAlign: 'left' }}>
                <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)', fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-bright)', width: '15%' }}>被檢舉貼文 ID</th>
                <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)', fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-bright)', width: '15%' }}>發表人</th>
                <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)', fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-bright)', width: '20%' }}>檢舉理由</th>
                <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)', fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-bright)', width: '15%' }}>檢舉人</th>
                <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)', fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-bright)', width: '15%' }}>狀態</th>
                <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)', fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-bright)', width: '20%' }}>處理方式</th>
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
                          <button className="btn btn-outline" style={{ border: '1px solid var(--neon-cyan)', background: 'transparent', color: 'var(--neon-cyan)', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }} onClick={() => handleAdminDismissReport(rep.id)}>撤銷檢舉</button>
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
                  <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px', fontSize: '13px' }}>目前無待處理檢舉案</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  if (!isLoggedIn) {
    return (
      <>
        {/* CRT Scanline effect wrapper */}
        <div className="scanline-overlay"></div>

        <div className="login-wall-container" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          backgroundColor: 'var(--bg-void)',
          padding: '20px'
        }}>
          <div className="admin-modal-card" style={{ maxWidth: '400px', width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border-neon)', padding: '24px', borderRadius: '8px', position: 'relative', boxShadow: 'var(--card-shadow)' }}>
            <div className="logo" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '20px' }}>
              <span className="logo-bracket">[</span>ECHOES<span className="logo-dot">_</span>FEED<span className="logo-bracket">]</span>
            </div>
            <div className="admin-modal-title" style={{ fontSize: '15px', fontFamily: 'var(--font-heading)', color: 'var(--neon-green)', textAlign: 'center', marginBottom: '15px', textShadow: 'var(--glow-green)' }}>
              {loginMode === "login" ? "🔐 系統登入 // SYSTEM LOGIN" : "📝 帳號註冊 // SYSTEM REGISTER"}
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '11px', marginBottom: '20px', textAlign: 'center', fontFamily: 'var(--font-body)' }}>
              {loginMode === "login" ? "* 請輸入註冊過的帳號與密碼進行登入" : "* 請設定您的登入帳號、密碼與暱稱"}
            </p>

            {loginMode === "register" && (
              <div className="admin-modal-input-group" style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label htmlFor="register-nickname" style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>👤 暱稱 / Nickname</label>
                <input type="text" id="register-nickname" className="admin-modal-input" style={{ width: '100%', padding: '10px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '4px', fontSize: '13px' }} placeholder="請輸入暱稱" value={registerNickname} onChange={(e) => setRegisterNickname(e.target.value)} required />
              </div>
            )}

            <div className="admin-modal-input-group" style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label htmlFor="login-email" style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>📧 帳號 (電子郵件) / Email</label>
              <input type="email" id="login-email" className="admin-modal-input" style={{ width: '100%', padding: '10px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '4px', fontSize: '13px' }} placeholder="your@email.com" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required />
            </div>

            <div className="admin-modal-input-group" style={{ marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label htmlFor="login-password" style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>🔑 密碼 / Password</label>
              <input type="password" id="login-password" className="admin-modal-input" style={{ width: '100%', padding: '10px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '4px', fontSize: '13px' }} placeholder="••••••••" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (loginMode === "login" ? submitTraditionalLogin() : handleRegister())} required />
            </div>

            <div className="admin-modal-actions" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {loginMode === "login" ? (
                <>
                  <button id="login-btn-submit" className="admin-modal-btn admin-modal-btn-submit" style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '10px', background: 'rgba(61, 220, 151, 0.1)', border: '1px solid var(--neon-green)', color: 'var(--neon-green)', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }} onClick={submitTraditionalLogin}>登入 / Log In</button>
                  <div style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-secondary)' }}>
                    沒有帳號？ <span style={{ color: 'var(--neon-amber)', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => setLoginMode("register")}>立即註冊</span>
                  </div>
                </>
              ) : (
                <>
                  <button id="register-btn-submit" className="admin-modal-btn admin-modal-btn-submit" style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '10px', background: 'rgba(251, 191, 36, 0.1)', border: '1px solid var(--neon-amber)', color: 'var(--neon-amber)', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }} onClick={handleRegister}>註冊並登入 / Register</button>
                  <div style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-secondary)' }}>
                    已有帳號？ <span style={{ color: 'var(--neon-green)', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => setLoginMode("login")}>立即登入</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Toast Notifications */}
        <div id="toast-container" className="toast-container" style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1200, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {toasts.map(toast => (
            <div key={toast.id} className="toast" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-card)', border: '1px solid var(--neon-green)', padding: '10px 16px', borderRadius: '6px', color: 'var(--text-bright)', boxShadow: 'var(--card-shadow)' }}>
              <CheckCircle2 style={{ width: '16px', height: '16px', color: 'var(--neon-green)' }} />
              <span>{toast.message}</span>
            </div>
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      {/* CRT Scanline effect wrapper */}
      <div className="scanline-overlay"></div>

      {/* Header navbar */}
      <header className="navbar">
        <div className="nav-container">
          <a href="#/" className="logo" style={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => setCurrentCategory("All")}>
            <span className="logo-bracket">[</span>ECHOES<span className="logo-dot">_</span>FEED<span className="logo-bracket">]</span>
            <span style={{
              fontSize: '10px',
              padding: '2px 6px',
              borderRadius: '4px',
              background: isFirebaseSetup ? 'rgba(61, 220, 151, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              color: isFirebaseSetup ? 'var(--neon-green)' : 'var(--neon-red)',
              border: isFirebaseSetup ? '1px solid rgba(61, 220, 151, 0.2)' : '1px solid rgba(239, 68, 68, 0.2)',
              fontFamily: 'monospace'
            }}>
              DB:{isFirebaseSetup ? "CLOUD" : "LOCAL"}
            </span>
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
          <div className="layout-wrapper" style={{ alignItems: 'flex-start' }}>

            {/* Left Sidebar */}
            <aside className="sidebar-left" style={{ position: 'sticky', top: '24px', maxHeight: 'calc(100vh - 48px)', overflowY: 'auto' }}>
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
                  <li className={currentRoute === "#/" || currentRoute === "" ? "active" : ""} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }} onClick={() => { setCurrentCategory("All"); window.location.hash = "#/"; }}>
                    <Home style={{ width: '16px', height: '16px' }} /> <span className="sidebar-menu-text">{t("home")}</span>
                  </li>
                  <li className={currentRoute === "#/notifications" ? "active" : ""} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', position: 'relative' }} onClick={() => window.location.hash = "#/notifications"}>
                    <Bell style={{ width: '16px', height: '16px' }} />
                    <span className="sidebar-menu-text">{currentLang === "en" ? "Notifications" : "通知訊息"}</span>
                    {notificationsList.filter(n => n.isRead !== undefined ? !n.isRead : !n.read).length > 0 && (
                      <span style={{
                        position: 'absolute',
                        right: '10px',
                        width: '8px',
                        height: '8px',
                        backgroundColor: 'var(--neon-red)',
                        borderRadius: '50%',
                        boxShadow: '0 0 6px var(--neon-red)'
                      }}></span>
                    )}
                  </li>
                  <li className={currentRoute === "#/messages" ? "active" : ""} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', position: 'relative' }} onClick={() => window.location.hash = "#/messages"}>
                    <Mail style={{ width: '16px', height: '16px' }} /> <span className="sidebar-menu-text">{currentLang === "en" ? "Direct Messages" : "私訊功能"}</span>
                    {unreadMessagesCount > 0 && (
                      <span className="ml-2 w-2 h-2 bg-red-500 rounded-full inline-block" style={{
                        position: 'absolute',
                        right: '10px',
                        width: '8px',
                        height: '8px',
                        backgroundColor: 'var(--neon-red)',
                        borderRadius: '50%',
                        boxShadow: '0 0 6px var(--neon-red)'
                      }}></span>
                    )}
                  </li>
                  <li className={currentRoute === "#/bookmarks" ? "active" : ""} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }} onClick={() => window.location.hash = "#/bookmarks"}>
                    <Bookmark style={{ width: '16px', height: '16px' }} /> <span className="sidebar-menu-text">{t("likes_history")}</span>
                  </li>
                  <li className={currentPage === "profile" && profileViewUid === (currentUser.googleId || currentUser.uid) ? "active" : ""} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }} onClick={() => {
                    setProfileViewUid(currentUser.googleId || currentUser.uid);
                    setCurrentPage("profile");
                    window.scrollTo(0, 0);
                    window.location.hash = "#/profile";
                  }}>
                    <User style={{ width: '16px', height: '16px' }} /> <span className="sidebar-menu-text">{currentLang === "en" ? "My Profile" : "個人主頁"}</span>
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
            <section className="main-feed" style={{ flex: currentRoute === "#/messages" ? '3.2' : '2' }}>
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
                      <button 
                        className="profile-social-btn" 
                        style={{ background: 'none', padding: '8px', border: '1px solid var(--border-color)', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} 
                        aria-label="Feed"
                        onClick={() => navigateToHash("#/")}
                      >
                        <Terminal style={{ width: '18px', height: '18px' }} />
                      </button>
                      <button 
                        className="profile-social-btn" 
                        style={{ background: 'none', padding: '8px', border: '1px solid var(--border-color)', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} 
                        aria-label="My Thoughts"
                        onClick={() => navigateToHash("#/write")}
                      >
                        <User style={{ width: '18px', height: '18px' }} />
                      </button>
                      <button 
                        className="profile-social-btn" 
                        style={{ background: 'none', padding: '8px', border: '1px solid var(--border-color)', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} 
                        aria-label="Direct Messages"
                        onClick={() => navigateToHash("#/messages")}
                      >
                        <Mail style={{ width: '18px', height: '18px' }} />
                      </button>
                    </div>
                  </div>
                </div>
              ) : currentRoute === "#/bookmarks" ? (
                /* Bookmarks View */
                <div className="feed-container">
                  <div className="search-filter-section" style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        className={`feed-category-pill ${activeBookmarkTab === "likes" ? "active" : ""}`}
                        style={{ flex: 1, padding: '10px', fontSize: '13px', cursor: 'pointer' }}
                        onClick={() => setActiveBookmarkTab("likes")}
                      >
                        ❤️ {currentLang === "en" ? "My Likes" : "我的點讚"}
                      </button>
                      <button
                        className={`feed-category-pill ${activeBookmarkTab === "bookmarks" ? "active" : ""}`}
                        style={{ flex: 1, padding: '10px', fontSize: '13px', cursor: 'pointer' }}
                        onClick={() => setActiveBookmarkTab("bookmarks")}
                      >
                        🔖 {currentLang === "en" ? "My Bookmarks" : "我的收藏"}
                      </button>
                    </div>
                  </div>

                  <div id="posts-feed-list">
                    {posts
                      .filter(post => {
                        if (activeBookmarkTab === "likes") {
                          return post.likedBy ? post.likedBy.includes(currentUser.handle) : post.likedByUser;
                        } else {
                          return post.bookmarkedBy ? post.bookmarkedBy.includes(currentUser.handle) : false;
                        }
                      })
                      .map(post => renderPostCard(post))
                    }
                    {posts.filter(post => {
                      if (activeBookmarkTab === "likes") {
                        return post.likedBy ? post.likedBy.includes(currentUser.handle) : post.likedByUser;
                      } else {
                        return post.bookmarkedBy ? post.bookmarkedBy.includes(currentUser.handle) : false;
                      }
                    }).length === 0 && (
                        <div style={{ textAlign: 'center', padding: '40px 10px', color: 'var(--text-muted)' }}>
                          <Frown style={{ width: '38px', height: '38px', marginBottom: '12px' }} />
                          <p>{currentLang === "en" ? "No posts found in this section." : "此專區目前沒有任何貼文。"}</p>
                        </div>
                      )}
                  </div>
                </div>
              ) : currentRoute === "#/notifications" ? (
                /* Notifications View */
                <div className="feed-container">
                  <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--border-color)', paddingBottom: '15px', marginBottom: '20px' }}>
                    <h2 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: '20px', color: 'var(--accent)', textShadow: 'var(--glow-green)' }}>
                      🔔 {currentLang === "en" ? "Notifications" : "通知訊息"}
                    </h2>
                    {notificationsList.some(n => n.isRead !== undefined ? !n.isRead : !n.read) && (
                      <button
                        className="feed-category-pill"
                        style={{ background: 'rgba(61, 220, 151, 0.1)', borderColor: 'var(--neon-green)', color: 'var(--neon-green)', cursor: 'pointer' }}
                        onClick={handleMarkAllNotificationsRead}
                      >
                        {currentLang === "en" ? "Mark all as read" : "全部標記為已讀"}
                      </button>
                    )}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {notificationsList.map(n => {
                      const isUnread = n.isRead !== undefined ? !n.isRead : !n.read;
                      const contentText = n.message || n.content;
                      return (
                        <div
                          key={n.id}
                          style={{
                            background: 'var(--bg-card)',
                            border: isUnread 
                              ? (n.type === "friend_request" ? '1px solid var(--neon-amber)' : '1px solid var(--neon-cyan)') 
                              : '1px solid var(--border-color)',
                            boxShadow: isUnread 
                              ? (n.type === "friend_request" ? '0 0 8px rgba(255, 209, 102, 0.3)' : 'var(--glow-cyan)') 
                              : 'none',
                            borderRadius: '6px',
                            padding: '12px 16px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            cursor: 'pointer'
                          }}
                          onClick={() => handleNotificationClick(n)}
                        >
                          <div>
                            <p style={{ margin: 0, fontSize: '13px', color: isUnread ? 'var(--text-bright)' : 'var(--text-secondary)', fontWeight: isUnread ? 'bold' : 'normal' }}>
                              {n.type === "friend_request" && (
                                <span style={{ 
                                  fontSize: '10px', 
                                  background: 'rgba(255, 209, 102, 0.1)', 
                                  color: 'var(--neon-amber)', 
                                  border: '1px solid rgba(255, 209, 102, 0.3)', 
                                  padding: '1px 5px', 
                                  borderRadius: '3px', 
                                  marginRight: '6px',
                                  fontWeight: 'bold',
                                  display: 'inline-block',
                                  verticalAlign: 'middle'
                                }}>
                                  {currentLang === "en" ? "Friend Request" : "好友請求"}
                                </span>
                              )}
                              {(n.type === "reply" || n.type === "comment") && (
                                <span style={{ 
                                  fontSize: '10px', 
                                  background: 'rgba(61, 220, 151, 0.1)', 
                                  color: 'var(--neon-green)', 
                                  border: '1px solid rgba(61, 220, 151, 0.3)', 
                                  padding: '1px 5px', 
                                  borderRadius: '3px', 
                                  marginRight: '6px',
                                  fontWeight: 'bold',
                                  display: 'inline-block',
                                  verticalAlign: 'middle'
                                }}>
                                  {currentLang === "en" ? "Post Reply" : "貼文回覆"}
                                </span>
                              )}
                              <span style={{ verticalAlign: 'middle' }}>{contentText}</span>
                            </p>
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                              {n.timestamp ? formatRelativeDate(n.timestamp.toDate ? n.timestamp.toDate() : new Date(n.timestamp), currentLang) : ""}
                            </span>
                          </div>
                          {isUnread && (
                            <span style={{
                              width: '8px',
                              height: '8px',
                              backgroundColor: 'var(--neon-cyan)',
                              borderRadius: '50%',
                              boxShadow: '0 0 6px var(--neon-cyan)'
                            }}></span>
                          )}
                        </div>
                      );
                    })}
                    {notificationsList.length === 0 && (
                      <div style={{ textAlign: 'center', padding: '40px 10px', color: 'var(--text-muted)' }}>
                        <Bell style={{ width: '38px', height: '38px', marginBottom: '12px', opacity: 0.5 }} />
                        <p>{currentLang === "en" ? "No notifications" : "尚無任何通知訊息"}</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : currentRoute === "#/messages" ? (
                /* Messages View */
                <div className="messages-layout" style={{ display: 'flex', gap: '20px', minHeight: '500px', height: 'calc(100vh - 180px)', width: '100%' }}>
                  {/* Left Column: Friends list & Add Friend */}
                  <div className="messages-sidebar" style={{ width: '40%', display: 'flex', flexDirection: 'column', gap: '15px', borderRight: '1px solid var(--border-color)', paddingRight: '15px', height: '100%', overflowY: 'auto' }}>
                    
                    {/* 3. 好友申請清單與審核 */}
                    {incomingRequests.length > 0 && (
                      <div className="sidebar-section" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '15px' }}>
                        <h3 style={{ fontSize: '12px', fontFamily: 'var(--font-heading)', color: 'var(--neon-amber)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>
                          📩 待處理的好友申請
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {incomingRequests.map(req => {
                            const sender = usersList.find(u => (u.googleId || u.uid) === req.fromUid);
                            if (!sender) return null;
                            return (
                              <div key={req.id} style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '8px 10px',
                                borderRadius: '6px',
                                background: 'rgba(251, 191, 36, 0.05)',
                                border: '1px solid var(--neon-amber)'
                              }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <div className="user-avatar" style={{ 
                                    width: '28px', 
                                    height: '28px', 
                                    background: sender.avatarUrl ? `url(${sender.avatarUrl})` : (sender.avatarBg || 'var(--bg-elevated)'), 
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat',
                                    borderRadius: '50%', 
                                    color: '#fff', 
                                    fontSize: '9px', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    flexShrink: 0
                                  }}>
                                    {!sender.avatarUrl && (sender.avatarLetter || sender.name.substring(0, 2).toUpperCase())}
                                  </div>
                                  <div>
                                    <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-bright)' }}>{sender.name}</div>
                                    <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{sender.handle}</div>
                                  </div>
                                </div>
                                <div style={{ display: 'flex', gap: '4px' }}>
                                  <button
                                    style={{ padding: '4px 8px', background: 'rgba(61, 220, 151, 0.1)', border: '1px solid var(--neon-green)', color: 'var(--neon-green)', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}
                                    onClick={() => handleAcceptFriendRequest(req)}
                                  >
                                    同意
                                  </button>
                                  <button
                                    style={{ padding: '4px 8px', background: 'transparent', border: '1px solid var(--neon-red)', color: 'var(--neon-red)', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}
                                    onClick={() => handleDeclineFriendRequest(req)}
                                  >
                                    拒絕
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Group Chats Section */}
                    <div className="sidebar-section" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '15px', marginBottom: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <h3 style={{ margin: 0, fontSize: '12px', fontFamily: 'var(--font-heading)', color: 'var(--text-bright)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                          💬 {currentLang === "en" ? "Group Chats" : "群組聊天"}
                        </h3>
                        <button
                          style={{
                            padding: '4px 8px',
                            background: 'rgba(61, 220, 151, 0.1)',
                            border: '1px solid var(--neon-green)',
                            color: 'var(--neon-green)',
                            borderRadius: '4px',
                            fontSize: '11px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                          }}
                          onClick={handleCreateGroup}
                        >
                          + {currentLang === "en" ? "Create Group" : "建立群組"}
                        </button>
                      </div>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {groupChats.map(g => {
                          const isSelected = activeChatFriend && activeChatFriend.type === "group" && activeChatFriend.id === g.id;
                          return (
                            <button
                              key={g.id}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '10px',
                                borderRadius: '6px',
                                background: isSelected ? 'rgba(61, 220, 151, 0.1)' : 'var(--bg-card)',
                                border: isSelected ? '1px solid var(--neon-green)' : '1px solid var(--border-color)',
                                textAlign: 'left',
                                cursor: 'pointer',
                                width: '100%'
                              }}
                              onClick={() => {
                                setActiveChatFriend(g);
                                setShowGifPicker(false);
                                setActiveEmojiMenuMsgId(null);
                              }}
                            >
                              <div className="group-avatar" style={{ 
                                width: '30px', 
                                height: '30px', 
                                background: 'linear-gradient(135deg, var(--neon-cyan), var(--neon-green))',
                                borderRadius: '50%', 
                                color: '#000', 
                                fontSize: '12px', 
                                fontWeight: 'bold',
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                flexShrink: 0
                              }}>
                                👥
                              </div>
                              <div>
                                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-bright)' }}>{g.name}</div>
                                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                                  {g.members ? g.members.length : 1} {currentLang === "en" ? "members" : "位成員"}
                                </div>
                              </div>
                              {getGroupUnreadCount(g.id) > 0 && (
                                <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full" style={{
                                  marginLeft: 'auto',
                                  backgroundColor: 'var(--neon-red)',
                                  boxShadow: '0 0 5px var(--neon-red)',
                                  fontSize: '10px',
                                  fontWeight: 'bold',
                                  display: 'inline-block',
                                  lineHeight: '1.2'
                                }}>
                                  {getGroupUnreadCount(g.id)}
                                </span>
                              )}
                            </button>
                          );
                        })}
                        {groupChats.length === 0 && (
                          <div style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)', padding: '10px 0' }}>
                            {currentLang === "en" ? "No group chats." : "目前無參與任何群組。"}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="sidebar-section">
                      <h3 style={{ fontSize: '12px', fontFamily: 'var(--font-heading)', color: 'var(--text-bright)', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginBottom: '10px' }}>
                        👥 {currentLang === "en" ? "Friends" : "好友清單"}
                      </h3>
                      <div style={{ marginBottom: '12px', position: 'relative' }}>
                        <input
                          type="text"
                          placeholder={currentLang === "en" ? "Search friends..." : "搜尋好友..."}
                          value={friendSearchQuery}
                          onChange={(e) => setFriendSearchQuery(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            borderRadius: '6px',
                            border: '1px solid var(--border-color)',
                            backgroundColor: 'var(--bg-input)',
                            color: 'var(--text-primary)',
                            fontSize: '12px',
                            transition: 'all 0.2s'
                          }}
                          onFocus={(e) => e.target.style.borderColor = 'var(--neon-green)'}
                          onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                        />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {usersList
                          .filter(u => {
                            const uUid = u.googleId || u.uid;
                            const isFriend = sentRequests.some(r => r.toUid === uUid && r.status === "accepted") ||
                                             receivedRequests.some(r => r.fromUid === uUid && r.status === "accepted");
                            if (!isFriend) return false;
                            
                            if (friendSearchQuery.trim() !== "") {
                              const q = friendSearchQuery.toLowerCase();
                              return u.name?.toLowerCase().includes(q) || u.handle?.toLowerCase().includes(q);
                            }
                            return true;
                          })
                          .map(u => {
                            const isSelected = activeChatFriend && activeChatFriend.handle === u.handle;
                            return (
                              <button
                                key={u.handle}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '10px',
                                  padding: '10px',
                                  borderRadius: '6px',
                                  background: isSelected ? 'rgba(61, 220, 151, 0.1)' : 'var(--bg-card)',
                                  border: isSelected ? '1px solid var(--neon-green)' : '1px solid var(--border-color)',
                                  textAlign: 'left',
                                  cursor: 'pointer',
                                  width: '100%'
                                }}
                                onClick={() => {
                                  setActiveChatFriend(u);
                                  setShowGifPicker(false);
                                  setActiveEmojiMenuMsgId(null);
                                }}
                              >
                                <div className="user-avatar" style={{ 
                                  width: '30px', 
                                  height: '30px', 
                                  background: u.avatarUrl ? `url(${u.avatarUrl})` : (u.avatarBg || 'var(--bg-elevated)'), 
                                  backgroundSize: 'cover',
                                  backgroundPosition: 'center',
                                  backgroundRepeat: 'no-repeat',
                                  borderRadius: '50%', 
                                  color: '#fff', 
                                  fontSize: '10px', 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  justifyContent: 'center', 
                                  position: 'relative',
                                  flexShrink: 0
                                }}>
                                  {!u.avatarUrl && (u.avatarLetter || u.name.substring(0, 2).toUpperCase())}
                                  <span style={{
                                    position: 'absolute',
                                    bottom: '-1px',
                                    right: '-1px',
                                    width: '7px',
                                    height: '7px',
                                    borderRadius: '50%',
                                    background: onlineUsers.some(os => os.handle === u.handle) ? 'var(--neon-green)' : 'var(--neon-red)',
                                    border: '1.5px solid var(--bg-card)',
                                    boxShadow: `0 0 3px ${onlineUsers.some(os => os.handle === u.handle) ? 'var(--neon-green)' : 'var(--neon-red)'}`
                                  }}></span>
                                </div>
                                <div>
                                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-bright)' }}>{u.name}</div>
                                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{u.handle}</div>
                                </div>
                                {getFriendUnreadCount(u) > 0 && (
                                  <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full" style={{
                                    marginLeft: 'auto',
                                    backgroundColor: 'var(--neon-red)',
                                    boxShadow: '0 0 5px var(--neon-red)',
                                    fontSize: '10px',
                                    fontWeight: 'bold',
                                    display: 'inline-block',
                                    lineHeight: '1.2'
                                  }}>
                                    {getFriendUnreadCount(u)}
                                  </span>
                                )}
                              </button>
                            );
                          })
                        }
                        {usersList.filter(u => {
                          const uUid = u.googleId || u.uid;
                          return sentRequests.some(r => r.toUid === uUid && r.status === "accepted") ||
                                 receivedRequests.some(r => r.fromUid === uUid && r.status === "accepted");
                        }).length === 0 && (
                          <div style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)', padding: '10px 0' }}>
                            {currentLang === "en" ? "No friends yet." : "目前尚無好友，去新增好友吧！"}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="sidebar-section" style={{ marginTop: '15px' }}>
                      <h3 style={{ fontSize: '12px', fontFamily: 'var(--font-heading)', color: 'var(--text-bright)', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginBottom: '10px' }}>
                        ➕ {currentLang === "en" ? "Find Friends" : "新增與管理好友"}
                      </h3>
                      {/* Search Bar for Finding/Managing Friends */}
                      <div style={{ marginBottom: '12px', position: 'relative' }}>
                        <input
                          type="text"
                          placeholder={currentLang === "en" ? "Search users..." : "搜尋使用者..."}
                          value={findFriendSearchQuery}
                          onChange={(e) => setFindFriendSearchQuery(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            borderRadius: '6px',
                            border: '1px solid var(--border-color)',
                            backgroundColor: 'var(--bg-input)',
                            color: 'var(--text-primary)',
                            fontSize: '12px',
                            transition: 'all 0.2s'
                          }}
                          onFocus={(e) => e.target.style.borderColor = 'var(--neon-green)'}
                          onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                        />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {usersList
                          .filter(u => {
                            if (findFriendSearchQuery.trim() !== "") {
                              const q = findFriendSearchQuery.toLowerCase();
                              return u.name?.toLowerCase().includes(q) || u.handle?.toLowerCase().includes(q);
                            }
                            return true;
                          })
                          .map(u => {
                            const uUid = u.googleId || u.uid;
                            const sentReq = sentRequests.find(r => r.toUid === uUid);
                            const recvReq = receivedRequests.find(r => r.fromUid === uUid);
                            const isFriend = (sentReq && sentReq.status === "accepted") || (recvReq && recvReq.status === "accepted");

                            return (
                              <div key={u.handle} style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '8px 10px',
                                borderRadius: '6px',
                                background: 'var(--bg-input)',
                                border: '1px solid var(--border-color)'
                              }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <div className="user-avatar" style={{ 
                                    width: '28px', 
                                    height: '28px', 
                                    background: u.avatarUrl ? `url(${u.avatarUrl})` : (u.avatarBg || 'var(--bg-elevated)'), 
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat',
                                    borderRadius: '50%', 
                                    color: '#fff', 
                                    fontSize: '9px', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center', 
                                    position: 'relative',
                                    flexShrink: 0
                                  }}>
                                    {!u.avatarUrl && (u.avatarLetter || u.name.substring(0, 2).toUpperCase())}
                                    <span style={{
                                      position: 'absolute',
                                      bottom: '-1px',
                                      right: '-1px',
                                      width: '7px',
                                      height: '7px',
                                      borderRadius: '50%',
                                      background: onlineUsers.some(os => os.handle === u.handle) ? 'var(--neon-green)' : 'var(--neon-red)',
                                      border: '1.5px solid var(--bg-card)',
                                      boxShadow: `0 0 3px ${onlineUsers.some(os => os.handle === u.handle) ? 'var(--neon-green)' : 'var(--neon-red)'}`
                                    }}></span>
                                  </div>
                                  <div>
                                    <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-bright)' }}>{u.name}</div>
                                    <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{u.handle}</div>
                                  </div>
                                </div>

                                <div>
                                  {isFriend ? (
                                    <button
                                      disabled
                                      style={{ padding: '4px 8px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-color)', color: 'var(--text-muted)', borderRadius: '4px', fontSize: '11px', cursor: 'not-allowed' }}
                                    >
                                      已是好友
                                    </button>
                                  ) : sentReq && sentReq.status === "pending" ? (
                                    <button
                                      disabled
                                      style={{ padding: '4px 8px', background: 'rgba(251, 191, 36, 0.05)', border: '1px solid var(--neon-amber)', color: 'var(--neon-amber)', borderRadius: '4px', fontSize: '11px', cursor: 'not-allowed', opacity: 0.7 }}
                                    >
                                      申請中...
                                    </button>
                                  ) : recvReq && recvReq.status === "pending" ? (
                                    <div style={{ display: 'flex', gap: '4px' }}>
                                      <button
                                        style={{ padding: '4px 8px', background: 'rgba(61, 220, 151, 0.1)', border: '1px solid var(--neon-green)', color: 'var(--neon-green)', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}
                                        onClick={() => handleAcceptFriendRequest(recvReq)}
                                      >
                                        同意
                                      </button>
                                      <button
                                        style={{ padding: '4px 8px', background: 'transparent', border: '1px solid var(--neon-red)', color: 'var(--neon-red)', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}
                                        onClick={() => handleDeclineFriendRequest(recvReq)}
                                      >
                                        拒絕
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      style={{ padding: '4px 8px', background: 'rgba(61, 220, 151, 0.1)', border: '1px solid var(--neon-green)', color: 'var(--neon-green)', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}
                                      onClick={() => handleSendFriendRequest(u)}
                                    >
                                      加好友
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        {usersList.filter(u => {
                          if (findFriendSearchQuery.trim() !== "") {
                            const q = findFriendSearchQuery.toLowerCase();
                            return u.name?.toLowerCase().includes(q) || u.handle?.toLowerCase().includes(q);
                          }
                          return true;
                        }).length === 0 && (
                          <div style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)', padding: '10px 0' }}>
                            {currentLang === "en" ? "No users found." : "找不到相符的使用者。"}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Chatroom Area */}
                  <div className="chatroom-area" style={{ width: '60%', display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    {activeChatFriend ? (
                      <>
                        {/* Chatroom Header */}
                        {(() => {
                          const latestProfile = activeChatFriend.type !== "group" ? getLatestUserAvatar(activeChatFriend.handle, activeChatFriend.name, activeChatFriend.googleId || activeChatFriend.uid) : null;
                          const avatarUrl = latestProfile ? latestProfile.avatarUrl : (activeChatFriend.type !== "group" ? activeChatFriend.avatarUrl : null);
                          const avatarBg = latestProfile ? latestProfile.avatarBg : (activeChatFriend.type !== "group" ? activeChatFriend.avatarBg : null);
                          const avatarLetter = latestProfile ? latestProfile.avatarLetter : (activeChatFriend.type !== "group" ? activeChatFriend.avatarLetter : null);
                          const displayName = latestProfile ? latestProfile.name : activeChatFriend.name;

                          return (
                            <div style={{ padding: '15px 20px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div className="user-avatar" style={{ 
                                  width: '32px', 
                                  height: '32px', 
                                  background: activeChatFriend.type === "group" 
                                    ? 'linear-gradient(135deg, var(--neon-cyan), var(--neon-green))'
                                    : (avatarUrl ? `url(${avatarUrl})` : (avatarBg || 'var(--bg-elevated)')), 
                                  backgroundSize: 'cover',
                                  backgroundPosition: 'center',
                                  backgroundRepeat: 'no-repeat',
                                  borderRadius: '50%', 
                                  color: activeChatFriend.type === "group" ? '#000' : '#fff', 
                                  fontSize: '10px', 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  justifyContent: 'center',
                                  fontWeight: activeChatFriend.type === "group" ? 'bold' : 'normal',
                                  flexShrink: 0
                                }}>
                                  {activeChatFriend.type === "group" ? "👥" : (!avatarUrl && (avatarLetter || displayName.substring(0, 2).toUpperCase()))}
                                </div>
                                <div>
                                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-bright)' }}>{displayName}</div>
                                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                                    {activeChatFriend.type === "group" 
                                      ? `${activeChatFriend.members ? activeChatFriend.members.length : 1} ${currentLang === "en" ? "members" : "位成員"}`
                                      : activeChatFriend.handle}
                                  </div>
                                </div>
                              </div>
                              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                {activeChatFriend.type === "group" ? (
                                  <>
                                    <button
                                      style={{
                                        padding: '6px 12px',
                                        background: 'rgba(61, 220, 151, 0.1)',
                                        border: '1px solid var(--neon-green)',
                                        color: 'var(--neon-green)',
                                        borderRadius: '6px',
                                        fontSize: '12px',
                                        cursor: 'pointer',
                                        fontWeight: 'bold',
                                        transition: 'all 0.2s',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px'
                                      }}
                                      onClick={handleInviteToGroup}
                                    >
                                      ➕ {currentLang === "en" ? "Invite" : "邀請"}
                                    </button>
                                    <button
                                      style={{
                                        padding: '6px 12px',
                                        background: 'rgba(255, 107, 107, 0.1)',
                                        border: '1px solid var(--neon-red)',
                                        color: 'var(--neon-red)',
                                        borderRadius: '6px',
                                        fontSize: '12px',
                                        cursor: 'pointer',
                                        fontWeight: 'bold',
                                        transition: 'all 0.2s',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px'
                                      }}
                                      onClick={() => handleDeleteGroup(activeChatFriend)}
                                    >
                                      <Trash2 style={{ width: '13px', height: '13px' }} />
                                      {currentLang === "en" ? "Delete Group" : "刪除群組"}
                                    </button>
                                    <button
                                      style={{
                                        padding: '6px 12px',
                                        background: 'rgba(255, 209, 102, 0.1)',
                                        border: '1px solid var(--neon-amber)',
                                        color: 'var(--neon-amber)',
                                        borderRadius: '6px',
                                        fontSize: '12px',
                                        cursor: 'pointer',
                                        fontWeight: 'bold',
                                        transition: 'all 0.2s',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px'
                                      }}
                                      onClick={() => handleLeaveGroup(activeChatFriend)}
                                    >
                                      <LogOut style={{ width: '13px', height: '13px' }} />
                                      {currentLang === "en" ? "Leave" : "退出群組"}
                                    </button>
                                  </>
                                ) : (
                                  <button
                                    style={{
                                      padding: '6px 12px',
                                      background: 'rgba(255, 107, 107, 0.1)',
                                      border: '1px solid var(--neon-red)',
                                      color: 'var(--neon-red)',
                                      borderRadius: '6px',
                                      fontSize: '12px',
                                      cursor: 'pointer',
                                      fontWeight: 'bold',
                                      transition: 'all 0.2s',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '4px'
                                    }}
                                    onClick={() => handleDeleteFriend(activeChatFriend)}
                                  >
                                    <UserX style={{ width: '13px', height: '13px' }} />
                                    {currentLang === "en" ? "Delete Friend" : "刪除好友"}
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })()}

                        {/* Message Pane */}
                        <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          {chatMessages.map(m => {
                            const isMine = m.senderId === (currentUser.googleId || currentUser.uid);
                            return (
                              <div key={m.id} style={{
                                display: 'flex',
                                justifyContent: isMine ? 'flex-end' : 'flex-start',
                                width: '100%'
                              }}>
                                <div style={{
                                  display: 'flex',
                                  flexDirection: isMine ? 'row-reverse' : 'row',
                                  alignItems: 'center',
                                  gap: '8px',
                                  maxWidth: '75%',
                                  position: 'relative'
                                }}>
                                  <div style={{
                                    background: isMine ? 'rgba(61, 220, 151, 0.1)' : 'var(--bg-input)',
                                    border: isMine ? '1px solid var(--neon-green)' : '1px solid var(--border-color)',
                                    color: 'var(--text-bright)',
                                    borderRadius: '8px',
                                    padding: '10px 14px',
                                    position: 'relative',
                                    display: 'flex',
                                    flexDirection: 'column'
                                  }}>
                                    {!isMine && activeChatFriend.type === "group" && (
                                      <div style={{ fontSize: '10px', color: 'var(--neon-green)', fontWeight: 'bold', marginBottom: '4px' }}>
                                        {m.senderName || "成員"}
                                      </div>
                                    )}

                                    {/* Message Text or GIF */}
                                    {m.messageType === "gif" ? (
                                      <img src={m.text} className="max-w-[150px] rounded" style={{ maxWidth: '150px', borderRadius: '4px', display: 'block' }} alt="Sticker GIF" />
                                    ) : (
                                      <div style={{ fontSize: '13px', wordBreak: 'break-word' }}>{m.text}</div>
                                    )}

                                    {/* Reactions list below message content */}
                                    {m.reactions && Object.keys(m.reactions).length > 0 && (
                                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '6px' }}>
                                        {Object.entries(m.reactions).map(([emoji, uids]) => {
                                          if (!uids || uids.length === 0) return null;
                                          const userReacted = uids.includes(currentUser.googleId || currentUser.uid);
                                          return (
                                            <button
                                              key={emoji}
                                              onClick={() => handleEmojiReact(m.id, emoji, m.reactions)}
                                              style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '3px',
                                                padding: '2px 6px',
                                                borderRadius: '10px',
                                                background: userReacted ? 'rgba(61, 220, 151, 0.2)' : 'var(--bg-card)',
                                                border: userReacted ? '1px solid var(--neon-green)' : '1px solid var(--border-color)',
                                                color: 'var(--text-bright)',
                                                fontSize: '11px',
                                                cursor: 'pointer',
                                                lineHeight: 1
                                              }}
                                            >
                                              <span>{emoji}</span>
                                              <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{uids.length}</span>
                                            </button>
                                          );
                                        })}
                                      </div>
                                    )}

                                    <div style={{ fontSize: '9px', color: 'var(--text-muted)', textAlign: 'right', marginTop: '4px' }}>
                                      {m.timestamp ? formatRelativeDate(m.timestamp.toDate ? m.timestamp.toDate() : new Date(m.timestamp), currentLang) : ""}
                                    </div>
                                  </div>

                                  {/* 😊 Reaction trigger button */}
                                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                    <button
                                      type="button"
                                      onClick={() => setActiveEmojiMenuMsgId(activeEmojiMenuMsgId === m.id ? null : m.id)}
                                      style={{
                                        background: 'transparent',
                                        border: 'none',
                                        color: 'var(--text-muted)',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        padding: '4px',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        transition: 'background 0.2s'
                                      }}
                                      onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                                      onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                                      title={currentLang === "en" ? "React with Emoji" : "新增表情回應"}
                                    >
                                      😊
                                    </button>

                                    {/* Emoji Options list popup */}
                                    {activeEmojiMenuMsgId === m.id && (
                                      <div style={{
                                        position: 'absolute',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        [isMine ? 'right' : 'left']: '32px',
                                        zIndex: 1000,
                                        display: 'flex',
                                        gap: '6px',
                                        padding: '6px 8px',
                                        background: 'var(--bg-card)',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: '20px',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
                                      }}>
                                        {['👍', '❤️', '😂', '😮', '😢'].map(emoji => (
                                          <button
                                            key={emoji}
                                            type="button"
                                            onClick={() => {
                                              handleEmojiReact(m.id, emoji, m.reactions);
                                              setActiveEmojiMenuMsgId(null);
                                            }}
                                            style={{
                                              background: 'transparent',
                                              border: 'none',
                                              fontSize: '16px',
                                              cursor: 'pointer',
                                              padding: '2px',
                                              borderRadius: '4px',
                                              transition: 'transform 0.1s'
                                            }}
                                            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
                                            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                          >
                                            {emoji}
                                          </button>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                          <div ref={chatEndRef} />
                        </div>

                        {/* GIF Picker Tray (Inline, 100% visible, no clipping) */}
                        {showGifPicker && (
                          <div style={{
                            padding: '12px 15px',
                            borderTop: '1px solid var(--border-color)',
                            background: 'var(--bg-card)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px'
                          }}>
                            {/* Header row */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text-bright)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                🎬 {currentLang === "en" ? "GIF Search Engine" : "GIF 搜尋引擎"}
                              </span>
                              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <button
                                  type="button"
                                  style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'var(--neon-amber)',
                                    fontSize: '11px',
                                    cursor: 'pointer',
                                    textDecoration: 'underline',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '2px'
                                  }}
                                  onClick={() => setShowGiphyKeyInput(!showGiphyKeyInput)}
                                >
                                  🔑 {currentLang === "en" ? "GIPHY Key" : "GIPHY 金鑰"}
                                </button>
                                <button
                                  type="button"
                                  style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'var(--neon-cyan)',
                                    fontSize: '11px',
                                    cursor: 'pointer',
                                    textDecoration: 'underline'
                                  }}
                                  onClick={() => {
                                    const gifUrl = window.prompt(currentLang === "en" ? "Enter GIF Image URL:" : "請輸入 GIF 圖片網址：");
                                    if (gifUrl && gifUrl.trim()) {
                                      handleSendMessage(gifUrl.trim(), "gif");
                                      setShowGifPicker(false);
                                    }
                                  }}
                                >
                                  {currentLang === "en" ? "Custom URL..." : "自訂網址..."}
                                </button>
                              </div>
                            </div>

                            {/* Giphy Key settings input (collapsible) */}
                            {showGiphyKeyInput && (
                              <div style={{
                                padding: '8px 12px',
                                background: 'var(--bg-input)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '6px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '6px'
                              }}>
                                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                                  {currentLang === "en" 
                                    ? "Enter GIPHY API Key for live web search. Get a free beta key from GIPHY Developer portal." 
                                    : "輸入 GIPHY API 金鑰以啟用雲端搜尋。可至 GIPHY 開發者後台免費申請。"}
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                  <input
                                    type="text"
                                    style={{
                                      flex: 1,
                                      padding: '6px 10px',
                                      background: 'var(--bg-card)',
                                      border: '1px solid var(--border-color)',
                                      borderRadius: '4px',
                                      fontSize: '11px',
                                      color: 'var(--text-bright)'
                                    }}
                                    placeholder="Enter GIPHY API Key..."
                                    value={giphyApiKey}
                                    onChange={(e) => saveGiphyApiKey(e.target.value)}
                                  />
                                  <button
                                    type="button"
                                    style={{
                                      padding: '6px 12px',
                                      background: 'rgba(239, 68, 68, 0.1)',
                                      border: '1px solid var(--neon-red)',
                                      color: 'var(--neon-red)',
                                      borderRadius: '4px',
                                      fontSize: '11px',
                                      cursor: 'pointer'
                                    }}
                                    onClick={() => {
                                      saveGiphyApiKey("");
                                      showToast("GIPHY API 金鑰已清除");
                                    }}
                                  >
                                    {currentLang === "en" ? "Clear" : "清除"}
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* Search input field */}
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <input
                                type="text"
                                style={{
                                  flex: 1,
                                  padding: '8px 12px',
                                  background: 'var(--bg-input)',
                                  border: '1px solid var(--border-color)',
                                  borderRadius: '6px',
                                  fontSize: '12px',
                                  color: 'var(--text-bright)'
                                }}
                                placeholder={
                                  giphyApiKey 
                                    ? (currentLang === "en" ? "Search millions of GIFs from GIPHY..." : "搜尋 GIPHY 數百萬張 GIF 動圖...")
                                    : (currentLang === "en" ? "Search built-in GIFs (e.g. cat, happy, cry)..." : "搜尋內建 GIF（如：cat, happy, cry）...")
                                }
                                value={gifSearchQuery}
                                onChange={(e) => {
                                  setGifSearchQuery(e.target.value);
                                  handleFetchGifs(e.target.value, false);
                                }}
                              />
                            </div>

                            {/* Categories tags row */}
                            <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px', whiteSpace: 'nowrap' }}>
                              {[
                                { label: '🔥 熱門/全部', val: '' },
                                { label: '🐱 貓咪', val: 'cat' },
                                { label: '😂 搞笑', val: 'meme' },
                                { label: '🎉 慶祝', val: 'happy' },
                                { label: '😢 難過', val: 'sad' },
                                { label: '生氣', val: 'angry' },
                                { label: '😮 驚訝', val: 'shock' },
                                { label: '❤️ 戀愛', val: 'love' }
                              ].map(pill => (
                                <button
                                  key={pill.label}
                                  type="button"
                                  onClick={() => {
                                    setGifSearchQuery(pill.val);
                                    if (pill.val === '') {
                                      loadInitialGifs(false);
                                    } else {
                                      handleFetchGifs(pill.val, false);
                                    }
                                  }}
                                  style={{
                                    padding: '4px 8px',
                                    borderRadius: '12px',
                                    border: gifSearchQuery === pill.val ? '1px solid var(--neon-green)' : '1px solid var(--border-color)',
                                    background: gifSearchQuery === pill.val ? 'rgba(61, 220, 151, 0.1)' : 'var(--bg-input)',
                                    color: gifSearchQuery === pill.val ? 'var(--neon-green)' : 'var(--text-secondary)',
                                    fontSize: '11px',
                                    cursor: 'pointer'
                                  }}
                                >
                                  {pill.label}
                                </button>
                              ))}
                            </div>

                            {/* GIF Grid List */}
                            <div style={{
                              display: 'grid',
                              gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))',
                              gap: '8px',
                              maxHeight: '180px',
                              overflowY: 'auto',
                              padding: '2px'
                            }}>
                              {isSearchingGifs ? (
                                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '20px 0', fontSize: '11px', color: 'var(--text-muted)' }}>
                                  ⏳ {currentLang === "en" ? "Searching GIFs..." : "正在搜尋 GIF..."}
                                </div>
                              ) : chatSearchedGifs.length === 0 ? (
                                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '20px 0', fontSize: '11px', color: 'var(--text-muted)' }}>
                                  📭 {currentLang === "en" ? "No GIFs found. Try another query." : "找不到相符的 GIF，換個關鍵字試試吧！"}
                                </div>
                              ) : (
                                chatSearchedGifs.map((gif, idx) => (
                                  <img
                                    key={idx}
                                    src={gif.url}
                                    onClick={() => {
                                      handleSendMessage(gif.url, "gif");
                                      setShowGifPicker(false);
                                    }}
                                    style={{
                                      width: '100%',
                                      height: '75px',
                                      objectFit: 'cover',
                                      borderRadius: '4px',
                                      cursor: 'pointer',
                                      border: '2px solid transparent',
                                      transition: 'all 0.15s ease'
                                    }}
                                    onMouseOver={(e) => {
                                      e.currentTarget.style.borderColor = 'var(--neon-green)';
                                      e.currentTarget.style.transform = 'scale(1.05)';
                                      e.currentTarget.style.boxShadow = '0 0 8px rgba(61, 220, 151, 0.5)';
                                    }}
                                    onMouseOut={(e) => {
                                      e.currentTarget.style.borderColor = 'transparent';
                                      e.currentTarget.style.transform = 'scale(1)';
                                      e.currentTarget.style.boxShadow = 'none';
                                    }}
                                    alt="gif search result"
                                  />
                                ))
                              )}
                            </div>

                            {/* Caption Footer */}
                            {!giphyApiKey && (
                              <div style={{ fontSize: '10px', color: 'var(--text-muted)', textAlign: 'center', borderTop: '1px dashed var(--border-color)', paddingTop: '6px' }}>
                                💡 {currentLang === "en" 
                                  ? "Currently showing presets. Configure GIPHY key to search online." 
                                  : "目前顯示精選內建庫。設定 GIPHY 金鑰後可搜尋全網動圖。"}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Chatroom Input Panel */}
                        <div style={{ padding: '15px', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '10px', alignItems: 'center' }}>
                          <button
                            type="button"
                            className="p-2 border rounded text-sm hover:bg-gray-100"
                            style={{
                              cursor: 'pointer',
                              background: 'rgba(61, 220, 151, 0.1)',
                              border: '1px solid var(--neon-green)',
                              color: 'var(--neon-green)',
                              borderRadius: '6px',
                              fontWeight: 'bold',
                              padding: '10px 14px',
                              fontSize: '13px'
                            }}
                            onClick={() => setShowGifPicker(!showGifPicker)}
                          >
                            GIF
                          </button>
                          <input
                            type="text"
                            style={{ flex: 1, padding: '10px 14px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '13px' }}
                            placeholder={currentLang === "en" ? "Type a message..." : "請輸入私訊內容..."}
                            value={messageText}
                            onChange={(e) => setMessageText(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                          />
                          <button
                            style={{ padding: '10px 20px', background: 'rgba(61, 220, 151, 0.1)', border: '1px solid var(--neon-green)', color: 'var(--neon-green)', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                            onClick={() => handleSendMessage()}
                          >
                            傳送
                          </button>
                        </div>
                      </>
                    ) : (
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                        <Mail style={{ width: '48px', height: '48px', marginBottom: '15px', opacity: 0.4 }} />
                        <p style={{ fontSize: '14px' }}>{currentLang === "en" ? "Select a friend to start chatting." : "請在左側選擇一個好友開始即時私訊。"}</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : currentPage === "profile" ? (
                /* Profile View */
                (() => {
                  const targetUser = users.find(u => u.id === profileViewUid) || currentUser;
                  const effectiveUid = profileViewUid || currentUser?.uid;
                  const posts = displayPosts;
                  const userPosts = posts
                    .filter(post => post.uid === effectiveUid)
                    .sort((a, b) => {
                      if (a.pinned && !b.pinned) return -1;
                      if (!a.pinned && b.pinned) return 1;
                      return 0;
                    });
                  return (
                    <div className="feed-container" style={{ maxWidth: '650px', margin: '0 auto' }}>
                      {/* Top Profile Card */}
                      <div className="profile-card" style={{
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-md)',
                        padding: '24px',
                        position: 'relative',
                        marginBottom: '20px',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
                      }}>
                        {/* Header info */}
                        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
                          <div className="profile-avatar" style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            background: targetUser.photoURL ? `url(${targetUser.photoURL})` : (targetUser.avatarBg || 'var(--bg-elevated)'),
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '28px',
                            fontWeight: 'bold',
                            color: '#fff',
                            border: '2px solid var(--neon-cyan)',
                            boxShadow: '0 0 10px rgba(0, 243, 255, 0.4)'
                          }}>
                            {!targetUser.photoURL && (targetUser.avatarLetter || targetUser.displayName?.substring(0, 2).toUpperCase())}
                          </div>

                          <div style={{ flex: 1, minWidth: '200px' }}>
                            <h2 style={{ fontSize: '22px', fontFamily: 'var(--font-heading)', color: 'var(--text-bright)', margin: '0 0 4px 0' }}>
                              {targetUser.displayName}
                            </h2>
                            <p style={{ fontSize: '13px', color: 'var(--neon-cyan)', fontFamily: 'var(--font-heading)', fontWeight: 600, letterSpacing: '1px', margin: '0 0 8px 0' }}>
                              {targetUser.handle || `@${targetUser.username}`}
                            </p>
                            
                            {/* Bio display */}
                            {(profileViewUid !== currentUser.uid && profileViewUid) && (
                              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0, padding: '10px', background: 'var(--bg-input)', borderRadius: '6px', borderLeft: '3px solid var(--neon-cyan)' }}>
                                {targetUser.bio || "暫無自我介紹"}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Edit Form for self profile */}
                        {(profileViewUid === currentUser.uid || !profileViewUid) && (
                          <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px dashed var(--border-color)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                              <div style={{ flex: 1, minWidth: '150px' }}>
                                <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>
                                  自訂 @帳號 (username)
                                </label>
                                <input
                                  type="text"
                                  style={{ width: '100%', padding: '8px 12px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-bright)', fontSize: '13px' }}
                                  value={editUsername}
                                  onChange={(e) => setEditUsername(e.target.value)}
                                  placeholder="例如: cyber_ninja"
                                />
                              </div>
                            </div>

                            <div>
                              <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>
                                自我介紹 (bio)
                              </label>
                              <textarea
                                style={{ width: '100%', padding: '8px 12px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-bright)', fontSize: '13px', minHeight: '60px', resize: 'vertical' }}
                                value={editBio}
                                onChange={(e) => setEditBio(e.target.value)}
                                placeholder="寫點什麼介紹自己吧..."
                              />
                            </div>

                            <button
                              style={{
                                alignSelf: 'flex-end',
                                padding: '8px 16px',
                                background: isSaveSuccess ? '#1ea34d' : 'rgba(61, 220, 151, 0.1)',
                                border: '1px solid var(--neon-green)',
                                color: isSaveSuccess ? '#ffffff' : 'var(--neon-green)',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                fontSize: '12px',
                                boxShadow: isSaveSuccess ? '0 0 10px rgba(30, 163, 77, 0.5)' : '0 0 5px rgba(61, 220, 151, 0.2)',
                                transition: 'all 0.2s'
                              }}
                              onClick={handleSaveProfileSettings}
                            >
                              {isSaveSuccess ? "✓ 修改成功！" : "儲存修改"}
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Lower Part: User's posts wall */}
                      <h3 style={{ fontSize: '14px', fontFamily: 'var(--font-heading)', color: 'var(--text-bright)', marginBottom: '15px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        📑 {targetUser.displayName} {currentLang === "en" ? "Posts" : "的歷史貼文"}
                      </h3>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {userPosts.length === 0 ? (
                          <div style={{ textAlign: 'center', padding: '40px 10px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-muted)' }}>
                            <Frown style={{ width: '38px', height: '38px', marginBottom: '12px', opacity: 0.5 }} />
                            <p>{currentLang === "en" ? "No posts found." : "目前尚無任何貼文"}</p>
                          </div>
                        ) : (
                          userPosts.map((post) => renderPostCard(post))
                        )}
                      </div>
                    </div>
                  );
                })()
              ) : (
                /* Feed View */
                <div className="feed-container">

                  {/* Composer Card */}
                  <div className="composer-card">
                    <div className="composer-main">
                      <div className="user-avatar" style={{ background: currentUser.avatarBg || '', overflow: 'hidden' }}>
                        {currentUser.avatarUrl ? (
                          <img src={currentUser.avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                        ) : (
                          currentUser.avatarLetter || currentUser.name.substring(0, 2).toUpperCase()
                        )}
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

                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <select id="composer-category" className="composer-category-select" aria-label="Category Selection" value={composerCategory} onChange={handleCategoryChange}>
                            {categories.map(cat => (
                              <option key={cat.value} value={cat.value}>{cat.name}</option>
                            ))}
                            <option value="ADD_NEW_CATEGORY">+ 新增自訂分類...</option>
                          </select>
                          {categories.find(cat => cat.value === composerCategory)?.userId === (currentUser?.uid || currentUser?.googleId) && (
                            <button
                              type="button"
                              className="composer-tool-btn"
                              style={{
                                padding: '5px 8px',
                                fontSize: '11px',
                                background: 'rgba(239, 68, 68, 0.1)',
                                border: '1px solid var(--neon-red)',
                                color: 'var(--neon-red)',
                                borderRadius: 'var(--radius-sm)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                height: '100%',
                                transition: 'all var(--transition-fast)'
                              }}
                              onClick={handleDeleteCategory}
                              title={currentLang === "en" ? "Delete Category" : "刪除此分類"}
                            >
                              <Trash2 style={{ width: '12px', height: '12px' }} />
                            </button>
                          )}
                        </div>

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
                      <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: 'var(--text-muted)', cursor: 'pointer' }} onClick={() => handleSearch(searchQuery)} />
                      <input type="text" id="feed-search" className="feed-search-input" placeholder={t("placeholder_search")} value={searchQuery} onChange={handleSearchInputChange} onKeyDown={handleSearchKeyPress} />
                    </div>
                    <div className="categories-scroll" id="categories-scroll">
                      {categoryFilterList.map(cat => (
                        <button key={cat} className={`feed-category-pill ${currentCategory === cat ? 'active' : ''}`} onClick={() => setCurrentCategory(cat)}>
                          {cat === "All" ? t("all_categories") : getCategoryLabel(cat)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Posts List */}
                  <div id="posts-feed-list">
                    {filteredPosts.map(post => renderPostCard(post))}

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
            {currentRoute !== "#/messages" && (
              <aside className="sidebar-right" style={{ position: 'sticky', top: '24px', maxHeight: 'calc(100vh - 48px)', overflowY: 'auto' }}>

                {/* Administrator Presence panel wrapper */}
                {adminAuthenticated && (
                  <div 
                    className="sidebar-card" 
                    id="admin-presence-card" 
                    style={{ borderColor: 'var(--neon-cyan)', display: 'block', cursor: 'pointer' }}
                    onClick={() => navigateToHash("#/admin")}
                  >
                    <h3 style={{ color: 'var(--neon-cyan)', marginBottom: '12px', fontSize: '14px' }}>🛡️ 管理員專屬：使用者狀態監控</h3>
                    <ul id="admin-presence-list" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                      {onlineUsers.filter(u => u.handle !== "@admin").map(user => {
                        return (
                          <li key={user.uid} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-color)' }}>
                            <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{user.displayName || user.email || user.uid} ({user.handle || 'Guest'})</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--neon-green)', boxShadow: '0 0 5px var(--neon-green)' }}></span>
                              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Online</span>
                            </div>
                          </li>
                        );
                      })}
                      {onlineUsers.filter(u => u.handle !== "@admin").length === 0 && (
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

                {/* Search History & Results widget */}
                <div className="sidebar-card" id="search-history-card" style={{ maxHeight: '380px', overflowY: 'auto' }}>
                  {!searchResults ? (
                    <>
                      <h3 id="search-history-title">🔍 {t("search_history")}</h3>
                      <div id="search-history-list" className="search-history-container" style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {searchHistory.map(kw => (
                          <div key={kw} className="search-history-chip" style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '4px 10px', fontSize: '11px', cursor: 'pointer' }} onClick={() => { setSearchQuery(kw); handleSearch(kw); setCurrentRoute("#/"); }}>
                            <span>{kw}</span>
                            <button className="clear-chip-btn" style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)', fontWeight: 'bold' }} onClick={(e) => {
                              e.stopPropagation();
                              setSearchHistory(prev => {
                                const next = prev.filter(q => q !== kw);
                                if (searchQuery === kw) {
                                  setSearchResults(null);
                                  setSearchQuery("");
                                }
                                return next;
                              });
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
                    </>
                  ) : (
                    <>
                      <h3 id="search-results-title" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--neon-green)', fontSize: '13px', margin: '0 0 12px 0', fontFamily: 'var(--font-heading)' }}>
                        🔍 {currentLang === "en" ? "Search Results" : "搜尋結果"}
                      </h3>

                      {/* Users matches */}
                      {searchResults.users.length > 0 && (
                        <div style={{ marginBottom: '12px' }}>
                          <div style={{ fontSize: '10px', color: 'var(--neon-cyan)', textTransform: 'uppercase', marginBottom: '6px', fontWeight: 'bold', fontFamily: 'var(--font-heading)' }}>👤 {currentLang === "en" ? "Users" : "相符用戶"}</div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            {searchResults.users.map(u => (
                              <div key={u.handle} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '6px 8px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                                  <div className="user-avatar" style={{ width: '24px', height: '24px', background: u.avatarBg || 'var(--bg-elevated)', borderRadius: '50%', color: '#fff', fontSize: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    {u.avatarLetter || u.name.substring(0, 2).toUpperCase()}
                                  </div>
                                  <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '11px' }}>
                                    <span style={{ fontWeight: 600, color: 'var(--text-bright)' }}>{u.name}</span> <span style={{ color: 'var(--text-muted)', fontSize: '9px' }}>{u.handle}</span>
                                  </div>
                                </div>
                                {isLoggedIn && (
                                  <button style={{ border: 'none', background: 'transparent', color: 'var(--neon-green)', fontSize: '14px', cursor: 'pointer', padding: '2px 4px' }} title="Chat" onClick={() => {
                                    setActiveChatFriend(u);
                                    window.location.hash = "#/messages";
                                  }}>💬</button>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Posts matches */}
                      {searchResults.posts.length > 0 && (
                        <div style={{ marginBottom: '12px' }}>
                          <div style={{ fontSize: '10px', color: 'var(--neon-amber)', textTransform: 'uppercase', marginBottom: '6px', fontWeight: 'bold', fontFamily: 'var(--font-heading)' }}>📝 {currentLang === "en" ? "Posts" : "相符動態"}</div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            {searchResults.posts.map(p => (
                              <button key={p.id} className="liked-history-item" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-color)', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', textAlign: 'left' }} onClick={() => handleBookmarkItemClick(p.id)}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '2px' }}>
                                  <span>{p.author}</span>
                                  <span>{p.category}</span>
                                </div>
                                <span style={{ fontSize: '11px', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}>{p.content}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {searchResults.users.length === 0 && searchResults.posts.length === 0 && (
                        <div style={{ textAlign: 'center', fontSize: '11px', color: 'var(--text-muted)', padding: '12px 0' }}>無相符搜尋結果</div>
                      )}

                      {/* Back / Clear button */}
                      <button 
                        style={{ 
                          border: '1px solid var(--border-color)', 
                          width: '100%', 
                          padding: '6px', 
                          borderRadius: '4px', 
                          fontSize: '11px', 
                          cursor: 'pointer', 
                          marginTop: '12px', 
                          background: 'transparent',
                          color: 'var(--text-muted)',
                          fontFamily: 'var(--font-heading)',
                          textAlign: 'center'
                        }} 
                        onClick={() => { 
                          setSearchResults(null); 
                          setSearchQuery(""); 
                        }}
                      >
                        {currentLang === "en" ? "Clear Search / Return to History" : "清除搜尋 / 返回歷史"}
                      </button>
                    </>
                  )}
                </div>


                {/* Liked & Bookmarked posts widget */}
                <div className="sidebar-card" id="likes-history-card">
                  <h3 id="likes-history-title">💖 {t("likes_history")}</h3>
                  <div id="liked-posts-list" className="liked-history-list" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {displayPosts.filter(p => p.likedBy ? p.likedBy.includes(currentUser.handle) : p.likedByUser).map(post => (
                      <button key={post.id} className="liked-history-item" style={{ display: 'flex', alignItems: 'center', gap: '6px', width: '100%', background: 'transparent', border: '1px solid var(--border-color)', padding: '6px 10px', borderRadius: '6px', textAlign: 'left', cursor: 'pointer' }} onClick={() => handleBookmarkItemClick(post.id)}>
                        <Heart style={{ color: 'var(--neon-red)', fill: 'var(--neon-red)', width: '14px', height: '14px' }} />
                        <span className="liked-history-item-text" style={{ fontSize: '11px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--text-primary)' }}>{post.author}: {post.content.substring(0, 15)}...</span>
                      </button>
                    ))}
                    {displayPosts.filter(p => p.likedBy ? p.likedBy.includes(currentUser.handle) : p.likedByUser).length === 0 && (
                      <div style={{ textAlign: 'center', fontSize: '11px', color: 'var(--text-muted)', padding: '8px 0', width: '100%' }}>{currentLang === "en" ? "No liked posts" : "無點讚或收藏貼文"}</div>
                    )}
                  </div>
                </div>
              </aside>
            )}

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
            <button className="modal-close-btn" style={{ position: 'absolute', top: '12px', right: '12px', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => { setModalLoginVisible(false); setLoginMode("login"); }}>
              <X style={{ width: '18px', height: '18px' }} />
            </button>
            <div className="admin-modal-title" style={{ fontSize: '16px', fontFamily: 'var(--font-heading)', color: 'var(--text-bright)', textAlign: 'center', marginBottom: '12px' }}>
              {loginMode === "login" ? "🔐 系統登入 // SYSTEM LOGIN" : "📝 帳號註冊 // SYSTEM REGISTER"}
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '16px', textAlign: 'center' }}>
              {loginMode === "login" ? "* 請輸入註冊過的帳號與密碼進行登入" : "* 請設定您的登入帳號、密碼與暱稱"}
            </p>

            {loginMode === "register" && (
              <div className="admin-modal-input-group" style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label htmlFor="register-nickname" style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>👤 暱稱 / Nickname</label>
                <input type="text" id="register-nickname" className="admin-modal-input" style={{ width: '100%', padding: '10px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '4px', fontSize: '13px' }} placeholder="請輸入暱稱" value={registerNickname} onChange={(e) => setRegisterNickname(e.target.value)} required />
              </div>
            )}

            <div className="admin-modal-input-group" style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label htmlFor="login-email" style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>📧 帳號 (電子郵件) / Email</label>
              <input type="email" id="login-email" className="admin-modal-input" style={{ width: '100%', padding: '10px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '4px', fontSize: '13px' }} placeholder="your@email.com" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required />
            </div>

            <div className="admin-modal-input-group" style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label htmlFor="login-password" style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>🔑 密碼 / Password</label>
              <input type="password" id="login-password" className="admin-modal-input" style={{ width: '100%', padding: '10px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '4px', fontSize: '13px' }} placeholder="••••••••" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (loginMode === "login" ? submitTraditionalLogin() : handleRegister())} required />
            </div>

            <div className="admin-modal-actions" style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {loginMode === "login" ? (
                <>
                  <button id="login-btn-submit" className="admin-modal-btn admin-modal-btn-submit" style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '10px', background: 'rgba(61, 220, 151, 0.1)', border: '1px solid var(--neon-green)', color: 'var(--neon-green)', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }} onClick={submitTraditionalLogin}>登入 / Log In</button>
                  <div style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-secondary)' }}>
                    沒有帳號？ <span style={{ color: 'var(--neon-amber)', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => setLoginMode("register")}>立即註冊</span>
                  </div>
                </>
              ) : (
                <>
                  <button id="register-btn-submit" className="admin-modal-btn admin-modal-btn-submit" style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '10px', background: 'rgba(251, 191, 36, 0.1)', border: '1px solid var(--neon-amber)', color: 'var(--neon-amber)', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }} onClick={handleRegister}>註冊並登入 / Register</button>
                  <div style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-secondary)' }}>
                    已有帳號？ <span style={{ color: 'var(--neon-green)', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => setLoginMode("login")}>立即登入</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create Group Modal */}
      {showCreateGroupModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 5000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            padding: '24px',
            width: '100%',
            maxWidth: '400px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.8)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <h3 style={{ margin: 0, fontFamily: 'var(--font-heading)', color: 'var(--text-bright)', fontSize: '18px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
              👥 {currentLang === "en" ? "Create Group Chat" : "建立群組聊天"}
            </h3>
            
            {/* Group Name input */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text-bright)' }}>
                {currentLang === "en" ? "Group Name" : "群組名稱"}
              </label>
              <input
                type="text"
                style={{ padding: '8px 12px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '4px', fontSize: '13px', color: 'var(--text-bright)' }}
                placeholder={currentLang === "en" ? "Enter group name..." : "請輸入群組名稱..."}
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
              />
            </div>

            {/* Friends selection checkboxes */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text-bright)' }}>
                {currentLang === "en" ? "Select Members" : "選擇群組成員（好友）"}
              </label>
              <div style={{
                maxHeight: '180px',
                overflowY: 'auto',
                border: '1px solid var(--border-color)',
                borderRadius: '4px',
                padding: '8px',
                background: 'var(--bg-input)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                {usersList
                  .filter(u => {
                    const uUid = u.googleId || u.uid;
                    return sentRequests.some(r => r.toUid === uUid && r.status === "accepted") ||
                           receivedRequests.some(r => r.fromUid === uUid && r.status === "accepted");
                  })
                  .map(friend => {
                    const friendUid = friend.googleId || friend.uid;
                    const isChecked = selectedGroupMembers.includes(friendUid);
                    return (
                      <label key={friendUid} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: 'var(--text-secondary)' }}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            if (isChecked) {
                              setSelectedGroupMembers(prev => prev.filter(uid => uid !== friendUid));
                            } else {
                              setSelectedGroupMembers(prev => [...prev, friendUid]);
                            }
                          }}
                        />
                        <span style={{ color: 'var(--text-bright)', fontWeight: 500 }}>{friend.name}</span>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{friend.handle}</span>
                      </label>
                    );
                  })}
                {usersList.filter(u => {
                  const uUid = u.googleId || u.uid;
                  return sentRequests.some(r => r.toUid === uUid && r.status === "accepted") ||
                         receivedRequests.some(r => r.fromUid === uUid && r.status === "accepted");
                }).length === 0 && (
                  <div style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)', padding: '10px 0' }}>
                    {currentLang === "en" ? "No friends available to add." : "目前尚無好友可加入群組。"}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
              <button
                type="button"
                style={{ padding: '8px 16px', background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-muted)', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }}
                onClick={() => setShowCreateGroupModal(false)}
              >
                {currentLang === "en" ? "Cancel" : "取消"}
              </button>
              <button
                type="button"
                style={{ padding: '8px 16px', background: 'rgba(61, 220, 151, 0.1)', border: '1px solid var(--neon-green)', color: 'var(--neon-green)', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}
                onClick={handleConfirmCreateGroup}
              >
                {currentLang === "en" ? "Create" : "建立"}
              </button>
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
