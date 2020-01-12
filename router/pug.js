const express = require('express');
const router = express.Router();
const { pool, sqlErr } = require('../modules/mysql-conn');

router.get(["/", "/:page"], async (req, res) => {
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
			connect.release();
			res.render("list.pug", vals);
			break;
		case "write":
			vals.title = "게시글 작성 입니다.";
			res.render("write.pug", vals);
			break;
		default:
			res.redirect("/pug");
			break;
	}
});

router.get("/view/:id", async (req, res) => {
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

router.get("/delete/:id", async (req, res) => {
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

router.get("/update/:id", async (req, res) => {
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

router.post("/update", async (req, res) => {
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

router.post("/create", async (req, res) => {
	let sql = "INSERT INTO board SET title=?, writer=?, wdate=?, content=?";
	let val = [req.body.title, req.body.writer, new Date(), req.body.content];
	const connect = await pool.getConnection();
	const result = await connect.query(sql, val);
	connect.release();
	res.redirect("/pug");
});
module.exports = router;