const {readFileSync} = window.fs
const {writeFileSync} = window.fs
const {join} = window.path
let charactersPath
let __dirname
let characters
let characterToLoadPath
var character
window.electron.ipcRenderer.send('askPath');
window.electron.ipcRenderer.on('userData', (event, userData)=>{
    __dirname = userData
    charactersPath = userData + '\\characters.json'
    characterToLoadPath = join(__dirname, 'characterToLoad.json')
    characters = JSON.parse(readFileSync(charactersPath, 'utf-8'))
    character = JSON.parse(readFileSync(characterToLoadPath, 'utf-8'))
    characterLoader()
})
let slide = 0
document.addEventListener('keydown', (e)=>{
    e = e || window.event
    var key = e.keyCode
    if (key == 39) {
        slide++
        if(slide == 4) {
            slide--
            return 0
        }
        document.getElementById('slider').style.marginLeft = -slide*80 + 'vw'
        document.getElementById(`in${slide-1}`).classList.remove('visible')
        document.getElementById(`in${slide}`).classList.add('visible')
        //right
    } else if (key == 37) {
        //left
        slide--
        if (slide == -1) {
            slide++
            return 0
        }
        document.getElementById('slider').style.marginLeft = -slide*80 + 'vw'
        document.getElementById(`in${slide+1}`).classList.remove('visible')
        document.getElementById(`in${slide}`).classList.add('visible')
    }
})
function characterLoader() {
    // const
    document.getElementById('const-name').value = character.const.name
    document.getElementById('const-class').value = character.const.class
    document.getElementById('const-level').value = character.const.level
    document.getElementById('const-background').value = character.const.background
    document.getElementById('const-race').value = character.const.race
    document.getElementById('const-alignment').value = character.const.alignment
    //attributes
        //main
            //base
    document.getElementById('attributes-main-base-strength').value = character.attributes.main.base.strength
    document.getElementById('attributes-main-base-dexterity').value = character.attributes.main.base.dexterity
    document.getElementById('attributes-main-base-constitution').value = character.attributes.main.base.constitution
    document.getElementById('attributes-main-base-intelligence').value = character.attributes.main.base.intelligence
    document.getElementById('attributes-main-base-wisdom').value = character.attributes.main.base.wisdom
    document.getElementById('attributes-main-base-charisma').value = character.attributes.main.base.charisma
            //added
    document.getElementById('attributes-main-added-strength').value = character.attributes.main.added.strength
    document.getElementById('attributes-main-added-dexterity').value = character.attributes.main.added.dexterity
    document.getElementById('attributes-main-added-constitution').value = character.attributes.main.added.constitution
    document.getElementById('attributes-main-added-intelligence').value = character.attributes.main.added.intelligence
    document.getElementById('attributes-main-added-wisdom').value = character.attributes.main.added.wisdom
    document.getElementById('attributes-main-added-charisma').value = character.attributes.main.added.charisma
        //stuff
    document.getElementById('attributes-stuff-ac').value = character.attributes.stuff.ac
    document.getElementById('attributes-stuff-initiative').value = character.attributes.stuff.initiative
    document.getElementById('attributes-stuff-speed').value = character.attributes.stuff.speed
    document.getElementById('attributes-stuff-maxHP').value = character.attributes.stuff.maxHP
    document.getElementById('attributes-stuff-currentHP').value = character.attributes.stuff.currentHP
        
    var checkedSucceses = document.querySelectorAll('.checkboxS')
    for (var j = 0; j<character.attributes.stuff.deathSaves.succeses; j++) {
        checkedSucceses[2-j].checked = true
    }
    var checkedFailures = document.querySelectorAll('.checkboxF')
    for (var j = 0; j<character.attributes.stuff.deathSaves.failures; j++) {
        checkedFailures[2-j].checked = true
    }       
            //saving dices
        //saving throws
    document.getElementById('attributes-savingThrows-strength').value = character.attributes.savingThrows.strength
    document.getElementById('attributes-savingThrows-dexterity').value = character.attributes.savingThrows.dexterity
    document.getElementById('attributes-savingThrows-constitution').value = character.attributes.savingThrows.constitution
    document.getElementById('attributes-savingThrows-intelligence').value = character.attributes.savingThrows.intelligence
    document.getElementById('attributes-savingThrows-wisdom').value = character.attributes.savingThrows.wisdom
    document.getElementById('attributes-savingThrows-charisma').value = character.attributes.savingThrows.charisma
        //skills
    document.getElementById('attributes-skills-acrobatics').value = character.attributes.skills.acrobatics
    document.getElementById('attributes-skills-animal').value = character.attributes.skills.animal
    document.getElementById('attributes-skills-arcana').value = character.attributes.skills.arcana
    document.getElementById('attributes-skills-athletics').value = character.attributes.skills.athletics
    document.getElementById('attributes-skills-deception').value = character.attributes.skills.deception
    document.getElementById('attributes-skills-history').value = character.attributes.skills.history
    document.getElementById('attributes-skills-insight').value = character.attributes.skills.insight
    document.getElementById('attributes-skills-intimidation').value = character.attributes.skills.intimidation
    document.getElementById('attributes-skills-investigation').value = character.attributes.skills.investigation
    document.getElementById('attributes-skills-medicine').value = character.attributes.skills.medicine
    document.getElementById('attributes-skills-nature').value = character.attributes.skills.nature
    document.getElementById('attributes-skills-perception').value = character.attributes.skills.perception
    document.getElementById('attributes-skills-performance').value = character.attributes.skills.performance
    document.getElementById('attributes-skills-persuasion').value = character.attributes.skills.persuasion
    document.getElementById('attributes-skills-religion').value = character.attributes.skills.religion
    document.getElementById('attributes-skills-sleight').value = character.attributes.skills.sleightOfHand
    document.getElementById('attributes-skills-stealth').value = character.attributes.skills.stealth
    document.getElementById('attributes-skills-survival').value = character.attributes.skills.survival
        //other
    document.getElementById('attributes-passiveWisdom').value = character.attributes.passiveWisdom
    document.getElementById('attributes-proficiencyBonus').value = character.attributes.proficiencyBonus
    //equipment
        //weapons
    var weaponsCon = document.getElementById('weaponsCon')
    for (var i = 0; i<character.equipment.weapons.length; i++) {
        weaponsCon.innerHTML += `
        <div class="weaponCon" tag="${i}">
            <div class="weapon" style="width: 30%" tag="name"><input type="text" value="${character.equipment.weapons[i].name}"></div>
            <div class="weapon" style="width: 20%" tag="attackBonus"><input type="text" value="${character.equipment.weapons[i].attackBonus}"></div>
            <div class="weapon" style="width: 40%" tag="damageType"><input type="text" value="${character.equipment.weapons[i].damageType}"></div>
        </div>`
    }
        //treasures
            //money
    document.getElementById('equipment-treasures-money-cp').innerHTML = '<div class="currency">CP</div>' + character.equipment.treasures.money.cp
    document.getElementById('equipment-treasures-money-sp').innerHTML = '<div class="currency">SP</div>' + character.equipment.treasures.money.sp
    document.getElementById('equipment-treasures-money-ep').innerHTML = '<div class="currency">EP</div>' + character.equipment.treasures.money.ep
    document.getElementById('equipment-treasures-money-gp').innerHTML = '<div class="currency">GP</div>' + character.equipment.treasures.money.gp
    document.getElementById('equipment-treasures-money-pp').innerHTML = '<div class="currency">PP</div>' + character.equipment.treasures.money.pp
            //other
    document.getElementById('equipment-treasures-other').value = character.equipment.treasures.other
        //backpack
    document.getElementById('equipment-backpack').value = character.equipment.backpack
    //features
    document.getElementById('features').value = character.features
    //character description
        //appearance
    document.getElementById('characterDescription-appearance').value = character.characterDescription.appearance
        //background
    document.getElementById('characterDescription-background').value = character.characterDescription.background
}

function saveChanges() {
    //const
    character.const.name = document.getElementById('const-name').value
    character.const.class = document.getElementById('const-class').value
    character.const.level =  document.getElementById('const-level').value
    character.const.background = document.getElementById('const-background').value
    character.const.race = document.getElementById('const-race').value
    character.const.alignment = document.getElementById('const-alignment').value
     //attributes
        //main
            //base
    character.attributes.main.base.strength = document.getElementById('attributes-main-base-strength').value
    character.attributes.main.base.dexterity = document.getElementById('attributes-main-base-dexterity').value
    character.attributes.main.base.constitution = document.getElementById('attributes-main-base-constitution').value
    character.attributes.main.base.intelligence = document.getElementById('attributes-main-base-intelligence').value
    character.attributes.main.base.wisdom = document.getElementById('attributes-main-base-wisdom').value 
    character.attributes.main.base.charisma = document.getElementById('attributes-main-base-charisma').value
            //added
    character.attributes.main.added.strength = document.getElementById('attributes-main-added-strength').value
    character.attributes.main.added.dexterity = document.getElementById('attributes-main-added-dexterity').value
    character.attributes.main.added.constitution = document.getElementById('attributes-main-added-constitution').value
    character.attributes.main.added.intelligence = document.getElementById('attributes-main-added-intelligence').value
    character.attributes.main.added.wisdom = document.getElementById('attributes-main-added-wisdom').value
    character.attributes.main.added.charisma = document.getElementById('attributes-main-added-charisma').value
        //stuff
    character.attributes.stuff.ac = document.getElementById('attributes-stuff-ac').value
    character.attributes.stuff.initiative = document.getElementById('attributes-stuff-initiative').value
    character.attributes.stuff.speed = document.getElementById('attributes-stuff-speed').value
    character.attributes.stuff.maxHP = document.getElementById('attributes-stuff-maxHP').value
    character.attributes.stuff.currentHP = document.getElementById('attributes-stuff-currentHP').value
    var checkedSucceses = document.querySelectorAll('.checkboxS')
    var counter = 0
    for (var i = 0; i<checkedSucceses.length; i++) {
        if(checkedSucceses[i].checked == true) {
            counter++
            console.log(counter)
        }
    }
    character.attributes.stuff.deathSaves.succeses = counter
    var checkedFailures = document.querySelectorAll('.checkboxF')
    var counter2 = 0
    for (var i = 0; i<checkedFailures.length; i++) {
        if(checkedSucceses[i].checked == true) {
            counter2++
            console.log(counter2)
        }
    }
    character.attributes.stuff.deathSaves.failures = counter2
                //saving dices
        //saving throws
    character.attributes.savingThrows.strength = document.getElementById('attributes-savingThrows-strength').value
    character.attributes.savingThrows.dexterity = document.getElementById('attributes-savingThrows-dexterity').value
    character.attributes.savingThrows.constitution = document.getElementById('attributes-savingThrows-constitution').value
    character.attributes.savingThrows.intelligence = document.getElementById('attributes-savingThrows-intelligence').value
    character.attributes.savingThrows.wisdom = document.getElementById('attributes-savingThrows-wisdom').value
    character.attributes.savingThrows.charisma = document.getElementById('attributes-savingThrows-charisma').value
            //skills
    character.attributes.skills.acrobatics = document.getElementById('attributes-skills-acrobatics').value
    character.attributes.skills.animal = document.getElementById('attributes-skills-animal').value 
    character.attributes.skills.arcana = document.getElementById('attributes-skills-arcana').value
    character.attributes.skills.athletics = document.getElementById('attributes-skills-athletics').value
    character.attributes.skills.deception = document.getElementById('attributes-skills-deception').value
    character.attributes.skills.history = document.getElementById('attributes-skills-history').value
    character.attributes.skills.insight = document.getElementById('attributes-skills-insight').value = 
    character.attributes.skills.intimidation = document.getElementById('attributes-skills-intimidation').value
    character.attributes.skills.investigation = document.getElementById('attributes-skills-investigation').value
    character.attributes.skills.medicine = document.getElementById('attributes-skills-medicine').value
    character.attributes.skills.nature = document.getElementById('attributes-skills-nature').value
    character.attributes.skills.perception = document.getElementById('attributes-skills-perception').value
    character.attributes.skills.performance = document.getElementById('attributes-skills-performance').value
    character.attributes.skills.persuasion = document.getElementById('attributes-skills-persuasion').value 
    character.attributes.skills.religion = document.getElementById('attributes-skills-religion').value
    character.attributes.skills.sleightOfHand = document.getElementById('attributes-skills-sleight').value
    character.attributes.skills.stealth = document.getElementById('attributes-skills-stealth').value
    character.attributes.skills.survival = document.getElementById('attributes-skills-survival').value
            //other
    character.attributes.passiveWisdom = document.getElementById('attributes-passiveWisdom').value
    character.attributes.proficiencyBonus = document.getElementById('attributes-proficiencyBonus').value
    var weaponCons = document.querySelectorAll('.weaponCon')
    var weapons  = []
    for (var k = 0; k<weaponCons.length; k++) {
        obj = {
            "name" : weaponCons[k].querySelectorAll('.weapon')[0].getElementsByTagName('input')[0].value,
            "attackBonus" : weaponCons[k].querySelectorAll('.weapon')[1].getElementsByTagName('input')[0].value,
            "damageType" : weaponCons[k].querySelectorAll('.weapon')[2].getElementsByTagName('input')[0].value,
        }
        if (obj.name != "") {
            weapons.push(obj)
        }
    }
    character.equipment.weapons = weapons
    character.equipment.treasures.money.cp = document.getElementById('equipment-treasures-money-cp').innerText.slice(3,6)
    character.equipment.treasures.money.sp = document.getElementById('equipment-treasures-money-sp').innerText.slice(3,6)
    character.equipment.treasures.money.ep = document.getElementById('equipment-treasures-money-ep').innerText.slice(3,6)
    character.equipment.treasures.money.gp = document.getElementById('equipment-treasures-money-gp').innerText.slice(3,6)
    character.equipment.treasures.money.pp = document.getElementById('equipment-treasures-money-pp').innerText.slice(3,6)
    character.equipment.treasures.other = document.getElementById('equipment-treasures-other').value
        //backpack
    character.equipment.backpack = document.getElementById('equipment-backpack').value
    //features
    character.features = document.getElementById('features').value
    //character description
        //appearance
    character.characterDescription.appearance = document.getElementById('characterDescription-appearance').value
        //background
    character.characterDescription.background = document.getElementById('characterDescription-background').value
    if (character.id != -1) {
        characters[character.id] = character
    } else {
        characters.push(character)
    }
    writeFileSync(charactersPath, JSON.stringify(characters))
}
function addWeapon() {
    document.getElementById('weaponsCon').innerHTML += `
    <div class="weaponCon">
        <div class="weapon" style="width: 30%" tag="name"><input type="text"></div>
        <div class="weapon" style="width: 20%" tag="attackBonus"><input type="text"></div>
        <div class="weapon" style="width: 40%" tag="damageType"><input type="text"></div>
    </div>`
}
document.getElementById('save').addEventListener('click', ()=>{
    if (document.getElementById('const-name').value == "") {
        return 0
    } else {
        saveChanges()
        window.location.href = 'index.html'
    }
})
document.getElementById('back').addEventListener('click', ()=>{
    window.location.href = 'index.html'
})
document.getElementById('addWeapon').addEventListener('click', addWeapon)
document.addEventListener('click', ()=>{
    window.electron.ipcRenderer.send('button', 'ok');
})