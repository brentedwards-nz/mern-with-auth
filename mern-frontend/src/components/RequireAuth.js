import { Navigate, Outlet } from 'react-router-dom';

import useUserDetails from '../hooks/useUserDetails';

const RequireAuth = () => {
  const [userDetails] = useUserDetails();
  return (
    userDetails?.isLoggedIn
      ? <Outlet />
      : <Navigate to="/unauthorised" />
  )
}
export default RequireAuth