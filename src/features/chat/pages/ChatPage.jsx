"use client"

import { useState, useRef, useEffect } from "react"
import ProfileImage from "../../../shared/components/ProfileImage";
import { getDirectChatRooms, getGroupChatRooms, getChatMessages, getCurrentUser, getUsers } from "../api/chatApi";
import { parseDirectChatRoomResponse, parseGroupChatRoomResponse, parseChatMessageResponse, parseUsersResponse, parseCurrentUserResponse } from "../dto/chatDto";
import { wsManager } from "../ws/wsManager";

const ChatPage = () => {
  // 상태 관리
  const [selectedChat, setSelectedChat] = useState(null)
  const [messageInput, setMessageInput] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFile, setSelectedFile] = useState(null)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [chatType, setChatType] = useState("direct") // "direct" 또는 "group"
  const [currentUser, setCurrentUser] = useState(null)
  const [users, setUsers] = useState([])
  const [directRooms, setDirectRooms] = useState([])
  const [groupRooms, setGroupRooms] = useState([])
  const [chatMessages, setChatMessages] = useState([])
  const [currentRoomId, setCurrentRoomId] = useState(null)
  const [loading, setLoading] = useState(false)
  const emojiPickerRef = useRef(null)

  const emojis = [
    "😊", "😂", "🥰", "😍", "🤔", "😎", "😭", "😤", "🥺", "😴",
    "👍", "👎", "👏", "🙌", "👋", "✌️", "🤝", "💪", "🙏", "👌",
    "❤️", "💕", "💖", "💯", "🔥", "⭐", "🎉", "🎊", "🌟", "✨",
  ]

  // 최초 1회 연결 + 알림 구독
useEffect(() => {
  wsManager.connect()
    .then(() => {
      console.log("WebSocket Connected");

      wsManager.subscribeNotifications((notification) => {
        console.log("새 알림:", notification);
        if (notification.roomId) {
          // DM & Group 모두 처리
          setDirectRooms(prev =>
            prev.map(room => room.roomId === notification.roomId
              ? { ...room, unreadCount: (room.unreadCount || 0) + 1 }
              : room
            )
          );
          setGroupRooms(prev =>
            prev.map(room => room.roomId === notification.roomId
              ? { ...room, unreadCount: (room.unreadCount || 0) + 1 }
              : room
            )
          );
        }
      });
    })
    .catch((err) => console.error("WebSocket Connect Failed:", err));

  return () => wsManager.disconnect();
}, []);

  // 채팅방 구독만 관리
useEffect(() => {
  if (!selectedChat) return;

  wsManager.cleanupChatSubscriptions();

  if (chatType === "direct") {
    wsManager.subscribeChat(null, false, (msg) => {
      setChatMessages(prev => [...prev, msg]);
    });
  } else if (chatType === "group") {
    wsManager.subscribeChat(selectedChat.roomId, true, (msg) => {
      setChatMessages(prev => [...prev, msg]);
    });
  }
}, [selectedChat, chatType]);




  // [GET /api/users/me] 현재 사용자 정보 가져오기
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await getCurrentUser()
        console.log("GET /api/users/me - 현재 사용자 정보 가져오기 성공:", response)
        const userData = parseCurrentUserResponse(response)
        setCurrentUser(userData)
      } catch (error) {
        console.error("Failed to fetch current user:", error)
      }
    }
    fetchCurrentUser()
  }, [])

  // [GET /api/users] 모든 사용자 목록 가져오기
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getUsers()
        console.log("GET /api/users - 모든 사용자 목록 가져오기 성공:", response)
        const usersData = parseUsersResponse(response)
        setUsers(usersData)
      } catch (error) {
        console.error("Failed to fetch users:", error)
      }
    }
    fetchUsers()
  }, [])

  // [GET /api/chat/my-rooms/direct] DM 채팅방 목록 가져오기
  useEffect(() => {
    const fetchDirectRooms = async () => {
      try {
        const response = await getDirectChatRooms()
        console.log("GET /api/chat/my-rooms/direct - DM 채팅방 목록 가져오기 성공:", response)
        
        // API 응답이 이미 UI에 맞는 형태인 경우 그대로 사용
        if (response && Array.isArray(response) && response.length > 0 && response[0].lastMessage !== undefined) {
          setDirectRooms(response)
        } else {
          // API 응답을 UI에 맞는 형태로 변환
          const formattedRooms = parseDirectChatRoomResponse(response, currentUser)
          setDirectRooms(formattedRooms)
        }
      } catch (error) {
        console.error("Failed to fetch direct rooms:", error)
      }
    }
    fetchDirectRooms()
  }, [])

  // [GET /api/chat/my-rooms/group] 그룹 채팅방 목록 가져오기
  useEffect(() => {
    const fetchGroupRooms = async () => {
      try {
        const response = await getGroupChatRooms()
        console.log("GET /api/chat/my-rooms/group - 그룹 채팅방 목록 가져오기 성공:", response)
        
        // API 응답이 이미 UI에 맞는 형태인 경우 그대로 사용
        if (response && Array.isArray(response) && response.length > 0 && response[0].lastMessage !== undefined) {
          setGroupRooms(response)
        } else {
          // API 응답을 UI에 맞는 형태로 변환
          const formattedRooms = parseGroupChatRoomResponse(response, currentUser)
          setGroupRooms(formattedRooms)
        }
      } catch (error) {
        console.error("Failed to fetch group rooms:", error)
      }
    }
    fetchGroupRooms()
  }, [currentUser])

  // [GET /api/chat/rooms/{roomId}/messages] 선택된 채팅방의 메시지 가져오기
  useEffect(() => {
    if (selectedChat && selectedChat.roomId) {
      const fetchMessages = async () => {
        try {
          setLoading(true)
          const response = await getChatMessages(selectedChat.roomId)
          console.log(`GET /api/chat/rooms/${selectedChat.roomId}/messages - 선택된 채팅방의 메시지 가져오기 성공:`, response)
          
          // API 응답이 이미 UI에 맞는 형태인 경우 그대로 사용
          if (response && Array.isArray(response) && response.length > 0 && response[0].sender !== undefined) {
            setChatMessages(response)
            setCurrentRoomId(selectedChat.roomId)
            setLoading(false)
          } else {
            // API 응답을 UI에 맞는 형태로 변환
            const formattedMessages = parseChatMessageResponse(response, currentUser, selectedChat)
            setChatMessages(formattedMessages)
            setCurrentRoomId(selectedChat.roomId)
            setLoading(false)
          }
        } catch (error) {
          console.error("Failed to fetch messages:", error)
          setLoading(false)
        }
      }
      fetchMessages()
    }
  }, [selectedChat, currentUser])



  // [SEND /pub/chat.direct.send/{currentRoomId}] DM 메시지 전송 (WebSocket)
  // [SEND /pub/chat.group.send/{currentRoomId}] 그룹 메시지 전송 (WebSocket)
  const sendMessage = async (message) => {
  if (!currentRoomId || !message.trim()) return;

  const msgPayload = {
    roomId: currentRoomId,
    content: message,
    type: "TALK",
    recipientId: chatType === "direct" ? selectedChat?.recipientId : null,
  };

  wsManager.sendMessage(currentRoomId, msgPayload, chatType === "group", selectedChat?.recipientId);

  setChatMessages(prev => [
    ...prev,
    {
      id: Date.now(),
      sender: currentUser?.name || "me",
      type: "text",
      content: message,
      timestamp: new Date().toISOString(),
    }
  ]);
};


  // 채팅 타입 변경 (DM/Group)
  const handleChatTypeChange = (type) => {
    setChatType(type)
    setSelectedChat(null)
    setChatMessages([])
  }

  // 채팅방 선택
  const handleChatSelect = (chat) => {
    setSelectedChat(chat)
  }



  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      sendMessage(messageInput)
      setMessageInput("")
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  /** 이미지 & 파일 업로드 수정 */
  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      const isImage = file.type.startsWith("image/")
      const newMessage = {
        id: chatMessages.length + 1,
        sender: "me",
        type: isImage ? "image" : "file",
        content: isImage ? URL.createObjectURL(file) : file.name,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        fileIcon: isImage ? "🖼️" : "📄",
      }
      setChatMessages((prev) => [...prev, newMessage])
      setSelectedFile(null)
    }
  }

  const handleEmojiClick = (emoji) => {
    setMessageInput((prev) => prev + emoji)
    setShowEmojiPicker(false)
  }

  const toggleEmojiPicker = () => setShowEmojiPicker(!showEmojiPicker)

  // 현재 표시할 채팅 목록
  const currentChatList = chatType === "direct" ? directRooms : groupRooms

  return (
    <div className="chat-page">
      <div className="chat-container">
        {/* 사이드바 */}
        <div className="chat-sidebar">
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
            </div>
          </div>
          <div className="messages-header">
            <h3>Messages</h3>
            <div className="chat-type-buttons">
              <button 
                className={`chat-type-btn ${chatType === "direct" ? "active" : ""}`}
                onClick={() => handleChatTypeChange("direct")}
              >
                DM
              </button>
              <button 
                className={`chat-type-btn ${chatType === "group" ? "active" : ""}`}
                onClick={() => handleChatTypeChange("group")}
              >
                Group
              </button>
            </div>
          </div>
          <div className="chat-list">
            {chatType === "direct" && (
              // DM 모드: 사용자 목록과 기존 DM 채팅방 표시
              <>
                {users
                  .filter(user => 
                    user.id !== currentUser?.id && 
                    user.name?.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map(user => (
                    <div
                      key={user.id}
                      className="chat-item"
                      onClick={() => startNewDirectChat(user)}
                    >
                      <div className="chat-avatar-container">
                        <div className="chat-avatar" style={{ backgroundColor: "#8b5cf6", width: 40, height: 40, borderRadius: "50%", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <ProfileImage
                            src={user.profileImage}
                            alt={user.name?.charAt(0) || "상대방 프로필"}
                            style={{ width: 40, height: 40, objectFit: "cover" }}
                          />
                        </div>
                      </div>
                      <div className="chat-info">
                        <div className="chat-header-row">
                          <span className="chat-name">{user.name}</span>
                        </div>
                        <div className="chat-preview-row">
                          <span className="chat-preview">Start new chat</span>
                        </div>
                      </div>
                    </div>
                  ))}
                {directRooms
                  .filter(chat =>
                    chat.name?.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map(chat => (
                    <div
                      key={chat.roomId || chat.id}
                      className={`chat-item ${selectedChat?.roomId === chat.roomId ? "active" : ""}`}
                      onClick={() => handleChatSelect(chat)}
                    >
                      <div className="chat-avatar-container">
                        <div className="chat-avatar" style={{ backgroundColor: chat.avatarColor || "#8b5cf6", width: 40, height: 40, borderRadius: "50%", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <ProfileImage
                            src={chat.profileImage}
                            alt={chat.name?.charAt(0) || "상대방 프로필"}
                            style={{ width: 40, height: 40, objectFit: "cover" }}
                          />
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
              </>
            )}
            {chatType === "group" && (
              // Group 모드: 그룹 채팅방만 표시
              groupRooms
                .filter(chat =>
                  chat.name?.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map(chat => (
                  <div
                    key={chat.roomId || chat.id}
                    className={`chat-item ${selectedChat?.roomId === chat.roomId ? "active" : ""}`}
                    onClick={() => handleChatSelect(chat)}
                  >
                    <div className="chat-avatar-container">
                      <div className="chat-avatar" style={{ backgroundColor: chat.avatarColor || "#10b981", width: 40, height: 40, borderRadius: "50%", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <ProfileImage
                          src={chat.profileImage}
                          alt={chat.name?.charAt(0) || "그룹 프로필"}
                          style={{ width: 40, height: 40, objectFit: "cover" }}
                        />
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
                ))
            )}
          </div>
        </div>

        {/* 메인 영역 */}
        <div className="chat-main">
          {selectedChat ? (
            <>
              <div className="chat-header">
                <div className="chat-header-info">
                  <div className="chat-avatar" style={{ backgroundColor: selectedChat.avatarColor || "#8b5cf6" }}>
                    {selectedChat.name?.charAt(0)}
                  </div>
                  <div className="chat-header-details">
                    <h3 className="chat-header-name">{selectedChat.name}</h3>
                    <span className="chat-status">{selectedChat.isOnline ? "● Active" : "Offline"}</span>
                  </div>
                </div>
              </div>

              {/* 메시지 영역 */}
              <div className="messages-container">
                {loading ? (
                  <div className="loading-messages">Loading messages...</div>
                ) : (
                  <>
                    {chatMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`message ${message.sender === "me" ? "message-sent" : "message-received"}`}
                      >
                        {message.sender === "other" && (
                          <div className="message-avatar" style={{ backgroundColor: message.avatarColor || "#8b5cf6", width: 40, height: 40, borderRadius: "50%", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <ProfileImage
                              src={message.profileImage}
                              alt={message.avatar || "상대방 프로필"}
                              style={{ width: 40, height: 40, objectFit: "cover" }}
                            />
                          </div>
                        )}
                        <div className="message-content">
                          {message.type === "text" && <div className="message-text">{message.content}</div>}
                          {message.type === "image" && (
                            <div className="message-image">
                              <img src={message.content} alt="uploaded" style={{ maxWidth: "200px", borderRadius: "8px" }} />
                            </div>
                          )}
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
                                    <div key={i} className="waveform-bar" style={{ height: `${Math.random() * 100}%` }}></div>
                                  ))}
                                </div>
                              </div>
                              <span className="voice-duration">{message.content}</span>
                            </div>
                          )}
                          <div className="message-timestamp">{message.timestamp}</div>
                        </div>
                        {/* 내가 보낸 메시지에는 프로필 사진(아바타) 없음 */}
                      </div>
                    ))}
                    <div className="today-divider">
                      <span>Today</span>
                    </div>
                  </>
                )}
              </div>

              {/* 입력 영역 */}
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
                    <div className="emoji-picker-container" ref={emojiPickerRef}>
                      <button className="input-action-btn" onClick={toggleEmojiPicker} type="button">😊</button>
                      {showEmojiPicker && (
                        <div className="emoji-picker">
                          {emojis.map((emoji, index) => (
                            <button key={index} className="emoji-item" onClick={() => handleEmojiClick(emoji)} type="button">
                              {emoji}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <input
                      type="file"
                      id="file-upload"
                      style={{ display: "none" }}
                      onChange={handleFileSelect}
                      accept="image/*,application/pdf,.doc,.docx"
                    />
                    <label htmlFor="file-upload" className="input-action-btn" style={{ cursor: "pointer" }}>📎</label>
                    <button className="send-btn" onClick={handleSendMessage}>➤</button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="no-chat-selected">
              <p>Select a chat to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ChatPage
