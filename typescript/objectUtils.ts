let LoadFileCallback:Function;
let callbackFileString:string='';

//The callback function and string are used with the "input files"
//feeding back into the navigation.ts page

export const AssignLoadFileCallback=(func:Function):void=>{
    LoadFileCallback=func;
}

export const AssignCallbackFileString=(fileString:string):void=>{
    callbackFileString=fileString;
}

export const GetFile=(event:Event):void=>{
    const e = event.currentTarget as HTMLInputElement;
    if(e.files!=null && e.files[0]!=null){
        const reader = new FileReader();
        reader.onload = ()=>LoadFileCallback(reader.result);
        reader.readAsText(e.files[0]);
    }
}

export const GetImageFile=(event:Event):void=>{
    const e = event.currentTarget as HTMLInputElement;
    if(e.files!=null && e.files[0]!=null){
        const type = e.files[0].type;
        if(type!=='image/png'){
            alert('Only PNG files are accepted');
            return;
        }
        const name:string = e.files[0].name;
        const reader = new FileReader();
        reader.onload = ()=>LoadFileCallback(reader.result,name,callbackFileString);
        reader.readAsDataURL(e.files[0]);
    }
}
//not implemented
export const GetPDFFile=(event:Event):void=>{
    const e = event.currentTarget as HTMLInputElement;
    if(e.files!=null && e.files[0]!=null){
        const reader = new FileReader();
        reader.onload = ()=>LoadFileCallback(reader.result);
        reader.readAsText(e.files[0]);
    }
}

export const DeleteObjectProperties=(obj:any,props:Array<any>):any=>{
    props.forEach(p=>delete obj[p]);
    return obj;
}

//extracts all values from textfields on profile pages
//checks to see how many are filled
//and returns all the data
export const GetAllInputValues=():any=>{
    const inputs = [...document.querySelectorAll("input[type=text]")];
    const output:any={emptyCount:0,filledCount:0,maxCount:inputs.length,values:[]};
    inputs.forEach(elem=>{
        const obj:any={id:(elem as HTMLInputElement).name,value:(elem as HTMLInputElement).value}
        if(obj.value==="")output.emptyCount++;
        else output.filledCount++;
        output.values.push(obj);
    });
    return output;
}

//changes hash on anchor elements to allow reuse on pages without refresh
export const ResetAnchorElementHref=(elem:HTMLAnchorElement,hash:string,value:string):void=>{
    const bool:Boolean = (value==="false");
    (elem as HTMLAnchorElement).href = hash+"?"+bool;
}

//changes hash to allow reuse on pages without refresh
export const ResetDataOnElement=(elem:HTMLElement,hash:string,data:string,value:string):void=>{
    const bool:Boolean = (value==="false");
    (elem as HTMLAnchorElement).href = hash+"?"+bool;
}

//creates a creation timestamp for any new record
export const GetDateNow=():string=>{
    let result="";
    const d = new Date();
    result += d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate() + 
              " "+ d.getHours()+":"+d.getMinutes()+":"+
              d.getSeconds()+" +0000";
    return result;
}