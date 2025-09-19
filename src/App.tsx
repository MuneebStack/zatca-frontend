import './App.css'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@/providers/ThemeContext'
import { AuthProvider } from '@/providers/AuthContext'
import { LoaderProvider } from '@/providers/LoaderContext'
import { AppRoutes } from '@/routes/AppRoutes'
import { App as AntdApp } from 'antd';
import { useEffect } from 'react'
import { setAppInstances } from './services/antdAppInstances'

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <LoaderProvider>
            <AntdApp>
              <Initializer />
              <AppRoutes />
            </AntdApp>
          </LoaderProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}

function Initializer() {
  const { notification, message, modal } = AntdApp.useApp();

  useEffect(() => {
    setAppInstances({notification, message, modal});
  }, [notification]);

  return null;
}

export default App