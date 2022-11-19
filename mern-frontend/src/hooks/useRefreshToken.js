import { apiClientPrivate } from '../services/api'
import useUserDetails from './useUserDetails';

const useRefreshToken = () => {
    const [userDetails, setUserDetails] = useUserDetails();

    const refresh = async () => {
        if (!userDetails) {
            return "User not logged";
        }

        try {
            const response = await apiClientPrivate.get('/auth/refresh');
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
            console.table(err);
            return "Could not refresh access token";
        }
    }
    return refresh;
};

export default useRefreshToken;