import React from 'react';
import styled from 'styled-components';
import ServerStats from './ServerStats';

const ServerSettings = ({ serverId }) => {
  return (
    <SettingsContainer>
      <h1>Sunucu Ayarları</h1>
      <ServerStats serverId={serverId} />
    </SettingsContainer>
  );
};

const SettingsContainer = styled.div`
  padding: 2rem;
  color: #fff;
  background-color: #36393f;
  height: 100%;
`;

export default ServerSettings;