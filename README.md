
zh-CN | [en-CN](./README_en-CN.md)

# Atiro

Atiro 是一款 Useless OI Tools。Atiro 编译并运行本地代码，并评判单组本地样例。

## 安装

在安装 Atiro 之前，计算机上需要先安装此应用程序：

- [Node.js](https://nodejs.org/)

Node.js 安装完成后，即可通过以下命令安装 Atiro：

```bash
$ npm install -g atiro
```

如果已经安装过 Atiro，可以通过以下命令更新：

```bash
$ npm update -g atiro
```

## 用法

在工作目录下通过命令行使用 Arito：

```bash
$ atiro judge|j [file] [data] [options]
```

这句命令的含义是，编译并运行 `file.cpp`，从 `data.in` 读入数据并输出到 `data.out`，与标准答案 `data.ans` 对比。

如未指定 `file`，则默认为 `TEST`。如未指定 `data`，则默认与 `file` 相同。如找不到 `data.ans`，则不进行答案比较。

可选选项如下：

- `-c, --comp "-O2 -std=c++14"`，指定编译选项。

Arito 当前尚处于开发初级阶段，因此使用有诸多限制：

- 计算机上需要有能在命令行全局调用的 g++，换言之，需要有 g++ 且已加入环境变量 ``PATH``。
- 仅能在 Windows 下运行。
- 仅支持 C++ 语言。
- 不支持指定时间限制（默认为 $5\mathrm{s}$）。
- 不支持自定义比较方式。
- 不支持默认配置。

## 卸载

与安装时相同，使用 npm 卸载 Atiro。

```bash
$ npm uninstall -g Atiro
```

如果不再需要 Node.js，卸载 Node.js。

## 致谢

[![Sukwants](https://avatars.githubusercontent.com/u/95968907?s=64&v=4)](https://github.com/Sukwants) [![zhangyt](https://avatars.githubusercontent.com/u/115882588?s=64&v=4)](https://github.com/zzhangyutian) [![赵悦岑](https://avatars.githubusercontent.com/u/96607031?s=64&v=4)](https://github.com/2745518585)
