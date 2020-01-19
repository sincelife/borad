const express = require('express');
const router = express.Router();
const { pool, sqlErr } = require("../modules/mysql-conn");

router.get(["/", "/get", "/get/:id"], async (req, res) => {
    let sql = '';
    const vals = {
        title: "API 게시판"
    };
    const connect = await pool.getConnection();
    if(req.params.id){
        sql = "SELECT * FROM board WHERE id = "+req.params.id;
    }else{
        sql = "SELECT * FROM board ORDER BY id DESC";
    }
    const result = await connect.query(sql);
    vals.data = result[0];
    connect.release();
    res.json(vals);
});
router.post("/post", async (req, res)=>{
    const title = req.body.title;
    const content = req.body.content;
    const writer = req.body.writer;
    const wdate = new Date();
    const sql = "INSERT INTO board SET title=?, content=?, writer=?, wdate=?";
    let sqlVals = [title, content, wirter, wdate];
    let connect = await pool.getConnection();
    let result = await connect.query(sql, sqlVals);
    connect.release();
    res.json(result[0]);
});
router.put("/put", async (req, res) => {
    const id = req.body.id;
    const title = req.body.title;
    const content = req.body.content;
    const writer = req.body.writer;
    const sql = "UPDATE board SET title=?, content=?, writer=? WHERE id = ?";
    let sqlVals = [title, content, writer, id];
    let connect = await pool.getConnection();
    let result = await connect.query(sql, sqlVals);
    connect.release();
    res.json(result[0]);
});

router.delete("/delete", async (req, res) => {
    const sql = "DELETE FROM board WHERE id="+req.body.id;
    let connect = await pool.getConnection();
    let result = await connect.query(sql);
    connect.release();
    res.json(result[0]);
});

module.exports = router;