"use client"

const Header = ({ isLoggedIn, onLogin, onLogout, userProfile }) => {
  return (
    <header className="header bg-white">
      <div className="header-left">
        <div className="logo">
          <img 
  src="https://raw.githubusercontent.com/han199805/personal/main/logo1.png" 
  alt="GotEEgo Logo" 
  className="header-logo-image" 
/>
          <span className="logo-text">GotEEgo</span>
        </div>
      </div>

      <div className="header-right">
        {isLoggedIn ? (
          <div className="user-menu">
            <img src={userProfile?.profileImage || "/images/user-profile.jpg"} alt="프로필" className="profile-image" />
            <span>{userProfile?.username || "사용자님"}</span>
            <button onClick={onLogout} className="auth-button font-medium">
              로그아웃
            </button>
          </div>
        ) : (
          <button onClick={onLogin} className="auth-button font-medium text-gray-950 bg-neutral-300">
            로그인/회원가입
          </button>
        )}
      </div>
    </header>
  )
}

export default Header
