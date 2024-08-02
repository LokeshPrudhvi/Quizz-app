// server.js
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const path = require('path');

const app = express();
app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Lokeshp@2000',
    database: 'quiz_app'
});

db.connect(err => {
    if (err) throw err;
    console.log('MySQL connected...');
});

app.get('/questions', (req, res) => {
    const sql = 'SELECT * FROM questions';
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

app.post('/submit', (req, res) => {
    const userAnswers = req.body.answers; // [{id: 1, answer: 'C'}, {id: 2, answer: 'B'}, ...]
    const sql = 'SELECT id, correct_option FROM questions';
    db.query(sql, (err, results) => {
        if (err) throw err;
        let score = 0;
        results.forEach(question => {
            const userAnswer = userAnswers.find(ans => ans.id === question.id);
            if (userAnswer && userAnswer.answer === question.correct_option) {
                score++;
            }
        });
        res.json({ score });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
