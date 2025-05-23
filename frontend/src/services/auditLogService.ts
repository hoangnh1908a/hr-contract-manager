// Define the AuditLog interface
export interface AuditLog {
    id: number;
    fullName: string;
    action: string;
    tableName: string;
    recordId: number;
    timestamp: string;
    oldValue: string;
    newValue: string;
}

import { createCrudService, SearchParams } from './crudService';

// Create audit log service using the CRUD service factory
export const auditLogService = createCrudService<AuditLog>('/audit-log');

// Legacy API functions for backward compatibility
// Get all audit logs
export const getAuditLogs = async (
    page: number = 0,
    pageSize: number = 10,
    sortField: string = 'id',
    sortOrder: string = 'asc',
    searchParams: SearchParams = { name: '' }
): Promise<{ auditLogs: AuditLog[]; totalElements: number }> => {
    try {
        const response = await auditLogService.getAll(page, pageSize, sortField, sortOrder, searchParams);
        return {
            auditLogs: response.content,
            totalElements: response.totalElements
        };
    } catch (error) {
        console.error('Error fetching audit logs:', error);
        throw error;
    }
};

// Create a new audit log
export const createAuditLog = async (auditLog: Omit<AuditLog, 'id'>): Promise<AuditLog> => {
    try {
        return await auditLogService.post('/audit-log/create', auditLog);
    } catch (error) {
        console.error('Error creating audit log:', error);
        throw error;
    }
};

// Update an existing audit log
export const updateAuditLog = async (auditLog: AuditLog): Promise<AuditLog> => {
    try {
        return await auditLogService.post('/audit-log/update', auditLog);
    } catch (error) {
        console.error('Error updating audit log:', error);
        throw error;
    }
};

// Delete an audit log
export const deleteAuditLog = async (id: number): Promise<void> => {
    try {
        await auditLogService.post('/audit-log/delete', id);
    } catch (error) {
        console.error('Error deleting audit log:', error);
        throw error;
    }
};

// Get audit logs by table name
export const getAuditLogsByTable = async (tableName: string, page: number = 0, pageSize: number = 10) => {
    try {
        return await auditLogService.getAll(page, pageSize, 'timestamp', 'desc', { tableName });
    } catch (error) {
        console.error('Error fetching audit logs by table:', error);
        throw error;
    }
};

// Get audit logs by username
export const getAuditLogsByUser = async (username: string, page: number = 0, pageSize: number = 10) => {
    try {
        return await auditLogService.getAll(page, pageSize, 'timestamp', 'desc', { username });
    } catch (error) {
        console.error('Error fetching audit logs by user:', error);
        throw error;
    }
};

// Get audit logs by date range
export const getAuditLogsByDateRange = async (startDate: string, endDate: string, page: number = 0, pageSize: number = 10) => {
    try {
        return await auditLogService.getAll(page, pageSize, 'timestamp', 'desc', { startDate, endDate });
    } catch (error) {
        console.error('Error fetching audit logs by date range:', error);
        throw error;
    }
};
