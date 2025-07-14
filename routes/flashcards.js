const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

function loadChars(type) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, '../data', `${type}.json`), 'utf-8'));
}

// Selection page
router.get('/', (req, res) => {
  res.render('flashcard_select');
});

// Flashcard page
router.post('/start', (req, res) => {
  const { type, dakuten, combo, lessons } = req.body;
  let chars = loadChars(type);

  let selectedLessons = [];
  if (Array.isArray(lessons)) {
    selectedLessons = lessons.map(Number);
  } else if (lessons) {
    selectedLessons = [Number(lessons)];
  }

  // In your route
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
  // (Lesson filtering for kanji unchanged)
  return true;
});


  res.render('flashcard_page', { chars: filtered, type });
});

module.exports = router;
