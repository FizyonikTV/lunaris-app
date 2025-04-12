import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { fetchChannels, createChannel } from '../../store/slices/channelSlice';
import { logout } from '../../store/slices/authSlice';
import { FaPlus, FaCog, FaSignOutAlt } from 'react-icons/fa';
import UserStatusDropdown from './UserStatusDropdown';

const Sidebar = ({ activeServer, setActiveChannel, activeChannel }) => {
  const dispatch = useDispatch();
  const { channels, loading } = useSelector(state => state.channels);
  const { user } = useSelector(state => state.auth);
  
  const [showChannelModal, setShowChannelModal] = useState(false);
  const [channelName, setChannelName] = useState('');
  const [channelType, setChannelType] = useState('text');

  useEffect(() => {
    if (activeServer) {
      dispatch(fetchChannels(activeServer._id));
    }
  }, [activeServer, dispatch]);
  
  const handleChannelClick = (channel) => {
    setActiveChannel(channel);
  };
  
  const handleLogout = () => {
    dispatch(logout());
  };

  const handleCreateChannel = (e) => {
    e.preventDefault();
    dispatch(createChannel({ serverId: activeServer._id, channelData: { name: channelName, type: channelType } }));
    setShowChannelModal(false);
    setChannelName('');
  };
  
  return (
    <SidebarContainer>
      {activeServer ? (
        <>
          <ServerHeader>
            <h2>{activeServer.name}</h2>
            <Link to={`/dashboard/server/${activeServer._id}/settings`}>
              <FaCog />
            </Link>
          </ServerHeader>
          
          <ChannelSection>
            <ChannelHeader>
              <h3>Metin Kanalları</h3>
              <AddButton onClick={() => setShowChannelModal(true)}>
                <FaPlus />
              </AddButton>
            </ChannelHeader>
            
            {loading ? (
              <LoadingText>Kanallar yükleniyor...</LoadingText>
            ) : (
              <ChannelList>
                {channels.filter(c => c.type === 'text').map(channel => (
                  <ChannelItem 
                    key={channel._id}
                    active={activeChannel && activeChannel._id === channel._id}
                    onClick={() => handleChannelClick(channel)}
                  >
                    # {channel.name}
                  </ChannelItem>
                ))}
              </ChannelList>
            )}
          </ChannelSection>
          
          <ChannelSection>
            <ChannelHeader>
              <h3>Sesli Kanallar</h3>
              <AddButton onClick={() => setShowChannelModal(true)}>
                <FaPlus />
              </AddButton>
            </ChannelHeader>
            
            {loading ? (
              <LoadingText>Kanallar yükleniyor...</LoadingText>
            ) : (
              <ChannelList>
                {channels.filter(c => c.type === 'voice').map(channel => (
                  <ChannelItem 
                    key={channel._id}
                    active={activeChannel && activeChannel._id === channel._id}
                    onClick={() => handleChannelClick(channel)}
                  >
                    🔊 {channel.name}
                  </ChannelItem>
                ))}
              </ChannelList>
            )}
          </ChannelSection>
        </>
      ) : (
        <NoServerSelected>
          <p>Lütfen bir sunucu seçin veya yeni bir sunucu oluşturun.</p>
        </NoServerSelected>
      )}
      
      {showChannelModal && (
        <ModalOverlay onClick={() => setShowChannelModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <h2>Yeni Kanal Oluştur</h2>
            <form onSubmit={handleCreateChannel}>
              <FormGroup>
                <label>Kanal Adı</label>
                <input
                  type="text"
                  value={channelName}
                  onChange={(e) => setChannelName(e.target.value)}
                  required
                />
              </FormGroup>
              <FormGroup>
                <label>Kanal Türü</label>
                <select
                  value={channelType}
                  onChange={(e) => setChannelType(e.target.value)}
                >
                  <option value="text">Metin</option>
                  <option value="voice">Sesli</option>
                </select>
              </FormGroup>
              <ButtonGroup>
                <CancelButton type="button" onClick={() => setShowChannelModal(false)}>
                  İptal
                </CancelButton>
                <SubmitButton type="submit">Oluştur</SubmitButton>
              </ButtonGroup>
            </form>
          </ModalContent>
        </ModalOverlay>
      )}
      
      <UserPanel>
        <UserInfo>
          <UserAvatar>
            {user?.username.charAt(0).toUpperCase()}
          </UserAvatar>
          <UserName>{user?.username}</UserName>
        </UserInfo>
        <UserActions>
          <UserStatusDropdown />
          <SettingsButton to="/dashboard/settings">
            <FaCog />
          </SettingsButton>
          <LogoutButton onClick={handleLogout}>
            <FaSignOutAlt />
          </LogoutButton>
        </UserActions>
      </UserPanel>
    </SidebarContainer>
  );
};

const SidebarContainer = styled.div`
  width: 240px;
  background-color: #2f3136;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const ServerHeader = styled.div`
  padding: 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  h2 {
    color: #fff;
    font-size: 1.1rem;
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  a {
    color: #b9bbbe;
    font-size: 1rem;
    
    &:hover {
      color: #fff;
    }
  }
`;

const ChannelSection = styled.div`
  margin-top: 1rem;
`;

const ChannelHeader = styled.div`
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  h3 {
    color: #8e9297;
    font-size: 0.8rem;
    text-transform: uppercase;
    margin: 0;
  }
`;

const AddButton = styled.button`
  background: none;
  border: none;
  color: #8e9297;
  cursor: pointer;
  font-size: 0.9rem;
  
  &:hover {
    color: #dcddde;
  }
`;

const ChannelList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0.5rem 0;
`;

const ChannelItem = styled.li`
  padding: 0.5rem 1rem;
  margin: 0.2rem 0;
  border-radius: 4px;
  color: ${props => props.active ? '#fff' : '#8e9297'};
  background-color: ${props => props.active ? 'rgba(79, 84, 92, 0.6)' : 'transparent'};
  cursor: pointer;
  font-size: 0.9rem;
  
  &:hover {
    background-color: ${props => props.active ? 'rgba(79, 84, 92, 0.6)' : 'rgba(79, 84, 92, 0.3)'};
    color: #dcddde;
  }
`;

const NoServerSelected = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  padding: 1rem;
  text-align: center;
  
  p {
    color: #8e9297;
    font-size: 0.9rem;
  }
`;

const LoadingText = styled.div`
  padding: 0.5rem 1rem;
  color: #8e9297;
  font-size: 0.9rem;
`;

const UserPanel = styled.div`
  margin-top: auto;
  padding: 0.75rem;
  background-color: #292b2f;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
`;

const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #7289da;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  margin-right: 0.5rem;
`;

const UserName = styled.span`
  color: #fff;
  font-size: 0.9rem;
  font-weight: 500;
`;

const UserActions = styled.div`
  display: flex;
`;

const SettingsButton = styled(Link)`
  width: 32px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #b9bbbe;
  border-radius: 4px;
  margin-left: 0.25rem;
  
  &:hover {
    color: #fff;
    background-color: rgba(79, 84, 92, 0.3);
  }
`;

const LogoutButton = styled.button`
  width: 32px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: none;
  border: none;
  color: #b9bbbe;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 0.25rem;
  
  &:hover {
    color: #fff;
    background-color: rgba(79, 84, 92, 0.3);
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background-color: #36393f;
  padding: 1.5rem;
  border-radius: 8px;
  width: 300px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  
  h2 {
    color: #fff;
    font-size: 1.2rem;
    margin-bottom: 1rem;
  }
  
  form {
    display: flex;
    flex-direction: column;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
  
  label {
    color: #b9bbbe;
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
    display: block;
  }
  
  input, select {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #72767d;
    border-radius: 4px;
    background-color: #2f3136;
    color: #dcddde;
    font-size: 0.9rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  
  button {
    margin-left: 0.5rem;
  }
`;

const CancelButton = styled.button`
  background-color: #72767d;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: #5c5f63;
  }
`;

const SubmitButton = styled.button`
  background-color: #7289da;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: #5b6eae;
  }
`;

export default Sidebar;