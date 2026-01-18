import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface UIState {
  isSidebarOpen: boolean
  isMobileMenuOpen: boolean
  theme: 'dark' | 'light'
}

const initialState: UIState = {
  isSidebarOpen: true,
  isMobileMenuOpen: false,
  theme: 'dark',
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.isSidebarOpen = action.payload
    },
    toggleMobileMenu: (state) => {
      state.isMobileMenuOpen = !state.isMobileMenuOpen
    },
    setMobileMenuOpen: (state, action: PayloadAction<boolean>) => {
      state.isMobileMenuOpen = action.payload
    },
    setTheme: (state, action: PayloadAction<'dark' | 'light'>) => {
      state.theme = action.payload
    },
  },
})

export const { toggleSidebar, setSidebarOpen, toggleMobileMenu, setMobileMenuOpen, setTheme } = uiSlice.actions
export default uiSlice.reducer
