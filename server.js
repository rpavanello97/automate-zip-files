/** Following https://javascript.plainenglish.io/how-to-create-zip-files-with-node-js-505e720ceee1 */

const path = require('path');
const fs = require('fs');
var JSZip = require("jszip");

const directoryPath = path.join(__dirname, 'files');
const resultPath = path.join(__dirname, 'result');
const chunkSize = 100;

function readFiles() {
    fs.readdir(directoryPath, (err, files) => {

        /** Handling error  */
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        }

        /** Generate zip with a specified length */
        var index = 0;
        for (let i = 0; i < files.length; i += chunkSize) {
            const chunk = files.slice(i, i + chunkSize);            
            index++;
            generateZip(chunk, resultPath, index);
        }
    });
}

function generateZip(files, destinationPath, index) {
    const zip = new JSZip();

    files.forEach(function (file) {
        const fileData = fs.readFileSync(path.join(directoryPath, file));
        zip.file(file, fileData);
    });

    zip.generateNodeStream({ type: 'nodebuffer', streamFiles: true })
        .pipe(fs.createWriteStream(path.join(destinationPath, `${index}.zip`)))
        .on('finish', () => {
            console.log(`${index}.zip written`);
        });
}

/** Execute */
readFiles();