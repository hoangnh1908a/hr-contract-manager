import { createCrudService } from './crudService';
import type { SearchParams } from './crudService'

// Define the ContractStatus interface
export interface ContractStatus {
    id: number;
    name: string;
    nameEn: string;
    description: string;
}

// Create contract status service using the CRUD service factory
export const contractStatusService = createCrudService<ContractStatus>('/contactStatus');

// Legacy API functions for backward compatibility
// Get all contract statuses (paginated)
export const getContractStatuses = async (
    page: number = 0,
    pageSize: number = 10,
    sortField: keyof ContractStatus | string = 'id',
    sortOrder: string = 'asc',
    searchParams: SearchParams = { name: '' }
): Promise<{ contractStatus: ContractStatus[]; totalElements: number }> => {
    try {
        const response = await contractStatusService.getAll(page, pageSize, sortField, sortOrder, searchParams)

        return { contractStatus: response.content, totalElements: response.totalElements }
    } catch (error) {
        console.error('Error fetching contract statuses:', error)
        throw error
    }
}

// Create a new contract status
export const createContractStatus = async (contractStatus: Omit<ContractStatus, 'id'>): Promise<ContractStatus> => {
    try {
        return await contractStatusService.post('/contactStatus/create', contractStatus);
    } catch (error) {
        console.error('Error creating contract status:', error);
        throw error;
    }
};

// Update an existing contract status
export const updateContractStatus = async (contractStatus: ContractStatus): Promise<ContractStatus> => {
    try {
        return await contractStatusService.post('/contactStatus/update', contractStatus);
    } catch (error) {
        console.error('Error updating contract status:', error);
        throw error;
    }
};

// Delete a contract status
export const deleteContractStatus = async (id: number): Promise<void> => {
    try {
        await contractStatusService.post('/contactStatus/delete', id);
    } catch (error) {
        console.error('Error deleting contract status:', error);
        throw error;
    }
};
