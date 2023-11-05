/*
    Profile Generators take the data from IndexDB and produce an array of values
    The values are (from left to right) the key, the value, the display name,
    the type of input ('text' = textfield,'dropdown' = select,'combo' = custom-checkbox-dropdown,'' = no input type).
    The values are used to populate the currentEmployer, currentApplicant and currentJob objects when required.
    Only the key and value are mandatory - other values are used for displaying the data on screen.
*/
export const ApplicantProfileGenerator = (profile) => [
    ["id", profile.id],
    ["type", "applicant"],
    ["name", profile.name, "Applicant Name", "text"],
    ["phoneNumber", profile.phoneNumber, "Phone Number", "text"],
    ["email", profile.email, "Email", "text"],
    ["profilePicture", profile.profilePicture, "Profile Picture", ""],
    ["cv", profile.cv, "CV", ""],
];
export const EmployerProfileGenerator = (profile) => [
    ["id", profile.id],
    ["type", "employer"],
    ["companyName", profile.companyName, "Company Name", "text"],
    ["companyWebsite", profile.companyWebsite, "Company Website", "text"],
    ["companyLogo", profile.companyLogo, "Company Logo", "text"],
    ["employeeName", profile.employeeName, "Employee Name", "text"],
    ["phoneNumber", profile.phoneNumber, "Phone Number", "text"],
    ["email", profile.email, "Email", "text"],
    ["profilePicture", profile.profilePicture, "Profile Picture", "text"]
];
export const JobProfileGenerator = (profile) => [
    ["id", profile.id],
    ["creationTimestamp", profile.creationTimestamp],
    ["company", profile.company, "Company Name", ""],
    ["roleCategory", profile.roleCategory, "Role Category", "dropdown", GetEmployerCategories()],
    ["role", profile.role, "Role", "text"],
    ["location", profile.location, "Location", "combo", GetEmployerLocations()],
    ["industry", profile.industry, "Industry", "text"],
    ["function", profile.function, "Functional Area", "text"],
    ["title", profile.title, "Title", "text"],
    ["experience", profile.experience, "Experience", "text"],
    ["salary", profile.salary, "Salary", "text"],
    ["keySkills", profile.keySkills],
    ["applicants", profile.applicants]
];
/* Generator for a new job object */
export const EmptyJobsProfileGenerator = (companyName) => [
    ["id", ""],
    ["creationTimestamps", ""],
    ["companyName", companyName, "Company Name", ""],
    ["roleCategory", "", "Role Category", "text", GetEmployerCategories()],
    ["role", "", "Role", "text"],
    ["location", "", "Location", "text", GetEmployerLocations()],
    ["industry", "", "Industry", "text"],
    ["function", "", "Functional Area", "text"],
    ["title", "", "Title", "text"],
    ["experience", "", "Experience", "text"],
    ["salary", "", "Salary", "text"],
    ["keySkills", "", "Key Skills", "text"]
];
/* values for populating dropdown / custom-checkbox-dropdown lists*/
const GetEmployerCategories = () => [
    "Accounts", "Admin/Maintenance/Security/Datawarehousing", "Advertising", "Corporate Planning/Consulting/Strategy", "Institutional Sales",
    "Online/Digital Marketing", "Operations", "Programming & Design", "QA/Testing/Documentation", "R&D", "Retail Sales", "Voice"
];
const GetEmployerLocations = () => [
    "Birmingham", "Bristol", "Cambridge", "Glasgow", "Leeds", "London", "Manchester", "Milton Keynes", "Newcastle", "Oxford", "Portsmouth", "Southampton"
];
