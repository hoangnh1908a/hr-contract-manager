import { useState, useEffect } from 'react'

// MUI Imports
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import InputAdornment from '@mui/material/InputAdornment'

// Import the dialog component
import EmployerSelectDialog from './EmployerSelectDialog'
import { getEmployerById } from '@/services/employeeService'

interface EmployerSelectFieldProps {
  label?: string
  value: number
  onChange: (value: number) => void
  error?: boolean
  helperText?: string
  required?: boolean
  disabled?: boolean
}

const EmployerSelectField = ({
  label = 'Employer',
  value,
  onChange,
  error = false,
  helperText = '',
  required = false,
  disabled = false
}: EmployerSelectFieldProps) => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [employerName, setEmployerName] = useState('')

  // Fetch employer name when value changes or on component mount
  useEffect(() => {
    const fetchEmployerName = async () => {
      if (value) {
        try {
          const employer = await getEmployerById(value)
          if (employer) {
            setEmployerName(employer.fullName)
          } else {
            setEmployerName('')
          }
        } catch (error) {
          console.error('Error fetching employer name:', error)
          setEmployerName('')
        }
      } else {
        setEmployerName('')
      }
    }

    fetchEmployerName()
  }, [value])

  const handleOpenDialog = () => {
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
  }

  const handleSelectEmployer = (employerId: number, name: string) => {
    onChange(employerId)
    setEmployerName(name)
  }

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <TextField
          fullWidth
          label={label}
          value={employerName}
          placeholder='Select an employer'
          InputProps={{
            readOnly: true,
            startAdornment: <InputAdornment position='start'>Search</InputAdornment>
          }}
          onClick={!disabled ? handleOpenDialog : undefined}
          error={error}
          helperText={helperText}
          required={required}
          disabled={disabled}
          sx={{ cursor: disabled ? 'default' : 'pointer' }}
        />
        <Button variant='outlined' onClick={handleOpenDialog} disabled={disabled}>
          Browse
        </Button>
      </Box>

      <EmployerSelectDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        onSelect={handleSelectEmployer}
        title={`Select ${label}`}
      />
    </>
  )
}

export default EmployerSelectField
