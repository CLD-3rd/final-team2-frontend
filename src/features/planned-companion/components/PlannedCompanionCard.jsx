"use client";

const PlannedCompanionCard = ({
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
          <div className="author-avatar">
            <img
              src={image || "/images/default-user-profile.png"}
              alt={author}
              className="avatar-image"
              onError={(e) => {
                e.currentTarget.src = "/images/default-user-profile.png";
              }}
            />
          </div>
          <div className="post-info">
            <h3 className="post-title">{title}</h3>
            <p className="post-location">{location}</p>
          </div>
        </div>
        <button className="more-options">⋮</button>
      </div>

      <div className="card-image-container">
        <img
          src={image || "/images/image-not-found.png"}
          alt={title}
          className="companion-card-image"
          onError={(e) => {
            e.currentTarget.src = "/images/image-not-found.png";
          }}
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

export default PlannedCompanionCard;
