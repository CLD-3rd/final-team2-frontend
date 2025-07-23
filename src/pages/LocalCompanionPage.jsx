"use client";

import { useState } from "react";
import FilterBar from "@/components/Feed/FilterBar";

const LocalCompanionPage = () => {
  const [filters, setFilters] = useState({
    author: "",
    title: "",
    region: "",
  });

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  // Sample data for local companion posts
  const localCompanionPosts = [
    {
      id: 1,
      title: "25년 제주 여행 가실 분 여자분들",
      rating: 4,
      author: "사용자A",
      profileImage: "/placeholder.svg?height=40&width=40",
      tags: ["느긋해요", "술 좋아해요", "의상차이에요"],
    },
    {
      id: 2,
      title: "25년 제주 여행 가실 분 여자분들",
      rating: 5,
      author: "사용자B",
      profileImage: "/placeholder.svg?height=40&width=40",
      tags: ["느긋해요", "술 좋아해요", "의상차이에요"],
    },
    {
      id: 3,
      title: "25년 제주 여행 가실 분 여자분들",
      rating: 5,
      author: "사용자C",
      profileImage: "/placeholder.svg?height=40&width=40",
      tags: ["느긋해요", "술 좋아해요", "의상차이에요"],
    },
    {
      id: 4,
      title: "25년 제주 여행 가실 분 여자분들",
      rating: 5,
      author: "사용자D",
      profileImage: "/placeholder.svg?height=40&width=40",
      tags: ["느긋해요", "술 좋아해요", "의상차이에요"],
    },
  ];

  return (
    <div className="local-companion-page">
      <FilterBar filters={filters} onFilterChange={handleFilterChange} />
      <div className="local-companion-grid">
        {localCompanionPosts.map((post) => (
          <LocalCompanionCard key={post.id} {...post} />
        ))}
      </div>
    </div>
  );
};

const LocalCompanionCard = ({ title, rating, author, profileImage, tags }) => {
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} className={`star ${index < rating ? "filled" : ""}`}>
        ★
      </span>
    ));
  };

  return (
    <div className="local-companion-card">
      <div className="card-rating">{renderStars(rating)}</div>

      <div className="card-main-content">
        <h3 className="card-title">{title}</h3>

        <div className="card-author-info">
          <img
            src={profileImage || "/placeholder.svg"}
            alt={author}
            className="author-profile-image"
          />
          <span className="author-name">{author}</span>
        </div>
      </div>

      <div className="card-tags">
        {tags.map((tag, index) => (
          <span key={index} className="tag">
            {tag} ×
          </span>
        ))}
      </div>
    </div>
  );
};

export default LocalCompanionPage;
