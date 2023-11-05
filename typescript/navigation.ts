import { SetDisplay } from "./SetDisplay.js";
import { ReadData,ReadDataByRange,ReadDataByRangeAndKey,WriteSingleData,PutData,DeleteData,CheckDB,OpenDataBase } from "./indexedDb.js";
import { dbStores } from "./indexedDBSettings.js";
import { ChangesToProfile,NewJobProfileGenerator,CheckValuesForChange,AddJobLists,RemoveJobLists } from "./profileFunctions.js";
import { GetAllInputValues,ResetAnchorElementHref,AssignCallbackFileString,AssignLoadFileCallback } from "./objectUtils.js";
import { OpenJobsFileDialog,CreateNewJob } from "./jobFunctions.js";
import { GetProfileTable,GetJobsTable,GetProfileTableNoEdit } from "./tableString.js";
import { PaginationString,JobPageDown,JobPageUp,GetJobPage,ResetJobPage } from "./paginationFunctions.js";

//profile = selected employer or applicant profile
//used to fill in data on pages (logos & profile pictures)
//job profile = selected job
let profile:any={type:{value:"main"}};
let jobProfile:{[key:string]:any}={};

//handles all hash chnages
export const ChangePage=async (action:string,args:Array<string>):Promise<void>=>{
    //if page is refreshed will restart db
    if(!CheckDB())
        await OpenDataBase(dbStores);
    
    //load profile + pictures from database, if required
    if(args[1]==="employers" || args[1]==="applicants"){
        let response:any = await ReadData(args[1],"id",1,[]);
        console.log(response);
        if(response.data==undefined){
            alert('There are no profiles loaded.\nRestart the application using the "StartDB" function (found in "main.ts").\n**** Only run the function once! ****');
            return;
        }
        profile = response.data[0];
        response = await ReadData('images',"name",profile.profile.value,[]);
        console.log(response);
        profile.profileImage = response.data[0][0].src;
        if(args[1]==='employers'){
            response = await ReadData('images',"name",profile.logo.value,[]);
            console.log(response);
            profile.logoImage = response.data[0][0].src;
        }
    }
    else if(args[1]==="noprofile")
        profile = {type:{value:"main"}};

    //any hash tagged with "display" will refresh the page
    //the code goes here
    if(args[0]==="display"){
        let tableString:string='';
        let navString='';
        let profileButtons:Array<any>=[];
        if(action==="MainPage" ||  action==='ApplicantDashboard' || action==='EmployerDashboard'){
            ResetJobPage(1);
            const page = GetJobPage();
            const response:any = (action==='EmployerDashboard')?await ReadDataByRangeAndKey("jobs","keyCompany","Digital Native",page.lower,page.upper):await ReadDataByRange("jobs",page.lower,page.upper);
            console.log(response);
            tableString = GetJobsTable(response.data,profile);
            navString=PaginationString;
            ResetJobPage(1);
        }
        else if(action==='LoginProfile')
            tableString=GetProfileTableNoEdit(profile);
        else if(action==='Profile'){
            tableString=GetProfileTable(profile);
            profileButtons.push({text:'Save',hash:'#SaveProfile'});
            profileButtons.push({text:'Back',hash:`#AbandonSaveProfile?false`});
        }
        else if(action==='NewJobProfile'){
            jobProfile = NewJobProfileGenerator(profile);
            AddJobLists(jobProfile);
            tableString=GetProfileTable(jobProfile);
            profileButtons.push({text:'Save',hash:'#AddNewJob?false'});
            profileButtons.push({text:'Back',hash:'#AbandonNewJob?false'});
        }
        else if(action==='EditJobProfile'){
            const response:any = await ReadData('jobs','id',parseInt(args[1]),[]);
            jobProfile = response.data[0];
            AddJobLists(jobProfile);
            tableString=GetProfileTable(jobProfile);
            profileButtons.push({text:'Save',hash:'#SaveEditJob?false'});
            profileButtons.push({text:'Back',hash:'#AbandonEditJob?false'});
        }
        else if(action==='ApplyJobProfile'){
            const response:any = await ReadData('jobs','id',parseInt(args[1]),[]);
            jobProfile = response.data[0];
            tableString=GetProfileTableNoEdit(jobProfile);
            if(jobProfile.applicants.value.includes(profile.id))profileButtons.push({text:'Remove Application',hash:'#ApplyForJob?false'});
            else profileButtons.push({text:'Apply',hash:'#ApplyForJob?true'});
            profileButtons.push({text:'Back',hash:'#ApplyForJob?no'});
        }
        else if(action==='ViewApplicant'){
            let response:any = await ReadData('jobs','id',parseInt(args[1]),[]);
            if(response.data[0].applicants.value.length==0){
                alert("There are no applicants");
                return;
            }
            response = await ReadData('applicants','id',response.data[0].applicants.value[0],[]);
            console.log(response);
            tableString=GetProfileTableNoEdit(response.data[0]);
        }
        SetDisplay(action,profile,tableString,navString,profileButtons);
// change not click handlers cannot be controlled with hash strings
// so the event listeners have to be added. The functions are found 
// at the bottom of the page        
        if(navString.length>0){
            const elem:HTMLInputElement = (document.querySelector('[data-pagenav]') as HTMLInputElement);
            elem.addEventListener("change",ChangePageByInput);
        }
        if(action==='NewJobProfile' || action==='EditJobProfile'){
            const select:HTMLSelectElement = (document.querySelector('select')as HTMLSelectElement);
            select.addEventListener('change',ChangeRoleCategory);
            const comboList:Array<any> = [...(document.querySelectorAll('input[type="checkbox"]')as any)];
            comboList.forEach((combo:any)=>combo.addEventListener('change',ChangeJobLocation));
        }
    }                                   
    else if(action==='SaveProfile'){    //All "click" actions from buttons are handled here.
        const inputValues = GetAllInputValues();
        if(CheckValuesForChange(profile,inputValues.values)){
            ChangesToProfile(profile,inputValues.values);
            const cloneProfile = JSON.parse(JSON.stringify(profile));  
            delete cloneProfile.profileImage;   //cloning the profile allows you to modify the existing profile
            delete cloneProfile.logoImage;      //and update the db without disruption to the profile in use
            const response = await PutData((profile as any).type.value,cloneProfile);
            console.log(response);
        }
        location.hash=`#${(profile as any).dashboard.value}?display`;
    }
    else if(action==='AbandonSaveProfile'){
        const inputValues = GetAllInputValues();
        if(CheckValuesForChange(profile,inputValues.values)){
            if(!confirm("Do you want to abandon your changes?")){
                const elem:HTMLAnchorElement = document.querySelector("a:nth-child(2)")!;
                ResetAnchorElementHref(elem,'#AbandonSaveProfile',args[0]);
                return;
            }   //ResetAnchor changes the hash so it can be reused
        }       //without having to reset the display
        location.hash=`#${profile.dashboard.value}?display`;
        return;
    }
    else if(action==='LoadFile'){
        OpenJobsFileDialog();
        const elem:HTMLAnchorElement = document.querySelector("a:nth-child(2)")!;
        ResetAnchorElementHref(elem,'#LoadFile',args[0]);
    }
    else if(action==='AddNewJob'){
        const inputs = GetAllInputValues();
        if(inputs.emptyCount>0){
            if(!confirm('Not all fields are filled in. Do you want to create this job now?')){
                const elem:HTMLAnchorElement = (document.querySelector('a:nth-child(1)') as HTMLAnchorElement);
                ResetAnchorElementHref(elem,'#AddNewJob',args[0]);
                return;
            }
        }
        ChangesToProfile(jobProfile,inputs.values);
        CreateNewJob(jobProfile);
        RemoveJobLists(jobProfile);
        const response = await WriteSingleData('jobs',jobProfile);
        console.log(response);
        jobProfile={};
        location.hash='#EmployerDashboard?display';
    }
    else if(action==='AbandonNewJob'){
        const inputs = GetAllInputValues();
        if(inputs.emptyCount<inputs.maxCount){
            if(!confirm('Do you want to abandon creating this job?')){
                const elem:HTMLAnchorElement = (document.querySelector('a:nth-child(2)') as HTMLAnchorElement);
                ResetAnchorElementHref(elem,'#AbandonNewJob',args[0]);
                return;
            }
        }            
        location.hash='#EmployerDashboard?display';
    }
    else if(action==='DeleteJob'){
        if(!confirm('Are you sure you want to delete this Job?')){
            const elem:HTMLAnchorElement = (document.getElementById(`delete-${args[0]}`) as HTMLAnchorElement);
            ResetAnchorElementHref(elem,`#DeleteJob?${args[0]}`,args[1]);
            return;
        }
        const response = await DeleteData('jobs',parseInt(args[0]));
        console.log(response);
        location.hash='#EmployerDashboard?display';
    }
    else if(action==='SaveEditJob'){
        const inputs = GetAllInputValues();
        if(CheckValuesForChange(jobProfile,inputs.values)){
            ChangesToProfile(jobProfile,inputs.values)
            RemoveJobLists(jobProfile);
            const response = await PutData('jobs',jobProfile);
            console.log(response);
        }
        jobProfile={};
        location.hash='#EmployerDashboard?display';
    }
    else if(action==='AbandonEditJob'){
        const inputs = GetAllInputValues();
        if(CheckValuesForChange(jobProfile,inputs.values)){
            if(!confirm('Do you want to abandon the changes made?')){
                const elem:HTMLAnchorElement = (document.querySelector('a:nth-child(2)') as HTMLAnchorElement);
                ResetAnchorElementHref(elem,'#AbandonEditJob',args[0]);
                return;
            }            
        }
        jobProfile={};
        location.hash='#EmployerDashboard?display';
    }
    else if(action==='ApplyForJob'){
        if(args[0]==='true') 
            jobProfile.applicants.value.push(profile.id);
        else if(args[0]==='false')
            jobProfile.applicants.value = jobProfile.applicants.value.filter((id:any)=>id!=profile.id);
        if(args[0]!=='no'){
            const response = await PutData('jobs',jobProfile);
            console.log(response);
        }
        if(args[0]==="true")alert("Applied!");
        else if(args[0]==="false")alert("Application Removed!");
        jobProfile={}
        location.hash='ApplicantDashboard?display'
    }
    else if(action==='FileInput'){
        if(args[0]==='Profile' || args[0]==='Logo'){
            const input:HTMLInputElement = (document.getElementById('load-image-data') as HTMLInputElement);
            AssignCallbackFileString(args[0]);
            AssignLoadFileCallback(HandleImageInput);
            input.click();
        }
        
        const elem:HTMLAnchorElement = (document.getElementById('fileinput-'+args[0]) as HTMLAnchorElement);
        ResetAnchorElementHref(elem,'#FileInput?'+args[0],args[1]);
    }
    else if(action==='RemoveFileInput'){
        const elem:HTMLAnchorElement = (document.getElementById('removefileinput-'+args[0]) as HTMLAnchorElement);
        ResetAnchorElementHref(elem,'#RemoveFileInput?'+args[0],args[1]);
    }
//functions for the job pagination system
    else if(action==='JobSearch'){
        if(args[0]==='down'){
            if(JobPageDown()){
                UpdateJobsInput();
                const page = GetJobPage();
                const response:any = (profile.type.value==='employers')?await ReadDataByRangeAndKey("jobs","keyCompany","Digital Native",page.lower,page.upper):await ReadDataByRange('jobs',page.lower,page.upper);
                const tableString=GetJobsTable(response.data,profile);
                const section:HTMLElement = (document.querySelector('section') as HTMLElement);
                section.innerHTML=tableString;            
            }
            const elem:HTMLAnchorElement = (document.querySelector('[data-job="down"]') as HTMLAnchorElement);
            ResetAnchorElementHref(elem,'#JobSearch?down',args[1]);
        }
        else if(args[0]==='up'){
            JobPageUp();
            const page = GetJobPage();
            const response:any = (profile.type.value==='employers')?await ReadDataByRangeAndKey("jobs","keyCompany","Digital Native",page.lower,page.upper):await ReadDataByRange('jobs',page.lower,page.upper);
            if(response.ok==1)ResetJobPage(page.current-1);
            else{
                UpdateJobsInput();
                const tableString=GetJobsTable(response.data,profile);
                const section:HTMLElement = (document.querySelector('section') as HTMLElement);
                section.innerHTML=tableString;
            }
            const elem:HTMLAnchorElement = (document.querySelector('[data-job="up"]') as HTMLAnchorElement);
            ResetAnchorElementHref(elem,'#JobSearch?up',args[1]);
        }
        else if(args[0]==='input'){
            const page = GetJobPage();
            const input:HTMLInputElement = (document.querySelector('[data-pagenav]') as HTMLInputElement);
            const value = Number(input.value);
            if(!Number.isInteger(value) || value<1){
                input.value = page.current;
                return;
            }
            const upper=value*page.step;
            const lower=(upper-page.step);
            const response:any = (profile.type.value==='employers')?await ReadDataByRangeAndKey("jobs","keyCompany","Digital Native",lower,upper):await ReadDataByRange('jobs',lower,upper);
            if(response.ok==1){
                input.value = page.current;
                return;                
            }
            const tableString=GetJobsTable(response.data,profile);
            const section:HTMLElement = (document.querySelector('section') as HTMLElement);
            section.innerHTML=tableString;
            ResetJobPage(value);
        }
    }
}

//change event handlers

const UpdateJobsInput=():void=>{
    const elem:HTMLInputElement = (document.querySelector('[data-pagenav]') as HTMLInputElement);
    elem.value=GetJobPage().current;
}

const ChangePageByInput=(event:Event):void=>{
    const input:HTMLInputElement = (event.target as HTMLInputElement);
    location.hash=`#JobSearch?input?${input.dataset.pagenav}`
    input.dataset.pagenav=(input.dataset.pagenav==="true")?"false":"true";
}

const ChangeRoleCategory=(event:any)=>{
    jobProfile.roleCategory.value=event.currentTarget.value;
}

const ChangeJobLocation=(event:any)=>{
    if(event.currentTarget.checked)
        jobProfile.location.value=(jobProfile.location.value.length==0)?event.currentTarget.labels[0].textContent:jobProfile.location.value+'/'+event.currentTarget.labels[0].textContent;
    else
        jobProfile.location.value = jobProfile.location.value.split('/').filter((obj:string)=>obj!==event.currentTarget.labels[0].textContent).join('/');

    const elem = document.getElementById('combo-container');
    if(elem!=null){
        elem.childNodes[0].textContent=jobProfile.location.value;
    }
}

const HandleImageInput=async (data:any,fileName:string,fileString:string)=>{
    if(fileString==='Profile')
        ChangeImage(data,fileName,'.profile-picture img',profile.profile,'#fileinput-Profile label');
    else
        ChangeImage(data,fileName,'',profile.logo,'#fileinput-Logo label');
}

const ChangeImage=async (data:any,fileName:string,className:string,imageProfile:any,labelName:string):Promise<void>=>{
    let response:any=null;
    if(fileName===imageProfile.value){
        alert('An image with this name is already present');
        return;
    }
    if(imageProfile.value!=='anon-person.png'){
        response = await ReadData('images','name',imageProfile.value,[]);
        console.log(response);
        response = await DeleteData('images',response.data[0][0].id);
        console.log(response);
    }
    response = await WriteSingleData('images',{name:fileName,src:data});
    console.log(response);
    imageProfile.value=fileName;
    let cloneProfile = JSON.parse(JSON.stringify(profile));
    delete cloneProfile.profileImage;
    delete cloneProfile.logoImage;
    response = await PutData(profile.type.value,cloneProfile);
    console.log(response);
    if(className.length==0)profile.logoImage=data;
    else{
        profile.profileImage=data;
        const img:HTMLImageElement = (document.querySelector(className) as HTMLImageElement);
        if(img!=null)
            img.src = data;
    } 
    const label = (document.querySelector(labelName) as HTMLElement)
    label.innerHTML=fileName;
}