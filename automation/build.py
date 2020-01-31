#!/usr/bin/env python3
# -*- coding: utf-8 -*-

#
# Copyright (c) 2017 Red Hat, Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#   http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

import datetime
import json
import os
import re
import shutil
import subprocess
import sys


def say(message):
    print(message)
    sys.stdout.flush()


def run_command(args):
    say('Running command %s ...' % args)
    proc = subprocess.Popen(args)
    return proc.wait()


def eval_command(args):
    say('Evaluating command %s ...' % args)
    proc = subprocess.Popen(args, stdout=subprocess.PIPE)
    output, errors = proc.communicate()
    result = proc.wait()
    return result, output.decode("utf-8")


def dec_version(version):
    say('Decrementing version \'%s\'...' % version)
    parts = version.split('.')
    i = len(parts) - 1
    while i >= 0:
        part = parts[i]
        match = re.match(r'^(?P<prefix>.*?)(?P<number>\d+)$', part)
        if match is not None:
            prefix = match.group('prefix')
            number = match.group('number')
            number = int(number)
            if number > 0:
                number -= 1
                parts[i] = "%s%d" % (prefix, number)
                break
        i -= 1
    result = '.'.join(parts)
    say('Decremented version is \'%s\'...' % result)
    return result

def main():
    # Clean the generated artifacts to the output directory:
    say('Cleaning output directory ...')
    artifacts_list = []
    artifacts_path = 'exported-artifacts'
    if os.path.exists(artifacts_path):
        shutil.rmtree(artifacts_path)
    os.makedirs(artifacts_path)

    # Extract the version number from the root package.json file:
    say('Extracting version from package.json file ...')
    package_path = 'package.json'
    if not os.path.exists(package_path):
        say('Package file \'%s\' doesn\'t exist.' % package_path)
        sys.exit(1)
    try:
        with open(package_path, 'r') as package_file:
            package_json = json.load(package_file)
    except ValueError:
        say('Can\'t parse package.json file \'%s\'.' % package_path)
        sys.exit(1)
    package_version = package_json['version']
    say('Package version is \'%s\'.' % package_version)

    # Extract the subject and identifier of the latest commit:
    say('Extracting commit information ...')
    result, commit_info = eval_command([
        'git',
        'log',
        '-1',
        '--oneline',
    ])
    if result != 0:
        say('Extraction of commit info failed with exit code %d.' % result)
        sys.exit(1)
    commit_re = re.compile(r'^(?P<id>[0-9a-f]{7}) (?P<title>.*)')
    commit_match = commit_re.match(commit_info)
    if commit_match is None:
        say('Commit info \'%s\' doesn\'t match format \'%s\'.' % (
            commit_info,
            commit_re.pattern,
        ))
        sys.exit(1)
    commit_id = commit_match.group('id')
    commit_title = commit_match.group('title')
    commit_suffix = '%sgit%s' % (
        datetime.datetime.now().strftime('%Y%m%d'),
        commit_id,
    )
    say('Commit identifier is \'%s\'.' % commit_id)
    say('Commit title is \'%s\'.' % commit_title)
    say('Commit suffix is \'%s\'.' % commit_suffix)

    # Split the version number into its components:
    say("Calculating package version number ...")
    version_re = re.compile(r'^(?P<xyz>\d+\.\d+.\d+)(-(?P<q>.*))?$')
    version_match = version_re.match(package_version)
    if version_match is None:
        say('Package version \'%s\' doesn\'t match format \'%s\'.' % (
            package_version,
            version_re.pattern
        ))
        sys.exit(1)
    version_xyz = version_match.group('xyz')
    version_qualifier = version_match.group('q')
    if version_xyz:
        say('Package version XYZ is \'%s\'.' % version_xyz)
    else:
        say('Package version XYZ is empty.')
    if version_qualifier:
        say('Package version qualifier is \'%s\'.' % version_qualifier)
    else:
        say('Package version qualifier is empty.')

    # Check if this is a release commit:
    say('Checking if this is a release commit ...')
    is_release = True
    if version_qualifier:
        is_release = False
    if is_release:
        say('This is a release commit.')
    else:
        say('This isn\'t a release commit.')

    # Calculate the tar version number:
    tar_version = package_version
    if not is_release:
        tar_version += '.%s' % commit_suffix
    say('Tarball version is \'%s\'.' % tar_version)

    # Create the tarball:
    say('Creating tarball ...')
    tar_prefix = 'ovirt-engine-api-explorer-%s' % tar_version
    tar_path = '%s.tar.gz' % tar_prefix
    result = run_command([
        'git',
        'archive',
        '--prefix=%s/' % tar_prefix,
        '--output=%s' % tar_path,
        'HEAD',
    ])
    if result != 0:
        say('Tarball creation failed with exit code %d.' % result)
        sys.exit(1)
    artifacts_list.append(tar_path)
    say('Tarball file is \'%s\'.' % tar_path)

    # Calculate the RPM dist tag:
    say('Find the RPM \'dist\' tag ...')
    result, rpm_dist = eval_command([
        'rpm',
        '--eval',
        '%dist'
    ])
    if result != 0:
        say('Finding the RPM \'dist\' tag failed with exit code %d.' % (
            result,
        ))
        sys.exit(1)
    rpm_dist = rpm_dist.strip()
    say('RPM \'dist\' is \'%s\'.' % rpm_dist)

    # Locate the RPM spec template:
    say('Locating RPM spec template ...')
    spec_template_path = 'packaging/spec%s.in' % rpm_dist
    if not os.path.exists(spec_template_path):
        say('RPM spec template \'%s\' doesn\'t exist.' % spec_template_path)
        sys.exit(1)
    say('RPM spec template is \'%s\'.' % spec_template_path)

    # Load the RPM spec template:
    say('Loading RPM spec template ...')
    with open(spec_template_path) as spec_fd:
        spec_lines = spec_fd.readlines()
    say('RPM spec loaded.')

    # Extract the values of the tags from the RPM spec. The result will
    # be added to a map of tuples, each tuple containing the value of the
    # tag and the index of the line of the spec file.
    say('Extracting RPM tags and globals ...')
    spec_tags = {}
    spec_globals = {}
    tag_re = re.compile(
        r'^(?P<name>[a-zA-Z0-9_]+)\s*:\s*(?P<value>.*)$'
    )
    global_re = re.compile(
        r'^%global\s+(?P<name>[a-zA-Z0-9_]+)\s+(?P<value>.*)$'
    )
    for line_index in range(0, len(spec_lines)):
        spec_line = spec_lines[line_index]
        tag_match = tag_re.match(spec_line)
        if tag_match is not None:
            tag_name = tag_match.group('name').lower()
            tag_value = tag_match.group('value')
            spec_tags[tag_name] = (tag_value, line_index)
        global_match = global_re.match(spec_line)
        if global_match is not None:
            global_name = global_match.group('name').lower()
            global_value = global_match.group('value')
            spec_globals[global_name] = (global_value, line_index)

    # Check that the required tags are available:
    say('Checking required RPM tags and globals ...')
    version_tag = spec_tags['version']
    release_tag = spec_tags['release']
    tar_version_global = spec_globals['tar_version']
    missing = False
    if version_tag is None:
        say('Can\'t find the RPM version tag.')
        missing = True
    if release_tag is None:
        say('Can\'t find the RPM release tag.')
        missing = True
    if tar_version_global is None:
        say('Can\'t find the RPM \'tar_version\' global.')
        missing = True
    if missing:
        sys.exit(1)
    say('RPM version tag is \'%s\'.' % version_tag[0])
    say('RPM release tag is \'%s\'.' % release_tag[0])
    say('RPM \'tar_version\' global is \'%s\'.' % tar_version_global[0])

    # Extract the current value of the RPM release tag, discarding the
    # 'dist' suffix if it is present:
    say('Extracting current RPM release ...')
    rpm_release = re.sub(r'%\{\?dist\}$', '', release_tag[0])
    say('Current RPM release number is \'%s\'.' % rpm_release)

    # Calculate the RPM version and release numbers:
    say('Calculating RPM version and release numbers ...')
    rpm_version = version_xyz
    if not is_release:
        rpm_release = dec_version(rpm_release)
        rpm_release += ".%s.%s" % (version_qualifier, commit_suffix)
    say('RPM version is \'%s\'.' % rpm_version)
    say('RPM release is \'%s\'.' % rpm_release)

    # Update the RPM spec lines with the new version and release and
    # write the resulting spec file:
    say('Generating RPM spec file ...')
    spec_lines[version_tag[1]] = 'Version: %s\n' % rpm_version
    spec_lines[release_tag[1]] = 'Release: %s%%{?dist}\n' % rpm_release
    spec_lines[tar_version_global[1]] = "%%global tar_version %s\n" % (
        tar_version,
    )
    spec_path = 'ovirt-engine-api-explorer.spec'
    with open(spec_path, 'w') as spec_fd:
        spec_fd.writelines(spec_lines)

    # Build the RPMs:
    cwd = os.getcwd()
    result = run_command([
        'rpmbuild',
        '-ba',
        '--define=_sourcedir %s' % cwd,
        '--define=_srcrpmdir %s' % cwd,
        '--define=_rpmdir %s' % cwd,
        spec_path,
    ])
    if result != 0:
        say('RPM build failed with exit code %d.' % result)
        sys.exit(1)
    result, rpm_paths = eval_command([
        'find', '.',
        '-name', '*.rpm',
    ])
    if result != 0:
        say('Finding the RPM files failed with exit code %d.' % result)
        sys.exit(1)
    rpm_paths = rpm_paths.split()
    artifacts_list.extend(rpm_paths)
    say('Generated RPM files are \'%s\'.' % rpm_paths)

    # Move all the relevant files to the output directory:
    say('Moving files to the output directory ...')
    for artifact_path in artifacts_list:
        shutil.move(artifact_path, artifacts_path)


if __name__ == '__main__':
    main()
