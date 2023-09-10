[zh-CN](./README.md) | [en-US](./README_en-US.md) | [ru-RU](./README_ru-RU.md) | ja-JP

# Atiro

AtiroはUseless OI Toolsです。Atiroはローカルコードをコンパイルし実行し、ローカルサンプルを評価します。

## 目次

- [インストール](#インストール)
- [クイックスタート](#クイックスタート)
- [使用法](#使用法)
  - [ジャッジ](#ジャッジ)
  - [OJツール](#ojツール)
  - [設定](#設定)
  - [アップデート](#アップデート)
- [アンインストール](#アンインストール)
- [ありがとう](#ありがとう)

## インストール

Atiroを使用する前に、コンピュータに以下のソフトウェアがインストールされていることを確認してください：

- [Node.js](https://nodejs.org/)

Node.jsがインストールされたら、次のコマンドでAtiroをインストールできます：

```bash
$ npm install -g atiro
```

すでにAtiroをインストールしている場合は、次のコマンドで更新できます：

```bash
$ npm update -g atiro
```

Atiroが正常に動作するためには、C++コンパイラg++をコンピュータにインストールし、コマンドラインからグローバルに呼び出せるようにする必要があります。Windowsコンピュータの場合、次のコマンドを使用してg++プログラムのパスを指定できます：

```bash
$ atiro config compiler.path --set <path/to/g++>
```

これはコンパイルに必要です。

## クイックスタート

Atiroをすぐに使い始めたい場合は、次の基本的な手順があります：

1. 答えのプログラムを書きます（例：`A.cpp`）。

2. 以下のコマンドを使用して評価します：

```bash
$ atiro judge A
```

これにより、`A.cpp`がコンパイルされ、デフォルトのサンプルデータファイル名規則（`A*.in` / `A*.ans`）を使用して実行および評価されます。

## 使用法

**Atiroは答えのプログラムと評価ヘルパープログラムに制限を設けていませんが、これらのプログラムを信頼し、ローカルまたはオンラインの評価システムで使用しないでください。**

### ジャッジ

```bash
$ atiro judge|j [file] [data] [options]
```

コードをコンパイルし、各サンプルデータセットを実行して評価します。

**簡単な例は次のとおりです：**

```bash
$ atiro j               # TEST.cppをコンパイルし、実行および評価します。データはTEST*.in / TEST*.ansです。
```

```bash
$ atiro j A             # A.cppをコンパイルし、実行および評価します。データはA*.in / A*.ansです。
```

```bash
$ atiro j A-std A*      # A-std.cppをコンパイルし、実行および評価します。データはA*.in / A*.ansです。
```

**詳細については以下をご覧ください：**

`file`は答えのプログラムファイル名を指定し、デフォルト値は`TEST`です。

`data`はサンプルデータファイル名を指定し、`generator`を指定しない場合、これはワイルドカード式のデフォルト値です。`<file>`（前述のパラメータ）をプレフィックスとして使用します。`generator`を指定する場合、このオプションは正確なファイル名を指定します。

最初に`<file>.cpp`をコンパイルして`<file>` / `<file>.exe`を取得し、すべての`<data>.in`ファイルを検索して入力データとして実行し、`<data>.out`に出力します。`<data>.ans`が存在する場合、`<data>.out`と`<data>.ans`を比較します。`generator`を指定する場合、`generator`によって連続して入力データが`<data>.in`に生成されます。

オプション：

- `-c, --comp "-O2 -std=c++14"`：コンパイルオプションを指定します。デフォルトではコンパイルオプションは指定されていません。
- `-t, --time 1000`：時間制限を指定します（単位はミリ秒）。デフォルトは`5000`です。
- `-j, --judg real`：比較方法を指定します。`text`はテキスト比較、`numb`は整数比較、`real`は実数比較（相対誤差`1e-9`）。また、`checker`ファイル名を指定することもできます。デフォルトは`text`です。
- `-g, --grad grader`：`interactor`ファイル名を指定します。これは対話型の問題です。デフォルトは`text`です。
- `-s, --solv solver`：`solver`ファイル名を指定します。これは正解が事前に用意されず、`solver`によって計算されることを意味します。

- `-m, --make maker`：`generator`ファイル名を指定します。これは連続してデータを生成するために使用され、通常は`solver`と一緒に使用されます（これは中国語の文脈で「対拍」とも呼ばれます）。
- `-a, --allj`：すべてのデータを強制的にテストします。このオプションを使用しない場合、テストの最初の評価が`Accepted`でない場合、次のデータのテストを停止します。`generator`を指定する場合、これは「対拍」が続行され、プログラムを手動で終了するまで続行されます。

こちらに上記のコマンドに関する簡単な例があります：[https://github.com/Sukwants/Atiro-examples](https://github.com/Sukwants/Atiro-examples)

#### 評価ヘルパープログラム

Atiroがサポートする評価ヘルパープログラムには`checker`、`interactor`、`solver`、`generator`があります。`solver`を除き、`testlib.h`を使用することをお勧めします（[GitHubプロジェクトのリンク](https://github.com/MikeMirzayanov/testlib)）。Atiroは`testlib.h`を組み込んでいないため、自分でダウンロードするか、パラメータとファイルを自分で処理することができます。

評価ヘルパープログラムのコンパイルオプションは答えのプログラムのコンパイルオプションと一致し、`solver`を除き、実行時間制限は設定されません。`solver`の実行時間制限は答えのプログラムの実行時間制限と一致します。

- `checker`：比較プログラムです。`testlib.h`をサポートしており、`--judg`オプションで指定します。`testlib.h`を使用しない場合、呼び出し時に3つのパラメータ`<input file>`、`<output file>`、`<answer file>`を渡します。それぞれ`.in`ファイル、`.out`ファイル、`.ans`ファイルに対応します。プログラムは評価結果を自分で報告する必要があり、評価結果が`Accepted`の場合には`0`を返し、それ以外の場合には`0`以外を返す必要があります。
- `interactor`：対話プログラムです。`testlib.h`をサポートしており、`--grad`オプションで指定します。`testlib.h`を使用しない場合、呼び出し時に2つのパラメータ`<input file>`、`<output file>`を渡します。それぞれ`.in`ファイル、`.out`ファイルに対応します。インタラクターの入出力を答えのプログラムの出力と入力に接続します。プログラムは対話が正常に終了した場合には`0`を返し、対話にエラーがある場合には`0`以外を返します。
- `solver`：ソルバープログラムです。`--solv`オプションで指定します。`.in`ファイルからデータを読み取り、`.ans`ファイルに出力します。プログラムは対話が正常に終了した場合には`0`を返し、それ以外の場合は`Runtime Error`と判定されます。通常、`solver`は答えのプログラムの形式に書かれることをお勧めします。
- `generator`：ジェネレータープログラムです。`testlib.h`をサポートしており、`--make`オプションで指定します。`testlib.h`を使用しない場合、呼び出し時に2つのパラメータ`<data number>`、`<seed>`を渡します。`<data number>`はテストポイントの番号で、`<seed>`は長さが10のランダムな文字列です。データは標準出力に出力されます。プログラムの戻り値は処理されませんが、0を返すことをお勧めします。

### OJツール

```bash
$ atiro <oj> login|i | logout|o | get|g <id> [file] | submit|s [file] [id]
```

AtiroでOJにログインまたはログアウトし、OJから問題サンプルを取得したり、OJに答えを提出したりします。

`<oj>`オプションは`codeforces|cf`、`atcoder|at`、`luogu|lg`、`vjudge|vj`から選択できます。

**簡単な例は次のとおりです：**

```bash
$ atiro lg i                             # 洛谷にログインします
```

```bash
$ atiro vj o                             # vjudgeからログアウトします
```

```bash
$ atiro cf g https://codeforces.com/contest/1/problem/A
# Codeforcesの問題1Aのサンプルを取得します。ファイル名はTESTです
```

```bash
$ atiro cf g https://codeforces.com/contest/1
# Codeforcesコンテスト1のすべての問題のサンプルを取得します。ファイル名は問題番号です
```

```bash
$ atiro at s C https://atcoder.jp/contests/arc100/tasks/arc100_a
# C.cppをAtCoderの問題ARC100Aに提出します
```

**詳細については以下をご覧ください：**

`<oj>`はオンラインジャッジプラットフォームを指定し、現在、Codeforces（`codeforces|cf`）、AtCoder（`atcoder|at`）、洛谷（`luogu|lg`）、vjudge（`vjudge|vj`）をサポートしています。

利用可能なコマンド：

- `login|i`：OJにログインし、権限のある問題のサンプルを取得したり、答えを提出したりするためには、AtiroでOJにログインする必要があります。
- `logout|o`：OJからログアウトします。
- `get|g <id> [file]`：指定した問題または指定したコンテストのすべての問題のサンプルをローカルに取得します。`<id>`は問題またはコンテストのURLまたはIDで、単一の問題のサンプルを取得する場合は`[file]`でファイル名を指定できます。そうでなければ`TEST`になります。注意：vjudgeにはコンテストのすべての問題のサンプルを取得するオプションは適用されません。
- `submit|s [file] [id]`：答えを提出します。`[file]`は答えプログラムの名前を指定し、デフォルトはグローバルなデフォルトファイル名です。`[id]`は問題のURLまたはIDです。

前述の問題またはコンテストのIDは、Codeforcesの`1A`、`1`、AtCoderの`"arc100 a"`、`arc100`、洛谷の`P1004`、`1`、`"P1004 1"`（コンテスト提出）、vjudgeの`CodeForces-1A`などの形式です。

### 設定

```bash
$ atiro config|c <key> [-g, --get] [-s, --set <value>] [-u, --unset]
```

ユーザー設定を設定します。

**簡単な例は次のとおりです：**

```bash
$ atiro c file.name --get                    # デフォルトの答えプログラムの現在の設定値を取得します
```

```bash
$ atiro c judge.comp --set "-O2 -std=c++14"  # デフォルトのコンパイルオプションを"-O2 -std=c++14"に設定します
```

```bash
$ atiro c judge.time --unset                 # デフォルトのタイムリミット設定をクリアします
```

**詳細については以下をご覧ください：**

`key`は操作対象の設定項目を指定します。

可能な操作：

- `-g, --get`：設定項目の現在の値を取得します。
- `-s, --set <value>`：設定項目の値を`value`に設定します。
- `-u, --unset`：設定項目の値を空に設定します（デフォルト値を使用）。

利用可能な設定項目：

- `compiler.path`：コンパイラのパス。g++をグローバルに呼び出すことができる場合、無視できます。
- `file.name`：グローバルデフォルトファイル名。`judge`コマンドの`file`パラメータ、OJツールのデフォルトの取得ファイル名、デフォルトの提出ファイル名を含みます。
- `judge.comp`：デフォルトのコンパイルオプション、つまり`judge`コマンドの`comp`オプションです。
- `judge.time`：デフォルトの時間制限、つまり`judge`コマンドの`time`オプションです。
- `judge.judg`：デフォルトの比較方法/`checker`、つまり`judge`コマンドの`judg`オプションです。
- `judge.grad`：デフォルトの`interactor`、つまり`judge`コマンドの`grad`オプションです。
- `judge.solv`：デフォルトの`solver`、つまり`judge`コマンドの`solv`オプションです。
- `judge.make`：デフォルトの`generator`、つまり`judge`コマンドの`make`オプションです。
- `update.type`：更新バージョンの自動検出モード。

### アップデート

```bash
$ atiro update|u [type|t | notice|n | ignore|i]
```

Atiroを検出して更新するか、更新バージョンの自動検出モードを設定します。

- `atiro update`：Atiroを検出して更新します。
- `atiro update type`：現在の更新バージョンの自動検出モードを取得します。`notice`または`ignore`です。
- `atiro update notice`：更新バージョンの自動検出モードを`notice`に設定します。

更新バージョンが利用可能な場合、通知されますが、強制的にインストールされません。
- `atiro update ignore`：更新バージョンの自動検出モードを`ignore`に設定します。更新バージョンが利用可能でも、通知されずに自動的にインストールされません。

また、`config`コマンドを使用して`update.type`設定オプションをクエリおよび変更することもできます。このオプションは`notice`または`ignore`に設定できます。

## アンインストール

Atiroをインストールしたときと同じ方法で、npmを使用してAtiroをアンインストールします。

```bash
$ npm uninstall -g Atiro
```

Node.jsが不要になった場合は、Node.jsをアンインストールします。

g++が不要になった場合は、g++をアンインストールします。

## ありがとう

[![Sukwants](https://avatars.githubusercontent.com/u/95968907?s=64&v=4)](https://github.com/Sukwants) [![zhangyt](https://avatars.githubusercontent.com/u/115882588?s=64&v=4)](https://github.com/zzhangyutian) [![赵悦岑](https://avatars.githubusercontent.com/u/96607031?s=64&v=4)](https://github.com/2745518585)
