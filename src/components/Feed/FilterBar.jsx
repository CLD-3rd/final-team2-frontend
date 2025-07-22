"use client";

import { useState, useEffect, useRef } from "react";

const FilterBar = ({ filters, onFilterChange }) => {
  const [searchCriteria, setSearchCriteria] = useState("title"); // 'author', 'title', 'region'
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [activeSort, setActiveSort] = useState("recent"); // ✅ 기본값: 최근 등록 순

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const searchOptions = [
    { value: "title", label: "제목" },
    { value: "author", label: "글쓴이" },
    { value: "region", label: "지역" },
  ];

  const handleSearchCriteriaChange = (criteria) => {
    setSearchCriteria(criteria);
    setIsDropdownOpen(false);
  };

  const handleSearch = () => {
    // Handle search based on selected criteria
    console.log(`Searching for "${searchValue}" in ${searchCriteria}`);
  };

  const handleSortChange = (sortKey) => {
    setActiveSort(sortKey);
    if (onSortChange) onSortChange(sortKey);
  };

  const getCurrentLabel = () => {
    const current = searchOptions.find(
      (option) => option.value === searchCriteria
    );
    return current ? current.label : "제목";
  };

  return (
    <div className="filter-bar">
      <div className="filter-left">
        {/* Empty for now, can add other filters later */}
      </div>

      <div className="filter-right">
        <div className="search-container">
          <div className="search-criteria-dropdown" ref={dropdownRef}>
            <button
              className="search-criteria-button"
              onClick={(e) => {
                e.preventDefault();
                setIsDropdownOpen(!isDropdownOpen);
              }}
            >
              {getCurrentLabel()} ▼
            </button>

            {isDropdownOpen && (
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
            )}
          </div>

          <input
            type="text"
            placeholder={`${getCurrentLabel()} 이름으로 검색하세요`}
            className="search-input"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <button className="search-button" onClick={handleSearch}>
            🔍
          </button>
        </div>

        {/* 보기 전환 아이콘 */}
        <div className="view-options">
          <button className="view-button active">☰</button>
          <button className="view-button">⊞</button>
        </div>

        {/* ✅ 정렬 버튼 */}
        <div className="sort-options">
          <button
            className={`sort-button ${activeSort === "recent" ? "active" : ""}`}
            onClick={() => handleSortChange("recent")}
          >
            최근 등록 순
          </button>
          <button
            className={`sort-button ${
              activeSort === "recommend" ? "active" : ""
            }`}
            onClick={() => handleSortChange("recommend")}
          >
            추천 순
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
