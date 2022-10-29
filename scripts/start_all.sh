#!/bin/bash

pushd scripts
./backend_start.sh &
./frontend_start.sh &
popd