'use client'

// React Imports
import { useState } from 'react'

// Next Imports
import Link from 'next/link'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import Divider from '@mui/material/Divider'

// Type Imports
import type { Mode } from '@core/types'

// Component Imports
import Illustrations from '@components/Illustrations'
import Logo from '@components/layout/shared/Logo'
import LanguageSwitcher from '@/components/LanguageSwitcher'

// Hook Imports
import { useImageVariant } from '@core/hooks/useImageVariant'
import { useLanguage } from '@/i18n/LanguageContext'

const Register = ({ mode }: { mode: Mode }) => {
  // States
  const [isPasswordShown, setIsPasswordShown] = useState(false)

  const [formValues, setFormValues] = useState({
    username: '',
    email: '',
    password: ''
  })

  // Vars
  const darkImg = '/images/pages/auth-v1-mask-dark.png'
  const lightImg = '/images/pages/auth-v1-mask-light.png'

  // Hooks
  const authBackground = useImageVariant(mode, lightImg, darkImg)
  const { t } = useLanguage()

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({
      ...formValues,
      [field]: e.target.value
    })
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Handle registration logic here
    console.log('Register form submitted:', formValues)
  }

  return (
    <div className='flex flex-col justify-center items-center min-bs-[100dvh] relative p-6'>
      <Card className='flex flex-col sm:is-[450px]'>
        <CardContent className='p-6 sm:!p-12'>
          <Link href='/' className='flex justify-center items-start mbe-6'>
            <Logo />
          </Link>
          <LanguageSwitcher />
          <Typography variant='h4'>{t.register.title}</Typography>
          <div className='flex flex-col gap-5'>
            <Typography className='mbs-1'>{t.register.subtitle}</Typography>
            <form noValidate autoComplete='off' onSubmit={handleSubmit} className='flex flex-col gap-5'>
              <TextField
                autoFocus
                fullWidth
                label={t.register.username}
                value={formValues.username}
                onChange={handleChange('username')}
                required
              />
              <TextField
                fullWidth
                label={t.register.email}
                type='email'
                value={formValues.email}
                onChange={handleChange('email')}
                required
              />
              <TextField
                fullWidth
                label={t.register.password}
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
              <FormControlLabel
                control={<Checkbox />}
                label={
                  <>
                    <span>{t.register.agreeTerms} </span>
                    <Link className='text-primary' href='/' onClick={e => e.preventDefault()}>
                      {t.register.terms} & {t.register.privacy}
                    </Link>
                  </>
                }
              />
              <Button fullWidth variant='contained' type='submit'>
                {t.register.registerButton}
              </Button>
              <div className='flex justify-center items-center flex-wrap gap-2'>
                <Typography>{t.register.alreadyHaveAccount}</Typography>
                <Typography component={Link} href='/login' color='primary'>
                  {t.register.signIn}
                </Typography>
              </div>
              <Divider className='gap-3'>Or</Divider>
              <div className='flex justify-center items-center gap-2'>
                <IconButton size='small' className='text-facebook'>
                  <i className='ri-facebook-fill' />
                </IconButton>
                <IconButton size='small' className='text-twitter'>
                  <i className='ri-twitter-fill' />
                </IconButton>
                <IconButton size='small' className='text-github'>
                  <i className='ri-github-fill' />
                </IconButton>
                <IconButton size='small' className='text-googlePlus'>
                  <i className='ri-google-fill' />
                </IconButton>
              </div>
            </form>
          </div>
        </CardContent>
      </Card>
      <Illustrations maskImg={{ src: authBackground }} />
    </div>
  )
}

export default Register
