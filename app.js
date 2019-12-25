const express = require('express');
const bodyparser = require("body-parser");
const mysql = require("./mysql");
const fs = require("fs");
const ejs = require("ejs");
const app = express();
const config = require("./app.config.json");
let mysqlConn = new mysql(config.host, config.id, config.pass, config.database);

app.set("views", __dirname +  "/views");
app.set("view engine", "ejs");
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended : false }));

app.post("/fcmtoken", (req,res)=>{
    console.log(req.body.fcm_token);
    mysqlConn.query(`INSERT INTO 
                    fcm_tokens(user_id, token)
                    VALUES(
                        '${req.body.user_id}', 
                        '${req.body.fcm_token}')`);
    res.send("Success");
});

app.get("/testtest", async(req,res)=>{
    let inspect_result = await mysqlConn.query(`SELECT total FROM inspect_result`);
    console.log(inspect_result);
    let avg = null;
    for(var row of inspect_result){
        avg += row.total;
    }
    avg /= inspect_result.length;
    let p1 = 0;
    for(var row of inspect_result){
        p1 += avg - row.total * avg - row.total;
    }
    p1 /= inspect_result.length;
    let result = Math.sqrt(p1);
    
    res.send(result);
});

app.get("/status", async (req,res) => {
    let sort_type = req.query.type;
    let order_type = req.query.order;
    let data = await mysqlConn.query(`SELECT * FROM inspect_result`);
    if(sort_type !== undefined && sort_type !== null){
        data = await mysqlConn.query(`SELECT * FROM inspect_result ORDER BY ${sort_type} ${order_type}`);
    }
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