---
title: WSL2でArchを使う
date: 2023-03-26T17:43:00.000Z
author: ぎがへるつ
---

# WSL2でArchを使う
おはようございます。ぎがへるつというハンネでいろんなとこに出没してる者です。  
僕はArch使いなのですが、WSL2でもArchってあるのかな？と調べてみたところあるにはあるもののなんか手順がややこしかったのでまとめてみることにしました。かなり拙い文章ですがそのへんは我慢していただけると嬉しいです。

## 何故Arch?
Ubuntuでよくね？と思ったそこのあなた。~~あなたはまだステージが低いです。~~  
Archを使うメリットはたくさんあるのですがこの余白はそれを書くには狭すぎるし使っていくことでメリットを実感できると思ってるのでまず使ってみてください

## はじめに
まず弊部の[WSLセットアップガイド](https://d3bu.net/docs/wsl2-setup/)を読んでWSL2を有効化しといてください。  

## ダウンロードとインストール
[GitHub](https://github.com/yuk7/ArchWSL/releases/tag/22.10.16.0)から`Arch.zip`を落としてそれを適当なディレクトリに解凍しときます。  
中に入ってる`Arch.exe`を起動して放置し、緑色の文字が出てくれば成功です。あとはEnter押して閉じときましょう。

## デフォルトターミナルの設定
Windows Terminalが入っていればエクスプローラで`Arch.exe`の入ってるディレクトリで右クリックすると`ターミナルで開く`というものが出てくるのでそれを押して```.\Arch.exe config --default-term wt``` と入力します。  
これをやった後に```.\Arch.exe get --default-term```と入力し`wt`と出てくればOKです。  
Windows Terminalが入ってなければ[ここ](https://www.microsoft.com/store/productId/9N0DX20HK701)から落として上記の内容をやってください。

## Windows Terminal側の設定
Windows Terminalを再起動しタブのとこの`ˇ`を押すと恐らく`Arch`というプロファイルが出てくるかと思いますがそれは***起動せずに***設定を選び左のバーのペンギン(Tuxくんといいます)のアイコンを選んで下の方にスクロールし`プロファイルの削除`というとこを押して消します。  
次に+ボタンを押し`新しい空のプロファイル`を選び名前を適当に`Arch`とかに変えコマンドラインというとこに`Arch.exe`のパスを入力してやります(`参照…`いうとこを押せば簡単に設定できます)。  
これで`ˇ`を押して`Arch`を選ぶとArchが起動します。

## gpg鍵の設定
Archが起動したら
```
# pacman-key --init
# pacman-key --populate
# pacman -Syy archlinux-keyring
# pacman -Syyu
```  
を実行します。(#は入力しなくていいです。というか入力すると動きません。)  

## ユーザの作成
以下を実行します。(`hoge`のところは各自好きな名前に変えてください。)
```
# useradd -m -G wheel hoge
# passwd hoge
# EDITOR=vim visudo
```  
```EDITOR=vim visudo```を実行するとvimが立ち上がるので`# %wheel ALL=(ALL:ALL) NOPASSWD: ALL`という行の先頭の#を外してあげましょう(カーソルを合わせてxを入力すると消える)。あとはShiftを押しながらZを2回入力すると出られます。  
出られたら`exit`と入力し一度Archから出ましょう。  

## デフォルトユーザの設定
[デフォルトターミナルの設定](#デフォルトターミナルの設定)のときと同じようにArch.exeのあるディレクトリまで行き  
```
.\Arch.exe config --default-user hoge
```  
を実行します(hogeは各自(ry))。

## 仕上げ
またまたArchを起動し今度はsudoの設定がちゃんとできてるかの検証も含めて  
```
$ sudo pacman -S git wget base-devel
```  
を実行しましょう($の扱いは上の#と同じ)。  
完了したら[ここ](https://qiita.com/yamader/items/11f114a22f73e3aab502#%E5%B0%8E%E5%85%A5%E6%96%B9%E6%B3%95)を見てyayを入れときましょう。yayを使うとパッケージのインストールがめっちゃ楽になります(使い方はさっきのページの上の方に書いてあります)。  
これでひととおり使うのに必要な作業は終わりなのですが下記の内容もやっとくと幸せになれる確率が高くなります。

## 余談的な
幸せになりたい方向け。  
```
$ yay -S fish
$ fish
```  
を実行しfishに入ります。  
```
$ chsh -s /bin/fish
```  
を実行することでデフォルトのシェルがfishになります。やると幸せになれるかもしれないのでやっときましょう。  

### 見た目をかっこよく。  
```
$ curl https://git.io/fisher --create-dirs -sLo ~/.config/fish/functions/fisher.fish
$ fisher install oh-my-fish/theme-bobthefish
```  
これで見た目が変わりますがなんか文字化けしてると思います。文字化けしてたら[これ](https://github.com/powerline/fonts)を落として解凍し中にある`SourceCodePro`というディレクトリの.otfファイルを全て選び右クリックしてインストールを選びインストールします。  
一旦Windows Terminalを落としもう一度起動させタブのとこの`ˇ`を押し設定をクリックし設定画面を開きます。Archのプロファイルを選び追加の設定の外観というとこを開くとフォントフェイスというとこがあるのでそこで`Source Code Pro for Powerline`というものを選び保存を押して保存しときます。  
またまたまたArchを開くとちゃんと文字化けが直ってると思います。  
### fishを弄ろう  
```
$ yay -S python3
$ fish_config
```  
を実行するとブラウザが立ち上がって変なページが出てくると思います。ここで好きなテーマを選び上の`Set Theme`を押すとfishに反映されます。おすすめは`ayu Dark`です。  
  
これでこの記事は終わりです。おつかれさまでした。あとは煮るなり焼くなり~~rm -rf --no-preserve-root /を実行するなり~~お好きにどうぞ。