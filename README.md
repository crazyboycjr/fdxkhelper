# fdxkhelper

## 介绍
你懂
chrome 插件

## 依赖
- [tesseract](https://github.com/tesseract-ocr/tesseract)

你可以使用自己发行版的包管理器安装
For Ubuntu
```
apt install tesseract-ocr
```
For Arch Linux
```
pacman -S tesseract
```

运行 `install_host.sh`，来允许chrome调用本地程序`fdcode-recognize.py`

在 `chrome://extensions` 页面选择 `Load unpacked extension directory` 来加载插件

最后在课程表页面打开插件即可进行选课退课

![screenshot](/home/cjr/Developing/xk/fdxkhelper/screenshot.png)