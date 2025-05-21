'use client'

// React Imports
import { useState } from 'react'
import type { FormEvent } from 'react'

// Next Imports
import Link from 'next/link'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'

// Type Imports
import type { Mode } from '@core/types'

// Component Imports
import Logo from '@components/layout/shared/Logo'
import Illustrations from '@components/Illustrations'
import LanguageSwitcher from '@/components/LanguageSwitcher'

// Hook Imports
import { useImageVariant } from '@core/hooks/useImageVariant'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/i18n/LanguageContext'

const Login = ({ mode }: { mode: Mode }) => {
  // States
  const [isPasswordShown, setIsPasswordShown] = useState(false)

  const [formValues, setFormValues] = useState({
    email: '',
    password: ''
  })

  // Vars
  const darkImg = '/images/pages/auth-v1-mask-dark.png'
  const lightImg = '/images/pages/auth-v1-mask-light.png'

  // Hooks
  const authBackground = useImageVariant(mode, lightImg, darkImg)
  const { login, isLoading, error } = useAuth()
  const { t } = useLanguage()

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({
      ...formValues,
      [field]: e.target.value
    })
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    await login({
      email: formValues.email,
      password: formValues.password
    })
  }

  const getErrorMessage = (error: string | null): string => {
    if (!error) return ''

    if (error.includes('Invalid email or password')) {
      return t.login.invalidCredentials
    } else if (error.includes('Network error')) {
      return t.login.networkError
    } else {
      return t.login.authFailed
    }
  }

  return (
    <div className='flex flex-col justify-center items-center min-bs-[100dvh] relative p-6'>
      <Card className='flex flex-col sm:is-[450px]'>
        <CardContent className='p-6 sm:!p-12'>
          <Link href='/' className='flex justify-center items-center mbe-6'>
            <Logo />
          </Link>
          <LanguageSwitcher />
          <div className='flex flex-col gap-5'>
            <div>
              <Typography variant='h4'>{t.login.title}</Typography>
              <Typography className='mbs-1'>{t.login.subtitle}</Typography>
            </div>
            {error && (
              <Alert severity='error' className='mb-4'>
                {getErrorMessage(error)}
              </Alert>
            )}
            <form noValidate autoComplete='off' onSubmit={handleSubmit} className='flex flex-col gap-5'>
              <TextField
                autoFocus
                fullWidth
                label={t.login.email}
                type='email'
                value={formValues.email}
                onChange={handleChange('email')}
                required
              />
              <TextField
                fullWidth
                label={t.login.password}
                id='outlined-adornment-password'
                type={isPasswordShown ? 'text' : 'password'}
                value={formValues.password}
                onChange={handleChange('password')}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        size='small'
                        edge='end'
                        onClick={handleClickShowPassword}
                        onMouseDown={e => e.preventDefault()}
                      >
                        <i className={isPasswordShown ? 'ri-eye-off-line' : 'ri-eye-line'} />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              <Button
                fullWidth
                variant='contained'
                type='submit'
                disabled={isLoading}
                startIcon={isLoading ? <CircularProgress size={20} color='inherit' /> : null}
              >
                {isLoading ? t.login.loggingIn : t.login.loginButton}
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
      <Illustrations maskImg={{ src: authBackground }} />
    </div>
  )
}

export default Login
