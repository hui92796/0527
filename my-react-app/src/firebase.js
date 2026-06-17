import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// ==========================================================================
// FIREBASE CONFIGURATION
// ==========================================================================
// 💡 提示：請將您在 Firebase 專案中取得的 SDK 設定（firebaseConfig）貼到下方。
// 您可以直接在這裡替換成您的真實金鑰，或者在專案根目錄建立 `.env` 檔案設定環境變數。

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "請在這裡替換成你的真實apiKey",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "請在這裡替換成你的真實authDomain",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "請在這裡替換成你的真實projectId",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "請在這裡替換成你的真實storageBucket",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "請在這裡替換成你的真實messagingSenderId",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "請在這裡替換成你的真實appId"
};

// 檢查是否已經設定了真實的 Firebase 金鑰（相容直接修改與環境變數）
export const isFirebaseSetup = !!(
  firebaseConfig.apiKey &&
  firebaseConfig.apiKey !== "" &&
  !firebaseConfig.apiKey.includes("請在這裡替換") &&
  !firebaseConfig.apiKey.includes("YOUR_API_KEY")
);

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and export it
export const db = getFirestore(app);
