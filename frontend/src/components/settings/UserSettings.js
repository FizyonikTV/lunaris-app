import React, { useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { updateUser } from '../../store/slices/authSlice';

const UserSettings = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [avatar, setAvatar] = useState(null);

  const handleAvatarChange = (e) => {
    setAvatar(e.target.files[0]);
  };

  const handleAvatarUpload = async () => {
    if (!avatar) return;

    const formData = new FormData();
    formData.append('avatar', avatar);

    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      };

      const response = await axios.post('/api/users/avatar', formData, config);
      dispatch(updateUser({ avatar: response.data.avatar }));
      alert('Avatar başarıyla yüklendi!');
    } catch (error) {
      console.error('Avatar yükleme hatası:', error);
      alert('Avatar yüklenirken bir hata oluştu.');
    }
  };

  return (
    <SettingsContainer>
      <h1>Kullanıcı Ayarları</h1>
      <AvatarSection>
        <AvatarPreview src={user?.avatar || 'https://via.placeholder.com/150'} alt="Avatar" />
        <input type="file" accept="image/*" onChange={handleAvatarChange} />
        <UploadButton onClick={handleAvatarUpload}>Avatar Yükle</UploadButton>
      </AvatarSection>
    </SettingsContainer>
  );
};

const SettingsContainer = styled.div`
  padding: 2rem;
  color: #fff;
  background-color: #36393f;
  height: 100%;
`;

const AvatarSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const AvatarPreview = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
`;

const UploadButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #7289da;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #5f73bc;
  }
`;

export default UserSettings;