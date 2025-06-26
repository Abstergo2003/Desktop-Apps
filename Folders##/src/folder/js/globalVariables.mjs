const savesPath = localStorage.getItem('savesPath');
// const folder = localStorage.getItem('folderID');
let folder;
const {writeTextFile, readTextFile, exists, mkdir, BaseDirectory, copyFile, remove} = window.__TAURI__.fs;
const {invoke} = window.__TAURI__.core;
const {getMatches} = window.__TAURI__.cli;
const delay = (delayInms) => {
    return new Promise(resolve => setTimeout(resolve, delayInms));
};
async function expand() {
    const webView = await window.__TAURI__.webview.getCurrentWebview();
    const unlisten = webView.onDragDropEvent((event) => {
        if (event.payload.type === 'over') {
            console.log('User hovering', event.payload.position);
        } else if (event.payload.type === 'drop') {
            console.log('User dropped', event.payload.paths);
            addFile(event.payload.paths[0]);
        } else {
            console.log('File drop cancelled');
        }
    });

    let startingPoint = await invoke("ask_for_directions");
    if (startingPoint[0] == "left") {
        if (startingPoint[1] == "top") {
                document.querySelector(".holder").style.animation = "1s alternate leftTop"
        } else {
                document.querySelector(".holder").style.animation = "1s alternate leftBottom"
        }
    } else {
        if (startingPoint[1] == "top") {
            document.querySelector(".holder").style.animation = "1s alternate rightTop"
        } else {
            document.querySelector(".holder").style.animation = "1s alternate rightBottom"
        }
    }
    const matches = await getMatches();
    folder = matches.args.folder.value;
    await delay(1000);
    const event = new Event("appReady");
    document.dispatchEvent(event);
    await delay(3000);
    document.querySelector(".holder").style.left = "0%";
    document.querySelector(".shadow").style.left = "0%";
    document.querySelector(".holder").style.top = "0%";
    document.querySelector(".shadow").style.top = "0%";
}
expand()
let typingTimer; // Timer identifier
const doneTypingInterval = 1000;
let isCtrl = false;

async function checkFolders() {
    let foldersExists = await exists("folders/", {baseDir: BaseDirectory.AppLocalData});
    if (!foldersExists) {
        await mkdir("folders", {baseDir: BaseDirectory.AppLocalData});
    }

    let iconsExists = await exists("icons/", {baseDir: BaseDirectory.AppLocalData});
    if (!iconsExists) {
        await mkdir("icons", {baseDir: BaseDirectory.AppLocalData});
    }

    let itemsExists = await exists("items", {baseDir: BaseDirectory.AppLocalData});
    if (!itemsExists) {
        await mkdir("items", {baseDir: BaseDirectory.AppLocalData});
    }
}

async function getData() {
    await checkFolders();
    let EXISTS = await exists(`folders/${folder}.json`, {baseDir: BaseDirectory.AppLocalData});
    if (!EXISTS) {
        await writeTextFile(`folders/${folder}.json`, JSON.stringify([]) ,{baseDir: BaseDirectory.AppLocalData});
        return [];
    }
    return JSON.parse(await readTextFile(`folders/${folder}.json`, {baseDir: BaseDirectory.AppLocalData}));
}
async function save(data) {
    await writeTextFile(`folders/${folder}.json`, JSON.stringify(data), {baseDir: BaseDirectory.AppLocalData});
    return 1;
}
async function saveIcon(base64, id) {
    await writeTextFile(`icons\\${id}.txt`, base64, {baseDir: BaseDirectory.AppLocalData});
}
async function getIcon(id) {
    const ex = await exists(`icons\\${id}.txt`, {baseDir: BaseDirectory.AppLocalData});
    if (!ex) {
        console.log('desnt exists, returning standard');
        return defaultIcon;
    }
    console.log('getting icon');
    const icon = await readTextFile(`icons\\${id}.txt`, {baseDir: BaseDirectory.AppLocalData});
    return icon;
}