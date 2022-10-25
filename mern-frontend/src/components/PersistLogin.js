import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import useRefreshToken from '../hooks/useRefreshtoken';
import useAuth from '../hooks/useAuth';
import { isPlainObject } from '@mui/utils';

const PersistLogin = () => {
    const [isLoading, setIsLoading] = useState(true);
    const refresh = useRefreshToken();
    const { auth } = useAuth();
    useEffect(() => {
        const verifyRefreshToken = async () => {
            try {
                await refresh();
            }
            catch (err) {
                console.log(err);
            }
            finally {
                setIsLoading(false);
            }
        };

        !auth?.accessToken ? verifyRefreshToken() : setIsLoading(false);
    }, []);

    useEffect(()=> {
        console.log(`isLoading: ${isLoading}`);
        console.log(`aT: ${JSON.stringify(auth?.accessToken)}`)
    }, [isLoading]);

    return (
        <>
            {isLoading
                ? <h2>Loading...</h2>
                : <Outlet/>
            }
        </>
    )
}

export default PersistLogin