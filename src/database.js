const mysql = require('mysql')

const connection =  mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'aninotes'
})

connection.connect((error) => {
    if(error){
        console.log(error);
        return;
    }else{
        console.log('DB is connected');
    }
})

module.exports = connection