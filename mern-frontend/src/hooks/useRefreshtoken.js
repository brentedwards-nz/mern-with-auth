import { apiClient } from '../services/api'
//import useLocalStorage from './useLocalStorage';
import useAuth from './useAuth';

const useRefreshToken = () => {
    const { setAuth } = useAuth();

    const refresh = async () => {
        console.log("*** useRefreshToken ***");
        try {
            const response = await apiClient.get('/auth/refresh', {
                withCredentials: true
            });
            console.log(response.data.accessToken);
            setAuth(prev => {
                return {
                    ...prev,
                    roles: response.data.roles,
                    accessToken: response.data.accessToken
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