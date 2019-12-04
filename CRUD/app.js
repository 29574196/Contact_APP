const path = require('path');
const express = require('express');
const ejs = require('ejs');
const multer = require('multer');
const upload = require('express-fileupload');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();
var nodemailer = require('nodemailer');



var imagePath;



//Set storage engine
const storage = multer.diskStorage({
    destination: './public/uploads',
    filename: function(res, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() +
            path.extname(file.originalname));
    }
});

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/views/index.html');
});



app.post('/location', function(req, res) {
    res.redirect('/google');
});

app.get('/google', function(req, res) {
    res.render('google')
})



app.use(upload());



//Inialize upload 
/*
const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 },
    fileFilter: function(reqfile, cb) {
        checkFileType(file, cb)
    }
}).single('myImage');

//Check File type
function checkFileType(file, cb) {
    //Allowed extentions
    const filetypes = /jpeg|jpg|png|gif/;
    //Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    //check ,i,e
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return connection(null, true);
    } else {
        cb('Erroe: Images Only');
    }
}*/

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'contactsdb'
});

connection.connect(function(error) {
    if (!!error) console.log(error);
    else console.log('Database Connected!');
});

//set views file
app.set('views', path.join(__dirname, 'views'));

//set view engine
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));



app.get('/personal', (req, res) => {
    // res.send('Personal Contacts');
    let sql = "SELECT * FROM personal";
    let query = connection.query(sql, (err, rows) => {
        if (err) throw err;
        res.render('personal_index', {
            title: 'Personal Contacts',
            personal: rows
        });
    });
});

app.get('/business', (req, res) => {
    // res.send('Personal Contacts');
    let sql = "SELECT * FROM business";
    let query = connection.query(sql, (err, rows) => {
        if (err) throw err;
        res.render('business_index', {
            title: 'Business Contacts',
            business: rows
        });
    });
});

app.get('/home', (req, res) => {
    let sql = "SELECT name,email,phone_no,address FROM personal JOIN business ON personal.id = business.id";
    let query = connection.query(sql, (err, rows) => {
        if (err) throw err;
        res.render('home', {
            personal: rows,

        });
    });
});


app.get('/personal/add', (req, res) => {
    res.render('personal_add', {
        title: 'Personal Contacts'
    });
});

app.get('/business/add', (req, res) => {
    res.render('business_add', {
        title: 'Business Contacts'
    });
});


app.post('/personal/save', (req, res) => {


    let data = { name: req.body.name, email: req.body.email, phone_no: req.body.phone_no, address: req.body.address, birthday: req.body.birthday, imagePath: req.body.file };
    let sql = "INSERT INTO personal SET ?";
    let query = connection.query(sql, data, (err, results) => {
        if (err) throw err;
        res.redirect('/personal');
    });
});

app.post('/business/save', (req, res) => {
    let data = { name: req.body.name, email: req.body.email, email2: req.body.email2, phone_no: req.body.phone_no, phone_no2: req.body.phone_no2, address: req.body.address, address2: req.body.address2, vat: req.body.vat };
    let sql = "INSERT INTO business SET ?";
    let query = connection.query(sql, data, (err, results) => {
        if (err) throw err;
        res.redirect('/business');
    });
});

app.get('/personal/edit/:userId', (req, res) => {
    const userId = req.params.userId;
    let sql = `Select * from personal where id = ${userId}`;
    let query = connection.query(sql, (err, result) => {
        if (err) throw err;
        res.render('personal_edit', {
            title: 'Personal Contacts',
            user: result[0]
        });
    });
});

app.get('/business/edit/:userId', (req, res) => {
    const userId = req.params.userId;
    let sql = `Select * from business where id = ${userId}`;
    let query = connection.query(sql, (err, result) => {
        if (err) throw err;
        res.render('business_edit', {
            title: 'Business Contacts',
            user: result[0]
        });
    });
});


app.post('/personal/update', (req, res) => {
    const userId = req.body.id;
    let sql = "update personal SET name='" + req.body.name + "',  email='" + req.body.email + "',  phone_no='" + req.body.phone_no + "', address='" + req.body.address + "', birthday='" + req.body.birthday + "' where id =" + userId;
    let query = connection.query(sql, (err, results) => {
        if (err) throw err;
        res.redirect('/personal');
    });
});


app.post('/business/update', (req, res) => {
    const userId = req.body.id;
    let sql = "update business SET name='" + req.body.name + "',  email='" + req.body.email + "', email2='" + req.body.email2 + "',  phone_no='" + req.body.phone_no + "', phone_no2='" + req.body.phone_no2 + "', address='" + req.body.address + "', address2='" + req.body.address2 + "', vat='" + req.body.vat + "' where id =" + userId;
    let query = connection.query(sql, (err, results) => {
        if (err) throw err;
        res.redirect('/business');
    });
});


app.get('/personal/delete/:userId', (req, res) => {
    const userId = req.params.userId;
    let sql = `DELETE from personal where id = ${userId}`;
    let query = connection.query(sql, (err, result) => {
        if (err) throw err;
        res.redirect('/personal');
    });
});

app.get('/business/delete/:userId', (req, res) => {
    const userId = req.params.userId;
    let sql = `DELETE from business where id = ${userId}`;
    let query = connection.query(sql, (err, result) => {
        if (err) throw err;
        res.redirect('/business');
    });
});

/*
function loadImage() {

    console.log(req.files);
    if (req.files.upfile) {
        var file = req.files.upfile,
            name = file.name,
            type = file.mimetype;
        var uploadpath = __dirname + '/uploads/' + name;
        file.mv(uploadpath, function(err) {
            if (err) {
                console.log("File Upload Failed", name, err);
                res.send("Error Occured!")
            } else {
                console.log("File Uploaded", name);
                res.send('Done! Uploading files')
            }
        });


    } else {
        res.send("No File selected !");
        res.end();
    };

    return uploadpath;



}
*/

app.post('/upload', function(req, res) {

    let sql
    console.log(req.files);
    if (req.files.upfile) {
        var file = req.files.upfile,
            name = file.name,
            type = file.mimetype;
        var uploadpath = __dirname + '/uploads/' + name;
        imagePath = uploadpath;
        file.mv(image, function(err) {
            if (err) {
                console.log("File Upload Failed", name, err);
                res.send("Error Occured!")
            } else {
                console.log("File Uploaded", name);
                res.send('Done! Uploading files')
            }
        });


    } else {
        res.send("No File selected !");
        res.end();
    };


})

/*app.get('search/:userId', (req, res) => {
    const search = req.query.userID
    let sql = `SELECT * from personal where id = ${search}`
    let query = connection.query(sql, (err, res) => {
        if (err) throw err;

        res.render('search', {
            title: 'Search'
        });
    });


})*/

app.get('/search/:userId', function(req, res) {
    const userId = req.query.userID;
    let sql = `SELECT * FROM personal WHERE name = "${userId}"`;

    let query = connection.query(sql, (err, result) => {
        if (err) throw err
        res.render('search', {
            personal: result
        })
    })
})

app.get('/send1', (req, res) => {
    res.render('email');
});

app.post('/send', (req, res) => {
    const output = `
        <p>You have a new contact request</p>
        <h3>Contact Deatils</h3>
        <ul>
        <li>Name: ${req.body.name}</li>
        <li>Company: ${req.body.company}</li>
        <li>Email: ${req.body.email}</li>
        <li>Phone: ${req.body.phone}</li>
        </ul>
        <h3>Mesasage</h3>
        <p>${req.body.message}</p>
    
    `;

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: 'geraldmuller41@gmail.com', // generated ethereal user
            pass: 'olaunited' // generated ethereal password
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"Nodemailer Contact" <geraldmuller44@gmail.com>', // sender address
        to: 'garizpfumbidzayi@gmail.com', // list of receivers
        subject: 'Node Contact Request', // Subject line
        text: 'Hello world?', // plain text body
        html: output // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        res.render('email', { msg: 'Email has been sent' });
    });
})


//Public folder



// Server Listening
app.listen(4000, () => {
    console.log('Server is running at port 4000');
});