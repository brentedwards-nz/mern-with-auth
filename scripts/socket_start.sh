#!/bin/bash
clear
pushd ~/Projects/mern-with-auth/mern-backend-socket.io
#PID=$(ps -la | grep node | grep server.js | head -1 | awk '{print $2}')
#echo 'PID: ' $PID
#kill -9 $PID
#PID=$(ps -la | grep node | grep server.js | head -1 | awk '{print $2}')
#echo 'PID: ' $PID
#kill -9 $PID
nodemon index.js
popd
