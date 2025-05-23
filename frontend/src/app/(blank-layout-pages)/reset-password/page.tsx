'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import { resetPassword } from '@/services/userService'

const ResetPasswordPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email')

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (!newPassword || !confirmPassword) {
      setError('Please fill in all fields.')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    setLoading(true)
    try {
      await resetPassword(newPassword, email || '')
      setSuccess('Password reset successful. Please log in with your new password.')
      setTimeout(() => router.push('/login'), 2000)
    } catch (err: any) {
      setError(err.message || 'Failed to reset password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex flex-col justify-center items-center min-h-screen p-6'>
      <Card className='flex flex-col sm:w-[400px]'>
        <CardContent className='p-6 sm:p-10'>
          <Typography variant='h5' className='mb-4'>
            Reset Password
          </Typography>
          {error && (
            <Alert severity='error' className='mb-4'>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity='success' className='mb-4'>
              {success}
            </Alert>
          )}
          <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
            <TextField
              label='New Password'
              type='password'
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label='Confirm Password'
              type='password'
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              fullWidth
            />
            <Button
              type='submit'
              variant='contained'
              color='primary'
              fullWidth
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} color='inherit' /> : null}
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default ResetPasswordPage
