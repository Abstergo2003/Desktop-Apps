const {readFileSync} = window.fs
var chapter = +sessionStorage.getItem('chapter')
var id = sessionStorage.getItem('toRead')
var toSpeach = ''
var test = `Re:Zero began as a free web novel written by Tappei Nagatsuki. The first three arcs were covered by the first season of the anime; however the anime adapted the Light Novel version, which in turn was adapted from the Web Novel version.`

if ('speechSynthesis' in window) {
    // Create a new SpeechSynthesisUtterance object
    var speechSynthesis = window.speechSynthesis;
    var utterance = new SpeechSynthesisUtterance();
    console.log(speechSynthesis.getVoices())
    // Set the text to be spoken
    utterance.text = '1';
  
    // Set the language
    utterance.lang = 'en-US';
  
    // Wait for the voices to be loaded
    speechSynthesis.onvoiceschanged = function() {
      // Get the list of available voices
      var voices = speechSynthesis.getVoices();
  
      // Find a voice that supports the desired language
      var selectedVoice = voices.find(function(voice) {
        return voice.lang === 'en-US';
      });
      console.log(selectedVoice)
      // Set the selected voice
      utterance.voice = selectedVoice;
  
      // Speak the text
      speechSynthesis.speak(utterance);
    };
  } else {
    console.log('Speech synthesis not supported');
  }

function readManga() {
    var manga = JSON.parse(readFileSync(`E:/archiwum/My Creations/Desktop Apps/Storage/manga/${id}/data.json`, 'utf-8'))
    var holder = document.querySelector('.holder')
    for (var i = 0; i<manga.chapters[chapter].files; i++) {
        holder.innerHTML += `<img src="E:/archiwum/My Creations/Desktop Apps/Storage/manga/${id}/${chapter}/${i+1}.jpg">`
    }
    document.querySelector('.upper').innerText = manga.title.toUpperCase()
}
function readNovel(URL) {
    pdfjsLib.getDocument(URL).promise.then(pdfDoc=>{
        console.log(pdfDoc)
        let pages = pdfDoc._pdfInfo.numPages
        for (var i = 1; i<=pages; i++) {
            pdfDoc.getPage(i).then(page=>{
                page.getTextContent().then(function(textContent) {
                    // Iterate through the text items
                    var extractedText = '';
                    for (var i = 0; i < textContent.items.length; i++) {
                      var textItem = textContent.items[i];
                      toSpeach += textItem.str
                      if (textItem.hasEOL == true) {
                        extractedText += '<br>'
                      } else if(textItem.height == 0 && textItem.width != 0) {
                        extractedText += ' '
                      } else {
                        extractedText += `<p style="font-size: ${Math.floor(textItem.height)*2.5}px">${textItem.str}</p>`;
                      }
                    }
                    // Output the extracted text
                    console.log(extractedText);
                    //
                    document.getElementById('text').innerHTML = extractedText
                    utterance.text = test;
                    utterance.lang = 'en-US'
                });
            })
        }
    }).catch(err=>{
        console.log(err)
    })
}
function read() {
    speechSynthesis.speak(utterance);
}
if (sessionStorage.getItem('type')=='manga') {
    readManga()
} else {
    readNovel('test.pdf')
}