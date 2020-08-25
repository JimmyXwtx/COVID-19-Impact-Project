#!/bin/bash
cd ${0%/*}

# Build next version

cd ../dashboard
npm version patch
yarn build
