#!/bin/bash
cd ${0%/*}

# Pull latest CROVID19 stats and convert to JSON for store
# Designed to run as cron job

cd ../COVID-19-JHU/
git pull

cd ../parse
node population_dict.js 
node aparse.js --silent
