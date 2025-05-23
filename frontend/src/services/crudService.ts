import { customGet, customPost, customPostFile, customPostForm } from './apiClient';
import axios from 'axios';

// Define the PaginatedResponse interface
export interface PaginatedResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    hasNext: boolean;
    hasPrevious: boolean;
}

// Interface for search params
export interface SearchParams {
    [key: string]: string | number | boolean;
}

/**
 * Creates a set of CRUD operations for a specific entity type
 * @param endpoint The base API endpoint for the entity
 * @param options Optional configuration for custom paths
 * @returns Object with CRUD operations
 */
export function createCrudService<T>(endpoint: string) {

    return {
        /**
         * Get a paginated list of entities with sorting and searching
         * @param page The page number (0-based)
         * @param pageSize The number of items per page
         * @param sortField The field to sort by
         * @param sortOrder The sort direction ('asc' or 'desc')
         * @param search Optional general search term
         * @param searchParams Optional specific search parameters for individual fields
         * @returns Promise with paginated response
         */
        getAll: async (
            page: number = 0,
            pageSize: number = 10,
            sortField: keyof T | string = 'id',
            sortOrder: string = 'desc',
            searchParams: SearchParams = {}
        ): Promise<PaginatedResponse<T>> => {
            try {
                // Combine general parameters with specific search parameters
                const params = {
                    page,
                    size: pageSize,
                    sort: `${String(sortField)},${sortOrder}`,
                    ...searchParams
                };

                return await customGet<PaginatedResponse<T>>(endpoint, params);
            } catch (error) {
                console.error(`Error fetching ${endpoint}:`, error);
                if (axios.isAxiosError(error) && error.response?.data?.message) {
                    throw new Error(error.response.data.message);
                }
                throw error;
            }
        },

        post: async (endpoint: string, data: Partial<T> | number): Promise<T> => {
            try {
                return await customPost<T>(endpoint, data);
            } catch (error) {
                console.error(`Error post ${endpoint}:`, error);
                if (axios.isAxiosError(error) && error.response?.data?.message) {
                    throw new Error(error.response.data.message);
                }
                throw error;
            }
        },

        get: async (endpoint: string, data: Partial<T> | number): Promise<T> => {
            try {
                return await customGet<T>(endpoint, data);
            } catch (error) {
                console.error(`Error get ${endpoint}:`, error);
                if (axios.isAxiosError(error) && error.response?.data?.message) {
                    throw new Error(error.response.data.message);
                }
                throw error;
            }
        },

        postForm: async (endpoint: string, data: Partial<T> | number): Promise<T> => {
            try {
                return await customPostForm<T>(endpoint, data);
            } catch (error) {
                console.error(`Error post form ${endpoint}:`, error);
                if (axios.isAxiosError(error) && error.response?.data?.message) {
                    throw new Error(error.response.data.message);
                }
                throw error;
            }
        },

        postFile: async (endpoint: string, data: Partial<T> | number): Promise<any> => {
            try {
                return await customPostFile<T>(endpoint, data);
            } catch (error) {
                console.error(`Error post file ${endpoint}:`, error);
                if (axios.isAxiosError(error) && error.response?.data?.message) {
                    throw new Error(error.response.data.message);
                }
                throw error;
            }
        }
    };
} 
