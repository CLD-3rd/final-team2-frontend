"use client";

import React from "react";

const FallbackImage = ({
  src,
  alt,
  fallback = "/images/image-not-found.png",
  className = "",
  ...props
}) => {
  const handleError = (e) => {
    e.currentTarget.src = fallback;
  };

  return (
    <img
      src={src || fallback}
      alt={alt}
      onError={handleError}
      className={className}
      {...props}
    />
  );
};

export default FallbackImage;
