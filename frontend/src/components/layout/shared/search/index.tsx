'use client'

// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import IconButton from '@mui/material/IconButton'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import Divider from '@mui/material/Divider'
import Collapse from '@mui/material/Collapse'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Fade from '@mui/material/Fade'
import Zoom from '@mui/material/Zoom'
import { alpha, useTheme } from '@mui/material/styles'

// Next Imports
import { useRouter } from 'next/navigation'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'
import { useLanguage } from '@/i18n/LanguageContext'

// Define page interface
interface SearchablePage {
  title: string
  path: string
  searchParam?: string
  icon: string
}

// Define category interface
interface Category {
  title: string
  icon: string
  pages: SearchablePage[]
}

const NavSearch = () => {
  // Hooks
  const { isBreakpointReached } = useVerticalNav()
  const router = useRouter()
  const { t } = useLanguage()
  const theme = useTheme()

  // States
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    admin: true,
    hr: true,
    management: true
  })
  const [showResults, setShowResults] = useState(false)

  // Define searchable pages organized by categories
  const searchCategories: Category[] = [
    {
      title: t.navigation.dashboard,
      icon: 'ri-home-smile-line',
      pages: [{ title: t.navigation.dashboard, path: '/', icon: 'ri-home-smile-line' }]
    },
    {
      title: t.navigation.admin,
      icon: 'ri-admin-line',
      pages: [
        { title: t.navigation.roles, path: '/roles', searchParam: 'name', icon: 'ri-shield-user-line' },
        { title: t.navigation.auditLogs, path: '/audit-logs', searchParam: 'fullName', icon: 'ri-file-list-3-line' },
        { title: t.navigation.users, path: '/user', searchParam: 'fullName', icon: 'ri-user-line' },
        { title: t.navigation.position, path: '/position', searchParam: 'name', icon: 'ri-user-star-line' },
        { title: t.navigation.departments, path: '/department', searchParam: 'name', icon: 'ri-building-2-line' }
      ]
    },
    {
      title: t.navigation.hr,
      icon: 'ri-file-copy-line',
      pages: [
        { title: t.navigation.employees, path: '/employee', searchParam: 'fullName', icon: 'ri-team-line' },
        { title: t.navigation.contracts, path: '/contract', searchParam: 'description', icon: 'ri-file-text-line' },
        {
          title: t.navigation.contractTemplates,
          path: '/contract-templates',
          searchParam: 'fileName',
          icon: 'ri-file-paper-2-line'
        },
        {
          title: t.navigation.configs,
          path: '/configs',
          searchParam: 'name',
          icon: 'ri-settings-3-line'
        }
      ]
    },
    {
      title: t.navigation.management,
      icon: 'ri-user-2-fill',
      pages: [
        {
          title: t.navigation.contractApprovals,
          path: '/contract-approvals',
          searchParam: 'fileName',
          icon: 'ri-checkbox-multiple-fill'
        }
      ]
    }
  ]

  // Effect to show results with animation after search field renders
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        setShowResults(true)
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [open])

  // Handlers
  const handleOpenSearch = () => {
    setOpen(true)
    setSearchQuery('')
    setShowResults(false)
    setExpandedCategories({
      admin: true,
      hr: true,
      management: true
    })
  }

  const handleCloseSearch = () => {
    setShowResults(false)
    setTimeout(() => setOpen(false), 200)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
  }

  const handleToggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }))
  }

  const handlePageSelect = (page: SearchablePage) => {
    // If there's a search query and a search parameter defined, add it to the URL
    if (searchQuery.trim() && page.searchParam) {
      router.push(`${page.path}?${page.searchParam}=${encodeURIComponent(searchQuery)}`)
    } else {
      router.push(page.path)
    }
    handleCloseSearch()
  }

  // Filter categories and pages based on search query
  const getFilteredCategories = () => {
    if (!searchQuery.trim()) {
      return searchCategories
    }

    return searchCategories
      .map(category => {
        const filteredPages = category.pages.filter(page =>
          page.title.toLowerCase().includes(searchQuery.toLowerCase())
        )

        return {
          ...category,
          pages: filteredPages
        }
      })
      .filter(category => category.pages.length > 0)
  }

  const filteredCategories = getFilteredCategories()

  return (
    <>
      {isBreakpointReached ? (
        <IconButton
          className='text-textPrimary'
          onClick={handleOpenSearch}
          sx={{
            transition: 'transform 0.2s ease-in-out',
            '&:hover': {
              transform: 'scale(1.1)',
              color: theme.palette.primary.main
            }
          }}
        >
          <i className='ri-search-line' />
        </IconButton>
      ) : (
        <div className='flex items-center cursor-pointer gap-2 transition-all duration-200' onClick={handleOpenSearch}>
          <IconButton
            className='text-textPrimary'
            sx={{
              transition: 'transform 0.2s ease-in-out',
              '&:hover': {
                transform: 'scale(1.1)',
                color: theme.palette.primary.main
              }
            }}
          >
            <i className='ri-search-line' />
          </IconButton>
          <div className='whitespace-nowrap select-none text-textDisabled hover:text-primary transition-colors duration-200'>
            {t.navigation.search}
          </div>
        </div>
      )}

      <Dialog
        open={open}
        onClose={handleCloseSearch}
        fullWidth
        maxWidth='sm'
        TransitionComponent={Zoom}
        PaperProps={{
          elevation: 8,
          sx: {
            borderRadius: '12px',
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle
          sx={{
            pb: 1,
            display: 'flex',
            alignItems: 'center',
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
            backgroundColor: theme.palette.background.paper
          }}
        >
          <i className='ri-search-line mr-2 text-xl' />
          <Typography variant='h6' fontWeight='medium'>
            {t.navigation.search}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 2, pb: 3 }}>
          <TextField
            autoFocus
            margin='dense'
            fullWidth
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder={`${t.common.search}...`}
            variant='outlined'
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                transition: 'box-shadow 0.2s ease-in-out',
                '&:hover': {
                  boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.1)}`
                },
                '&.Mui-focused': {
                  boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`
                }
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <i className='ri-search-line text-xl' />
                </InputAdornment>
              )
            }}
          />

          {filteredCategories.length > 0 ? (
            <Fade in={showResults} timeout={500}>
              <Box sx={{ mt: 2 }}>
                <List
                  sx={{
                    borderRadius: 2,
                    overflow: 'hidden',
                    border: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
                    mb: 1,
                    bgcolor: alpha(theme.palette.background.paper, 0.7)
                  }}
                >
                  {filteredCategories.map((category, index) => (
                    <Box key={category.title}>
                      {/* Category header */}
                      <ListItemButton
                        onClick={() => handleToggleCategory(category.title)}
                        sx={{
                          py: 1.5,
                          bgcolor: alpha(theme.palette.primary.main, 0.04),
                          transition: 'background-color 0.2s ease-in-out',
                          '&:hover': {
                            bgcolor: alpha(theme.palette.primary.main, 0.08)
                          }
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 40, color: theme.palette.primary.main }}>
                          <i className={`${category.icon} text-xl`} />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography variant='subtitle1' fontWeight='medium'>
                              {category.title}
                            </Typography>
                          }
                        />
                        <i
                          className={`${expandedCategories[category.title] ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'} text-xl`}
                        />
                      </ListItemButton>

                      {/* Category pages */}
                      <Collapse in={expandedCategories[category.title]} timeout={300} unmountOnExit>
                        <List component='div' disablePadding>
                          {category.pages.map((page, pageIndex) => (
                            <ListItemButton
                              key={page.path}
                              onClick={() => handlePageSelect(page)}
                              sx={{
                                pl: 4,
                                py: 1.5,
                                borderTop: pageIndex > 0 ? `1px solid ${alpha(theme.palette.divider, 0.1)}` : 'none',
                                transition: 'all 0.2s ease-in-out',
                                '&:hover': {
                                  backgroundColor: alpha(theme.palette.action.hover, 0.7),
                                  pl: 5
                                }
                              }}
                            >
                              <ListItemIcon sx={{ minWidth: 36, color: theme.palette.text.secondary }}>
                                <i className={`${page.icon} text-lg`} />
                              </ListItemIcon>
                              <ListItemText
                                primary={page.title}
                                primaryTypographyProps={{
                                  sx: {
                                    transition: 'color 0.2s ease-in-out',
                                    fontWeight: 'medium'
                                  }
                                }}
                              />
                            </ListItemButton>
                          ))}
                        </List>
                      </Collapse>

                      {index < filteredCategories.length - 1 && <Divider sx={{ my: 0 }} />}
                    </Box>
                  ))}
                </List>

                <Box sx={{ pt: 1, textAlign: 'center' }}>
                  <Typography variant='caption' color='text.secondary'>
                    {searchQuery.trim()
                      ? `${t.common.search} "${searchQuery}" ${filteredCategories.reduce((acc, cat) => acc + cat.pages.length, 0)} ${t.common.of} results`
                      : t.navigation.search}
                  </Typography>
                </Box>
              </Box>
            </Fade>
          ) : (
            <Fade in={showResults} timeout={500}>
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <Box sx={{ mb: 2 }}>
                  <i className='ri-search-2-line text-5xl text-gray-300' />
                </Box>
                <Typography variant='body2' color='text.secondary'>
                  {t.common.noData}
                </Typography>
              </Box>
            </Fade>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

export default NavSearch
