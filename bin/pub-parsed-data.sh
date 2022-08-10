#!/bin/bash
cd ${0%/*}

# Publish covid19 parsed-data/c_data epvisual.com

delete=--delete
test=
# test=--dry-run
verbose=
# verbose=v

start_time=`date +%s`

#host=epdev@epvisual.com
#siteroot=/var/www/sites/epvisual.com
host=bitnami@covid19-impact.net
siteroot=/opt/bitnami/projects/sample

homepage=COVID-19-Impact/Dashboard/a0/c_data
rpath="${siteroot}/${homepage}"

rdest=$host:${rpath}

ssh $host mkdir -p $rpath

source=../parsed-data/c_data
echo $verbose $delete $test
echo "rsync from $source"
echo "        to $rdest"
rsync -razO$verbose --exclude .DS_Store --exclude .git  $delete $test "$source/" "$rdest/"

echo
echo Lapse $(expr `date +%s` - $start_time) 
echo "open https://covid19-impact.net/${homepage}/world/c_meta.json"
