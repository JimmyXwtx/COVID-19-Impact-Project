#!/bin/bash
cd ${0%/*}

# Publish covid19 html app to epvisual.com

delete=--delete
test=
# test=--dry-run
verbose=
verbose=v

#host=epdev@epvisual.com
#siteroot=/var/www/sites/epvisual.com
host=bitnami@covid19-impact.net
siteroot=/opt/bitnami/projects/sample

homepage=COVID-19-Impact/Project
rpath="${siteroot}/${homepage}"

rdest=$host:${rpath}

echo ssh $host mkdir -p $rpath
ssh $host mkdir -p $rpath

source=../docus/build
echo $verbose $delete $test
echo "rsync from $source"
echo "        to $rdest"
rsync -razO$verbose --exclude .DS_Store --exclude .git  $delete $test "$source/" "$rdest/"

echo
ssh $host ls -la $rpath/index.html
grep \"version\" ../docus/package.json

echo
echo "open https://covid19-impact.net/${homepage}"
