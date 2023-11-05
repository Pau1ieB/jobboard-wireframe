export const UpdateProfile = (profile, name, value) => {
    const prop = profile.find(p => p.name == name);
    prop.value = value;
};
export const IsChangeToProfile = (profile, data) => {
    let response = false;
    data.forEach((obj) => {
        const prop = GetProfileProperty(obj.id, profile);
        if (prop.value !== obj.value)
            response = true;
        prop.value = obj.value;
    });
    return response;
};
export const GetProfileProperty = (name, profile) => profile.find(o => o.name == name);
export const CreateProfile = (profile, data) => {
    data.forEach(o => profile.push(Inflate(o)));
};
export const PrepareProfileForSave = (profile) => {
    let exportObj = {};
    profile.forEach((d) => {
        exportObj[d.name] = d.value;
    });
    return exportObj;
};
const Inflate = (o) => (o.length == 2) ? { name: o[0], value: o[1], title: "", type: "", list: [] } :
    (o.length == 3) ? { name: o[0], value: o[1], title: o[2], type: "", list: [] } :
        (o.length == 4) ? { name: o[0], value: o[1], title: o[2], type: o[3], list: [] } :
            { name: o[0], value: o[1], title: o[2], type: o[3], list: o[4] };
export const ProfileTableString = (profile) => `
    <table>
        ${profile.filter(o => o.title != "").map(o => GetProfileTableRow(o)).join('')}
    </table>
`;
export const GetProfileTableRow = (profileObject) => `
    <tr>
        <td><div class="table-content">${profileObject.title}</div></td>
        <td>${GetTableValueType(profileObject)}</td>
    </tr>
`;
const GetTableValueType = (profileObject) => `
    ${(profileObject.type === "text") ? `<input id='${profileObject.name}' type="text" value='${profileObject.value}' placeholder='Enter Value'>` :
    `<div class="table-content">${profileObject.value}</div>`}
`;
