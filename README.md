# Docker-DockerCompose-Training

## 前提

[Docker](https://www.docker.com/)、[Docker Compose](https://docs.docker.com/compose/)が動作すること

[Docker Desktop](https://www.docker.com/get-started)で可能

## すること

1. Docker で React アプリケーションをローカルにマウントし構築
   1. docker exec で接続し開発
   1. VSCode から接続し開発
1. Docker を Docker Compose で管理し用意したサンプルコードを Docker にマウントし開発
1. Docker の基本的な操作
1. Docker Compose の基本的な操作

## 1. Docker で React アプリケーションをローカルにマウントし構築

### 今回の作業ディレクトリの作成

```
$ mkdir Docker-DockerCompose-Training
$ cd Docker-DockerCompose-Training
```

### サンプルコード用ディレクトリの作成

```
$ mkdir app
```

`.gitignore`に以下を追記し管理対象から除外

```
+ app/*
```

### Dockerfile の作成

`docker/app`ディレクトリを作成し配下に[`Dockerfile`](./docker/app/Dockerfile)の作成

```
$ mkdir -p docker/app
```

### Docker イメージの確認

```
$ docker images
```

### build

`Docker-DockerCompose-Training`から実行

```
$ docker build --file=./docker/app/Dockerfile -t sample:1 .
```

### Docker イメージの確認

```
$ docker images
REPOSITORY   TAG       IMAGE ID       CREATED              SIZE
sample       1         43a2ae7ab3ee   About a minute ago   936MB
node         latest    96e42e8537de   2 days ago           936MB
```

### Docker コンテナの確認

```
$ docker ps -a
```

### Docker コンテナの起動

```
$ docker run -v `pwd`/app:/app -it -d --name sample-1 -p 3000:3000 sample:1
```

### Docker コンテナの確認

```
$ docker ps -a
CONTAINER ID   IMAGE      COMMAND                  CREATED          STATUS                     PORTS                               NAMES
54306bc7ef99   sample:1   "docker-entrypoint.s…"   29 seconds ago   Up 28 seconds              0.0.0.0:3000->3000/tcp              sample-1
```

### 1.1 docker exec で接続し開発

`docker ps -a`で確認した`CONTAINER ID`を`-it`以降に指定する

```
$ docker exec -it 54306bc7ef99 bash
```

#### ファイルの作成と確認

```
# touch hoge
# ls -la
total 8
drwxr-xr-x 2 root root 4096 Feb  8 06:20 .
drwxr-xr-x 1 root root 4096 Feb  8 06:18 ..
-rw-r--r-- 1 root root    0 Feb  8 06:20 hoge

# exit
```

#### ファイルの確認

```
$ ls -la app
total 0
drwxr-xr-x  3 miurahironori  staff   96  2  8 15:29 .
drwxr-xr-x  4 miurahironori  staff  128  2  8 15:28 ..
-rw-r--r--  1 miurahironori  staff    0  2  8 15:29 hoge
```

### 1.2 VSCode から接続し開発

#### 拡張機能のインストール

VSCode -> 拡張機能 -> [Remote Development](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.vscode-remote-extensionpack)をインストール

#### 接続

`sample:1`の横の`+`を押下後、ディレクトリ(フォルダー)の入力を聞かれた場合は`/app`を入力
![docker-01](./images/docker-01.png)

新しいウインドウで作成した Docker 環境に接続し開発ができる状態であること
![docker-02](./images/docker-02.png)

## サンプルコードの準備

```
$ mkdir docker-dockercompose
$ cd docker-dockercompose
$ npx create-react-app .
```

起動

```
$ yarn start
```

確認できたら Ctrl+C で停止

接続

```
$ docker exec -it d92f3af9a907 bash
```

確認

```
root@d92f3af9a907:/app# node -v
v15.8.0
root@d92f3af9a907:/app# ls -la
total 8
drwxr-xr-x 2 root root 4096 Feb  5 01:37 .
drwxr-xr-x 1 root root 4096 Feb  5 01:39 ..
root@d92f3af9a907:/app# exit
```

サンプルアプリの作成

```
root@d92f3af9a907:/app# npx create-react-app .
```

アプリの起動

```
$ yarn start
```

ブラウザで`http://localhost:3000`を表示し確認後、Ctrl+C で停止

### VSCode から接続

VSCode -> Remote Explorer -> Containers -> sample:1 -> ディレクトリ選択で`/app`を選択

VSCode からターミナルを開く

```
$ yarn start
```

ブラウザに`http://localhost:3000`でアプリが表示されること(Docker 側で別 PORT にリダイレクトする場合あり)

`src/App.js`内を適当に編集しセーブするとブラウザの表示が変わることを確認

`$ yarn start`を行っているターミナルを Ctrl+C で停止し VSCode を閉じる

### 掃除

確認

```
$ docker ps
CONTAINER ID   IMAGE      COMMAND                  CREATED             STATUS             PORTS                    NAMES
d92f3af9a907   sample:1   "docker-entrypoint.s…"   About an hour ago   Up About an hour   0.0.0.0:3000->3000/tcp   sample-1
```
