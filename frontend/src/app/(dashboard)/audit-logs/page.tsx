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
import Tooltip from '@mui/material/Tooltip'
import CircularProgress from '@mui/material/CircularProgress'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'

// Hook Imports
import { useLanguage } from '@/i18n/LanguageContext'
import { useAuth } from '@/contexts/AuthContext'

// Service Imports
import type { AuditLog } from '@/services/auditLogService'
import { getAuditLogs } from '@/services/auditLogService'
import type { SearchParams } from '@/services/crudService'

// Utils Import

import { formatTimestamp } from '@/utils/dateUtils'

type Order = 'asc' | 'desc'

interface FieldSearchValues {
  fullName: string
  action: string
  tableName: string
  recordId: string
}

const AuditLogsPage = () => {
  const { t } = useLanguage()
  const { user } = useAuth()

  // Table state
  const [order, setOrder] = useState<Order>('desc')
  const [orderBy, setOrderBy] = useState<keyof AuditLog>('timestamp')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null)
  const [fieldSearchValues, setFieldSearchValues] = useState<FieldSearchValues>({
    fullName: '',
    action: '',
    tableName: '',
    recordId: ''
  })

  // Data state
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [totalElements, setTotalElements] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null)

  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  })

  // Available row counts for the dropdown
  const availableRowsPerPage = [10, 20, 50, 100, 200, 500, 1000]

  // Fetch audit logs from API (server-driven pagination)
  const fetchAuditLogs = async (fieldValues: FieldSearchValues = fieldSearchValues) => {
    setLoading(true)

    try {
      const searchParams: SearchParams = {}

      // Add individual field search params if they have values
      Object.entries(fieldValues).forEach(([key, value]) => {
        if (value) {
          searchParams[key] = value
        }
      })

      const response = await getAuditLogs(page, rowsPerPage, orderBy, order, searchParams)

      setAuditLogs(response.auditLogs)
      setTotalElements(response.totalElements)
      setError('')
    } catch (err) {
      setError('Failed to fetch audit logs')
      setAuditLogs([])
      setTotalElements(0)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Fetch on mount and whenever page, rowsPerPage, order, orderBy changes
  useEffect(() => {
    fetchAuditLogs()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, order, orderBy])

  // Handle field search change
  const handleFieldSearchChange = (field: keyof FieldSearchValues, value: string) => {
    const newFieldValues = { ...fieldSearchValues, [field]: value }
    setFieldSearchValues(newFieldValues)

    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }

    const timeout = setTimeout(() => {
      setPage(0)
      fetchAuditLogs(newFieldValues)
    }, 500) // Wait 500ms after user stops typing

    setSearchTimeout(timeout)
  }

  const handleRequestSort = (property: keyof AuditLog) => {
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

  const showNotification = (message: string, severity: 'success' | 'error') => {
    setNotification({ open: true, message, severity })
  }

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false })
  }

  const handleViewDetails = (log: AuditLog) => {
    setSelectedLog(log)
    setDetailsDialogOpen(true)
  }

  const handleCloseDetailsDialog = () => {
    setDetailsDialogOpen(false)
    setSelectedLog(null)
  }

  const handleRefresh = async () => {
    setLoading(true)

    try {
      await fetchAuditLogs()
      showNotification(t.common.refreshSuccess, 'success')
    } catch (err) {
      setError('Failed to refresh audit logs')
      showNotification(t.common.refreshError, 'error')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleClearFilters = () => {
    setFieldSearchValues({
      fullName: '',
      action: '',
      tableName: '',
      recordId: ''
    })
    setPage(0)
    fetchAuditLogs({
      fullName: '',
      action: '',
      tableName: '',
      recordId: ''
    })
  }

  const renderSortIcon = (headCell: keyof AuditLog) => {
    if (orderBy !== headCell) {
      return <i className='ri-arrow-up-down-line' style={{ opacity: 0.3 }} />
    }

    return order === 'asc' ? <i className='ri-arrow-up-s-line' /> : <i className='ri-arrow-down-s-line' />
  }

  return (
    <Card>
      <Box sx={{ p: 5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant='h4'>{t.auditLogs.title}</Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Tooltip title='Refresh'>
              <IconButton onClick={handleRefresh} color='primary'>
                <i className='ri-refresh-line' />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            {Object.values(fieldSearchValues).some(value => value !== '') && (
              <Button color='error' onClick={handleClearFilters} startIcon={<i className='ri-close-line' />}>
                {t.common.filter}
              </Button>
            )}
          </Box>

          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label={t.auditLogs.fullName}
                  placeholder={`Search by ${t.auditLogs.fullName.toLowerCase()}`}
                  value={fieldSearchValues.fullName}
                  onChange={e => handleFieldSearchChange('fullName', e.target.value)}
                  variant='outlined'
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <i className='ri-user-line' />
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label={t.common.actions}
                  placeholder={`Search by ${t.common.actions.toLowerCase()}`}
                  value={fieldSearchValues.action}
                  onChange={e => handleFieldSearchChange('action', e.target.value)}
                  variant='outlined'
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <i className='ri-settings-line' />
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label={t.auditLogs.tableName}
                  placeholder={`Search by ${t.auditLogs.tableName.toLowerCase()}`}
                  value={fieldSearchValues.tableName}
                  onChange={e => handleFieldSearchChange('tableName', e.target.value)}
                  variant='outlined'
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <i className='ri-table-line' />
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label={t.auditLogs.recordId}
                  placeholder={`Search by ${t.auditLogs.recordId.toLowerCase()}`}
                  value={fieldSearchValues.recordId}
                  onChange={e => handleFieldSearchChange('recordId', e.target.value)}
                  variant='outlined'
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <i className='ri-hashtag' />
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        </Box>

        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer>
            <Table aria-label='audit logs table'>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Box sx={{ fontWeight: 'bold' }}>#</Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>{t.auditLogs.fullName}</Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                      {t.common.actions}
                      <IconButton size='small' onClick={() => handleRequestSort('action')}>
                        {renderSortIcon('action')}
                      </IconButton>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                      {t.auditLogs.tableName}
                      <IconButton size='small' onClick={() => handleRequestSort('tableName')}>
                        {renderSortIcon('tableName')}
                      </IconButton>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                      {t.auditLogs.timestamp}
                      <IconButton size='small' onClick={() => handleRequestSort('timestamp')}>
                        {renderSortIcon('timestamp')}
                      </IconButton>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ width: '10%' }}>
                    <Box sx={{ fontWeight: 'bold' }}>{t.common.actions}</Box>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} align='center' sx={{ py: 5 }}>
                      <CircularProgress size={40} />
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={6} align='center' sx={{ py: 5, color: 'error.main' }}>
                      {error}
                    </TableCell>
                  </TableRow>
                ) : auditLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align='center' sx={{ py: 5 }}>
                      {t.auditLogs.noLogsFound}
                    </TableCell>
                  </TableRow>
                ) : (
                  auditLogs.map((log, index) => (
                    <TableRow key={log.id} hover>
                      <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                      <TableCell>{log.fullName || '-'}</TableCell>
                      <TableCell>{log.action || '-'}</TableCell>
                      <TableCell>{log.tableName || '-'}</TableCell>
                      <TableCell>{log.timestamp ? formatTimestamp(log.timestamp) : '-'}</TableCell>
                      <TableCell>
                        <Tooltip title={t.auditLogs.viewDetails}>
                          <IconButton color='info' onClick={() => handleViewDetails(log)}>
                            <i className='ri-eye-line' />
                          </IconButton>
                        </Tooltip>
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

      {/* Details Dialog */}
      <Dialog open={detailsDialogOpen} onClose={handleCloseDetailsDialog} maxWidth='md' fullWidth>
        <DialogTitle>{t.auditLogs.details}</DialogTitle>
        <DialogContent>
          {selectedLog && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant='subtitle2'>ID:</Typography>
                  <Typography variant='body2'>{selectedLog.id}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant='subtitle2'>{t.auditLogs.fullName}:</Typography>
                  <Typography variant='body2'>{selectedLog.fullName || '-'}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant='subtitle2'>{t.common.actions}:</Typography>
                  <Typography variant='body2'>{selectedLog.action || '-'}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant='subtitle2'>{t.auditLogs.tableName}:</Typography>
                  <Typography variant='body2'>{selectedLog.tableName || '-'}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant='subtitle2'>{t.auditLogs.recordId}:</Typography>
                  <Typography variant='body2'>{selectedLog.recordId}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant='subtitle2'>{t.auditLogs.timestamp}:</Typography>
                  <Typography variant='body2'>{formatTimestamp(selectedLog.timestamp)}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant='subtitle2'>{t.auditLogs.oldValue}:</Typography>
                  <Paper variant='outlined' sx={{ p: 2, mt: 1, mb: 2, maxHeight: '150px', overflow: 'auto' }}>
                    <Typography
                      variant='body2'
                      component='pre'
                      sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
                    >
                      {selectedLog.oldValue || '-'}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant='subtitle2'>{t.auditLogs.newValue}:</Typography>
                  <Paper variant='outlined' sx={{ p: 2, mt: 1, maxHeight: '150px', overflow: 'auto' }}>
                    <Typography
                      variant='body2'
                      component='pre'
                      sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
                    >
                      {selectedLog.newValue || '-'}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetailsDialog} color='primary'>
            Close
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

export default AuditLogsPage
