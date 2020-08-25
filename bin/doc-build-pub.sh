#!/bin/bash
cd ${0%/*}

cd ../docus

yarn build

../bin/doc-pub-html.sh

