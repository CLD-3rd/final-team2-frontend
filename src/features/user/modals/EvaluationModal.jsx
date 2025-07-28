"use client";

import { useState } from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { submitReview } from "@/features/user/api/reviewApi";

const EvaluationModal = ({ participant, onClose, onSubmit, onReport }) => {
  const [rating, setRating] = useState(0); // 별점 (0 ~ 5)
  const [hover, setHover] = useState(null);
  const [comment, setComment] = useState("");

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await submitReview({
      post_id: participant.postId,   // 여행 ID
      reviewerId: currentUserId,     // 로그인한 사용자 ID
      revieweeId: participant.user_id, // 평가 대상자 ID
      overallRating: rating,
      comment: comment,
    });
    onSubmit({ rating, comment, participant }); // 기존 콜백 호출
  } catch (error) {
    alert("리뷰 제출 실패");
  }
};

  

  // 별 렌더링
const renderStars = () => {
  const stars = [];
  const displayRating = hover || rating;

  for (let i = 1; i <= 5; i++) {
    const isFull = displayRating >= i;
    const isHalf = displayRating >= i - 0.5 && displayRating < i;

    stars.push(
      <span
        key={i}
        style={{
          position: "relative",
          display: "inline-block",
          width: "32px",
          height: "32px",
          cursor: "pointer",
          margin: "0 2px",
        }}
        onMouseMove={(e) => {
          const { left, width } = e.currentTarget.getBoundingClientRect();
          const mouseX = e.clientX - left;
          if (mouseX < width / 2) setHover(i - 0.5);
          else setHover(i);
        }}
        onMouseLeave={() => setHover(null)}
        onClick={(e) => {
          const { left, width } = e.currentTarget.getBoundingClientRect();
          const mouseX = e.clientX - left;
          if (mouseX < width / 2) setRating(i - 0.5);
          else setRating(i);
        }}
      >
        {isFull ? (
          <FaStar color="#ffc107" style={{ filter: "drop-shadow(0 0 1px black)", fontSize: "32px" }} />
        ) : isHalf ? (
          <FaStarHalfAlt color="#ffc107" style={{ filter: "drop-shadow(0 0 1px black)", fontSize: "32px" }} />
        ) : (
          <FaRegStar color="#ccc" style={{ filter: "drop-shadow(0 0 1px black)", fontSize: "32px" }} />
        )}
      </span>
    );
  }

  return stars;
};



  return (
    <div
      className="modal-overlay"
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        className="modal-content"
        style={{
          backgroundColor: "#fff",
          padding: "30px",
          borderRadius: "12px",
          width: "500px",
          maxWidth: "90%",
          boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
          position: "relative",
        }}
      >
        {/* 닫기 버튼 */}
        <button
          className="modal-close"
          onClick={onClose}
          style={{
            position: "absolute",
            top: "15px",
            right: "15px",
            fontSize: "18px",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          ✕
        </button>

        <h2 className="modal-title" style={{ marginBottom: "20px", fontSize: "20px" }}>
          {participant.name} 평가하기
        </h2>

        {/* 별점 */}
        <div className="stars-container" style={{ textAlign: "center", marginBottom: "15px" }}>
          {renderStars()}
        </div>

        <p className="rating-text" style={{ textAlign: "center", marginBottom: "10px" }}>
          별점: {rating}점
        </p>

        {/* 코멘트 */}
        <textarea
          placeholder="한 줄 코멘트를 작성해주세요."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows="3"
          className="comment-input"
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            resize: "none",
            marginBottom: "20px",
          }}
        />

        {/* 버튼 */}
        <div className="modal-actions" style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}>
          
          <button
            className="btn-cancel"
            onClick={onClose}
            style={{
              backgroundColor: "#6c757d",
              color: "#fff",
              padding: "8px 16px",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
            }}
          >
            취소
          </button>
          <button
            className="btn-submit"
            onClick={handleSubmit}
            style={{
              backgroundColor: "#28a745",
              color: "#fff",
              padding: "8px 16px",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
            }}
          >
            제출
          </button>
        </div>
      </div>
    </div>
  );
};

export default EvaluationModal;

