"use client"

const FeedCard = ({ title, region, author, date, images, onClick }) => {
  const displayImage = images && images.length > 0 ? images[0] : "/placeholder.svg"

  return (
    <div className="feed-card" onClick={onClick}>
      <div className="card-image">
        <img src={displayImage || "/placeholder.svg"} alt={title} />
        {images && images.length > 1 && <div className="image-count-badge">+{images.length - 1}</div>}
      </div>
      <div className="card-content">
        <h3 className="card-title">{title}</h3>
        <p className="card-region">{region}</p>
        <div className="card-meta">
          <span className="card-author">{author}</span>
          <span className="card-date">{date}</span>
        </div>
      </div>
    </div>
  )
}

export default FeedCard
