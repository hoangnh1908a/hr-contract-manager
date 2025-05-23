import { createCrudService, SearchParams } from './crudService';
import { getCurrentEmail } from './authService';
import { AxiosError } from 'axios';
import { customPost } from './apiClient';

// Define the User interface
export interface User {
    id: number;
    fullName: string;
    email: string;
    newPassword: string;
    role: string;
    roleId: number;
    status: number;
    createdAt: string;
}

// Create user service using the CRUD service factory
export const userService = createCrudService<User>('/auth/users');

// Legacy API functions for backward compatibility
// Get all users
export const getUsers = async (
    page: number = 0,
    pageSize: number = 10,
    sortField: keyof User | string = 'id',
    sortOrder: string = 'asc',
    searchParams: SearchParams = { name: '' }
): Promise<{ users: User[]; totalElements: number }> => {
    try {
        const response = await userService.getAll(page, pageSize, sortField, sortOrder, searchParams);
        return {
            users: response.content,
            totalElements: response.totalElements
        };
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};

// Create a new user
export const createUser = async (user: Omit<User, 'id' | 'createdAt'>): Promise<User> => {
    try {
        return await userService.post('/auth/user/create', user);
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
};

// Update an existing user
export const updateUser = async (user: Omit<User, 'createdAt'>): Promise<User> => {
    try {
        return await userService.post('/auth/user/update', user);
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
};

// Delete a user
export const resetPasswordByUser = async (id: number): Promise<void> => {
    try {
        await userService.post('/auth/user/resetPassword', id);
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
};

// User Reset password
export const resetPassword = async (newPassword: string, email: string): Promise<void> => {
    try {
        const user: Omit<User, 'id'> = {
            email: email,
            newPassword: newPassword,
            fullName: '',
            role: '',
            roleId: 0,
            status: 0,
            createdAt: ''
        }
        await userService.post('/auth/user/reset-password', user);
    } catch (error) {
        console.error('Error resetting password:', error);
        throw error;
    }
};
