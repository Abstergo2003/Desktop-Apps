function load() {
    const side = document.querySelector('.side')
    for (var j = 0; j<quests.length;j ++) {
        var category = document.createElement('div')
        category.classList.add('category')
        category.style.height = 'calc(8vh - 40px)'
        category.setAttribute('id', quests[j].id)
        category.innerHTML += `<span onclick="expand(this.id)" id="span-${quests[j].id}">></span><input type="text" value="${quests[j].name}" oninput="updateC(this)"><br>`
        for (var i = 0; i< quests[j].quests.length; i++) {
            category.innerHTML += `<div class="quest" id="${quests[j].id}-${quests[j].quests[i].id}"  onclick="inspect(this.id)">${quests[j].quests[i].name}</div>`
        }
        category.innerHTML += `
            <form id="add-${quests[j].id}">
                <input type="text" placeholder="Add Qest">
                <input type="submit">
            </form>`
        side.append(category)
    }
    
}
function expand(id) {
    var sid = parentID(id)
    if (document.getElementById(sid).style.height != 'calc(8vh - 40px)') {
        document.getElementById(sid).style.height = 'calc(8vh - 40px)'
        document.getElementById(id).style.transform = 'rotate(0deg)'
    } else {
        const result = quests.filter((quest) => quest.id == sid);
        var questCount = result[0].quests.length
        document.getElementById(sid).style.height = `calc(8vh - 40px + 20px + ${questCount * 5}vh + 20px + 5vh + 20px)`
        document.getElementById(id).style.transform = 'rotate(90deg)'
    }
}
function parentID(id) {
    var half = id.replace('span-', '')
    var result = half.replace('add-', '')
    return result
}
function getQuest (id) {
    var catID = id.slice(0, id.indexOf('-'))
    var qID = id.slice(id.indexOf('-')+1)
    var category = quests.filter((cat) => cat.id == catID)
    var quest = category[0].quests.filter((quest) => quest.id == qID)
    return quest[0]
}
function inspect(id) {
    var quest = getQuest(id)
    sessionStorage.setItem('inspected', JSON.stringify(quest))
    document.getElementById('name').value = quest.name
    document.getElementById('goal').value = quest.goal
    document.getElementById('rewards').value = quest.rewards
    document.getElementById('experience').value = quest.experience
    document.getElementById('requirements').value = quest.requirements
    document.getElementById('employer').value = quest.employer
    document.querySelectorAll('.nic')[quest.completionState].checked = true
    document.getElementById('notes').value = quest.notes
    document.getElementById('completionSteps').value = quest.completionSteps
    document.getElementById('location').value = quest.location
}
async function addQuest(id) {
    console.log(id)
    var cid = parentID(id)
    console.log(cid)
    const date = new Date()
    const timestamp = date.getTime()
    var obj = {
        id: timestamp,
        name: document.getElementById(id).querySelector('input').value,
        goal: 'Goal',
        rewards: "Rewards",
        experience: "Ammount",
        requirements: "Requirements",
        employer: "Person",
        completionState: 0,
        notes: "Your Notes",
        completionSteps: "Add Steps Necessary to Complete Quest",
        location: 'default'
    }
    var result = quests.filter((category) => category.id == cid)
    result[0].quests.push(obj)
    await writeFileSync(tempPath, JSON.stringify(quests))
    document.location.reload()
}
async function addCategory() {
    console.log('prevented')
    var name = document.getElementById('addCategory').value
    const date = new Date()
    const timestamp = date.getTime()
    var obj = {
        id: timestamp,
        name: name,
        quests: []
    }
    quests.push(obj)
    await writeFileSync(tempPath, JSON.stringify(quests))
    document.location.reload()
}
function findC(id) {
    for (var i = 0; i<quests.length; i++) {
        var category = quests[i]
        var result = category.quests.filter((quest) => quest.id == id)
        if (result.length > 0) {
            return i
        }
    }
}
function checkState() {
    var radios = document.querySelectorAll('.nic')
    for (var i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            return i
        }
    }
}
function findQestIndex(cI, qID) {
    var category = quests[cI]
    for (var i = 0; i<category.quests.length; i++) {
        var quest = category.quests[i]
        if (quest.id == qID) {
            return i
        }
    }
}
async function updateQ() {
    var id = await JSON.parse(sessionStorage.getItem('inspected')).id
    const cat = findC(id)
    var obj = {
        id: id,
        name: document.getElementById('name').value,
        goal: document.getElementById('goal').value,
        rewards: document.getElementById('rewards').value,
        experience: document.getElementById('experience').value,
        requirements: document.getElementById('requirements').value,
        employer: document.getElementById('employer').value,
        completionState: checkState(),
        notes: document.getElementById('notes').value,
        completionSteps: document.getElementById('completionSteps').value,
        location: document.getElementById('location').value
    }
    var qI = findQestIndex(cat, id)
    quests[cat].quests[qI] = obj
    console.log(`${quests[cat].id}-${qI}`)
    document.getElementById(`${quests[cat].id}-${quests[cat].quests[qI].id}`).innerHTML = document.getElementById('name').value,
    sessionStorage.setItem('inspected', JSON.stringify(obj))
}
function loadLocations () {
    var container = document.getElementById('location')
    for (var i = 0; i<quickLocations.length; i++) {
        container.innerHTML +=  `<option value="${quickLocations[i].toLowerCase()}">${quickLocations[i]}</option>`
    }
}
const prevent = (e) => {
    e.preventDefault()
    if (e.target.id == 'cat') {
        addCategory()
    } else if (e.target.id.indexOf('add') != -1) {
        addQuest(e.target.id)
    }
}
function updateC(elem) {
    var catID = elem.parentNode.id
    const isID = (cat) => cat.id == catID
    var index = quests.findIndex(isID)
    quests[index].name = elem.value
}
document.onsubmit = prevent
loadLocations()
load()