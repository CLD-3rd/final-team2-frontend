"use client"

import { useState } from "react"

const ScheduleManagementPage = () => {
  // 오늘 날짜 0시 기준
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [selectedDay, setSelectedDay] = useState(today.getDate())
  const [selectedDate, setSelectedDate] = useState(formatDate(today.getMonth(), today.getDate(), today.getFullYear()))
  const [isDateFocused, setIsDateFocused] = useState(false)
  const [activeFilter, setActiveFilter] = useState("date")
  const [closedRecruitIds, setClosedRecruitIds] = useState([])

  // 샘플 일정 데이터 (startDate/endDate 추가)
  const schedules = [
    {
      id: 1,
      title: "JS님의일정 과 프랑스 4박5일 일정",
      location: "파리",
      startDate: "2025-07-21",
      endDate: "2025-07-25",
      isReviewed: false,  // 평가 완료 여부
    },
    {
      id: 2,
      title: "JS님의일정 과 미들라이 2박3일 일정",
      location: "전북",
      startDate: "2025-08-10",
      endDate: "2025-08-12",
      isReviewed: false,  // 평가 완료 여부
      participants: [
        { name: "홍길동", status: "드래곤", approved: true, image: "/images/hong.png" },
        { name: "김철수", status: "의상차이에요", tag: "크리에", approved: true, image: "/images/hong.png" },
        { name: "이영희", status: "", approved: true, image: "/images/hong.png" },
      ],
      progress: "4 / 5",
    },
    {
      id: 3,
      title: "JS님의일정 과 북한한 2박3일 일정",
      location: "전북",
      startDate: "2025-07-10",
      endDate: "2025-07-12",
      showRegisterButton: true,
      isReviewed: false,  // 평가 완료 여부
    },
    {
      id: 4,
      title: "JS님의일정 과 이탈리아아 2박3일 일정",
      location: "전북",
      startDate: "2025-06-01",
      endDate: "2025-06-03",
      isReviewed: true,  // 평가 완료 여부
    },
  ]

  // 필터 버튼
  const filterButtons = [
    { key: "all", label: "모든 일정" },
    { key: "date", label: "날짜별 일정" },
    { key: "scheduled", label: "예정 중인 일정" },
    { key: "progress", label: "진행 중인 일정" },
    { key: "completed", label: "완료 된 일정" },
  ]

  // 날짜 비교 유틸
  const toDateOnly = (date) => {
    const d = new Date(date)
    d.setHours(0, 0, 0, 0)
    return d
  }

  // 상태 자동 계산
  const getScheduleStatus = (schedule) => {
    if (!schedule.startDate || !schedule.endDate) return "예정"
    const now = today
    const start = toDateOnly(schedule.startDate)
    const end = toDateOnly(schedule.endDate)
    if (now < start) return "예정"
    if (now >= start && now <= end) return "진행중"
    return "완료"
  }

  // 날짜 필터
  const selectedFullDate = new Date(currentYear, currentMonth, selectedDay)
  selectedFullDate.setHours(0, 0, 0, 0)

  const isDateInSchedule = (schedule) => {
    const start = toDateOnly(schedule.startDate)
    const end = toDateOnly(schedule.endDate)
    return selectedFullDate >= start && selectedFullDate <= end
  }

  // 일정 필터링
  const filteredSchedules = schedules.filter((schedule) => {
    const status = getScheduleStatus(schedule)
    if (activeFilter === "all") return true
    if (activeFilter === "date") return isDateInSchedule(schedule)
    if (activeFilter === "scheduled") return status === "예정"
    if (activeFilter === "progress") return status === "진행중"
    if (activeFilter === "completed") return status === "완료"
    return true
  })

  // 캘린더
  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate()
  const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay()

  const parseDateInput = (dateString) => {
    const parts = dateString.split("/")
    if (parts.length === 3) {
      const month = Number.parseInt(parts[0]) - 1
      const day = Number.parseInt(parts[1])
      const year = Number.parseInt(parts[2])
      if (!isNaN(month) && !isNaN(day) && !isNaN(year)) return { month, day, year }
    }
    return null
  }

  function formatDate(month, day, year) {
    return `${String(month + 1).padStart(2, "0")}/${String(day).padStart(2, "0")}/${year}`
  }

  const handleDateChange = (e) => {
    const value = e.target.value
    setSelectedDate(value)
    const parsed = parseDateInput(value)
    if (parsed) {
      setCurrentMonth(parsed.month)
      setCurrentYear(parsed.year)
      setSelectedDay(parsed.day)
    }
  }

  const handleCalendarDayClick = (day) => {
    setSelectedDay(day)
    setSelectedDate(formatDate(currentMonth, day, currentYear))
  }

  const handleMonthChange = (direction) => {
    if (direction === "prev") {
      if (currentMonth === 0) {
        setCurrentMonth(11)
        setCurrentYear(currentYear - 1)
      } else {
        setCurrentMonth(currentMonth - 1)
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0)
        setCurrentYear(currentYear + 1)
      } else {
        setCurrentMonth(currentMonth + 1)
      }
    }
  }

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear)
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear)
    const days = []

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`prev-${i}`} className="calendar-day prev-month">{""}</div>)
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = day === selectedDay
      days.push(
        <div
          key={day}
          className={`calendar-day ${isSelected ? "selected" : ""}`}
          onClick={() => handleCalendarDayClick(day)}
        >
          {day}
        </div>
      )
    }

    return days
  }

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  return (
    <div className="schedule-management-page">
      <div className="schedule-header">
        <div className="date-picker-section">
          <label style={{ marginRight: '10px' }}>Date</label>
          <input
            type="text"
            value={selectedDate}
            onChange={handleDateChange}
            placeholder="MM/DD/YYYY"
            className="date-input"
          />
        </div>

        <div className="filter-buttons">
          {filterButtons.map((button) => (
            <button
              key={button.key}
              className={`filter-btn ${activeFilter === button.key ? "active" : ""}`}
              onClick={() => setActiveFilter(button.key)}
            >
              {button.label}
            </button>
          ))}
        </div>
      </div>

      <div className="schedule-content">
        <div className="calendar-section">
          <div className="calendar-header">
            <button onClick={() => handleMonthChange("prev")}>‹</button>
            <span>{monthNames[currentMonth]} {currentYear}</span>
            <button onClick={() => handleMonthChange("next")}>›</button>
          </div>
          <div className="calendar-days">{renderCalendar()}</div>
        </div>

        <div className="schedules-section">
          {filteredSchedules.length === 0 ? (
            <p style={{ padding: 10, color: "#999" }}>해당 날짜에 일정이 없습니다.</p>
          ) : (
            filteredSchedules.map((schedule) => (
              <ScheduleCard
                key={schedule.id}
                schedule={schedule}
                status={getScheduleStatus(schedule)}
                isRecruitClosed={closedRecruitIds.includes(schedule.id)}
                onRecruitClose={() => setClosedRecruitIds((prev) => [...prev, schedule.id])}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

const ScheduleCard = ({ schedule, status, isRecruitClosed, onRecruitClose }) => {
  const [open, setOpen] = useState(false)
  const [participants, setParticipants] = useState(schedule.participants || [])
  const [approvedCount, setApprovedCount] = useState(
    (schedule.participants && schedule.participants.filter((p) => p.approved).length) || 0
  )
  const [errorMsg, setErrorMsg] = useState("")
  const maxRecruit = schedule.progress ? Number(schedule.progress.split("/")[1].trim()) : null
  const participantCount = participants.length

  const handleRecruitClose = () => {
    if (onRecruitClose) onRecruitClose()
    setParticipants([]) // 모집 마감 시 참여자 목록 비움
  }

  const handleApprove = (index) => {
    if (maxRecruit && approvedCount >= maxRecruit) {
      setErrorMsg("더이상 모집할 수 없음")
      setTimeout(() => setErrorMsg(""), 2000)
      return
    }
    setApprovedCount((prev) => prev + 1)
    setParticipants((prev) => prev.filter((_, i) => i !== index))
  }

  const handleReject = (index) => {
    setParticipants((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="schedule-card" style={{ marginBottom: 10 }}>
      <div
        className="schedule-card-header"
        style={{ cursor: participantCount > 0 ? 'pointer' : 'default' }}
        onClick={() => participantCount > 0 && setOpen((prev) => !prev)}
      >
        <div className="schedule-avatar">A</div>
        <div className="schedule-info">
          <h3>{schedule.title}</h3>
          <p>{schedule.location}</p>
          <p style={{ color: status === "진행중" ? "green" : status === "예정" ? "blue" : "gray" }}>{status}</p>
        </div>
  
        {status === "예정" && schedule.progress && (
          <div className="schedule-progress" style={{ position: 'relative' }}>
            <span>{approvedCount} / {maxRecruit}</span>
            {!isRecruitClosed ? (
              <div style={{ position: "relative" }}>
                <button className="recruit-btn" onClick={handleRecruitClose}>모집 마감하기</button>
                {participantCount > 0 && (
                  <span
                    className="schedule-badge"
                    style={{
                      position: "absolute",
                      right: "-10px",
                      top: "-5px",
                      transform: "translate(50%, -50%)",
                    }}
                  >
                    {participantCount}
                  </span>
                )}
              </div>
            ) : (
              <button 
                className="recruit-btn closed" 
                disabled
                style={{
                  backgroundColor: "#ccc", 
                  color: "#666", 
                  cursor: "not-allowed"
                }}
              >
                모집 마감
              </button>
            )}
          </div>
        )}
      </div>
  
      {errorMsg && <div style={{ color: "red", textAlign: "center" }}>{errorMsg}</div>}
  
      {open && status === "예정" && participants.length > 0 && (
        <div className="participants-section">
          {participants.map((participant, index) => (
            <div key={index} className="participant-row">
              <div className="participant-info">
                <img 
                  src={participant.image} 
                  alt={participant.name} 
                  className="participant-avatar" 
                />
                <span>{participant.name}</span>
              </div>
              <div>
                <button className="action-btn approve" onClick={() => handleApprove(index)}>✓</button>
                <button className="action-btn reject" onClick={() => handleReject(index)}>✕</button>
              </div>
            </div>
          ))}

        </div>
      )}
  
      {/* 여기 아래에 추가 */}
      {status === "완료" && !schedule.isReviewed && (
        <div className="schedule-actions">
          <button className="register-btn">동행자 여행 평가</button>
        </div>
      )}
  
      {status === "완료" && schedule.isReviewed && (
        <div className="schedule-actions">
          <span className="completed-btn">평가 완료</span>
        </div>
      )}
    </div>
  )
}


export default ScheduleManagementPage


