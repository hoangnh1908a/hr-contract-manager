'use client'

import { useState, useEffect, useCallback } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import CircularProgress from '@mui/material/CircularProgress'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import InputAdornment from '@mui/material/InputAdornment'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import type { SelectChangeEvent } from '@mui/material/Select'
import Autocomplete from '@mui/material/Autocomplete'

// Service Imports
import { User, userService, createUser, updateUser, resetPasswordByUser } from '@/services/userService'
import { Role, getRoles } from '@/services/roleService'
import { SearchParams } from '@/services/crudService'

// Hook Imports
import { useLanguage } from '@/i18n/LanguageContext'
import { AxiosError } from 'axios'

// Utils Imports
import { formatTimestamp } from '@/utils/dateUtils'
import Chip from '@mui/material/Chip'

interface FieldSearchValues {
  fullName: string
  email: string
  roleId: string
}

type DialogMode = 'add' | 'edit' | null
type Order = 'asc' | 'desc'

const emptyFormData: User = {
  id: 0,
  fullName: '',
  email: '',
  role: '',
  roleId: 0,
  status: 1,
  newPassword: '',
  createdAt: ''
}

const UserPage = () => {
  // All hooks should be grouped together at the top
  const { t } = useLanguage()
  const [order, setOrder] = useState<Order>('desc')
  const [orderBy, setOrderBy] = useState<keyof User>('createdAt')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null)
  const [fieldSearchValues, setFieldSearchValues] = useState<FieldSearchValues>({
    fullName: '',
    email: '',
    roleId: ''
  })
  const [users, setUsers] = useState<User[]>([])
  const [totalElements, setTotalElements] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)
  const [dialogMode, setDialogMode] = useState<DialogMode>(null)
  const [formData, setFormData] = useState<User | Omit<User, 'createdAt'>>(emptyFormData)
  const [roles, setRoles] = useState<Role[]>([])
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  })

  // Constants that don't change between renders
  const availableRowsPerPage = [10, 20, 50, 100, 200, 500, 1000]

  // Memoize fetchRoles to prevent unnecessary re-renders
  const fetchRoles = useCallback(async () => {
    setLoading(true)
    try {
      const rolesData = await getRoles(0, 100, 'name', 'asc', { name: '' })
      console.log(' rolesData : ' + rolesData)
      setRoles(rolesData.roles)
    } catch (error) {
      console.error('Error fetching roles:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  // Memoize fetchUsers to prevent unnecessary re-renders
  const fetchUsers = useCallback(
    async (fieldValues: FieldSearchValues = fieldSearchValues) => {
      setLoading(true)

      try {
        const searchParams: SearchParams = {}

        // Add individual field search params if they have values
        Object.entries(fieldValues).forEach(([key, value]) => {
          if (value) {
            searchParams[key] = value
          }
        })
        console.log('searchParams : ' + searchParams)
        const response = await userService.getAll(page, rowsPerPage, orderBy, order, searchParams)

        setUsers(response.content)
        setTotalElements(response.totalElements)
        setError('')
      } catch (err) {
        setError('Failed to fetch users')
        setUsers([])
        setTotalElements(0)
        console.error(err)
      } finally {
        setLoading(false)
      }
    },
    [page, rowsPerPage, orderBy, order, fieldSearchValues]
  )

  // Initialize data on mount
  useEffect(() => {
    const initializeData = async () => {
      try {
        await Promise.all([fetchUsers(fieldSearchValues), fetchRoles()])
      } catch (error) {
        console.error('Error initializing data:', error)
      }
    }
    initializeData()
  }, [fetchUsers, fetchRoles, fieldSearchValues])

  // Fetch users when dependencies change
  useEffect(() => {
    fetchUsers(fieldSearchValues)
  }, [fetchUsers, fieldSearchValues])

  // Handle field search change
  const handleFieldSearchChange = (field: keyof FieldSearchValues, value: string) => {
    const newFieldValues = { ...fieldSearchValues, [field]: value }
    setFieldSearchValues(newFieldValues)

    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }

    const timeout = setTimeout(() => {
      setPage(0)
      fetchUsers(newFieldValues)
    }, 500) // Wait 500ms after user stops typing

    setSearchTimeout(timeout)
  }

  // Check if any advanced search filter is active
  const hasActiveFilters = Object.values(fieldSearchValues).some(value => value !== '')

  const handleClearFilters = () => {
    setFieldSearchValues({
      fullName: '',
      email: '',
      roleId: ''
    })
    setPage(0)
    fetchUsers({
      fullName: '',
      email: '',
      roleId: ''
    })
  }

  const handleRequestSort = (property: keyof User) => {
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

  const handleOpenEditDialog = (user: User) => {
    setFormData(user)
    setDialogMode('edit')
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setDialogMode(null)
  }

  const handleFormChange = (field: keyof (User | Omit<User, 'id' | 'createdAt'>), value: string | number) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value }

      // If role is updated, also update roleId
      if (field === 'role') {
        const selectedRole = roles.find(r => r.name === value)
        if (selectedRole) {
          newData.roleId = selectedRole.id
        }
      }

      return newData
    })
  }

  const handleSaveUser = async () => {
    try {
      if (dialogMode === 'add') {
        // Create new user
        await createUser(formData as Omit<User, 'id' | 'createdAt'>)
        showNotification(t.users.userCreated, 'success')
      } else if (dialogMode === 'edit' && 'id' in formData) {
        // Update existing user
        await updateUser(formData as Omit<User, 'createdAt'>)
        showNotification(t.users.userUpdated, 'success')
      }

      handleCloseDialog()
      // Refresh users
      fetchUsers(fieldSearchValues)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t.common.operationFailed
      showNotification(errorMessage, 'error')
      console.error(err)
    }
  }

  const handleResetPasswordUser = async (email: string, id: number) => {
    if (window.confirm(t.users.confirmLock)) {
      try {
        await resetPasswordByUser(id)
        // Refresh users
        fetchUsers(fieldSearchValues)
        showNotification(t.users.userResetPassword, 'success')
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : t.common.operationFailed
        showNotification(errorMessage, 'error')
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

  const handleRefresh = async () => {
    setLoading(true)

    try {
      await fetchUsers(fieldSearchValues)
      showNotification(t.common.refreshSuccess, 'success')
    } catch (err) {
      setError('Failed to refresh users')
      const errorMessage = err instanceof Error ? err.message : t.common.refreshError
      showNotification(errorMessage, 'error')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const renderSortIcon = (headCell: keyof User) => {
    if (orderBy !== headCell) {
      return <i className='ri-arrow-up-down-line' style={{ opacity: 0.3 }} />
    }

    return order === 'asc' ? <i className='ri-arrow-up-s-line' /> : <i className='ri-arrow-down-s-line' />
  }

  return (
    <Card>
      <Box sx={{ p: 5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant='h4'>{t.users.title}</Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Tooltip title='Refresh'>
              <IconButton onClick={handleRefresh} color='primary'>
                <i className='ri-refresh-line' />
              </IconButton>
            </Tooltip>
            <Button variant='contained' startIcon={<i className='ri-add-line' />} onClick={handleOpenAddDialog}>
              {t.users.addUser}
            </Button>
          </Box>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            {hasActiveFilters && (
              <Button color='error' onClick={handleClearFilters} startIcon={<i className='ri-close-line' />}>
                {t.common.filter}
              </Button>
            )}
          </Box>

          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label={t.users.fullName}
                  placeholder={`${t.common.search} ${t.users.fullName.toLowerCase()}`}
                  value={fieldSearchValues.fullName}
                  onChange={e => handleFieldSearchChange('fullName', e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <i className='ri-user-line' />
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label={t.users.email}
                  placeholder={`${t.common.search} ${t.users.email.toLowerCase()}`}
                  value={fieldSearchValues.email}
                  onChange={e => handleFieldSearchChange('email', e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <i className='ri-mail-line' />
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Autocomplete
                  options={roles}
                  getOptionLabel={option => option.name}
                  value={roles.find(role => role.id === Number(fieldSearchValues.roleId)) || null}
                  onChange={(_, newValue) => {
                    handleFieldSearchChange('roleId', newValue?.id?.toString() || '')
                  }}
                  renderInput={params => <TextField {...params} label={t.users.role} fullWidth />}
                  filterOptions={(options, { inputValue }) => {
                    return options.filter(option => option.name.toLowerCase().includes(inputValue.toLowerCase()))
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        </Box>

        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer>
            <Table sx={{ minWidth: 650 }} aria-label='users table'>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Box sx={{ fontWeight: 'bold' }}>#</Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                      {t.users.fullName}
                      <IconButton size='small' onClick={() => handleRequestSort('fullName')}>
                        {renderSortIcon('fullName')}
                      </IconButton>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                      {t.users.email}
                      <IconButton size='small' onClick={() => handleRequestSort('email')}>
                        {renderSortIcon('email')}
                      </IconButton>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                      {t.users.role}
                      <IconButton size='small' onClick={() => handleRequestSort('role')}>
                        {renderSortIcon('role')}
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
                  <TableCell>
                    <Box sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                      {t.contracts.createdAt}
                      <IconButton size='small' onClick={() => handleRequestSort('createdAt')}>
                        {renderSortIcon('createdAt')}
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
                    <TableCell colSpan={7} align='center' sx={{ py: 5 }}>
                      <CircularProgress size={40} />
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={7} align='center' sx={{ py: 5, color: 'error.main' }}>
                      {error}
                    </TableCell>
                  </TableRow>
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align='center' sx={{ py: 5 }}>
                      {t.common.noData}
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user, index) => (
                    <TableRow key={user.id} hover>
                      <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                      <TableCell>{user.fullName}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{roles.find(r => r.id === user.roleId)?.name || ''}</TableCell>
                      <TableCell>
                        <Chip
                          className='capitalize'
                          variant='tonal'
                          color={user.status === 1 ? 'success' : 'error'}
                          label={user.status == 1 ? t.common.active : t.common.inactive}
                          size='small'
                        />
                      </TableCell>
                      <TableCell>{formatTimestamp(user.createdAt)}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title={t.users.editUser}>
                            <IconButton color='primary' onClick={() => handleOpenEditDialog(user)}>
                              <i className='ri-pencil-line' />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={t.users.resetPassword}>
                            <IconButton color='primary' onClick={() => handleOpenEditDialog(user)}>
                              <i className='ri-restart-fill' />
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
                {page * rowsPerPage + 1}-{Math.min((page + 1) * rowsPerPage, totalElements)} {t.common.of}{' '}
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

      {/* User Form Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth='md' fullWidth>
        <DialogTitle>{dialogMode === 'add' ? t.users.addUser : t.users.editUser}</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 0 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={t.users.fullName}
                placeholder={t.users.userNamePlaceholder}
                value={formData.fullName || ''}
                onChange={e => handleFormChange('fullName', e.target.value)}
                margin='normal'
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={t.users.email}
                type='email'
                placeholder='example@example.com'
                value={formData.email || ''}
                onChange={e => handleFormChange('email', e.target.value)}
                margin='normal'
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Autocomplete
                options={roles}
                getOptionLabel={option => option.name}
                value={roles.find(role => role.id === formData.roleId) || null}
                onChange={(_, newValue) => {
                  handleFormChange('roleId', newValue?.id || 0)
                  handleFormChange('role', newValue?.name || '')
                }}
                renderInput={params => <TextField {...params} label={t.users.role} required fullWidth />}
                filterOptions={(options, { inputValue }) => {
                  return options.filter(option => option.name.toLowerCase().includes(inputValue.toLowerCase()))
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>{t.common.status}</InputLabel>
                <Select
                  value={formData.status}
                  onChange={e => handleFormChange('status', e.target.value)}
                  label={t.common.status}
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
          <Button
            onClick={handleSaveUser}
            variant='contained'
            color='primary'
            disabled={!formData.fullName || !formData.email || !formData.roleId}
          >
            {dialogMode === 'add' ? t.users.addUser : t.common.save}
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

export default UserPage
