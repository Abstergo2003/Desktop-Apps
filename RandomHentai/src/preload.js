// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge } = require('electron');
const fs = require('fs');
const path  = require('path')
const https = require('https')
const tagsFilePath = path.join(__dirname, 'assets', 'tags.json');
const varFilePath = path.join(__dirname, 'assets', 'variables.json')
const coversPath = path.join(__dirname, 'assets', 'covers')
const DownloadPath = 'E:/archiwum/My Creations/test'
const axios = require("axios");
contextBridge.exposeInMainWorld('axios', {
  request : axios.request
})
contextBridge.exposeInMainWorld('fs', {
  readFileSync: fs.readFileSync,
  writeFileSync: fs.writeFileSync,
  createWriteStream: fs.createWriteStream,
  mkdir: fs.mkdir,
  rmSync: fs.rmSync
  // Add other methods and properties of the fs module that you need.
});
contextBridge.exposeInMainWorld('path', {
  tags: tagsFilePath,
  variables: varFilePath,
  cover: coversPath,
  download: DownloadPath
  // Add other methods and properties of the fs module that you need.
});
contextBridge.exposeInMainWorld('https', {
  get: https.get
})
contextBridge.exposeInMainWorld('downloadImage', async (imageUrl, imagePath) => {
  return new Promise((resolve, reject) => {
    https.get(imageUrl, (res) => {
      const chunks = [];
      res.on('data', (chunk) => {
        chunks.push(chunk);
      });
      res.on('end', () => {
        const imageData = new Blob(chunks, { type: res.headers['content-type'] });
        const fileReader = new FileReader();
        fileReader.onload = () => {
          const buffer = Buffer.from(fileReader.result);
          fs.writeFile(imagePath, buffer, (err) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });
        };
        fileReader.readAsArrayBuffer(imageData);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
});