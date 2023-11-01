function hide(element) {
    element.style.left = '-2000px'
    var options = element.querySelectorAll('.option')
    options.forEach(option => {
        option.remove()
    });
    var inputs  = element.querySelectorAll('input')
    inputs.forEach(input => {
        input.remove()
    })
}

document.addEventListener('contextmenu',(e) =>  {
    e.preventDefault()
    clickArea = e.target.id
    target = e.target
    clickX = e.clientX
    clickY = e.clientY
    var options = document.getElementById('leftClick')
    if (e.pageX > 1100) {
        options.style.left = `calc(-12vw + 10px + ${e.pageX}px)`
    } else {
        options.style.left = e.pageX - 10 + 'px'
    }
    if (e.pageY > 600) {
        options.style.top = e.pageY - options.offsetHeight + 10 + 'px'
    } else {
        options.style.top = e.pageY - 10 + 'px'
    }
});
async function back() {
    await writeFileSync(tempPath, JSON.stringify(quests))
    history.back()
}
async function forward() {
    await writeFileSync(tempPath, JSON.stringify(quests))
    history.forward()
}

async function deleteCategory() {
    const isID = (cat) => cat.id == target.id
    var index = quests.findIndex(isID)
    quests.splice(index, 1)
    await writeFileSync(tempPath, JSON.stringify(quests))
    document.location.reload()
}

async function deleteQuest() {
    if (target.classList[0] != 'quest') return 0
    var divider = target.id.indexOf('-')
    console.log(divider)
    var qID = target.id.slice(divider+1)
    var catID = target.id.slice(0, divider)
    const isCatID = (cat) => cat.id == catID
    const isQID = (quest) => quest.id == qID
    var catIndex = quests.findIndex(isCatID)
    var questIndex = quests[catIndex].quests.findIndex(isQID)
    console.log(quests[catIndex].quests)
    quests[catIndex].quests.splice(questIndex, 1)
    await writeFileSync(tempPath, JSON.stringify(quests))
    document.location.reload()
}