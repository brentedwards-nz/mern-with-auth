import { useEffect, useRef } from "react";

// const VIDEO_SIZE = 50;
// const WIDTH = 4 * VIDEO_SIZE;
// const HEIGHT = 3 * VIDEO_SIZE;

// const videoSize = {
//   width: WIDTH,
//   height: HEIGHT,
// }

// const videoStyle = {
//   outline: "#000000 solid 1px",
//   opacity: 0.1,
//   backgroundColor: "#ff0000"
// }

const Video = ({ stream }) => {
  const myVideo = useRef();
  useEffect(() => {    
    myVideo.current.srcObject = stream;
  }, [stream])

  return (
    <video width="100%" playsInline muted ref={myVideo} autoPlay />
  )
}
export default Video;