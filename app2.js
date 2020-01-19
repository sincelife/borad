const express = require('express');
const methodOverride = require('method-override');
const multer = require('./modules/multer-conn');
const app = express();
const port = 3000;
const host = '127.0.0.1';
const User = require(path.join(__dirname,"./models/User"));

app.listen(port, () => {
	console.log(`http://${host}:${port}`);
});

app.set('view engine', 'pug');
app.set('views', './views');
app.use('/', express.static('./public'));
app.use('/uploads', express.static('./uploads'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.locals.pretty = true;

app.use(methodOverride((req, res) => {
	if (req.body && typeof req.body === 'object' && '_method' in req.body) {
		// look in urlencoded POST bodies and delete it
		let method = req.body._method
		delete req.body._method
		return method
	}
}))

const pugRouter = require("./router/pug");
app.use("/pug", pugRouter);

const apiRouter = require("./router/api");
app.use("/api", apiRouter);

const userRouter = require("./router/user");
app.use("/user", userRouter);
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
app.get("/sqltest", async (req, res) => {
	let sql = "INSERT INTO board SET title=?, writer=?, wdate=?";
	let sqlVals = ["제목입니다2.", "관리자2", "2020-01-05 15:55:00"];
	const connect = await pool.getConnection();
	const result = await connect.query(sql, sqlVals);
	connect.release();
	res.json(result);
});

*/
