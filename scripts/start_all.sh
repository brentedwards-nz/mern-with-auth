#!/bin/bash

pushd scripts
./backend_start.sh &
./frontend_start.sh &
./socket_start.sh
popd