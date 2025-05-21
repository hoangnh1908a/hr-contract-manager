import { createCrudService, SearchParams } from './crudService';

// Define the ContractApproval interface
export interface ContractApproval {
    id?: number;
    contractId: number;
    approvedBy: string;
    approvalStatus: string;
    approvalDate: string;
    comments?: string;
    createdBy?: string;
    updatedBy?: string;
    createdAt?: string;
    updatedAt?: string;
}

// Create contract approval service using the CRUD service factory
export const contractApprovalService = createCrudService<ContractApproval>('/contract-approval');

// Get all contract approvals (paginated with search functionality)
export const getContractApprovals = async (
    page: number = 0,
    pageSize: number = 10,
    sortField: keyof ContractApproval | string = 'id',
    sortOrder: string = 'asc',
    searchParams: SearchParams = {}
): Promise<{ contractApprovals: ContractApproval[]; totalElements: number }> => {
    try {
        const response = await contractApprovalService.getAll(page, pageSize, sortField, sortOrder, searchParams);
        return { contractApprovals: response.content, totalElements: response.totalElements };
    } catch (error) {
        console.error('Error fetching contract approvals:', error);
        throw error;
    }
};

// Get contract approval by ID
export const getContractApprovalById = async (id: number): Promise<ContractApproval> => {
    try {
        const response = await contractApprovalService.post(`/contract-approval/get/${id}`, {});
        return response;
    } catch (error) {
        console.error(`Error fetching contract approval with id ${id}:`, error);
        throw error;
    }
};

// Create a new contract approval
export const createContractApproval = async (data: ContractApproval): Promise<ContractApproval> => {
    try {
        return await contractApprovalService.post('/contract-approval/create', data);
    } catch (error) {
        console.error('Error creating contract approval:', error);
        throw error;
    }
};

// Update an existing contract approval
export const updateContractApproval = async (data: ContractApproval): Promise<ContractApproval> => {
    try {
        return await contractApprovalService.post('/contract-approval/update', data);
    } catch (error) {
        console.error('Error updating contract approval:', error);
        throw error;
    }
};

// Delete a contract approval
export const deleteContractApproval = async (id: number): Promise<void> => {
    try {
        await contractApprovalService.post('/contract-approval/delete', id);
    } catch (error) {
        console.error('Error deleting contract approval:', error);
        throw error;
    }
}; 
