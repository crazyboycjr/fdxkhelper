#!/bin/sh

set -e

DIR="$(  cd "$( dirname "$0" )" && pwd )"
if [ $(uname -s) == 'Darwin' ]; then
	if [ "$(whoami)" == "root" ]; then
		TARGET_DIR="/Library/Google/Chrome/NativeMessagingHosts"
	else
		TARGET_DIR=\
			"$HOME/Library/Application Support/Google/Chrome/NativeMessagingHosts"
	fi
else
	if [ "$(whoami)" == "root" ]; then
		TARGET_DIR="/etc/opt/chrome/native-messaging-hosts"
	else
		TARGET_DIR="$HOME/.config/google-chrome/NativeMessagingHosts"
	fi
fi

HOST_NAME=xyz.crazyboycjr.fdxkhelper
rm $TARGET_DIR/$HOST_NAME.json
echo Native Messaging host $HOST_NAME has been uninstalled.
