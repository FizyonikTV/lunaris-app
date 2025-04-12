import React, { useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { searchUsers } from '../../store/slices/userSlice';

const ChatInput = ({ onSendMessage }) => {
  const dispatch = useDispatch();
  const { searchResults } = useSelector((state) => state.users);
  const [message, setMessage] = useState('');
  const [mentionQuery, setMentionQuery] = useState('');
  const [showMentions, setShowMentions] = useState(false);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setMessage(value);

    const mentionMatch = value.match(/@(\w+)$/);
    if (mentionMatch) {
      setMentionQuery(mentionMatch[1]);
      dispatch(searchUsers(mentionMatch[1]));
      setShowMentions(true);
    } else {
      setShowMentions(false);
    }
  };

  const handleMentionClick = (username) => {
    const updatedMessage = message.replace(/@\w+$/, `@${username} `);
    setMessage(updatedMessage);
    setShowMentions(false);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <ChatInputContainer>
      <form onSubmit={handleSendMessage}>
        <Input
          type="text"
          value={message}
          onChange={handleInputChange}
          placeholder="Mesaj yazın..."
        />
        <SendButton type="submit">Gönder</SendButton>
      </form>
      {showMentions && (
        <MentionList>
          {searchResults.map((user) => (
            <MentionItem key={user._id} onClick={() => handleMentionClick(user.username)}>
              <Avatar src={user.avatar || 'https://via.placeholder.com/40'} alt="Avatar" />
              <Username>{user.username}</Username>
            </MentionItem>
          ))}
        </MentionList>
      )}
    </ChatInputContainer>
  );
};

const ChatInputContainer = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  background-color: #40444b;
  color: #fff;
`;

const SendButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #7289da;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #5f73bc;
  }
`;

const MentionList = styled.ul`
  position: absolute;
  bottom: 100%;
  left: 0;
  background-color: #2f3136;
  border-radius: 4px;
  overflow: hidden;
  z-index: 10;
`;

const MentionItem = styled.li`
  display: flex;
  align-items: center;
  padding: 0.5rem;
  cursor: pointer;

  &:hover {
    background-color: #40444b;
  }
`;

const Avatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 0.5rem;
`;

const Username = styled.span`
  color: #fff;
`;

export default ChatInput;