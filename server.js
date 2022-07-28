/** Following https://javascript.plainenglish.io/how-to-create-zip-files-with-node-js-505e720ceee1 */

const path = require('path');
const fs = require('fs');
const { readdir } = require('fs').promises;
var JSZip = require("jszip");

(() => {
    const directoryPath = path.join(__dirname, 'files-old');
    const resultPath = path.join(__dirname, 'result');
    const chunkSize = 10;

    /** Function to get all files from a folder and handle it */
    async function readFiles() {
        try {
            const files = await readdir(directoryPath);

            var index = 0;
            for (let i = 0; i < files.length; i += chunkSize) {
                const chunk = files.slice(i, i + chunkSize);
                index++;
                await generateZip(chunk, resultPath, index)
                    .then(console.log)
                    .catch(console.log)
            }
            return 'Completed'
        } catch (err) {
            throw `From readFiles function: \n${err}`;
        }
    }

    /** Function to zip an array of files into a folder */
    function generateZip(files, destinationPath, index) {
        const zip = new JSZip();

        return new Promise((resolve, reject) => {
            try {
                files.forEach(function (file) {
                    const fileData = fs.readFileSync(path.join(directoryPath, file));
                    zip.file(file, fileData);
                });

                zip.generateNodeStream({ type: 'nodebuffer', streamFiles: true })
                    .pipe(fs.createWriteStream(path.join(destinationPath, `${index}.zip`)))
                    .on('finish', () => {
                        resolve(`${index}.zip written`);
                    });
            } catch (err) {
                reject(`From generateZip function: \n${err}`)
            }
        });
    }

    /** Execute */
    readFiles()
        .then(msg => console.log(msg))
        .catch(err => console.log(err))
})();