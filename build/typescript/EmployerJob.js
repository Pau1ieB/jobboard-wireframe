const employerJob = {
    data: []
};
export const UpdateEmployerJob = (name, value) => {
    const job = employerJob.data.find(ej => ej.name == name);
    job.value = value;
};
export const UpdateMultipleEmployerJobProperties = (props) => {
    employerJob.data = [];
    props.forEach(obj => {
        employerJob.data.push(obj);
    });
};
export const ResetEmployerJob = () => {
    employerJob.data = [];
};
export const EmployerJob = () => employerJob;
export const EmployerJobTableString = () => `
    <table>
        ${employerJob.data.filter(o => (o.title != undefined)).map(o => EmployerJobTableRow(o)).join('')}
    </table>
`;
const EmployerJobTableRow = (job) => `
    <tr>
        <td><div class="table-content">${job.name}</div></td>
        <td>${GetTableType(job)}</td>
    </tr>
`;
const GetTableType = (job) => `
    ${(job.type === "text") ? `<input type="text" value='${job.value}'>` :
    (job.type === "dropdown") ? `${GetDropdown(job.value, job.list)}` :
        (job.type === "combo") ? `${GetCombo(job.value, job.list)}` :
            `<div class="table-content"></div>`}
`;
const GetDropdown = (value, list) => `
    <select>
        ${list === null || list === void 0 ? void 0 : list.map(o => GetDropdownOptions(o, value)).join('')}
    </select>
`;
const GetDropdownOptions = (o, value) => `
    ${(o === value) ? `<option selected>${o}</option>` : `<option>${o}</option>`}
`;
const GetCombo = (value, list) => {
    const split = value.split(',');
    return `
        <div data-combo="true" class="table-content">${value}
            <div class='combo-box'>
                ${list === null || list === void 0 ? void 0 : list.map(o => GetComboBox(o, split)).join('')}
            </div>
        </div>
    `;
};
const GetComboBox = (option, values) => {
    const check = (values.filter(v => v === option).length > 0) ? "<input checked type='checkbox'>" : "<input type='checkbox'>";
    return `
        <div class='combo-box-div'>
            ${check}
            <label>${option}</label>
        </div>`;
};
