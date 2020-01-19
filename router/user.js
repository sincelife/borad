const express = require('express');
const router = express.Router();
const path = require('path');
const User = require(path.join(__dirname, "../model/User"));

router.get("/create", (req, res) => {
    let result = await User.create({
        username: req.query.username,
        userid: req.query.userid,
        age: req.query.age
    });
    res.json(result);
})

router.get("/get", (req, res) => {
    let result = await User.findAll({
        order: [["id","desc"]]
    });
    res.json(result);
})

module.exports = router;