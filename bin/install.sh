#!/bin/bash
cd ${0%/*}

cd ..

# Setup data source
dest=COVID-19-JHU
if [ ! -e "$dest" ]; then
  git clone https://github.com/CSSEGISandData/COVID-19 $dest
fi
cd $dest
git pull

# Init components

cd ../dashboard
yarn

cd ../parse
yarn

cd ../docus
yarn
