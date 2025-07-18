const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

function loadSentences() {
  return JSON.parse(fs.readFileSync(path.join(__dirname, '../data/sentences.json'), 'utf-8'));
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// selection page
router.get('/', (req, res) => {
  res.render('sentence_select');
});

router.post('/start', (req, res) => {
  const { lessons, random } = req.body;
  let sentences = loadSentences();
  let selectedLessons = [];
  if (Array.isArray(lessons)) {
    selectedLessons = lessons.map(Number);
  } else if (lessons) {
    selectedLessons = [Number(lessons)];
  }
  let filtered = sentences.filter(s => !selectedLessons.length || selectedLessons.includes(Number(s.lesson)));
  if (random) filtered = shuffleArray(filtered);
  res.render('sentence_page', { sentences: filtered });
});

router.post('/result', (req, res) => {
  const { total } = req.body;
  let answers = [];
  for (let i = 0; i < total; i++) {
    answers.push({
      question: req.body['question_' + i],
      answer: (req.body['answer_' + i] || '').trim()
    });
  }
  let all = loadSentences();
  let results = answers.map(a => {
    let correct = all.find(s => s.english === a.question);
    let romanji = correct ? correct.romanji : '';
    let japanese = correct ? correct.japanese : '';
    let normAns = a.answer.toLowerCase().replace(/\s+/g, '');
    let isCorrect = false;
    if (romanji) {
      let validRomaji = romanji.toLowerCase().replace(/\s+/g, '');
      if (normAns === validRomaji) isCorrect = true;
    }
    if (!isCorrect && japanese) {
      if (normAns === japanese.replace(/\s+/g, '')) isCorrect = true;
    }
    return { ...a, romanji, japanese, isCorrect };
  });

  let correctCount = results.filter(r => r.isCorrect).length;
  let missed = results.filter(r => !r.isCorrect);
  res.render('sentence_result', { correct: correctCount, total: results.length, missed });
});

module.exports = router;
