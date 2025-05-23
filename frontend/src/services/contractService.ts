import { createCrudService, SearchParams } from './crudService';
import apiClient, { customPost, customPostFile } from './apiClient';

// Define the Contract interface
export interface Contract {
  id: number;
  employeeId: number;
  employerId?: number;
  htmlContract: string;
  contractTemplateId: number;
  contractStatusId: number;
  contractType: string;
  fileName: string;
  fileNameEn: string;
  description: string;
  createdBy: string;
  updatedBy: string;
}

export interface ContractDownloadResponse {
  fileName: string;
  file: Blob;
}

// Create contract service using the CRUD service factory
export const contractService = createCrudService<Contract>('/contract');

// Create contract service using the CRUD service factory
export const contractServiceDownload = createCrudService<ContractDownloadResponse>('/contract/download');

// Get all contracts (paginated with search functionality)
export const getContracts = async (
  page: number = 0,
  pageSize: number = 10,
  sortField: keyof Contract | string = 'id',
  sortOrder: string = 'desc',
  searchParams: SearchParams = {}
): Promise<{ contracts: Contract[]; totalElements: number }> => {
  try {
    const response = await contractService.getAll(page, pageSize, sortField, sortOrder, searchParams);
    return { contracts: response.content, totalElements: response.totalElements };
  } catch (error) {
    console.error('Error fetching contracts:', error);
    throw error;
  }
};

// Create a new contract
export const createContract = async (contract: Contract): Promise<Contract> => {
  try {
    return await contractService.post('/contract/create', contract);
  } catch (error) {
    console.error('Error creating contract:', error);
    throw error;
  }
};

// Update an existing contract
export const updateContract = async (contract: Contract): Promise<Contract> => {
  try {
    return await contractService.post('/contract/update', contract);
  } catch (error) {
    console.error('Error updating contract:', error);
    throw error;
  }
};

// Delete a contract
export const deleteContract = async (id: number): Promise<void> => {
  try {
    await contractService.post('/contract/delete', id);
  } catch (error) {
    console.error('Error deleting contract:', error);
    throw error;
  }
};

export const downloadContractFile = async (id: number): Promise<ContractDownloadResponse> => {
  try {
    // Use customPostFile directly instead of going through the service
    const response = await customPostFile<Blob>('/contract/download', id, {
      responseType: 'blob'
    });

    // Extract filename from headers if available, or use default
    let fileName = `contract-${id}`;

    // Try to get filenames from response headers
    const contentDisposition = response.headers?.['content-disposition'];
    if (contentDisposition) {
      const match = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition);
      if (match && match[1]) {
        fileName = match[1].replace(/['"]/g, '');
      }
    }

    return {
      fileName,
      file: new Blob([response.data], { type: response.headers['content-type'] })
    };
  } catch (error) {
    console.error('Error downloading contract file:', error);
    throw error;
  }
};
