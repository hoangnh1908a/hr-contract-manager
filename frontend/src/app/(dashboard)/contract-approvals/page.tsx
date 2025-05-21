'use client'

import { useState, useEffect, useMemo } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import type { SelectChangeEvent } from '@mui/material/Select'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Grid from '@mui/material/Grid'
import Tooltip from '@mui/material/Tooltip'
import CircularProgress from '@mui/material/CircularProgress'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import FormHelperText from '@mui/material/FormHelperText'
import InputLabel from '@mui/material/InputLabel'

// Hook Imports
import { AxiosError } from 'axios'
import { useLanguage } from '@/i18n/LanguageContext'

// Service Imports
import type { ContractApproval } from '@/services/contractApprovalService'
import {
  getContractApprovals,
  createContractApproval,
  updateContractApproval,
  deleteContractApproval
} from '@/services/contractApprovalService'
import type { SearchParams } from '@/services/crudService'

type Order = 'asc' | 'desc'
type DialogMode = 'add' | 'edit' | null

interface FieldSearchValues {
  contractId: string
  fromDate: string
  toDate: string
  approvalStatus: string
}

const emptyFormData: ContractApproval = {
  id: 0,
  contractId: 0,
  approvedBy: '',
  approvalStatus: '',
  approvalDate: '',
  comments: '',
  createdBy: '',
  updatedBy: '',
  createdAt: ''
}

const approvalStatusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' }
]

const ContractApprovalsPage = () => {
  const { t } = useLanguage()
  const [order, setOrder] = useState<Order>('asc')
  const [orderBy, setOrderBy] = useState<keyof ContractApproval>('id')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null)
  const [fieldSearchValues, setFieldSearchValues] = useState<FieldSearchValues>({
    contractId: '',
    fromDate: '',
    toDate: '',
    approvalStatus: ''
  })
  const [contractApprovals, setContractApprovals] = useState<ContractApproval[]>([])
  const [totalElements, setTotalElements] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // CRUD state
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)
  const [dialogMode, setDialogMode] = useState<DialogMode>(null)
  const [formData, setFormData] = useState<ContractApproval>(emptyFormData)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  })

  // Available row counts for the dropdown
  const availableRowsPerPage = [10, 20, 50, 100, 200, 500, 1000]

  // Fetch contract approvals on component mount
  useEffect(() => {
    fetchContractApprovals()
  }, [page, rowsPerPage, order, orderBy])

  // Function to fetch contract approvals from API
  const fetchContractApprovals = async (fieldValues: FieldSearchValues = fieldSearchValues) => {
    setLoading(true)
    try {
      const searchParams: SearchParams = {}

      // Add individual field search params if they have values
      Object.entries(fieldValues).forEach(([key, value]) => {
        if (value) {
          searchParams[key] = value
        }
      })

      const response = await getContractApprovals(page, rowsPerPage, orderBy, order, searchParams)
      setContractApprovals(response.contractApprovals)
      setTotalElements(response.totalElements)
      setError('')
    } catch (err) {
      setError('Failed to fetch contract approvals')
      setContractApprovals([])
      setTotalElements(0)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleRequestSort = (property: keyof ContractApproval) => {
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

  // Handle field search change
  const handleFieldSearchChange = (field: keyof FieldSearchValues, value: string) => {
    const newFieldValues = { ...fieldSearchValues, [field]: value }
    setFieldSearchValues(newFieldValues)

    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }

    const timeout = setTimeout(() => {
      setPage(0)
      fetchContractApprovals(newFieldValues)
    }, 500) // Wait 500ms after user stops typing

    setSearchTimeout(timeout)
  }

  const handleClearFilters = () => {
    setFieldSearchValues({
      contractId: '',
      fromDate: '',
      toDate: '',
      approvalStatus: ''
    })
    setPage(0)
    fetchContractApprovals({
      contractId: '',
      fromDate: '',
      toDate: '',
      approvalStatus: ''
    })
  }

  // CRUD handlers
  const handleOpenAddDialog = () => {
    setFormData(emptyFormData)
    setFormErrors({})
    setDialogMode('add')
    setDialogOpen(true)
  }

  const handleOpenEditDialog = (contractApproval: ContractApproval) => {
    setFormData({
      id: contractApproval.id,
      contractId: contractApproval.contractId,
      approvedBy: contractApproval.approvedBy,
      approvalStatus: contractApproval.approvalStatus,
      approvalDate: contractApproval.approvalDate,
      comments: contractApproval.comments || '',
      createdBy: contractApproval.createdBy || '',
      updatedBy: contractApproval.updatedBy || '',
      createdAt: contractApproval.createdAt || ''
    })
    setFormErrors({})
    setDialogMode('edit')
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setDialogMode(null)
  }

  const handleFormChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when field is modified
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    if (!formData.contractId) {
      errors.contractId = 'Contract ID is required'
    }

    if (!formData.approvedBy) {
      errors.approvedBy = 'Approver name is required'
    }

    if (!formData.approvalStatus) {
      errors.approvalStatus = 'Approval status is required'
    }

    if (!formData.approvalDate) {
      errors.approvalDate = 'Approval date is required'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSaveContractApproval = async () => {
    if (!validateForm()) return

    try {
      if (dialogMode === 'add') {
        // Create new contract approval
        const newContractApproval = await createContractApproval(formData)
        setContractApprovals([...contractApprovals, newContractApproval])
        showNotification('Contract approval created successfully', 'success')
      } else if (dialogMode === 'edit') {
        // Update existing contract approval
        const updatedContractApproval = await updateContractApproval(formData)
        setContractApprovals(
          contractApprovals.map(approval =>
            approval.id === updatedContractApproval.id ? updatedContractApproval : approval
          )
        )
        showNotification('Contract approval updated successfully', 'success')
      }

      handleCloseDialog()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Operation failed'
      showNotification(errorMessage, 'error')
      console.error(err)
    }
  }

  const handleDeleteContractApproval = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this contract approval?')) {
      try {
        await deleteContractApproval(id)
        setContractApprovals(contractApprovals.filter(approval => approval.id !== id))
        showNotification('Contract approval deleted successfully', 'success')
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Delete failed'
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

  const renderSortIcon = (headCell: keyof ContractApproval) => {
    if (orderBy !== headCell) {
      return null
    }

    return order === 'asc' ? <i className='ri-arrow-up-s-line' /> : <i className='ri-arrow-down-s-line' />
  }

  const handleRefresh = async () => {
    setLoading(true)

    try {
      const response = await getContractApprovals()
      setContractApprovals(response.contractApprovals)
      setTotalElements(response.totalElements)
      setError('')
      showNotification('Contract approvals refreshed successfully', 'success')
    } catch (err) {
      setError('Failed to refresh contract approvals')
      const errorMessage = err instanceof Error ? err.message : 'Failed to refresh contract approvals'
      showNotification(errorMessage, 'error')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return 'N/A'
    try {
      const date = new Date(dateStr)
      return date.toLocaleDateString()
    } catch (error) {
      return 'Invalid Date'
    }
  }

  return (
    <Card>
      <Box sx={{ p: 5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant='h4'>Contract Approvals</Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Tooltip title='Refresh'>
              <IconButton onClick={handleRefresh} color='primary'>
                <i className='ri-refresh-line' />
              </IconButton>
            </Tooltip>
            <Button variant='contained' startIcon={<i className='ri-add-line' />} onClick={handleOpenAddDialog}>
              Add Contract Approval
            </Button>
          </Box>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            {Object.values(fieldSearchValues).some(value => value !== '') && (
              <Button color='error' onClick={handleClearFilters} startIcon={<i className='ri-close-line' />}>
                Clear Filters
              </Button>
            )}
          </Box>

          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label='Contract ID'
                  placeholder='Search by contract ID'
                  value={fieldSearchValues.contractId}
                  onChange={e => handleFieldSearchChange('contractId', e.target.value)}
                  variant='outlined'
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <i className='ri-file-list-line' />
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label='From Date'
                  type='date'
                  placeholder='From date'
                  value={fieldSearchValues.fromDate}
                  onChange={e => handleFieldSearchChange('fromDate', e.target.value)}
                  variant='outlined'
                  InputLabelProps={{
                    shrink: true
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <i className='ri-calendar-line' />
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label='To Date'
                  type='date'
                  placeholder='To date'
                  value={fieldSearchValues.toDate}
                  onChange={e => handleFieldSearchChange('toDate', e.target.value)}
                  variant='outlined'
                  InputLabelProps={{
                    shrink: true
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <i className='ri-calendar-line' />
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth variant='outlined'>
                  <InputLabel>Approval Status</InputLabel>
                  <Select
                    value={fieldSearchValues.approvalStatus}
                    onChange={e => handleFieldSearchChange('approvalStatus', e.target.value)}
                    label='Approval Status'
                    startAdornment={
                      <InputAdornment position='start'>
                        <i className='ri-check-double-line' />
                      </InputAdornment>
                    }
                  >
                    <MenuItem value=''>All</MenuItem>
                    {approvalStatusOptions.map(option => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
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
            <Table sx={{ minWidth: 650 }} aria-label='contract approvals table'>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Box sx={{ fontWeight: 'bold' }}>#</Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                      Contract ID
                      <IconButton size='small' onClick={() => handleRequestSort('contractId')}>
                        {renderSortIcon('contractId')}
                      </IconButton>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                      Approved By
                      <IconButton size='small' onClick={() => handleRequestSort('approvedBy')}>
                        {renderSortIcon('approvedBy')}
                      </IconButton>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                      Status
                      <IconButton size='small' onClick={() => handleRequestSort('approvalStatus')}>
                        {renderSortIcon('approvalStatus')}
                      </IconButton>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                      Approval Date
                      <IconButton size='small' onClick={() => handleRequestSort('approvalDate')}>
                        {renderSortIcon('approvalDate')}
                      </IconButton>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>Comments</Box>
                  </TableCell>
                  <TableCell sx={{ width: '15%' }}>
                    <Box sx={{ fontWeight: 'bold' }}>Actions</Box>
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
                ) : contractApprovals.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align='center' sx={{ py: 5 }}>
                      No contract approvals found
                    </TableCell>
                  </TableRow>
                ) : (
                  contractApprovals.map((approval, index) => (
                    <TableRow key={approval.id}>
                      <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                      <TableCell>{approval.contractId}</TableCell>
                      <TableCell>{approval.approvedBy}</TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            display: 'inline-block',
                            px: 2,
                            py: 0.5,
                            borderRadius: 1,
                            bgcolor:
                              approval.approvalStatus === 'approved'
                                ? 'success.light'
                                : approval.approvalStatus === 'rejected'
                                  ? 'error.light'
                                  : 'warning.light',
                            color:
                              approval.approvalStatus === 'approved'
                                ? 'success.dark'
                                : approval.approvalStatus === 'rejected'
                                  ? 'error.dark'
                                  : 'warning.dark'
                          }}
                        >
                          {approval.approvalStatus}
                        </Box>
                      </TableCell>
                      <TableCell>{formatDate(approval.approvalDate)}</TableCell>
                      <TableCell>
                        <Tooltip title={approval.comments || 'No comments'}>
                          <Typography noWrap sx={{ maxWidth: 150 }}>
                            {approval.comments || 'No comments'}
                          </Typography>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title='Edit'>
                            <IconButton color='primary' onClick={() => handleOpenEditDialog(approval)}>
                              <i className='ri-edit-line' />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title='Delete'>
                            <IconButton color='error' onClick={() => handleDeleteContractApproval(approval.id || 0)}>
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
                Rows per page:
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
                {page * rowsPerPage + 1}-{Math.min((page + 1) * rowsPerPage, totalElements)} of {totalElements}
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

      {/* Contract Approval Form Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth='sm' fullWidth>
        <DialogTitle>{dialogMode === 'add' ? 'Add Contract Approval' : 'Edit Contract Approval'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 0 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='Contract ID'
                placeholder='Enter contract ID'
                value={formData.contractId || ''}
                onChange={e => handleFormChange('contractId', Number(e.target.value))}
                margin='normal'
                type='number'
                error={!!formErrors.contractId}
                helperText={formErrors.contractId}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='Approved By'
                placeholder='Enter approver name'
                value={formData.approvedBy || ''}
                onChange={e => handleFormChange('approvedBy', e.target.value)}
                margin='normal'
                error={!!formErrors.approvedBy}
                helperText={formErrors.approvedBy}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin='normal' error={!!formErrors.approvalStatus}>
                <InputLabel>Approval Status</InputLabel>
                <Select
                  value={formData.approvalStatus || ''}
                  onChange={e => handleFormChange('approvalStatus', e.target.value)}
                  label='Approval Status'
                >
                  {approvalStatusOptions.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.approvalStatus && <FormHelperText>{formErrors.approvalStatus}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='Approval Date'
                type='date'
                value={formData.approvalDate ? new Date(formData.approvalDate).toISOString().slice(0, 10) : ''}
                onChange={e => handleFormChange('approvalDate', e.target.value)}
                margin='normal'
                error={!!formErrors.approvalDate}
                helperText={formErrors.approvalDate}
                InputLabelProps={{
                  shrink: true
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Comments'
                placeholder='Enter comments'
                value={formData.comments || ''}
                onChange={e => handleFormChange('comments', e.target.value)}
                margin='normal'
                multiline
                rows={3}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color='inherit'>
            Cancel
          </Button>
          <Button onClick={handleSaveContractApproval} variant='contained' color='primary'>
            {dialogMode === 'add' ? 'Add' : 'Save'}
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

export default ContractApprovalsPage
