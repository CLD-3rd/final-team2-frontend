"use client"

import { useState, useRef, useEffect } from "react";
import ProfileImage from "../../../shared/components/ProfileImage";
import { getDirectChatRooms, getGroupChatRooms, getChatMessages, getCurrentUser, getUsers, createDirectChatRoom } from "../api/chatApi";
import { parseDirectChatRoomResponse, parseGroupChatRoomResponse, parseChatMessageResponse, parseUsersResponse, parseCurrentUserResponse } from "../dto/chatDto";
import { wsManager } from "../ws/wsManager";
import { is } from "date-fns/locale";

const ChatPage = () => {
    const [selectedChat, setSelectedChat] = useState(null);
    const [messageInput, setMessageInput] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [chatType, setChatType] = useState("direct");
    const [currentUser, setCurrentUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [directRooms, setDirectRooms] = useState([]);
    const [groupRooms, setGroupRooms] = useState([]);
    const [chatMessages, setChatMessages] = useState([]);
    const [currentRoomId, setCurrentRoomId] = useState(null);
    const [loading, setLoading] = useState(false);
    const emojiPickerRef = useRef(null);
    const messagesEndRef = useRef(null);
    const currentRoomIdRef = useRef(null);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [initialScrollDone, setInitialScrollDone] = useState(false);


    const emojis = [
        "😊", "😂", "🥰", "😍", "🤔", "😎", "😭", "😤", "🥺", "😴",
        "👍", "👎", "👏", "🙌", "👋", "✌️", "🤝", "💪", "🙏", "👌",
        "❤️", "💕", "💖", "💯", "🔥", "⭐", "🎉", "🎊", "🌟", "✨",
    ];

    // ✅ 1. 채팅방 목록을 불러오는 함수를 재사용 가능하게 분리합니다.
    const fetchDirectChatRooms = async (currentUserData) => {
        try {
            const directRoomsResponse = await getDirectChatRooms();
            // API 응답과 현재 유저 정보를 사용해 DTO 파싱
            setDirectRooms(parseDirectChatRoomResponse(directRoomsResponse, currentUserData));
            console.log("✅ DM 채팅방 목록을 최신화했습니다.");
        } catch (error) {
            console.error("DM 채팅방 목록 로딩에 실패했습니다:", error);
        }
    };

    // ✅ 2. 컴포넌트 첫 로딩 시 실행되는 useEffect 수정
    useEffect(() => {
        const initializeDMView = async () => {
            try {
                setLoading(true);
                const userResponse = await getCurrentUser();
                const userData = parseCurrentUserResponse(userResponse);
                setCurrentUser(userData);
                console.log("me:", userData.id);

                // 분리된 함수를 사용해 초기 채팅방 목록과 전체 유저 목록을 동시에 가져옵니다.
                await Promise.all([
                    fetchDirectChatRooms(userData),
                    getUsers().then(res => setUsers(parseUsersResponse(res)))
                ]);

            } catch (error) {
                console.error("채팅 페이지 초기화에 실패했습니다:", error);
            } finally {
                setLoading(false);
            }
        };
        initializeDMView();
    }, []); // 이 useEffect는 처음 한 번만 실행되므로 의존성 배열은 그대로 [] 입니다.

    useEffect(() => {
        currentRoomIdRef.current = selectedChat?.roomId;
    }, [selectedChat]);

    // ✅ 3. 1:1 메시지 수신을 처리하는 useEffect 수정
    useEffect(() => {
        if (!currentUser) return;

        const handleDirectMessage = (msg) => {
            console.log("✅ DM 수신 (ChatPage):", msg);

            // 현재 열어놓은 채팅방에서 메시지가 온 경우
            if (currentRoomIdRef.current === msg.roomId) {
                const formattedMessage = {
                    ...msg,
                    sender: Number(msg.senderId) === currentUser.id ? "me" : "other",
                    displayTime: new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                };
                setChatMessages(prev => [...prev, formattedMessage]);
            } else {
                // 현재 열어놓지 않은 다른 채팅방에서 메시지가 온 경우
                console.log(`다른 채팅방(${msg.roomId})으로부터 DM이 수신되었습니다.`);

                // 수신된 메시지의 채팅방이 현재 목록에 있는지 확인
                const roomExists = directRooms.some(room => room.roomId === msg.roomId);

                // 만약 목록에 없는 새로운 채팅방이라면, 전체 목록을 다시 불러옵니다.
                if (!roomExists) {
                    console.log(`새로운 채팅방(${msg.roomId})을 감지했습니다. 채팅방 목록을 갱신합니다.`);
                    fetchDirectChatRooms(currentUser); // ✨ 여기가 핵심 수정 사항입니다!
                }
            }
        };

        const connectAndSubscribe = async () => {
            // await wsManager.connect();
            wsManager.subscribe('/user/queue/messages', handleDirectMessage);
        };

        connectAndSubscribe();

        return () => {
            wsManager.unsubscribe('/user/queue/messages', handleDirectMessage);
        };
        // directRooms를 의존성 배열에 추가하여 roomExists를 체크할 때 항상 최신 채팅방 목록을 기준으로 판단하도록 합니다.
    }, [currentUser, directRooms]);

    // 그룹 채팅 구독
    useEffect(() => {
        if (chatType !== 'group' || !selectedChat?.roomId) return;
        const groupSubDestination = `/sub/chat/room/${selectedChat.roomId}`;
        const handleGroupMessage = (msg) => {
  const isMe = Number(msg.senderId) === Number(currentUser?.id);
  const formattedMessage = {
    ...msg,
    sender: isMe ? "me" : "other",           // DM처럼 sender 세팅
    displayTime: new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  };
  setChatMessages(prev => [...prev, formattedMessage]);
};
        const manageGroupSubscription = async () => {
            await wsManager.connect();
            wsManager.subscribe(groupSubDestination, handleGroupMessage);
        };
        manageGroupSubscription();
        return () => {
            wsManager.unsubscribe(groupSubDestination, handleGroupMessage);
        };
    }, [selectedChat, chatType, currentUser]);

    useEffect(() => {
    if (!initialScrollDone && messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "auto" });
        isAtBottomRef.current = true; // 초기 스크롤 후 하단에 있다고 가정
        setInitialScrollDone(true);
    } 
}, [chatMessages, initialScrollDone]);

    useEffect(() => {
        if (selectedChat && selectedChat.roomId) {
            const fetchMessages = async () => {
                try {
                    const response = await getChatMessages(selectedChat.roomId, page, 20);
                    const formattedMessages = parseChatMessageResponse(response, currentUser, selectedChat);
                    const sortedMessages = [...formattedMessages].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
                    
                    // ✅ 여기서 최근 10개 콘솔로 확인
        console.table(
          sortedMessages.slice(-10).map(m => ({
            id: m.id,
            sender: m.sender,            // DTO가 세팅했는지
            senderId: m.senderId,        // 비교에 쓰는 값 있는지
            me: String(m.senderId) === String(currentUser?.id),
          }))
        );
                    if(page ===0){setChatMessages(sortedMessages);}
                    else{
                        setChatMessages(prev => [...sortedMessages, ...prev]);}
                    setHasMore(!response.last);    
                    setCurrentRoomId(selectedChat.roomId);
                } catch (error) {
                    console.error("메시지 로딩 실패:", error);
                }
            };
            fetchMessages();
        }
    }, [selectedChat, currentUser, page]);


    
    const messagesContainerRef = useRef(null);
    const prevScrollHeightRef = useRef(0);
    const loadingOlderRef = useRef(false);

    const BOTTOM_THRESHOLD = 80;               // 하단 근처 허용 오차(px)
const isAtBottomRef = useRef(true);        // 현재 사용자가 하단에 있었는지 추적

const calcIsAtBottom = () => {
const el = messagesContainerRef.current;
if (!el) return true;
return el.scrollHeight - el.scrollTop - el.clientHeight <= BOTTOM_THRESHOLD;
};


const handleScroll = () => {
const el = messagesContainerRef.current;
if (!el) return;
if (el.scrollTop === 0 && hasMore && !loadingOlderRef.current) {
    loadingOlderRef.current = true;                 // 프리펜드 시작
    prevScrollHeightRef.current = el.scrollHeight;  // 기존 전체 높이 저장
    setPage((p) => p + 1);                          // 다음 페이지 로드
}

    isAtBottomRef.current = calcIsAtBottom();
};

useEffect(() => {
  if (!isAtBottomRef.current) return;         // 하단에 있을 때만 수행

const el = messagesContainerRef.current;
if (!el) return;

  // DOM 페인트 이후에 확실히 바닥으로
requestAnimationFrame(() => {
    el.scrollTop = el.scrollHeight;
});
}, [chatMessages]);


// ✅ 3) 프리펜드 때만 보정 (통일된 보정 useEffect)
useEffect(() => {
  if (!loadingOlderRef.current) return; // 프리펜드가 아닐 때는 보정하지 않음

const el = messagesContainerRef.current;
if (!el) return;
const delta = el.scrollHeight - prevScrollHeightRef.current;
  el.scrollTop = delta;                 // 화면 위치 유지
  loadingOlderRef.current = false;      // 프리펜드 종료
}, [chatMessages]);

useEffect(() => {
const el = messagesContainerRef.current;
if (!el) return;

const isAtBottom =
    Math.abs(el.scrollHeight - el.scrollTop - el.clientHeight) < 16;

if (isAtBottom && messagesEndRef.current) {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
}
}, [chatMessages]);


    const handleChatSelect = (chat) => {
        if (selectedChat?.roomId === chat.roomId) return;
        setSelectedChat(chat);

        setChatMessages([]);
setPage(0);
setHasMore(true);
setInitialScrollDone(false);

loadingOlderRef.current = false;
prevScrollHeightRef.current = 0;
    };

    const sendMessage = (message) => {
        if (!currentRoomId || !message.trim() || !currentUser) return;
        const msgPayload = {
            content: message,
            type: "TALK",
            ...(chatType === "direct" && { recipientId: selectedChat?.otherUserId }),
        };
        let destination = '';
        if (chatType === 'direct') {
            destination = `/pub/chat.direct.send/${currentRoomId}`;
        } else {
            destination = `/pub/chat.group.send/${currentRoomId}`;
        }
        wsManager.sendMessage(destination, msgPayload);
        setMessageInput("");
    };

    const handleSendMessage = () => {
        if (messageInput.trim()) {
            sendMessage(messageInput);
            
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };
    
    // (이하 handleChatTypeChange 함수 추가)
    // DM, Group 버튼 클릭 시 채팅 목록을 초기화하고, 선택된 채팅도 초기화하기 위함
    const handleChatTypeChange = async (type) => {
        if (chatType === type) return;

        setChatType(type);
        setSelectedChat(null); // 채팅 선택 해제
        setChatMessages([]);   // 메시지 목록 비우기
        setSearchQuery("");    // 검색어 초기화

        if (type === 'group') {
            try {
                setLoading(true);
                const groupRoomsResponse = await getGroupChatRooms();
                setGroupRooms(parseGroupChatRoomResponse(groupRoomsResponse, currentUser));
            } catch (error) {
                console.error("그룹 채팅방 목록 로딩 실패:", error);
            } finally {
                setLoading(false);
            }
        }
    };


    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            const isImage = file.type.startsWith("image/");
            const now = new Date();
            const newMessage = {
                id: `temp-file-${Date.now()}`,
                sender: "me",
                type: isImage ? "image" : "file",
                content: isImage ? URL.createObjectURL(file) : file.name,
                timestamp: now.toISOString(),
                displayTime: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                fileIcon: isImage ? "🖼️" : "📄",
            };
            setChatMessages((prev) => [...prev, newMessage]);
            setSelectedFile(null);
        }
    };

    const handleEmojiClick = (emoji) => {
        setMessageInput((prev) => prev + emoji);
        setShowEmojiPicker(false);
    };

    const toggleEmojiPicker = () => setShowEmojiPicker(!showEmojiPicker);

    return (
        <div className="chat-page">
            <div className="chat-container">
                <div className="chat-sidebar">
                    <div className="chat-search-container">
                        <div className="chat-search-bar">
                            <span className="search-icon">🔍</span>
                            <input type="text" placeholder="Search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="chat-search-input" />
                        </div>
                    </div>
                    <div className="messages-header">
                        <h3>Messages</h3>
                        <div className="chat-type-buttons">
                            <button className={`chat-type-btn ${chatType === "direct" ? "active" : ""}`} onClick={() => handleChatTypeChange("direct")}>DM</button>
                            <button className={`chat-type-btn ${chatType === "group" ? "active" : ""}`} onClick={() => handleChatTypeChange("group")}>Group</button>
                        </div>
                    </div>
                    <div className="chat-list">
                        {chatType === "direct" && (
                            <>
                                {directRooms.filter(chat => chat.name?.toLowerCase().includes(searchQuery.toLowerCase())).map(chat => (
                                    <div key={chat.roomId || chat.id} className={`chat-item ${selectedChat?.roomId === chat.roomId ? "active" : ""}`} onClick={() => handleChatSelect(chat)}>
                                        <div className="chat-avatar-container">
                                            <div className="chat-avatar" style={{ backgroundColor: chat.avatarColor || "#8b5cf6", width: 40, height: 40, borderRadius: "50%", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                <ProfileImage src={chat.profileImage} alt={chat.name?.charAt(0) || "상대방 프로필"} style={{ width: 40, height: 40, objectFit: "cover" }} />
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
                            groupRooms.filter(chat => chat.name?.toLowerCase().includes(searchQuery.toLowerCase())).map(chat => (
                                <div key={chat.roomId || chat.id} className={`chat-item ${selectedChat?.roomId === chat.roomId ? "active" : ""}`} onClick={() => handleChatSelect(chat)}>
                                    <div className="chat-avatar-container">
                                        <div className="chat-avatar" style={{ backgroundColor: chat.avatarColor || "#10b981", width: 40, height: 40, borderRadius: "50%", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <ProfileImage src={chat.profileImage} alt={chat.name?.charAt(0) || "그룹 프로필"} style={{ width: 40, height: 40, objectFit: "cover" }}/>
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
                            
                            <div className="messages-container" 
                            ref={messagesContainerRef} 
                            onScroll={handleScroll}>
                                {loading && chatMessages.length === 0 ? (
                                    <div className="loading-messages">Loading messages...</div>
                                ) : (
                                    <>
                                        {chatMessages.map((message) => {
                                            const isMe = Number(message.senderId) === Number(currentUser?.id);
                                            return (
                                                <div
                                                    key={message.id}
                                                    className={`message-row ${isMe ? 'sent' : 'received'}`}
                                                >
                                                    {!isMe && (
                                                        <ProfileImage
                                                            src={message.profileImage}
                                                            alt={message.senderName?.charAt(0)}
                                                            style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', alignSelf: 'flex-start' }}
                                                        />
                                                    )}
                                                    
                                                    <div
        className="message-content"
        /* 👇 내 메시지는 오른쪽으로 밀어붙이기 */
        style={isMe ? { marginLeft: "auto", textAlign: "right" } : undefined}
      >
        {!isMe && <div className="sender-name">{message.senderName}</div>}

                                                        <div className="message-bubble">
                                                            <div className="message-text">{message.content}</div>
                                                            <div className="message-timestamp">{message.displayTime}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        <div ref={messagesEndRef} />
                                    </>
                                )}
                            </div>

                            <div className="message-input-container">
                                <div className="message-input-bar">
                                    <input type="text" placeholder="Type a message" value={messageInput} onChange={(e) => setMessageInput(e.target.value)} onKeyPress={handleKeyPress} className="message-input" />
                                    <div className="input-actions">
                                        <div className="emoji-picker-container" ref={emojiPickerRef}>
                                            <button className="input-action-btn" onClick={toggleEmojiPicker} type="button">😊</button>
                                            {showEmojiPicker && (
                                                <div className="emoji-picker">
                                                    {emojis.map((emoji, index) => (<button key={index} className="emoji-item" onClick={() => handleEmojiClick(emoji)} type="button">{emoji}</button>))}
                                                </div>
                                            )}
                                        </div>
                                        <input type="file" id="file-upload" style={{ display: "none" }} onChange={handleFileSelect} accept="image/*,application/pdf,.doc,.docx" />
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

export default ChatPage;