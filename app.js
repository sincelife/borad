const express = require('express');
const app = express();
const port = 3000;
const host = '127.0.0.1';
const { pool, sqlErr } = require('./modules/mysql-conn');

app.listen(port, () => {
	console.log(`http://${host}:${port}`);
});

app.set('view engine', 'pug');
app.set('views', './views');
app.use('/', express.static('./public'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.locals.pretty = true;

app.get(["/pug", "/pug/:page"], async (req, res) => {
	let page = req.params.page ? req.params.page : "list";
	let vals = {};
	switch(page) {
		case "list":
			vals.title = "게시글 리스트 입니다.";
			let sql = "SELECT * FROM board ORDER BY id DESC";
			const connect = await pool.getConnection();
			const result = await connect.query(sql);
			vals.lists = result[0];
			/*
			vals.lists = [
				{id:1, title: "첫번째 글", writer: "관리자", wdate: "2020-01-03", rnum: 5},
				{id:2, title: "두번째 글", writer: "관리자2", wdate: "2020-01-04", rnum: 6},
				{id:3, title: "세번째 글", writer: "관리자3", wdate: "2020-01-05", rnum: 4},
			];
			*/
			res.render("list.pug", vals);
			break;
		case "write":
			vals.title = "게시글 작성 입니다.";
			res.render("write.pug", vals);
			break;
		default:
			res.redirect("/");
			break;
	}
});

app.get("/pug/view/:id", async (req, res) => {
	let vals = {
		title: "게시글 상세 보기",
	}
	let id = req.params.id;
	let sql = "SELECT * FROM board WHERE id="+id;
	const connect = await pool.getConnection();
	const result = await connect.query(sql);
	vals.data = result[0][0];
	connect.release();
	res.render("view.png", vals);
})

app.get("/pug/delete/:id", async (req, res) => {
	let id = req.params.id;
	let sql = "delete from baord where id = " + id;
	const connect = await pool.getConnection();
	const result = await connect.query(sql);
	connect.release();
	if(result[0].affectedRows == 1){
		res.redirect("/pug");
	}else{
		res.send("삭제에 실패하였습니다.");
	}
})

app.get("/pug/update/:id", async (req, res) => {
	let vals = {
		title: "게시글 수정",
	}
	const id = req.params.id;
	const sql = "SELECT * FROM board WHERE id="+id;
	const connect = await pool.getConnection();
	const result = await connect.query(sql);
	vals.data = result[0][0];
	connect.release();
	res.render("update.pug", vals);
})

app.post("/pug/update", async (req, res) => {
	const sqlVals = [];
	const id = req.body.id;
	const title = req.body.title;
	const content = req.body.content;
	sqlVals.push(title);
	sqlVals.push(content);
	sqlVals.push(id);
	const sql = "UPDATE board SET title = ?, contnet = ? WHERE id= ?";
	const connect = await pool.getConnection();
	const result = await connect.query(sql, sqlVals);
	connect.release();
	if(result[0].changedRows==1){
		res.redirect("/pug");
	}else{
		res.send("수정에 실패하였습니다.");
	}
})
/*
app.get("/sqltest", (req, res) => {
	let connect = conn.getConnection((err, connect) => {
		if(err) {
			res.send("Database 접속에 실패하였습니다.");
		}
		else {
			let sql = ' INSERT INTO board SET title="테스트입니다.", writer="관리자", wdate="2020-01-05 14:55:00" ';
			connect.query(sql, (err, result) => {
				if(err) {
					res.send("SQL문이 실패하였습니다.");
				}
				else {
					res.json(result);
				}
			});
		}
	});
	console.log(connect);
});
*/

app.get("/sqltest", async (req, res) => {
	let sql = "INSERT INTO board SET title=?, writer=?, wdate=?";
	let sqlVals = ["제목입니다2.", "관리자2", "2020-01-05 15:55:00"];
	const connect = await pool.getConnection();
	const result = await connect.query(sql, sqlVals);
	connect.release();
	res.json(result);
});

app.post("/board", async (req, res) => {
	let sql = "INSERT INTO board SET title=?, writer=?, wdate=?, content=?";
	let val = [req.body.title, req.body.writer, new Date(), req.body.content];
	const connect = await pool.getConnection();
	const result = await connect.query(sql, val);
	connect.release();
	res.redirect("/pug");
});