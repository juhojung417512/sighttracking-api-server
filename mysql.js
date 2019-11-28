const _ = require('mysql2')
const mysql = require('mysql2/promise')
const fs = require("fs")

const connections = {}
class MySQL{
    constructor(host,id,pass,database){
        this.pool = mysql.createPool({
            host: host,
            user: id,
            password: pass,
            database: database,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });

        if (!fs.existsSync("./db_backup/")){
            fs.mkdirSync("./db_backup/")
        }

        (async ()=>{
            let sql = ``;
            let tables = await this.query(`SELECT table_name FROM information_schema.tables WHERE table_schema = DATABASE()`)
            for(let tb of tables){
                let create = await this.query(`SHOW CREATE TABLE ${tb["table_name"]}`);

                sql += `-- [TABLE CREATE SQL] ${tb["table_name"]}\n${create[0]['Create Table']};\n\n`
            }

            fs.writeFileSync(`./db_backup/${host}_${id}_${database}.sql`,sql)
        })()
    }

    async query(sql,args,conn = null) {
        while(1){
            let _conn = conn || await this.pool.getConnection()
            try{
                // console.log(_.format(sql,args),_conn.connection.connectionId)
                const [rows,fields] = await _conn.query(sql, args);
                conn ? null : _conn.release();
                return rows
            }catch(err){
                console.log("err.message", err.errno)
                conn ? null : _conn.release();

                if(err.errno == "ECONNRESET"){
                    await new Promise(r=>setTimeout(r,1000))
                }else{
                    throw err
                }
            }
        }
    }

    async beginTransaction(){
        let conn = await this.pool.getConnection()
        conn.beginTransaction()

        return {
            commit:async()=>{
                await conn.commit();
                await conn.release();
            },
            rollback:async()=>{
                await conn.rollback();
                await conn.release();
            },
            release :async()=>{
                await conn.release();
            },
            query:(sql,args)=>{
                return this.query(sql, args, conn)
            },
            one:(sql,args)=>{
                return this.one(sql, args, conn)
            },
        }
    }

    async one(sql, args, conn){
        let rows = await this.query(sql, args, conn)
        return rows[0]
    }

    static db(host,id,pass,database){
        let _ = `${host},${id},${pass},${database}`;
        return connections[_] || (connections[_] = new MySQL(host,id,pass,database))
    }

    format(sql,args){
        return _.format(sql,args)
    }
}

module.exports = MySQL