const DB_VERSION:number=1;
const dbName:string = "JobBoardDatabase";
let db:IDBDatabase | null=null;

//check used for page refresh.
export const CheckDB=():boolean=>{
    return !(db==null);
}

//start / setup database
export const OpenDataBase=async (settings:Array<any>)=>{
    const response = await new Promise((res)=>{
        const request = window.indexedDB.open(dbName,DB_VERSION);

        request.onsuccess = event=> {
            if(event.target!=null){
                const target:IDBOpenDBRequest = (event.target as IDBOpenDBRequest);
                db = target.result;
                res({ok:1});
            }
            else res({ok:0,message:"event.target==null"});
        };

        request.onerror=event=>{
            const target:any = event.target;
            res({ok:0,message:"The Database Goofed!:"+target.errorCode});
        };
//database setup. all store data is held in dbStores (passed here as settings)
//and can be found in indexedDBSettings.ts

        request.onupgradeneeded = event => {
            if(event.currentTarget!=null){
                const target:IDBOpenDBRequest = (event.currentTarget as IDBOpenDBRequest);
                settings.forEach(setting=>{
                    const store = target.result.createObjectStore(setting.storeName, setting.storeOptions);
                    setting.storeData.forEach((data:any)=>store.createIndex(data.name,data.name,data.options));
                })                
            }
        };
    })
    return response;
}

//handles single Create(RUD) actions
export const WriteSingleData = async (storeName:string,data:any)=>{
    const response = await new Promise((res)=>{
        if(db!=null){
            const request = db.transaction(storeName, "readwrite").objectStore(storeName).add(data);
            if(request!=null){
                request.onerror = (event) => {
                    const target:any = event.target;
                    res({ok:0,message:`Write error: ${target.errorCode}`});
                };
                request.onsuccess = (event) => {
                    if(event.target!=null){
                        const target: IDBRequest = (event.target as IDBRequest);
                        res({ok:2,data:data,key:target.result});
                    }
                    else res({ok:0,message:"event.target is null"})
                };
            }else res({ok:0,message:"request is null"})
        }
        else res({ok:0,message:"db is null or undefined"})
    });
    return response;
}
//handles multiple Create(RUD) actions
export const WriteMultipleData = async (storeName:string,data:Array<any>)=>{
    const response = await new Promise((res)=>{
        if(db!=null){
            const store = db.transaction(storeName, "readwrite").objectStore(storeName);
            if(store!=null){
                const keys:Array<any>=[];
                data.forEach((o,i)=>{
                    const request = store.add(o);
                    if(request!=null){
                        request.onerror = (event) => {
                            const target:any = event.target;
                            res({ok:0,message:`Write error: ${target.errorCode}`});
                        };
                        request.onsuccess = (event) => {
                            const target:IDBRequest = (event.target as IDBRequest);
                            keys.push({data:data,key:target.result})
                            if(i==data.length-1)return res({ok:2,data:keys});
                        };
                    }else res({ok:0,message:"request = null"});
                })
            }
            else res({ok:0,message:"No store found"});
        }
        else res({ok:0,message:"db undefined or null"});
    });
    return response;
}
//handles (C)Read(UD) actions. The props woudl allow filtering
//but obvs I haven't implemented it here (see further down)
export const ReadData = async (storeName:string,index:string,value:any,prop:any)=>{
    const response = await new Promise((res)=>{
        if(db!=null){
            const transaction = (index==="id")?
                db.transaction(storeName,"readonly").objectStore(storeName).get(value):
                db.transaction(storeName,"readonly").objectStore(storeName).index(index).getAll(value);

            transaction.onsuccess = event=>{
                const target:any = event.target;
                if(target!=null){
                    if(target.result==undefined)res({ok:4});
                    else{
                        let list = (typeof target.result==="object")?[target.result]:target.result;
                        (list.length==0)?res({ok:5}):res({ok:2,data:list});
                    }
                }
                else res({ok:6});
            }
            transaction.onerror = event => {
                const target:any= event.target;
                res({ok:0,message:`Database error: ${target.errorCode}`})
            }
        }
        else res({ok:0,message:"Database returns null or undefined"})
    })
    return response;
}

//(C)read(UD) for values within range - allows pagination with primary key
export const ReadDataByRange = async (storeName:string,rangeStart:number,rangeEnd:number)=>{
    const response = await new Promise((res)=>{
        if(db!=null){
            const store = db.transaction(storeName,"readonly").objectStore(storeName);
            if(store!=null){
                const keyRange = IDBKeyRange.bound(rangeStart,rangeEnd,true,false);
                const transaction = store.getAll(keyRange);
                transaction.onsuccess = event=>{
                    const target:any = event.target;
                    if(target!=null && target.result!=undefined){
                        let list = (target.result instanceof Array)?target.result:[target.result];
                        (list.length==0)?res({ok:1,message:"No results found"}):res({ok:2,data:list});
                    }
                    else res({ok:0,message:"event.target==null or event.target.result == undefined"});
                }
                transaction.onerror = event => {
                    const target:any= event.target;
                    res({ok:0,message:`Error: ${target.errorCode}`})
                }                
            }else res({ok:0,message:"Store is not found"});
        }
        else res({ok:0,message:"Database return null or undefined"});
    })
    return response;
}
//(C)read(UD) for values within range - allows pagination with a key other than
//the primary key. I use chained filter requests to achieve this
export const ReadDataByRangeAndKey = async (storeName:string,index:string,value:string,rangeStart:number,rangeEnd:number)=>{
    const response = await new Promise((res)=>{
        if(db!=null){
            const indy = db.transaction(storeName,"readonly").objectStore(storeName).index(index);
            if(indy!=null){
                const transaction = indy.getAll();
                transaction.onsuccess = event=>{
                    const target:IDBRequest = (event.target as IDBRequest);
                    if(target!=null && target.result!=undefined){
                        let list = (target.result instanceof Array)?target.result:[target.result];
                        list = list.filter((obj:any)=>(obj[index]===value)).filter((obj:any,i:number)=>(i>=rangeStart && i<rangeEnd));
                        (list.length==0)?res({ok:1,message:"No results found"}):res({ok:2,data:list});
                    }
                    else res({ok:0,message:"event.target==null or event.target.result == undefined"});
                }
                transaction.onerror = event => {
                    const target:any= event.target;
                    res({ok:0,message:`Error: ${target.errorCode}`})
                }                
            }else res({ok:0,message:"Store is not found"});
        }
        else res({ok:0,message:"Database return null or undefined"});
    })
    return response;
}

//(CR)Update(D) function
export const PutData = async (storeName:string,data:any)=>{
    const response = await new Promise((res)=>{
        if(db!=null){
            const request = db.transaction([storeName], "readwrite").objectStore(storeName).put(data);
            request.onerror = (event) => {};
            request.onsuccess = (event) => {res({ok:2});};
        }
    });
    return response;
}

//(CRU)Delete function
export const DeleteData = async (storeName:string,key:number)=>{
    const response = await new Promise((res)=>{
        if(db!=null){
            const request = db.transaction([storeName], "readwrite").objectStore(storeName).delete(key);
            request.onerror = (event) => {res({ok:0})};
            request.onsuccess = (event) => {res({ok:2});};
        }
    });
    return response;
}

//This function starts up the database, sets up the stores and loads in test
//profiles for applicant and employer.
//It also adds in 3 images for use in profiles / logos
//The function call can be found commented out in the main.ts file
//Delete the current indexedDB directory and run this command ONCE
//Then comment it out and just use the call to OpenDataBase only.

export const StartDB = async (settings:Array<any>)=>{
    await OpenDataBase(settings);
    await WriteSingleData("applicants",
        {
            name:{value:'Pradeep',display:"Name",type:"text"},
            type:{value:'applicants'},
            phoneNumber:{value:'077230000',display:'Phone Number',type:'text'},
            email:{value:'pB@Bali.com',display:'Email',type:'text'},
            profile:{value:"typescript-face.png",display:'Profile Picture',type:'file'},
            cv:{value:'',display:'C.V.',type:'file'},
            dashboard:{value:"ApplicantDashboard"}
        }
    )
    
    await WriteSingleData("employers",
        {
            name:{value:'Digital Native'},
            type:{value:'employers'},
            website:{value:'https://www.dn-uk.com/',display:'Company Website',type:'text'},
            logo:{value:'DN-Logo.png',display:'Logo Picture',type:'file'},
            employee:{value:'John Smith',display:'Employee Name',type:'text'},
            phoneNumber:{value:"077230000",display:'Phone Number',type:'text'},
            email:{value:"js@dn-uk.com",display:'Email',type:'text'},
            profile:{value:"anon-person.png",display:'Profile Picture',type:'file'},
            dashboard:{value:"EmployerDashboard"}
        }
    )
    const image = new Image();
    image.src='anon-person.png';
    let writeData = await new Promise((res)=>{
        image.onload = async ()=>{
            const data = ImageToData(image);
            const writeData = {name:'anon-person.png',src:data};
            res(writeData);
        };
    });
    await WriteSingleData('images',writeData);

    image.src='DN-Logo.png';
    writeData = await new Promise((res)=>{
        image.onload = async ()=>{
            const data = ImageToData(image);
            const writeData = {name:'DN-Logo.png',src:data};
            res(writeData);
        };
    });
    await WriteSingleData('images',writeData);

    image.src='typescript-face.png';
    writeData = await new Promise((res)=>{
        image.onload = async ()=>{
            const data = ImageToData(image);
            const writeData = {name:'typescript-face.png',src:data};
            res(writeData);
        };
    });
    await WriteSingleData('images',writeData);    
}

const ImageToData=(image:any):any=>{
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    const context:any = canvas.getContext("2d");
    context.drawImage(image, 0, 0);
    return canvas.toDataURL();
}