var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { GetFile } from "./objectUtils.js";
import { WriteMultipleData, ReadDataByRange } from "./indexedDb.js";
import { DeleteObjectProperties, GetDateNow } from "./objectUtils.js";
const currentPage = { lower: 0, upper: 10, current: 1, step: 10 };
const GetCurrentPageOfResults = (type) => __awaiter(void 0, void 0, void 0, function* () {
    let response;
    if (type === "main")
        response = yield ReadDataByRange("jobs", currentPage.lower, currentPage.upper);
    return response;
});
const MakeTableRows = (obj, type, id) => {
    const detailsButton = (type === "employer") ? `<td><a href='#pickRecord?edit?${id}'><button>Edit</button></a><a href='#pickRecord?delete?${id}'><button>Delete</button></a></td>` :
        (type === "applicant") ? `<td><a href='#applicantJobPage?${id}'><button>Apply</button></a>` : "";
    return `
        <tr>
            ${Object.entries(obj).map((e) => `<td>${e[1]}</td>`).join('')}
            ${detailsButton}
        </tr>
    `;
};
const MakeTableOfResults = (rows, detailsButton) => `
    <table>
        <tr>
            <th>Role Category</th>
            <th>Role</th>
            <th>Location</th>
            <th>Industry</th>
            <th>Function</th>
            <th>Job Title</th>
            <th>Salary</th>
            <th>Experience</th>
            ${detailsButton}
        </tr>
        ${rows}
    </table>`;
export const GetJobsData = (name, type) => __awaiter(void 0, void 0, void 0, function* () {
    const results = yield GetCurrentPageOfResults("main");
    if (results.ok == 0) {
        alert(results.message);
        return '';
    }
    else if (results.ok == 1)
        return '';
    const tableRowString = results.data.map((obj) => {
        const id = obj.id;
        obj = DeleteObjectProperties(obj, ["id", "uniqId", "company", "creationTimestamp", "keySkills", "applicants"]);
        return MakeTableRows(obj, type, id);
    }).join('');
    return MakeTableOfResults(tableRowString, "");
});
export const NavigateJobResultsUp = () => {
    if (currentPage.upper == 96)
        return false;
    currentPage.lower = currentPage.upper;
    currentPage.upper += 10;
    currentPage.current += 1;
    return true;
};
export const NavigateJobResultsDown = () => {
    if (currentPage.lower - 10 < 0)
        return false;
    currentPage.upper = currentPage.lower;
    currentPage.lower -= 10;
    currentPage.current -= 1;
    return true;
};
export const ChangeCurrentResultsPage = (value) => {
    const num = Number(value);
    if (Number.isNaN(num) || num < 1 || num > 16 || num == currentPage.current)
        return false;
    currentPage.current = num;
    currentPage.upper = num * 6;
    currentPage.lower = currentPage.upper - 6;
    return true;
};
export const ResetJobsDataPage = () => {
    currentPage.lower = 0;
    currentPage.upper = 10;
    currentPage.current = 1;
};
export const currentResultsPage = () => currentPage.current;
export const GenerateJobForRecords = (data, companyName, job) => {
    if (companyName.length > 0)
        job = { uniqId: "", creationTimestamp: GetDateNow(), company: companyName };
    data.forEach((elem) => {
        job[elem.id] = elem.value;
    });
    return job;
};
export const OpenFileDialog = () => {
    const loadJobButton = document.getElementById('load-jobs-button');
    const loadJobsData = document.getElementById('load-jobs-data');
    loadJobButton.addEventListener("click", () => loadJobsData.click());
    loadJobsData.addEventListener("change", (event) => GetFile(event, JobsDefrag));
};
const JobsDefrag = (data) => __awaiter(void 0, void 0, void 0, function* () {
    let split = data.split("\r\n");
    split.shift();
    const list_to_save = [];
    split.forEach((str) => {
        const parts = SplitString(str);
        if (parts.length == 12) {
            list_to_save.push({
                uniqId: parts[0].trim(),
                company: parts[1].trim(),
                creationTimestamp: parts[2].trim(),
                roleCategory: parts[3].trim(),
                role: parts[4].trim(),
                location: parts[5].trim(),
                function: parts[6].trim(),
                industry: parts[7].trim(),
                title: parts[8].trim(),
                salary: parts[9].trim(),
                experience: parts[10].trim(),
                keySkills: parts[11].trim(),
                applicants: []
            });
        }
    });
    const list = [];
    for (let i = 1; i < 100; i++)
        list.push(list_to_save[i]);
    const response = yield WriteMultipleData("jobs", list);
    console.log(response);
    alert("CSV loaded into IndexedDB");
});
const SplitString = (str) => {
    let index1 = 0;
    let index2 = 0;
    let split = true;
    let list = [];
    while (index2 > -1) {
        index2 = str.indexOf('"', index1);
        if (index2 != -1) {
            if (split) {
                const newStr = str.substring(index1, index2 - 1);
                if (newStr !== ',') {
                    const newStrSplit = newStr.split(',');
                    newStrSplit.forEach(s => {
                        list.push(s);
                    });
                }
                index1 = index2 + 1;
            }
            if (!split) {
                let newStr = str.substring(index1, index2);
                newStr = newStr.replace(/,/g, "/");
                list.push(newStr);
                index1 = index2 + 2;
            }
            split = !split;
        }
    }
    const newStr = str.substring(index1).split(',');
    newStr.forEach(s => {
        if (s.length > 0)
            list.push(s);
    });
    return list;
};
