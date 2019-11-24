const path = require('path');
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();

const connection=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'password',
    database:'contactsdb'
});

connection.connect(function(error){
    if(!!error) console.log(error);
    else console.log('Database Connected!');
}); 

//set views file
app.set('views',path.join(__dirname,'views'));
			
//set view engine
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));



app.get('/personal',(req, res) => {
    // res.send('Personal Contacts');
    let sql = "SELECT * FROM personal";
    let query = connection.query(sql, (err, rows) => {
        if(err) throw err;
        res.render('personal_index', {
            title : 'Personal Contacts',
            personal : rows
        });
    });
});

app.get('/business',(req, res) => {
    // res.send('Personal Contacts');
    let sql = "SELECT * FROM business";
    let query = connection.query(sql, (err, rows) => {
        if(err) throw err;
        res.render('business_index', {
            title : 'Business Contacts',
            business : rows
        });
    });
});


app.get('/personal/add',(req, res) => {
    res.render('personal_add', {
        title : 'Personal Contacts'
    });
});

app.get('/business/add',(req, res) => {
    res.render('business_add', {
        title : 'Business Contacts'
    });
});


app.post('/personal/save',(req, res) => { 
    let data = {name: req.body.name, email: req.body.email, phone_no: req.body.phone_no, address: req.body.address, birthday: req.body.birthday};
    let sql = "INSERT INTO personal SET ?";
    let query = connection.query(sql, data,(err, results) => {
      if(err) throw err;
      res.redirect('/personal');
    });
});

app.post('/business/save',(req, res) => { 
    let data = {name: req.body.name, email: req.body.email, email2: req.body.email2, phone_no: req.body.phone_no, phone_no2: req.body.phone_no2, address: req.body.address, address2: req.body.address2, vat: req.body.vat};
    let sql = "INSERT INTO business SET ?";
    let query = connection.query(sql, data,(err, results) => {
      if(err) throw err;
      res.redirect('/business');
    });
});

app.get('/personal/edit/:userId',(req, res) => {
    const userId = req.params.userId;
    let sql = `Select * from personal where id = ${userId}`;
    let query = connection.query(sql,(err, result) => {
        if(err) throw err;
        res.render('personal_edit', {
            title : 'Personal Contacts',
            user : result[0]
        });
    });
});

app.get('/business/edit/:userId',(req, res) => {
    const userId = req.params.userId;
    let sql = `Select * from business where id = ${userId}`;
    let query = connection.query(sql,(err, result) => {
        if(err) throw err;
        res.render('business_edit', {
            title : 'Business Contacts',
            user : result[0]
        });
    });
});


app.post('/personal/update',(req, res) => {
    const userId = req.body.id;
    let sql = "update personal SET name='"+req.body.name+"',  email='"+req.body.email+"',  phone_no='"+req.body.phone_no+"', address='"+req.body.address+"', birthday='"+req.body.birthday+"' where id ="+userId;
    let query = connection.query(sql,(err, results) => {
      if(err) throw err;
      res.redirect('/personal');
    });
});

app.post('/business/update',(req, res) => {
    const userId = req.body.id;
    let sql = "update business SET name='"+req.body.name+"',  email='"+req.body.email+"', email2='"+req.body.email2+"',  phone_no='"+req.body.phone_no+"', phone_no2='"+req.body.phone_no2+"', address='"+req.body.address+"', address2='"+req.body.address2+"', vat='"+req.body.vat+"' where id ="+userId;
    let query = connection.query(sql,(err, results) => {
      if(err) throw err;
      res.redirect('/business');
    });
});


app.get('/personal/delete/:userId',(req, res) => {
    const userId = req.params.userId;
    let sql = `DELETE from personal where id = ${userId}`;
    let query = connection.query(sql,(err, result) => {
        if(err) throw err;
        res.redirect('/personal');
    });
});

app.get('/business/delete/:userId',(req, res) => {
    const userId = req.params.userId;
    let sql = `DELETE from business where id = ${userId}`;
    let query = connection.query(sql,(err, result) => {
        if(err) throw err;
        res.redirect('/business');
    });
});


// Server Listening
app.listen(3000, () => {
    console.log('Server is running at port 3000');
});