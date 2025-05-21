import { useTheme } from '@mui/material/styles'

// Third-party Imports
import PerfectScrollbar from 'react-perfect-scrollbar'

// Type Imports
import type { VerticalMenuContextProps } from '@menu/components/vertical-menu/Menu'

// Component Imports
import { Menu, SubMenu, MenuItem } from '@menu/vertical-menu'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'
import { useLanguage } from '@/i18n/LanguageContext'

// Styled Component Imports
import StyledVerticalNavExpandIcon from '@menu/styles/vertical/StyledVerticalNavExpandIcon'

// Style Imports
import menuItemStyles from '@core/styles/vertical/menuItemStyles'
import menuSectionStyles from '@core/styles/vertical/menuSectionStyles'

// Auth Context Import
import { useAuth } from '@/contexts/AuthContext'

type RenderExpandIconProps = {
  open?: boolean
  transitionDuration?: VerticalMenuContextProps['transitionDuration']
}

const RenderExpandIcon = ({ open, transitionDuration }: RenderExpandIconProps) => (
  <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
    <i className='ri-arrow-right-s-line' />
  </StyledVerticalNavExpandIcon>
)

const VerticalMenu = ({ scrollMenu }: { scrollMenu: (container: any, isPerfectScrollbar: boolean) => void }) => {
  // Hooks
  const theme = useTheme()
  const { isBreakpointReached, transitionDuration } = useVerticalNav()
  const { t } = useLanguage()

  const role = localStorage.getItem('role')
  const isAdmin = role === 'ADMIN'
  const isHr = role === 'HR'
  const isManager = role === 'MANAGER'

  const ScrollWrapper = isBreakpointReached ? 'div' : PerfectScrollbar

  return (
    // eslint-disable-next-line lines-around-comment
    /* Custom scrollbar instead of browser scroll, remove if you want browser scroll only */
    <ScrollWrapper
      {...(isBreakpointReached
        ? {
            className: 'bs-full overflow-y-auto overflow-x-hidden',
            onScroll: container => scrollMenu(container, false)
          }
        : {
            options: { wheelPropagation: false, suppressScrollX: true },
            onScrollY: container => scrollMenu(container, true)
          })}
    >
      {/* Incase you also want to scroll NavHeader to scroll with Vertical Menu, remove NavHeader from above and paste it below this comment */}
      {/* Vertical Menu */}
      <Menu
        menuItemStyles={menuItemStyles(theme)}
        renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
        renderExpandedMenuItemIcon={{ icon: <i className='ri-circle-line' /> }}
        menuSectionStyles={menuSectionStyles(theme)}
      >
        {isAdmin && (
          <>
            <MenuItem icon={<i className='ri-home-smile-line' />} href='/'>
              {t.navigation.dashboard}
            </MenuItem>

            <SubMenu label={t.navigation.admin} icon={<i className='ri-admin-line' />}>
              <MenuItem href='/roles' icon={<i className='ri-shield-user-line' />}>
                {t.navigation.roles}
              </MenuItem>
              <MenuItem href='/audit-logs' icon={<i className='ri-file-list-3-line' />}>
                {t.navigation.auditLogs}
              </MenuItem>
              <MenuItem href='/user' icon={<i className='ri-user-line' />}>
                {t.navigation.users}
              </MenuItem>
              <MenuItem href='/position' icon={<i className='ri-user-star-line' />}>
                {t.navigation.position}
              </MenuItem>
              <MenuItem href='/department' icon={<i className='ri-building-2-line' />}>
                {t.navigation.departments}
              </MenuItem>
              <MenuItem href='/configs' icon={<i className='ri-settings-3-line' />}>
                {t.navigation.configs}
              </MenuItem>
            </SubMenu>
            <SubMenu label={t.navigation.hr} icon={<i className='ri-file-copy-line' />}>
              <MenuItem href='/employee' icon={<i className='ri-team-line' />}>
                {t.navigation.employees}
              </MenuItem>
              <MenuItem href='/contract' icon={<i className='ri-file-text-line' />}>
                {t.navigation.contracts}
              </MenuItem>
              <MenuItem href='/contract-templates' icon={<i className='ri-file-paper-2-line' />}>
                {t.navigation.contractTemplates}
              </MenuItem>
            </SubMenu>
          </>
        )}
        {/* Hr group - only visible to hr users */}
        {isHr && (
          <>
            <MenuItem icon={<i className='ri-home-smile-line' />} href='/'>
              {t.navigation.dashboard}
            </MenuItem>

            <SubMenu label={t.navigation.hr} icon={<i className='ri-file-copy-line' />}>
              <MenuItem href='/employee' icon={<i className='ri-team-line' />}>
                {t.navigation.employees}
              </MenuItem>
              <MenuItem href='/contract' icon={<i className='ri-file-text-line' />}>
                {t.navigation.contracts}
              </MenuItem>
              <MenuItem href='/contract-templates' icon={<i className='ri-file-paper-2-line' />}>
                {t.navigation.contractTemplates}
              </MenuItem>
            </SubMenu>
          </>
        )}
      </Menu>
    </ScrollWrapper>
  )
}

export default VerticalMenu
