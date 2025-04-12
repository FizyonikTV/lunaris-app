import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { fetchMessages, sendMessage, addMessage, pinMessage, unpinMessage, fetchMessagesWithPagination } from '../../store/slices/messageSlice';
import { FaPaperPlane, FaSmile, FaPaperclip } from 'react-icons/fa';
import Message from './Message';
import axios from 'axios';

const ChatArea = ({ socket, activeChannel, user }) => {
  const dispatch = useDispatch();
  const { messages, loading } = useSelector(state => state.messages);
  const [messageText, setMessageText] = useState('');
  const [typingUsers, setTypingUsers] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  useEffect(() => {
    if (activeChannel) {
      socket.emit('join_channel', activeChannel._id);
      
      socket.on('receive_message', (message) => {
        dispatch(addMessage(message));
      });
    }
    
    return () => {
      if (activeChannel) {
        socket.emit('leave_channel', activeChannel._id);
        socket.off('receive_message');
      }
    };
  }, [activeChannel, dispatch, socket]);

  useEffect(() => {
    if (activeChannel) {
      socket.on('user_typing', (data) => {
        setTypingUsers((prev) => {
          if (prev.some((u) => u.userId === data.userId)) return prev;
          return [...prev, { userId: data.userId, username: data.username }];
        });
      });

      socket.on('user_stopped_typing', (data) => {
        setTypingUsers((prev) => prev.filter((u) => u.userId !== data.userId));
      });
    }

    return () => {
      if (activeChannel) {
        socket.off('user_typing');
        socket.off('user_stopped_typing');
      }
    };
  }, [activeChannel, socket]);
  
  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (messageText.trim()) {
      const messageData = {
        content: messageText,
        channelId: activeChannel._id,
        author: user.id
      };
      
      dispatch(sendMessage(messageData));
      socket.emit('send_message', messageData);
      setMessageText('');
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      };

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/messages/${activeChannel._id}/upload`,
        formData,
        config
      );

      socket.emit('send_message', response.data);
    } catch (error) {
      console.error('Dosya yükleme hatası:', error);
    }
  };
  
  const handleInputChange = (e) => {
    setMessageText(e.target.value);

    if (!isTyping) {
      setIsTyping(true);
      socket.emit('typing', {
        userId: user.id,
        username: user.username,
        channelId: activeChannel._id,
      });

      setTimeout(() => {
        setIsTyping(false);
        socket.emit('stop_typing', {
          userId: user.id,
          channelId: activeChannel._id,
        });
      }, 3000);
    }
  };

  const handlePinMessage = (messageId) => {
    dispatch(pinMessage({ channelId: activeChannel._id, messageId }));
  };

  const handleUnpinMessage = () => {
    dispatch(unpinMessage(activeChannel._id));
  };

  const loadMoreMessages = async () => {
    const response = await dispatch(
      fetchMessagesWithPagination({ channelId: activeChannel._id, page: currentPage + 1 })
    );

    if (response.payload.messages.length === 0) {
      setHasMore(false);
    } else {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };
  
  return (
    <ChatContainer>
      <ChatHeader>
        <ChannelName># {activeChannel?.name}</ChannelName>
        <ChannelDescription>
          {activeChannel?.description || 'Bu kanal için açıklama bulunmuyor.'}
        </ChannelDescription>
        {activeChannel?.pinnedMessage && (
          <PinnedMessage>
            <p>{activeChannel.pinnedMessage.content}</p>
            <UnpinButton onClick={handleUnpinMessage}>Sabit Mesajı Kaldır</UnpinButton>
          </PinnedMessage>
        )}
      </ChatHeader>
      
      <MessagesContainer>
        {hasMore && (
          <LoadMoreButton onClick={loadMoreMessages}>Daha Fazla Yükle</LoadMoreButton>
        )}
        {loading ? (
          <LoadingText>Mesajlar yükleniyor...</LoadingText>
        ) : messages.length > 0 ? (
          messages.map(message => (
            <Message 
              key={message._id} 
              message={message} 
              currentUser={user}
            />
          ))
        ) : (
          <EmptyMessages>
            <h3>Henüz mesaj yok!</h3>
            <p>Bu kanalda ilk mesajı gönderen siz olun.</p>
          </EmptyMessages>
        )}
        <div ref={messagesEndRef} />
      </MessagesContainer>
      
      <TypingIndicator>
        {typingUsers.length > 0 && (
          <p>
            {typingUsers.map(u => u.username).join(', ')} yazıyor
            <span className="dots">
              <span>.</span>
              <span>.</span>
              <span>.</span>
            </span>
          </p>
        )}
      </TypingIndicator>
      
      <ChatInputContainer onSubmit={handleSendMessage}>
        <AttachButton type="button">
          <input
            type="file"
            accept="image/*,application/pdf,.docx,.txt"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
            id="file-upload"
          />
          <label htmlFor="file-upload">
            <FaPaperclip />
          </label>
        </AttachButton>
        
        <ChatInput 
          type="text" 
          value={messageText}
          onChange={handleInputChange}
          placeholder={`# ${activeChannel?.name} kanalına mesaj gönder`}
        />
        
        <EmojiButton type="button">
          <FaSmile />
        </EmojiButton>
        
        <SendButton type="submit" disabled={!messageText.trim()}>
          <FaPaperPlane />
        </SendButton>
      </ChatInputContainer>
    </ChatContainer>
  );
};

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const ChatHeader = styled.div`
  padding: 0.75rem 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  background-color: #36393f;
`;

const ChannelName = styled.h3`
  margin: 0;
  color: #fff;
  font-size: 1rem;
`;

const ChannelDescription = styled.p`
  margin: 0.25rem 0 0;
  color: #b9bbbe;
  font-size: 0.85rem;
`;

const PinnedMessage = styled.div`
  background-color: #40444b;
  padding: 0.5rem;
  border-radius: 4px;
  margin-top: 0.5rem;
  color: #fff;
`;

const UnpinButton = styled.button`
  background-color: #f04747;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #d13636;
  }
`;

const MessagesContainer = styled.div`
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  background-color: #36393f;
`;

const LoadMoreButton = styled.button`
  background-color: #7289da;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 1rem;

  &:hover {
    background-color: #5f73bc;
  }
`;

const EmptyMessages = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #dcddde;
  text-align: center;
  
  h3 {
    margin-bottom: 0.5rem;
  }
  
  p {
    color: #b9bbbe;
  }
`;

const LoadingText = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #dcddde;
`;

const TypingIndicator = styled.div`
  padding: 0 1rem;
  height: 24px;
  color: #b9bbbe;
  font-size: 0.85rem;
  
  p {
    margin: 0;
  }
  
  .dots {
    display: inline-block;
    
    span {
      animation: dot 1.4s infinite;
      animation-fill-mode: both;
      
      &:nth-child(2) {
        animation-delay: 0.2s;
      }
      
      &:nth-child(3) {
        animation-delay: 0.4s;
      }
    }
  }
  
  @keyframes dot {
    0% {
      opacity: 0.2;
    }
    20% {
      opacity: 1;
    }
    100% {
      opacity: 0.2;
    }
  }
`;

const ChatInputContainer = styled.form`
  padding: 0.5rem 1rem 1rem;
  display: flex;
  align-items: center;
  background-color: #36393f;
`;

const ChatInput = styled.input`
  flex: 1;
  padding: 0.75rem;
  background-color: #40444b;
  border: none;
  border-radius: 8px;
  color: #dcddde;
  font-size: 1rem;
  
  &:focus {
    outline: none;
  }
`;

const IconButton = styled.button`
  background: none;
  border: none;
  color: #b9bbbe;
  font-size: 1.1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  
  &:hover {
    color: #dcddde;
  }
  
  &:disabled {
    color: #72767d;
    cursor: not-allowed;
  }
`;

const AttachButton = styled(IconButton)`
  margin-right: 0.5rem;
`;

const EmojiButton = styled(IconButton)`
  margin: 0 0.5rem;
`;

const SendButton = styled(IconButton)`
  color: ${props => props.disabled ? '#72767d' : '#7289da'};
  
  &:hover {
    color: ${props => props.disabled ? '#72767d' : '#5f73bc'};
  }
`;

export default ChatArea;