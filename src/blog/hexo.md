---
title: Hexoで爆速ブログ開設
date: 2018-12-02 16:02:08
author: ポッチャマ
---

電算部のブログがかなり管理しづらかったので、"Hexo"というサイトジェネレータを使ってリニューアルしてみました。

## Hexoとは?
node.js(サーバーサイドで動作するJavaScript)で作られたパッケージ。これを使うと、静的サイトを簡単に作ることができる。

## とにかくブログ作ってみる
- ### 環境構築
    部員はWindowsユーザーがほとんどなので、ここではWindowsでの手順のみ記述する。
    1. #### npmをインストール
        Hexoなどのnodeパッケージの管理に必要なnpm(node package manager)をインストールする。
        下記の公式サイトからNode.js/npmのインストーラがダウンロードできる。
        LTSとLatestがあるが、LTSで良いと思う。
        [node.js公式](https://nodejs.org/ja/ "node.js公式")
        ダウンロードしたインストーラーを起動し、インストール。インストール中色々聞かれるけど基本的にデフォルトでOK。
        コマンドプロンプトでNode.js、npmが使えるか確認。
        ```
        node --version
        npm --version
        ```
        バージョン情報が表示されればインストールに成功している。

    2. #### Hexo-cliのインストール
        npmを使ってHexo-cliをインストールする。
        ```
        npm install hexo-cli -g
        ```
- ### サイト作成

    1. #### プロジェクト作成
        コマンドプロンプトでプロジェクトのディレクトリを作成したい場所に移動し、下記のコマンドを実行する。
        ```
        hexo init プロジェクト名
        ```
        大量の文字列が表示され、プロジェクト名と同名のディレクトリが作成される。

    2. #### 表示させてみる
        作成したディレクトリに移動し、コマンドを実行するとリンクが表示されるのでアクセスしてみよう。
        ```
        cd プロジェクト名
        hexo server
        ```
        こんな感じのページが見れるはず。
        ![hexopage]($assets/img/hexopage.png)

- ### 使い方
    1. 記事の追加
        ```
        hexo new "ページタイトル"
        ```
        このコマンドでsource/_posts/の中にマークダウン形式のファイルが作成されるので、それを編集する。

    2. github pagesに公開
        _config.ymlを編集
        ```
        url: http://githubのユーザー名.github.io/リポジトリ名/

        ...

        deploy:
          type: git
          repo: git@github.com:ユーザー名/リポジトリ名.git #clone時のurl
          branch: gh-pages
        ```

        必要なnodeパッケージを追加でインストール
        ```
        npm install hexo-deployer-git --save
        npm install hexo-renderer-ejs --save
        ```

        hexoコマンドを実行
        ```
        hexo deploy -g
        ```

        githubのリポジトリにgh-pagesブランチが追加され、そこでデプロイされる。

ARCHIVESが404になったりHOMEのアクセス先がおかしかったりとエラーもあるが、
とりあえずこれで最低限のブログの運用ができるはず...
マークダウン形式で記事が書けるようになった。
