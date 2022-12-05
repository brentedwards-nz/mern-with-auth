import { apiClientPrivate } from "../services/api";
import { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";
import useUserDetails from "./useUserDetails";

const useAxiosPrivate = () => {
    const refresh = useRefreshToken();
    const { userDetails } = useUserDetails();

    useEffect(() => {
        const requestIntercept = apiClientPrivate.interceptors.request.use(
            (config) => {
                if (!config.headers.Authorization && userDetails?.token !== undefined) {
                    const bearerHeader = `Bearer ${userDetails?.token}`;
                    config.headers.Authorization = bearerHeader;
                }
                return config;
            },
            (error) => {
                Promise.reject(error)
            }
        );

        const responseIntercept = apiClientPrivate.interceptors.response.use(
            (response) => {
                return response;
            },
            async (error) => {
                const prevRequest = error?.config;
                if (error?.response?.status === 401 && !prevRequest?.sent) {
                    const result = await refresh();
                    if (result.status === true) {
                        const newAccessToken = result?.token;
                        return apiClientPrivate({
                            ...prevRequest,
                            headers: { ...prevRequest.headers, Authorization: `Bearer ${newAccessToken}` },
                            sent: true
                        });
                    }
                    else {
                        return Promise.reject(result.message);
                    }

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