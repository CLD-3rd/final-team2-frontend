"use client";

import { useState, useEffect } from "react";
import { useLockBodyScroll, getLocationLabel, FallbackImage } from "@/shared";
import {
  getTravelPostDetail,
  deleteTravelPost,
  UpdatePlannedModal,
} from "@/features/travel-post";
import toast from "react-hot-toast";

const PostDetailModal = ({ currentUser, postId, onClose, onUpdateSuccess }) => {
  const [postData, setPostData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const isLoggedIn = !!currentUser;

  useLockBodyScroll();

  const fetchPostDetail = async () => {
    try {
      const data = await getTravelPostDetail("BEFORE", postId);
      setPostData(data);
      setIsOwner(isLoggedIn && data.author.id === currentUser.id);
    } catch (err) {
      toast.error("모집글 정보를 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPostDetail();
  }, [postId]);

  if (loading)
    return (
      <div className="modal-overlay">
        <p>로딩 중...</p>
      </div>
    );
  if (!postData)
    return (
      <div className="modal-overlay">
        <p>데이터 없음</p>
      </div>
    );

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
    console.log("Edit post:", postData.id);
    setIsMoreMenuOpen(false);
    setIsEditModalOpen(true); // PostPostModal 열기
  };

  const handleDeletePost = async () => {
    if (window.confirm("이 모집글을 삭제하시겠습니까?")) {
      try {
        await deleteTravelPost(postData.id);
        toast.success("모집글이 삭제되었습니다.");
        setIsMoreMenuOpen(false);

        onClose(); // 상세 모달 닫기
        onUpdateSuccess?.();
      } catch (error) {
        toast.error("모집글 삭제에 실패했습니다.\n다시 시도해주세요.");
      }
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
              {getLocationLabel(postData.location)}
            </span>
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
              src={postData.imageUrl}
              alt={postData.title}
              className="feed-modal-image"
            />
          </div>
        </div>

        {/* 콘텐츠 섹션 */}
        <div className="feed-modal-content" onClick={handleModalClick}>
          <div className="content-header">
            <h2 className="feed-title">{postData.title}</h2>
            <div className="feed-meta">
              <span className="author-name">{postData.author.nickname}</span>
              <span className="separator">·</span>
              <span className="feed-date">{postData.date}</span>
            </div>
          </div>

          <div className="feed-content-body">
            <p>{postData.content}</p>
          </div>
        </div>

        {/* ✅ Post 수정 모달 */}
        {isEditModalOpen && (
          <UpdatePlannedModal
            onClose={() => setIsEditModalOpen(false)}
            mode="edit"
            initialData={postData}
            onSuccess={() => {
              onUpdateSuccess?.(); // ✅ PostPage 갱신
              onClose(); // 상세 모달 닫기
            }}
          />
        )}
      </div>
    </div>
  );
};

export default PostDetailModal;
