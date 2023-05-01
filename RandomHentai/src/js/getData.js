const {readFileSync} = window.fs
const {writeFileSync} = window.fs
const VarUrl = window.path.variables
const coversPath = window.path.cover
var id
var gallery_id
var pages
var error_counter = 0
var title
var tags = JSON.parse(readFileSync(VarUrl, 'utf-8')).tags
// %2B = +
var URL = 'https://hentaifox.com/search/?q='
var maxPages
function getMaxPages() {
  for (var i = 0; i<tags.length; i++) {
    URL += `%2B${tags[i]}`
  }
  fetch(URL,
      {method: "GET"
    }).then(function (response) {
      // The API call was successful!
      return response.text();
    }).then(function (html) {
      // Convert the HTML string into a document object
      var parser = new DOMParser();
      var doc = parser.parseFromString(html, 'text/html');
      console.log(doc)
      var container = doc.querySelectorAll('.page-item')
	  var half = container[container.length-2].querySelector('.page-link')
      var half2 = half.getAttribute('href').indexOf('page=')
	  maxPages = half.getAttribute('href').slice(half2+5)
      console.log(maxPages)
      getRandomHentai()
    })
}
function getRandomHentai() {
  var Rpage = Math.round(Math.random() * (maxPages - 1) + 1)
  console.log(Rpage)
  console.log(URL+`&page=${Rpage}`)
  fetch(URL+`&page=${Rpage}`,
    {method: "GET"
  }).then(function (response) {
    // The API call was successful!
    return response.text();
  }).then(function (html) {
    // Convert the HTML string into a document object
    var parser = new DOMParser();
    var doc = parser.parseFromString(html, 'text/html');
    console.log(doc)
    var randomIndex = Math.round(Math.random() * (20 - 1) + 1)
    id = doc.querySelectorAll('.inner_thumb')[randomIndex].querySelector('a').getAttribute('href').slice(9,-1)
    getRandomData()
  })
}
function getRandomData() {
	fetch(`https://hentaifox.com/gallery/${id}/`,
		{method: "GET"
	}).then(function (response) {
		// The API call was successful!
		return response.text();
	}).then(function (html) {
		// Convert the HTML string into a document object
		var parser = new DOMParser();
		var doc = parser.parseFromString(html, 'text/html');
    	console.log(doc)
		var info = doc.querySelector('.info')
		title = info.querySelector('h1').innerText //getting title
		document.querySelector('h3').innerText = title //inserting title
		var coverUrl = doc.querySelector('.cover').querySelector('img').getAttribute('src') //getting cover URL
		document.querySelector('img').setAttribute('src', coverUrl) //setting cover URL
    	gallery_id = coverUrl.slice(24,-10) //getting gallery id
		console.log(gallery_id)
		var tagsContainers = doc.querySelector('.tags').getElementsByTagName('li')
		var localTagContainer = document.getElementById('tags')
		for (var i = 0; i<tagsContainers.length; i++) { //iterating to get actual tags
			var readyTag = tagsContainers[i].innerText
			var hrefTag = `https://hentaifox.com${tagsContainers[i].querySelector('a').getAttribute('href')}`
			console.log(hrefTag)
			localTagContainer.innerHTML += `<a target="_blank" href="${hrefTag}"><span>${readyTag}</span><a/>`
		}
		var hrefs = document.getElementsByTagName('a')
		hrefs[0].setAttribute('href', `https://hentaifox.com/gallery/${id}/`)
		hrefs[1].setAttribute('href', `https://hentaifox.com/gallery/${id}/`)
		console.log(gallery_id)
		console.log(tags)
	}).catch(function (error) {
		// There was an error
		console.error(error)
		error_counter++
		if (error_counter <5) {
			getRandomData()
		}
		
	});
}
function AddFav() {
	//part that adds it to variablse.json
	console.log('adding')
	var newFav = {
		"id": id,
		"gallery_id" : +gallery_id,
		"title" : title,
		"pages": pages
	}
	var variables = JSON.parse(readFileSync(VarUrl, 'utf-8'))
	variables.favourites.push(newFav)
	console.log(variables)
	writeFileSync(VarUrl, JSON.stringify(variables), 'utf-8')
	// part that download cover
	var coverUrl = `https://i.hentaifox.com/${gallery_id}/cover.jpg`
	var FullCoverPath = coversPath + `/${id}.jpg`
	window.downloadImage(coverUrl, FullCoverPath)
  	.then(() => {
    	console.log('Image downloaded successfully.');
 	})
  	.catch((err) => {
    	console.log('Error downloading image:', err.message);
  	});
}
document.getElementById('favourites').addEventListener('click', AddFav)
if (tags.length==0) {
	id = Math.round(Math.random() * (110238 - 1) + 1)
	getRandomData()
} else {
	getMaxPages()
}