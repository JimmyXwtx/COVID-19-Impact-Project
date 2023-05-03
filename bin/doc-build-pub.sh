#!/bin/bash
cd ${0%/*}

# Build and publish docus

cd ../docus

# yarn build
npm run build

../bin/doc-pub-html.sh

