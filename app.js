const express = require('express');
const mysql = require("./mysql");
const app = express();
const config = require("./app.config.json");
let mysqlConn = new mysql(config.host, config.id, config.pass, config.database);

app.get("/test", async(req,res)=>{
    console.log(req);
    let name = "asd";
    let age = 1;
    let first = 10;
    let second = 20;
    let third = 30;
    let total = 60
    mysqlConn.query(`INSERT INTO 
                        inspect_result(name, age, first, second, third, total)
                        VALUES('${name}', '${age}', '${first}', '${second}', '${third}', '${total}')`);
    res.send("complete!");
});

app.post('/upload', async(req, res)=>{
    console.log(req);
    res.send('Hello World!')
});
app.listen(3000, () => console.log('Node.js app listening'));