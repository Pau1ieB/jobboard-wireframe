const content = document.getElementById('main');
//updates the screen when a page changes
//action identifies the page to load (function calls are at the base
//of the page)
//tableString has generated data for the list of jobs table, or the 
//profile table
//navString handles the pagination for the page
//profileButtons sets up the required buttons on each profile page
export const SetDisplay = (action, profile, tableString, navString, profileButtons) => {
    content.innerHTML = displayList[action](profile, tableString, navString, profileButtons);
};
const AddData = (profile, tableString, navString) => `
    <div class='grid-container'>
        ${GetButton("grid-area: 2/2/3/4", "Back", "#MainPage?display")}
        <section data-type='add-data'>
            ${GetLabel('grid-area: 2/2/3/3', 'File Loader', "data-border='true'")}
            ${GetButton('grid-area: 3/2/4/3', 'Submit', '#LoadFile?true')}
        </section>
    </div>
`;
const MainPage = (profile, tableString, navString) => `
    <div class='grid-container'>
        ${GetButton("grid-area: 2/13/3/16", "Employer", "#LoginProfile?display?employers")}
        ${GetButton("grid-area: 3/13/4/16", "Applicant", "#LoginProfile?display?applicants")}
        <section>
            ${tableString}
        </section>
        ${navString}
    </div>
`;
const LoginProfile = (profile, tableString, navString) => `
    <div class='grid-container'>
        ${GetLabel("grid-area: 2/2/3/4", `Welcome: ${profile.name.value}`, "data-border='true'")}
        ${GetButton("grid-area: 3/2/4/4", "Back", `#${profile.dashboard.value}?display`)}
        ${GetImage("profile-picture", profile.profileImage)}
        <section data-type='profile'>
            ${tableString}
        </section>
        ${navString}
    </div>
`;
const Profile = (profile, tableString, navString, profileButtons) => `
    <div class='grid-container'>
        ${GetButton("grid-area: 2/2/3/4", profileButtons[0].text, profileButtons[0].hash)}
        ${GetButton("grid-area: 3/2/4/4", profileButtons[1].text, profileButtons[1].hash)}
        ${GetImage("profile-picture", profile.profileImage)}
        <section data-type='profile'>
            ${tableString}
        </section>
        ${navString}
    </div>
`;
const ViewApplicant = (profile, tableString, navString) => `
    <div class='grid-container'>
        ${GetButton("grid-area: 2/2/3/4", "Back", `#EmployerDashboard?display`)}
        ${GetImage("profile-picture", profile.profileImage)}
        <section data-type='profile'>
            ${tableString}
        </section>
        ${navString}
    </div>
`;
const EmployerDashboard = (profile, tableString, navString) => `
    <div class='grid-container'>
        ${GetImage("logo", profile.logoImage)}
        ${GetLabel("grid-area:2/5/4/12", `Welcome: ${profile.name.value}`, "")}
        ${GetButton("grid-area: 2/12/3/13", "Exit", `#MainPage?display?noprofile`)}
        ${GetButton("grid-area: 2/13/3/14", "Login", "#Duff")}
        ${GetButton("grid-area: 3/13/4/14", "Profile", '#Profile?display')}
        ${GetImage("profile-picture", profile.profileImage)}
        <section>
            ${tableString}
        </section>
        ${navString}
        ${GetButton("grid-area: 7/14/8/16", "Add Job", "#NewJobProfile?display")}
    </div>
`;
const ApplicantDashboard = (profile, tableString, navString) => `
    <div class='grid-container'>
        ${GetLabel("grid-area:2/5/4/12", `Welcome: ${profile.name.value}`, "")}
        ${GetButton("grid-area: 2/13/3/14", "Exit", "#MainPage?display?noprofile")}
        ${GetButton("grid-area: 3/13/4/14", "Profile", '#Profile?display')}
        ${GetImage("profile-picture", profile.profileImage)}
        <section>
            ${tableString}
        </section>
        ${navString}
    </div>
`;
const GetButton = (pos, text, action) => `
    <a href='${action}' style='${pos}'><button>${text}</button></a>
`;
const GetLabel = (pos, text, border) => `
    <label style='${pos}' ${border}>${text}</label>
`;
const GetImage = (style, fileName) => `
    <div class='${style}'>
        <img src='${fileName}'>
    </div>
`;
//used to retrieve the required page string
//replaces 'if-else' and 'switch'
const displayList = {
    'AddData': AddData,
    'MainPage': MainPage,
    'LoginProfile': LoginProfile,
    'Profile': Profile,
    'EmployerDashboard': EmployerDashboard,
    'ApplicantDashboard': ApplicantDashboard,
    'NewJobProfile': Profile,
    'EditJobProfile': Profile,
    'ApplyJobProfile': Profile,
    'ViewApplicant': ViewApplicant
};
