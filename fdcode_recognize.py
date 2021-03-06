#!/bin/env python2

import struct
import sys
from subprocess import Popen, PIPE, STDOUT
import json

def send_message(msg):
    sys.stdout.write(struct.pack('I', len(msg)))
    sys.stdout.write(msg)
    sys.stdout.flush()

def Main():
    text_length_bytes = sys.stdin.read(4)
    text_length = struct.unpack('i', text_length_bytes)[0]
    text = sys.stdin.read(text_length).decode('utf-8')
    imgStr = json.loads(text)["text"]
    
    imgData = imgStr.decode('base64')
    fout = open('/tmp/ab.jpg', 'w')
    fout.write(imgData)
    fout.close()

    p = Popen(['/usr/bin/tesseract', '-c', 'tessedit_char_whitelist=abcdefghijklmnopqrstuvwxyz', 'stdin', 'stdout'], stdout=PIPE, stdin=PIPE, stderr=PIPE)
    res = p.communicate(input=imgData)[0]

    res = res.strip()
    res = res.replace(' ', '')
    fout = open('/tmp/res', 'w')
    fout.write(res)
    fout.close()

    send_message('"' + res + '"')

if __name__ == '__main__':
    Main()
