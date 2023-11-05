type storeOptions={
    keyPath: string,
    autoIncrement: boolean 
}

type dbOtions={
    unique:boolean
}

type dbData={
    name:string,
    options:dbOtions
}

type dbSettings={
    storeName:string,
    storeOptions:storeOptions,
    storeData:Array<dbData>
}

/*  
    The settings are passed to the OpenDataBase function of OpenDataBase.
    They will be used by 'onupgradeneeded' when the database is first created
    (or when it is upgraded - but that's another story).
    They create the stores (storeName), the primary key (storeOptions), and additional serach keys(storeData)
*/

export const dbStores:Array<dbSettings>=
[
    {
        storeName:"employers",
        storeOptions:{ 
            keyPath: 'id',
            autoIncrement: true 
        },
        storeData:[
            {name:"name",options:{unique:false}},
            {name:"employee",options:{unique:false}}
        ]
    },
    {
        storeName:"applicants",
        storeOptions:{ 
            keyPath: 'id',
            autoIncrement: true 
        },
        storeData:[
            {name:"name",options:{unique:false}}
        ]
    },
    {
        storeName:"jobs",
        storeOptions:{ 
            keyPath: 'id',
            autoIncrement: true
        },
        storeData:[
            {name:"keyCompany",options:{unique:false}},
        ]
    },
    {
        storeName:"images",
        storeOptions:{ 
            keyPath: 'id',
            autoIncrement: true
        },
        storeData:[
            {name:"name",options:{unique:false}},
        ]
    },
    {
        storeName:"attachments",
        storeOptions:{ 
            keyPath: 'id',
            autoIncrement: true
        },
        storeData:[
            {name:"name",options:{unique:false}},
        ]
    }


]