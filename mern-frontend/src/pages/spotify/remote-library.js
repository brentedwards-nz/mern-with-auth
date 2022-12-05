import { useEffect } from "react";

const Remote = () => {
  useEffect(() => {
    window.location.replace('http://localhost:5020/spotify/auth');
  }, [])

  return (<div>
    <h3>Redirecting...</h3>
  </div>)
}

export default Remote