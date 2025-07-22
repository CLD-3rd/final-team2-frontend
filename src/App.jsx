"use client"

import { useState } from "react"
import Header from "./components/Header"
import Sidebar from "./components/Sidebar"
import MainContent from "./components/MainContent"
import CreatePostModal from "./components/CreatePostModal"
import LoginModal from "./components/LoginModal"
import "./App.css"

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState("feed")
  const [feedCount, setFeedCount] = useState(0)
  const [feedData, setFeedData] = useState([
    {
      id: 1,
      title: "부산 해운대 여행기",
      region: "부산",
      author: "여행러버",
      date: "2025-05-10",
      images: ["https://raw.githubusercontent.com/han199805/personal/main/%ED%95%B4%EC%9A%B4%EB%8C%80.jpg"],
    },
    {
      id: 2,
      title: "대전 맛집 투어",
      region: "대전",
      author: "맛집헌터",
      date: "2025-05-10",
      images: [
        "https://raw.githubusercontent.com/han199805/personal/main/%EB%8C%80%EC%A0%84.jpg",
        "/images/daejeon-1.jpg",
        "/images/daejeon-2.jpg",
      ],
    },
    {
      id: 3,
      title: "보령 머드축제 후기",
      region: "보령",
      author: "축제매니아",
      date: "2025-05-10",
      images: ["https://raw.githubusercontent.com/han199805/personal/main/%EB%B3%B4%EB%A0%81.jpg"],
    },
    {
      id: 4,
      title: "안성 팜랜드 체험",
      region: "안성",
      author: "가족여행",
      date: "2025-05-10",
      images: ["https://raw.githubusercontent.com/han199805/personal/main/%EC%95%88%EC%84%B1.png"],
    },
    {
      id: 5,
      title: "전주 한옥마을 산책",
      region: "전주",
      author: "전통문화",
      date: "2025-05-10",
      images: ["https://raw.githubusercontent.com/han199805/personal/main/%EC%A0%84%EC%A3%BC.jpg"],
    },
    {
      id: 6,
      title: "대구 동성로 쇼핑",
      region: "대구",
      author: "쇼핑러버",
      date: "2025-05-10",
      images: ["https://raw.githubusercontent.com/han199805/personal/main/%EB%8F%99%EC%84%B1%EB%A1%9C.jpeg"],
    },
  ])

  const [userProfile, setUserProfile] = useState({
    username: "사용자님",
    profileImage: "/images/user-profile.jpg",
    badges: ["브론즈 뱃지", "랜드마크 뱃지"],
    rating: 4,
    reviewCount: 20,
    travelTags: [],
    ownedBadges: ["브론즈 뱃지", "랜드마크 뱃지", "여행 마니아", "사진 전문가"],
  })

  const handleLogin = () => {
    setIsLoggedIn(true)
    setIsLoginModalOpen(false)
  }

  const handleProfileUpdate = (updatedProfile) => {
    setUserProfile(updatedProfile)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
  }

  const openLoginModal = () => {
    setIsLoginModalOpen(true)
  }

  const closeLoginModal = () => {
    setIsLoginModalOpen(false)
  }

  const openCreateModal = () => {
    setIsCreateModalOpen(true)
  }

  const closeCreateModal = () => {
    setIsCreateModalOpen(false)
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const handlePageChange = (pageId) => {
    setCurrentPage(pageId)
  }

  const handleFeedCountChange = (count) => {
    setFeedCount(count)
  }

  // 새 포스트 생성 핸들러
  const handlePostCreate = (newPost) => {
    setFeedData((prev) => [newPost, ...prev]) // 새 포스트를 맨 앞에 추가
  }

  // 피드 삭제 핸들러
  const handleFeedDelete = (feedId) => {
    setFeedData((prev) => prev.filter((feed) => feed.id !== feedId))
  }

  // + 버튼을 보여줄 페이지들 정의
  const showFabPages = ["feed", "photo", "friend"]
  const shouldShowFab = isLoggedIn && showFabPages.includes(currentPage)

  return (
    <div className="app">
      <Header isLoggedIn={isLoggedIn} onLogin={openLoginModal} onLogout={handleLogout} userProfile={userProfile} />

      <div className="app-body">
        <Sidebar
          isLoggedIn={isLoggedIn}
          isOpen={sidebarOpen}
          onToggle={toggleSidebar}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          feedCount={feedCount}
        />
        <MainContent
          sidebarOpen={sidebarOpen}
          currentPage={currentPage}
          onFeedCountChange={handleFeedCountChange}
          isLoggedIn={isLoggedIn}
          feedData={feedData}
          onFeedDelete={handleFeedDelete}
          userProfile={userProfile}
          onProfileUpdate={handleProfileUpdate}
          onLoginModalOpen={openLoginModal}
        />
      </div>

      {shouldShowFab && (
        <button className="fab" onClick={openCreateModal}>
          +
        </button>
      )}

      {isCreateModalOpen && (
        <CreatePostModal onClose={closeCreateModal} currentPage={currentPage} onPostCreate={handlePostCreate} />
      )}

      {isLoginModalOpen && <LoginModal onClose={closeLoginModal} onLogin={handleLogin} />}
    </div>
  )
}

export default App
