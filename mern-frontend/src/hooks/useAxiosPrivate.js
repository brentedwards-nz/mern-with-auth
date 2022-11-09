import { apiClientPrivate } from "../services/api";
import { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";
import useUserDetails from "./useUserDetails";

const useAxiosPrivate = () => {
    const refresh = useRefreshToken();
    const { userDetails } = useUserDetails();

    useEffect(() => {
        console.table(userDetails);
    }, [userDetails]) 

    useEffect(() => {

        const requestIntercept = apiClientPrivate.interceptors.request.use(
            config => {
                if (!config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${userDetails?.accessToken}`;
                }
                return config;
            }, (error) => Promise.reject(error)
        );

        const responseIntercept = apiClientPrivate.interceptors.response.use(
            response => response,
            async (error) => {
                const prevRequest = error?.config;
                if (error?.response?.status === 401 && !prevRequest?.sent) {
                    prevRequest.sent = true;
                    const newAccessToken = await refresh();
                    prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return apiClientPrivate(prevRequest);
                }
                return Promise.reject(error);
            }
        );

        return () => {
          apiClientPrivate.interceptors.request.eject(requestIntercept);
          apiClientPrivate.interceptors.response.eject(responseIntercept);
        }
    }, [userDetails, refresh])

    return apiClientPrivate;
}

export default useAxiosPrivate;