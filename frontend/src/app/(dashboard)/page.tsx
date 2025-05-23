'use client'

// MUI Imports
import Grid from '@mui/material/Grid'

// Components Imports
import Transactions from '@views/dashboard/Transactions'
import SalesByCountries from '@views/dashboard/SalesByCountries'

const DashboardAnalytics = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={12} lg={12}>
        <Transactions />
      </Grid>
      <Grid item xs={12} md={12} lg={12}>
        <SalesByCountries />
      </Grid>
    </Grid>
  )
}

export default DashboardAnalytics
