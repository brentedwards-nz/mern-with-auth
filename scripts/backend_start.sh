#!/bin/bash
clear
pushd ./mern-backend
PID=$(ps -la | grep node | grep server.js | head -1 | awk '{print $2}')
echo 'PID: ' $PID
kill -9 $PID
npm start
popd
