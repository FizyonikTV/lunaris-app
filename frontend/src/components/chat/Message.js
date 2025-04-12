import React, { useState } from 'react';
import styled from 'styled-components';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { FaEllipsisV, FaReply, FaTrash, FaEdit, FaThumbtack } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { deleteMessage, updateMessage, addReaction, removeReaction } from '../../store/slices/messageSlice';

const Message = ({ message, currentUser, onPinMessage }) => {
  const dispatch = useDispatch();
  const [showOptions, setShowOptions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(message.content);
  
  const isAuthor = message.author._id === currentUser.id;
  const formattedDate = format(new Date(message.createdAt), 'HH:mm - d MMM yyyy', { locale: tr });
  
  const handleDelete = () => {
    dispatch(deleteMessage(message._id));
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();

    if (editedContent.trim() && editedContent !== message.content) {
      dispatch(updateMessage({ 
        messageId: message._id, 
        content: editedContent 
      }));
    }

    setIsEditing(false);
  };
  
  const handleEditCancel = () => {
    setIsEditing(false);
    setEditedContent(message.content);
  };

  const handleAddReaction = (emoji) => {
    dispatch(addReaction({ messageId: message._id, emoji }));
  };

  const handleRemoveReaction = (emoji) => {
    dispatch(removeReaction({ messageId: message._id, emoji }));
  };

  const handlePin = () => {
    onPinMessage(message._id);
  };
  
  return (
    <MessageContainer 
      onMouseEnter={() => setShowOptions(true)}
      onMouseLeave={() => setShowOptions(false)}
    >
      <Avatar src={message.author.avatar || 'https://via.placeholder.com/40'} alt="Avatar" />
      
      <MessageContent>
        <MessageHeader>
          <Username>{message.author.username}</Username>
          <Timestamp>{formattedDate}</Timestamp>
        </MessageHeader>
        
        {isEditing ? (
          <EditForm onSubmit={handleEditSubmit}>
            <EditInput 
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              autoFocus
            />
            <EditActions>
              <span>Esc ile iptal, Enter ile kaydet</span>
              <EditButtons>
                <CancelButton type="button" onClick={handleEditCancel}>
                  İptal
                </CancelButton>
                <SaveButton type="submit">
                  Kaydet
                </SaveButton>
              </EditButtons>
            </EditActions>
          </EditForm>
        ) : (
          <MessageText>
            {message.content}
            {message.edited && <EditedBadge>(düzenlendi)</EditedBadge>}
          </MessageText>
        )}

        <MessageAttachments>
          {message.attachments.map((attachment, index) => (
            <AttachmentLink key={index} href={attachment} target="_blank" rel="noopener noreferrer">
              {attachment.split('/').pop()}
            </AttachmentLink>
          ))}
        </MessageAttachments>

        <MessageReactions>
          {message.reactions.map((reaction) => (
            <Reaction key={reaction.emoji} onClick={() => handleRemoveReaction(reaction.emoji)}>
              {reaction.emoji} {reaction.users.length}
            </Reaction>
          ))}
          <AddReactionButton onClick={() => handleAddReaction('👍')}>👍</AddReactionButton>
        </MessageReactions>
      </MessageContent>
      
      {showOptions && !isEditing && (
        <MessageOptions>
          <IconButton title="Yanıtla">
            <FaReply />
          </IconButton>
          
          {isAuthor && (
            <>
              <IconButton title="Düzenle" onClick={() => setIsEditing(true)}>
                <FaEdit />
              </IconButton>
              <IconButton title="Sil" onClick={handleDelete}>
                <FaTrash />
              </IconButton>
            </>
          )}
          
          <IconButton title="Sabitle" onClick={handlePin}>
            <FaThumbtack />
          </IconButton>
          
          <IconButton title="Daha fazla">
            <FaEllipsisV />
          </IconButton>
        </MessageOptions>
      )}
    </MessageContainer>
  );
};

const MessageContainer = styled.div`
  display: flex;
  margin-bottom: 1rem;
  padding: 0.5rem;
  border-radius: 4px;
  position: relative;
  
  &:hover {
    background-color: #32353b;
  }
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 1rem;
`;

const MessageContent = styled.div`
  flex: 1;
`;

const MessageHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.25rem;
`;

const Username = styled.span`
  color: #fff;
  font-weight: 500;
  margin-right: 0.5rem;
`;

const Timestamp = styled.span`
  color: #72767d;
  font-size: 0.75rem;
`;

const MessageText = styled.p`
  color: #dcddde;
  margin: 0;
  line-height: 1.4;
  word-wrap: break-word;
`;

const EditedBadge = styled.span`
  margin-left: 0.5rem;
  color: #72767d;
  font-size: 0.75rem;
  font-style: italic;
`;

const MessageAttachments = styled.div`
  margin-top: 0.5rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const AttachmentLink = styled.a`
  color: #7289da;
  text-decoration: none;
  font-size: 0.9rem;

  &:hover {
    text-decoration: underline;
  }
`;

const MessageReactions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const Reaction = styled.button`
  background-color: #40444b;
  border: none;
  border-radius: 4px;
  color: #dcddde;
  padding: 0.3rem 0.6rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  
  &:hover {
    background-color: #5f73bc;
  }
`;

const AddReactionButton = styled.button`
  background-color: #7289da;
  border: none;
  border-radius: 4px;
  color: #fff;
  padding: 0.3rem 0.6rem;
  cursor: pointer;
  
  &:hover {
    background-color: #5f73bc;
  }
`;

const MessageOptions = styled.div`
  position: absolute;
  right: 1rem;
  top: 0.5rem;
  display: flex;
  background-color: #36393f;
  border-radius: 4px;
  border: 1px solid #202225;
  overflow: hidden;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  color: #b9bbbe;
  padding: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: #dcddde;
    background-color: #40444b;
  }
`;

const EditForm = styled.form`
  width: 100%;
`;

const EditInput = styled.textarea`
  width: 100%;
  background-color: #40444b;
  border: none;
  border-radius: 4px;
  color: #dcddde;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  font-family: inherit;
  font-size: 1rem;
  resize: vertical;
  min-height: 60px;
  
  &:focus {
    outline: none;
  }
`;

const EditActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
  color: #b9bbbe;
`;

const EditButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ButtonBase = styled.button`
  padding: 0.3rem 0.75rem;
  border-radius: 3px;
  font-weight: 500;
  font-size: 0.75rem;
  cursor: pointer;
`;

const CancelButton = styled(ButtonBase)`
  background-color: transparent;
  border: 1px solid #4f545c;
  color: #b9bbbe;
  
  &:hover {
    border-color: #dcddde;
    color: #fff;
  }
`;

const SaveButton = styled(ButtonBase)`
  background-color: #7289da;
  border: none;
  color: #fff;
  
  &:hover {
    background-color: #5f73bc;
  }
`;

export default Message;