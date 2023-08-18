[zh-CN](./README.md) | en-CN

# Atiro

Atiro is a set of Useless OI Tools that compiles and runs local code and judges a single set of local samples.

## Installation

This application needs to be installed on your computer before installing Atiro:

- [Node.js](https://nodejs.org/)

Once Node.js is installed, you can install Atiro through the following command:

```bash
$ npm install -g atiro
```

You can update Atiro through the following command if it is already installed:

```bash
$ npm update -g atiro
```

To use Atiro normally, you need to make sure that the C++ compiler g++ has been installed on your computer and can be called globally from the command line, which is indispensable for compilation.

If g++ has been installed on Windows computer, but can't be called globally from the command line, try adding the g++ program body path to the environment variable `PATH`.

## Usage

**Atiro does not place any restrictions on the answer or judging-assisting programs, so make sure that you can trust these programs, and do not use them locally or in an online judge system.**

### Config

```bash
$ atiro config|c <key> [-g, --get] [-s, --set <value>] [-u, --unset]
```

Set the user configuration.

`key` specifies the configuration item on which the operation is to be performed.

The optional operations are as follows:

- `-g, --get`, get the current value of the configuration item.
- `-s, --set <value>`, sets the configuration item value to `value`.
- `-u, --unset`, set the configuration item value to null (using the default value).

The available configurations are as follows:

- `file.name`, the default file name, i.e. the `file` parameter of the `judge` command.
- `option.comp`, the default compilation option, i.e. the `comp` option of the `judge` command.
- `option.time`, the default time limit, i.e. the `time` option of the `judge` command.
- `option.judge`, the default comparison method or `checker`, i.e. the `judg `option of the `judge` command.
- `option.grad`, the default `interator`, i.e. the `grad` option of the `judge` command.

### Judge

```bash
$ atiro judge|j [file] [data] [options]
```

Compile the code, run it and judge the result for each set of sample.

`file`, specifies the code filename, and defaults to `TEST`.

`data`, which specifies the name of the sample data file, is a wildcard expression with a default value of `[file]*`, that is, it matches with the `file` value (the previous parameter) as a prefix.

First, Atiro compiles `file.cpp` to get `file` / `file.exe`. Then it looks for all files matching `data.in`, runs the program with them as input data and outputs to `data.out`, and if `data.ans` exists, compares `data.out` to `data.ans`.

The optional options are as follows:

- `-c, --comp "-O2 -std=c++14"`, specify compilation options, the default is to specify no compilation options.
- `-t, --time 1000`, specify a time limit in ms, default is 5000.
- `-j, --judg real`, specify the comparison way, `text` for text comparison, `numb` for integer comparison, `real` for real comparison (relative error `1e-9`), or specify the Special Judge file name, default is `text`.
- `-g, --grad grader`, specify the `interactor`'s filename, which means this is an interaction problem.
- `-a, --allj`, force all data to be tested, if this option is not used, testing will stop when the first evaluation result which is not `Accepted` appears.

#### Judging-assisting Programs

The judging-assisting programs Atiro supports are `checker` and `interactor`. We suggest using `testlib.h` ([GitHub project address](https://github.com/MikeMirzayanov/testlib)), but Atiro does not include `testlib.h`, so you need to download it yourself. Or you can also choose to deal with the parameters and files yourself.

* `checker`, supports `testlib.h`, specified using the `--judg` option. If `testlib.h` is not used, pass 3 parameters, `<input file>`、`<output file>` and `<answer file>` when calling, corresponding to the `.in` file, `.out` file and `.ans` file respectively. The program should report the evaluation result, returning `0` when the result is accepted and non-`0` when there exists an error.
* `interactor`, supports `testlib.h`, specified using the `--grad` option. If `testlib.h` is not used, pass 2 parameters, `<input file>` and `<output file>` when calling, corresponding to the `.in` file and `.ans` file respectively. And you need to  connect the interactor's input and output with the answer program's output and input. The program should return `0` when the interaction is correct and non-`0` when there exists an error.

## Uninstallation

Uninstall Atiro using npm as you did when installing it.

```bash
$ npm uninstall -g Atiro
```

Uninstall Node.js if you no longer need it.

Unistall g++ and removes it from the environment variable `PATH` if you no longer need it.

## Thanks

[![Sukwants](https://avatars.githubusercontent.com/u/95968907?s=64&v=4)](https://github.com/Sukwants) [![zhangyt](https://avatars.githubusercontent.com/u/115882588?s=64&v=4)](https://github.com/zzhangyutian) [![赵悦岑](https://avatars.githubusercontent.com/u/96607031?s=64&v=4)](https://github.com/2745518585)
