#!/bin/sh -ex

# Add the node and yarn binary directories to the path:
PATH="${PATH}:/usr/share/ovirt-engine-nodejs/bin"
PATH="${PATH}:/usr/share/ovirt-engine-yarn/bin"

# Test and build the application:
yarn install
yarn test
yarn build
