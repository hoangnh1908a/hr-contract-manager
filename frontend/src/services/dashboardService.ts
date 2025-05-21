import { customGet } from './apiClient';
import { createCrudService } from './crudService';

// Define the Dashboard Statistics interface
export interface DashboardStats {
    totalEmployees: number;
    totalApprovedContracts: number;
    totalPendingContracts: number;
    totalContractExpiring: number;
}

// Define the Weekly/Monthly/Yearly Overview interface
export interface TimeSeriesData {
    labels: string[];
    data: number[];
    successRate: number;
}


export interface TableExpireStats {
    fullName: string;
    position: string;
    hireDate: string;
    contractEndDate: string;
    contractType: string;
    department: string;
}

// Create dashboard service using the CRUD service factory
export const dashboardService = createCrudService<DashboardStats>('/dashboard');

/**
 * Get dashboard overview statistics
 * @returns Promise with dashboard statistics
 */
export const getDashboardStats = async (): Promise<DashboardStats> => {
    try {
        return await customGet<DashboardStats>('/dashboard');
    } catch (error) {
        console.error('Error fetching dashboard statistics:', error);
        throw error;
    }
};
/**
 * Get department statistics
 * @param period - The time period for stats: '28days', 'month', or 'year'
 * @returns Promise with array of department statistics
 */
export const getTableExpire = async (period: string = '30'): Promise<TableExpireStats[]> => {
    try {
        return await customGet<TableExpireStats[]>(`/dashboard/table?monthExpire=${period}`);
    } catch (error) {
        console.error('Error fetching table expire statistics:', error);
        throw error;
    }
};
