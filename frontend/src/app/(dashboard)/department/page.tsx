'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'

// MUI Imports
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Tooltip from '@mui/material/Tooltip'
import CircularProgress from '@mui/material/CircularProgress'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import type { SelectChangeEvent } from '@mui/material/Select'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Chip from '@mui/material/Chip'

import { useLanguage } from '@/i18n/LanguageContext'

import type { Department } from '@/services/departmentService'
import { getDepartments, createDepartment, updateDepartment, deleteDepartment } from '@/services/departmentService'
import { SearchParams } from '@/services/crudService'

type Order = 'asc' | 'desc'
type DialogMode = 'add' | 'edit' | null

interface FieldSearchValues extends SearchParams {
  name: string
}

const emptyFormData: Department = {
  id: 0,
  name: '',
  nameEn: '',
  status: 1
}

const DepartmentPage = () => {
  const { t } = useLanguage()
  const [order, setOrder] = useState<Order>('asc')
  const [orderBy, setOrderBy] = useState<keyof Department>('name')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null)
  const [fieldSearchValues, setFieldSearchValues] = useState<FieldSearchValues>({ name: '' })

  // Data state
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // CRUD state
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)
  const [dialogMode, setDialogMode] = useState<DialogMode>(null)
  const [formData, setFormData] = useState<Department>(emptyFormData)
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  })

  // Available row counts for the dropdown
  const availableRowsPerPage = [10, 20, 50, 100, 200, 500, 1000]

  // Add totalElements state
  const [totalElements, setTotalElements] = useState(0)

  // Fetch departments on component mount
  useEffect(() => {
    fetchDepartments()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowsPerPage, page, order, orderBy])

  // Function to fetch departments from API
  const fetchDepartments = async (fieldValues: FieldSearchValues = fieldSearchValues) => {
    setLoading(true)
    try {
      // Create a clean search params object
      const searchParams: SearchParams = {}

      // Copy all field values except name
      Object.keys(fieldValues).forEach(key => {
        if (key !== 'name') {
          searchParams[key] = fieldValues[key as keyof FieldSearchValues]
        }
      })

      // Handle name/nameEn search based on language
      if (fieldValues.name) {
        searchParams.name = fieldValues.name
      } else {
        searchParams.name = ''
      }

      const response = await getDepartments(page, rowsPerPage, orderBy, order, searchParams)
      setDepartments(response.departments)
      setTotalElements(response.totalElements)
      setError('')
    } catch (err) {
      setError('Failed to fetch departments')
      setDepartments([])
      setTotalElements(0)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleRequestSort = (property: keyof Department) => {
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

  const handleOpenEditDialog = (department: Department) => {
    setFormData({
      id: department.id,
      name: department.name,
      nameEn: department.nameEn || '',
      status: department.status
    })
    setDialogMode('edit')
    setDialogOpen(true)
    setDeleteId(department.id)
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

  const handleFormChange = (field: keyof Department, value: string | number) => {
    setFormData((prev: Department) => ({ ...prev, [field]: value }))
  }

  const handleSaveDepartment = async () => {
    try {
      if (dialogMode === 'add') {
        // Create new department
        const newDepartment = await createDepartment(formData)
        setDepartments([...departments, newDepartment])
        showNotification(t.departments.departmentCreated, 'success')
      } else if (dialogMode === 'edit' && deleteId !== null) {
        // Update existing department using the stored ID
        await updateDepartment({ ...formData, id: deleteId })
        setDepartments(departments.map(dept => (dept.id === deleteId ? { ...dept, ...formData, id: deleteId } : dept)))
        showNotification(t.departments.departmentUpdated, 'success')
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

  const handleDeleteDepartment = async () => {
    try {
      if (deleteId !== null) {
        await deleteDepartment(deleteId)
        setDepartments(departments.filter(dept => dept.id !== deleteId))
        showNotification(t.departments.departmentDeleted, 'success')
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

  const renderSortIcon = (headCell: keyof Department) => {
    if (orderBy !== headCell) {
      return null
    }

    return order === 'asc' ? <i className='ri-arrow-up-s-line' /> : <i className='ri-arrow-down-s-line' />
  }

  const handleFieldSearchChange = (field: keyof FieldSearchValues, value: string) => {
    const newFieldValues = { ...fieldSearchValues, [field]: value }
    setFieldSearchValues(newFieldValues)
    if (searchTimeout) clearTimeout(searchTimeout)
    const timeout = setTimeout(() => {
      setPage(0)
      fetchDepartments(newFieldValues)
    }, 500)
    setSearchTimeout(timeout)
  }

  // Get the name based on language
  const getDisplayName = (department: Department) => {
    const { language } = useLanguage()
    return language === 'vi' ? department.name : department.nameEn || department.name
  }

  return (
    <Card>
      <Box sx={{ p: 5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant='h4'>{t.departments.title}</Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Tooltip title='Refresh'>
              <IconButton onClick={() => fetchDepartments()} color='primary'>
                <i className='ri-refresh-line' />
              </IconButton>
            </Tooltip>
            <Button variant='contained' startIcon={<i className='ri-add-line' />} onClick={handleOpenAddDialog}>
              {t.departments.addDepartment}
            </Button>
          </Box>
        </Box>

        <TextField
          fullWidth
          variant='outlined'
          placeholder={t.departments.searchDepartments}
          sx={{ mb: 4 }}
          value={fieldSearchValues.name}
          onChange={e => handleFieldSearchChange('name', e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <i className='ri-search-line' />
              </InputAdornment>
            )
          }}
        />

        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer>
            <Table sx={{ minWidth: 650 }} aria-label='departments table'>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Box sx={{ fontWeight: 'bold' }}>#</Box>
                  </TableCell>
                  <TableCell sx={{ width: '70%' }}>
                    <Box sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                      {t.departments.name}
                      <IconButton size='small' onClick={() => handleRequestSort('name')}>
                        {renderSortIcon('name')}
                      </IconButton>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ width: '15%' }}>
                    <Box sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                      {t.common.status}
                      <IconButton size='small' onClick={() => handleRequestSort('status')}>
                        {renderSortIcon('status')}
                      </IconButton>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ width: '15%' }}>
                    <Box sx={{ fontWeight: 'bold' }}>{t.common.actions}</Box>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={3} align='center' sx={{ py: 5 }}>
                      <CircularProgress size={40} />
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={3} align='center' sx={{ py: 5, color: 'error.main' }}>
                      {error}
                      <Button variant='text' color='primary' onClick={() => fetchDepartments()} sx={{ mt: 1 }}>
                        <i className='ri-refresh-line' style={{ marginRight: '4px' }} />
                        {t.common.search}
                      </Button>
                    </TableCell>
                  </TableRow>
                ) : departments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} align='center' sx={{ py: 5 }}>
                      {fieldSearchValues.name ? t.common.noData : t.common.noData}
                    </TableCell>
                  </TableRow>
                ) : (
                  departments.map((department: Department, index: number) => (
                    <TableRow key={department.id} hover tabIndex={-1}>
                      <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                      <TableCell>{getDisplayName(department)}</TableCell>
                      <TableCell>
                        <Chip
                          className='capitalize'
                          variant='tonal'
                          color={department.status === 1 ? 'success' : 'error'}
                          label={department.status == 1 ? t.common.active : t.common.inactive}
                          size='small'
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title={t.departments.editDepartment}>
                            <IconButton color='primary' onClick={() => handleOpenEditDialog(department)}>
                              <i className='ri-edit-line' />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={t.departments.deleteDepartment}>
                            <IconButton color='error' onClick={() => handleOpenDeleteDialog(department.id)}>
                              <i className='ri-delete-bin-line' />
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

      {/* Department Form Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth='sm' fullWidth>
        <DialogTitle>{dialogMode === 'add' ? t.departments.addDepartment : t.departments.editDepartment}</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 0 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t.departments.name}
                value={formData.name}
                onChange={e => handleFormChange('name', e.target.value)}
                margin='normal'
                variant='outlined'
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='English Name'
                value={formData.nameEn}
                onChange={e => handleFormChange('nameEn', e.target.value)}
                margin='normal'
                variant='outlined'
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth margin='normal'>
                <Typography variant='body2' gutterBottom>
                  {t.common.status}
                </Typography>
                <Select
                  value={formData.status}
                  onChange={e => handleFormChange('status', e.target.value as number)}
                  displayEmpty
                  variant='outlined'
                >
                  <MenuItem value={1}>{t.common.active}</MenuItem>
                  <MenuItem value={0}>{t.common.inactive}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color='inherit'>
            {t.common.cancel}
          </Button>
          <Button onClick={handleSaveDepartment} variant='contained' color='primary' disabled={!formData.name}>
            {dialogMode === 'add' ? t.departments.addDepartment : t.common.save}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteOpen} onClose={handleCloseDeleteDialog} maxWidth='xs' fullWidth>
        <DialogTitle>{t.departments.deleteDepartment}</DialogTitle>
        <DialogContent>
          <Typography>{t.departments.confirmDelete}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color='inherit'>
            {t.common.cancel}
          </Button>
          <Button onClick={handleDeleteDepartment} variant='contained' color='error'>
            {t.departments.deleteDepartment}
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

export default DepartmentPage
