const express = require('express');
const path = require('path');
const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

const indexRouter = require('./routes/index');
const testRouter = require('./routes/test');
const flashcardRouter = require('./routes/flashcards');
const sentenceRouter = require('./routes/sentences');

app.use('/', indexRouter);
app.use('/test', testRouter);
app.use('/flashcards', flashcardRouter);
app.use('/sentences', sentenceRouter);

const PORT = process.env.PORT || 9210;
app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
