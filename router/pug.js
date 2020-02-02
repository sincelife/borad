const express = require('express');
const router = express.Router();
const datetime = require('date-time');
const { pool, sqlErr } = require('../modules/mysql-conn');
const { upload } = require('../modules/multer-conn');

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
			for(let v of result[0]){
				if(v.realfile)
					v.fileIcon = true;
			}
			const resultData = result[0].map((v)=>{
				v.wdate = datetime({date: v.wdate});
				return v;
			});
			vals.lists = resultData;
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
	console.log(req.header["x-forwarded-for"]);
	let id = req.params.id;
	const connect = await pool.getConnection();

	let sql ="UPDATE board SET rnum = rnum + 1 WHERE id = " + id;
	let result = await connect.query(sql);
	
	sql = "SELECT * FROM board WHERE id="+id;
	result = await connect.query(sql);

	vals.data = result[0][0];
	connect.release();
	if(vals.data.realfile){
		let file = vals.data.realfile.split("-");
		let filepath = "/uploads/" + file[0] + "/"+vals.data.realfile;
		vals.data.filepath = filepath;
		let img = ['.jpg','.jpeg','.gif','.png'];
		let ext = path.extname(vals.data.realfile).toLowerCas();
		if(img.indexOf(ext) > -1) vals.data.fileChk = "img";
		else vals.data.fileChk = "file";
	}else{
		vals.data.fileChk = "";
	}
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

router.post("/create", upload.single("upfile"), async (req, res) => {
	let oriFile='';
	let realFile='';
	if(rea.file){
		oriFile=req.file.originalname;
		realFile=req.file.fieldname;
	}
	let sql = "INSERT INTO board SET title=?, writer=?, wdate=?, content=?, orifile=?, realfile=?";
	let val = [req.body.title, req.body.writer, new Date(), req.body.content, oriFile, realFile];

	const connect = await pool.getConnection();
	const result = await connect.query(sql, val);
	//req.fileUploadChk;
	connect.release();
	res.redirect("/pug");
});

router.get("/download/:id", async (req,res) =>{
	let id = req.params.id;
	let sql = "SELECT realfile, orifile FROM board WHERE id="+id;

	const connect = await pool.getConnection();
	const result = await connect.query(sql);
	connect.release();
	let filepath = path.join(__dirname, "../upload", result[0][0].realfile.split("-")[0]);
	let file = filepath + "/" + result[0][0].realfile;
	res.download(file, result[0][0].orifile);
})
module.exports = router;