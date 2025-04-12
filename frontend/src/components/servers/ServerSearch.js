import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { searchServers } from '../../store/slices/serverSlice';

const ServerSearch = () => {
  const dispatch = useDispatch();
  const { searchResults, loading } = useSelector((state) => state.servers);
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      dispatch(searchServers(query));
    }
  };

  return (
    <SearchContainer>
      <SearchForm onSubmit={handleSearch}>
        <SearchInput
          type="text"
          placeholder="Sunucu ara..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <SearchButton type="submit">Ara</SearchButton>
      </SearchForm>
      {loading ? (
        <LoadingText>Aranıyor...</LoadingText>
      ) : (
        <SearchResults>
          {searchResults.map((server) => (
            <ServerItem key={server._id}>
              <ServerIcon src={server.icon || 'https://via.placeholder.com/40'} alt={server.name} />
              <ServerInfo>
                <ServerName>{server.name}</ServerName>
                <MemberCount>{server.members.length} üye</MemberCount>
              </ServerInfo>
            </ServerItem>
          ))}
        </SearchResults>
      )}
    </SearchContainer>
  );
};

const SearchContainer = styled.div`
  padding: 1rem;
  background-color: #2f3136;
  color: #fff;
`;

const SearchForm = styled.form`
  display: flex;
  margin-bottom: 1rem;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 0.5rem;
  border: none;
  border-radius: 4px;
  background-color: #40444b;
  color: #fff;

  &:focus {
    outline: none;
  }
`;

const SearchButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #7289da;
  color: #fff;
  border: none;
  border-radius: 4px;
  margin-left: 0.5rem;
  cursor: pointer;

  &:hover {
    background-color: #5f73bc;
  }
`;

const LoadingText = styled.p`
  color: #b9bbbe;
`;

const SearchResults = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ServerItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem;
  background-color: #36393f;
  border-radius: 4px;
`;

const ServerIcon = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
`;

const ServerInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const ServerName = styled.span`
  font-weight: bold;
  color: #fff;
`;

const MemberCount = styled.span`
  color: #b9bbbe;
  font-size: 0.85rem;
`;

export default ServerSearch;