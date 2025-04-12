import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Home = () => {
  return (
    <HomeContainer>
      <h1>Hoş Geldiniz!</h1>
      <p>Lunaris uygulamasına hoş geldiniz. Lütfen giriş yapın veya kaydolun.</p>
      <ButtonGroup>
        <LinkButton to="/login">Giriş Yap</LinkButton>
        <LinkButton to="/register">Kaydol</LinkButton>
      </ButtonGroup>
    </HomeContainer>
  );
};

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #36393f;
  color: #fff;
`;

const ButtonGroup = styled.div`
  margin-top: 1rem;
  display: flex;
  gap: 1rem;
`;

const LinkButton = styled(Link)`
  padding: 0.75rem 1.5rem;
  background-color: #7289da;
  color: #fff;
  text-decoration: none;
  border-radius: 5px;
  font-weight: bold;

  &:hover {
    background-color: #5f73bc;
  }
`;

export default Home;