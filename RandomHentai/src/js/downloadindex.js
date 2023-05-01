const {mkdir} = window.fs
const DownloadPath = window.path.download
async function download() {
    //creating folder
    var path = DownloadPath+'/'+id
    mkdir(path, { recursive: true }, (err) => {
        if (err) {
            console.log('Error creating directory:', err);
        } else {
            console.log('Directory created successfully.');
        }
    });
    for(var i = 1; i<pages+1; i++) {
        var pageURL = `https://i5.nhentai.net/galleries/${gallery_id}/${i}.jpg`
        var insidepath = path+`/${i}.jpg`
        await fetch(pageURL, {
            method: "GET"
        }).then((response)=>{
            if (!response.ok) {
                pageURL = `https://i5.nhentai.net/galleries/${gallery_id}/${i}.png`
                insidepath = path+`/${i}.png`
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
    var variables = JSON.parse(readFileSync(VarUrl, 'utf-8'))
	variables.downloaded.push(newDown)
	console.log(variables)
	writeFileSync(VarUrl, JSON.stringify(variables), 'utf-8')
}
document.getElementById('download').addEventListener('click', download)
