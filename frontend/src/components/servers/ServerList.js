import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { fetchServers, createServer } from '../../store/slices/serverSlice';
import { FaPlus } from 'react-icons/fa';

const ServerList = ({ setActiveServer, activeServer }) => {
  const dispatch = useDispatch();
  const { servers, loading } = useSelector(state => state.servers);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newServerName, setNewServerName] = useState('');
  
  useEffect(() => {
    dispatch(fetchServers());
  }, [dispatch]);
  
  useEffect(() => {
    // İlk sunucu yüklendiğinde onu aktif olarak ayarla
    if (servers?.length > 0 && !activeServer) {
      setActiveServer(servers[0]);
    }
  }, [servers, activeServer, setActiveServer]);
  
  const handleServerClick = (server) => {
    setActiveServer(server);
  };
  
  const handleCreateServer = (e) => {
    e.preventDefault();
    
    if (newServerName.trim()) {
      dispatch(createServer({ name: newServerName }));
      setNewServerName('');
      setShowCreateModal(false);
    }
  };
  
  return (
    <ServerListContainer>
      {loading ? (
        <LoadingIndicator />
      ) : (
        <>
          {servers?.map(server => (
            <ServerIcon 
              key={server._id}
              onClick={() => handleServerClick(server)}
              active={activeServer && activeServer._id === server._id}
            >
              {server.icon ? (
                <img src={server.icon} alt={server.name} />
              ) : (
                <ServerInitial>{server.name.charAt(0).toUpperCase()}</ServerInitial>
              )}
              <ServerTooltip>{server.name}</ServerTooltip>
            </ServerIcon>
          ))}
          
          <AddServerButton onClick={() => setShowCreateModal(true)}>
            <FaPlus />
            <ServerTooltip>Yeni Sunucu Ekle</ServerTooltip>
          </AddServerButton>
          
          {showCreateModal && (
            <ModalOverlay onClick={() => setShowCreateModal(false)}>
              <ModalContent onClick={e => e.stopPropagation()}>
                <h2>Yeni Sunucu Oluştur</h2>
                <form onSubmit={handleCreateServer}>
                  <FormGroup>
                    <label>Sunucu Adı</label>
                    <input
                      type="text"
                      value={newServerName}
                      onChange={e => setNewServerName(e.target.value)}
                      placeholder="Sunucunuzun adı"
                      required
                    />
                  </FormGroup>
                  <ButtonGroup>
                    <CancelButton 
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                    >
                      İptal
                    </CancelButton>
                    <SubmitButton type="submit">Oluştur</SubmitButton>
                  </ButtonGroup>
                </form>
              </ModalContent>
            </ModalOverlay>
          )}
        </>
      )}
    </ServerListContainer>
  );
};

const ServerListContainer = styled.div`
  width: 72px;
  background-color: #202225;
  padding: 12px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
`;

const ServerIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: ${props => props.active ? '16px' : '50%'};
  background-color: #36393f;
  margin-bottom: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  position: relative;
  transition: border-radius 0.2s;
  
  &::before {
    content: '';
    position: absolute;
    left: -16px;
    width: 4px;
    height: ${props => props.active ? '40px' : '8px'};
    border-radius: 0 4px 4px 0;
    background-color: #fff;
    transition: height 0.2s;
    opacity: ${props => props.active ? 1 : 0};
    transform: ${props => props.active ? 'none' : 'translateY(-4px)'};
  }
  
  &:hover {
    border-radius: 16px;
    background-color: #7289da;
    
    &::before {
      opacity: 1;
      height: ${props => props.active ? '40px' : '20px'};
    }
  }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: inherit;
  }
`;

const ServerInitial = styled.span`
  color: #fff;
  font-size: 18px;
  font-weight: bold;
`;

const ServerTooltip = styled.span`
  position: absolute;
  left: 60px;
  background-color: #18191c;
  color: #fff;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 14px;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.2s;
  z-index: 10;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: -6px;
    transform: translateY(-50%);
    border-top: 6px solid transparent;
    border-bottom: 6px solid transparent;
    border-right: 6px solid #18191c;
  }
  
  ${ServerIcon}:hover &, ${AddServerButton}:hover & {
    opacity: 1;
  }
`;

const AddServerButton = styled.button`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: #36393f;
  border: 1px dashed #3ba55d;
  color: #3ba55d;
  font-size: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  position: relative;
  transition: border-radius 0.2s, background-color 0.2s;
  
  &:hover {
    border-radius: 16px;
    background-color: #3ba55d;
    color: #fff;
  }
`;

const LoadingIndicator = styled.div`
  width: 32px;
  height: 32px;
  border: 3px solid rgba(255, 255, 255, 0.2);
  border-top-color: #7289da;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
`;

const ModalContent = styled.div`
  background-color: #36393f;
  border-radius: 5px;
  padding: 1.5rem;
  width: 100%;
  max-width: 440px;
  
  h2 {
    color: #fff;
    margin-top: 0;
    margin-bottom: 1.5rem;
    text-align: center;
    font-size: 1.5rem;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  
  label {
    display: block;
    color: #b9bbbe;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
    font-weight: 600;
    text-transform: uppercase;
  }
  
  input {
    width: 100%;
    padding: 0.75rem;
    background-color: #40444b;
    border: 1px solid rgba(0, 0, 0, 0.3);
    border-radius: 3px;
    color: #dcddde;
    font-size: 1rem;
    
    &:focus {
      outline: none;
      border-color: #7289da;
    }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;

const Button = styled.button`
  padding: 0.75rem 1rem;
  border-radius: 3px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
`;

const CancelButton = styled(Button)`
  background-color: transparent;
  color: #fff;
  border: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const SubmitButton = styled(Button)`
  background-color: #7289da;
  color: #fff;
  border: none;
  
  &:hover {
    background-color: #677bc4;
  }
`;

export default ServerList;