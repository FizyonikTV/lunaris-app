// frontend/src/pages/Login.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../store/slices/authSlice';
import styled from 'styled-components';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, error, loading } = useSelector(state => state.auth);
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
    
    return () => {
      if (error) {
        dispatch(clearError());
      }
    };
  }, [isAuthenticated, error, dispatch, navigate]);
  
  const { email, password } = formData;
  
  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const onSubmit = e => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };
  
  return (
    <LoginContainer>
      <FormCard>
        <h1>Giriş Yap</h1>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <form onSubmit={onSubmit}>
          <FormGroup>
            <label>E-posta</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <label>Şifre</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={onChange}
              required
            />
          </FormGroup>
          <Button type="submit" disabled={loading}>
            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </Button>
        </form>
        <p>
          Hesabınız yok mu? <StyledLink to="/register">Kaydol</StyledLink>
        </p>
      </FormCard>
    </LoginContainer>
  );
};