import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './hooks/useAuth'
import { ToastProvider } from './components/ui/Toast'
import { AppRoutes } from './routes/AppRoutes'

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
