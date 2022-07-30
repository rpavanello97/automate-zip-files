/** Following https://javascript.plainenglish.io/how-to-create-zip-files-with-node-js-505e720ceee1 */

const path = require('path');
const fs = require('fs');
const { readdir } = require('fs').promises;
var JSZip = require("jszip");

(() => {
    /** Declaring  */
    let directoryPath = '';
    let resultPath = '';
    let chunkSize = null;
    let parameters = [
        {
            question: 'Digite o diretório de origem dos arquivos :',
            assignValue: (value) => { directoryPath = value }
        },
        {
            question: 'Digite o diretório de destino dos arquivos :',
            assignValue: (value) => { resultPath = value }
        },
        {
            question: 'Digite a quantidade de arquivos por zip :',
            assignValue: (value) => { chunkSize = Number(value) }
        }
    ]

    /** Function to get parameter from console */
    function getParameter(string) {
        return new Promise(resolve => {
            process.stdout.write(string);
            process.stdin.on('data', data => {
                const name = data.toString().trim();
                resolve(name)
            });
        });
    }

    /** Function to get all parameters from a array */
    async function getAllParameters(arr) {
        try {
            for (let a of arr) {
                await getParameter(a.question)
                    .then(a.assignValue)
            }
            console.log('\n');
            return
        } catch (e) {
            throw `From get all parame function: \n${err}`
        }
    }

    /** Function to get all files from a folder and handle it */
    async function readFiles() {
        try {
            const files = await readdir(directoryPath);

            if (files.length < 1) throw `Diretório indicado não contem arquivos`;
            if (chunkSize == 0) throw `Quantidade de arquivos por zip não pode ser 0`

            var index = 0;
            for (let i = 0; i < files.length; i += chunkSize) {
                const chunk = files.slice(i, i + chunkSize);
                index++;
                await generateZip(chunk, resultPath, index)
                    .then(console.log)
                    .catch(console.log)
            }
            return '\nAll file has been zipped !!!'
        } catch (err) {
            throw `From read files function: \n${err}`;
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
                reject(`From generate zip function: \n${err}`)
            }
        });
    }

    /** Execute */
    getAllParameters(parameters)
        .then(() => {
            readFiles()
                .then(msg => {
                    console.log(msg);
                    process.exit();
                })
                .catch(err => {
                    console.log(err);
                    process.exit();
                })
        });
})();