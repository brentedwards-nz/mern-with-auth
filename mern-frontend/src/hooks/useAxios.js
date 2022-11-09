import { useCallback, useEffect, useState } from 'react'
//import { apiClientPrivate } from '../services/api';

import useAxiosPrivate from './useAxiosPrivate';

const useAxios = (request) => {
  const apiClientPrivate = useAxiosPrivate();

  const {
    method,
    url,
    requestConfig
  } = request;

  const config = useCallback(() => {
    return requestConfig
  }, [requestConfig]);

  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setisLoading] = useState(true);
  const [reload, setReload] = useState(false)

  const refetch = () => setReload(prev => !prev);

  useEffect(() => {
    const controller = new AbortController();

    const requestData = async () => {
      setisLoading(true);
      try {

        const response = await apiClientPrivate[method.toLowerCase()](url, {
          ...config(),
          //signal: controller.signal
        })
        console.table(response.data)
        setData(response.data)
      } catch (error) {
        setError(error.message);
      } finally {
        setisLoading(false);
      }
    };
    requestData();

    return () => controller.abort();

  }, [reload, method, url, config])

  return [isLoading, error, data, refetch];
}

export default useAxios;