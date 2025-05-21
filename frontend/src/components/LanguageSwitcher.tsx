'use client'

import { useLanguage } from '@/i18n/LanguageContext'
import { Language } from '@/i18n/translations'
import Box from '@mui/material/Box'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import Tooltip from '@mui/material/Tooltip'

interface LanguageOption {
  value: Language
  label: string
  flag: string
}

const languages: LanguageOption[] = [
  {
    value: 'en',
    label: 'English',
    flag: '🇺🇸'
  },
  {
    value: 'vi',
    label: 'Tiếng Việt',
    flag: '🇻🇳'
  }
]

const LanguageSwitcher = () => {
  const { language, changeLanguage, t } = useLanguage()

  const handleChange = (_: React.MouseEvent<HTMLElement>, newLanguage: Language | null) => {
    if (newLanguage !== null) {
      changeLanguage(newLanguage)
    }
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, mb: 2 }}>
      <ToggleButtonGroup
        value={language}
        exclusive
        onChange={handleChange}
        aria-label={t.common.languageSwitch}
        size="small"
      >
        {languages.map((lang) => (
          <ToggleButton key={lang.value} value={lang.value} aria-label={lang.label}>
            <Tooltip title={lang.label}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <span style={{ fontSize: '1.2rem' }}>{lang.flag}</span>
                <span>{lang.label}</span>
              </Box>
            </Tooltip>
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  )
}

export default LanguageSwitcher 
