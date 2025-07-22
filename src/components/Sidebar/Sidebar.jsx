"use client";

const Sidebar = ({
  isLoggedIn,
  isOpen,
  onToggle,
  currentPage,
  onPageChange,
  feedCount = 0,
}) => {
  // Menu for non-logged-in users (version4 structure) - 고객센터 제거
  const guestMenuItems = [
    { id: "feed", label: "피드", count: feedCount, icon: "📋" },
    { id: "photo", label: "사전 동행 모집", icon: "📋" },
    { id: "friend", label: "현지 동행 모집", icon: "▷" },
  ];

  // Menu sections for logged-in users
  const loggedInMenuSections = [
    {
      items: [
        { id: "feed", label: "피드", count: feedCount, icon: "📋" },
        { id: "photo", label: "사전 동행 모집", icon: "📋" },
        { id: "friend", label: "현지 동행 모집", icon: "▷" },
      ],
    },
    {
      title: "소셜",
      items: [{ id: "chat", label: "채팅", icon: "📁" }],
    },
    {
      title: "My",
      items: [
        { id: "profile", label: "프로필 관리", icon: "📁" },
        { id: "schedule", label: "일정 관리", icon: "🗃️" },
      ],
    },
    {
      items: [{ id: "support", label: "고객센터", icon: "📁" }],
    },
  ];

  const handleItemClick = (itemId) => {
    onPageChange(itemId);
  };

  return (
    <aside
      className={`sidebar ${isOpen ? "sidebar-expanded" : "sidebar-collapsed"}`}
    >
      <nav className="sidebar-nav">
        {/* 햄버거 버튼을 nav-item과 같은 스타일로 */}
        <div className="nav-item" onClick={onToggle}>
          <span className="nav-icon">☰</span>
        </div>

        {isLoggedIn
          ? // Logged-in user menu with sections
            loggedInMenuSections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="nav-section">
                {section.title && isOpen && (
                  <div className="nav-section-title">{section.title}</div>
                )}
                {section.items.map((item) => (
                  <div
                    key={item.id}
                    className={`nav-item ${
                      currentPage === item.id ? "active" : ""
                    }`}
                    onClick={() => handleItemClick(item.id)}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    {isOpen && (
                      <>
                        <span className="nav-label">{item.label}</span>
                        {item.count && (
                          <span className="nav-count">{item.count}</span>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            ))
          : // Guest user menu (simple list)
            guestMenuItems.map((item) => (
              <div
                key={item.id}
                className={`nav-item ${
                  currentPage === item.id ? "active" : ""
                }`}
                onClick={() => handleItemClick(item.id)}
              >
                <span className="nav-icon">{item.icon}</span>
                {isOpen && (
                  <>
                    <span className="nav-label">{item.label}</span>
                    {item.count && (
                      <span className="nav-count">{item.count}</span>
                    )}
                  </>
                )}
              </div>
            ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
