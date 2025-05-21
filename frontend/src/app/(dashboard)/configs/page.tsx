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

// Hook Imports
import { AxiosError } from 'axios'
import { useLanguage } from '@/i18n/LanguageContext'

// Service Imports
import type { Config } from '@/services/configService'
import { getConfigs, createConfig, updateConfig, deleteConfig } from '@/services/configService'
import type { SearchParams } from '@/services/crudService'

type DialogMode = 'add' | 'edit' | null
type Order = 'asc' | 'desc'

// Interface for search fields
interface FieldSearchValues {
  type: string
  code: string
  name: string
  description: string
}

const emptyFormData: Config = {
  id: 0,
  type: '',
  code: '',
  name: '',
  nameEn: '',
  description: ''
}

const ConfigsPage = () => {
  // All hooks should be grouped together at the top
  const { t, language } = useLanguage()

  // Table state
  const [order, setOrder] = useState<Order>('asc')
  const [orderBy, setOrderBy] = useState<keyof Config>('type')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null)

  // Field search values
  const [fieldSearchValues, setFieldSearchValues] = useState<FieldSearchValues>({
    type: '',
    code: '',
    name: '',
    description: ''
  })

  // Data state
  const [configs, setConfigs] = useState<Config[]>([])
  const [totalElements, setTotalElements] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // CRUD state
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)
  const [dialogMode, setDialogMode] = useState<DialogMode>(null)
  const [formData, setFormData] = useState<Config>(emptyFormData)

  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  })

  // Available row counts for the dropdown
  const availableRowsPerPage = [10, 20, 50, 100, 200, 500, 1000]

  // Ensure this always runs, even if there are no configs to render
  useEffect(() => {
    fetchConfigs()
  }, [rowsPerPage, page, order, orderBy])

  // Function to fetch configs from API with search parameter
  const fetchConfigs = async (fieldValues: FieldSearchValues = fieldSearchValues) => {
    setLoading(true)

    try {
      // Create search params object
      const searchParams: SearchParams = {}

      // Add individual field search params if they have values
      Object.entries(fieldValues).forEach(([key, value]) => {
        if (value) {
          if (key === 'name') {
            // Set either name or nameEn based on current language
            const searchField = language === 'en' ? 'nameEn' : 'name'
            searchParams[searchField] = value
          } else {
            searchParams[key] = value
          }
        }
      })

      const response = await getConfigs(page, rowsPerPage, orderBy, order, searchParams)

      setConfigs(response.configs)
      setTotalElements(response.totalElements)
      setError('')
    } catch (err) {
      setError('Failed to fetch configs')
      setConfigs([])
      setTotalElements(0)
      console.error(err)
    } finally {
      setLoading(false)
    }
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
      fetchConfigs(newFieldValues)
    }, 500) // Wait 500ms after user stops typing

    setSearchTimeout(timeout)
  }

  const handleClearFilters = () => {
    const emptySearch: FieldSearchValues = {
      type: '',
      code: '',
      name: '',
      description: ''
    }

    setFieldSearchValues(emptySearch)
    setPage(0)
    fetchConfigs(emptySearch)
  }

  const handleRequestSort = (property: keyof Config) => {
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

  const handleOpenEditDialog = (config: Config) => {
    setFormData(config)
    setDialogMode('edit')
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setDialogMode(null)
  }

  const handleFormChange = (field: keyof Config, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSaveConfig = async () => {
    try {
      if (dialogMode === 'add') {
        // Create new config
        await createConfig(formData as Omit<Config, 'id'>)
        showNotification(t.configs.configCreated, 'success')
      } else if (dialogMode === 'edit') {
        // Update existing config
        await updateConfig(formData)
        showNotification(t.configs.configUpdated, 'success')
      }

      // Refresh configs
      fetchConfigs()
      handleCloseDialog()
    } catch (err) {
      if (err instanceof AxiosError) {
        showNotification(err.response?.data.message || t.common.operationFailed, 'error')
      } else {
        showNotification(t.common.operationFailed, 'error')
        console.error(err)
      }
    }
  }

  const handleDeleteConfig = async (id: number) => {
    if (window.confirm(t.configs.confirmDelete)) {
      try {
        await deleteConfig(id)
        // Refresh configs
        fetchConfigs()
        showNotification(t.configs.configDeleted, 'success')
      } catch (err) {
        if (err instanceof AxiosError) {
          showNotification(err.response?.data.message || t.common.deleteFailed, 'error')
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

  const renderSortIcon = (headCell: keyof Config) => {
    if (orderBy !== headCell) {
      return <i className='ri-arrow-up-down-line' style={{ opacity: 0.3 }} />
    }

    return order === 'asc' ? <i className='ri-arrow-up-s-line' /> : <i className='ri-arrow-down-s-line' />
  }

  const handleRefresh = async () => {
    setLoading(true)

    try {
      await fetchConfigs()
      showNotification(t.common.refreshSuccess, 'success')
    } catch (err) {
      setError('Failed to refresh configs')
      showNotification(t.common.refreshError, 'error')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <Box sx={{ p: 5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant='h4'>{t.configs.title}</Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Tooltip title={t.configs.addConfig}>
              <Button variant='contained' startIcon={<i className='ri-add-line' />} onClick={handleOpenAddDialog}>
                {t.configs.addConfig}
              </Button>
            </Tooltip>
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
                  label={t.configs.type}
                  placeholder={`Search by ${t.configs.type.toLowerCase()}`}
                  value={fieldSearchValues.type}
                  onChange={e => handleFieldSearchChange('type', e.target.value)}
                  variant='outlined'
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <i className='ri-file-type-line' />
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label={t.configs.code}
                  placeholder={`Search by ${t.configs.code.toLowerCase()}`}
                  value={fieldSearchValues.code}
                  onChange={e => handleFieldSearchChange('code', e.target.value)}
                  variant='outlined'
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <i className='ri-code-line' />
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label={language === 'en' ? t.configs.nameEn : t.configs.name}
                  placeholder={`Search by ${language === 'en' ? t.configs.nameEn.toLowerCase() : t.configs.name.toLowerCase()}`}
                  value={fieldSearchValues.name}
                  onChange={e => handleFieldSearchChange('name', e.target.value)}
                  variant='outlined'
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <i className={language === 'en' ? 'ri-translate-2' : 'ri-text'} />
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label={t.configs.description}
                  placeholder={`Search by ${t.configs.description.toLowerCase()}`}
                  value={fieldSearchValues.description}
                  onChange={e => handleFieldSearchChange('description', e.target.value)}
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
            </Grid>
          </Box>
        </Box>

        {/* Table */}
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer>
            <Table sx={{ minWidth: 650 }} aria-label='configs table'>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Box sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                      {t.configs.type}
                      <IconButton size='small' onClick={() => handleRequestSort('type')}>
                        {renderSortIcon('type')}
                      </IconButton>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                      {t.configs.code}
                      <IconButton size='small' onClick={() => handleRequestSort('code')}>
                        {renderSortIcon('code')}
                      </IconButton>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                      {t.configs.name}
                      <IconButton size='small' onClick={() => handleRequestSort('name')}>
                        {renderSortIcon('name')}
                      </IconButton>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ display: 'none' }}>
                    <Box sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                      {t.configs.nameEn}
                      <IconButton size='small' onClick={() => handleRequestSort('nameEn')}>
                        {renderSortIcon('nameEn')}
                      </IconButton>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                      {t.configs.description}
                      <IconButton size='small' onClick={() => handleRequestSort('description')}>
                        {renderSortIcon('description')}
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
                    <TableCell colSpan={5} align='center' sx={{ py: 5 }}>
                      <CircularProgress size={40} />
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={5} align='center' sx={{ py: 5, color: 'error.main' }}>
                      {error}
                      <Button variant='text' color='primary' onClick={handleRefresh} sx={{ mt: 1 }}>
                        <i className='ri-refresh-line' style={{ marginRight: '4px' }} />
                        {t.common.search}
                      </Button>
                    </TableCell>
                  </TableRow>
                ) : configs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align='center' sx={{ py: 5 }}>
                      {t.configs.noConfigFound}
                    </TableCell>
                  </TableRow>
                ) : (
                  configs.map(config => (
                    <TableRow key={config.id} hover>
                      <TableCell>{config.type}</TableCell>
                      <TableCell>{config.code}</TableCell>
                      <TableCell>{language === 'en' ? config.nameEn || config.name : config.name}</TableCell>
                      <TableCell sx={{ display: 'none' }}>{config.nameEn}</TableCell>
                      <TableCell>{config.description}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title='Edit'>
                            <IconButton color='primary' onClick={() => handleOpenEditDialog(config)}>
                              <i className='ri-edit-line' />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title='Delete'>
                            <IconButton color='error' onClick={() => handleDeleteConfig(config.id)}>
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

          {/* Pagination */}
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

      {/* Form Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth='sm' fullWidth>
        <DialogTitle>{dialogMode === 'add' ? t.configs.addConfig : t.configs.editConfig}</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 0 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t.configs.type}
                value={formData.type}
                onChange={e => handleFormChange('type', e.target.value)}
                margin='normal'
                variant='outlined'
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t.configs.code}
                value={formData.code}
                onChange={e => handleFormChange('code', e.target.value)}
                margin='normal'
                variant='outlined'
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t.configs.name}
                value={formData.name}
                onChange={e => handleFormChange('name', e.target.value)}
                margin='normal'
                variant='outlined'
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t.configs.nameEn}
                value={formData.nameEn}
                onChange={e => handleFormChange('nameEn', e.target.value)}
                margin='normal'
                variant='outlined'
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t.configs.description}
                value={formData.description}
                onChange={e => handleFormChange('description', e.target.value)}
                margin='normal'
                variant='outlined'
                multiline
                rows={3}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color='inherit'>
            {t.common.cancel}
          </Button>
          <Button
            onClick={handleSaveConfig}
            variant='contained'
            color='primary'
            disabled={!formData.name || !formData.type || !formData.code}
          >
            {dialogMode === 'add' ? t.configs.addConfig : t.common.save}
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

export default ConfigsPage
