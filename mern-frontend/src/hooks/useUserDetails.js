import useLocalStorage from "./useLocalStorage"

const useUserDetails = () => {
  const [userDetails, setUserDetails] = useLocalStorage('userDetails', {});
  return [userDetails, setUserDetails];
}

export default useUserDetails;