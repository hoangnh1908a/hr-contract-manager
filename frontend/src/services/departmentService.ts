import { createCrudService, SearchParams } from './crudService';

// Define the Department interface
export interface Department {
    id: number;
    name: string;
    nameEn: string;
    status: number;
}

// Create department service using the CRUD service factory
export const departmentService = createCrudService<Department>('/department');

// Legacy API functions for backward compatibility
// Get all departments
export const getDepartments = async (
    page: number = 0,
    pageSize: number = 10,
    sortField: string = 'id',
    sortOrder: string = 'asc',
    searchParams: SearchParams = { name: '' }
): Promise<{ departments: Department[]; totalElements: number }> => {
    try {
        const response = await departmentService.getAll(page, pageSize, sortField, sortOrder, searchParams);
        return {
            departments: response.content,
            totalElements: response.totalElements
        };
    } catch (error) {
        console.error('Error fetching departments:', error);
        throw error;
    }
};

// Create a new department
export const createDepartment = async (department: Omit<Department, 'id'>): Promise<Department> => {
    try {
        return await departmentService.post('/department/create', department);
    } catch (error) {
        console.error('Error creating department:', error);
        throw error;
    }
};

// Update an existing department
export const updateDepartment = async (department: Department): Promise<Department> => {
    try {
        return await departmentService.post('/department/update', department);
    } catch (error) {
        console.error('Error updating department:', error);
        throw error;
    }
};

// Delete a department
export const deleteDepartment = async (id: number): Promise<void> => {
    try {
        await departmentService.post('/department/delete', id);
    } catch (error) {
        console.error('Error deleting department:', error);
        throw error;
    }
};
