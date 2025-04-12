import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile, addFriend, removeFriend } from '../../store/slices/friendSlice';
import styled from 'styled-components';

const UserProfile = ({ userId }) => {
  const dispatch = useDispatch();
  const { profile, friends, loading } = useSelector((state) => state.friends);

  useEffect(() => {
    dispatch(fetchUserProfile(userId));
  }, [dispatch, userId]);

  const handleAddFriend = () => {
    dispatch(addFriend(userId));
  };

  const handleRemoveFriend = () => {
    dispatch(removeFriend(userId));
  };

  if (loading) {
    return <p>Yükleniyor...</p>;
  }

  if (!profile) {
    return <p>Kullanıcı bulunamadı.</p>;
  }

  const isFriend = friends.some((friend) => friend._id === userId);

  return (
    <ProfileContainer>
      <Avatar src={profile.avatar || 'https://via.placeholder.com/150'} alt="Avatar" />
      <h2>{profile.username}</h2>
      <p>{profile.email}</p>
      <p>Durum: {profile.status}</p>
      {isFriend ? (
        <ActionButton onClick={handleRemoveFriend}>Arkadaşlıktan Çıkar</ActionButton>
      ) : (
        <ActionButton onClick={handleAddFriend}>Arkadaş Ekle</ActionButton>
      )}
    </ProfileContainer>
  );
};

const ProfileContainer = styled.div`
  text-align: center;
  padding: 2rem;
  background-color: #36393f;
  color: #fff;
`;

const Avatar = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  margin-bottom: 1rem;
`;

const ActionButton = styled.button`
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

export default UserProfile;