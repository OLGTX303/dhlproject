import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import mysql from 'mysql';

const app = express();
const port = 3008;

app.use(bodyParser.json());
app.use(cors());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'info',
    password: 'w5FJerncrnSS6XDL', // Replace with your MySQL password
    database: 'info'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL database.');
});

app.post('/search', (req, res) => {
    const { userId, name, classValue, gender } = req.body;
    let query = 'SELECT i.*, ui.image FROM info i LEFT JOIN user_images ui ON i.user_id = ui.user_id WHERE 1=1';

    if (userId) query += ` AND i.user_id = ${mysql.escape(userId)}`;
    if (name) query += ` AND i.name LIKE ${mysql.escape('%' + name + '%')}`;
    if (classValue) query += ` AND i.class = ${mysql.escape(classValue)}`;
    if (gender) query += ` AND i.gender = ${mysql.escape(gender)}`;

    db.query(query, (err, results) => {
        if (err) throw err;
        results.forEach(user => {
            if (user.image) {
                user.image = user.image.toString('base64');
            }
        });
        res.json(results);
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
