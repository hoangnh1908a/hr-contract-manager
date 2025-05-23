import { createCrudService } from './crudService';
import type { SearchParams } from './crudService'

// Define the Config interface
export interface Config {
    id: number;
    type: string;
    code: string;
    name: string;
    nameEn: string;
    description: string;
}

// Create config service using the CRUD service factory
export const configService = createCrudService<Config>('/config');

// Legacy API functions for backward compatibility
// Get all configs (paginated)
export const getConfigs = async (
    page: number = 0,
    pageSize: number = 10,
    sortField: keyof Config | string = 'id',
    sortOrder: string = 'asc',
    searchParams: SearchParams = {}
): Promise<{ configs: Config[]; totalElements: number }> => {
    try {
        const response = await configService.getAll(page, pageSize, sortField, sortOrder, searchParams)
        return { configs: response.content, totalElements: response.totalElements }
    } catch (error) {
        console.error('Error fetching configs:', error)
        throw error
    }
}

// Create a new config
export const createConfig = async (config: Omit<Config, 'id'>): Promise<Config> => {
    try {
        return await configService.post('/config/create', config);
    } catch (error) {
        console.error('Error creating config:', error);
        throw error;
    }
};

// Update an existing config
export const updateConfig = async (config: Config): Promise<Config> => {
    try {
        return await configService.post('/config/update', config);
    } catch (error) {
        console.error('Error updating config:', error);
        throw error;
    }
};

// Delete a config
export const deleteConfig = async (id: number): Promise<void> => {
    try {
        await configService.post('/config/delete', id);
    } catch (error) {
        console.error('Error deleting config:', error);
        throw error;
    }
}; 
