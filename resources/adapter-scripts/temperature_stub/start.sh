#!/bin/bash
cd $1
nohup python3 sensoradapter_temperature_stub.py > start.log &
