import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearError } from '../store/slices/authSlice';
import styled from 'styled-components';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [passwordError, setPasswordError] = useState('');
  
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
  
  const { username, email, password, confirmPassword } = formData;
  
  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    
    // Şifre kontrolü
    if (e.target.name === 'confirmPassword') {
      if (password !== e.target.value) {
        setPasswordError('Şifreler eşleşmiyor');
      } else {
        setPasswordError('');
      }
    }
    
    if (e.target.name === 'password') {
      if (confirmPassword && confirmPassword !== e.target.value) {
        setPasswordError('Şifreler eşleşmiyor');
      } else {
        setPasswordError('');
      }
    }
  };
  
  const onSubmit = e => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setPasswordError('Şifreler eşleşmiyor');
      return;
    }
    
    dispatch(register({ username, email, password }));
  };
  
  return (
    <RegisterContainer>
      <FormCard>
        <h1>Hesap Oluştur</h1>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <form onSubmit={onSubmit}>
          <FormGroup>
            <label>Kullanıcı Adı</label>
            <input
              type="text"
              name="username"
              value={username}
              onChange={onChange}
              required
            />
          </FormGroup>
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
              minLength="6"
              required
            />
          </FormGroup>
          <FormGroup>
            <label>Şifre Tekrarı</label>
            <input
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={onChange}
              minLength="6"
              required
            />
            {passwordError && <ErrorText>{passwordError}</ErrorText>}
          </FormGroup>
          <Button type="submit" disabled={loading || passwordError}>
            {loading ? 'Kayıt Olunuyor...' : 'Kayıt Ol'}
          </Button>
        </form>
        <p>
          Zaten bir hesabınız var mı? <StyledLink to="/login">Giriş Yap</StyledLink>
        </p>
      </FormCard>
    </RegisterContainer>
  );
};

// Styled Components (her iki sayfa için ortak)
const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #36393f;
`;

const RegisterContainer = styled(LoginContainer)``;

const FormCard = styled.div`
  background-color: #2f3136;
  padding: 2rem;
  border-radius: 5px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.2);
  
  h1 {
    color: #fff;
    margin-bottom: 1.5rem;
    text-align: center;
  }
  
  p {
    color: #b9bbbe;
    margin-top: 1rem;
    text-align: center;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  
  label {
    display: block;
    color: #b9bbbe;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
    font-weight: 600;
    text-transform: uppercase;
  }
  
  input {
    width: 100%;
    padding: 0.75rem;
    background-color: #40444b;
    border: 1px solid rgba(0, 0, 0, 0.3);
    border-radius: 3px;
    color: #dcddde;
    font-size: 1rem;
    
    &:focus {
      outline: none;
      border-color: #7289da;
    }
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: #7289da;
  color: #fff;
  border: none;
  border-radius: 3px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #677bc4;
  }
  
  &:disabled {
    background-color: #677bc4;
    cursor: not-allowed;
  }
`;

const StyledLink = styled(Link)`
  color: #7289da;
  text-decoration: none;
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ErrorMessage = styled.div`
  background-color: rgba(240, 71, 71, 0.1);
  color: #f04747;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border-radius: 3px;
`;

const ErrorText = styled.span`
  color: #f04747;
  font-size: 0.8rem;
  margin-top: 0.25rem;
  display: block;
`;

export { Login, Register };