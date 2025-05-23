import { useEffect, useState } from 'react'

//MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'

// Type Imports
import type { ThemeColor } from '@core/types'

// Components Imports
import OptionMenu from '@core/components/option-menu'
import CustomAvatar from '@core/components/mui/Avatar'

// Import dashboard service
import { getDashboardStats, type DashboardStats } from '@/services/dashboardService'

// Import language context
import { useLanguage } from '@/i18n/LanguageContext'

type DataItemType = {
  icon: string
  stats: string
  title: string
  color: ThemeColor
  key: string
}

const Transactions = () => {
  // State management
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<DashboardStats | null>(null)

  // Notification state
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  })

  // Get language context for translations
  const { t, language } = useLanguage()

  // Function to show notifications
  const showNotification = (message: string, severity: 'success' | 'error') => {
    setNotification({ open: true, message, severity })
  }

  // Function to close notification
  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false })
  }

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getDashboardStats()

      setStats(data)
    } catch (err) {
      console.error('Error fetching dashboard stats:', err)
      setError(t.common.error || 'Error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  // Translations mapping
  const translations = {
    dashboardTitle: language === 'vi' ? 'Thống kê tổng quan' : 'Statistics Overview',
    share: language === 'vi' ? 'Chia sẻ' : 'Share',
    update: language === 'vi' ? 'Cập nhật' : 'Update',
    totalEmployees: language === 'vi' ? 'Tổng nhân viên công ty' : 'Total Employees',
    totalApprovedContracts: language === 'vi' ? 'Tổng hợp đồng phê duyệt thành công' : 'Total Approved Contracts',
    totalPendingContracts: language === 'vi' ? 'Tổng hợp đồng còn tồn đọng' : 'Total Pending Contracts',
    totalContractExpiring: language === 'vi' ? 'Tổng hợp đồng sắp hết hạn' : 'Total Expiring Contracts'
  }

  // Transform data for display
  const dashboardData: DataItemType[] = [
    {
      stats: stats ? stats.totalEmployees.toLocaleString() : '0',
      title: translations.totalEmployees,
      color: 'primary',
      icon: 'ri-pie-chart-2-line',
      key: 'employees'
    },
    {
      stats: stats ? stats.totalApprovedContracts.toLocaleString() : '0',
      color: 'success',
      title: translations.totalApprovedContracts,
      icon: 'ri-file-check-line',
      key: 'approved'
    },
    {
      stats: stats ? stats.totalPendingContracts.toLocaleString() : '0',
      color: 'info',
      title: translations.totalPendingContracts,
      icon: 'ri-file-list-line',
      key: 'pending'
    },
    {
      stats: stats ? stats.totalContractExpiring.toLocaleString() : '0',
      title: translations.totalContractExpiring,
      color: 'warning',
      icon: 'ri-group-line',
      key: 'expiring'
    }
  ]

  const handleRefresh = async () => {
    try {
      await fetchDashboardData()
      showNotification(t.common.refreshSuccess || 'Data refreshed successfully', 'success')
    } catch (err) {
      showNotification(t.common.refreshError || 'Failed to refresh data', 'error')
    }
  }

  return (
    <Card className='bs-full'>
      <CardHeader
        title={translations.dashboardTitle}
        action={
          <OptionMenu
            iconClassName='text-textPrimary'
            options={[
              {
                text: t.common.refresh || 'Refresh',
                menuItemProps: {
                  onClick: handleRefresh
                }
              },
              { text: translations.share },
              { text: translations.update }
            ]}
          />
        }
      />
      <CardContent className='!pbs-5'>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={{ textAlign: 'center', py: 5 }}>
            <Typography color='error'>{error}</Typography>
          </Box>
        ) : (
          <Grid container spacing={2}>
            {dashboardData.map(item => (
              <Grid item xs={6} md={3} key={item.key}>
                <div className='flex items-center gap-3'>
                  <CustomAvatar variant='rounded' color={item.color} className='shadow-xs'>
                    <i className={item.icon}></i>
                  </CustomAvatar>
                  <div>
                    <Typography>{item.title}</Typography>
                    <Typography variant='h5'>{item.stats}</Typography>
                  </div>
                </div>
              </Grid>
            ))}
          </Grid>
        )}
      </CardContent>

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

export default Transactions
