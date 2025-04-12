import React from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { updateStatus } from '../../store/slices/authSlice';
import { getSocket } from '../../utils/socket';

const UserStatusDropdown = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleStatusChange = (status) => {
    dispatch(updateStatus(status));
    const socket = getSocket();
    socket.emit('update_status', status);
  };

  return (
    <DropdownContainer>
      <DropdownButton>{user?.status || 'Durum'}</DropdownButton>
      <DropdownMenu>
        {['online', 'idle', 'dnd', 'invisible', 'offline'].map((status) => (
          <DropdownItem key={status} onClick={() => handleStatusChange(status)}>
            {status}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </DropdownContainer>
  );
};

const DropdownContainer = styled.div`
  position: relative;
`;

const DropdownButton = styled.button`
  background-color: #7289da;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  background-color: #2f3136;
  border-radius: 5px;
  overflow: hidden;
  margin-top: 0.5rem;
`;

const DropdownItem = styled.div`
  padding: 0.5rem 1rem;
  color: #fff;
  cursor: pointer;

  &:hover {
    background-color: #40444b;
  }
`;

export default UserStatusDropdown;