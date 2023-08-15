zh-CN | [en-CN](./README_en-CN.md)

# Atiro

Atiro 是一款 Useless OI Tools。Atiro 编译并运行本地代码，并评判本地样例。

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

为了能正常使用 Atiro，计算机上需要确保已经安装 C++ 编译器 g++，并能在命令行全局调用，这是编译所必需的。

如果 Windows 计算机上已经安装了 g++，但无法在命令行全局调用，请尝试将 g++ 程序本体路径加入环境变量 `PATH`。

## 用法

### Judge

```bash
$ atiro judge|j [file] [data] [options]
```

编译代码，对每组样例数据运行并评判。

`file`，指定代码文件名，默认值为  `TEST`。

`data`，指定样例数据文件名，这是一个通配符表达式，默认值为  `[file]*`，即以 `file` 值（上个参数）为前缀匹配。

首先编译 `file.cpp` 得到 `file` / `file.exe`，然后查找所有匹配 `data.in` 的文件，作为输入数据运行并输出到 `data.out`，如果存在 `data.ans`，则将 `data.out` 与 `data.ans` 比较。

可选选项如下：

- `-c, --comp "-O2 -std=c++14"`，指定编译选项，默认不指定任何编译选项。
- `-t, --time 1000`，指定时间限制，单位为 ms，默认为 5000。
- `-j, --judg real`，指定比较方式，`text` 文本比较，`numb` 整数比较，`real` 实数比较（相对误差 `1e-9`），默认为 `text`。
- `-a, --allj`，强制测试所有数据，如果不使用该选项，则会在首次评测结果非 `Accepted` 时停止测试接下来的数据。

### Config

```bash
$ atiro config|c <key> [-g, --get] [-s, --set <value>] [-u, --unset]
```

设定用户配置。

`key`，指定进行操作的配置项。

可选操作如下：

- `-g, --get`，获取配置项当前值。
- `-s, --set <value>`，设置配置项值为 `value`。
- `-u, --unset`，设置配置项值为空（使用默认值）。

可用配置如下：

- `file.name`，默认文件名，即 `judge` 命令的 `file` 参数。
- `option.comp`，默认编译选项，即 `judge` 命令的 `comp` 选项。
- `option.time`，默认时间限制，即 `judge` 命令的 `time` 选项。
- `option.judg`，默认比较方式，即 `judge` 命令的 `judg` 选项。

## 卸载

与安装时相同，使用 npm 卸载 Atiro。

```bash
$ npm uninstall -g Atiro
```

如果不再需要 Node.js，卸载 Node.js。

如果不再需要 g++，卸载 g++ 并移除出环境变量 `PATH`。

## 致谢

[![Sukwants](https://avatars.githubusercontent.com/u/95968907?s=64&v=4)](https://github.com/Sukwants) [![zhangyt](https://avatars.githubusercontent.com/u/115882588?s=64&v=4)](https://github.com/zzhangyutian) [![赵悦岑](https://avatars.githubusercontent.com/u/96607031?s=64&v=4)](https://github.com/2745518585)
