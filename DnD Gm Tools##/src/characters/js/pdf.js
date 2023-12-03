async function openPDF() {
    const id = localStorage.getItem('currentCharacter')
    const pdfPath = join(savesPath, currentSave, 'characters', `${id}.pdf`)
    const exists = await existsSync(pdfPath)
    if (exists) {
        window.electron.ipcRenderer.send('openPDF', pdfPath);
    } else {
        var input = document.createElement('input')
        input.setAttribute('type', 'file')
        input.setAttribute('accept', 'application/pdf')
        input.click()
        input.addEventListener('change', ()=>{
        // copy image and set it from appData
        var source = input.files[0].path
        var dest = join(savesPath, currentSave,'characters', `${id}.pdf`)
        copyFile(source, dest, (err) => {
            if (err) throw err;
            console.log(`${source} was copied to ${dest}`);
        })
        input.remove()
    })
    }
}