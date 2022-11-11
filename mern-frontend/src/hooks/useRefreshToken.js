import { apiClientPrivate } from '../services/api'
import useUserDetails from './useUserDetails';

const useRefreshToken = () => {
    const [userDetails, setUserDetails] = useUserDetails();

    const refresh = async () => {
        try {
            const response = await apiClientPrivate.get('/auth/refresh', {
                withCredentials: true
            });
            setUserDetails(prev => {
                return {
                    ...prev,
                    roles: response.data.roles,
                    token: response.data.accessToken
                }
            });
            return response.data.accessToken;
        }
        catch (err) {
            console.log(err);
        }
    }
    return refresh;
};

export default useRefreshToken;