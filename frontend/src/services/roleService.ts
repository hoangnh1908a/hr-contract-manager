// Define the Role interface
export interface Role {
  id: number;
  name: string;
  nameEn: string;
  status: number;
}

import { createCrudService, SearchParams } from './crudService';

// Create role service using the CRUD service factory with custom paths
export const roleService = createCrudService<Role>('/role');

// Legacy API functions for backward compatibility
// Get all roles
export const getRoles = async (
  page: number = 0,
  pageSize: number = 10,
  sortField: keyof Role | string = 'id',
  sortOrder: string = 'asc',
  searchParams: SearchParams = { name: '' }
): Promise<{ roles: Role[]; totalElements: number }> => {
  try {
    const response = await roleService.getAll(page, pageSize, sortField, sortOrder, searchParams);
    return {
      roles: response.content,
      totalElements: response.totalElements
    };
  } catch (error) {
    console.error('Error fetching roles:', error);
    throw error;
  }
};

// Create a new role
export const createRole = async (role: Omit<Role, 'id'>): Promise<Role> => {
  try {
    return await roleService.post('/role/create', role);
  } catch (error) {
    console.error('Error creating role:', error);
    throw error;
  }
};

// Update an existing role
export const updateRole = async (role: Role): Promise<Role> => {
  try {
    return await roleService.post('/role/update', role);
  } catch (error) {
    console.error('Error updating role:', error);
    throw error;
  }
};

// Delete a role
export const deleteRole = async (id: number): Promise<void> => {
  try {
    await roleService.post('/role/delete', id);
  } catch (error) {
    console.error('Error deleting role:', error);
    throw error;
  }
};
