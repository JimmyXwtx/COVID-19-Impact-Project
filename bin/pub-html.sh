#!/bin/bash
cd ${0%/*}

# Publish covid19 html app to epvisual.com

delete=--delete
test=
# test=--dry-run
verbose=
# verbose=v

start_time=`date +%s`

host=epdev@epvisual.com
siteroot=/var/www/sites/epvisual.com
homepage=COVID-19-Impact/Dashboard/a0
rpath="${siteroot}/${homepage}"

rdest=$host:${rpath}

ssh $host mkdir -p $rpath

# Remove server uploads directory, establish symbolic link later
ssh $host rm -rf $rpath/uploads

source=../dashboard/build
echo $verbose $delete $test
echo "rsync from $source"
echo "        to $rdest"
rsync -razO$verbose --exclude .DS_Store --exclude .git --exclude uploads --exclude c_data $delete $test "$source/" "$rdest/"

# Symbolic link to express managed uploads
ssh $host ln -s /home/epdev/covid19/uploads $rpath/

echo
ssh $host ls -la $rpath/index.html
grep \"version\" ../dashboard/package.json

echo
echo Lapse $(expr `date +%s` - $start_time) 
echo "open https://epvisual.com/${homepage}"


