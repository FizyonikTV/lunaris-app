import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const ServerStats = ({ serverId }) => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await axios.get(`/api/servers/${serverId}/stats`, config);
        setStats(response.data);
      } catch (error) {
        console.error('Sunucu istatistikleri yüklenemedi:', error);
      }
    };

    fetchStats();
  }, [serverId]);

  if (!stats) {
    return <p>Yükleniyor...</p>;
  }

  return (
    <StatsContainer>
      <h2>Sunucu İstatistikleri</h2>
      <p>Toplam Üye: {stats.totalMembers}</p>
      <p>Aktif Üye: {stats.activeMembers}</p>
      <h3>Kanal Mesaj Sayıları:</h3>
      <ul>
        {stats.channelMessageCounts.map((channel) => (
          <li key={channel.channelId}>
            Kanal ID: {channel.channelId} - Mesaj Sayısı: {channel.messageCount}
          </li>
        ))}
      </ul>
    </StatsContainer>
  );
};

const StatsContainer = styled.div`
  padding: 1rem;
  background-color: #2f3136;
  color: #fff;
`;

export default ServerStats;