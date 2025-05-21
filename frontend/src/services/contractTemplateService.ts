import { customGet } from './apiClient';
import { createCrudService } from './crudService';

// Define the ContractTemplate interface
export interface ContractTemplate {
    id: number;
    fileName: string;
    fileNameEn: string;
    description: string;
    status: number;
    file: File | null;
    params: string;
}

// Create contract template service using the CRUD service factory
export const contractTemplateService = createCrudService<ContractTemplate>('/contractTemplate');

// Function to get HTML content of a contract template
export const getContractTemplateHtml = async (templateId: number): Promise<string> => {
    try {
        const response = await customGet<string>(`/docx/getHtml/${templateId}`);
        return response;
    } catch (error) {
        console.error('Error fetching contract template HTML:', error);
        throw error;
    }
};

// Legacy API functions for backward compatibility
// Get all contract templates
export const getContractTemplates = async (
    page: number = 0,
    pageSize: number = 10,
    sortField: string = 'id',
    sortOrder: string = 'asc',
    searchParams: any = {}
): Promise<{ contractTemplates: ContractTemplate[]; totalElements: number }> => {
    try {
        const response = await contractTemplateService.getAll(page, pageSize, sortField, sortOrder, searchParams);
        return { contractTemplates: response.content, totalElements: response.totalElements };
    } catch (error) {
        console.error('Error fetching contract templates:', error);
        throw error;
    }
};

// Create a new contract template
export const createContractTemplate = async (contractTemplate: Omit<ContractTemplate, 'id'>): Promise<ContractTemplate> => {
    try {
        console.log(contractTemplate);
        return await contractTemplateService.postForm('/contractTemplate/create', contractTemplate);
    } catch (error) {
        console.error('Error creating contract template:', error);
        throw error;
    }
};

// Update an existing contract template
export const updateContractTemplate = async (contractTemplate: ContractTemplate): Promise<ContractTemplate> => {
    try {
        return await contractTemplateService.postForm('/contractTemplate/update', contractTemplate);
    } catch (error) {
        console.error('Error updating contract template:', error);
        throw error;
    }
};

// Delete a contract template
export const deleteContractTemplate = async (id: number): Promise<void> => {
    try {
        await contractTemplateService.post('/contractTemplate/delete', id);
    } catch (error) {
        console.error('Error deleting contract template:', error);
        throw error;
    }
};
