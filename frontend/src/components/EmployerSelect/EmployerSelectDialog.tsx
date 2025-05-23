import { useState, useEffect } from 'react'

// MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TextField from '@mui/material/TextField'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

// Import service functions
import { Employee, getAllEmployers } from '@/services/employeeService'

interface EmployerSelectDialogProps {
  open: boolean
  onClose: () => void
  onSelect: (employerId: number, employerName: string) => void
  title?: string
}

const EmployerSelectDialog = ({ open, onClose, onSelect, title = 'Select Employer' }: EmployerSelectDialogProps) => {
  const [employers, setEmployers] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (open) {
      fetchEmployers()
    }
  }, [open])

  const fetchEmployers = async () => {
    setLoading(true)
    try {
      const data = await getAllEmployers()
      setEmployers(data)
      setError('')
    } catch (err) {
      setError('Failed to fetch employers')
      setEmployers([])
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectEmployer = (employer: Employee) => {
    onSelect(employer.id, employer.fullName)
    onClose()
  }

  // Filter employers based on search query
  const filteredEmployers = employers.filter(
    employer =>
      employer.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employer.numberId.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Dialog open={open} onClose={onClose} maxWidth='md' fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          variant='outlined'
          label='Search'
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          margin='normal'
        />

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color='error' sx={{ p: 2 }}>
            {error}
          </Typography>
        ) : filteredEmployers.length === 0 ? (
          <Typography sx={{ p: 2 }}>No employers found</Typography>
        ) : (
          <TableContainer sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Employer Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Employee ID</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredEmployers.map(employer => (
                  <TableRow key={employer.id} hover>
                    <TableCell>{employer.id}</TableCell>
                    <TableCell>{employer.fullName}</TableCell>
                    <TableCell>{employer.email}</TableCell>
                    <TableCell>{employer.numberId}</TableCell>
                    <TableCell>
                      <Button variant='contained' size='small' onClick={() => handleSelectEmployer(employer)}>
                        Select
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  )
}

export default EmployerSelectDialog
