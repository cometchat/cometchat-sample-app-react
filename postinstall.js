const fs = require('fs-extra');
const request = require('request');
const extract = require('extract-zip')
const rimraf = require("rimraf");

const fileName = "cometchat-uikit-react";
const filePath = __dirname + "/src/" + fileName;

const zipFileName = "cometchat-uikit-react-3";

const zipName = zipFileName + ".zip";
const source = __dirname + "/" + zipFileName;
const destination = filePath;

const downloadUrl = "https://github.com/cometchat/cometchat-uikit-react/archive/v3.zip";


const download = (uri, filename, callback) => {
    request.head(uri, (err, res, body) => {
        console.log('content-type:', res.headers['content-type']);
        console.log('content-length:', res.headers['content-length']);

        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
};

const checkIfFolderExists = (path) => {
    if (fs.existsSync(path)) {

        console.log("File exists", path);
        return true;
    }
    return false;
}

const deleteFileFolder = (target) => {

    console.log("deleting file", target);
    rimraf.sync(target);
}



if (checkIfFolderExists(filePath)) {
    deleteFileFolder(filePath);
}

download(downloadUrl, zipName, (props) => {

    try {
        extract(zipName, { dir: __dirname }).then(response => {

            fs.move(source, destination, error => {
                if (error) {
                    return console.error('move file error!', error);
                }
                const oldFilePath = __dirname + "/src/cometchat-uikit-react";
                const newFilePath = __dirname + "/src/cometchat-chat-uikit-react";

                fs.rename(oldFilePath, newFilePath, function (err) {
                    if (err) {
                        console.log('ERROR: ' + err);
                        return;
                    }
                    console.log("Renamed file successfully!");
                });
                console.log('move file success!');
            });

            const zipFile = __dirname + "/" + zipName;
            if (checkIfFolderExists(zipFile)) {
                deleteFileFolder(zipFile);
            }
        });

    } catch (error) {
        console.log("File extraction error", zipName);
    }
});
