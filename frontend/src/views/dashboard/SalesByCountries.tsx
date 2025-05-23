'use client'

// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import Chip from '@mui/material/Chip'
import Tooltip from '@mui/material/Tooltip'
import Divider from '@mui/material/Divider'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'

// Third-party Imports
import classnames from 'classnames'

// Type Imports
import type { ThemeColor } from '@core/types'

// Components Imports
import OptionsMenu from '@core/components/option-menu'
import CustomAvatar from '@core/components/mui/Avatar'

// Dashboard Service
import { getTableExpire, type TableExpireStats } from '@/services/dashboardService'

// Language Context
import { useLanguage } from '@/i18n/LanguageContext'

type Period = '1' | '5' | '12'

const SalesByCountries = () => {
  // State management
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [period, setPeriod] = useState<Period>('1')
  const [tableExpireData, setTableExpireData] = useState<TableExpireStats[]>([])

  // Notification state
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  })

  // Get language context for translations
  const { t, language } = useLanguage()

  // Get theme for responsive design
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  // Function to show notifications
  const showNotification = (message: string, severity: 'success' | 'error') => {
    setNotification({ open: true, message, severity })
  }

  // Function to close notification
  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false })
  }

  // Function to get initials from a name
  const getInitials = (name: string) => {
    if (!name) return 'UN'
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase()
  }

  // Function to determine avatar color based on name
  const getAvatarColor = (name: string): ThemeColor => {
    if (!name) return 'primary'
    const colors: ThemeColor[] = ['primary', 'success', 'error', 'warning', 'info', 'secondary']
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return colors[hash % colors.length]
  }

  // Function to determine department color
  const getDepartmentColor = (department: string): ThemeColor => {
    if (!department) return 'primary'
    const colors: ThemeColor[] = ['primary', 'success', 'info', 'secondary']
    const hash = department.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return colors[hash % colors.length]
  }

  // Format date to display in a more readable format
  const formatDate = (dateString: string) => {
    if (!dateString) return ''

    try {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat(language === 'vi' ? 'vi-VN' : 'en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).format(date)
    } catch (e) {
      return dateString
    }
  }

  // Function to calculate days remaining until contract expiration
  const getDaysRemaining = (endDateString: string) => {
    if (!endDateString) return 0

    try {
      const today = new Date()
      const endDate = new Date(endDateString)
      const diffTime = endDate.getTime() - today.getTime()
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    } catch (e) {
      return 0
    }
  }

  // Function to fetch contract expire data
  const fetchExpireData = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getTableExpire(period)
      console.log('Table expire stats:', data)
      setTableExpireData(data)
    } catch (err) {
      console.error('Error fetching table expire statistics:', err)
      setError(language === 'vi' ? 'Không thể tải dữ liệu' : 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  // Fetch initial data
  useEffect(() => {
    fetchExpireData()
  }, [period])

  // Handle refresh
  const handleRefresh = async () => {
    try {
      await fetchExpireData()
      showNotification(t.common.refreshSuccess || 'Data refreshed successfully', 'success')
    } catch (err) {
      showNotification(t.common.refreshError || 'Failed to refresh data', 'error')
    }
  }

  // Handle period change
  const handlePeriodChange = (newPeriod: Period) => {
    setPeriod(newPeriod)
  }

  // Get contract type color
  const getContractTypeColor = (type: string): ThemeColor => {
    if (!type) return 'primary'
    switch (type.toLowerCase()) {
      case 'permanent':
      case 'full-time':
      case 'toàn thời gian':
      case 'không thời hạn':
        return 'success'
      case 'temporary':
      case 'tạm thời':
      case 'part-time':
      case 'bán thời gian':
        return 'warning'
      case 'contract':
      case 'hợp đồng':
      case 'fixed-term':
      case 'có thời hạn':
        return 'info'
      case 'intern':
      case 'thực tập':
      case 'trainee':
        return 'secondary'
      default:
        return 'primary'
    }
  }

  // Translations
  const translations = {
    contractsExpiring: language === 'vi' ? 'Danh sách nhân viên hết hạn hợp đồng' : 'Contracts Expiring Soon',
    position: language === 'vi' ? 'Vị trí' : 'Position',
    department: language === 'vi' ? 'Phòng ban' : 'Department',
    hireDate: language === 'vi' ? 'Ngày vào làm' : 'Hire Date',
    contractEnd: language === 'vi' ? 'Ngày hết hạn' : 'Contract Ends',
    contractType: language === 'vi' ? 'Loại hợp đồng' : 'Contract Type',
    daysRemaining: language === 'vi' ? 'Còn lại' : 'Days Left',
    month1: language === 'vi' ? '1 tháng tới' : 'Next Month',
    months5: language === 'vi' ? '5 tháng tới' : 'Next 5 Months',
    months12: language === 'vi' ? '12 tháng tới' : 'Next Year',
    refresh: language === 'vi' ? 'Làm mới' : 'Refresh',
    noData: language === 'vi' ? 'Không có dữ liệu' : 'No data available'
  }

  return (
    <Card>
      <CardHeader
        title={translations.contractsExpiring}
        titleTypographyProps={{ sx: { mb: 1 } }}
        subheader={
          <Chip
            label={period === '1' ? translations.month1 : period === '5' ? translations.months5 : translations.months12}
            size='small'
            color='primary'
            variant='outlined'
          />
        }
        action={
          <OptionsMenu
            iconClassName='text-textPrimary'
            options={[
              {
                text: translations.refresh,
                menuItemProps: {
                  onClick: handleRefresh
                }
              },
              {
                text: translations.month1,
                menuItemProps: {
                  onClick: () => handlePeriodChange('1')
                }
              },
              {
                text: translations.months5,
                menuItemProps: {
                  onClick: () => handlePeriodChange('5')
                }
              },
              {
                text: translations.months12,
                menuItemProps: {
                  onClick: () => handlePeriodChange('12')
                }
              }
            ]}
          />
        }
      />

      <Divider />

      <CardContent className='flex flex-col gap-4'>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={{ textAlign: 'center', py: 10 }}>
            <Typography color='error'>{error}</Typography>
          </Box>
        ) : tableExpireData.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 10 }}>
            <Typography>{translations.noData}</Typography>
          </Box>
        ) : (
          tableExpireData.map((item, index) => {
            const daysRemaining = getDaysRemaining(item.contractEndDate)
            const initials = getInitials(item.fullName)

            return (
              <Box key={index}>
                <div className='flex items-start gap-4 flex-wrap'>
                  <Tooltip title={item.fullName}>
                    <CustomAvatar skin='light' color={getAvatarColor(item.fullName)}>
                      {initials}
                    </CustomAvatar>
                  </Tooltip>

                  <div className='flex flex-col flex-grow'>
                    <div className='flex flex-wrap gap-x-2 gap-y-1 items-center mb-1'>
                      <Typography color='text.primary' className='font-medium' sx={{ mr: 1 }}>
                        {item.fullName}
                      </Typography>

                      <Chip
                        label={item.department}
                        size='small'
                        color={getDepartmentColor(item.department)}
                        variant='outlined'
                        sx={{ height: 20, fontSize: '0.75rem' }}
                      />
                    </div>

                    <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
                      {item.position}
                    </Typography>

                    <Box className='flex flex-wrap gap-x-6 gap-y-2' sx={{ color: 'text.secondary' }}>
                      <div>
                        <Typography variant='caption' color='text.disabled'>
                          {translations.hireDate}
                        </Typography>
                        <Typography variant='body2'>{formatDate(item.hireDate)}</Typography>
                      </div>

                      <div>
                        <Typography variant='caption' color='text.disabled'>
                          {translations.contractEnd}
                        </Typography>
                        <Typography
                          variant='body2'
                          color={daysRemaining <= 30 ? 'error.main' : 'text.primary'}
                          sx={{ fontWeight: daysRemaining <= 30 ? 'medium' : 'regular' }}
                        >
                          {formatDate(item.contractEndDate)}
                        </Typography>
                      </div>

                      <div>
                        <Typography variant='caption' color='text.disabled'>
                          {translations.contractType}
                        </Typography>
                        <Typography variant='body2'>{item.contractType}</Typography>
                      </div>

                      <div className='ml-auto'>
                        <Chip
                          label={`${daysRemaining} ${translations.daysRemaining}`}
                          size='small'
                          color={daysRemaining <= 30 ? 'error' : daysRemaining <= 90 ? 'warning' : 'default'}
                          sx={{
                            fontWeight: daysRemaining <= 30 ? 'bold' : 'regular',
                            minWidth: isMobile ? '100%' : 'auto'
                          }}
                        />
                      </div>
                    </Box>
                  </div>
                </div>
                {index < tableExpireData.length - 1 && <Divider sx={{ my: 2 }} />}
              </Box>
            )
          })
        )}

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
      </CardContent>
    </Card>
  )
}

export default SalesByCountries
