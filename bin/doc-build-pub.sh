#!/bin/bash
cd ${0%/*}

# Build and publish docus

cd ../docus

yarn build

../bin/doc-pub-html.sh

