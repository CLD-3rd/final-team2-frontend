"use client";

import { useState } from "react";
import useLockBodyScroll from "@/hooks/useLockBodyScroll";

const FeedDetailModal = ({ onClose, feedData, isLoggedIn, onFeedDelete }) => {
  useLockBodyScroll();
  const [newComment, setNewComment] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState("");
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [comments, setComments] = useState([
    {
      id: 1,
      author: "여행러버",
      content: "정말 멋진 곳이네요! 저도 가보고 싶어요.",
      timestamp: "2시간 전",
      likes: 3,
      isLiked: false,
      isMyComment: false,
    },
    {
      id: 2,
      author: "사진작가",
      content: "사진이 정말 잘 나왔네요. 어떤 카메라로 찍으셨나요?",
      timestamp: "1시간 전",
      likes: 1,
      isLiked: true,
      isMyComment: false,
    },
    {
      id: 3,
      author: "사용자님",
      content: "다음에 같이 가요!",
      timestamp: "30분 전",
      likes: 0,
      isLiked: false,
      isMyComment: true, // 내 댓글로 표시
    },
  ]);

  const images = feedData.images || ["/images/feed-sample.jpg"];
  const hasMultipleImages = images.length > 1;

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      const comment = {
        id: comments.length + 1,
        author: "사용자님",
        content: newComment,
        timestamp: "방금 전",
        likes: 0,
        isLiked: false,
        isMyComment: true,
      };
      setComments([...comments, comment]);
      setNewComment("");
    }
  };

  const handleCommentLike = (commentId) => {
    setComments(
      comments.map((comment) =>
        comment.id === commentId
          ? {
              ...comment,
              isLiked: !comment.isLiked,
              likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
            }
          : comment
      )
    );
  };

  const handleEditComment = (commentId, currentContent) => {
    setEditingCommentId(commentId);
    setEditingCommentText(currentContent);
  };

  const handleSaveEdit = (commentId) => {
    if (editingCommentText.trim()) {
      setComments(
        comments.map((comment) =>
          comment.id === commentId
            ? {
                ...comment,
                content: editingCommentText,
                timestamp: "방금 전 (수정됨)",
              }
            : comment
        )
      );
    }
    setEditingCommentId(null);
    setEditingCommentText("");
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditingCommentText("");
  };

  const handleDeleteComment = (commentId) => {
    if (window.confirm("댓글을 삭제하시겠습니까?")) {
      setComments(comments.filter((comment) => comment.id !== commentId));
    }
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleImageClick = (e) => {
    if (!hasMultipleImages) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const imageWidth = rect.width;

    if (clickX < imageWidth / 2) {
      handlePrevImage();
    } else {
      handleNextImage();
    }
  };

  const handleMoreMenuClick = (e) => {
    e.stopPropagation();
    setIsMoreMenuOpen(!isMoreMenuOpen);
  };

  const handleEditPost = () => {
    console.log("Edit post:", feedData.id);
    setIsMoreMenuOpen(false);
    // 여기에 수정 로직 추가
  };

  const handleDeletePost = () => {
    if (window.confirm("이 피드를 삭제하시겠습니까?")) {
      console.log("Delete post:", feedData.id);
      setIsMoreMenuOpen(false);
      onClose();
      // 실제 삭제 로직 추가
      if (onFeedDelete) {
        onFeedDelete(feedData.id);
      }
    }
  };

  // 모달 외부 클릭 시 더보기 메뉴 닫기
  const handleModalClick = () => {
    if (isMoreMenuOpen) {
      setIsMoreMenuOpen(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="feed-detail-modal" onClick={(e) => e.stopPropagation()}>
        {/* 헤더 */}
        <div className="feed-modal-header" onClick={handleModalClick}>
          <button className="back-button" onClick={onClose}>
            ← 닫기
          </button>
          <div className="header-spacer"></div>
          <div className="location-info">
            <span className="location-pin">📍</span>
            <span className="location-name">{feedData.region}</span>
            {isLoggedIn && (
              <div className="more-menu-container">
                <button
                  className="more-menu-button"
                  onClick={handleMoreMenuClick}
                >
                  ⋮
                </button>
                {isMoreMenuOpen && (
                  <div className="more-menu-dropdown">
                    <button className="more-menu-item" onClick={handleEditPost}>
                      수정
                    </button>
                    <button
                      className="more-menu-item delete"
                      onClick={handleDeletePost}
                    >
                      삭제
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 이미지 섹션 */}
        <div className="feed-modal-image-section">
          <div className="image-container">
            <img
              src={images[currentImageIndex] || "/placeholder.svg"}
              alt={feedData.title}
              className="feed-modal-image"
              onClick={handleImageClick}
              style={{ cursor: hasMultipleImages ? "pointer" : "default" }}
            />

            {/* 이미지가 2장 이상일 때만 네비게이션 표시 */}
            {hasMultipleImages && (
              <>
                <button
                  className="image-nav-btn prev-btn"
                  onClick={handlePrevImage}
                >
                  ‹
                </button>
                <button
                  className="image-nav-btn next-btn"
                  onClick={handleNextImage}
                >
                  ›
                </button>
                <div className="image-pagination">
                  {currentImageIndex + 1}/{images.length}
                </div>
                <div className="image-dots">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      className={`image-dot ${
                        index === currentImageIndex ? "active" : ""
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* 콘텐츠 섹션 */}
        <div className="feed-modal-content" onClick={handleModalClick}>
          <div className="content-header">
            <h2 className="feed-title">{feedData.title}</h2>
            <div className="feed-meta">
              <span className="author-name">{feedData.author}</span>
              <span className="separator">·</span>
              <span className="post-date">{feedData.date}</span>
            </div>
          </div>

          <div className="feed-content-body">
            <p>
              {feedData.region}에서의 멋진 하루였습니다! 날씨도 좋고 사람들도
              친절해서 정말 즐거운 여행이었어요. 특히 이곳의 전통 음식들이 정말
              맛있었고, 현지 문화를 체험할 수 있어서 좋았습니다. 다음에 또 오고
              싶은 곳이네요. 여러분도 기회가 되시면 꼭 한번 방문해보세요!
            </p>
          </div>
        </div>

        {/* 댓글 섹션 */}
        <div className="comments-section" onClick={handleModalClick}>
          <div className="comments-header">
            <h3>댓글 {comments.length}개</h3>
          </div>

          <div className="comments-list">
            {comments.map((comment) => (
              <div key={comment.id} className="comment-item">
                <div className="comment-avatar">
                  <img src="/images/user-profile.jpg" alt={comment.author} />
                </div>
                <div className="comment-content">
                  <div className="comment-header">
                    <span className="comment-author">{comment.author}</span>
                    <span className="comment-timestamp">
                      {comment.timestamp}
                    </span>
                    {comment.isMyComment && isLoggedIn && (
                      <div className="comment-actions-menu">
                        <button
                          className="comment-edit-btn"
                          onClick={() =>
                            handleEditComment(comment.id, comment.content)
                          }
                        >
                          수정
                        </button>
                        <button
                          className="comment-delete-btn"
                          onClick={() => handleDeleteComment(comment.id)}
                        >
                          삭제
                        </button>
                      </div>
                    )}
                  </div>

                  {editingCommentId === comment.id ? (
                    <div className="comment-edit-form">
                      <textarea
                        value={editingCommentText}
                        onChange={(e) => setEditingCommentText(e.target.value)}
                        className="comment-edit-textarea"
                        rows="2"
                      />
                      <div className="comment-edit-actions">
                        <button
                          className="comment-save-btn"
                          onClick={() => handleSaveEdit(comment.id)}
                        >
                          저장
                        </button>
                        <button
                          className="comment-cancel-btn"
                          onClick={handleCancelEdit}
                        >
                          취소
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="comment-text">{comment.content}</p>
                      <div className="comment-actions">
                        <button
                          className={`like-button ${
                            comment.isLiked ? "liked" : ""
                          }`}
                          onClick={() => handleCommentLike(comment.id)}
                        >
                          ❤️ {comment.likes}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          <form
            className="comment-input-section"
            onSubmit={handleCommentSubmit}
          >
            <div className="comment-input-container">
              <input
                type="text"
                placeholder="댓글을 입력하세요..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="comment-input"
              />
              <button type="submit" className="comment-submit-button">
                등록
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FeedDetailModal;
