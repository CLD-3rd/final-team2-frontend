"use client";

import { useState, useEffect, useMemo } from "react";
import {
  useLockBodyScroll,
  getLocationLabel,
  FallbackImage,
  ProfileImage,
} from "@/shared";
import {
  getFeedDetail,
  deleteFeed,
  getComments,
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
  // const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState("");
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  // const [hasMultipleImages, setHasMultipleImages] = useState(false);
  const isLoggedIn = !!currentUser;
  const isOwner = useMemo(() => {
    return isLoggedIn && feedData?.author.userId === currentUser?.userId;
  }, [isLoggedIn, feedData, currentUser]);

  useLockBodyScroll();

  const fetchFeedDetail = async () => {
    try {
      const data = await getFeedDetail(feedId);
      // setHasMultipleImages(data.imageUrls.length > 1);
      setFeedData(data);
      setComments(data.comments);
    } catch (error) {
      toast.error(error.message || "피드 정보를 불러오지 못했습니다.");
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
      } catch (error) {}
    }
  };

  // 여러 이미지 처리 핸들러
  // const handlePrevImage = () => {
  //   setCurrentImageIndex((prev) =>
  //     prev === 0 ? feedData.imageUrls.length - 1 : prev - 1
  //   );
  // };

  // const handleNextImage = () => {
  //   setCurrentImageIndex((prev) =>
  //     prev === feedData.imageUrls.length - 1 ? 0 : prev + 1
  //   );
  // };

  // const handleImageClick = (e) => {
  //   if (!hasMultipleImages) return;

  //   const rect = e.currentTarget.getBoundingClientRect();
  //   const clickX = e.clientX - rect.left;
  //   const imageWidth = rect.width;

  //   if (clickX < imageWidth / 2) {
  //     handlePrevImage();
  //   } else {
  //     handleNextImage();
  //   }
  // };

  // 댓글 관련 핸들러
  // 댓글 등록
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      // ✅ API 호출
      await createComment(feedId, {
        content: newComment,
      });
      toast.success("댓글이 등록되었습니다.");
      setNewComment(""); // 입력값 초기화
      // 댓글 등록 후 최신 댓글 목록 불러오기
      const updatedComments = await getComments(feedId);
      setComments(updatedComments); // 댓글 목록 갱신
    } catch (error) {}
  };

  // 댓글 수정
  const handleEditComment = (commentId, currentContent) => {
    setEditingCommentId(commentId);
    setEditingCommentText(currentContent);
  };

  const handleSaveEdit = async (commentId) => {
    if (!editingCommentText.trim()) return;

    try {
      // ✅ API 호출
      await updateComment(feedId, commentId, { content: editingCommentText });
      toast.success("댓글이 수정되었습니다.");
      setEditingCommentId(null);
      setEditingCommentText("");
      // 댓글 수정 후 최신 댓글 목록 불러오기
      const updatedComments = await getComments(feedId);
      setComments(updatedComments); // 댓글 목록 갱신
    } catch (error) {
      toast.error(error.message || "댓글 수정에 실패했습니다.");
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
      toast.success("댓글이 삭제되었습니다.");
      // 댓글 삭제 후 최신 댓글 목록 불러오기
      const updatedComments = await getComments(feedId);
      setComments(updatedComments); // 댓글 목록 갱신
    } catch (error) {
      toast.error(error.message || "댓글 삭제에 실패했습니다.");
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
            <span className="location-name">
              {getLocationLabel(feedData.location)}
            </span>
            {/* 더보기 메뉴 */}
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
              src={feedData.imageUrl}
              alt={feedData.title}
              className="feed-modal-image"
              // onClick={handleImageClick}
              // style={{ cursor: hasMultipleImages ? "pointer" : "default" }}
            />

            {/* 이미지가 2장 이상일 때만 네비게이션 표시 */}
            {/* {hasMultipleImages && (
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
            )} */}
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
                    src={comment.profileImgUrl}
                    alt={comment.nickname}
                  />
                </div>
                <div className="comment-content">
                  <div className="comment-header">
                    <span className="comment-author">{comment.nickname}</span>
                    <span className="comment-timestamp">
                      {comment.timestamp}
                    </span>
                    {/* 댓글 수정/삭제 버튼 */}
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
          {isLoggedIn && (
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
          )}
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