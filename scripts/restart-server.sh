#!/bin/bash

docker cp target/MatrixStats-1.0.0.jar matrixstats_server_1:/usr/src/server/plugins
mcrcon -p password stop