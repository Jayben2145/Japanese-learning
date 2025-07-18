const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Utility to load character data
function loadChars(type) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, '../data', `${type}.json`), 'utf-8'));
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}


// Select page
router.get('/', (req, res) => {
  res.render('test_select');
});

// Start test, filter based on checkboxes/lessons
router.post('/start', (req, res) => {
  const { type, dakuten, combo, lessons } = req.body;
  let chars = loadChars(type);

  let selectedLessons = [];
  if (Array.isArray(lessons)) {
    selectedLessons = lessons.map(Number);
  } else if (lessons) {
    selectedLessons = [Number(lessons)];
  }

let rowNames = ["vowel", "k", "s", "t", "n", "h", "m", "y", "r", "w"];
let selectedRows = rowNames.filter(r => req.body['row_' + r]);


let filtered = chars.filter(c => {
  if (type !== 'kanji') {
    // Only allow selected rows (if at least one selected)
    if (selectedRows.length && c.row && !selectedRows.includes(c.row)) return false;
    // Dakuten/Handakuten
    if (!dakuten && (c.type === "dakuten" || c.type === "handakuten" || c.type === "combo_dakuten" || c.type === "combo_handakuten")) return false;
    if (!combo && (c.type === "combo" || c.type === "combo_dakuten" || c.type === "combo_handakuten")) return false;
  }
  else {
    if (selectedLessons.length && !selectedLessons.includes(Number(c.lesson))) return false;
  }
  return true;
});


  if (req.body.random) {
    filtered = shuffleArray(filtered);
  }
  

  res.render('test_page', { chars: filtered, type });
});

// Submit answers, show result
router.post('/result', (req, res) => {
  const { type, total } = req.body;
  let chars = [];
  for (let i = 0; i < total; i++) {
    chars.push({
      symbol: req.body['symbol_' + i],
      answer: (req.body['answer_' + i] || '').trim().toLowerCase()
    });
  }

  // Load the correct romanji and (for kanji) meaning
  let allChars = loadChars(type);
  let results = chars.map(entry => {
    // For kana, match on .symbol; for kanji, allow .symbol or .kanji
    let correctChar = allChars.find(c =>
      (c.symbol && c.symbol === entry.symbol) || (c.kanji && c.kanji === entry.symbol)
    );
    let romanji = correctChar ? correctChar.romanji : '';
    let meaning = correctChar ? correctChar.meaning : '';
    let validRomanji = romanji.toLowerCase().split(/[\/,]/).map(s => s.trim());
    let isCorrect = validRomanji.includes(entry.answer);
    return { ...entry, romanji, meaning, isCorrect };
  });

  let correct = results.filter(r => r.isCorrect).length;
  let missed = results.filter(r => !r.isCorrect);

  res.render('test_result', {
    correct,
    total: results.length,
    missed,
    type
  });
});

module.exports = router;
