#!/bin/bash
cd ${0%/*}

cd ..

# Setup data source for John Hopkins data
dest=COVID-19-JHU
if [ ! -e "$dest" ]; then
  git clone https://github.com/CSSEGISandData/COVID-19 $dest
fi
cd $dest
git pull
cd ..

# Setup data source for NYC heath
dest=nyc-data
if [ ! -e "$dest/repo" ]; then
  mkdir -p $dest
  cd $dest
  git clone https://github.com/nychealth/coronavirus-data repo
  cd ..
fi
cd $dest/repo
git pull
cd ../..

# Our parsed data repo
dest=parsed-data
if [ ! -e "$dest" ]; then
  git clone git@github.com:EP-Visual-Design/COVID-19-parsed-data $dest
fi
cd $dest
git pull

# Init install for our components

cd ../dashboard
yarn

cd ../parse
yarn

cd ../docus
yarn
