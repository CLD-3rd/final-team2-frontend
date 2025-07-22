"use client"

import { useState } from "react"

const ScheduleManagementPage = () => {
  const [selectedDate, setSelectedDate] = useState("")
  const [currentMonth, setCurrentMonth] = useState(7) // August (0-indexed)
  const [currentYear, setCurrentYear] = useState(2025)
  const [activeFilter, setActiveFilter] = useState("all")
  const [isDateFocused, setIsDateFocused] = useState(false)
  const [selectedDay, setSelectedDay] = useState(17) // Currently selected day

  // Sample schedule data
  const schedules = [
    {
      id: 1,
      title: "JS님의일정 과 프랑스 4박5일 일정",
      location: "파리",
      participants: [
        { name: "홍길동", status: "드래곤", approved: true },
        { name: "홍길동", status: "의상차이에요", tag: "크리에", approved: true },
        { name: "홍길동", status: "", approved: true },
      ],
      progress: "4 / 5",
      type: "recruitment",
      status: "active",
    },
    {
      id: 2,
      title: "JS님의일정 과 미들라이 2박3일 일정",
      location: "전북",
      type: "planning",
      status: "pending",
    },
    {
      id: 3,
      title: "JS님의일정 과 미들라이 2박3일 일정",
      location: "전북",
      type: "planning",
      status: "pending",
      showRegisterButton: true,
    },
    {
      id: 4,
      title: "JS님의일정 과 미들라이 2박3일 일정",
      location: "전북",
      type: "completed",
      status: "completed",
    },
  ]

  const filterButtons = [
    { key: "scheduled", label: "예정 등록 일정" },
    { key: "progress", label: "진행 등록 일정" },
    { key: "completed", label: "완료 된 일정" },
  ]

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay()
  }

  // Parse date from input format MM/DD/YYYY
  const parseDateInput = (dateString) => {
    const parts = dateString.split("/")
    if (parts.length === 3) {
      const month = Number.parseInt(parts[0]) - 1 // Convert to 0-indexed
      const day = Number.parseInt(parts[1])
      const year = Number.parseInt(parts[2])

      if (!isNaN(month) && !isNaN(day) && !isNaN(year)) {
        return { month, day, year }
      }
    }
    return null
  }

  // Format date to MM/DD/YYYY
  const formatDate = (month, day, year) => {
    return `${String(month + 1).padStart(2, "0")}/${String(day).padStart(2, "0")}/${year}`
  }

  const handleDateChange = (e) => {
    const value = e.target.value
    setSelectedDate(value)

    // Parse and update calendar if valid date
    const parsed = parseDateInput(value)
    if (parsed) {
      setCurrentMonth(parsed.month)
      setCurrentYear(parsed.year)
      setSelectedDay(parsed.day)
    }
  }

  const handleDateFocus = () => {
    setIsDateFocused(true)
  }

  const handleDateBlur = () => {
    if (!selectedDate) {
      setIsDateFocused(false)
    }
  }

  const handleCalendarDayClick = (day) => {
    setSelectedDay(day)
    const formattedDate = formatDate(currentMonth, day, currentYear)
    setSelectedDate(formattedDate)
    setIsDateFocused(true)
  }

  const handleSelectDate = () => {
    if (selectedDay) {
      const formattedDate = formatDate(currentMonth, selectedDay, currentYear)
      setSelectedDate(formattedDate)
      setIsDateFocused(true)
    }
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

    // Previous month's trailing days
    for (let i = 0; i < firstDay; i++) {
      const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1
      const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear
      const prevMonthDays = getDaysInMonth(prevMonth, prevYear)
      const day = prevMonthDays - firstDay + i + 1
      days.push(
        <div
          key={`prev-${i}`}
          className="calendar-day prev-month"
          onClick={() => {
            // Navigate to previous month and select day
            if (currentMonth === 0) {
              setCurrentMonth(11)
              setCurrentYear(currentYear - 1)
            } else {
              setCurrentMonth(currentMonth - 1)
            }
            setTimeout(() => handleCalendarDayClick(day), 0)
          }}
        >
          {day}
        </div>,
      )
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = day === selectedDay
      days.push(
        <div
          key={day}
          className={`calendar-day ${isSelected ? "selected" : ""}`}
          onClick={() => handleCalendarDayClick(day)}
        >
          {day}
        </div>,
      )
    }

    // Next month's leading days to fill the grid
    const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7
    const remainingCells = totalCells - (firstDay + daysInMonth)

    for (let i = 1; i <= remainingCells; i++) {
      days.push(
        <div
          key={`next-${i}`}
          className="calendar-day next-month"
          onClick={() => {
            // Navigate to next month and select day
            if (currentMonth === 11) {
              setCurrentMonth(0)
              setCurrentYear(currentYear + 1)
            } else {
              setCurrentMonth(currentMonth + 1)
            }
            setTimeout(() => handleCalendarDayClick(i), 0)
          }}
        >
          {i}
        </div>,
      )
    }

    return days
  }

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  return (
    <div className="schedule-management-page">
      <div className="schedule-header">
        <div className="date-picker-section">
          <label>Date</label>
          <div className="date-input-container">
            <input
              type="text"
              value={selectedDate}
              onChange={handleDateChange}
              onFocus={handleDateFocus}
              onBlur={handleDateBlur}
              placeholder={!isDateFocused && !selectedDate ? "MM/DD/YYYY" : ""}
              className="date-input"
            />
            <button className="date-select-btn" onClick={handleSelectDate} title="Select current calendar date">
              📅
            </button>
          </div>
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
            <span>
              {monthNames[currentMonth]} {currentYear}
            </span>
            <button onClick={() => handleMonthChange("next")}>›</button>
          </div>

          <div className="calendar-grid">
            <div className="calendar-weekdays">
              {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
                <div key={index} className="weekday">
                  {day}
                </div>
              ))}
            </div>
            <div className="calendar-days">{renderCalendar()}</div>
          </div>

          <div className="calendar-actions">
            <button className="calendar-btn cancel">Cancel</button>
            <button className="calendar-btn ok" onClick={handleSelectDate}>
              OK
            </button>
          </div>
        </div>

        <div className="schedules-section">
          {schedules.map((schedule) => (
            <ScheduleCard key={schedule.id} schedule={schedule} />
          ))}
        </div>
      </div>
    </div>
  )
}

const ScheduleCard = ({ schedule }) => {
  return (
    <div className="schedule-card">
      <div className="schedule-card-header">
        <div className="schedule-avatar">A</div>
        <div className="schedule-info">
          <h3 className="schedule-title">{schedule.title}</h3>
          <p className="schedule-location">{schedule.location}</p>
        </div>
        {schedule.progress && (
          <div className="schedule-progress">
            <span className="progress-text">{schedule.progress}</span>
            <button className="recruit-btn">모집 마감하기</button>
          </div>
        )}
      </div>

      {schedule.participants && (
        <div className="participants-section">
          {schedule.participants.map((participant, index) => (
            <div key={index} className="participant-row">
              <div className="participant-info">
                <div className="participant-avatar">
                  <img src="/placeholder.svg?height=32&width=32" alt={participant.name} />
                </div>
                <span className="participant-name">{participant.name}</span>
                <div className="participant-tags">
                  {participant.status && <span className="participant-tag">{participant.status}</span>}
                  {participant.tag && <span className="participant-tag secondary">{participant.tag}</span>}
                </div>
              </div>
              <div className="participant-actions">
                <button className="action-btn approve">✓</button>
                <button className="action-btn reject">✕</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {schedule.showRegisterButton && (
        <div className="schedule-actions">
          <button className="register-btn">등록시 알기 쉽기</button>
        </div>
      )}

      {schedule.status === "completed" && (
        <div className="schedule-actions">
          <button className="completed-btn">완료 모집</button>
        </div>
      )}
    </div>
  )
}

export default ScheduleManagementPage
