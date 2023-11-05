import { ChangePage } from "./navigation.js";
import { StartDB } from "./indexedDb.js";
import { dbStores } from "./indexedDBSettings.js";
import { GetFile, GetImageFile, GetPDFFile } from "./objectUtils.js";
/*
    Two functions to start the database. StartDB is used when you are setting up
    the database for the first time, and will insert one employer and one applicant
    profile into their respective stores and 3 images
    **** ONLY USE IT ONCE **** comment it out after use and use OpenDataBase ever after.
    You can find the code for both in the indexedDb.js file
*/
StartDB(dbStores);
//OpenDataBase(dbStores);
//file input event listeners - to handle loading external files such as csv, images,
// and attachments like CVs (not implemented)
const loadJobsData = document.getElementById('load-jobs-data');
loadJobsData.addEventListener("change", (event) => GetFile(event));
const loadImageData = document.getElementById('load-image-data');
loadImageData.addEventListener("change", (event) => GetImageFile(event));
const loadPDFData = document.getElementById('load-pdf-data');
loadPDFData.addEventListener("change", (event) => GetPDFFile(event));
const UpdateSection = () => {
    const args = location.hash.split('?'); /*Separate off the hash string from args*/
    const action = args.shift().substring(1);
    ChangePage(action, args); /*Where the magic happens*/
};
if (!location.hash) {
    location.hash = "#AddData?display";
}
UpdateSection();
window.addEventListener("hashchange", () => {
    UpdateSection();
});
