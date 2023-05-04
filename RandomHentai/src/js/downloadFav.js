const {mkdir} = window.fs
function getspecs(i) {
    id = variables.favourites[i].id
    gallery_id = variables.favourites[i].gallery_id
    pages = variables.favourites[i].pages
    title = variables.favourites[i].title
    download(id, gallery_id, pages)
}
async function download(id, gallery_id, pages) {
    //creating folder
    console.log(variables)
    var path2 = variables.path+'/'+id
    mkdir(path2, { recursive: true }, (err) => {
        if (err) {
            console.log('Error creating directory:', err);
        } else {
            console.log('Directory created successfully.');
        }
    });
    for(var i = 1; i<pages+1; i++) {
        var pageURL = `https://i.hentaifox.com/${gallery_id}/${i}.jpg`
        var insidepath = path2+`/${i}.jpg`
        await fetch(pageURL, {
            method: "GET"
        }).then((response)=>{
            if (!response.ok) {
                pageURL = `https://i.hentaifox.com/${gallery_id}/${i}.png`
                insidepath = path2+`/${i}.png`
            }
            window.downloadImage(pageURL, insidepath)
            .then(() => {
              console.log('Image downloaded successfully.');
           })
            .catch((err) => {
              console.log('Error downloading image:', err.message);
            });
        })
    }
    var newDown = {
        "id": id,
        "pages": pages,
        "title" : title
    }
	variables.downloaded.push(newDown)
	console.log(variables)
	writeFileSync(VarUrl, JSON.stringify(variables), 'utf-8')
}
document.addEventListener('click', (e)=>{
    let ids = e.target.id
    console.log(ids)
    if (+ids>=1000) {
        getspecs(ids-1000)
    }
})
