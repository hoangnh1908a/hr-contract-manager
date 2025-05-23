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
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import InputLabel from '@mui/material/InputLabel'

// Hook Imports
import { AxiosError } from 'axios'

import { useLanguage } from '@/i18n/LanguageContext'

// Service Imports
import type { ContractTemplate } from '@/services/contractTemplateService'
import {
  getContractTemplates,
  createContractTemplate,
  updateContractTemplate,
  deleteContractTemplate
} from '@/services/contractTemplateService'

type Order = 'asc' | 'desc'
type DialogMode = 'add' | 'edit' | null

const emptyFormData: ContractTemplate = {
  id: 0,
  fileName: '',
  fileNameEn: '',
  description: '',
  status: 1,
  file: null as File | null,
  params: ''
}

const ContractTemplatesPage = () => {
  const { t, language } = useLanguage()
  const [order, setOrder] = useState<Order>('asc')
  const [orderBy, setOrderBy] = useState<keyof ContractTemplate>('fileName')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [fieldSearchValues, setFieldSearchValues] = useState({
    fileName: '',
    fileNameEn: '',
    description: '',
    status: '',
    params: ''
  })
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null)
  const [totalElements, setTotalElements] = useState(0)

  // Data state
  const [contractTemplates, setContractTemplates] = useState<ContractTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // CRUD state
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)
  const [dialogMode, setDialogMode] = useState<DialogMode>(null)
  const [formData, setFormData] = useState<ContractTemplate>(emptyFormData)

  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  })

  // Available row counts for the dropdown
  const availableRowsPerPage = [10, 20, 50, 100, 200, 500, 1000]

  // Add state for selected file
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  // Fetch contract templates on component mount
  useEffect(() => {
    fetchContractTemplates()
  }, [])

  // Function to fetch contract templates from API
  const fetchContractTemplates = async (fieldValues = fieldSearchValues) => {
    setLoading(true)

    try {
      // Build searchParams from non-empty fields
      const searchParams: any = {}
      Object.entries(fieldValues).forEach(([key, value]) => {
        if (value) searchParams[key] = value
      })
      const data = await getContractTemplates(page, rowsPerPage, orderBy, order, searchParams)

      setContractTemplates(data.contractTemplates)
      setTotalElements(data.totalElements)
      setError('')
    } catch (err) {
      setError('Failed to fetch contract templates')
      setContractTemplates([])
      setTotalElements(0)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleRequestSort = (property: keyof ContractTemplate) => {
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
    setSelectedFile(null)
    setDialogMode('add')
    setDialogOpen(true)
  }

  const handleOpenEditDialog = (contractTemplate: ContractTemplate) => {
    setFormData({
      id: contractTemplate.id,
      fileName: contractTemplate.fileName,
      fileNameEn: contractTemplate.fileNameEn,
      description: contractTemplate.description,
      status: contractTemplate.status,
      file: null as File | null,
      params: ''
    })
    setDialogMode('edit')
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setDialogMode(null)
  }

  const handleFormChange = (field: keyof typeof formData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSaveContractTemplate = async () => {
    try {
      if (dialogMode === 'add') {
        // Create new contract template
        const newContractTemplate = await createContractTemplate(formData)

        setContractTemplates([...contractTemplates, newContractTemplate])

        showNotification(t.common.success, 'success')
      } else if (dialogMode === 'edit' && 'id' in formData) {
        // Update existing contract template
        const updatedContractTemplate = await updateContractTemplate({
          ...formData,
          id: Number((formData as any).id)
        })

        setContractTemplates(
          contractTemplates.map(template =>
            template.id === updatedContractTemplate.id ? updatedContractTemplate : template
          )
        )

        showNotification(t.common.success, 'success')
      }

      handleCloseDialog()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t.common.operationFailed
      showNotification(errorMessage, 'error')
      console.error(err)
    }
  }

  const handleDeleteContractTemplate = async (id: number) => {
    if (window.confirm(t.contractTemplates.confirmDelete)) {
      try {
        await deleteContractTemplate(id)
        setContractTemplates(contractTemplates.filter(template => template.id !== id))
        showNotification(t.common.success, 'success')
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : t.common.deleteFailed
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

  // Debounced field search change
  const handleFieldSearchChange = (field: keyof typeof fieldSearchValues, value: string) => {
    const newFieldValues = { ...fieldSearchValues, [field]: value }
    setFieldSearchValues(newFieldValues)
    if (searchTimeout) clearTimeout(searchTimeout)
    const timeout = setTimeout(() => {
      setPage(0)
      fetchContractTemplates(newFieldValues)
    }, 500)
    setSearchTimeout(timeout)
  }

  const renderSortIcon = (headCell: keyof ContractTemplate) => {
    if (orderBy !== headCell) {
      return null
    }

    return order === 'asc' ? <i className='ri-arrow-up-s-line' /> : <i className='ri-arrow-down-s-line' />
  }

  const handleRefresh = async () => {
    setLoading(true)

    try {
      const data = await getContractTemplates()

      setContractTemplates(data.contractTemplates)
      setTotalElements(data.totalElements)
      setError('')
      showNotification(t.common.refreshSuccess, 'success')
    } catch (err) {
      setError('Failed to refresh contract templates')
      const errorMessage = err instanceof Error ? err.message : t.common.refreshError
      showNotification(errorMessage, 'error')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <Box sx={{ p: 5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant='h4'>{t.contractTemplates.title}</Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Tooltip title='Refresh'>
              <IconButton onClick={handleRefresh} color='primary'>
                <i className='ri-refresh-line' />
              </IconButton>
            </Tooltip>
            <Button variant='contained' startIcon={<i className='ri-add-line' />} onClick={handleOpenAddDialog}>
              {t.contractTemplates.addContractTemplate}
            </Button>
          </Box>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label={language === 'en' ? t.contractTemplates.fileNameEn : t.contractTemplates.fileName}
                placeholder={t.contractTemplates.contractTemplateNamePlaceholder}
                value={fieldSearchValues.fileName}
                onChange={e => handleFieldSearchChange('fileName', e.target.value)}
                variant='outlined'
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <i className='ri-search-line' />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label={t.contractTemplates.params}
                placeholder={t.contractTemplates.contractTemplateParamsPlaceholder}
                value={fieldSearchValues.params}
                onChange={e => handleFieldSearchChange('fileName', e.target.value)}
                variant='outlined'
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <i className='ri-search-line' />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth>
                <InputLabel>{t.common.status}</InputLabel>
                <Select
                  value={fieldSearchValues.status}
                  label={t.common.status}
                  onChange={e => handleFieldSearchChange('status', e.target.value)}
                >
                  <MenuItem value=''>All</MenuItem>
                  <MenuItem value='1'>Active</MenuItem>
                  <MenuItem value='0'>Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>

        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer>
            <Table sx={{ minWidth: 650 }} aria-label='contract templates table'>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: '5%' }}>
                    <Box sx={{ fontWeight: 'bold' }}>#</Box>
                  </TableCell>
                  <TableCell sx={{ width: '15%' }}>
                    <Box sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                      {language === 'en' ? t.contractTemplates.fileNameEn : t.contractTemplates.fileName}
                      <IconButton size='small' onClick={() => handleRequestSort('fileName')}>
                        {renderSortIcon('fileName')}
                      </IconButton>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ width: '20%' }}>
                    <Box sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                      {t.contractTemplates.params}
                      <IconButton size='small' onClick={() => handleRequestSort('params')}>
                        {renderSortIcon('params')}
                      </IconButton>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                      {t.contractTemplates.description}
                      <IconButton size='small' onClick={() => handleRequestSort('description')}>
                        {renderSortIcon('description')}
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
                  <TableCell>
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
                ) : contractTemplates.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align='center' sx={{ py: 5 }}>
                      No contract templates found
                    </TableCell>
                  </TableRow>
                ) : (
                  contractTemplates.map((template, index) => (
                    <TableRow key={template.id}>
                      <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                      <TableCell>{language === 'en' ? template.fileNameEn : template.fileName}</TableCell>
                      <TableCell>{template.params}</TableCell>
                      <TableCell>{template.description}</TableCell>
                      <TableCell>
                        <Chip
                          className='capitalize'
                          variant='tonal'
                          color={template.status === 1 ? 'success' : 'error'}
                          label={template.status == 1 ? t.common.active : t.common.inactive}
                          size='small'
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex' }}>
                          <Tooltip title={t.contractTemplates.editContractTemplate}>
                            <IconButton color='primary' onClick={() => handleOpenEditDialog(template)}>
                              <i className='ri-edit-line' />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={t.contractTemplates.deleteContractTemplate}>
                            <IconButton color='error' onClick={() => handleDeleteContractTemplate(template.id)}>
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
                {t.common.rowsPerPage}:
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
                {page * rowsPerPage + 1}-{Math.min(page * rowsPerPage + rowsPerPage, totalElements)} of {totalElements}
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

      {/* Contract Template Form Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth='sm' fullWidth>
        <DialogTitle>
          {dialogMode === 'add' ? t.contractTemplates.addContractTemplate : t.contractTemplates.editContractTemplate}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 0 }}>
            <Grid item xs={12}>
              <Button variant='outlined' component='label' fullWidth sx={{ justifyContent: 'flex-start' }}>
                {selectedFile ? selectedFile.name : t.contractTemplates.chosseFile}
                <input
                  type='file'
                  accept='.docx'
                  hidden
                  onChange={e => {
                    const file = e.target.files && e.target.files[0]
                    if (file) {
                      setSelectedFile(file)
                      setFormData(prev => ({ ...prev, file: file }))
                    }
                  }}
                />
              </Button>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t.contractTemplates.fileName}
                placeholder={t.contractTemplates.fileName}
                value={formData.fileName}
                onChange={e => handleFormChange('fileName', e.target.value)}
                margin='normal'
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t.contractTemplates.fileNameEn}
                placeholder={t.contractTemplates.fileNameEn}
                value={formData.fileNameEn}
                onChange={e => handleFormChange('fileNameEn', e.target.value)}
                margin='normal'
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t.contractTemplates.description}
                placeholder={t.contractTemplates.description}
                value={formData.description}
                onChange={e => handleFormChange('description', e.target.value)}
                margin='normal'
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth margin='normal'>
                <Typography variant='body2' gutterBottom>
                  {t.common.status}
                </Typography>
                <Select value={formData.status} onChange={e => handleFormChange('status', Number(e.target.value))}>
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
            onClick={handleSaveContractTemplate}
            variant='contained'
            color='primary'
            disabled={!formData.fileName || !formData.description}
          >
            {dialogMode === 'add' ? t.contractTemplates.addContractTemplate : t.common.save}
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

export default ContractTemplatesPage
