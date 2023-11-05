//generates a new profile when 'Add Job' is selected
export const NewJobProfileGenerator = (profile) => {
    const jobProfile = {
        "type": { value: 'jobs' },
        "uniqId": { value: '' },
        "creationTimestamp": { value: '' },
        "keySkills": { value: '' },
        "company": { value: profile.name.value, display: "Company", type: "" },
        "roleCategory": { value: '', display: "Role Category", type: "dropdown", list: [] },
        "role": { value: '', display: "Role", type: "text" },
        "location": { value: '', display: "Location", type: "combo", list: [] },
        "industry": { value: '', display: "Industry", type: "text" },
        "function": { value: '', display: "Function", type: "text" },
        "title": { value: '', display: "Job Title", type: "text" },
        "experience": { value: "", display: "Experience", type: 'text' },
        "salary": { value: '', display: 'Salary', type: 'text' },
        'applicants': { value: [] },
        'keyCompany': profile.name.value
    };
    return jobProfile;
};
//Updates a current profile with data from input fields
export const ChangesToProfile = (profile, inputs) => {
    inputs.forEach((input) => {
        profile[input.id].value = input.value;
    });
};
//checks whether a call to the database Put (update) function is necessary
export const CheckValuesForChange = (profile, data) => data.filter((obj) => (profile[obj.id].value !== obj.value)).length > 0;
//populates the dropdown and combo checkbox lists
export const AddJobLists = (jobProfile) => {
    jobProfile.roleCategory.list = employerCategories;
    jobProfile.location.list = employerLocations;
};
//removes the dropdown and combo checkbox lists
//useful when you want to update the database
export const RemoveJobLists = (jobProfile) => {
    jobProfile.roleCategory.list = [];
    jobProfile.location.list = [];
};
//dropdown list for role categories
const employerCategories = [
    "Accounts", "Admin/Maintenance/Security/Datawarehousing", "Advertising", "Corporate Planning/Consulting/Strategy", "Institutional Sales",
    "Online/Digital Marketing", "Operations", "Programming & Design", "QA/Testing/Documentation", "R&D", "Retail Sales", "Voice"
];
//combo list for locations
const employerLocations = [
    "Birmingham", "Bristol", "Cambridge", "Glasgow", "Leeds", "London", "Manchester", "Milton Keynes", "Newcastle", "Oxford", "Portsmouth", "Southampton"
];
