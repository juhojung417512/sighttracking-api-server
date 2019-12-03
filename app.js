const express = require('express');
const bodyparser = require("body-parser");
const mysql = require("./mysql");
const fs = require("fs");
const ejs = require("ejs");
const app = express();
const config = require("./app.config.json");
let mysqlConn = new mysql(config.host, config.id, config.pass, config.database);

app.use(express.static(__dirname + '/public'));
app.set("views", __dirname +  "/views");
app.set("view engine", "ejs");
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended : false }));

app.get("/status", async (req,res) => {
    let sort_type = req.query.type;
    let order_type = req.query.order;
    let data = await mysqlConn.query(`SELECT * FROM inspect_result ORDER BY ${sort_type} ${order_type}`);
    res.render("test",{
        data : data
    });
});

app.get("/", (req,res)=>{
    res.send("hello?");
});

app.get("/test", async(req,res)=>{
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
    mysqlConn.query(`INSERT INTO 
                    inspect_result(name, age, first, second, third, total)
                    VALUES(
                        '${req.body.name}', 
                        '${req.body.age}', 
                        '${req.body.first}', 
                        '${req.body.second}', 
                        '${req.body.third}', 
                        '${req.body.total}')`);
    res.send('COMPLETE!!');
});
app.listen(3000, () => console.log('Node.js app listening'));