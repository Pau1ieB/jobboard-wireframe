const applicantProfile = {
    data: []
};
export const UpdateApplicantProfile = (name, value) => {
    const profile = applicantProfile.data.find(ej => ej.name == name);
    profile.value = value;
};
export const UpdateMultipleApplicantProfileProperties = (props) => {
    applicantProfile.data = [];
    props.forEach(obj => {
        applicantProfile.data.push(obj);
    });
};
export const ResetApplicantProfile = () => {
    applicantProfile.data = [];
};
export const GetApplicantProfile = () => applicantProfile;
export const GetApplicantProfileProperty = (prop) => applicantProfile.data.find(o => o.name == prop);
export const ApplicantProfileTableString = () => `
    <table>
        ${applicantProfile.data.map(o => ApplicantProfileTableRow(o)).join('')}
    </table>
`;
const ApplicantProfileTableRow = (profile) => `
    <tr>
        <td><div class="table-content">${profile.name}</div></td>
        <td>${GetTableType(profile)}</td>
    </tr>
`;
const GetTableType = (profile) => `
    ${(profile.type === "text") ? `<input type="text" value='${profile.value}'>` :
    `<div class="table-content">${profile.value}</div>`}
`;
