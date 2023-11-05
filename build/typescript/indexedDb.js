var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const DB_VERSION = 1;
const dbName = "JobBoardDatabase";
let db = null;
//check used for page refresh.
export const CheckDB = () => {
    return !(db == null);
};
//start / setup database
export const OpenDataBase = (settings) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield new Promise((res) => {
        const request = window.indexedDB.open(dbName, DB_VERSION);
        request.onsuccess = event => {
            if (event.target != null) {
                const target = event.target;
                db = target.result;
                res({ ok: 1 });
            }
            else
                res({ ok: 0, message: "event.target==null" });
        };
        request.onerror = event => {
            const target = event.target;
            res({ ok: 0, message: "The Database Goofed!:" + target.errorCode });
        };
        //database setup. all store data is held in dbStores (passed here as settings)
        //and can be found in indexedDBSettings.ts
        request.onupgradeneeded = event => {
            if (event.currentTarget != null) {
                const target = event.currentTarget;
                settings.forEach(setting => {
                    const store = target.result.createObjectStore(setting.storeName, setting.storeOptions);
                    setting.storeData.forEach((data) => store.createIndex(data.name, data.name, data.options));
                });
            }
        };
    });
    return response;
});
//handles single Create(RUD) actions
export const WriteSingleData = (storeName, data) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield new Promise((res) => {
        if (db != null) {
            const request = db.transaction(storeName, "readwrite").objectStore(storeName).add(data);
            if (request != null) {
                request.onerror = (event) => {
                    const target = event.target;
                    res({ ok: 0, message: `Write error: ${target.errorCode}` });
                };
                request.onsuccess = (event) => {
                    if (event.target != null) {
                        const target = event.target;
                        res({ ok: 2, data: data, key: target.result });
                    }
                    else
                        res({ ok: 0, message: "event.target is null" });
                };
            }
            else
                res({ ok: 0, message: "request is null" });
        }
        else
            res({ ok: 0, message: "db is null or undefined" });
    });
    return response;
});
//handles multiple Create(RUD) actions
export const WriteMultipleData = (storeName, data) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield new Promise((res) => {
        if (db != null) {
            const store = db.transaction(storeName, "readwrite").objectStore(storeName);
            if (store != null) {
                const keys = [];
                data.forEach((o, i) => {
                    const request = store.add(o);
                    if (request != null) {
                        request.onerror = (event) => {
                            const target = event.target;
                            res({ ok: 0, message: `Write error: ${target.errorCode}` });
                        };
                        request.onsuccess = (event) => {
                            const target = event.target;
                            keys.push({ data: data, key: target.result });
                            if (i == data.length - 1)
                                return res({ ok: 2, data: keys });
                        };
                    }
                    else
                        res({ ok: 0, message: "request = null" });
                });
            }
            else
                res({ ok: 0, message: "No store found" });
        }
        else
            res({ ok: 0, message: "db undefined or null" });
    });
    return response;
});
//handles (C)Read(UD) actions. The props woudl allow filtering
//but obvs I haven't implemented it here (see further down)
export const ReadData = (storeName, index, value, prop) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield new Promise((res) => {
        if (db != null) {
            const transaction = (index === "id") ?
                db.transaction(storeName, "readonly").objectStore(storeName).get(value) :
                db.transaction(storeName, "readonly").objectStore(storeName).index(index).getAll(value);
            transaction.onsuccess = event => {
                const target = event.target;
                if (target != null) {
                    if (target.result == undefined)
                        res({ ok: 4 });
                    else {
                        let list = (typeof target.result === "object") ? [target.result] : target.result;
                        (list.length == 0) ? res({ ok: 5 }) : res({ ok: 2, data: list });
                    }
                }
                else
                    res({ ok: 6 });
            };
            transaction.onerror = event => {
                const target = event.target;
                res({ ok: 0, message: `Database error: ${target.errorCode}` });
            };
        }
        else
            res({ ok: 0, message: "Database returns null or undefined" });
    });
    return response;
});
//(C)read(UD) for values within range - allows pagination with primary key
export const ReadDataByRange = (storeName, rangeStart, rangeEnd) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield new Promise((res) => {
        if (db != null) {
            const store = db.transaction(storeName, "readonly").objectStore(storeName);
            if (store != null) {
                const keyRange = IDBKeyRange.bound(rangeStart, rangeEnd, true, false);
                const transaction = store.getAll(keyRange);
                transaction.onsuccess = event => {
                    const target = event.target;
                    if (target != null && target.result != undefined) {
                        let list = (target.result instanceof Array) ? target.result : [target.result];
                        (list.length == 0) ? res({ ok: 1, message: "No results found" }) : res({ ok: 2, data: list });
                    }
                    else
                        res({ ok: 0, message: "event.target==null or event.target.result == undefined" });
                };
                transaction.onerror = event => {
                    const target = event.target;
                    res({ ok: 0, message: `Error: ${target.errorCode}` });
                };
            }
            else
                res({ ok: 0, message: "Store is not found" });
        }
        else
            res({ ok: 0, message: "Database return null or undefined" });
    });
    return response;
});
//(C)read(UD) for values within range - allows pagination with a key other than
//the primary key. I use chained filter requests to achieve this
export const ReadDataByRangeAndKey = (storeName, index, value, rangeStart, rangeEnd) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield new Promise((res) => {
        if (db != null) {
            const indy = db.transaction(storeName, "readonly").objectStore(storeName).index(index);
            if (indy != null) {
                const transaction = indy.getAll();
                transaction.onsuccess = event => {
                    const target = event.target;
                    if (target != null && target.result != undefined) {
                        let list = (target.result instanceof Array) ? target.result : [target.result];
                        list = list.filter((obj) => (obj[index] === value)).filter((obj, i) => (i >= rangeStart && i < rangeEnd));
                        (list.length == 0) ? res({ ok: 1, message: "No results found" }) : res({ ok: 2, data: list });
                    }
                    else
                        res({ ok: 0, message: "event.target==null or event.target.result == undefined" });
                };
                transaction.onerror = event => {
                    const target = event.target;
                    res({ ok: 0, message: `Error: ${target.errorCode}` });
                };
            }
            else
                res({ ok: 0, message: "Store is not found" });
        }
        else
            res({ ok: 0, message: "Database return null or undefined" });
    });
    return response;
});
//(CR)Update(D) function
export const PutData = (storeName, data) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield new Promise((res) => {
        if (db != null) {
            const request = db.transaction([storeName], "readwrite").objectStore(storeName).put(data);
            request.onerror = (event) => { };
            request.onsuccess = (event) => { res({ ok: 2 }); };
        }
    });
    return response;
});
//(CRU)Delete function
export const DeleteData = (storeName, key) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield new Promise((res) => {
        if (db != null) {
            const request = db.transaction([storeName], "readwrite").objectStore(storeName).delete(key);
            request.onerror = (event) => { res({ ok: 0 }); };
            request.onsuccess = (event) => { res({ ok: 2 }); };
        }
    });
    return response;
});
//This function starts up the database, sets up the stores and loads in test
//profiles for applicant and employer.
//It also adds in 3 images for use in profiles / logos
//The function call can be found commented out in the main.ts file
//Delete the current indexedDB directory and run this command ONCE
//Then comment it out and just use the call to OpenDataBase only.
export const StartDB = (settings) => __awaiter(void 0, void 0, void 0, function* () {
    yield OpenDataBase(settings);
    yield WriteSingleData("applicants", {
        name: { value: 'Pradeep', display: "Name", type: "text" },
        type: { value: 'applicants' },
        phoneNumber: { value: '077230000', display: 'Phone Number', type: 'text' },
        email: { value: 'pB@Bali.com', display: 'Email', type: 'text' },
        profile: { value: "typescript-face.png", display: 'Profile Picture', type: 'file' },
        cv: { value: '', display: 'C.V.', type: 'file' },
        dashboard: { value: "ApplicantDashboard" }
    });
    yield WriteSingleData("employers", {
        name: { value: 'Digital Native' },
        type: { value: 'employers' },
        website: { value: 'https://www.dn-uk.com/', display: 'Company Website', type: 'text' },
        logo: { value: 'DN-Logo.png', display: 'Logo Picture', type: 'file' },
        employee: { value: 'John Smith', display: 'Employee Name', type: 'text' },
        phoneNumber: { value: "077230000", display: 'Phone Number', type: 'text' },
        email: { value: "js@dn-uk.com", display: 'Email', type: 'text' },
        profile: { value: "anon-person.png", display: 'Profile Picture', type: 'file' },
        dashboard: { value: "EmployerDashboard" }
    });
    const image = new Image();
    image.src = 'anon-person.png';
    let writeData = yield new Promise((res) => {
        image.onload = () => __awaiter(void 0, void 0, void 0, function* () {
            const data = ImageToData(image);
            const writeData = { name: 'anon-person.png', src: data };
            res(writeData);
        });
    });
    yield WriteSingleData('images', writeData);
    image.src = 'DN-Logo.png';
    writeData = yield new Promise((res) => {
        image.onload = () => __awaiter(void 0, void 0, void 0, function* () {
            const data = ImageToData(image);
            const writeData = { name: 'DN-Logo.png', src: data };
            res(writeData);
        });
    });
    yield WriteSingleData('images', writeData);
    image.src = 'typescript-face.png';
    writeData = yield new Promise((res) => {
        image.onload = () => __awaiter(void 0, void 0, void 0, function* () {
            const data = ImageToData(image);
            const writeData = { name: 'typescript-face.png', src: data };
            res(writeData);
        });
    });
    yield WriteSingleData('images', writeData);
});
const ImageToData = (image) => {
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    const context = canvas.getContext("2d");
    context.drawImage(image, 0, 0);
    return canvas.toDataURL();
};
