import useLocalStorage from "../../../hooks/useLocalStorage"
import { Navigate } from 'react-router-dom';
import { useEffect } from "react";

const Logout = () => {
  const [userDetails, setUserDetails] = useLocalStorage('userDetails', {})
  
  useEffect(() => {
    setUserDetails({});
  }, [setUserDetails]);
  
  return (
    userDetails?.isLoggedIn
      ? <h2>Logging out...</h2>
      : <Navigate to="/login" />
  )
}
export default Logout