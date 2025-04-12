import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { clearNotification } from '../../store/slices/notificationSlice';

const Notification = () => {
  const dispatch = useDispatch();
  const { message, type } = useSelector((state) => state.notifications);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        dispatch(clearNotification());
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [message, dispatch]);

  if (!message) return null;

  return <NotificationContainer type={type}>{message}</NotificationContainer>;
};

const NotificationContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: ${(props) =>
    props.type === 'success' ? '#4caf50' :
    props.type === 'error' ? '#f44336' :
    '#2196f3'};
  color: white;
  padding: 1rem;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  z-index: 1000;
`;

export default Notification;