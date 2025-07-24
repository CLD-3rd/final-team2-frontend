"use client";

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
            src={profileImage || "/images/default-user-profile.png"}
            alt={author}
            className="profile-image"
            onError={(e) => {
              e.currentTarget.src = "/images/default-user-profile.png";
            }}
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

export default LocalCompanionCard;
