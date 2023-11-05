//Gets string for the job table
//data is extracted via pagination and
//passed here as an array

export const GetJobsTable=(data:any,profile:any):string=>{
    if(data==undefined)return '';
    let jobsHeaders:Array<string>=['Company','Role Category','Role','Location','Industry','Function','Job Title','Experience','Salary'];
    if(profile.type.value==='applicants')
        jobsHeaders.push('Details');
    else if(profile.type.value==='employers'){
        jobsHeaders.filter((header:string)=>header!=='Company')
        jobsHeaders.push('Details');
    }
    return`
        <table data-job='true'>
            <tr>
                ${
                    jobsHeaders.map((header:string)=>
                        `<th>
                            ${header}
                        </th>`
                    ).join('')
                }
            </tr>
            ${
                data.map((job:any)=>`
                    <tr>
                        ${
                            Object.entries(job).filter((obj:any)=>obj[1].display!=undefined).map((obj:any)=>`<td>${obj[1].value}</td>`).join('')
                        }
                        ${
                            (profile.type.value==='applicants')?`<td><a id='apply-${job.id}' href='#ApplyJobProfile?display?${job.id}'><button>Apply</button></a></td>`:
                            (profile.type.value==='employers')?`<td><a id='edit-${job.id}' href='#EditJobProfile?display?${job.id}'><button>Edit</button></a><a id='delete-${job.id}' href='#DeleteJob?${job.id}?false'><button>Delete</button></a><a id='view-${job.id}' href='#ViewApplicant?display?${job.id}?false'><button>View</button></a></td>`:''
                        }
                    </tr>`
                ).join('')
            }
        </table>
    `;
}
//Gets string for the Profile table
//the data is contained in the profile passed
//whether an applicant, an employer or a job
export const GetProfileTable=(profile:any):string=>`
    <table>
        ${
            Object.entries(profile).filter((e:any)=>(e[1].display!=undefined))
            .map((e:any)=>`<tr><td>${e[1].display}</td><td>${GetTypeString(e[0],e[1])}</td></tr>`)
            .join('')
        }
    </table>
`;

export const GetProfileTableNoEdit=(profile:any):string=>`
    <table>
        ${
            Object.entries(profile).filter((e:any)=>(e[1].display!=undefined))
            .map((e:any)=>`<tr><td>${e[1].display}</td><td>${e[1].value}</td></tr>`)
            .join('')
        }
    </table>
`;

//determines the type of input fields to be inserted
//into the table. The defaults are None and input.
//Additional function allow for dropdowns and file input
//These strings are passed to the 'SetDisplay.ts' function

const GetTypeString=(id:string,profile:any):string=>`
    ${
        (profile.type==="text")?`<input type='text' value='${profile.value}' name='${id}'>`:(profile.type==="dropdown")?AddDropDown(profile):(profile.type==="combo")?AddCombo(profile):(profile.type==="file")?AddFileInput(profile):`${profile.value}`
    }
`;

const AddDropDown=(profile:any):string=>{
    if(profile.value.length==0)profile.value=profile.list[0];
    return `
    <select>
        ${
            profile.list.map((opt:string)=>(opt===profile.value)?`<option selected>${opt}</option>`:`<option>${opt}</option>`).join('')
        }       
    </select>`;
}

const AddCombo=(profile:any):string=>{
    const location = profile.value.split('/').filter((obj:string)=>obj.length>0);
    return `
    <div id='combo-container' class='combo-container'>${profile.value}
        <div class='combo'>
            <ul>
                ${
                    profile.list.map((opt:string)=>location.includes(opt)?`<li><label><input type='checkbox' checked>${opt}</label></li>`:`<li><label><input type='checkbox'>${opt}</label></li>`).join('')
                }      
            </ul>
        </div>    
    </div>`;
}

const AddFileInput=(profile:any):string=>{
    const hash = profile.display.split(" ")[0];
    return `
        <div class='file-input-container'>
            <a id='fileinput-${hash}' href='#FileInput?${hash}?false'><label>${profile.value}</label></a>
            <a id='removefileinput-${hash}' href='#RemoveFileInput?${hash}?false'><label>&times;</label></a>
        </div>
    `;
}