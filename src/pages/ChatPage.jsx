"use client"

import { useState } from "react"

const ChatPage = () => {
  const [selectedChat, setSelectedChat] = useState("lily-schaden")
  const [messageInput, setMessageInput] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  // 채팅 목록 데이터
  const chatList = [
    {
      id: "sorrel-barrows",
      name: "Sorrel Barrows",
      avatar: "S",
      avatarColor: "#f59e0b",
      lastMessage: "Lol",
      timestamp: "4 min ago",
      unreadCount: 1,
      isOnline: false,
    },
    {
      id: "lily-schaden",
      name: "Lily Schaden",
      avatar: "L",
      avatarColor: "#8b5cf6",
      lastMessage: "Typing...",
      timestamp: "10 min ago",
      unreadCount: 0,
      isOnline: true,
    },
    {
      id: "elin-flatley",
      name: "Elin Flatley",
      avatar: "E",
      avatarColor: "#10b981",
      lastMessage: "What time do",
      timestamp: "1 hour ago",
      unreadCount: 1,
      isOnline: false,
    },
    {
      id: "daisy-reynolds",
      name: "Daisy Reynolds",
      avatar: "D",
      avatarColor: "#3b82f6",
      lastMessage: "Amazing job!",
      timestamp: "5 hour ago",
      unreadCount: 0,
      isOnline: false,
    },
    {
      id: "chloris-nader",
      name: "Chloris Nader",
      avatar: "C",
      avatarColor: "#10b981",
      lastMessage: "To Sony",
      timestamp: "1 day ago",
      unreadCount: 0,
      isOnline: false,
    },
    {
      id: "peonie-hoeger",
      name: "Peonie Hoeger",
      avatar: "P",
      avatarColor: "#3b82f6",
      lastMessage: "Ok thanks",
      timestamp: "1 day ago",
      unreadCount: 0,
      isOnline: false,
    },
    {
      id: "jared-terry",
      name: "Jared Terry",
      avatar: "J",
      avatarColor: "#f59e0b",
      lastMessage: "See you then!",
      timestamp: "2 day ago",
      unreadCount: 0,
      isOnline: false,
    },
  ]

  // 현재 선택된 채팅의 메시지들
  const currentChatMessages = [
    {
      id: 1,
      sender: "other",
      type: "text",
      content: "Hi Cedar. Send me the mockup file",
      timestamp: "2 day ago",
      avatar: "L",
      avatarColor: "#8b5cf6",
    },
    {
      id: 2,
      sender: "me",
      type: "file",
      content: "MockupUpdate.pdf",
      timestamp: "1 day ago",
      fileIcon: "📄",
    },
    {
      id: 3,
      sender: "other",
      type: "voice",
      content: "2:32",
      timestamp: "9:59 AM",
      avatar: "L",
      avatarColor: "#8b5cf6",
    },
    {
      id: 4,
      sender: "me",
      type: "text",
      content: "OK Lily, I'm going to a meeting",
      timestamp: "9:59 AM",
    },
  ]

  const selectedChatData = chatList.find((chat) => chat.id === selectedChat)

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      // 메시지 전송 로직
      console.log("Sending message:", messageInput)
      setMessageInput("")
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="chat-page">
      <div className="chat-container">
        {/* 채팅 목록 사이드바 */}
        <div className="chat-sidebar">
          {/* 검색 바 */}
          <div className="chat-search-container">
            <div className="chat-search-bar">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="chat-search-input"
              />
              <button className="notification-btn">🔔</button>
            </div>
          </div>

          {/* 메시지 헤더 */}
          <div className="messages-header">
            <h3>Messages</h3>
            <button className="dropdown-btn">▼</button>
          </div>

          {/* 채팅 목록 */}
          <div className="chat-list">
            {chatList.map((chat) => (
              <div
                key={chat.id}
                className={`chat-item ${selectedChat === chat.id ? "active" : ""}`}
                onClick={() => setSelectedChat(chat.id)}
              >
                <div className="chat-avatar-container">
                  <div className="chat-avatar" style={{ backgroundColor: chat.avatarColor }}>
                    {chat.avatar}
                  </div>
                  {chat.isOnline && <div className="online-indicator"></div>}
                </div>
                <div className="chat-info">
                  <div className="chat-header-row">
                    <span className="chat-name">{chat.name}</span>
                    <span className="chat-timestamp">{chat.timestamp}</span>
                  </div>
                  <div className="chat-preview-row">
                    <span className="chat-preview">{chat.lastMessage}</span>
                    {chat.unreadCount > 0 && <span className="unread-badge">{chat.unreadCount}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 채팅 메인 영역 */}
        <div className="chat-main">
          {selectedChatData && (
            <>
              {/* 채팅 헤더 */}
              <div className="chat-header">
                <div className="chat-header-info">
                  <div className="chat-avatar" style={{ backgroundColor: selectedChatData.avatarColor }}>
                    {selectedChatData.avatar}
                  </div>
                  <div className="chat-header-details">
                    <h3 className="chat-header-name">{selectedChatData.name}</h3>
                    <span className="chat-status">{selectedChatData.isOnline ? "● Active" : "Offline"}</span>
                  </div>
                </div>
              </div>

              {/* 메시지 영역 */}
              <div className="messages-container">
                {currentChatMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`message ${message.sender === "me" ? "message-sent" : "message-received"}`}
                  >
                    {message.sender === "other" && (
                      <div className="message-avatar" style={{ backgroundColor: message.avatarColor }}>
                        {message.avatar}
                      </div>
                    )}
                    <div className="message-content">
                      {message.type === "text" && <div className="message-text">{message.content}</div>}
                      {message.type === "file" && (
                        <div className="message-file">
                          <span className="file-icon">{message.fileIcon}</span>
                          <span className="file-name">{message.content}</span>
                        </div>
                      )}
                      {message.type === "voice" && (
                        <div className="message-voice">
                          <button className="voice-play-btn">▶</button>
                          <div className="voice-waveform">
                            <div className="waveform-bars">
                              {Array.from({ length: 20 }).map((_, i) => (
                                <div
                                  key={i}
                                  className="waveform-bar"
                                  style={{ height: `${Math.random() * 100}%` }}
                                ></div>
                              ))}
                            </div>
                          </div>
                          <span className="voice-duration">{message.content}</span>
                        </div>
                      )}
                      <div className="message-timestamp">{message.timestamp}</div>
                    </div>
                    {message.sender === "me" && (
                      <div className="message-avatar me-avatar">
                        <img src="/images/user-profile.jpg" alt="Me" />
                      </div>
                    )}
                  </div>
                ))}
                <div className="today-divider">
                  <span>Today</span>
                </div>
              </div>

              {/* 메시지 입력 영역 */}
              <div className="message-input-container">
                <div className="message-input-bar">
                  <input
                    type="text"
                    placeholder="Type a message"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="message-input"
                  />
                  <div className="input-actions">
                    <button className="input-action-btn">😊</button>
                    <button className="input-action-btn">📎</button>
                    <button className="input-action-btn">🎤</button>
                    <button className="send-btn" onClick={handleSendMessage}>
                      ➤
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ChatPage
