import { apiClientPrivate } from '../services/api'
import useUserDetails from './useUserDetails';

const useRefreshToken = () => {
    const [userDetails, setUserDetails] = useUserDetails();

    const refresh = async () => {
        if (!userDetails) {
            return { status: false, message: "User not logged in" };
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
            return { status: true, token: response.data.accessToken };
        }
        catch (err) {
            console.table(err);
            return { status: false, message: "Could not refresh access token" };
        }
    }

    return refresh;
};

export default useRefreshToken;