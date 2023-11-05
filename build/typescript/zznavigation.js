var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { OpenFileDialog } from "./jobsData.js";
import { CreateProfile, GetProfileProperty, ProfileTableString, IsChangeToProfile, PrepareProfileForSave } from "./profileFunctions.js";
import { ApplicantProfileGenerator, EmployerProfileGenerator, EmptyJobsProfileGenerator, JobProfileGenerator } from "./profileGenerators.js";
import { ReadData, WriteSingleData, PutData, DeleteData } from "./indexedDb.js";
import { GetJobsData, NavigateJobResultsDown, NavigateJobResultsUp, ChangeCurrentResultsPage, ResetJobsDataPage, GenerateJobForRecords, currentResultsPage } from "./jobsData.js";
import { GetAllInputValues, ResetAnchorElementHref } from "./objectUtils.js";
const content = document.getElementById('main');
/*
    'currentEmployer' and 'currentApplicant' are loaded from IndexedDB when there respective
    dashboards are selected. The data is converted into any objects for each property - defined
    by 'profileOption' - and kept in an array. currentJob is similar, and is created when a job is
    selected for a 'Profile Page'
*/
let currentEmployer = [];
let currentApplicant = [];
let currentJob = [];
export const ChangePage = (nextSection, targetValues) => __awaiter(void 0, void 0, void 0, function* () {
    if (nextSection === "addData") {
        content.innerHTML = AddDataPage();
        OpenFileDialog();
    }
    else if (nextSection === "mainPage") {
        ResetJobsDataPage();
        const tableString = yield GetCurrentTableString();
        content.innerHTML = (currentEmployer.length > 0) ?
            EmployerDashboard("Digital Native", "DN-Logo.png", "anon-person.png", tableString) :
            (currentApplicant.length > 0) ?
                MainPage(mainPageLoginButtons(false), tableString) :
                MainPage(mainPageLoginButtons(true), tableString);
        SetJobsNavigation();
    }
    else if (nextSection === "employerProfile") {
        if (currentEmployer.length == 0) {
            const response = yield ReadData("employers", "companyName", "Digital Native", []);
            CreateProfile(currentEmployer, EmployerProfileGenerator(response.data[0]));
        }
        const companyName = GetProfileProperty("companyName", currentEmployer);
        const piccy = GetProfileProperty("profilePicture", currentEmployer);
        content.innerHTML = EmployerProfile(companyName.value, piccy.value, ProfileTableString(currentEmployer));
    }
    else if (nextSection === "SaveEmployerProfile") {
        const inputValues = GetAllInputValues();
        if (IsChangeToProfile(currentEmployer, inputValues.values)) {
            const response = yield PutData("employers", PrepareProfileForSave(currentEmployer));
            console.log(response);
            location.hash = "#mainPage";
        }
        else
            location.hash = "#mainPage";
    }
    else if (nextSection === "exitEmployerDashboard") {
        currentEmployer = [];
        location.hash = "#mainPage";
    }
    else if (nextSection === "applicantProfile") {
        if (currentApplicant.length == 0) {
            const response = yield ReadData("applicants", "id", 1, []);
            CreateProfile(currentApplicant, ApplicantProfileGenerator(response.data[0]));
        }
        const name = GetProfileProperty("name", currentApplicant);
        const piccy = GetProfileProperty("profilePicture", currentApplicant);
        content.innerHTML = ApplicantProfile(name.value, piccy.value, ProfileTableString(currentApplicant));
    }
    else if (nextSection === "SaveApplicantProfile") {
        const inputValues = GetAllInputValues();
        if (IsChangeToProfile(currentApplicant, inputValues.values)) {
            const response = yield PutData("applicants", PrepareProfileForSave(currentApplicant));
            console.log(response);
            location.hash = "#mainPage";
        }
        else
            location.hash = "#mainPage";
    }
    else if (nextSection === "addNewJob") {
        const name = GetProfileProperty("companyName", currentEmployer);
        const piccy = GetProfileProperty("profilePicture", currentEmployer);
        const emptyJob = [];
        CreateProfile(emptyJob, EmptyJobsProfileGenerator(name.value));
        content.innerHTML = AddNewJob(name.value, piccy.value, ProfileTableString(emptyJob));
    }
    else if (nextSection === "applicantJobPage") {
        const response = yield ReadData("jobs", "id", parseInt(targetValues[0]), []);
        CreateProfile(currentJob, JobProfileGenerator(response.data[0]));
        const jobApplicants = GetProfileProperty("applicants", currentJob);
        const id = GetProfileProperty("id", currentApplicant);
        content.innerHTML = ApplicantJobPage(ApplyForButton(jobApplicants.value.includes(id.value)), ProfileTableString(currentJob));
    }
    else if (nextSection === "exitApplicantDashboard") {
        currentApplicant = [];
        location.hash = "#mainPage";
    }
    else if (nextSection === "pickRecord") {
        if (targetValues[0] === "delete") {
            if (confirm("Do you really want to delete this record?")) {
                const response = yield DeleteData("jobs", parseInt(targetValues[1]));
                console.log(response);
            }
            location.hash = "#mainPage";
        }
        else if (targetValues[0] === "edit") {
            const response = yield ReadData("jobs", "id", parseInt(targetValues[1]), []);
            CreateProfile(currentJob, JobProfileGenerator(response.data[0]));
            const companyName = GetProfileProperty("companyName", currentEmployer);
            const piccy = GetProfileProperty("profilePicture", currentEmployer);
            content.innerHTML = EditJob(companyName.value, piccy.value, ProfileTableString(currentJob));
        }
    }
    else if (nextSection === "SaveNewJob") {
        const inputValues = GetAllInputValues();
        if (inputValues.filledCount < inputValues.maxCount) {
            if (!confirm("You have empty values. Do you want to save the job without filling them in?")) {
                const elem = document.querySelector("a");
                ResetAnchorElementHref(elem);
                return;
            }
        }
        const name = GetProfileProperty("companyName", currentEmployer);
        const newJob = GenerateJobForRecords(inputValues.values, name.value, null);
        const response = yield WriteSingleData("jobs", newJob);
        console.log(response);
        alert("Page Saved");
        location.hash = "#mainPage";
    }
    else if (nextSection === "DontSaveNewJob") {
        const inputValues = GetAllInputValues();
        if (inputValues.filledCount > 0) {
            if (!confirm("Do you want to leave without saving the job?")) {
                const elem = [...document.querySelectorAll("a")][1];
                ResetAnchorElementHref(elem);
                return;
            }
        }
        location.hash = "#mainPage";
    }
    else if (nextSection === "UpdateJob") {
        const inputValues = GetAllInputValues();
        if (inputValues.emptyCount == inputValues.maxCount) {
            if (!confirm("You have an empty job. If you continue this will delete the current job. Do you want to continue?")) {
                const elem = document.querySelector("a");
                ResetAnchorElementHref(elem);
                return;
            }
            else {
                const response = yield DeleteData("jobs", parseInt(targetValues[1]));
                console.log(response);
                location.hash = "#mainPage";
            }
        }
        if (IsChangeToProfile(currentJob, inputValues.values)) {
            const response = yield PutData("jobs", PrepareProfileForSave(currentJob));
            console.log(response);
            currentJob = [];
            location.hash = "#mainPage";
        }
        else
            location.hash = "#mainPage";
    }
    else if (nextSection === "AbandonUpdateJob") {
        const inputValues = GetAllInputValues();
        if (IsChangeToProfile(currentJob, inputValues.values)) {
            if (!confirm("Do you want to leave without saving your updates?")) {
                const response = yield PutData("jobs", PrepareProfileForSave(currentJob));
                console.log(response);
            }
        }
        currentJob = [];
        location.hash = "#mainPage";
    }
    else if (nextSection === "ApplyForJob") {
        const jobApplicants = GetProfileProperty("applicants", currentJob);
        const id = GetProfileProperty("id", currentApplicant);
        let message = "Applied!";
        if (targetValues[0] === "false") {
            jobApplicants.value = jobApplicants.value.filter((val) => val != parseInt(id.value));
            message = "Application Withdrawn";
        }
        else {
            jobApplicants.value.push(id.value);
        }
        const response = yield PutData("jobs", PrepareProfileForSave(currentJob));
        console.log(response);
        currentJob = [];
        alert(message);
        location.hash = "#mainPage";
    }
});
const AddDataPage = () => `
    <div class="dynamic-container add-data">
        <a href='#mainPage'><button class='grey-btn'>Back</button></a>
        <section>
            <input id='load-jobs-data' type='file'>
            <label>File Loader</label>
            <button id='load-jobs-button' class='grey-btn'>Submit</button>
        </section>
    </div>
`;
const MainPage = (loginButtons, tableString) => `
    <div class="dynamic-container main-page">
        ${loginButtons}
        <section id='section'>${tableString}</section>
        <button id='changeJobResultsDown'>&lt;</button>
        <input data-pageNav='true' id='currentResultsPage' value='1'></input>
        <button id='changeJobResultsUp'>&gt;</button>
    </div>
`;
const EmployerProfile = (companyName, profilePicture, tableString) => `
    <div class="dynamic-container employee-profile">
        <label>Welcome: ${companyName}</label>
        <a href='#SaveEmployerProfile'><button>Back</button></a>
        <div class='profile-picture'><img src=${profilePicture}></div>
        <section>
            ${tableString}
        </section>
   
    </div>    
`;
const EmployerDashboard = (employer, logoPath, profilePicturePath, tableString) => `
    <div class="dynamic-container employer-dashboard">
        <img src=${logoPath}>
        <label class='welcome-employer'>Welcome: ${employer}</label>
        <a href='#exitEmployerDashboard'><button>Exit</button></a>
        <a href='#'><button>Login</button></a>
        <a href='#employerProfile'><button>Profile</button></a>
        <div class='profile-picture'><img src=${profilePicturePath}></div>
        <section id='section'>
            ${tableString}
        </section>
        <button id='changeJobResultsDown'>&lt;</button>
        <input data-pageNav='true' id='currentResultsPage' value='1'></input>
        <button id='changeJobResultsUp'>&gt;</button>
        <a href='#addNewJob'><button>Add New Job</button></a>       
    </div>
`;
const ApplicantProfile = (applicant, profilePicturePath, table) => `
    <div class="dynamic-container applicant-profile">
        <label>Welcome: ${applicant}</label>
        <a href='#SaveApplicantProfile'><button>back</button></a>
        <div class='profile-picture'><img src=${profilePicturePath}></div>
        <section>
            ${table}
        </section>
    </div
`;
const ApplicantJobPage = (applyButton, tableString) => `
    <div class="dynamic-container applicant-job-page">
        ${applyButton}
        <a href='#mainPage'><button>Back</button></a>
        <section>${tableString}</section>
    </div
`;
const EditJob = (employer, profilePicturePath, table) => `
    <div class="dynamic-container add-new-job">
        <label>Welcome: ${employer}</label>
        <a href='#UpdateJob?true'><button>Save</button></a>
        <a href='#AbandonUpdateJob?true'><button>Cancel</button></a>
        <div class='profile-picture'><img src=${profilePicturePath}></div>
        <section>
            ${table}
        </section>
    </div
`;
const AddNewJob = (employer, profilePicturePath, table) => `
    <div class="dynamic-container add-new-job">
        <label>Welcome: ${employer}</label>
        <a href='#SaveNewJob?false'><button>Save</button></a>
        <a href='#DontSaveNewJob?false'><button>Back</button></a>
        <div class='profile-picture'><img src=${profilePicturePath}></div>
        <section>
            ${table}
        </section>
    </div
`;
const mainPageLoginButtons = (show) => (show) ?
    `
    <a href='#employerProfile'><button>Employer Profile</button></a>
    <a href='#applicantProfile'><button>Applicant Profile</button></a>
` :
    `
    <a href='#exitApplicantDashboard'><button>Exit</button></a>
    <a href='#applicantProfile'><button>Profile</button></a>
`;
const GetCurrentTableString = () => __awaiter(void 0, void 0, void 0, function* () {
    let name = "";
    let type = "main";
    if (currentEmployer.length > 0) {
        name = GetProfileProperty("companyName", currentEmployer).value;
        type = GetProfileProperty("type", currentEmployer).value;
    }
    else if (currentApplicant.length > 0) {
        type = GetProfileProperty("type", currentApplicant).value;
    }
    const tableString = yield GetJobsData(name, type);
    return tableString;
});
const ApplyForButton = (apply) => (!apply) ? `<a href='#ApplyForJob?true'><button>Apply</button></a>` : `<a href='#ApplyForJob?false'><button>Remove Application</button></a>`;
const SetJobsNavigation = () => {
    var _a, _b, _c;
    (_a = document.getElementById("changeJobResultsDown")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
        if (NavigateJobResultsDown()) {
            const tableString = yield GetCurrentTableString();
            const elem = document.getElementById("section");
            if (elem != null)
                elem.innerHTML = tableString;
            const input = document.getElementById("currentResultsPage");
            if (input != null)
                input.value = currentResultsPage().toString();
        }
    }));
    (_b = document.getElementById("changeJobResultsUp")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
        if (NavigateJobResultsUp()) {
            const tableString = yield GetCurrentTableString();
            const elem = document.getElementById("section");
            if (elem != null)
                elem.innerHTML = tableString;
            const input = document.getElementById("currentResultsPage");
            if (input != null)
                input.value = currentResultsPage().toString();
        }
    }));
    (_c = document.getElementById("currentResultsPage")) === null || _c === void 0 ? void 0 : _c.addEventListener("change", (event) => __awaiter(void 0, void 0, void 0, function* () {
        if (event.target != null) {
            const value = event.target.value;
            if (ChangeCurrentResultsPage(value)) {
                const tableString = yield GetCurrentTableString();
                const elem = document.getElementById("section");
                if (elem != null)
                    elem.innerHTML = tableString;
                event.target.value = currentResultsPage().toString();
            }
            else
                event.target.value = currentResultsPage().toString();
        }
    }));
};
