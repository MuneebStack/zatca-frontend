import './App.css'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@/providers/ThemeContext'
import { AuthProvider } from '@/providers/AuthContext'
import { LoaderProvider } from '@/providers/LoaderContext'
import { AppRoutes } from '@/routes/AppRoutes'

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <LoaderProvider>
            <AppRoutes />
          </LoaderProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App