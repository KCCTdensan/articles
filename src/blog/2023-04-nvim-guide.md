---
title: Neovim クイックスタートガイド
date: 2023-04-12T21:30:00.000Z
dateUpd: 2023-04-12T21:30:00.000Z
author: Mido (仮)
---

TODO
- Write the clear todo
- Decide author HN ASAP
- Merge step: Update `date` and `dateUpd`
- Ask about availability of quotes or notes in the static generation

プログラミングをする人向け

## はじめに

ソースコードを書くにはエディターが必要です。
プログラミングに慣れ始めてくると、エディター自身のこともよく知るようになり、使っているうちに便利な部分・不便な部分を洗い出せるようになってくるでしょう。  
そこで、ふと思ったことはありませんか？

「他のエディターってどうなの？」

と。  

Visual Studio Code あるいは JetBrains IntelliJ IDEA など、リッチな編集環境を使用している人もいれば、
Sublime Text や適度にセットアップされた Vim など、過剰に機能が搭載されていないようなエディターを使用している人もいるかと思います。  
今回はそのような方々向けに、私から [Neovim](https://neovim.io) と呼ばれるエディターを紹介します。~~ついでに乗り換えてくだされば筆者が大喜びします~~

[Neovim](https://neovim.io) とは、[Vim](https://www.vim.org) から派生されて、さまざまな独自機能が盛り込まれたテキストエディター又はコードエディターです（未設定の状態でコードエディターと言える性能かどうかは諸説あり）。  
そのため大半の挙動や設定方法は Vim に似ていて、互換性も*ある程度*保たれていました。

最近の Neovim の進化は凄まじく、changelog に含まれる新機能も、最近のエディターに必要とされるようなリッチな機能が増えてきました。  
今までは IDE ほどの機能を有するには複雑で大きなプラグインでの機能拡張が必要で、機能が標準化されていないことから各プラグインでの独自実装が乱立するような状況になることもありました（例：[闇の力を得たプラグインシリーズ](https://github.com/Shougo/dein.vim)）。  
それが昨今の Neovim では改善の方向に進んでいるのです。それもターミナル上で動くエディターに搭載されているとは思えない機能群を連れて。  
しかしながら、Neovim（ないし Vim 系統のツール）は初期状態ではほとんど設定がされていない状態で、誰しもが必要である機能をもデフォルトで切られているオプションとして提供することもあります（それでも簡潔な編集は可能なほど質は高い状態にありますが）。  
今回は、そんな Neovim を他のエディターに負けないようなオリジナルの PDE (Personal Development Environment) にするために、Neovim の設定（特に`$XDG_CONFIG_HOME/nvim`直下）のガイドを紹介します。

このガイドでは、設定の優先順位を次の４つで分類しています。
また、設定には通常の API を通した設定、およびプラグインの設定が含まれます。
Neovim の推奨バージョンは`>= 0.9`です。

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

従来は`$XDG_CONFIG_HOME/nvim/init.vim`のみが設定ファイルのエントリーポイントでしたが、Neovim 0.5 で [LuaJIT](https://luajit.org) による初の`$XDG_CONFIG_HOME/nvim/init.lua`のサポートが追加されました。
Just In Time コンパイルにより通常の Lua ランタイムより高速に動作し、FFI やバイトコードへの先行コンパイルもサポートされています。  
Lua が登場してからは Neovim 界隈では爆発的な人気を誇るようになり、カラースキームやプラグイン、[ファイルタイプ検出スクリプト](https://github.com/neovim/neovim/pull/16600)にも Lua が使用されるようになりました。
そのような大規模な変更により、Neovim は速度と言語機能の大幅な強化が達成できたのです。  
直近での Neovim の起動速度を上げるほとんどのテクニックも [Lua ありきのものであり](https://github.com/lewis6991/impatient.nvim)、*Lua の API を使用しないと設定できない項目*（`vim.keymap.set(mode, keymap, opts)`での`opts`内の`desc`の設定など）も作られるようになっています。

> **Note**
> Neovim 0.9 から、impatient.nvim と同等の Lua バイトコードキャッシュ機能を実装する [`vim.loader`](https://github.com/neovim/neovim/pull/22668) が追加されたため、今後このプラグインを導入する必要はなくなるかもしれません。  
> そのため、実際のガイド内容からは除外しています。

また、Neovim の Lua には [luv](https://github.com/luvit/luv) と呼ばれる [libuv](https://libuv.org) のバインディングがビルトインで搭載されています（`vim.loop`からアクセス可能）。
正しく非同期IOをすれば`vim.fn`直下でアクセス可能な Vim 時代のIO関連の関数よりも高速な動作が期待できます。luv をラップした API も Neovim 向けに多く作られているようです（ex. [`vim.defer_fn()`](https://neovim.io/doc/user/lua.html#vim.defer_fn())）

しかし、Lua はランタイムのバージョンによって API の変更が顕著で、Lua について学ぶ際には注意しなければならないこともいくつかあります。  
例えば、`unpack()`は Lua の[テーブル](https://ja.m.wikibooks.org/wiki/Lua/%E3%83%86%E3%83%BC%E3%83%96%E3%83%AB)の内容を単純な値のリストであるタプルとして返すために使われるグローバル関数ですが、Lua 5.2 以降ではこの関数は`table.unpack()`に変更されています。Lua を使うときには、どのバージョンの Lua を使用しているかをよく理解しておく必要があります。
なお、LuaJIT は Lua 5.1 相当で実装されています（そのため`unpack()`を使用しなければなりません）。

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
