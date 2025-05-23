import { createCrudService } from './crudService';

// Define the Employee interface
export interface Employee {
    id: number;
    numberId: string;
    fullName: string;
    dateOfBirth: string;
    departmentId: number;
    positionId: number;
    status: number;
    email: string;
    phone: string;
    sex: number;
    nationality: string;
    placeOfOrigin: string;
    placeOfResidence: string;
    htmlContract: string;
    employeeId: number;
    salary: string
    salaryAllowance: string
    hireDate: string
}

export interface EmployeeContract {
    employee: Employee;
    position: string;
    department: string;
}

// Create employee service using the CRUD service factory
export const employeeService = createCrudService<Employee>('/employee');
export const employeeContractService = createCrudService<EmployeeContract>('/employeeContract');
// Legacy API functions for backward compatibility
// Get all employees (paginated, like role page)
export const getEmployees = async (
    page: number = 0,
    pageSize: number = 10,
    sortField: string = 'id',
    sortOrder: string = 'asc',
    searchParams: any = {}
): Promise<{ employees: Employee[]; totalElements: number }> => {
    try {
        const response = await employeeService.getAll(page, pageSize, sortField, sortOrder, searchParams)
        return { employees: response.content, totalElements: response.totalElements }
    } catch (error) {
        console.error('Error fetching employees:', error)
        throw error
    }
}

// Create a new employee
export const createEmployee = async (employee: Omit<Employee, 'id'>): Promise<Employee> => {
    try {
        return await employeeService.post('/employee/create', employee);
    } catch (error) {
        console.error('Error creating employee:', error);
        throw error;
    }
};

// Update an existing employee
export const updateEmployee = async (employee: Employee): Promise<Employee> => {
    try {
        return await employeeService.post('/employee/update', employee);
    } catch (error) {
        console.error('Error updating employee:', error);
        throw error;
    }
};

// Delete an employee
export const deleteEmployee = async (id: number): Promise<void> => {
    try {
        await employeeService.post('/employee/delete', id);
    } catch (error) {
        console.error('Error deleting employee:', error);
        throw error;
    }
};


export const getAllNameEmployee = async (): Promise<Employee[]> => {
    try {
        const result = await employeeService.get('/employee/allName', {}) as unknown as Employee[];
        return result;
    } catch (error) {
        console.error('Error getting all name employee:', error);
        throw error;
    }
};

export const getEmployeeById = async (id: number): Promise<EmployeeContract> => {
    try {
        return await employeeContractService.post('/employee/get', id);
    } catch (error) {
        console.error('Error getting employee by id:', error);
        throw error;
    }
};
