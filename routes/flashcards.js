const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

function loadChars(type) {
  return JSON.parse(
    fs.readFileSync(path.join(__dirname, '../data', `${type}.json`), 'utf-8')
  );
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Selection page
router.get('/', (req, res) => {
  res.render('flashcard_select');
});

// Flashcard page
router.post('/start', (req, res) => {
  const { type, dakuten, combo, lessons, categories } = req.body;
  let chars = loadChars(type);

  let selectedCategories = [];
  if (Array.isArray(categories)) {
    selectedCategories = categories;
  } else if (categories) {
    selectedCategories = [categories];
  }
  let selectedLessons = [];
  if (Array.isArray(lessons)) {
    selectedLessons = lessons.map(Number);
  } else if (lessons) {
    selectedLessons = [Number(lessons)];
  }

let rowNames = ["vowel", "k", "s", "t", "n", "h", "m", "y", "r", "w"];
let selectedRows = rowNames.filter(r => req.body['row_' + r]);


let filtered = chars.filter(c => {
  if (type === 'hiragana' || type === 'katakana') {
    if (selectedRows.length && c.row && !selectedRows.includes(c.row)) return false;
    if (!dakuten && (c.type === 'dakuten' || c.type === 'handakuten' || c.type === 'combo_dakuten' || c.type === 'combo_handakuten')) return false;
    if (!combo && (c.type === 'combo' || c.type === 'combo_dakuten' || c.type === 'combo_handakuten')) return false;
  } else if (type === 'vocab') {
    if (selectedCategories.length && !selectedCategories.includes(c.category)) return false;
  } else {
    if (selectedLessons.length && !selectedLessons.includes(Number(c.lesson))) return false;
  }
  return true;
});

  if (req.body.random) {
    filtered = shuffleArray(filtered);
  }


  res.render('flashcard_page', { chars: filtered, type });
});

module.exports = router;
