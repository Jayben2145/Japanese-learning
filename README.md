# Japanese Learning App

This is a small Express + Pug application for practicing hiragana, katakana, kanji, vocabulary and simple sentences.

## Running

Install dependencies and start the server:

```bash
npm install
npm start
```

The app will be available at `http://localhost:9210`.

## Kanji lessons

Kanji are grouped by lesson numbers roughly following a typical beginner textbook.
Lessons 1–12 are included in `data/kanji.json`. Use the lesson selector on the test
or flashcard pages to focus on specific lessons.

Vocabulary words are organized by categories such as verbs, places, objects, animals and adjectives.  You can select these categories when starting a vocabulary test or flashcard session.
Sentence practice still uses lesson numbers and the selection page now lists brief descriptions of each lesson.
