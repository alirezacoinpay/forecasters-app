import React from 'react';
import { ApiError } from '../../types/api';
import './ApiStatus.css';

interface ApiStatusProps {
    loading?: boolean;
    error?: ApiError | null;
    loadingText?: string;
    className?: string;
}

export const ApiStatus: React.FC<ApiStatusProps> = ({
                                                        loading = false,
                                                        error = null,
                                                        loadingText = 'در حال بارگذاری...',
                                                        className = '',
                                                    }) => {
    if (loading) {
        return (
            <div className={`api-status loading ${className}`}>
                <div className="spinner"></div>
                <span>{loadingText}</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`api-status error ${className}`}>
                <div className="error-icon">⚠️</div>
                <div className="error-message">
                    <h4>خطا در ارتباط با سرور</h4>
                    <p>{error.details?.message || error.message}</p>
                    {error.status === 403 && (
                        <p className="error-detail">شما دسترسی لازم برای این عملیات را ندارید.</p>
                    )}
                    {error.status === 404 && (
                        <p className="error-detail">منبع مورد نظر یافت نشد.</p>
                    )}
                    {error.status === 500 && (
                        <p className="error-detail">خطای داخلی سرور. لطفاً稍后 مجدداً تلاش کنید.</p>
                    )}
                </div>
            </div>
        );
    }

    return null;
};