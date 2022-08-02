/** Following https://javascript.plainenglish.io/how-to-create-zip-files-with-node-js-505e720ceee1 */

const path = require('path');
const fs = require('fs');
const { readdir } = require('fs').promises;
var JSZip = require("jszip");

class AutomateZip {
    /** Declaring  */
    directoryPath = '';
    resultPath = '';
    chunkSize = null;
    parameters = [
        {
            question: 'Digite o diretório de origem dos arquivos :',
            assignValue: (value) => { this.directoryPath = value }
        },
        {
            question: 'Digite o diretório de destino dos arquivos :',
            assignValue: (value) => { this.resultPath = value }
        },
        {
            question: 'Digite a quantidade de arquivos por zip :',
            assignValue: (value) => { this.chunkSize = Number(value) }
        }
    ]

    /** Function to get parameter from console */
    getParameter(string) {
        return new Promise(resolve => {
            try {
                process.stdout.write(string);
                process.stdin.on('data', data => {
                    const name = data.toString().trim();
                    resolve(name)
                });
            } catch (e) {
                throw `From get parameter function: \n${e}`
            }

        });
    }

    /** Function to get all parameters from a array */
    async getAllParameters(arr) {
        try {            
            for (let a of arr) {
                await this.getParameter(a.question)
                    .then(a.assignValue)
            }            
            console.log('\n');
            return
        } catch (e) {
            throw `From get all parameters function: \n${e}`
        }
    }

    /** Function to get all files from a folder and handle it */
    async readFiles(directoryPath, chunkSize, resultPath) {
        try {
            const files = await readdir(directoryPath);

            if (files.length < 1) throw `Diretório indicado não contem arquivos`;
            if (chunkSize == 0) throw `Quantidade de arquivos por zip não pode ser 0`

            var index = 0;
            for (let i = 0; i < files.length; i += chunkSize) {
                const chunk = files.slice(i, i + chunkSize);
                index++;
                await this.generateZip(chunk, resultPath, index, directoryPath)
                    .then(console.log)
                    .catch(console.log)
            }
            return '\nAll file has been zipped !!!'
        } catch (err) {
            throw `From read files function: \n${err}`;
        }
    }

    /** Function to zip an array of files into a folder */
    generateZip(files, destinationPath, index, directoryPath) {
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
}

module.exports = { AutomateZip };