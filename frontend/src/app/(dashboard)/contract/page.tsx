'use client'

import { useState, useEffect, useRef } from 'react'
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
import InputLabel from '@mui/material/InputLabel'
import Autocomplete from '@mui/material/Autocomplete'

import { useLanguage } from '@/i18n/LanguageContext'
import { useAuth } from '@/contexts/AuthContext'

// Import contract service and types
import type { Contract, ContractDownloadResponse } from '@/services/contractService'
import { getContracts, createContract, deleteContract, downloadContractFile } from '@/services/contractService'
import type { SearchParams } from '@/services/crudService'
import { formatDate, formatTimestamp, dayOfWeek, plusMonth } from '@/utils/dateUtils'

// Import additional services
import { Employee, getAllNameEmployee, getEmployeeById } from '@/services/employeeService'
import { ContractTemplate, getContractTemplates, getContractTemplateHtml } from '@/services/contractTemplateService'
import { Config, getConfigs } from '@/services/configService'

type Order = 'asc' | 'desc'
type DialogMode = 'add' | 'edit' | null

// Interface for search fields
interface FieldSearchValues {
  employeeId: string
  contractTemplateId: string
  contractStatusId: string
  contractType: string
  fileName: string
  fileNameEn: string
  description: string
  createdBy: string
  updatedBy: string
  fromDate: string
  toDate: string
}

const emptyFormData: Contract = {
  id: 0,
  employeeId: 0,
  contractTemplateId: 0,
  contractStatusId: 0,
  contractType: '12',
  fileName: '',
  fileNameEn: '',
  description: '',
  createdBy: '',
  updatedBy: '',
  htmlContract: ''
}

const ContractPage = () => {
  const { t, language } = useLanguage()
  const { user } = useAuth()
  const isAdmin = user?.roles.includes('ADMIN')
  const [order, setOrder] = useState<Order>('desc')
  const [orderBy, setOrderBy] = useState<keyof Contract>('id')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null)

  // Multi-field search state
  const [fieldSearchValues, setFieldSearchValues] = useState<FieldSearchValues>({
    employeeId: '',
    contractTemplateId: '',
    contractStatusId: '',
    contractType: '',
    fileName: '',
    fileNameEn: '',
    description: '',
    createdBy: '',
    updatedBy: '',
    fromDate: '',
    toDate: ''
  })

  // Data state
  const [contracts, setContracts] = useState<Contract[]>([])
  const [totalElements, setTotalElements] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // CRUD state
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)
  const [dialogMode, setDialogMode] = useState<DialogMode>(null)
  const [formData, setFormData] = useState<Contract>(emptyFormData)

  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  })

  // Available row counts for the dropdown
  const availableRowsPerPage = [10, 20, 50, 100, 200, 500, 1000]

  // Reference data state
  const [employeeNames, setEmployeeNames] = useState<Employee[]>([])
  const [contractTemplates, setContractTemplates] = useState<ContractTemplate[]>([])
  const [configs, setConfigs] = useState<Config[]>([])

  // HTML preview state
  const [htmlPreviewOpen, setHtmlPreviewOpen] = useState<boolean>(false)
  const [templateHtml, setTemplateHtml] = useState<string>('')
  const [templateParams, setTemplateParams] = useState<Record<string, string>>({})
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(null)
  const [renderedHtml, setRenderedHtml] = useState<string>('')
  const [hideDate, setHideDate] = useState<Date>()

  // Fetch contracts on component mount and when pagination/sorting/filtering changes
  useEffect(() => {
    fetchContracts()
  }, [page, rowsPerPage, order, orderBy])

  // Add this useEffect to fetch reference data
  useEffect(() => {
    // Fetch employees, contract templates, and contract statuses
    const fetchReferenceData = async () => {
      try {
        const employeesResponse = await getAllNameEmployee()
        setEmployeeNames(employeesResponse)

        // Fetch all contract templates
        const templatesResponse = await getContractTemplates(0, 1000)
        setContractTemplates(templatesResponse.contractTemplates)

        // Fetch all contract statuses
        const statusesResponse = await getConfigs(0, 1000)
        setConfigs(statusesResponse.configs)
      } catch (error) {
        console.error('Error fetching reference data:', error)
      }
    }

    fetchReferenceData()
  }, [])

  // Function to fetch contracts from API
  const fetchContracts = async (fieldValues: FieldSearchValues = fieldSearchValues) => {
    setLoading(true)

    try {
      const searchParams: SearchParams = {}

      // Add individual field search params if they have values
      Object.entries(fieldValues).forEach(([key, value]) => {
        if (value) {
          searchParams[key] = value
        }
      })

      const data = await getContracts(page, rowsPerPage, orderBy, order, searchParams)

      setContracts(data.contracts)
      setTotalElements(data.totalElements)
      setError('')
    } catch (err) {
      setError('Failed to fetch contracts')
      setContracts([])
      setTotalElements(0)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Handle field search change - update to handle datetime properly
  const handleFieldSearchChange = (field: keyof FieldSearchValues, value: string) => {
    const newFieldValues = { ...fieldSearchValues, [field]: value }
    setFieldSearchValues(newFieldValues)

    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }

    const timeout = setTimeout(() => {
      setPage(0)
      fetchContracts(newFieldValues)
    }, 500) // Wait 500ms after user stops typing

    setSearchTimeout(timeout)
  }

  // Helper function to format datetime for the input fields
  const formatDateForInput = (dateString: string): string => {
    if (!dateString) return ''
    try {
      // If it's already in the ISO format, return it
      if (dateString.includes('T')) return dateString

      // If it's in DD/MM/YYYY HH:MM:SS format, convert to ISO
      const parts = dateString.split(' ')
      if (parts.length === 2) {
        const [day, month, year] = parts[0].split('/')
        return `${year}-${month}-${day}T${parts[1]}`
      }

      // Otherwise, just return an empty string
      return ''
    } catch (e) {
      return ''
    }
  }

  const handleRequestSort = (property: keyof Contract) => {
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

  const handleOpenEditDialog = (contract: Contract) => {
    // When editing, load the contract data into the form
    setFormData({
      id: contract.id,
      employeeId: contract.employeeId,
      contractTemplateId: contract.contractTemplateId,
      contractStatusId: contract.contractStatusId,
      contractType: contract.contractType || '',
      fileName: contract.fileName,
      fileNameEn: contract.fileNameEn || '',
      description: contract.description || '',
      createdBy: contract.createdBy,
      updatedBy: contract.updatedBy,
      htmlContract: contract.htmlContract || ''
    })
    setDialogMode('edit')
    setDialogOpen(true)

    // If there's a valid template ID, load the template preview
    if (contract.contractTemplateId) {
      handleTemplateSelect(contract.contractTemplateId)
    }
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setDialogMode(null)
  }

  const handleFormChange = (field: keyof Contract, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSaveContract = async () => {
    try {
      // Validate form data
      if (!formData.employeeId || !formData.contractTemplateId || !formData.fileName) {
        const errorMessage = t.contracts.missingRequiredFields || t.common.error
        showNotification(errorMessage, 'error')
        return
      }

      if (dialogMode === 'add') {
        // Create new contract
        const newContract = {
          employeeId: formData.employeeId,
          contractTemplateId: formData.contractTemplateId,
          contractStatusId: formData.contractStatusId,
          contractType: formData.contractType,
          fileName: formData.fileName,
          fileNameEn: formData.fileNameEn,
          description: formData.description,
          htmlContract: formData.htmlContract
        }
        // Add creator information
        if (user) {
          ;(newContract as any).createdBy = user.fullName
        }

        await createContract(newContract as Contract)
        showNotification(t.contracts.contractCreated || 'Contract created successfully', 'success')
      }

      // Refresh contract list and close dialog
      fetchContracts()
      handleCloseDialog()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t.common.operationFailed || 'Operation failed'
      showNotification(errorMessage, 'error')
      console.error(err)
    }
  }

  const handleDeleteContract = async (id: number) => {
    if (window.confirm(t.contracts.confirmDelete || 'Are you sure you want to delete this contract?')) {
      try {
        await deleteContract(id)
        showNotification(t.contracts.contractDeleted || 'Contract deleted successfully', 'success')
        // Refresh contracts
        fetchContracts()
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : t.common.error || 'An error occurred'
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

  const renderSortIcon = (headCell: keyof Contract) => {
    if (orderBy !== headCell) {
      return <i className='ri-arrow-up-down-line' style={{ opacity: 0.3 }} />
    }

    return order === 'asc' ? <i className='ri-arrow-up-s-line' /> : <i className='ri-arrow-down-s-line' />
  }

  const handleRefresh = async () => {
    setLoading(true)

    try {
      await fetchContracts()
      showNotification(t.common.success || 'Success', 'success')
    } catch (err) {
      setError('Failed to refresh contracts')
      const errorMessage = err instanceof Error ? err.message : t.common.error || 'An error occurred'
      showNotification(errorMessage, 'error')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleClearFilters = () => {
    const emptySearch: FieldSearchValues = {
      employeeId: '',
      contractTemplateId: '',
      contractStatusId: '',
      contractType: '',
      fileName: '',
      fileNameEn: '',
      description: '',
      createdBy: '',
      updatedBy: '',
      fromDate: '',
      toDate: ''
    }

    setFieldSearchValues(emptySearch)
    setPage(0)
    fetchContracts(emptySearch)
  }

  // Helper functions to get names from IDs
  const getEmployeeName = (id: number): string => {
    const employeeName = employeeNames.find(emp => emp.id === id)
    return employeeName ? employeeName.fullName : `ID: ${id}`
  }

  const getTemplateName = (id: number): string => {
    const template = contractTemplates.find(temp => temp.id === id)
    return template ? template.fileName : `ID: ${id}`
  }

  const getStatusName = (code: string): string => {
    const status = configs.find(stat => stat.code === code)
    if (status) {
      if (language === 'vi') {
        return status.code == code ? status.name : ''
      } else {
        return status.code == code ? status.nameEn : ''
      }
    }
    return ''
  }

  // Function to extract parameters from template
  const extractTemplateParams = (html: string): void => {
    try {
      // Extract parameters from HTML content using a regular expression
      // Look for patterns like {{paramName}}
      const regex = /\{\{([^}]+)\}\}/g
      const matches = html.match(regex)

      if (!matches) {
        setTemplateParams({})
        return
      }

      // Get unique parameter names
      const paramsList = [...new Set(matches.map(match => match.replace(/[{}]/g, '')))]

      // Initialize the params with values based on the employee
      setParamsList(paramsList)
    } catch (error) {
      console.error('Error extracting template parameters:', error)
      setTemplateParams({})
    }
  }

  // Function to handle template selection and show HTML preview
  const handleTemplateSelect = async (templateId: number) => {
    handleFormChange('contractTemplateId', templateId)

    if (templateId > 0) {
      try {
        setLoading(true)
        const html = await getContractTemplateHtml(templateId)
        setTemplateHtml(html)
        setSelectedTemplateId(templateId)

        if (html === null) {
          setTemplateHtml('')
          setTemplateParams({})
          setSelectedTemplateId(null)
          showNotification(t.common.error || 'Error', 'error')
          return
        }

        // Get the selected template
        const selectedTemplate = contractTemplates.find(t => t.id === templateId)

        // Initialize parameters from template params if available
        if (selectedTemplate?.params) {
          // Process template parameters by removing brackets and splitting by comma
          const cleanedParamsString = selectedTemplate.params
            .replaceAll('[', '')
            .replaceAll(']', '')
            .replaceAll('"', '')

          // Split parameters string into individual parameters
          const paramsList = cleanedParamsString.split(',')

          // Set the parameters for the template
          setParamsList(paramsList)
        } else {
          // Extract parameters from HTML if no params are defined
          extractTemplateParams(html)
        }

        // Open the HTML preview dialog
        setHtmlPreviewOpen(true)
      } catch (err) {
        console.error('Error loading template HTML:', err)
        const errorMessage = err instanceof Error ? err.message : t.common.error || 'An error occurred'
        showNotification(errorMessage, 'error')
      } finally {
        setLoading(false)
      }
    }
  }

  // Helper to set template parameters based on the current employee and template
  const setParamsList = async (paramsList: string[]): Promise<void> => {
    const employeesResponse = await getEmployeeById(formData.employeeId)
    const employee = employeesResponse.employee
    const hireDateForEmployee = new Date(employee.hireDate)
    const endDateForEmployee = new Date(hireDateForEmployee)
    endDateForEmployee.setMonth(hireDateForEmployee.getMonth() + 12)
    setHideDate(hireDateForEmployee)
    const companies: Config[] = configs.filter(config => config['type'] == 'company') // get type company

    const initialParams: Record<string, string> = {}

    paramsList.forEach(param => {
      const trimmedParam = param.trim()
      if (trimmedParam) {
        if (trimmedParam.includes('dayOfWeek')) {
          initialParams[trimmedParam] = dayOfWeek(new Date())
        } else if (trimmedParam.includes('day')) {
          initialParams[trimmedParam] = new Date().getDay().toString()
        } else if (trimmedParam.includes('month')) {
          initialParams[trimmedParam] = (new Date().getMonth() + 1).toString()
        } else if (trimmedParam.includes('year')) {
          initialParams[trimmedParam] = new Date().getFullYear().toString()
        } else if (trimmedParam.includes('categoryOfLaborContract')) {
          initialParams[trimmedParam] = 'Hợp đồng lao động có thời hạn'
        } else if (trimmedParam.includes('monthContract')) {
          initialParams[trimmedParam] = '12'
          // fill employee
        } else if (trimmedParam.includes('employee')) {
          if (trimmedParam.includes('employeeName')) {
            initialParams[trimmedParam] = employee?.fullName || ''
          } else if (trimmedParam.includes('employeeNumber')) {
            initialParams[trimmedParam] = employee?.numberId || ''
          } else if (trimmedParam.includes('employeeNational')) {
            initialParams[trimmedParam] = employee?.nationality || ''
          } else if (trimmedParam.includes('employeeDateOfBirth')) {
            initialParams[trimmedParam] = formatDate(employee?.dateOfBirth) || ''
          } else if (trimmedParam.includes('employeePlaceOfOrigin')) {
            initialParams[trimmedParam] = employee?.placeOfOrigin || ''
          } else if (trimmedParam.includes('employeePlaceOfResidence')) {
            initialParams[trimmedParam] = employee?.placeOfResidence || ''
          } else if (trimmedParam.includes('employeeAddress')) {
            initialParams[trimmedParam] = employee?.placeOfResidence || ''
          } else if (trimmedParam.includes('employeeDepartment')) {
            initialParams[trimmedParam] = employeesResponse?.department || ''
          } else if (trimmedParam.includes('employeePosition')) {
            initialParams[trimmedParam] = employeesResponse?.position || ''
          } else if (trimmedParam.includes('employeeSalary')) {
            initialParams[trimmedParam] = employee?.salary || ''
          } else if (trimmedParam.includes('employeeSalaryAllowance')) {
            initialParams[trimmedParam] = employee?.salaryAllowance || ''
          } else if (trimmedParam.includes('employeeFromDay')) {
            initialParams[trimmedParam] = hireDateForEmployee.getDay().toString() || ''
          } else if (trimmedParam.includes('employeeFromMonth')) {
            initialParams[trimmedParam] = (hireDateForEmployee.getMonth() + 1).toString() || ''
          } else if (trimmedParam.includes('employeeFromYear')) {
            initialParams[trimmedParam] = hireDateForEmployee.getFullYear().toString() || ''
          } else if (trimmedParam.includes('employeeToDay')) {
            initialParams[trimmedParam] = endDateForEmployee.getDay().toString() || ''
          } else if (trimmedParam.includes('employeeToMonth')) {
            initialParams[trimmedParam] = (endDateForEmployee.getMonth() + 1).toString() || ''
          } else if (trimmedParam.includes('employeeToYear')) {
            initialParams[trimmedParam] = endDateForEmployee.getFullYear().toString() || ''
          }
        } else if (companies.some(company => trimmedParam.includes(company.code))) {
          // Keep employer params but set them to empty string
          initialParams[trimmedParam] = companies.find(company => trimmedParam.includes(company.code))?.name || ''
        } else {
          // General parameters (not employee or employer specific)
          initialParams[trimmedParam] = ''
        }
      }
    })

    setTemplateParams(initialParams)
  }

  // Function to update parameter value
  const handleParamChange = (paramName: string, value: string) => {
    if (paramName.includes('monthContract')) {
      formData.contractType = value
    }
    setTemplateParams(prev => ({
      ...prev,
      [paramName]: value,
      ['employeeToDay']: paramName.includes('monthContract')
        ? plusMonth(hideDate as Date, value)
            .getDay()
            .toString()
        : '', // Keep the old value if not updating
      ['employeeToMonth']: paramName.includes('monthContract')
        ? plusMonth(hideDate as Date, value)
            .getMonth()
            .toString()
        : '',
      ['employeeToYear']: paramName.includes('monthContract')
        ? plusMonth(hideDate as Date, value)
            .getFullYear()
            .toString()
        : ''
    }))
  }

  // Function to apply parameters to HTML
  const applyParamsToHtml = (html: string, params: Record<string, string>): string => {
    let updatedHtml = html

    Object.entries(params).forEach(([key, value]) => {
      // Special handling for data parameters in ${data} format
      if (html.includes('${' + key + '}')) {
        // Replace ${data} with the value maintaining the ${} syntax
        updatedHtml = updatedHtml.replace(new RegExp('\\$\\{' + key + '\\}', 'g'), value)
      } else {
        // Standard parameter replacement with escaped special characters
        const regex = new RegExp('\\$\\{' + key + '\\}', 'g')
        updatedHtml = updatedHtml.replace(regex, '')
      }
    })

    return updatedHtml
  }

  // Function to update the displayed HTML with parameter values
  const updateDisplayedHtml = () => {
    if (templateHtml) {
      const updatedHtml = applyParamsToHtml(templateHtml, templateParams)
      setRenderedHtml(updatedHtml)
    }
  }

  // Update HTML when parameters change
  useEffect(() => {
    if (htmlPreviewOpen && templateHtml) {
      updateDisplayedHtml()
    }
  }, [templateHtml, templateParams, htmlPreviewOpen])

  // Handle close HTML preview dialog
  const handleCloseHtmlPreview = () => {
    handleFormChange('htmlContract', renderedHtml)
    setHtmlPreviewOpen(false)
    setTemplateHtml('')
    setTemplateParams({})
    setRenderedHtml('')
  }

  const handleDownloadContract = async (id: number) => {
    try {
      showNotification(t.contracts.downloadStarted || 'Download started', 'success')

      // Download the contract file
      const response = await downloadContractFile(id)

      // Create a URL from the blob
      const url = URL.createObjectURL(response.file)

      // Create a link element
      const link = document.createElement('a')
      link.href = url

      // Set the filename based on language
      if (language === 'vi') {
        link.setAttribute('download', `${response.fileName}.docx`)
      } else {
        link.setAttribute('download', `${response.fileName}.docx`)
      }

      // Append the link to the body
      document.body.appendChild(link)

      // Trigger the download
      link.click()

      // Clean up by removing the link and revoking the URL
      setTimeout(() => {
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
      }, 100)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t.common.error || 'An error occurred'
      showNotification(errorMessage, 'error')
      console.error(err)
    }
  }

  return (
    <Card>
      <Box sx={{ p: 5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant='h4'>{t.contracts.title || 'Contracts'}</Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Tooltip title={t.common.refresh || 'Refresh'}>
              <IconButton onClick={handleRefresh} color='primary'>
                <i className='ri-refresh-line' />
              </IconButton>
            </Tooltip>
            <Button variant='contained' startIcon={<i className='ri-add-line' />} onClick={handleOpenAddDialog}>
              {t.contracts.addContract || 'Add Contract'}
            </Button>
          </Box>
        </Box>

        {/* Search Fields */}
        <Paper sx={{ p: 2, mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            {Object.values(fieldSearchValues).some(value => value !== '') && (
              <Button color='error' onClick={handleClearFilters} startIcon={<i className='ri-filter-off-line' />}>
                {t.common.filter || 'Filter'}
              </Button>
            )}
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                size='small'
                label={t.contracts.description || 'Description'}
                placeholder={`Search by ${t.contracts.description?.toLowerCase() || 'description'}`}
                variant='outlined'
                value={fieldSearchValues.description}
                onChange={e => handleFieldSearchChange('description', e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <i className='ri-file-text-line' />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                size='small'
                label={t.contracts.fileName || 'File Name'}
                placeholder={`Search by ${t.contracts.fileName?.toLowerCase() || 'file name'}`}
                variant='outlined'
                value={fieldSearchValues.fileName}
                onChange={e => handleFieldSearchChange('fileName', e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <i className='ri-file-line' />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size='small'>
                <InputLabel id='employee-search-label'>{t.contracts.employee || 'Employee'}</InputLabel>
                <Select
                  labelId='employee-search-label'
                  value={fieldSearchValues.employeeId}
                  onChange={e => handleFieldSearchChange('employeeId', e.target.value)}
                  label={t.contracts.employee || 'Employee'}
                  displayEmpty
                  startAdornment={
                    <InputAdornment position='start'>
                      <i className='ri-user-line' />
                    </InputAdornment>
                  }
                >
                  <MenuItem value=''>{t.contracts.selectEmployee || 'Select Employee'}</MenuItem>
                  {employeeNames.map(employeeName => (
                    <MenuItem key={`search-emp-${employeeName.id}`} value={employeeName.id.toString()}>
                      {employeeName.fullName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size='small'>
                <InputLabel id='template-search-label'>{t.contracts.template || 'Template'}</InputLabel>
                <Select
                  labelId='template-search-label'
                  value={fieldSearchValues.contractTemplateId}
                  onChange={e => handleFieldSearchChange('contractTemplateId', e.target.value)}
                  label={t.contracts.template || 'Template'}
                  displayEmpty
                  startAdornment={
                    <InputAdornment position='start'>
                      <i className='ri-file-copy-line' />
                    </InputAdornment>
                  }
                >
                  <MenuItem value=''>{t.contracts.selectTemplate || 'Select Template'}</MenuItem>
                  {contractTemplates.map(template => (
                    <MenuItem key={template.id} value={template.id.toString()}>
                      {template.fileName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size='small'>
                <InputLabel id='status-search-label'>{t.common.status || 'Status'}</InputLabel>
                <Select
                  labelId='status-search-label'
                  value={fieldSearchValues.contractStatusId}
                  onChange={e => handleFieldSearchChange('contractStatusId', e.target.value)}
                  label={t.common.status || 'Status'}
                  displayEmpty
                  startAdornment={
                    <InputAdornment position='start'>
                      <i className='ri-checkbox-multiple-line' />
                    </InputAdornment>
                  }
                >
                  <MenuItem value=''>{t.contracts.selectStatus || 'Select Status'}</MenuItem>
                  {configs.map(status => (
                    <MenuItem key={status.id} value={status.id.toString()}>
                      {status.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                size='small'
                label='From Date'
                variant='outlined'
                type='datetime-local'
                value={formatDateForInput(fieldSearchValues.fromDate)}
                onChange={e =>
                  handleFieldSearchChange(
                    'fromDate',
                    e.target.value ? formatTimestamp(new Date(e.target.value).toISOString()) : ''
                  )
                }
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <i className='ri-calendar-line' />
                    </InputAdornment>
                  )
                }}
                placeholder=''
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                size='small'
                label='To Date'
                variant='outlined'
                type='datetime-local'
                value={formatDateForInput(fieldSearchValues.toDate)}
                onChange={e =>
                  handleFieldSearchChange(
                    'toDate',
                    e.target.value ? formatTimestamp(new Date(e.target.value).toISOString()) : ''
                  )
                }
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <i className='ri-calendar-line' />
                    </InputAdornment>
                  )
                }}
                placeholder=''
              />
            </Grid>
          </Grid>
        </Paper>

        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer>
            <Table sx={{ minWidth: 650 }} aria-label='contracts table'>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: '15%' }}>
                    <Box sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                      {t.contracts.fileName || 'File Name'}
                      <IconButton size='small' onClick={() => handleRequestSort('fileName')}>
                        {renderSortIcon('fileName')}
                      </IconButton>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ width: '10%' }}>
                    <Box sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                      {t.contracts.employee || 'Employee'}
                      <IconButton size='small' onClick={() => handleRequestSort('employeeId')}>
                        {renderSortIcon('employeeId')}
                      </IconButton>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ width: '10%' }}>
                    <Box sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                      {t.contracts.template || 'Template'}
                      <IconButton size='small' onClick={() => handleRequestSort('contractTemplateId')}>
                        {renderSortIcon('contractTemplateId')}
                      </IconButton>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ width: '15%' }}>
                    <Box sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                      {t.contracts.description || 'Description'}
                      <IconButton size='small' onClick={() => handleRequestSort('description')}>
                        {renderSortIcon('description')}
                      </IconButton>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ width: '10%' }}>
                    <Box sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                      {t.common.status || 'Status'}
                      <IconButton size='small' onClick={() => handleRequestSort('contractStatusId')}>
                        {renderSortIcon('contractStatusId')}
                      </IconButton>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ width: '10%' }}>
                    <Box sx={{ fontWeight: 'bold' }}>{t.common.actions || 'Actions'}</Box>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={isAdmin ? 8 : 6} align='center' sx={{ py: 5 }}>
                      <CircularProgress size={40} />
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={isAdmin ? 8 : 6} align='center' sx={{ py: 5, color: 'error.main' }}>
                      {error}
                      <Button variant='text' color='primary' onClick={handleRefresh} sx={{ mt: 1 }}>
                        <i className='ri-refresh-line' style={{ marginRight: '4px' }} />
                        {t.common.search || 'Search'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ) : contracts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={isAdmin ? 8 : 6} align='center' sx={{ py: 5 }}>
                      {t.common.noData || 'No data found'}
                    </TableCell>
                  </TableRow>
                ) : (
                  contracts.map(contract => (
                    <TableRow key={contract.id} hover tabIndex={-1}>
                      <TableCell>{contract.fileName}</TableCell>
                      <TableCell>{getEmployeeName(contract.employeeId)}</TableCell>
                      <TableCell>{getTemplateName(contract.contractTemplateId)}</TableCell>
                      <TableCell>{contract.description}</TableCell>
                      <TableCell>
                        <Chip
                          className='capitalize'
                          variant='tonal'
                          color={contract.contractStatusId === 0 ? 'warning' : 'success'}
                          label={getStatusName(String(contract.contractStatusId))}
                          size='small'
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          {contract.contractStatusId === 0 && (
                            <Tooltip title={t.contracts.downloadContract || 'Download Contract'}>
                              <IconButton color='primary' onClick={() => handleDownloadContract(contract.id)}>
                                <i className='ri-download-2-line' />
                              </IconButton>
                            </Tooltip>
                          )}
                          <Tooltip title={t.contracts.deleteContract || 'Delete Contract'}>
                            <IconButton color='error' onClick={() => handleDeleteContract(contract.id)}>
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
                {t.common.rowsPerPage || 'Rows per page'}
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
                {page * rowsPerPage + 1}-{Math.min((page + 1) * rowsPerPage, totalElements)} {t.common.of || 'of'}
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

      {/* Form Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth='sm' fullWidth>
        <DialogTitle>
          {dialogMode === 'add'
            ? t.contracts.addContract || 'Add Contract'
            : t.contracts.editContract || 'Edit Contract'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 0 }}>
            <Grid item xs={12}>
              <FormControl fullWidth margin='normal' error={!formData.employeeId}>
                <Typography variant='body2' gutterBottom>
                  {t.contracts.employee || 'Employee'}
                </Typography>
                <Autocomplete
                  options={employeeNames}
                  getOptionLabel={option => option.fullName}
                  value={employeeNames.find(emp => emp.id === formData.employeeId) || null}
                  onChange={(_, newValue) => handleFormChange('employeeId', newValue?.id || 0)}
                  renderInput={params => (
                    <TextField
                      {...params}
                      variant='outlined'
                      placeholder={t.contracts.selectEmployee || 'Select Employee'}
                      error={!formData.employeeId}
                      helperText={
                        !formData.employeeId
                          ? 'Please select an employee'
                          : !formData.contractTemplateId
                            ? 'Please select a template'
                            : ''
                      }
                    />
                  )}
                  renderOption={(props, option) => (
                    <li {...props} key={`dialog-emp-${option.id}`}>
                      {option.fullName}
                    </li>
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth margin='normal' error={!formData.contractTemplateId}>
                <Typography variant='body2' gutterBottom>
                  {t.contracts.template || 'Template'}
                </Typography>
                <Autocomplete
                  options={contractTemplates}
                  getOptionLabel={option => option.fileName}
                  value={contractTemplates.find(temp => temp.id === formData.contractTemplateId) || null}
                  onChange={(_, newValue) => {
                    if (newValue) {
                      handleTemplateSelect(newValue.id)
                    } else {
                      handleFormChange('contractTemplateId', 0)
                      setTemplateHtml('')
                      setTemplateParams({})
                      setSelectedTemplateId(null)
                    }
                  }}
                  disabled={!formData.employeeId}
                  renderInput={params => (
                    <TextField
                      {...params}
                      variant='outlined'
                      placeholder={t.contracts.selectTemplate || 'Select Template'}
                      error={!formData.contractTemplateId}
                      helperText={
                        !formData.employeeId
                          ? 'Please select an employee first'
                          : !formData.contractTemplateId
                            ? 'Please select a template'
                            : ''
                      }
                    />
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t.contracts.fileName || 'File Name'}
                value={formData.fileName}
                onChange={e => handleFormChange('fileName', e.target.value)}
                margin='normal'
                variant='outlined'
                placeholder={t.contracts.contractNamePlaceholder || 'Enter contract name'}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t.contracts.fileNameEn || 'File Name (English)'}
                value={formData.fileNameEn}
                onChange={e => handleFormChange('fileNameEn', e.target.value)}
                margin='normal'
                variant='outlined'
                placeholder={t.contracts.fileNameEn || 'Enter contract name (English)'}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t.contracts.description || 'Description'}
                value={formData.description || ''}
                onChange={e => handleFormChange('description', e.target.value)}
                margin='normal'
                variant='outlined'
                multiline
                rows={3}
                placeholder={`${t.contracts.description?.toLowerCase() || 'description'}...`}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth margin='normal'>
                <Typography variant='body2' gutterBottom>
                  {t.common.status || 'Status'}
                </Typography>
                <Select
                  value={formData.contractStatusId}
                  onChange={e => handleFormChange('contractStatusId', e.target.value as number)}
                  displayEmpty
                  variant='outlined'
                  disabled={dialogMode === 'add'}
                >
                  {configs.map(config => (
                    <MenuItem key={config.code} value={config.code}>
                      {getStatusName(config.code)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color='inherit'>
            {t.common.cancel || 'Cancel'}
          </Button>
          <Button onClick={handleSaveContract} variant='contained' color='primary' disabled={!formData.fileName}>
            {dialogMode === 'add' ? t.contracts.addContract || 'Add Contract' : t.common.save || 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* HTML Preview Dialog */}
      <Dialog open={htmlPreviewOpen} onClose={handleCloseHtmlPreview} maxWidth='lg' fullWidth>
        <DialogTitle>{language === 'vi' ? 'Xem trước biểu mẫu hợp đồng' : 'Contract Template Preview'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            {/* Parameters Panel */}
            <Grid item xs={12} md={4}>
              <Typography variant='h6' gutterBottom>
                {language === 'vi' ? 'Thông số' : 'Parameters'}
              </Typography>
              <Paper variant='outlined' sx={{ p: 2, height: '500px', overflowY: 'auto' }}>
                {Object.keys(templateParams).length > 0 ? (
                  Object.entries(templateParams).map(([paramName, paramValue]) => {
                    if (!paramName.includes('employer') && !paramName.includes('employee')) {
                      return (
                        <TextField
                          key={paramName}
                          fullWidth
                          label={paramName}
                          value={paramValue}
                          onChange={e => handleParamChange(paramName, e.target.value)}
                          margin='normal'
                          variant='outlined'
                          size='small'
                        />
                      )
                    }
                    return null // Skip other parameters
                  })
                ) : (
                  <Typography color='text.secondary'>
                    {language === 'vi'
                      ? 'Không tìm thấy thông số nào trong biểu mẫu này.'
                      : 'No parameters found in this template.'}
                  </Typography>
                )}
              </Paper>
            </Grid>

            {/* HTML Preview Panel */}
            <Grid item xs={12} md={8}>
              <Typography variant='h6' gutterBottom>
                {language === 'vi' ? 'Xem trước' : 'Preview'}
              </Typography>
              <Paper
                variant='outlined'
                sx={{
                  p: 2,
                  height: '500px',
                  overflowY: 'auto',
                  '& img': { maxWidth: '100%' }
                }}
              >
                <div dangerouslySetInnerHTML={{ __html: renderedHtml }} />
              </Paper>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseHtmlPreview} color='primary' variant='contained'>
            {language === 'vi' ? 'Đóng' : 'Close'}
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

export default ContractPage
