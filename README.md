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

为了能正常使用 Atiro，计算机上需要安装 C++ 编译器 g++，并能在命令行全局调用。或者对于 Windows 计算机，你还可以选择通过 `atiro config compiler.path --set <path/to/g++>` 指定 g++ 程序本体路径。这是编译所必需的。

## 用法

**Atiro 未对答案程序和评测辅助程序作任何限制，切记确保信任这些程序，切忌在本地或在线评测系统中使用。**

### Judge

```bash
$ atiro judge|j [file] [data] [options]
```

编译代码，对每组样例数据运行并评判。

**简单示例如下：**

```bash
$ atiro j               # 编译 TEST.cpp 并运行、评测，数据为 TEST*.in / TEST*.ans
```

```bash
$ atiro j A             # 编译 A.cpp 并运行、评测，数据为 A*.in / A*.ans
```

```bash
$ atiro j A-std A       # 编译 A-std.cpp 并运行、评测，数据为 A*.in / A*.ans
```

**具体解释如下：**

`file`，指定答案程序文件名，默认值为  `TEST`。

`data`，指定样例数据文件名，在未指定 `generator` 时，这是一个通配符表达式，默认值为  `<file>*`，即以 `<file>` 值（上个参数）为前缀匹配。在指定 `generator` 时，该选项指定一个确切的文件名。

首先编译 `<file>.cpp` 得到 `<file>` / `<file>.exe`，然后查找所有匹配 `<data>.in` 的文件，作为输入数据运行并输出到 `<data>.out`，如果存在 `<data>.ans`，则将 `<data>.out` 与 `<data>.ans` 比较。在指定 `generator` 时，由 `generator` 连续生成输入数据至 `<data>.in`。

可选选项：

- `-c, --comp "-O2 -std=c++14"`，指定编译选项，默认不指定任何编译选项。
- `-t, --time 1000`，指定时间限制，单位为 ms，默认为 `5000`。
- `-j, --judg real`，指定比较方式，`text` 文本比较，`numb` 整数比较，`real` 实数比较（相对误差 `1e-9`），也可以指定 `checker` 文件名，默认为 `text`。
- `-g, --grad grader`，指定 `interactor` 文件名，这意味着本题是一道交互题。
- `-s, --solv solver`，指定 `solver` 文件名，这意味着标准答案将由 `solver` 计算得出，而不是提前准备。
- `-m, --make maker`，指定 `generator` 文件名，这意味着接下来将由 `generator` 连续生成输入数据至 `<data>.in` 评测，通常情况下须配合 `solver` 使用，也就是中文语境下俗称的「对拍」。
- `-a, --allj`，强制测试所有数据，如果不使用该选项，则会在首次评测结果非 `Accepted` 时停止测试接下来的数据。在指定 `generator` 时，这意味着「对拍」将持续进行下去，直到主动结束程序。

这里有关于以上指令的简单示例：<https://github.com/Sukwants/Atiro-examples>

#### 评测辅助程序

Atiro 支持的评测辅助程序有 `checker`、`interactor`、`solver`、`generator`，除 `solver` 外建议使用 `testlib.h`（[GitHub 项目地址](https://github.com/MikeMirzayanov/testlib)）。Atiro 不予内置 `testlib.h`，所以需要自行下载，也可以选择自行处理参数和文件。

评测辅助程序的编译选项与答案程序的编译选项保持一致，除 `solver` 外运行时间不做限制，`solver` 运行时限与答案程序的运行时限保持一致。

- `checker`，比较器，支持 `testlib.h`，使用 `--judg` 选项指定。如不使用 `testlib.h`，调用时传入 3 个参数 `<input file>`、`<output file>`、`<answer file>`，分别对应 `.in` 文件、`.out` 文件、`.ans` 文件。程序须自行报告评测结果，同时在评测结果为 `Accepted` 时返回 `0`，非 `Accepted` 时返回非 `0`。
- `interactor`，交互器，支持 `testlib.h`，使用 `--grad` 选项指定。如不使用 `testlib.h`，调用时传入 2 个参数 `<input file>`、`<output file>`，分别对应 `.in` 文件、`.out` 文件，并将交互器的输入、输出与答案程序的输出、输入连接。程序在交互正确结束 时返回 `0`，交互存在错误时返回非 `0`。
- `solver`，解决器，使用 `--solv` 选项指定。从 `.in` 文件读入数据，并输出到 `.ans` 文件。程序在交互正确结束时返回 `0`，返回非 `0` 将被判定为 `Runtime Error`。通常情况下，请将 `solver` 写作答案程序的格式。
- `generator`，生成器，支持 `testlib.h`，使用 `--make` 选项指定。如不使用 `testlib.h`，调用时传入 2 个参数 `<data number>`、`<seed>`，`<data number>` 为测试点编号，`<seed>` 是一个长度为 10 的随机字符串，同时也会在控制台的数据点标题行给出。生成的数据输出到标准输出流。不处理程序返回值，但仍建议返回值为 0。

## OJ Tools

```bash
$ atiro <oj> login|i | logout|o | get|g <id> [file] | submit|s [file] [id]
```

在 Atiro 登入登出 OJ，从 OJ 上拉取题目样例，或提交答案到 OJ。

`<oj>` 选项可选 `codeforces|cf`、`atcoder|at`、`luogu|lg`、`vjudge|vj`。

**简单示例如下：**

```bash
$ atiro lg i                                             # 在 Atiro 登入 洛谷
```

```bash
$ atiro vj o                                             # 在 Atiro 登出 vjudge
```

```bash
$ atiro cf g https://codeforces.com/contest/1/problem/A  # 拉取 Codeforces 题目 1A 的样例，文件名为 TEST
```

```bash
$ atiro cf g https://codeforces.com/contest/1            # 拉取 Codeforces 比赛 1 所有题目的样例，文件名为题目编号
```

```bash
$ atiro at s C https://atcoder.jp/contests/arc100/tasks/arc100_a # 提交 C.cpp 到 AtCoder 题目 ARC100A
```

**具体解释如下：**

`<oj>`，指定 Online Judge 平台，当前支持 Codeforces（`codeforces|cf`）、AtCoder（`atcoder|at`）、洛谷（`luogu|lg`）、vjudge（`vjudge|vj`）。

可选命令：

- `login|i`，登入 OJ，拉取有权限题目的样例或提交答案需要在 Atiro 登入 OJ。
- `logout|o`，登出 OJ。
- `get|g <id> [file]`，拉取指定题目或指定比赛所有题目的样例到本地，`<id>` 可以是对应题目或比赛的 url 或 id，在拉取单个题目样例时可使用 `[file]` 指定文件名，否则为 `TEST`。注意，拉取比赛所有题目的样例不适用于 vjudge。
- `submit|s [file] [id]`，提交答案，`[file]` 为答案程序名，默认为全局默认文件名，`[id]` 为题目 url 或 id。

上文所说的题目或比赛的 id，形如 Codeforces 的 `1A`、`1`，AtCoder 的 `"arc100 a"`、`arc100`，洛谷的 `P1004`、`1`、`"P1004 1"`（比赛提交），vjudge 的 `CodeForces-1A`。

### Config

```bash
$ atiro config|c <key> [-g, --get] [-s, --set <value>] [-u, --unset]
```

设定用户配置。

**简单示例如下：**

```bash
$ atiro c file.name --get                    # 获取默认答案程序的当前配置值
```

```bash
$ atiro c judge.comp --set "-O2 -std=c++14"  # 设置默认编译选项为 "-O2 -std=c++14"
```

```bash
$ atiro c judge.time --unset                 # 清除默认时间限制设置
```

**具体解释如下：**

`key`，指定进行操作的配置项。

可选操作：

- `-g, --get`，获取配置项当前值。
- `-s, --set <value>`，设置配置项值为 `value`。
- `-u, --unset`，设置配置项值为空（使用默认值）。

可用配置：

- `compiler.path`，编译器路径，如能全局调用 g++ 可忽略。
- `file.name`，全局默认文件名，包括 `judge` 命令的 `file` 参数、OJ Tools 的默认拉取文件名和默认提交文件名。
- `judge.comp`，默认编译选项，即 `judge` 命令的 `comp` 选项。
- `judge.time`，默认时间限制，即 `judge` 命令的 `time` 选项。
- `judge.judg`，默认比较方式 / `checker`，即 `judge` 命令的 `judg` 选项。
- `judge.grad`，默认 `interactor`，即 `judge` 命令的 `grad` 选项。
- `judge.solv`，默认 `solver`，即 `judge` 命令的 `solv` 选项。
- `judge.make`，默认 `generator`，即 `judge` 命令的 `make` 选项。
- `update.type`，更新版本自动检测模式。

### Update

```bash
$ atiro update|u [type|t | notice|n | ignore|i]
```

检测并更新 Atiro，或设置更新版本自动检测模式。

- `atiro update`，检测并更新 Atiro。
- `atiro update type`，查询当前更新版本自动检测模式，`notice` 或 `ignore`。
- `atiro update notice`，设置更新版本自动检测模式为 `notice`，将每隔 48 小时自动检测更新版本，如检测失败将在 12 小时后重新检测。这是默认模式。
- `atiro update ignore`，设置更新版本自动检测模式为 `ignore`，将忽略更新版本。

也可以通过 `config` 命令查询和修改 `update.type` 配置选项，可以设置为 `notice` 或 `ignore`。

## 卸载

与安装时相同，使用 npm 卸载 Atiro。

```bash
$ npm uninstall -g Atiro
```

如果不再需要 Node.js，卸载 Node.js。

如果不再需要 g++，卸载 g++。

## 致谢

[![Sukwants](https://avatars.githubusercontent.com/u/95968907?s=64&v=4)](https://github.com/Sukwants) [![zhangyt](https://avatars.githubusercontent.com/u/115882588?s=64&v=4)](https://github.com/zzhangyutian) [![赵悦岑](https://avatars.githubusercontent.com/u/96607031?s=64&v=4)](https://github.com/2745518585)
