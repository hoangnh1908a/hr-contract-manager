'use client'

import { useState, useEffect } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import InputAdornment from '@mui/material/InputAdornment'
import CircularProgress from '@mui/material/CircularProgress'
import type { SelectChangeEvent } from '@mui/material/Select'
import Chip from '@mui/material/Chip'

// Hook Imports
import { AxiosError } from 'axios'
import { useLanguage } from '@/i18n/LanguageContext'

// Service Imports
import type { Role } from '@/services/roleService'
import { getRoles, createRole, updateRole, deleteRole } from '@/services/roleService'
import type { SearchParams } from '@/services/crudService'

type DialogMode = 'add' | 'edit' | null
type Order = 'asc' | 'desc'

const emptyFormData: Role = {
  id: 0,
  name: '',
  nameEn: '',
  status: 1
}

const RolesPage = () => {
  // All hooks should be grouped together at the top
  const { t } = useLanguage()

  // Table state
  const [order, setOrder] = useState<Order>('asc')
  const [orderBy, setOrderBy] = useState<keyof Role>('name')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchValue, setSearchValue] = useState('')
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null)

  // Data state
  const [roles, setRoles] = useState<Role[]>([])
  const [totalElements, setTotalElements] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // CRUD state
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)
  const [dialogMode, setDialogMode] = useState<DialogMode>(null)
  const [formData, setFormData] = useState<Role>(emptyFormData)

  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  })

  // Available row counts for the dropdown
  const availableRowsPerPage = [10, 20, 50, 100, 200, 500, 1000]

  // Ensure this always runs, even if there are no roles to render
  useEffect(() => {
    fetchRoles(searchValue)
  }, [rowsPerPage, page, order, orderBy, searchValue])

  // Function to fetch roles from API with search parameter
  const fetchRoles = async (search: string = '') => {
    setLoading(true)

    try {
      // Create search params object
      const searchParams: SearchParams = {}

      if (search) {
        searchParams.name = search
      } else {
        searchParams.name = ''
      }

      const response = await getRoles(page, rowsPerPage, orderBy, order, searchParams)

      setRoles(response.roles)
      setTotalElements(response.totalElements)
      setError('')
    } catch (err) {
      setError('Failed to fetch roles')
      setRoles([])
      setTotalElements(0)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Handle search with debouncing
  const handleSearch = (value: string) => {
    setSearchValue(value)

    // Clear any existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }

    // Set a new timeout to delay the API call
    const timeout = setTimeout(() => {
      fetchRoles(value)
    }, 500) // Wait 500ms after user stops typing

    setSearchTimeout(timeout)
  }

  const handleRequestSort = (property: keyof Role) => {
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

  const handleOpenEditDialog = (role: Role) => {
    setFormData(role)
    setDialogMode('edit')
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setDialogMode(null)
  }

  const handleFormChange = (field: keyof Role, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSaveRole = async () => {
    try {
      if (dialogMode === 'add') {
        // Create new role
        await createRole(formData as Omit<Role, 'id'>)
        showNotification(t.roles.roleCreated, 'success')
      } else if (dialogMode === 'edit' && 'id' in formData) {
        // Update existing role
        await updateRole(formData as Role)
        showNotification(t.roles.roleUpdated, 'success')
      }

      // Refresh roles
      fetchRoles(searchValue)

      handleCloseDialog()
    } catch (err) {
      if (err instanceof AxiosError) {
        showNotification(err.response?.data.message, 'error')
      } else {
        showNotification(t.common.operationFailed, 'error')
        console.error(err)
      }
    }
  }

  const handleDeleteRole = async (id: number) => {
    if (window.confirm(t.roles.confirmDelete)) {
      try {
        await deleteRole(id)

        // Refresh roles
        fetchRoles(searchValue)
        showNotification(t.roles.roleDeleted, 'success')
      } catch (err) {
        if (err instanceof AxiosError) {
          showNotification(err.response?.data.message, 'error')
        } else {
          showNotification(t.common.deleteFailed, 'error')
          console.error(err)
        }
      }
    }
  }

  const showNotification = (message: string, severity: 'success' | 'error') => {
    setNotification({ open: true, message, severity })
  }

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false })
  }

  const renderSortIcon = (headCell: keyof Role) => {
    if (orderBy !== headCell) {
      return <i className='ri-arrow-up-down-line' style={{ opacity: 0.3 }} />
    }

    return order === 'asc' ? <i className='ri-arrow-up-s-line' /> : <i className='ri-arrow-down-s-line' />
  }

  const handleRefresh = async () => {
    setLoading(true)

    try {
      await fetchRoles(searchValue)
      showNotification(t.common.refreshSuccess || 'Roles refreshed successfully', 'success')
    } catch (err) {
      setError('Failed to refresh roles')
      showNotification(t.common.refreshError || 'Failed to refresh roles', 'error')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Get the name based on language
  const getDisplayName = (role: Role) => {
    const { language } = useLanguage()
    return language === 'vi' ? role.name : role.nameEn || role.name
  }

  return (
    <Card>
      <Box sx={{ p: 5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant='h4'>{t.roles.title}</Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Tooltip title='Refresh'>
              <IconButton onClick={handleRefresh} color='primary'>
                <i className='ri-refresh-line' />
              </IconButton>
            </Tooltip>
            <Button variant='contained' startIcon={<i className='ri-add-line' />} onClick={handleOpenAddDialog}>
              {t.roles.addRole}
            </Button>
          </Box>
        </Box>

        <TextField
          fullWidth
          variant='outlined'
          placeholder={t.roles.searchRoles}
          sx={{ mb: 4 }}
          value={searchValue}
          onChange={e => handleSearch(e.target.value)}
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
            <Table sx={{ minWidth: 650 }} aria-label='roles table'>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Box sx={{ fontWeight: 'bold' }}>#</Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                      {t.roles.name}
                      <IconButton size='small' onClick={() => handleRequestSort('name')}>
                        {renderSortIcon('name')}
                      </IconButton>
                    </Box>
                  </TableCell>
                  <TableCell>
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
                    <TableCell colSpan={4} align='center' sx={{ py: 5 }}>
                      <CircularProgress size={40} />
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={4} align='center' sx={{ py: 5, color: 'error.main' }}>
                      {error}
                    </TableCell>
                  </TableRow>
                ) : roles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align='center' sx={{ py: 5 }}>
                      No roles found
                    </TableCell>
                  </TableRow>
                ) : (
                  roles.map((role: Role, index: number) => (
                    <TableRow key={role.id}>
                      <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                      <TableCell>{getDisplayName(role)}</TableCell>
                      <TableCell>
                        <Chip
                          className='capitalize'
                          variant='tonal'
                          color={role.status === 1 ? 'success' : 'error'}
                          label={role.status == 1 ? t.common.active : t.common.inactive}
                          size='small'
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title={t.roles.editRole}>
                            <IconButton color='primary' onClick={() => handleOpenEditDialog(role)}>
                              <i className='ri-edit-line' />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={t.roles.deleteRole}>
                            <IconButton color='error' onClick={() => handleDeleteRole(role.id)}>
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

      {/* Role Form Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth='sm' fullWidth>
        <DialogTitle>{dialogMode === 'add' ? t.roles.addRole : t.roles.editRole}</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 0 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t.roles.name}
                placeholder={t.roles.roleNamePlaceholder}
                value={formData.name}
                onChange={e => handleFormChange('name', e.target.value)}
                margin='normal'
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='English Name'
                placeholder='Enter role name in English'
                value={formData.nameEn}
                onChange={e => handleFormChange('nameEn', e.target.value)}
                margin='normal'
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth margin='normal'>
                <Typography variant='body2' gutterBottom>
                  {t.common.status}
                </Typography>
                <Select value={formData.status} onChange={e => handleFormChange('status', e.target.value)}>
                  <MenuItem value={1}>{t.common.active}</MenuItem>
                  <MenuItem value={0}>{t.common.inactive}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color='inherit'>
            Cancel
          </Button>
          <Button onClick={handleSaveRole} variant='contained' color='primary' disabled={!formData.name}>
            {/* {dialogMode === 'add' ? 'Add' : 'Save'} */}
            Save
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

export default RolesPage
