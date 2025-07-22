"use client";

import { useState } from "react";
import FilterBar from "../components/Feed/FilterBar";

const PhotoCompanionPage = ({ isLoggedIn, onLoginModalOpen }) => {
  const [filters, setFilters] = useState({
    author: "",
    title: "",
    region: "",
  });

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  // Sample data for 사전 동행 모집 posts
  const companionPosts = [
    {
      id: 1,
      title: "프랑스 1박2일 가성비",
      location: "김해시",
      dateRange: "25.7.18~25.7.19",
      description:
        "프랑스 당일치기 여행갑니다\n일정 : 인천공항 >> 프랑스 공항 >> 인천공항",
      author: "A",
      participants: 2,
      maxParticipants: 4,
      image: "/placeholder.svg?height=200&width=300&text=여행+이미지",
    },
    {
      id: 2,
      title: "프랑스 1박2일 가성비",
      location: "김해시",
      dateRange: "25.7.18~25.7.19",
      description:
        "프랑스 당일치기 여행갑니다\n일정 : 인천공항 >> 프랑스 공항 >> 인천공항",
      author: "A",
      participants: 1,
      maxParticipants: 3,
      image: "/placeholder.svg?height=200&width=300&text=여행+이미지",
    },
    {
      id: 3,
      title: "프랑스 1박2일 가성비",
      location: "김해시",
      dateRange: "25.7.18~25.7.19",
      description:
        "프랑스 당일치기 여행갑니다\n일정 : 인천공항 >> 프랑스 공항 >> 인천공항",
      author: "A",
      participants: 3,
      maxParticipants: 5,
      image: "/placeholder.svg?height=200&width=300&text=여행+이미지",
    },
    {
      id: 4,
      title: "프랑스 1박2일 가성비",
      location: "김해시",
      dateRange: "25.7.18~25.7.19",
      description:
        "프랑스 당일치기 여행갑니다\n일정 : 인천공항 >> 프랑스 공항 >> 인천공항",
      author: "A",
      participants: 0,
      maxParticipants: 2,
      image: "/placeholder.svg?height=200&width=300&text=여행+이미지",
    },
  ];

  return (
    <div className="photo-companion-page">
      <FilterBar filters={filters} onFilterChange={handleFilterChange} />
      <div className="companion-grid">
        {companionPosts.map((post) => (
          <CompanionCard
            key={post.id}
            {...post}
            isLoggedIn={isLoggedIn}
            onLoginModalOpen={onLoginModalOpen}
          />
        ))}
      </div>
    </div>
  );
};

const CompanionCard = ({
  title,
  location,
  dateRange,
  description,
  author,
  participants,
  maxParticipants,
  image,
  isLoggedIn,
  onLoginModalOpen,
}) => {
  const handleJoinClick = () => {
    if (!isLoggedIn) {
      onLoginModalOpen();
      return;
    }

    // 로그인된 유저의 경우 - 실제 신청 로직은 나중에 구현
    console.log("같이 갈래요 신청!");
  };

  return (
    <div className="companion-card">
      <div className="card-header">
        <div className="author-info">
          <div className="author-avatar">{author}</div>
          <div className="post-info">
            <h3 className="post-title">{title}</h3>
            <p className="post-location">{location}</p>
          </div>
        </div>
        <button className="more-options">⋮</button>
      </div>

      <div className="card-image-container">
        <img
          src={image || "/placeholder.svg"}
          alt={title}
          className="companion-card-image"
        />
      </div>

      <div className="card-content">
        <div className="date-range">{dateRange}</div>
        <div className="description">
          {description.split("\n").map((line, index) => (
            <div key={index}>{line}</div>
          ))}
        </div>

        <div className="card-actions">
          <button className="participants-count-btn">
            {participants}/{maxParticipants}
          </button>
          <button className="join-btn" onClick={handleJoinClick}>
            같이 갈래요
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhotoCompanionPage;
