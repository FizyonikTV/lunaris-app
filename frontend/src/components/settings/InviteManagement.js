import React, { useState } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { createInvite, joinServer } from '../../store/slices/serverSlice';

const InviteManagement = ({ serverId }) => {
  const dispatch = useDispatch();
  const [inviteCode, setInviteCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');

  const handleCreateInvite = async () => {
    const response = await dispatch(createInvite(serverId));
    if (response.payload) {
      setGeneratedCode(response.payload.inviteCode);
    }
  };

  const handleJoinServer = () => {
    dispatch(joinServer(inviteCode));
    setInviteCode('');
  };

  return (
    <InviteContainer>
      <h2>Davet Yönetimi</h2>
      <Section>
        <h3>Davet Oluştur</h3>
        <button onClick={handleCreateInvite}>Davet Kodu Oluştur</button>
        {generatedCode && <InviteCode>Kod: {generatedCode}</InviteCode>}
      </Section>
      <Section>
        <h3>Sunucuya Katıl</h3>
        <input
          type="text"
          placeholder="Davet kodunu girin"
          value={inviteCode}
          onChange={(e) => setInviteCode(e.target.value)}
        />
        <button onClick={handleJoinServer}>Katıl</button>
      </Section>
    </InviteContainer>
  );
};

const InviteContainer = styled.div`
  padding: 1rem;
  background-color: #2f3136;
  color: #fff;
`;

const Section = styled.div`
  margin-bottom: 1.5rem;

  h3 {
    margin-bottom: 0.5rem;
  }

  button {
    margin-top: 0.5rem;
    padding: 0.5rem 1rem;
    background-color: #7289da;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
      background-color: #5f73bc;
    }
  }

  input {
    width: 100%;
    padding: 0.5rem;
    margin-top: 0.5rem;
    border-radius: 5px;
    border: 1px solid #40444b;
    background-color: #40444b;
    color: #fff;
  }
`;

const InviteCode = styled.p`
  margin-top: 0.5rem;
  color: #b9bbbe;
`;

export default InviteManagement;