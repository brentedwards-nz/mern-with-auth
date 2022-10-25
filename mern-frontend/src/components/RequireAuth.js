import { Navigate, Outlet } from 'react-router-dom';

import useLocalStorage from '../hooks/useLocalStorage';

const RequireAuth = () => {
  const [userDetails] = useLocalStorage('userDetails', {})
  return (
    userDetails?.isLoggedIn
      ? <Outlet />
      : <Navigate to="/unauthorised" />
  )
}
export default RequireAuth