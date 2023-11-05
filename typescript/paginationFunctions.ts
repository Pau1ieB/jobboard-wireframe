const jobPage:any={lower:0,upper:0,current:1,step:6}

export const PaginationString:string=`
    <a style='grid-area:7/6/8/7' href='#JobSearch?down?false' data-job='down'><button>&lt;</button></a>
    <input style='grid-area:7/8/8/9' type='text' value='1' data-pagenav='true'>
    <a style='grid-area:7/10/8/11' href='#JobSearch?up?false' data-job='up'><button>&gt;</button></a>
`

export const GetJobPage=():any=>jobPage;

export const JobPageDown=():boolean=>{
    if(jobPage.current-1==0)return false;
    jobPage.current--;
    UpdateJobPage();
    return true;
}

export const JobPageUp=():void=>{
    jobPage.current++;
    UpdateJobPage();
}

const UpdateJobPage=():void=>{
    jobPage.upper = jobPage.current * jobPage.step;
    jobPage.lower = jobPage.upper - jobPage.step;
}

export const ResetJobPage=(page:number):void=>{
    if(page<1)page=1;
    jobPage.current=page;
    UpdateJobPage();
}