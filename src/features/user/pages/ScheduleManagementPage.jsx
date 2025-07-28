"use client"

import {ProfileImage} from "@/shared";
import { useEffect, useState } from "react";
import { getSchedules, updateParticipantStatus  } from "@/features/user/api/scheduleApi";
import { parseScheduleResponse} from "@/features/user/dto/scheduleDto";
import EvaluationModal from "@/features/user/modals/EvaluationModal";


const ScheduleManagementPage = ({userProfile}) => {
  // 오늘 날짜 0시 기준
  const currentUserId = userProfile.id;
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [selectedDay, setSelectedDay] = useState(today.getDate())

  function formatDate(month, day, year) {
    return `${String(month + 1).padStart(2, "0")}/${String(day).padStart(2, "0")}/${year}`
  }

  const [selectedDate, setSelectedDate] = useState(formatDate(today.getMonth(), today.getDate(), today.getFullYear()))
  const [activeFilter, setActiveFilter] = useState("date")
  const [closedRecruitIds, setClosedRecruitIds] = useState([])
  const [schedules, setSchedules] = useState([]);
  const [selectedParticipant, setSelectedParticipant] = useState(null);

  useEffect(() => {
    (async () => {
      const data = await getSchedules();
      console.log(parseScheduleResponse(data, currentUserId))
      setSchedules(parseScheduleResponse(data, currentUserId));
    })();
  }, []);


  const getScheduleStatus = (schedule) => {
    if (schedule.progressStatus === "UPCOMING") return "예정";
    if (schedule.progressStatus === "ONGOING") return "진행중";
    return "완료";
  };

  

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

  // 날짜 필터
  const selectedFullDate = new Date(currentYear, currentMonth, selectedDay)
  selectedFullDate.setHours(0, 0, 0, 0)

  const isDateInSchedule = (schedule) => {
    const start = toDateOnly(schedule.startDate)
    const end = toDateOnly(schedule.endDate)
    return selectedFullDate >= start && selectedFullDate <= end
  }

  const filteredSchedules = schedules
  .filter((schedule) => {
    const status = getScheduleStatus(schedule);
    if (activeFilter === "all") return true;
    if (activeFilter === "date") return isDateInSchedule(schedule);
    if (activeFilter === "scheduled") return status === "예정";
    if (activeFilter === "progress") return status === "진행중";
    if (activeFilter === "completed") return status === "완료";
    return true;
  })
  .sort((a, b) => {
    const statusA = getScheduleStatus(a);
    const statusB = getScheduleStatus(b);

    // 완료인 애들은 뒤로 보냄
    if (statusA === "완료" && statusB !== "완료") return 1;
    if (statusA !== "완료" && statusB === "완료") return -1;

    // 나머지는 시작일 빠른 순
    return new Date(a.startDate) - new Date(b.startDate);
  });

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
                currentUserId={currentUserId}
                status={getScheduleStatus(schedule)}
                isRecruitClosed={closedRecruitIds.includes(schedule.id)}
                onRecruitClose={() => setClosedRecruitIds((prev) => [...prev, schedule.id])}
                setSelectedParticipant={setSelectedParticipant}
              />
            ))
          )}
        </div>
      </div>
    {/* 모달은 ScheduleManagementPage의 return 끝부분에 둔다 */}
    {selectedParticipant && (
      <EvaluationModal
        participant={selectedParticipant}
        currentUserId={currentUserId}
        onClose={() => setSelectedParticipant(null)}
        onSubmit={(data) => {
          console.log("평가 제출:", data);
          setSelectedParticipant(null);
        }}
        onReport={(p) => alert(`${p.name} 신고하기!`)}
      />
    )}
  </div>
)
}

const ScheduleCard = ({ schedule, status, currentUserId, isRecruitClosed, onRecruitClose, setSelectedParticipant}) => {
  const [open, setOpen] = useState(false);
  const [participants, setParticipants] = useState(
  (schedule.participants || []).filter((p) => p.id !== currentUserId)
  );
  const [approvedCount, setApprovedCount] = useState(
    (schedule.participants || []).filter((p) => p.approved).length
  );
  const [errorMsg, setErrorMsg] = useState("");

  const participantCount = participants.length;
  const isOwner = schedule.owner?.id === currentUserId; // role 대신 판별
  const isParticipant = (schedule.participants || []).some(p => p.id === currentUserId);
  const isRejected = schedule.myJoinStatus === "REJECTED";

  // 거절된 일정인 경우 open 상태를 강제로 false로 설정
  const effectiveOpen = isRejected ? false : open;

  const handleRecruitClose = () => onRecruitClose && onRecruitClose();

  const handleApprove = async (index, participant) => {
  try {
    await updateParticipantStatus(schedule.id, participant.id, "APPROVED");
    setParticipants((prev) =>
      prev.map((p, i) => (i === index ? { ...p, status: "APPROVED", approved: true } : p))
    );
    setApprovedCount((prev) => prev + 1);
  } catch (error) {
    alert("참여자 승인 실패");
  }
};


const handleReject = async (index, participant) => {
  try {
    await updateParticipantStatus(schedule.id, participant.id, "REJECTED");
    setParticipants((prev) =>
      prev.map((p, i) => (i === index ? { ...p, status: "REJECTED", approved: false } : p))
    );
  } catch (error) {
    alert("참여자 거절 실패");
  }
};


  // 모집 마감된 경우 승인된 참가자만 표시
  const visibleParticipants = [
    ...(schedule.owner && schedule.owner.id !== currentUserId ? [schedule.owner] : []),
    ...(isRecruitClosed 
      ? participants.filter(p => p.status === "APPROVED") 
      : participants
    ),
  ];

  const isFull = schedule.recruitLimit > 0 && approvedCount >= schedule.recruitLimit;



  return (
    <div
      className="schedule-card"
      style={{
        marginBottom: 10,
        backgroundColor: isRejected ? "#eee" : "#fff",
      }}
    >
      <div
        className="schedule-card-header"
        style={{ cursor: !isRejected && participantCount > 0 ? "pointer" : "default" }}
        onClick={() => {
          if (!isRejected && participantCount > 0) setOpen((prev) => !prev);
        }}
      >
        <div className="schedule-info">
          {/* 기본 표시: 지역 | 기간 | 내 일정/참여 일정 | 진행 상태 */}
          <h3>
            {schedule.title} ({schedule.location})
          </h3>
          <p>
            {`${new Date(schedule.startDate).toLocaleDateString()} ~ ${new Date(
              schedule.endDate
            ).toLocaleDateString()}`}
          </p>
          <p>{isOwner ? "내 일정" : "참여 일정"}</p>
          <p style={{ color: status === "진행중" ? "green" : status === "예정" ? "blue" : "gray" }}>
            {status}
          </p>

          <p>{approvedCount+1} / {schedule.recruitLimit+1}</p>

        </div>

        {/* 예정 일정: OWNER만 모집 마감 버튼 */}
        {status === "예정" && isOwner && schedule.recruitLimit > 0 && (
  <div className="schedule-progress" style={{ position: "relative" }}>
    {(!isRecruitClosed && !isFull) ? (
      <div style={{ position: "relative" }}>
        <button className="recruit-btn" onClick={handleRecruitClose}>
          모집 마감하기
        </button>
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
        style={{ backgroundColor: "#ccc", color: "#666" }}
      >
        모집 마감
      </button>
            )}
          </div>
        )}

        {/* 예정 일정: PARTICIPANT 승인 상태 */}
        {status === "예정" && isParticipant && (
          <div className="approval-status">
            <span>
              {schedule.myJoinStatus === "APPROVED"
                ? "승인됨"
                : schedule.myJoinStatus === "REJECTED"
                ? "거절됨"
                : "승인 대기중"}
            </span>
          </div>
        )}
      </div>

      {errorMsg && <div style={{ color: "red", textAlign: "center" }}>{errorMsg}</div>}

      {/* 진행중 / 예정: 참여자 목록 */}
      {effectiveOpen && (status === "진행중" || status === "예정") && !isRejected && visibleParticipants.length > 0 && (
        <div className="participants-section">
          {visibleParticipants.map((participant, index) => (
            <div key={index} className="participant-row">
              <div className="participant-info">
                <ProfileImage src={participant.image} className="participant-avatar" />
                <span>
                  {participant.name}
                  {participant.id === schedule.owner?.id ? " (여행 리더)" : ""}
                </span>
              </div>
              {status === "예정" && isOwner && participant.status === "PENDING" && (
                <div>
                  <button className="action-btn approve" onClick={() => handleApprove(index)}>
                    ✓
                  </button>
                  <button className="action-btn reject" onClick={() => handleReject(index)}>
                    ✕
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}


      {/* 완료 일정 평가 로직 */}
{status === "완료" && (
  <>
    {/* 목록 닫힘 상태 */}
{!effectiveOpen && (
  <div className="schedule-actions">
    <button
      className="completed-btn"
      style={{
        backgroundColor: schedule.isReviewed ? "#28a745" : "#ff7f50",
        color: "#fff",
      }}
      onClick={() => setOpen(true)} // 클릭 시 목록 열기
    >
      {schedule.isReviewed ? "평가 완료" : "평가하기"}
    </button>
  </div>
)}




    {effectiveOpen && (
  <div className="participants-section">
    {visibleParticipants.map((participant, index) => (
      <div key={index} className="participant-row">
        <div className="participant-info">
          <ProfileImage src={participant.image} className="participant-avatar" />
          <span>
            {participant.name}
            {participant.id === schedule.owner?.id ? " (여행 리더)" : ""}
          </span>
        </div>
        <button
          className="evaluation-btn"
          onClick={() => {
            if (!participant.isReviewed) {
              setSelectedParticipant(participant); // 평가 안 했으면 모달 열기
            }
          }}
          disabled={participant.isReviewed} // 평가완료면 비활성화
          style={{
            backgroundColor: participant.isReviewed ? "#28a745" : "#ff7f50",
            color: "#fff",
            padding: "6px 12px",
            borderRadius: "20px",
            marginLeft: "8px",
            border: "none",
            cursor: participant.isReviewed ? "default" : "pointer",
            opacity: participant.isReviewed ? 0.7 : 1,
          }}
        >
          {participant.isReviewed ? "평가 완료" : "평가하기"}
        </button>
      </div>
    ))}
  </div>
)}
  </>
)}



</div> )}


export default ScheduleManagementPage


