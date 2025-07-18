let chars = JSON.parse(document.getElementById('flashcard-data').textContent);
let type = typeof flashcardType !== "undefined" ? flashcardType : 'hiragana';
let current = 0;

// ---- Voice Setup ----
function getJapaneseVoice() {
  let voices = window.speechSynthesis.getVoices();
  let jpVoices = voices.filter(v => v.lang && v.lang.startsWith('ja'));
  let googleJP = jpVoices.find(v => v.name && v.name.toLowerCase().includes('google'));
  return googleJP || jpVoices[0] || null;
}

function speakKana(kana) {
  let utter = new SpeechSynthesisUtterance(kana);
  let jpVoice = getJapaneseVoice();
  if (jpVoice) {
    utter.voice = jpVoice;
    utter.lang = jpVoice.lang;
  }
  window.speechSynthesis.speak(utter);
}

function speakRomanji(romanji) {
  let utter = new SpeechSynthesisUtterance(romanji);
  let jpVoice = getJapaneseVoice();
  if (jpVoice) {
    utter.voice = jpVoice;
    utter.lang = jpVoice.lang;
  }
  window.speechSynthesis.speak(utter);
}

// ---- Speaker Button Setup (only attach ONCE!) ----
function setupSpeakerButton() {
  let speakBtn = document.getElementById('speakBtn');
  speakBtn.onclick = function(e) {
    e.stopPropagation();
    // Use the *latest* current index and card
    let data = chars[current];
    if (type === 'hiragana' || type === 'katakana') {
      speakKana(data.symbol);
    } else if (type === 'kanji') {
      let reading = data.romanji ? data.romanji.split(/[\/,]/)[0].trim() : '';
      if (reading) {
        speakRomanji(reading);
      } else {
        speakKana(data.kanji);
      }
    } else if (type === 'vocab') {
      let reading = data.romanji ? data.romanji.split(/[\/,]/)[0].trim() : '';
      if (reading) {
        speakRomanji(reading);
      } else {
        speakKana(data.kana || data.kanji);
      }
    }
  };
}

// ---- Card Display ----
function showCard(idx) {
  let charElem = document.getElementById('char');
  let romanjiElem = document.getElementById('romanji');
  let speakBtn = document.getElementById('speakBtn');
  let data = chars[idx];

  // Show character
  if (type === 'kanji') {
    charElem.textContent = data.kanji || '';
    romanjiElem.innerHTML = '';
    if (data.romanji && data.meaning) {
      romanjiElem.append(
        document.createTextNode(data.romanji + ' - ' + data.meaning)
      );
    } else if (data.romanji) {
      romanjiElem.append(document.createTextNode(data.romanji));
    }
  } else if (type === 'vocab') {
    // Show kanji with kana reading if available
    if (data.kanji && data.kana) {
      charElem.textContent = data.kanji + ' (' + data.kana + ')';
    } else {
      charElem.textContent = data.kanji || data.kana || '';
    }
    romanjiElem.innerHTML = '';
    let text = data.romanji || '';
    if (data.meaning) text += ' - ' + data.meaning;
    if (text) romanjiElem.append(document.createTextNode(text));
  } else {
    charElem.textContent = data.symbol || '';
    romanjiElem.innerHTML = '';
    if (data.romanji) romanjiElem.append(document.createTextNode(data.romanji));
  }

  // Always append speaker button (hidden by default)
  speakBtn.style.display = 'none';
  romanjiElem.appendChild(speakBtn);

  romanjiElem.style.display = 'none';

  // NOTE: DO NOT call setupSpeakerButton() here!
}

// ---- Card Controls ----
function flipCard() {
  let romanjiElem = document.getElementById('romanji');
  let speakBtn = document.getElementById('speakBtn');
  if (romanjiElem.style.display === 'none') {
    romanjiElem.style.display = 'inline';
    speakBtn.style.display = 'inline-block';
  } else {
    romanjiElem.style.display = 'none';
    speakBtn.style.display = 'none';
  }
}

function prevCard() {
  if (current > 0) current--;
  showCard(current);
}
function nextCard() {
  if (current < chars.length - 1) current++;
  showCard(current);
}

// ---- Voice Ready Loader ----
function whenVoicesReady(cb) {
  if (window.speechSynthesis.getVoices().length > 0) {
    cb();
  } else {
    window.speechSynthesis.onvoiceschanged = cb;
  }
}

// ---- Init ----
window.onload = function() {
  showCard(current);
  whenVoicesReady(function() {
    setupSpeakerButton(); // ONLY ONCE!
    // Optional: warn if no Japanese voice found
    // if (!getJapaneseVoice()) {
    //   alert("No Japanese voice found in your browser. Speech may sound incorrect or English-like.");
    // }
  });
};

document.addEventListener('keydown', function(e) {
  // Prevent default for space (avoid page scroll)
  if (e.code === 'Space') {
    e.preventDefault();
    flipCard();
  }
  // Left Arrow: prev card
  else if (e.code === 'ArrowLeft') {
    prevCard();
  }
  // Right Arrow: next card
  else if (e.code === 'ArrowRight') {
    nextCard();
  }
  // V key: play voice
  else if (e.key.toLowerCase() === 'v') {
    // Directly speak, regardless of flip state
    let data = chars[current];
    if (type === 'hiragana' || type === 'katakana') {
      speakKana(data.symbol);
    } else if (type === 'kanji') {
      let reading = data.romanji ? data.romanji.split(/[\/,]/)[0].trim() : '';
      if (reading) {
        speakRomanji(reading);
      } else {
        speakKana(data.kanji);
      }
    } else if (type === 'vocab') {
      let reading = data.romanji ? data.romanji.split(/[\/,]/)[0].trim() : '';
      if (reading) {
        speakRomanji(reading);
      } else {
        speakKana(data.kana || data.kanji);
      }
    }
  }
  
});

