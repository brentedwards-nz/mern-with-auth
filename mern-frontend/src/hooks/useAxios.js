import { useEffect, useState } from 'react'
import useAxiosPrivate from './useAxiosPrivate';

const useAxios = (request) => {
  const apiClientPrivate = useAxiosPrivate();

  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setisLoading] = useState(true);
  const [reload, setReload] = useState(false);
  const [body, setBody] = useState(null);

  const {
    method,
    url,
    requestBody,
    config
  } = request;

  const refetch = () => {
    setReload(prev => !prev);
  }

  const repost = (body) => {
    setBody(body)
  }

  useEffect(() => {
    setBody(requestBody)
  }, [requestBody])

  useEffect(() => {
    const controller = new AbortController();
    const requestData = async () => {
      setisLoading(true);
      setError('');
      try {
        const response = await apiClientPrivate[method.toLowerCase()](url, body, {
          signal: controller.signal
        });
        setData(response.data);
      } catch (error) {
        if (error?.code !== "ERR_CANCELED") {
          if (error.response.status === 404) {
            setError(`Please enter a valid search string`);
          }
          else {
            setError(error?.message);
          }
        }
        else if (error?.code !== "ERR_CANCELED") {
          setError(error?.message);
        }
      } finally {
        setisLoading(false);
      }
    };
    requestData();

    return () => controller.abort();

  }, [reload, method, url, apiClientPrivate, body, config])

  return { isLoading: isLoading, error: error, data: data, refetch: refetch, repost: repost };
}

export default useAxios;