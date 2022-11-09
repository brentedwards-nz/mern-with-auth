import useUserDetails from "../../../hooks/useUserDetails"
import { Navigate } from 'react-router-dom';
import { useEffect } from "react";

const Logout = () => {
  const [userDetails, setUserDetails] = useUserDetails();

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