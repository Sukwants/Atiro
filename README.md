zh-CN | [en-CN](./README_en-CN.md)

# Atiro

Atiro 是一款 Useless OI Tools。Atiro 编译并运行本地代码，并评判单组本地样例。

## 安装

在安装 Atiro 之前，计算机上需要先安装此应用程序：

  - [Node.js](https://nodejs.org/)

Node.js 安装完成后，即可使用 npm 安装 Atiro。

```bash
$ npm install -g atiro
```

## 用法

Arito 当前尚处于开发初级阶段，因此使用有诸多限制：

计算机上需要有能在命令行全局调用的 g++，换言之，需要有 g++ 且已加入环境变量 ``PATH``。

仅能在 Windows 下运行。

仅允许以 ``TEST.cpp`` 为源代码文件名，``TEST.in`` 为输入文件名，``TEST.ans`` 为答案文件名，``TEST.out`` 为输出文件名，``TEST.err`` 为错误输出文件名。

仅支持 C++ 语言。

不支持指定编译选项。

不支持指定时间限制（默认为 $10\mathrm{s}$）。

## 卸载

与安装时相同，使用 npm 卸载 Atiro。

```bash
$ npm uninstall -g Atiro
```

如果不再需要 Node.js，卸载 Node.js。

## 致谢

[![Sukwants](https://avatars.githubusercontent.com/u/95968907?s=64&v=4)](https://github.com/Sukwants) [![zhangyt](https://avatars.githubusercontent.com/u/115882588?s=64&v=4)](https://github.com/zzhangyitian) [![赵悦岑](https://avatars.githubusercontent.com/u/96607031?s=64&v=4)](https://github.com/2745518585)