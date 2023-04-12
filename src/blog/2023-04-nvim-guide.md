---
title: Neovim クイックスタートガイド
date: 2023-04-12T21:30:00.000Z
dateUpd: 2023-04-12T21:30:00.000Z
author: Mido (仮)
---

TODO: Write the clear todo

## はじめに

最近の [Neovim](https://github.com/neovim/neovim) の進化は凄まじく、changelog に含まれる新機能も、最近のエディターに必要とされるようなリッチな機能が増えてきました。  
今回は、そんな Neovim を他のエディターに負けないようなオリジナルの PDE (Personal Development Environment) にするために、Neovim の設定（特に$XDG_CONFIG_HOME/nvim直下）のガイドを紹介します。

このガイドでは、設定の優先順位を次の４つで分類しています。
また、設定には通常の API を通した設定、およびプラグインの設定が含まれます。
Neovim の推奨バージョンは>= 0.9です。

1. Must-have: Neovim 本体の利便性に深く関わる機能。DX を間違いなく向上させる。
2. Recommended: 必ずとまではいかないが、設定を推奨する機能。多くの場面で DX の向上につながる。
3. IDE-like Features: ほとんどのIDEやビジュアルエディターについている機能についての設定。人によって好みが分かれることが多い。（ex. ファイルツリー）
4. Optional: 必要な人のみ使うべき設定。

[早く設定をしたい人向けリンク](#設定)

## Neovim は何ができるようになったか

Neovim は Vim のフォークであり、数年前に分かれてから、良くも悪くも非常に多くの機能が追加されました。
ここでは、Neovim について知ってもらうために、その中でも特に大きな機能を個人的に紹介します。

### 設定ファイルは VimScript から Lua へ

- 最初の実装: [Neovim 0.5](https://github.com/neovim/neovim/releases/tag/v0.5.0)

従来は$XDG_CONFIG_HOME/nvim/init.vimのみが設定ファイルのエントリーポイントでしたが、Neovim 0.5 で [LuaJIT](https://luajit.org) による初の$XDG_CONFIG_HOME/nvim/init.luaのサポートが追加されました。
それ以降の多くの変更により、カラースキームやプラグイン、[ファイルタイプ検出スクリプト](https://github.com/neovim/neovim/pull/16600)にも Lua が使用されるようになり、速度と言語機能の大幅な強化が達成できました。
直近での Neovim の起動速度を上げるほとんどのテクニックも [Lua ありきのものであり](https://github.com/lewis6991/impatient.nvim)、*Lua の API を使用しないと設定できない項目*（vim.keymap.set(mode, keymap, opts)でのopts内のdescの設定など）も作られるようになっています。

また、Neovim の Lua には [luv](https://github.com/luvit/luv) と呼ばれる [libuv](https://libuv.org) のバインディングがビルトインで搭載されています（vim.loopからアクセス可能）。正しく非同期IOをすればvim.fn直下でアクセス可能な Vim 時代のIO関連の関数よりも高速な動作が期待できます。luv をラップした API も Neovim 向けに多く作られているようです（ex. [vim.defer_fn](https://neovim.io/doc/user/lua.html#vim.defer_fn())）

しかし、Lua はランタイムのバージョンによって API の変更が顕著で、Lua について学ぶ際には注意しなければならないこともいくつかあります。  
例えば、unpack()は Lua の[テーブル](https://ja.m.wikibooks.org/wiki/Lua/%E3%83%86%E3%83%BC%E3%83%96%E3%83%AB)の内容を単純な値のリストであるタプルとして返すために使われるグローバル関数ですが、Lua 5.2 以降ではこの関数はtable.unpack()に変更されています。Lua を使うときには、どのバージョンの Lua を使用しているかをよく理解しておく必要があります。  
なお、LuaJIT は Lua 5.1 相当で実装されています。（そのためunpack()を使用しなければなりません）

### ネイティブ LSP クライアントの実装

- 最初の実装: [Neovim 0.5](https://github.com/neovim/neovim/releases/tag/v0.5.0)

以前にも LSP サーバーを使用する方法として [coc.nvim](https://github.com/neoclide/coc.nvim) がありましたが、Neovim 0.5 から [Lua の API](https://neovim.io/doc/user/lsp.html) を通してネイティブで LSP サーバーを使用できるようになりました。
Lua サポートと合わせてこの機能の実装は非常に注目を集め、Neovim LSP 対応のプラグインが多く作成されるようになりました。

### Neovim Python/Node/Ruby/Perl プロバイダーの実装

この機能は Lua の実装により最近はあまり日の目を見ない機能になっていますが、個人的には無限の可能性を秘めた機能だと思っています。
各言語で主流なライブラリの種類も異なるため、様々なリッチなプラグインが作られました。coc.nvim も Node.js プロバイダーを使用したプラグインの一つです。  
特に完成度では最強格と言えたのは [wilder.nvim](https://github.com/gelguy/wilder.nvim) です。コマンドモードでの補完をとても強化するプラグインですが、一部の fuzzy search やそのハイライティングなどに Python プロバイダーが使用されます。見た目はもちろん、API の完成度もとても素晴らしいものです。リンク先READMEでのデモンストレーションを是非覗いてみてください。

## 設定

Linux x86_64 上での動作を想定しています。
