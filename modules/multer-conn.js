const multer = require("multer");
const path = require("path");
const fs = require("fs");

const destination = (req, file, cb) => {
    cb(null, getPath());
}
const filename = (req, file, cb) => {
    cb(null, getFile(file.originalname).newName)
}
const fileFilter = (req, file, cb) => {
    let allowExt = ['.jpg','.jpeg','.gif','.png','.zip','.txt','.pdf'];
    let ext = path.extname(file.originalname).toLocaleLowerCase();
    if(allowExt.indexOf(ext) > -1){
        req.fileUploadChk = true;
        cb(null, true);
    } 
    else {
        req.fileUploadChk = false;
        cb(null, false);
    }
}
const storage = multer.diskStorage({destination,filename})
const upload = multer({storage, fileFilter});

function getPath(){
    let newPath = path.join(__dirname, "../uploads"+makePath());
    if(!fs.existsSyncn(newPath)){//존재 체크
        fs.mkdirSync(newPath);
    }
    return newPath;
}

function makePath(){
    let d = new Date();
    let year = d.getFullYear();
    let month = d.getMunth();
    return String(year).substr(2) + zp(month+1);
}

function zp(d){
    return d< 10? "0"+d : d;
}

function getFile(oriFile){
    let ext = path.extname(oriFile);
    let name = path.basename(oriFile, ext);
    let f1 = makePath();
    let f2 = Date.now();
    let f3 = Math.floor(Math.random() * 90)+10; //10~99
    return {
        newName: f1 + "-" + f2 + "-" + f3 + ext,
        newExt: ext,
        newFile: f1 + "-" + f2 + "-" + f3
    }
}
module.exports = { upload };