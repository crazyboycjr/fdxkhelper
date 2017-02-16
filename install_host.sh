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

mkdir -p $TARGET_DIR
cp $DIR/$HOST_NAME.json $TARGET_DIR

HOST_PATH=$DIR/fdcode_recognize.py
sed -i -e "s%HOST_PATH%$HOST_PATH%" $TARGET_DIR/$HOST_NAME.json

chmod o+r $TARGET_DIR/$HOST_NAME.json

echo Native Messaging host $HOST_NAME has been installed.
