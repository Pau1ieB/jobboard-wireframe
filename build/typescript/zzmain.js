import { ChangePage } from "./navigation.js";
import { OpenDataBase } from "./indexedDb.js";
import { dbStores } from "./indexedDBSettings.js";
/*
    Two functions to start the database. StartDB is used when you are setting up
    the database for the first time, and will insert one employer and one applicant
    profile into their respective stores.
    **** ONLY USE IT ONCE **** comment it out after use and use OpenDataBase ever after.
    You can find the code for both in the indexedDb.js file
*/
//StartDB(dbStores);
OpenDataBase(dbStores);
/*
    Some of the location hashes have parameters embedded
    Each parameter is separated by a '?'
    Splitting any hash that 'includes' a '?' produces the hash string and one or more parmeters.
    The parameters are housed in targetValues.
*/
const UpdateSection = () => {
    let nextSection = location.hash.substring(1);
    let targetValues = [];
    if (location.hash.includes("?")) {
        const split = nextSection.split('?');
        nextSection = split.shift();
        targetValues = split;
    }
    ChangePage(nextSection, targetValues); /*Where the magic happens*/
};
if (!location.hash) {
    location.hash = "#addData";
}
UpdateSection();
window.addEventListener("hashchange", () => {
    UpdateSection();
});
