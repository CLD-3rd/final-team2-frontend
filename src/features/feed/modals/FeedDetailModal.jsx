"use client";

import { useState, useEffect } from "react";
import { useLockBodyScroll, FallbackImage, ProfileImage } from "@/shared";
import {
  getFeedDetail,
  deleteFeed,
  createComment,
  updateComment,
  deleteComment,
  UpdateFeedModal,
} from "@/features/feed";
import toast from "react-hot-toast";

const FeedDetailModal = ({
  currentUser,
  feedId,
  onClose,
  onUpdateSuccess, // ✅ FeedPage에서 갱신할 콜백 추가
}) => {
  const [feedData, setFeedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState("");
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [hasMultipleImages, setHasMultipleImages] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const isLoggedIn = !!currentUser;

  useLockBodyScroll();

  const fetchFeedDetail = async () => {
    try {
      const data = await getFeedDetail(feedId);
      setHasMultipleImages(data.imageUrls.length > 1);
      setFeedData(data);
      setIsOwner(isLoggedIn && data.author.id === currentUser.id);
      setComments(data.comments || []);
    } catch (err) {
      toast.error("피드 정보를 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedDetail();
  }, [feedId]);

  // ✅ 로딩 처리
  if (loading) {
    return (
      <div className="modal-overlay">
        <div className="feed-detail-modal">
          <p>로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!feedData) {
    return (
      <div className="modal-overlay">
        <div className="feed-detail-modal">
          <p>{"데이터가 없습니다."}</p>
          <button onClick={onClose}>닫기</button>
        </div>
      </div>
    );
  }

  // 더 보기 메뉴 관련 핸들러 (+ 수정, 삭제)
  const handleMoreMenuClick = (e) => {
    e.stopPropagation();
    setIsMoreMenuOpen(!isMoreMenuOpen);
  };

  // 모달 외부 클릭 시 더보기 메뉴 닫기
  const handleModalClick = () => {
    if (isMoreMenuOpen) {
      setIsMoreMenuOpen(false);
    }
  };

  const handleEditPost = () => {
    console.log("Edit post:", feedData.id);
    setIsMoreMenuOpen(false);
    setIsEditModalOpen(true); // FeedPostModal 열기
  };

  const handleDeletePost = async () => {
    if (window.confirm("이 피드를 삭제하시겠습니까?")) {
      try {
        await deleteFeed(feedData.id);
        toast.success("피드가 삭제되었습니다.");
        setIsMoreMenuOpen(false);

        onClose(); // 상세 모달 닫기
        onUpdateSuccess?.(); // ✅ FeedPage 새로고침 트리거
      } catch (error) {
        toast.error("피드 삭제에 실패했습니다. 다시 시도해주세요.");
      }
    }
  };

  // 여러 이미지 처리 핸들러
  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? feedData.imageUrls.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === feedData.imageUrls.length - 1 ? 0 : prev + 1
    );
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

  // 댓글 관련 핸들러
  // 댓글 등록 시 UI 갱신
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const newCommentData = await createComment(feedId, newComment);
      setComments((prev) => [
        ...prev,
        {
          commentId: newCommentData.id,
          author: newCommentData.author,
          content: newCommentData.content,
          createdAt: newCommentData.createdAt,
          isMyComment: true,
        },
      ]);
      setNewComment("");
    } catch (error) {
      toast.error("댓글 등록에 실패했습니다.");
    }
  };

  //댓글 수정
  const handleEditComment = (commentId, currentContent) => {
    setEditingCommentId(commentId);
    setEditingCommentText(currentContent);
  };

  const handleSaveEdit = async (commentId) => {
    if (!editingCommentText.trim()) return;

    try {
      // ✅ API 호출
      await updateComment(feedId, commentId, editingCommentText);

      // ✅ UI 갱신
      setComments((prev) =>
        prev.map((comment) =>
          comment.commentId === commentId
            ? { ...comment, content: editingCommentText }
            : comment
        )
      );

      setEditingCommentId(null);
      setEditingCommentText("");
    } catch (error) {
      toast.error("댓글 수정에 실패했습니다.");
    }
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditingCommentText("");
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("댓글을 삭제하시겠습니까?")) return;

    try {
      // ✅ API 호출
      await deleteComment(feedId, commentId);

      // ✅ UI 갱신
      setComments((prev) =>
        prev.filter((comment) => comment.commentId !== commentId)
      );
      toast.success("댓글이 삭제되었습니다.");
    } catch (error) {
      toast.error("댓글 삭제에 실패했습니다.");
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
            <span className="location-name">{feedData.location}</span>
            {isOwner && (
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
            <FallbackImage
              src={feedData.imageUrls[currentImageIndex]}
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
                  {currentImageIndex + 1}/{feedData.imageUrls.length}
                </div>
                <div className="image-dots">
                  {feedData.imageUrls.map((_, index) => (
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
              <span className="author-name">{feedData.author.nickname}</span>
              <span className="separator">·</span>
              <span className="post-date">{feedData.date}</span>
            </div>
          </div>

          <div className="feed-content-body">
            <p>{feedData.content}</p>
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
                  <ProfileImage
                    src={comment.profileImage}
                    alt={comment.author}
                  />
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
                      <div className="comment-actions"></div>
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
        {/* ✅ Feed 수정 모달 */}
        {isEditModalOpen && (
          <UpdateFeedModal
            onClose={() => setIsEditModalOpen(false)}
            mode="edit"
            initialData={feedData}
            onSuccess={() => {
              onUpdateSuccess?.(); // ✅ FeedPage 갱신
              onClose(); // 상세 모달 닫기
            }}
          />
        )}
      </div>
    </div>
  );
};

export default FeedDetailModal;
