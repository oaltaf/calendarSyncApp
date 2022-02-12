const {createPool} = require('mysql');

const pool = createPool({
    host: "localhost",
    port: "8889",
    user: "root",
    password: "root",
    database: "nodetest",
    connectionLimit: 10
})

pool.query(`select * from registration`, (err, result, fields) => {

    if(err){
        return console.log(err)
    }
    else{
        return console.log(result);
    }
})