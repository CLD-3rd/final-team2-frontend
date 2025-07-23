"use client";

import React from "react";
import FallbackImage from "./FallbackImage";

const ProfileImage = ({
  src,
  alt = "프로필 이미지",
  className = "",
  ...props
}) => {
  return (
    <FallbackImage
      src={src}
      alt={alt}
      fallback="/images/default-user-profile.png"
      className={className}
      {...props}
    />
  );
};

export default ProfileImage;
