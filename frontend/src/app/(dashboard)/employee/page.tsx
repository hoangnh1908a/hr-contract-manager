'use client'

import { useState, useEffect, useMemo } from 'react'
import axios from 'axios'

// MUI Imports
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormLabel from '@mui/material/FormLabel'
import Grid from '@mui/material/Grid'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import type { SelectChangeEvent } from '@mui/material/Select'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Dialog from '@mui/material/Dialog'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import CircularProgress from '@mui/material/CircularProgress'
import Chip from '@mui/material/Chip'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import InputAdornment from '@mui/material/InputAdornment'

import { useLanguage } from '@/i18n/LanguageContext'

import type { Employee } from '@/services/employeeService'
import { getEmployees, createEmployee, updateEmployee, deleteEmployee } from '@/services/employeeService'
import type { Department } from '@/services/departmentService'
import { getDepartments } from '@/services/departmentService'
import type { Position } from '@/services/positionService'
import { getPositions } from '@/services/positionService'

// Define a custom type for form data to exclude id and related names
type EmployeeFormData = {
  fullName: string
  numberId: string
  dateOfBirth: string
  sex: number
  nationality: string
  placeOfOrigin: string
  placeOfResidence: string
  email: string
  phone: string
  departmentId: number
  positionId: number
  hireDate: string
  status: number
  salary: string
  salaryAllowance: string
}
type Order = 'asc' | 'desc'
type DialogMode = 'add' | 'edit' | null

const emptyFormData: EmployeeFormData = {
  fullName: '',
  numberId: '',
  dateOfBirth: '',
  sex: 0,
  nationality: '',
  placeOfOrigin: '',
  placeOfResidence: '',
  email: '',
  phone: '',
  departmentId: 0,
  positionId: 0,
  hireDate: '',
  status: 1,
  salary: '',
  salaryAllowance: ''
}

const EmployeePage = () => {
  const { t } = useLanguage()
  const [order, setOrder] = useState<Order>('asc')
  const [orderBy, setOrderBy] = useState<keyof EmployeeFormData>('fullName')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  // Data states
  const [employees, setEmployees] = useState<Employee[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [positions, setPositions] = useState<Position[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [totalElements, setTotalElements] = useState(0)

  // CRUD state
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)
  const [dialogMode, setDialogMode] = useState<DialogMode>(null)
  const [formData, setFormData] = useState<EmployeeFormData>(emptyFormData)
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  })

  // Add state for view dialog and selected employee after notification state
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)

  // Available row counts for the dropdown
  const availableRowsPerPage = [10, 20, 50, 100, 200, 500, 1000]

  // Replace single searchValue with multi-field search
  const [searchFields, setSearchFields] = useState({
    fullName: '',
    numberId: '',
    status: '',
    email: '',
    positionId: '',
    departmentId: ''
  })
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null)

  // Fetch data on component mount
  useEffect(() => {
    fetchEmployees()
    fetchDepartments()
    fetchPositions()
  }, [rowsPerPage, page, order, orderBy])

  // Function to fetch employees from API
  const fetchEmployees = async (fields = searchFields) => {
    setLoading(true)
    try {
      // Build searchParams from non-empty fields
      const searchParams: any = {}
      Object.entries(fields).forEach(([key, value]) => {
        if (value) searchParams[key] = value
      })
      const data = await getEmployees(page, rowsPerPage, orderBy, order, searchParams)
      setEmployees(data.employees)
      setTotalElements(data.totalElements)
      setError('')
    } catch (err) {
      setError('Failed to fetch employees')
      setEmployees([])
      setTotalElements(0)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchDepartments = async () => {
    try {
      const data = await getDepartments(0, 1000)
      console.log(data)
      setDepartments(data.departments)
    } catch (error) {
      console.error('Error fetching departments:', error)
    }
  }

  const fetchPositions = async () => {
    try {
      const data = await getPositions(0, 1000)
      setPositions(data.positions)
    } catch (error) {
      console.error('Error fetching positions:', error)
    }
  }

  const handleRequestSort = (property: keyof EmployeeFormData) => {
    const isAsc = orderBy === property && order === 'asc'

    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: SelectChangeEvent<number>) => {
    setRowsPerPage(Number(event.target.value))
    setPage(0)
  }

  // CRUD handlers
  const handleOpenAddDialog = () => {
    setFormData(emptyFormData)
    setDialogMode('add')
    setDialogOpen(true)
  }

  const handleOpenEditDialog = (employee: any) => {
    setFormData({
      fullName: employee.fullName || employee.full_name || '',
      numberId: employee.numberId || employee.number_id || '',
      dateOfBirth: employee.dateOfBirth || employee.date_of_birth || '',
      sex: Number(employee.sex ?? 0),
      nationality: employee.nationality || '',
      placeOfOrigin: employee.placeOfOrigin || employee.place_of_origin || '',
      placeOfResidence: employee.placeOfResidence || employee.place_of_residence || '',
      email: employee.email || '',
      phone: employee.phone || '',
      departmentId: Number(employee.departmentId || employee.department_id || 0),
      positionId: Number(employee.positionId || employee.position_id || 0),
      hireDate: employee.hireDate || employee.hire_date || '',
      status: Number(employee.status ?? 1),
      salary: employee.salary || '',
      salaryAllowance: employee.salaryAllowance || ''
    })
    setDialogMode('edit')
    setDialogOpen(true)
    setDeleteId(employee.id)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setDialogMode(null)
  }

  const handleOpenDeleteDialog = (id: number) => {
    setDeleteId(id)
    setDeleteOpen(true)
  }

  const handleCloseDeleteDialog = () => {
    setDeleteOpen(false)
    setDeleteId(null)
  }

  const handleFormChange = (field: keyof EmployeeFormData, value: string | number) => {
    setFormData((prev: EmployeeFormData) => ({ ...prev, [field]: value }))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target

    if (name === 'status') {
      handleFormChange('status', checked ? 1 : 0)
    } else if (name) {
      handleFormChange(name as keyof EmployeeFormData, value)
    }
  }

  const handleSelectChange = (event: SelectChangeEvent) => {
    const { name, value } = event.target
    handleFormChange(name as keyof EmployeeFormData, Number(value))
  }

  const handleSaveEmployee = async () => {
    try {
      if (dialogMode === 'add') {
        // Create new employee
        const employee = {
          fullName: formData.fullName,
          numberId: formData.numberId,
          email: formData.email,
          phone: formData.phone,
          hireDate: formData.hireDate,
          status: formData.status,
          dateOfBirth: formData.dateOfBirth,
          sex: formData.sex,
          nationality: formData.nationality,
          placeOfOrigin: formData.placeOfOrigin,
          placeOfResidence: formData.placeOfResidence,
          departmentId: formData.departmentId,
          positionId: formData.positionId,
          salary: formData.salary,
          salaryAllowance: formData.salaryAllowance
        }
        const newEmployee = await createEmployee(employee as any)
        setEmployees([...employees, newEmployee])
        showNotification(t.employees.employeeCreated, 'success')
      } else if (dialogMode === 'edit' && deleteId !== null) {
        // Update existing employee
        const employee = {
          id: deleteId,
          fullName: formData.fullName,
          numberId: formData.numberId,
          email: formData.email,
          phone: formData.phone,
          departmentId: formData.departmentId,
          positionId: formData.positionId,
          hireDate: formData.hireDate,
          status: formData.status,
          dateOfBirth: formData.dateOfBirth,
          sex: formData.sex,
          nationality: formData.nationality,
          placeOfOrigin: formData.placeOfOrigin,
          placeOfResidence: formData.placeOfResidence,
          salary: formData.salary,
          salaryAllowance: formData.salaryAllowance
        }
        await updateEmployee(employee as any)
        setEmployees(employees.map(emp => (emp.id === deleteId ? { ...emp, ...employee } : emp)))
        showNotification(t.employees.employeeUpdated, 'success')
      }

      handleCloseDialog()
    } catch (err) {
      if (axios.isAxiosError(err)) {
        showNotification(err.response?.data.message || t.common.error, 'error')
      } else {
        showNotification(t.common.operationFailed, 'error')
        console.error(err)
      }
    }
  }

  const handleDeleteEmployee = async () => {
    try {
      if (deleteId !== null) {
        await deleteEmployee(deleteId)
        setEmployees(employees.filter(emp => emp.id !== deleteId))
        showNotification(t.employees.employeeDeleted, 'success')
        handleCloseDeleteDialog()
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        showNotification(err.response?.data.message || t.common.error, 'error')
      } else {
        showNotification(t.common.deleteFailed, 'error')
        console.error(err)
      }
    }
  }

  const showNotification = (message: string, severity: 'success' | 'error') => {
    setNotification({ open: true, message, severity })
  }

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false })
  }

  // Get department name from ID
  const getDepartmentName = (departmentId: number) => {
    const department = departments.find(dept => dept.id == departmentId)
    return department ? department.name : '-'
  }

  // Get position name from ID
  const getPositionName = (positionId: number) => {
    const position = positions.find(pos => pos.id == positionId)
    return position ? position.name : '-'
  }

  const handleFieldSearchChange = (field: keyof typeof searchFields, value: string) => {
    const newFields = { ...searchFields, [field]: value }
    setSearchFields(newFields)
    if (searchTimeout) clearTimeout(searchTimeout)
    const timeout = setTimeout(() => {
      setPage(0)
      fetchEmployees(newFields)
    }, 500)
    setSearchTimeout(timeout)
  }

  const handleClearFilters = () => {
    setSearchFields({
      fullName: '',
      numberId: '',
      status: '',
      email: '',
      positionId: '',
      departmentId: ''
    })
    setPage(0)
    fetchEmployees({
      fullName: '',
      numberId: '',
      status: '',
      email: '',
      positionId: '',
      departmentId: ''
    })
  }

  const isFormDataValid = () => {
    return (
      formData.fullName.trim() !== '' &&
      formData.numberId.trim() !== '' &&
      formData.dateOfBirth.trim() !== '' &&
      (Number(formData.sex) === 0 || Number(formData.sex) === 1) &&
      formData.nationality.trim() !== '' &&
      formData.placeOfOrigin.trim() !== '' &&
      formData.placeOfResidence.trim() !== '' &&
      formData.email.trim() !== '' &&
      formData.phone.trim() !== '' &&
      Number(formData.departmentId) !== 0 &&
      Number(formData.positionId) !== 0 &&
      formData.hireDate.trim() !== '' &&
      (Number(formData.status) === 0 || Number(formData.status) === 1) &&
      formData.salary.trim() !== '' &&
      formData.salaryAllowance.trim() !== ''
    )
  }

  // Add handler functions inside EmployeePage
  const handleViewEmployee = (employee: Employee) => {
    setSelectedEmployee(employee)
    setViewDialogOpen(true)
  }
  const handleCloseViewDialog = () => {
    setViewDialogOpen(false)
    setSelectedEmployee(null)
  }

  return (
    <Card>
      <Box sx={{ p: 5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant='h4'>{t.employees.title}</Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Tooltip title='Refresh'>
              <IconButton onClick={() => fetchEmployees()} color='primary'>
                <i className='ri-refresh-line' />
              </IconButton>
            </Tooltip>
            <Button variant='contained' startIcon={<i className='ri-add-line' />} onClick={handleOpenAddDialog}>
              {t.employees.addEmployee}
            </Button>
          </Box>
        </Box>

        {/* Search Fields UI */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            {Object.values(searchFields).some(value => value !== '') && (
              <Button color='error' onClick={() => handleClearFilters()} startIcon={<i className='ri-close-line' />}>
                {t.common.filter}
              </Button>
            )}
          </Box>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  fullWidth
                  label={t.employees.fullName}
                  placeholder={`Search by ${t.employees.fullName.toLowerCase()}`}
                  value={searchFields.fullName}
                  onChange={e => handleFieldSearchChange('fullName', e.target.value)}
                  variant='outlined'
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  fullWidth
                  label={t.employees.numberId}
                  placeholder={`Search by ${t.employees.numberId.toLowerCase()}`}
                  value={searchFields.numberId}
                  onChange={e => handleFieldSearchChange('numberId', e.target.value)}
                  variant='outlined'
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  fullWidth
                  label={t.employees.email}
                  placeholder={`Search by ${t.employees.email.toLowerCase()}`}
                  value={searchFields.email}
                  onChange={e => handleFieldSearchChange('email', e.target.value)}
                  variant='outlined'
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth>
                  <InputLabel>{t.common.status}</InputLabel>
                  <Select
                    value={searchFields.status}
                    label={t.common.status}
                    onChange={e => handleFieldSearchChange('status', e.target.value)}
                  >
                    <MenuItem value=''>All</MenuItem>
                    <MenuItem value='1'>{t.common.active}</MenuItem>
                    <MenuItem value='0'>{t.common.inactive}</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth>
                  <InputLabel>{t.employees.position}</InputLabel>
                  <Select
                    value={searchFields.positionId}
                    label={t.employees.position}
                    onChange={e => handleFieldSearchChange('positionId', e.target.value)}
                  >
                    <MenuItem value=''>All</MenuItem>
                    {positions.map(position => (
                      <MenuItem key={position.id} value={position.id.toString()}>
                        {position.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth>
                  <InputLabel>{t.employees.department}</InputLabel>
                  <Select
                    value={searchFields.departmentId}
                    label={t.employees.department}
                    onChange={e => handleFieldSearchChange('departmentId', e.target.value)}
                  >
                    <MenuItem value=''>All</MenuItem>
                    {departments.map(department => (
                      <MenuItem key={department.id} value={department.id.toString()}>
                        {department.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </Box>

        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer>
            <Table sx={{ minWidth: 650 }} aria-label='employees table'>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Box sx={{ fontWeight: 'bold' }}>#</Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                      {t.employees.fullName}
                      <IconButton size='small' onClick={() => handleRequestSort('fullName')}>
                        {orderBy === 'fullName' && order === 'asc' ? (
                          <i className='ri-arrow-up-s-line' />
                        ) : (
                          <i className='ri-arrow-down-s-line' />
                        )}
                      </IconButton>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                      {t.employees.numberId}
                      <IconButton size='small' onClick={() => handleRequestSort('numberId')}>
                        {orderBy === 'numberId' && order === 'asc' ? (
                          <i className='ri-arrow-up-s-line' />
                        ) : (
                          <i className='ri-arrow-down-s-line' />
                        )}
                      </IconButton>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                      {t.employees.email}
                      <IconButton size='small' onClick={() => handleRequestSort('email')}>
                        {orderBy === 'email' && order === 'asc' ? (
                          <i className='ri-arrow-up-s-line' />
                        ) : (
                          <i className='ri-arrow-down-s-line' />
                        )}
                      </IconButton>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                      {t.employees.department}
                      <IconButton size='small' onClick={() => handleRequestSort('departmentId')}>
                        {orderBy === 'departmentId' && order === 'asc' ? (
                          <i className='ri-arrow-up-s-line' />
                        ) : (
                          <i className='ri-arrow-down-s-line' />
                        )}
                      </IconButton>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                      {t.employees.position}
                      <IconButton size='small' onClick={() => handleRequestSort('positionId')}>
                        {orderBy === 'positionId' && order === 'asc' ? (
                          <i className='ri-arrow-up-s-line' />
                        ) : (
                          <i className='ri-arrow-down-s-line' />
                        )}
                      </IconButton>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                      {t.employees.salary}
                      <IconButton size='small' onClick={() => handleRequestSort('salary')}>
                        {orderBy === 'salary' && order === 'asc' ? (
                          <i className='ri-arrow-up-s-line' />
                        ) : (
                          <i className='ri-arrow-down-s-line' />
                        )}
                      </IconButton>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                      {t.common.status}
                      <IconButton size='small' onClick={() => handleRequestSort('status')}>
                        {orderBy === 'status' && order === 'asc' ? (
                          <i className='ri-arrow-up-s-line' />
                        ) : (
                          <i className='ri-arrow-down-s-line' />
                        )}
                      </IconButton>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ fontWeight: 'bold' }}>{t.common.actions}</Box>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} align='center' sx={{ py: 5 }}>
                      <CircularProgress size={40} />
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={8} align='center' sx={{ py: 5, color: 'error.main' }}>
                      {error}
                      <Button variant='text' color='primary' onClick={() => fetchEmployees()} sx={{ mt: 1 }}>
                        <i className='ri-refresh-line' style={{ marginRight: '4px' }} />
                        {t.common.loading ? t.common.loading : 'Refresh'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ) : employees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align='center' sx={{ py: 5 }}>
                      {t.common.noData}
                    </TableCell>
                  </TableRow>
                ) : (
                  employees.map((employee, index: number) => (
                    <TableRow key={employee.id} hover tabIndex={-1}>
                      <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                      <TableCell>{employee.fullName}</TableCell>
                      <TableCell>{employee.numberId}</TableCell>
                      <TableCell>{employee.email}</TableCell>
                      <TableCell>{getDepartmentName(employee.departmentId)}</TableCell>
                      <TableCell>{getPositionName(employee.positionId)}</TableCell>
                      <TableCell>${employee.salary || '0.00'}</TableCell>
                      <TableCell>
                        <Chip
                          className='capitalize'
                          variant='tonal'
                          color={employee.status === 1 ? 'success' : 'error'}
                          label={employee.status == 1 ? t.common.active : t.common.inactive}
                          size='small'
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title={t.employees.editEmployee}>
                            <IconButton color='primary' onClick={() => handleOpenEditDialog(employee)}>
                              <i className='ri-edit-line' />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={t.employees.deleteEmployee}>
                            <IconButton color='error' onClick={() => handleOpenDeleteDialog(employee.id)}>
                              <i className='ri-delete-bin-line' />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={t.dashboard.viewDetails}>
                            <IconButton color='info' onClick={() => handleViewEmployee(employee)}>
                              <i className='ri-eye-line' />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, py: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant='body2' sx={{ mr: 2 }}>
                {t.common.rowsPerPage}
              </Typography>
              <FormControl size='small' variant='outlined' sx={{ minWidth: 70 }}>
                <Select value={rowsPerPage} onChange={handleChangeRowsPerPage} displayEmpty sx={{ height: '32px' }}>
                  {availableRowsPerPage.map(count => (
                    <MenuItem key={count} value={count}>
                      {count}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant='body2' sx={{ mr: 2 }}>
                {page * rowsPerPage + 1}-{Math.min(page * rowsPerPage + rowsPerPage, totalElements)} {t.common.of}{' '}
                {totalElements}
              </Typography>
              <IconButton onClick={e => handleChangePage(e, page - 1)} disabled={page === 0} size='small'>
                <i className='ri-arrow-left-s-line' />
              </IconButton>
              <IconButton
                onClick={e => handleChangePage(e, page + 1)}
                disabled={page >= Math.ceil(totalElements / rowsPerPage) - 1}
                size='small'
              >
                <i className='ri-arrow-right-s-line' />
              </IconButton>
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* Employee Form Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth='md' fullWidth>
        <DialogTitle>{dialogMode === 'add' ? t.employees.addEmployee : t.employees.editEmployee}</DialogTitle>
        <DialogContent>
          <Grid container spacing={6} sx={{ mt: 0 }}>
            {/* Personal Information Section */}
            <Grid item xs={12}>
              <Typography variant='h6'>{t.employees.personalInfo}</Typography>
              <Divider sx={{ mb: 4, mt: 1 }} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={t.employees.fullName}
                name='fullName'
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder={t.employees.employeeNamePlaceholder}
                margin='normal'
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={t.employees.numberId}
                name='numberId'
                value={formData.numberId}
                onChange={handleInputChange}
                margin='normal'
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={t.employees.dateOfBirth}
                name='dateOfBirth'
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                margin='normal'
                type='date'
                InputLabelProps={{
                  shrink: true
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin='normal'>
                <FormLabel id='sex-radio-group-label'>{t.employees.sex}</FormLabel>
                <RadioGroup
                  row
                  aria-labelledby='sex-radio-group-label'
                  name='sex'
                  value={formData.sex}
                  onChange={handleInputChange}
                >
                  <FormControlLabel value='0' control={<Radio />} label={t.employees.male} />
                  <FormControlLabel value='1' control={<Radio />} label={t.employees.female} />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={t.employees.nationality}
                name='nationality'
                value={formData.nationality}
                onChange={handleInputChange}
                margin='normal'
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={t.employees.placeOfOrigin}
                name='placeOfOrigin'
                value={formData.placeOfOrigin}
                onChange={handleInputChange}
                margin='normal'
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t.employees.placeOfResidence}
                name='placeOfResidence'
                value={formData.placeOfResidence}
                onChange={handleInputChange}
                margin='normal'
              />
            </Grid>

            {/* Contact Information Section */}
            <Grid item xs={12}>
              <Typography variant='h6'>{t.employees.contactInfo}</Typography>
              <Divider sx={{ mb: 4, mt: 1 }} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={t.employees.email}
                name='email'
                type='email'
                value={formData.email}
                onChange={handleInputChange}
                margin='normal'
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={t.employees.phone}
                name='phone'
                value={formData.phone}
                onChange={handleInputChange}
                margin='normal'
              />
            </Grid>

            {/* Employment Information Section */}
            <Grid item xs={12}>
              <Typography variant='h6'>{t.employees.employmentInfo}</Typography>
              <Divider sx={{ mb: 4, mt: 1 }} />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin='normal'>
                <InputLabel id='department-select-label'>{t.employees.department}</InputLabel>
                <Select
                  labelId='department-select-label'
                  id='department-select'
                  name='departmentId'
                  value={formData.departmentId.toString()}
                  label={t.employees.department}
                  onChange={handleSelectChange}
                >
                  {departments.map(department => (
                    <MenuItem key={department.id} value={department.id.toString()}>
                      {department.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin='normal'>
                <InputLabel id='position-select-label'>{t.employees.position}</InputLabel>
                <Select
                  labelId='position-select-label'
                  id='position-select'
                  name='positionId'
                  value={formData.positionId.toString()}
                  label={t.employees.position}
                  onChange={handleSelectChange}
                >
                  {positions.map(position => (
                    <MenuItem key={position.id} value={position.id.toString()}>
                      {position.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={t.employees.hireDate}
                name='hireDate'
                value={formData.hireDate}
                onChange={handleInputChange}
                margin='normal'
                type='date'
                InputLabelProps={{
                  shrink: true
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin='normal'>
                <InputLabel id='status-select-label'>{t.common.status}</InputLabel>
                <Select
                  labelId='status-select-label'
                  id='status-select'
                  name='status'
                  value={formData.status.toString()}
                  label={t.common.status}
                  onChange={e => handleFormChange('status', Number(e.target.value))}
                >
                  <MenuItem value='1'>{t.common.active}</MenuItem>
                  <MenuItem value='0'>{t.common.inactive}</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Salary Information */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={t.employees.salary || 'Salary'}
                name='salary'
                value={formData.salary}
                onChange={handleInputChange}
                margin='normal'
                type='text'
                placeholder='0.00'
                InputProps={{
                  startAdornment: <InputAdornment position='start'>$</InputAdornment>
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={t.employees.salaryAllowance || 'Salary Allowance'}
                name='salaryAllowance'
                value={formData.salaryAllowance}
                onChange={handleInputChange}
                margin='normal'
                type='text'
                placeholder='0.00'
                InputProps={{
                  startAdornment: <InputAdornment position='start'>$</InputAdornment>
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color='inherit'>
            {t.common.cancel}
          </Button>
          <Button onClick={handleSaveEmployee} variant='contained' color='primary' disabled={!isFormDataValid()}>
            {dialogMode === 'add' ? t.employees.addEmployee : t.common.save}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteOpen} onClose={handleCloseDeleteDialog} maxWidth='xs' fullWidth>
        <DialogTitle>{t.employees.deleteEmployee}</DialogTitle>
        <DialogContent>
          <Typography>{t.employees.confirmDelete}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color='inherit'>
            {t.common.cancel}
          </Button>
          <Button onClick={handleDeleteEmployee} variant='contained' color='error'>
            {t.employees.deleteEmployee}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Employee Dialog */}
      <Dialog open={viewDialogOpen} onClose={handleCloseViewDialog} maxWidth='md' fullWidth>
        <DialogTitle>
          {t.dashboard.viewDetails} {t.employees.title}
        </DialogTitle>
        <DialogContent>
          {selectedEmployee && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={6} md={6}>
                  <Typography variant='inherit'>{t.employees.fullName}:</Typography>
                  <Typography variant='body2'>{selectedEmployee.fullName}</Typography>
                </Grid>
                <Grid item xs={6} md={6}>
                  <Typography variant='inherit'>{t.employees.numberId}:</Typography>
                  <Typography variant='body2'>{selectedEmployee.numberId}</Typography>
                </Grid>
                <Grid item xs={6} md={6}>
                  <Typography variant='inherit'>{t.employees.email}:</Typography>
                  <Typography variant='body2'>{selectedEmployee.email}</Typography>
                </Grid>
                <Grid item xs={6} md={6}>
                  <Typography variant='inherit'>{t.employees.phone}:</Typography>
                  <Typography variant='body2'>{selectedEmployee.phone}</Typography>
                </Grid>
                <Grid item xs={6} md={6}>
                  <Typography variant='inherit'>{t.employees.sex}:</Typography>
                  <Typography variant='body2'>
                    {selectedEmployee.sex == 1 ? t.employees.female : t.employees.male}
                  </Typography>
                </Grid>
                <Grid item xs={6} md={6}>
                  <Typography variant='inherit'>{t.employees.nationality}:</Typography>
                  <Typography variant='body2'>{selectedEmployee.nationality}</Typography>
                </Grid>
                <Grid item xs={6} md={6}>
                  <Typography variant='inherit'>{t.employees.placeOfOrigin}:</Typography>
                  <Typography variant='body2'>{selectedEmployee.placeOfOrigin}</Typography>
                </Grid>
                <Grid item xs={6} md={6}>
                  <Typography variant='inherit'>{t.employees.placeOfResidence}:</Typography>
                  <Typography variant='body2'>{selectedEmployee.placeOfResidence}</Typography>
                </Grid>
                <Grid item xs={6} md={6}>
                  <Typography variant='inherit'>{t.employees.department}:</Typography>
                  <Typography variant='body2'>{getDepartmentName(selectedEmployee.departmentId)}</Typography>
                </Grid>
                <Grid item xs={6} md={6}>
                  <Typography variant='inherit'>{t.employees.position}:</Typography>
                  <Typography variant='body2'>{getPositionName(selectedEmployee.positionId)}</Typography>
                </Grid>
                <Grid item xs={6} md={6}>
                  <Typography variant='inherit'>{t.common.status}:</Typography>
                  <Typography variant='body2'>
                    {selectedEmployee.status === 1 ? t.common.active : t.common.inactive}
                  </Typography>
                </Grid>
                <Grid item xs={6} md={6}>
                  <Typography variant='inherit'>{t.employees.salary || 'Salary'}:</Typography>
                  <Typography variant='body2'>${selectedEmployee.salary || '0.00'}</Typography>
                </Grid>
                <Grid item xs={6} md={6}>
                  <Typography variant='inherit'>{t.employees.salaryAllowance || 'Salary Allowance'}:</Typography>
                  <Typography variant='body2'>${selectedEmployee.salaryAllowance || '0.00'}</Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseViewDialog} color='primary'>
            {t.common.cancel}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Card>
  )
}

export default EmployeePage
