const employerProfile = {
    companyName: { title: "Company Name", name: "", input: "text", tableOpen: '<td>', tableClose: '</td>' },
    companyWebsite: { title: "Company Website", name: "", input: "text", tableOpen: '<td>', tableClose: '</td>' },
    companyLogo: { title: "Company Logo", name: "", input: "text", tableOpen: '<td>', tableClose: '</td>' },
    employerName: { title: "Employer Name", name: "", input: "text", tableOpen: '<td>', tableClose: '</td>' },
    phoneNumber: { title: "Phone Number", name: "", input: "text", tableOpen: '<td>', tableClose: '</td>' },
    email: { title: "Email", name: "", input: "text", tableOpen: '<td>', tableClose: '</td>' },
    profilePicture: { title: "Profile Picture", name: "", input: "text/file", tableOpen: '<td>', tableClose: '</td>' }
};
const employerCategories = [
    "Accounts", "Admin/Maintenance/Security/Datawarehousing", "Advertising", "Corporate Planning/Consulting/Strategy", "Institutional Sales",
    "Online/Digital Marketing", "Operations", "Programming & Design", "QA/Testing/Documentation", "R&D", "Retail Sales", "Voice"
];
const employerLocations = [
    "Birmingham", "Bristol", "Cambridge", "Glasgow", "Leeds", "London", "Manchester", "Milton Keynes", "Newcastle", "Oxford", "Portsmouth", "Southampton"
];
export const UpdateEmployerProfile = (key, value) => {
    employerProfile[key].name = value;
};
export const UpdateMultipleEmployerProfileProperties = (props) => {
    props.forEach(obj => {
        employerProfile[obj[0]].name = obj[1];
    });
};
export const ResetEmployerProfile = () => {
    UpdateMultipleEmployerProfileProperties([
        ["companyName", ""],
        ["companyWebsite", ""],
        ["companyLogo", ""],
        ["employerName", ""],
        ["phoneNumber", ""],
        ["email", ""],
        ["profilePicture", ""]
    ]);
};
export const CurrentEmployer = () => employerProfile;
export const GetEmployerCategories = () => employerCategories;
export const GetEmployerLocations = () => employerLocations;
export const EmployerProfileTableString = () => `
    <table>
    ${Object.entries(employerProfile).map(o => EmployerProfileTableRow(o)).join('')}
    </table>
`;
const EmployerProfileTableRow = (o) => `
    <tr>
        <td><div class="table-content">${o[1].title}</div></td>
        <td>${(o[0] === 'profilePicture') ? File_TableEntry(o[1].name) : EditableTableEntry(o[1].name)}</td>
    </tr>
`;
const EditableTableEntry = (name) => `<input type='text' value=${name}>`;
const File_TableEntry = (name) => `<div class="table-content">${name}</div>`;
