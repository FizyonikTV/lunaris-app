import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import io from 'socket.io-client';

// Bileşenler
import Sidebar from '../components/Sidebar';
import ServerList from '../components/Serverlist'; // Düzeltme 1: Component adı düzeltildi
import ChannelList from '../components/ChannelList';
import ChatArea from '../components/CharArea'; // Düzeltme 2: Component adı düzeltildi
import UserSettings from '../components/settings/UserSettings';
import ServerSettings from '../components/settings/ServerSettings';
import ServerSearch from '../components/servers/ServerSearch';

// Socket.io bağlantısı
let socket;

const Dashboard = () => {
    const dispatch = useDispatch(); 
    const { user } = useSelector(state => state.auth);
    const [activeServer, setActiveServer] = useState(null);
    const [activeChannel, setActiveChannel] = useState(null);

    useEffect(() => {
        // Socket.io bağlantısını kur
        socket = io('http://localhost:5000');

        // Bağlantı olaylarını dinle
        socket.on('connect', () => {
            console.log('Socket connected:', socket.id);
        });

        //  Temizleme fonksiyonu
        return () => {
            socket.disconnect();
        };
    }, []); // Düzeltme 3: Fazladan parantez kaldırıldı

    return (
        <DashboardContainer>
            <ServerList
                setActiveServer={setActiveServer}
                activeServer={activeServer}
            />
        <MainContent>
            <Sidebar
                activeServer={activeServer}
                setActiveServer={setActiveServer}
                activeChannel={activeChannel}
            />
            <Routes>
            <Route path="/" element={
                activeChannel ? (
                    <ChatArea
                    socket={socket}
                    activeChannel={activeChannel}
                    user={user}
                />
              ) : (
                <WelcomeScreen>
                    <h2>Hoş Geldiniz!</h2>
                    <p>Sohbet etmek için bir kanal seçin veya bir kanal oluşturun.</p>
                </WelcomeScreen>
              )
            } />
            <Route path="/settings" element={<UserSettings />} />
            <Route path="/server/:serverId/settings" element={<ServerSettings />} />
            <Route path="/search" element={<ServerSearch />} />
        </Routes>
    </MainContent>
    </DashboardContainer>
    );
};

const DashboardContainer = styled.div`
    display: flex;
    height: 100vh;
    background-color: #36393f;
`;

const MainContent = styled.div`
    display: flex;
    flex: 1;
`;

const WelcomeScreen = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 1;
    color: #dcddde;

    h2 {
    margin-bottom: 1rem;
    font-size: 2rem;
    }

    p {
    font-size: 1.1rem;
    color: #b9bbbe;
    }
`;

export default Dashboard;