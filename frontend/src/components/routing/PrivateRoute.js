import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { loadUser } from '../../store/slices/authSlice';

const PrivateRoute = ({ children }) => {
    const dispatch = useDispatch();
    const { isAuthenticated, loading } = useSelector(state => state.auth);

    useEffect(() => {
        if (!isAuthenticated) {
            dispatch(loadUser());
        }
    }, [isAuthenticated, dispatch]);

    // Yükleniyor alanı
    if (loading) {
        return <div>Yükleniyor...</div>;
    }

    // Kimlik doğrulma konytrolü
    return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;

