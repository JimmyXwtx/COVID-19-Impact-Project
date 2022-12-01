#!/bin/bash
cd ${0%/*}

# Publish covid19 html app to epvisual.com

delete=--delete
test=
# test=--dry-run
verbose=
# verbose=v

start_time=`date +%s`

#host=epdev@epvisual.com
#siteroot=/var/www/sites/epvisual.com

# -- [ aws
# host=bitnami@jht1493.net
# siteroot=/home/bitnami/htdocs
# homepage=COVID-19-Impact/Dashboard/a0
# -- ] aws

# -- [ nyu
host=jht9629@covid19impactproject.itp.io
siteroot=/var/www/html
homepage=dashboard
# -- ] nyu

rpath="${siteroot}/${homepage}"

rdest=$host:${rpath}

ssh $host mkdir -p $rpath

# -- retired 2022-12-01
# Remove server uploads directory, establish symbolic link later
# ssh $host rm -rf $rpath/uploads

source=../dashboard/build
echo $verbose $delete $test
echo "rsync from $source"
echo "        to $rdest"
rsync -razO$verbose --exclude .DS_Store --exclude .git --exclude uploads --exclude c_data $delete $test "$source/" "$rdest/"

# -- retired 2022-12-01
# Symbolic link to express managed uploads
# ssh $host ln -s /home/epdev/covid19/uploads $rpath/

echo
ssh $host ls -la $rpath/index.html
grep \"version\" ../dashboard/package.json

echo
echo Lapse $(expr `date +%s` - $start_time) 
# echo "open https://jht1493.net/${homepage}"
echo "open http://covid19impactproject.itp.io/${homepage}"


