import './App.css'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@/providers/ThemeContext'
import { AuthProvider } from '@/providers/AuthContext'
import { AppRoutes } from '@/routes'
import { App as AntdApp } from 'antd';
import { useEffect } from 'react'
import { setAppInstances } from './services/antdAppInstances'

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AntdApp>
          <Initializer />
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </AntdApp>
      </ThemeProvider>
    </BrowserRouter>
  )
}

function Initializer() {
  const { notification, message, modal } = AntdApp.useApp();

  useEffect(() => {
    setAppInstances({ notification, message, modal });
  }, []);

  return null;
}

export default App