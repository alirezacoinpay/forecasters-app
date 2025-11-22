import React, { useEffect, useState, useCallback } from 'react';
import { userService } from '../../services/userService.service.ts';
import { useApi } from '../../hooks/useApi';
import { ApiStatus } from '../apiStatus/ApiStatus.tsx';
import { User, UserListParams } from '../../types/api';
import './UsersList.css';

interface UsersListProps {
    searchQuery?: string;
    onUserSelect?: (user: User) => void;
}

export const UsersList: React.FC<UsersListProps> = ({
                                                        searchQuery = '',
                                                        onUserSelect
                                                    }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
    });

    const fetchUsers = useCallback(async (params: UserListParams = {}) => {
        return userService.getUsers(params);
    }, []);

    const {
        data: usersData,
        loading,
        error,
        execute: fetchUsersData,
    } = useApi(fetchUsers, { immediate: false });

    useEffect(() => {
        if (usersData) {
            setUsers(usersData.data);
            setPagination(usersData.pagination);
        }
    }, [usersData]);

    useEffect(() => {
        loadUsers();
    }, [pagination.page, searchQuery]);

    const loadUsers = useCallback((): void => {
        const params: UserListParams = {
            page: pagination.page,
            limit: pagination.limit,
            ...(searchQuery && { search: searchQuery }),
        };

        fetchUsersData(params);
    }, [pagination.page, pagination.limit, searchQuery, fetchUsersData]);

    const handleDeleteUser = async (userId: string): Promise<void> => {
        if (!window.confirm('آیا از حذف این کاربر اطمینان دارید؟')) {
            return;
        }

        try {
            await userService.deleteUser(userId);
            setUsers(users.filter(user => user.id !== userId));
        } catch (err) {
            console.error('خطا در حذف کاربر:', err);
        }
    };

    const handlePageChange = (newPage: number): void => {
        setPagination(prev => ({ ...prev, page: newPage }));
    };

    if (loading && users.length === 0) {
        return (
            <ApiStatus
                loading={true}
                loadingText="در حال دریافت کاربران..."
            />
        );
    }

    return (
        <div className="users-list">
            <ApiStatus loading={loading} error={error} />

            <div className="users-grid">
                {users.map(user => (
                    <div key={user.id} className="user-card">
                        <div className="user-avatar">
                            {user.avatar ? (
                                <img src={user.avatar} alt={user.name} />
                            ) : (
                                <div className="avatar-placeholder">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>

                        <div className="user-info">
                            <h3
                                className="user-name"
                                onClick={() => onUserSelect?.(user)}
                            >
                                {user.name}
                            </h3>
                            <p className="user-email">{user.email}</p>
                            <span className={`user-role ${user.role}`}>
                {user.role === 'admin' ? 'مدیر' : 'کاربر'}
              </span>
                        </div>

                        <div className="user-actions">
                            <button
                                className="btn btn-danger"
                                onClick={() => handleDeleteUser(user.id)}
                                disabled={loading}
                            >
                                حذف
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {pagination.totalPages > 1 && (
                <div className="pagination">
                    <button
                        className="btn btn-secondary"
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page === 1 || loading}
                    >
                        قبلی
                    </button>

                    <span className="pagination-info">
            صفحه {pagination.page} از {pagination.totalPages}
          </span>

                    <button
                        className="btn btn-secondary"
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page === pagination.totalPages || loading}
                    >
                        بعدی
                    </button>
                </div>
            )}
        </div>
    );
};