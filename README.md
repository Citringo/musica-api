# Musica API

Xeltica が制作に携わった楽曲のデータにアクセスできる，restfulなAPIの実装です．

## Requirement

- node
- npm
- mysql

## Build & Run

ここでは，

- データベース名 = xm
- ユーザー名 = xelmus
- パスワード = 12345

とし，上記のデータベースとユーザーを予め作っているものとします．

```shell
$ git clone https://github.com/citringo/musica-api
$ cd musica-api
$ npm install
$ mysql –-local-infile -u xelmus -p 12345
```

```sql
use xm;

create table music_types(id int primary key, name varchar(10));
create table clients(id int primary key, name varchar(20));
create table songs(
	number int, 
	display_id varchar(15) not null, 
	title varchar(100),
	description varchar(280),
	client_id int,
	source varchar(280),
	music_type_id int,
	is_completed boolean);

load data local infile "./csv/clients.csv" into table clients FIELDS TERMINATED BY ',' ENCLOSED BY '"';
load data local infile "./csv/music_types.csv" into table music_types FIELDS TERMINATED BY ',' ENCLOSED BY '"';
load data local infile "./csv/songs.csv" into table songs FIELDS TERMINATED BY ',' ENCLOSED BY '"';

exit
```

```shell
$ npm run start
$ vi config.json
# ここで設定を行う
$ npm run start
```

## License

[MIT License](LICENSE)
