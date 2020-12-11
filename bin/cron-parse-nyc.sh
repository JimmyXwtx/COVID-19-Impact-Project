#!/bin/bash
cd ${0%/*}

# Get repo up to date with main
#
cd ..
git pull

# Pull latest NYC COVID stats and convert to JSON for store
# Designed to run as cron job

cd nyc-data/repo
git pull
cd ..

cd ../parse
node parse_nyc.js --silent

# Update repo with current date as commit message
#
git add *
xdate=`date "+%Y-%m-%d-%H:%M:%S"`
git commit -a -m  "cron nyc $xdate"
git push origin master
