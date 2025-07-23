"use client";

import { useState, useEffect, useRef } from "react";

const FilterBar = ({ filters, onFilterChange }) => {
  const [searchCriteria, setSearchCriteria] = useState("title");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [activeSort, setActiveSort] = useState("recent");

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
    { value: "region", label: "지역" },
  ];

  const handleSearchCriteriaChange = (criteria) => {
    setSearchCriteria(criteria);
    setIsDropdownOpen(false);
  };

  const handleSearch = () => {
    console.log(`🔍 검색 실행: "${searchValue}" in ${searchCriteria}`);
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
      <div className="filter-left"></div>

      <div className="filter-right">
        <div className="search-container">
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

        <div className="view-options">
          <button className="view-button active">☰</button>
          <button className="view-button">⊞</button>
        </div>

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
