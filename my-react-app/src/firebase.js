import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// ==========================================================================
// FIREBASE CONFIGURATION
// ==========================================================================
// 💡 提示：請將您在 Firebase 專案中取得的 SDK 設定（firebaseConfig）貼到下方。
// 您可以直接在這裡替換成您的真實金鑰，或者在專案根目錄建立 `.env` 檔案設定環境變數。

const firebaseConfig = {
  apiKey: "請在這裡替換成你的真實apiKey",
  authDomain: "請在這裡替換成你的真實authDomain",
  projectId: "請在這裡替換成你的真實projectId",
  storageBucket: "請在這裡替換成你的真實storageBucket",
  messagingSenderId: "請在這裡替換成你的真實messagingSenderId",
  appId: "請在這裡替換成你的真實appId"
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
