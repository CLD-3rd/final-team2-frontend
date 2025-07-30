"use client";

import InfiniteScroll from "react-infinite-scroll-component";

const InfiniteScrollWrapper = ({
  dataLength,
  next,
  hasMore,
  loaderText = "불러오는 중...",
  endText = "더 이상 데이터가 없습니다.",
  children,
}) => {
  return (
    <InfiniteScroll
      dataLength={dataLength}
      next={next}
      hasMore={hasMore}
      loader={loaderText}
      endMessage={endText}
      style={{ overflow: "visible" }} // ✅ 부모 레이아웃 깨짐 방지
    >
      {children}
    </InfiniteScroll>
  );
};

export default InfiniteScrollWrapper;
