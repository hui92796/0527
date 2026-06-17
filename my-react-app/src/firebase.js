import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// ==========================================================================
// FIREBASE CONFIGURATION
// ==========================================================================
// 💡 提示：請將您在 Firebase 專案中取得的 SDK 設定（firebaseConfig）貼到下方。
// 您可以直接在這裡替換成您的真實金鑰，或者在專案根目錄建立 `.env` 檔案設定環境變數。

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "YOUR_API_KEY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "YOUR_AUTH_DOMAIN",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "YOUR_STORAGE_BUCKET",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "YOUR_MESSAGING_SENDER_ID",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and export it
export const db = getFirestore(app);
