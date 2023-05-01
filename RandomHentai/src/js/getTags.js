var ReadyTags = []
function fetchTags() {
    var promises = [];

      promises.push(fetch(`https://hentaifox.com/tags/pag/64/`, {method: "GET"}));
    Promise.all(promises)
        .then(function(responses) {
            var readyTags = [];
            responses.forEach(function(response) {
                response.text().then(function(html) {
                    var parser = new DOMParser();
                    var doc = parser.parseFromString(html, 'text/html');
                    var tags = doc.querySelector('.list_tags').querySelectorAll('.list_tag');
                    for (var i = 0; i<tags.length; i++) {
                        readyTags.push(tags[i].innerText);
                    }
                });
            });
            console.log(readyTags);
        })
        .catch(function(error) {
            console.error(error);
        });
}
fetchTags()