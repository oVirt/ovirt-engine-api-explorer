#!/bin/sh -ex

# Clean and then create the artifacts directory:
rm -rf exported-artifacts
mkdir -p exported-artifacts

# Add the node and yarn binary directories to the path:
PATH="${PATH}:/usr/share/ovirt-engine-nodejs/bin"
PATH="${PATH}:/usr/share/ovirt-engine-yarn/bin"

# Calculate the version number:
version="$(automation/version.py)"
date="$(date -u +%Y%m%d)"
commit="$(git log -1 --pretty=format:%h)"
suffix=".${date}git${commit}"

# Build the application:
yarn install
yarn build

# Build the tarball:
tar_name="ovirt-engine-api-explorer"
tar_dir="${tar_name}-${version}"
tar_file="${tar_name}-${version}${suffix}.tar.gz"
mv build "${tar_dir}"
tar czf "${tar_file}" "${tar_dir}"

# Copy the tarball to the exported artifacts directory:
mv "${tar_file}" exported-artifacts/
