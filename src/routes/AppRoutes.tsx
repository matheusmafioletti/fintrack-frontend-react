import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { ROUTES } from '@/utils/constants'
import { PrivateRoute } from './PrivateRoute'
import { Login } from '@/pages/Login'
import { Register } from '@/pages/Register'
import { Dashboard } from '@/pages/Dashboard'
import { Transactions } from '@/pages/Transactions'
import { Categories } from '@/pages/Categories'
import { Budgets } from '@/pages/Budgets'
import { Reports } from '@/pages/Reports'
import { Loading } from '@/components/common/Loading'

export default function AppRoutes() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <Loading fullScreen text="Carregando..." />
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path={ROUTES.LOGIN}
        element={
          isAuthenticated ? <Navigate to={ROUTES.DASHBOARD} replace /> : <Login />
        }
      />
      <Route
        path={ROUTES.REGISTER}
        element={
          isAuthenticated ? <Navigate to={ROUTES.DASHBOARD} replace /> : <Register />
        }
      />

      {/* Private Routes */}
      <Route element={<PrivateRoute />}>
        <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
        <Route path={ROUTES.TRANSACTIONS} element={<Transactions />} />
        <Route path={ROUTES.CATEGORIES} element={<Categories />} />
        <Route path={ROUTES.BUDGETS} element={<Budgets />} />
        <Route path={ROUTES.REPORTS} element={<Reports />} />
      </Route>

      {/* Redirect root to dashboard or login */}
      <Route
        path={ROUTES.HOME}
        element={
          <Navigate
            to={isAuthenticated ? ROUTES.DASHBOARD : ROUTES.LOGIN}
            replace
          />
        }
      />

      {/* 404 */}
      <Route
        path="*"
        element={
          <Navigate
            to={isAuthenticated ? ROUTES.DASHBOARD : ROUTES.LOGIN}
            replace
          />
        }
      />
    </Routes>
  )
}
