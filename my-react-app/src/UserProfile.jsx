import React, { useState, useEffect, useMemo } from 'react';
import { Frown } from 'lucide-react';
import { doc, setDoc, query, collection, where, getDocs, writeBatch } from "firebase/firestore";

export default function UserProfile({
  profileViewUid,
  currentUser,
  setCurrentUser,
  posts,
  usersList,
  renderPostCard,
  isFirebaseSetup,
  db,
  showToast,
  currentLang,
  t,
  getLatestUserAvatar,
  getPostAuthorUid
}) {
  const [editBio, setEditBio] = useState("");
  const [editUsername, setEditUsername] = useState("");
  const [isSaveSuccess, setIsSaveSuccess] = useState(false);

  const profileUser = useMemo(() => {
    const myUid = currentUser.googleId || currentUser.uid;
    if (profileViewUid === myUid || !profileViewUid) {
      return currentUser;
    }
    
    // 1. Try finding in usersList
    const foundUser = usersList.find(u => 
      (u.googleId || u.uid) === profileViewUid || 
      u.handle === profileViewUid || 
      u.name === profileViewUid
    );
    if (foundUser) return foundUser;
    
    // 2. Try finding in posts (including DEFAULT_POSTS) to build profile details
    const foundPost = posts.find(p => 
      p.uid === profileViewUid || 
      p.handle === profileViewUid || 
      p.author === profileViewUid
    );
    if (foundPost) {
      return {
        uid: foundPost.uid || foundPost.handle || foundPost.author,
        name: foundPost.author,
        handle: foundPost.handle,
        avatarLetter: foundPost.avatarLetter || foundPost.author.substring(0, 2).toUpperCase(),
        avatarBg: foundPost.avatarBg || null,
        avatarUrl: foundPost.avatarUrl || null,
        bio: "",
        username: foundPost.handle ? foundPost.handle.replace("@", "") : ""
      };
    }

    // 3. Try finding in comments of all posts to build profile details
    for (const p of posts) {
      if (p.comments) {
        const foundComm = p.comments.find(c => 
          c.uid === profileViewUid || 
          c.authorHandle === profileViewUid || 
          c.author === profileViewUid
        );
        if (foundComm) {
          const latestProfile = getLatestUserAvatar(foundComm.authorHandle, foundComm.author);
          return {
            uid: foundComm.uid || foundComm.authorHandle || foundComm.author,
            name: latestProfile ? latestProfile.name : foundComm.author,
            handle: foundComm.authorHandle || `@${foundComm.author}`,
            avatarLetter: latestProfile ? latestProfile.avatarLetter : foundComm.author.substring(0, 2).toUpperCase(),
            avatarBg: latestProfile ? latestProfile.avatarBg : null,
            avatarUrl: latestProfile ? latestProfile.avatarUrl : null,
            bio: "",
            username: foundComm.authorHandle ? foundComm.authorHandle.replace("@", "") : foundComm.author
          };
        }
      }
    }
    
    return {
      name: "未知使用者",
      handle: "@unknown",
      avatarLetter: "?",
      avatarBg: "var(--bg-elevated)",
      bio: "",
      username: ""
    };
  }, [profileViewUid, currentUser, usersList, posts, getLatestUserAvatar]);

  useEffect(() => {
    const myUid = currentUser.googleId || currentUser.uid;
    if (profileViewUid === myUid || !profileViewUid) {
      setEditBio(currentUser.bio || "");
      setEditUsername(currentUser.username || currentUser.handle?.replace("@", "") || "");
    }
  }, [profileViewUid, currentUser]);

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
            backgroundImage: profileUser.avatarUrl ? `url(${profileUser.avatarUrl})` : 'none',
            backgroundColor: profileUser.avatarUrl ? 'transparent' : (profileUser.avatarBg || 'var(--bg-elevated)'),
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#fff',
            border: '2px solid var(--neon-cyan)',
            boxShadow: '0 0 10px rgba(0, 243, 255, 0.4)',
            flexShrink: 0
          }}>
            {!profileUser.avatarUrl && (profileUser.avatarLetter || profileUser.name.substring(0, 2).toUpperCase())}
          </div>

          <div style={{ flex: 1, minWidth: '200px' }}>
            <h2 style={{ fontSize: '22px', fontFamily: 'var(--font-heading)', color: 'var(--text-bright)', margin: '0 0 4px 0' }}>
              {profileUser.name}
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--neon-cyan)', fontFamily: 'var(--font-heading)', fontWeight: 600, letterSpacing: '1px', margin: '0 0 8px 0' }}>
              {profileUser.handle || `@${profileUser.username}`}
            </p>
            
            {/* Bio display */}
            {profileViewUid !== (currentUser.googleId || currentUser.uid) && (
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0, padding: '10px', background: 'var(--bg-input)', borderRadius: '6px', borderLeft: '3px solid var(--neon-cyan)' }}>
                {profileUser.bio || (currentLang === "en" ? "No introduction yet." : "這個人很懶，還沒有寫自我介紹。")}
              </p>
            )}
          </div>
        </div>

        {/* Edit Form for self profile */}
        {profileViewUid === (currentUser.googleId || currentUser.uid) && (
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
        📑 {profileUser.name} {currentLang === "en" ? "Posts" : "的歷史貼文"}
      </h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {posts.filter(p => p.uid === profileViewUid).length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 10px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-muted)' }}>
            <Frown style={{ width: '38px', height: '38px', marginBottom: '12px', opacity: 0.5 }} />
            <p>{currentLang === "en" ? "No posts found." : "目前尚無任何貼文"}</p>
          </div>
        ) : (
          posts
            .filter(p => p.uid === profileViewUid)
            .map((post) => renderPostCard(post))
        )}
      </div>
    </div>
  );
}
