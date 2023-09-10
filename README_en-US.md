[zh-CN](./README.md) | en-US | [ru-RU](./README_ru-RU.md) | [ja-JP](./README_ja-JP.md)

# Atiro

Atiro is a set of Useless OI Tools that compile and run local code and judge local samples.

## Contents

- [Installation](#installation)
- [Quick Start](#Quick Start)
- [Usage](#usage)
  - [Judge](#judge)
  - [OJ Tools](#oj-tools)
  - [Config](#config)
  - [Update](#update)
- [Uninstallation](#uninstallation)
- [Thanks](#thanks)

## Installation

This application needs to be installed on your computer before installing Atiro:

- [Node.js](https://nodejs.org/)

Once Node.js is installed, you can install Atiro using the following command:

```bash
$ npm install -g atiro
```

You can update Atiro using the following command if it is already installed:

```bash
$ npm update -g atiro
```

To use Atiro properly, you need to have the C++ compiler g++ installed on your computer, and it should be accessible globally through the command line. Alternatively, for Windows computers, you can also specify the path to the g++ compiler executable using the command `atiro config compiler.path --set <path/to/g++>`. This is essential for the compilation process.

## Quick Start

If you want to start using Atiro quickly, here are some basic steps:

1. Write an answer program (e.g., `A.cpp`).
2. Use the following command to compile:

```bash
$ atiro judge A
```

It will compile `A.cpp`, run and judge it using the default sample data filenames (`A*.in` / `A*.ans`).

## Usage

**Atiro does not place any restrictions on the answer or judging-assisting programs, so make sure that you can trust these programs and do not use them locally or in an online judge system.**

### Judge

```bash
$ atiro judge|j [file] [data] [options]
```

Compile the code, run it, and judge the result for each set of samples.

**A simple example is as follows:**

```bash
$ atiro j               # compile TEST.cpp, run and judge, using the data TEST*.in / TEST*.ans
```

```bash
$ atiro j A             # compile A.cpp, run and judge, using the data A*.in / A*.ans
```

```bash
$ atiro j A-std A*      # compile A-std.cpp, run and judge, using the data A*.in / A*.ans
```

**Specific explanations are provided below:**

`file`, specifies the code filename, defaulting to `TEST`.

`data`, specifies the filename for example data. When `generator` is not specified, this is a wildcard expression with a default value of `<file>*`, meaning it matches files with the prefix of the `<file>` value (from the previous parameter). When `generator` is specified, this option designates an exact filename.

First, Atiro compiles `file.cpp` to get `file` / `file.exe`. Then it looks for all files matching `data.in`, runs the program with them as input data, outputs to `data.out`, and if `data.ans` exists, compares `data.out` to `data.ans`. When `generator` is specified, the `generator` continuously produces input data into `<data>.in`.

The optional options are as follows:

- `-c, --comp "-O2 -std=c++14"`, specify compilation options, defaulting to no compilation options.
- `-t, --time 1000`, specify a time limit in ms, defaulting to 5000.
- `-j, --judg real`, specify the comparison method as `text` for text comparison, `numb` for integer comparison, `real` for real comparison (relative error `1e-9`), or specify the Special Judge file name, defaulting to `text`.
- `-g, --grad grader`, specify the `interactor`'s filename, indicating an interaction problem.
- `-s, --solv solver`, specify the `solver`'s filename, indicating that the standard answer will be calculated by `solver` instead of being prepared in advance.
- `-m, --make maker`, specify the `generator`'s filename, which means that the `generator` will continuously produce input data into `<data>.in` to judge. In most cases, this needs to be used in conjunction with the `solver`, commonly referred to as "challenge checking."
- `-a, --allj`, force all data to be tested; if this option is not used, testing will stop when the first evaluation result other than `Accepted` appears. When the `generator` is specified, this implies that the "challenge checking" process will continue until the program is manually terminated.

Here is a simple example for the judging command: [https://github.com/Sukwants/Atiro-examples](https://github.com/Sukwants/Atiro-examples)

#### Judging-assisting Programs

The judging-assisting programs Atiro supports are `checker`, `interactor`, `solver`, and `generator`. We suggest using `testlib.h` ([GitHub project address](https://github.com/MikeMirzayanov/testlib)) except for `solver`, but Atiro does not include `testlib.h`, so you need to download it yourself. Or you can also choose to deal with the parameters and files yourself.

The judging-assisting programs' compilation options are the same as the answer program's. `solver`'s running time limit is the same as the answer program's, and the others don't have a time limit.

- `checker`, supports `testlib.h`, specified using the `--judg` option. If `testlib.h` is not used, pass 3 parameters: `<input file>`, `<output file>`, and `<answer file>` when calling, corresponding to the `.in` file, `.out` file, and `.ans` file respectively. The program should report the evaluation result, returning `0` when the result is accepted and non-`0` when there exists an error.
- `interactor`, supports `testlib.h`, specified using the `--grad` option. If `testlib.h` is not used, pass 2 parameters: `<input file>` and `<output file>` when calling, corresponding to the `.in` file and `.ans` file respectively. And you need to connect the interactor's input and output with the answer program's output and input. The program should return `0` when the interaction is correct and non-`0` when there exists an error.
- `solver`, specified using the `--solv` option. It reads data from the `.in` file and outputs into the `.ans` file. The program should return `0` when the interaction is correct, and returning non-`0` will be judged as `Runtime Error`. Normally, please write `solve` in the format of an answer program.
- `generator`, supports `testlib.h`, specified using the `--make` option. If `testlib.h` is not used, pass 2 parameters: `<data number>` and `<seed>`. `<data number>` represents the test case number, and `<seed>` is a random string of length 10, which are also provided in the title line of the console for the test case. The generated data is output to the standard output stream. The program's return value is not processed, but it's still recommended to have a return value of 0.

### OJ Tools

```bash
$ atiro <oj> login|i | logout|o | get|g <id> [file] | submit|s [file] [id]
```

Log in to or log out from OJs, pull problem samples from OJs, or submit answers to OJs at Atiro.

The  `<oj>` option can be `codeforces|cf`, `atcoder|at`, `luogu|lg` or `vjudge|vj`.

**A simple example is as follows:**

```bash
$ atiro lg i                             # log in to Luogu at Atiro
```

```bash
$ atiro vj o                             # log out from Luogu at Atiro
```

```bash
$ atiro cf g https://codeforces.com/contest/1/problem/A
# pull samples of Codeforces problem 1A, the filename is TEST
```

```bash
$ atiro cf g https://codeforces.com/contest/1
# pull samples of all the problems from Codeforces contest 1, the filename is the problem's id
```

```bash
$ atiro at s C https://atcoder.jp/contests/arc100/tasks/arc100_a
# submit C.cpp to AtCoder problem ARC100A
```

**Specific explanations are provided below:**

`<oj>`, which specifies the Online Judge platform, currently supports Codeforces (`codeforces|cf`), AtCoder (`atcoder|at`), Luogu (`luogu|lg`), and vjudge (`vjudge|vj`).

The optional commands:

- `login|i`, log in to OJs. Pulling samples of problems with permissions or submitting answers requires logging into OJs at Atiro.
- `logout|o`, log out from OJs.
- `get|g <id> [file]`, pull samples of a problem or all the problems of a contest. `<id>` can be the problem or contest url or id. `[file]` can be used to specify the filename when pulling samples of a single problem, or it defaults to `TETS`. Note that pulling samples of all the problems of a contest does not apply to vjudge.
- `submit|s [file] [id]`, submit the answer, `[file]` is the answer program's filename, which defaults to the global default filename, and `[id]` is the problem's url or id.

The problem or contest ids mentioned above are in the form of `1A`, `1` for Codeforces, `"arc100 a"`, `arc100` for AtCoder, `P1004`, `1`, `"P1004 1"` (contest submissions) for Luogu, and `CodeForces-1A` for vjudge.

### Config

```bash
$ atiro config|c <key> [-g, --get] [-s, --set <value>] [-u, --unset]
```

Set the user configuration.

**A simple example is as follows:**

```bash
$ atiro c file.name --get                    # Get the current configuration value of the default answer program filename
```

```bash
$ atiro c judge.comp --set "-O2 -std=c++14"  # set the default compilation option to "-O2 -std=c++14"
```

```bash
$ atiro c judge.time --unset                 # clear the default time limit settings
```

**Specific explanations are provided below:**

`key` specifies the configuration item on which the operation is to be performed.

The optional operations are as follows:

- `-g, --get`, get the current value of the configuration item.
- `-s, --set <value>`, sets the configuration item value to `value`.
- `-u, --unset`, set the configuration item value to null (using the default value).

The available configurations are as follows:

- `compiler.path`, compiler path, can be ignored if g++ is globally accessible.
- `file.name`, the default file name, i.e., the `file` parameter of the `judge` command.
- `judge.comp`, the default compilation option, i.e., the `comp` option of the `judge` command.
- `judge.time`, the default time limit, i.e., the `time` option of the `judge` command.
- `judge.judge`, the default comparison method or `checker`, i.e., the `judg `option of the `judge` command.
- `judge.grad`, the default `interator`, i.e., the `grad` option of the `judge` command.
- `judge.solv`, the default `solver`, i.e., the `solv` option of the `judge` command.
- `judge.make`, the default `generator`, i.e., the `make` option of the `judge` command.
- `update.type`, the automatic detection mode for updating versions.

### Update

```bash
$ atiro update|u [notice|n | ignore|i]
```

Detect and update Atiro, or set the automatic detection mode for updating versions.

- `atiro update`, detect and update Atiro.
- `atiro update type`, check the current automatic detection mode for updating versions, either `notice` or `ignore`.
- `atiro update notice`, set the automatic detection mode for updating versions to `notice`, which will automatically check for updates every 48 hours. This is the default mode.
- `atiro update ignore`, set the automatic detection mode for updating versions to `ignore`, which will ignore update notifications.

You can also use the `config` command to check and modify the `update.type` configuration option, which can be set to `notice` or `ignore`.

## Uninstallation

Uninstall Atiro using npm as you did when installing it.

```bash
$ npm uninstall -g Atiro
```

Uninstall Node.js if you no longer need it.

Uninstall g++ if you no longer need it.

## Thanks

[![Sukwants](https://avatars.githubusercontent.com/u/95968907?s=64&v=4)](https://github.com/Sukwants) [![zhangyt](https://avatars.githubusercontent.com/u/115882588?s=64&v=4)](https://github.com/zzhangyutian) [![赵悦岑](https://avatars.githubusercontent.com/u/96607031?s=64&v=4)](https://github.com/2745518585)
