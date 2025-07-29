"use client";

import { useState, useEffect, useRef } from "react";

const FilterBar = ({ filters, onFilterChange }) => {
  const [searchCriteria, setSearchCriteria] = useState("title");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [activeSort, setActiveSort] = useState(filters.sort || "recent");

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const searchOptions = [
    { value: "title", label: "제목" },
    { value: "author", label: "글쓴이" },
    { value: "location", label: "지역" },
  ];

  const handleSearchCriteriaChange = (criteria) => {
    setSearchCriteria(criteria);
    setIsDropdownOpen(false);
  };

  const getCurrentLabel = () => {
    const current = searchOptions.find(
      (option) => option.value === searchCriteria
    );
    return current ? current.label : "제목";
  };

  const handleSearch = () => {
    console.log(`🔍 검색 실행: "${searchValue}" in ${searchCriteria}`);
    // ✅ 검색 시 정렬을 최근 등록 순으로 강제 설정
    const updatedFilters = {
      ...filters, // 기존 정렬 상태 유지
      author: "", // 초기화
      title: "",
      location: "",
      [searchCriteria]: searchValue,
    };
    onFilterChange(updatedFilters);
  };

  const handleSortChange = (sortKey) => {
    setActiveSort(sortKey);
    const updatedFilters = {
      ...filters,
      sort: sortKey,
    };
    onFilterChange(updatedFilters);
  };

  return (
    <div className="filter-bar">
      <div className="filter-left"></div>

      <div className="filter-right">
        <div className="search-container">
          {/* 검색 기준 선택 */}
          <div className="search-criteria-dropdown" ref={dropdownRef}>
            <button
              type="button"
              className="search-criteria-button"
              onClick={(e) => {
                e.preventDefault();
                setIsDropdownOpen((prev) => {
                  const next = !prev;
                  return next;
                });
              }}
            >
              {getCurrentLabel()} ▼
            </button>

            {isDropdownOpen && (
              <>
                <div className="search-criteria-menu">
                  {searchOptions.map((option) => (
                    <button
                      key={option.value}
                      className={`search-criteria-item ${
                        searchCriteria === option.value ? "active" : ""
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleSearchCriteriaChange(option.value);
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
          {/* 검색어 입력 */}
          <input
            type="text"
            placeholder={`${getCurrentLabel()} 이름으로 검색하세요`}
            className="search-input"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />
          {/* 검색 버튼 */}
          <button className="search-button" onClick={handleSearch}>
            🔍
          </button>
        </div>
        {/* 정렬 버튼 */}
        <div className="sort-options">
          <button
            className={`sort-button ${activeSort === "recent" ? "active" : ""}`}
            onClick={() => handleSortChange("recent")}
          >
            최근 등록 순
          </button>
          <button
            className={`sort-button ${activeSort === "view" ? "active" : ""}`}
            onClick={() => handleSortChange("view")}
          >
            조회 순
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
