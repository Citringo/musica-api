const reader = require("readline-sync");
const mysql = require("promise-mysql");
const config = require("./config");

const idPattern = /^(XEL|ARG)_(\d{3})([A-Z])?(?:v(\d))?$/;

var sql_config = {
  host: config.db.host,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database
};

(async () => {
	console.log("Xelica Musica Manager");
	console.log(`DB: ${config.db.database}
	User: ${config.db.user}`);

	
  	var conn = await mysql.createConnection(sql_config);

	const add = async () => {
		let idText = reader.question("IDを入力してください　");
		if (!idPattern.test(idText)) {
			console.log("IDが不正です．終了します．");
			return;
		}
		let id = idPattern.exec(idText);
		let musicType = id[1] == "XEL" ? 0 : 1;
		let number = Number(id[2]);
		let title = reader.question("タイトルを入力してください　");
		let desc = reader.question("説明を入力してください　");
		let client = reader.question("クライアントIDを入力してください　");
		let source = reader.question("元ネタを入力してください　");
		let isComp = reader.question("完成していますか(Y/N)？　") == "Y";
		let field = {
			number: number,
			display_id: idText,
			title: title,
			description: desc,
			client_id: client,
			source: source,
			music_type_id: musicType,
			is_completed: isComp
		};
		console.log(field);
		if (reader.question("上記のとおりでよろしいですか(Y/N)？") == "Y") {
			await conn.query("insert into songs set ?", field);
		} else {
			console.log("やり直してください");
		}
	};
	
	const update = async () => {
		let idText = reader.question("IDを入力してください　");
		if (!idPattern.test(idText)) {
			console.log("IDが不正です．終了します．");
			return;
		}
		let id = idPattern.exec(idText);
		
		var index = reader.keyInSelect(["タイトル", "説明", "クライアントID", "元ネタ", "完成状態"], "どれを更新しますか？");
		switch (index) {
			case -1:
				return;
			case 0:
				console.log("not implemented");
				break;
			case 1:
				console.log("not implemented");
				break;
			case 2:
				console.log("not implemented");
				break;
			case 3:
				console.log("not implemented");
				break;
			case 4:
				console.log("not implemented");
				break;
		};
	};
	
	const drop = async () => {
		console.log("not implemented");
	};
	
	const addClient = async () => {
		console.log("not implemented");
	};
	
	const dropClient = async () => {
		console.log("not implemented");
	};
	
	while (true) {
		var index = reader.keyInSelect(["データ追加", "データ更新", "データ削除", "依頼者追加", "依頼者削除"], "モードを選択してください．");
	
		if (index == -1) {
			await conn.end();
			break;
		}

		switch (index) {
			case 0:
				await add();
				break;
			case 1:
				await update();
				break;
			case 2:
				await drop();
				break;
			case 3:
				await addClient();
				break;
			case 4:
				await dropClient();
				break;
		}
	}

})();
