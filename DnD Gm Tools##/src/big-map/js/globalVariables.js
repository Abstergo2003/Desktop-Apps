const{writeFileSync,readFileSync,copyFile,mkdir}=window.fs
const{join,dirname}=window.path
const savesPath=localStorage.getItem('savesPath')
const currentSave=localStorage.getItem('currentSave')
const map=localStorage.getItem('bSubMap')
const tempPath=join(savesPath,currentSave,'maps',map,'map.json')
const subMaps=join(savesPath,currentSave,'maps')
var data=JSON.parse(readFileSync(tempPath,'utf-8'))
var tool='cursor'
var isDown=!1
var taget=undefined
var Ltarget=undefined
let previousX=undefined;let previousY=undefined
const options=['Church','House','Town Hall','Well','Warehouse','Harbor','Castle','Tavern','Shop','Market','Underground']