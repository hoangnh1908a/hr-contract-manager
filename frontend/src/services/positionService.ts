import { createCrudService, SearchParams } from './crudService';

// Define the Position interface
export interface Position {
    id: number;
    name: string;
    nameEn: string;
    status: number;
    description?: string;
}

// Create position service using the CRUD service factory
export const positionService = createCrudService<Position>('/position');

// Legacy API functions for backward compatibility
// Get all positions
export const getPositions = async (
    page: number = 0,
    pageSize: number = 10,
    sortField: keyof Position | string = 'id',
    sortOrder: string = 'asc',
    searchParams: SearchParams = { name: '' }
): Promise<{ positions: Position[]; totalElements: number }> => {
    try {
        const response = await positionService.getAll(page, pageSize, sortField, sortOrder, searchParams);
        return { positions: response.content, totalElements: response.totalElements }
    } catch (error) {
        console.error('Error fetching positions:', error);
        throw error;
    }
};

// Get positions by department ID
export const getPositionsByDepartment = async (departmentId: number): Promise<Position[]> => {
    try {
        const response = await positionService.getAll(0, 1000, 'name', 'asc', { departmentId });
        return response.content;
    } catch (error) {
        console.error('Error fetching positions by department:', error);
        throw error;
    }
};

// Create a new position
export const createPosition = async (position: Omit<Position, 'id'>): Promise<Position> => {
    try {
        return await positionService.post('/position/create', position);
    } catch (error) {
        console.error('Error creating position:', error);
        throw error;
    }
};

// Update an existing position
export const updatePosition = async (position: Position): Promise<Position> => {
    try {
        return await positionService.post('/position/update', position);
    } catch (error) {
        console.error('Error updating position:', error);
        throw error;
    }
};

// Delete a position
export const deletePosition = async (id: number): Promise<void> => {
    try {
        await positionService.post('/position/delete', id);
    } catch (error) {
        console.error('Error deleting position:', error);
        throw error;
    }
};
