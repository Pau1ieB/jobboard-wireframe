import { AssignLoadFileCallback,GetDateNow } from "./objectUtils.js";
import { WriteMultipleData } from "./indexedDb.js";

//handles loading the intial CSV file
//Removes any corrupt or inconsistant files
//Alters the company field on 60 records so you have data from 3 companies
//Saves 90 records to the database
//A auto-incremented index key is given to each record to allow pagination


export const CreateNewJob=(profile:any):void=>{
    profile.creationTimestamp.value=GetDateNow();
}

export const CreateJobSaveData=(jobProfile:any):any=>{
    let saveData:any = {}
    Object.entries(jobProfile).forEach((elem:any)=>{
        saveData[elem[0]]=elem[1].value
    })
    return saveData;
}

export const OpenJobsFileDialog=():void=>{
    AssignLoadFileCallback(JobsDefrag);
    const loadJobsData:HTMLElement=document.getElementById('load-jobs-data')!;
    loadJobsData.click();
}

const JobsDefrag=async (data:string):Promise<void>=>{
    let split:Array<string>=data.split("\r\n");
    split.shift();
    const list_to_save:Array<any> = [];
    split.forEach((str:string)=>{
        const parts = SplitString(str);
        //Only allows records with 12 fields
        if(parts.length==12){
            list_to_save.push(
                {
                    uniqId:{value:parts[0].trim()},
                    creationTimestamp:{value:parts[2].trim()},
                    company:{value:parts[1].trim(),display:'Company Name',type:''},
                    roleCategory:{value:parts[3].trim(),display:'Role Category',type:'dropdown',list:[]},
                    role:{value:parts[4].trim(),display:'Role',type:'text'},
                    location:{value:parts[5].trim(),display:'Location',type:'combo',list:[]},
                    function:{value:parts[6].trim(),display:'Function',type:'text'},
                    industry:{value:parts[7].trim(),display:'Industry',type:'text'},
                    title:{value:parts[8].trim(),display:'Title',type:'text'},
                    salary:{value:parts[9].trim(),display:'Salary',type:'text'},
                    experience:{value:parts[10].trim(),display:'Experience',type:'text'},
                    keySkills:{value:parts[11].trim()},
                    applicants:{value:[]},
                    type:{value:"jobs"},
                    keyCompany:parts[1].trim()
                }
            )
        }
    })
    const list=[];
    for(let i=0; i<30; i++)list.push(list_to_save[i]);
    for(let i=30; i<60; i++){
        list_to_save[i].company.value="BaliCorp";
        list_to_save[i].keyCompany="BaliCorp";
        list.push(list_to_save[i]);
    }
    for(let i=60; i<90; i++){
        list_to_save[i].company.value="Another Corporation";
        list_to_save[i].keyCompany="Another Corporation";
        list.push(list_to_save[i]);
    }
    const response:any = await WriteMultipleData("jobs",list);
    console.log(response);
    alert("CSV loaded into IndexedDB");
}
//Cleans up the input
const SplitString=(str:string)=>{
    let index1:number=0;
    let index2:number=0;
    let split=true;
    let list:Array<string>=[];
    while(index2>-1){
        index2 = str.indexOf('"',index1);
        if(index2!=-1){
            if(split){
                const newStr = str.substring(index1,index2-1);
                if(newStr!==','){
                    const newStrSplit = newStr.split(',');
                    newStrSplit.forEach(s=>{
                        list.push(s);
                    })
                }
                index1=index2+1;
            }
            if(!split){
                let newStr:string = str.substring(index1,index2);
                newStr=newStr.replace(/,/g,"/");
                list.push(newStr);
                index1=index2+2;
            }
            split=!split;
        }
    }
    const newStr = str.substring(index1).split(',');
    newStr.forEach(s=>{
        if(s.length>0)list.push(s);
    })
    return list;
}