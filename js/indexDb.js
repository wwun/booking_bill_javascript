let DB;

export function createIDb(versionDeIDb = 1){
    return new Promise((resolve, reject) => {
        
        const createDb = window.indexedDB.open('dbBookingInfo', versionDeIDb);   //dbBookingInfo es el nombre de la base de datos

        createDb.onerror = (e) => {
            console.log(`IndexDb: create: error creating IDb ${e.target.error.message}`);
            reject(e.target.error);
        }

        createDb.onupgradeneeded = (e) => {
            DB = e.target.result;
            
            if(!DB.objectStoreNames.contains('tableBookingInfo')){
                const objectStore = DB.createObjectStore('tableBookingInfo', {   //este es el simil de una tabla
                    keyPath: 'id',  //keypathse utiliza para definir la clave primaria (o primary key) de un objeto almacenado en una base de datos. La clave primaria es un valor único que identifica de manera exclusiva cada registro en un almacén de objetos (object store)
                    //al no ponerlo autoincremental, se debe definir al crear un registro
                });
                objectStore.createIndex('name', 'name', {unique: false});
                objectStore.createIndex('email', 'email', {unique: false});
                objectStore.createIndex('phone', 'phone', {unique: false});
                objectStore.createIndex('table', 'table', {unique: false});
                objectStore.createIndex('time', 'time', {unique: false});
            }
        };

        createDb.onsuccess = (e) => {
            DB = e.target.result;   //por buenas prácticas se usa e, que es una opción a DB = createDb.result;   //esto se refiere al evento que dispara onsuccess, qe sería createDb
            resolve(DB);
        };

    });
};

function checkAndRecreateObjectStore(){
    return new Promise((resolve, reject) => {
        if(!DB){
            reject(new Error('IndexDB does not exist'));
        }else if(!DB.objectStoreNames.contains('tableBookingInfo')){
            DB.close();
            createIDb((DB.version+1))   //como se está llamando a una promesa dentro de la creación de una, no se puede usar await, para la ejecución se debería usar then, no se puede hacer await createIDb()
                .then(resolve)
                .catch(reject);
        }else{
            resolve(DB);
        }
    });
}

export async function saveBookingIntoIDB(obj){
    
    try{
        if(!DB) {        
            await createIDb();                
        }

        await checkAndRecreateObjectStore();
        
        const transaction = DB.transaction(['tableBookingInfo'], 'readwrite');  //inicia la transacción
        const objectStore = transaction.objectStore('tableBookingInfo');

        const objIDb = {id:1, ...obj};
        const addRequest = objectStore.put(objIDb);    //put inserta o actualiza un registro    //objectStore.add(obj) solo inserta un registro

        addRequest.onerror = function(e){
            console.log(`IndexDb: save: error: ${e.target.error.message}`);
        }

        transaction.onerror = (e) => {
            console.log(`save: DataBase error ${e.target.error.message}`);
        }

        transaction.oncomplete = () => {
            console.log('IndexDb: save: saved successful');
        }
    }catch(error){
        console.log('IndexDb: save: Database initizalization failed');
    }
}

export const loadBookingFromIDB = async function(){
    
    return new Promise((resolve, reject) => {   //se crea la promesa para poder aplicar await en el llamado

        const conexion = window.indexedDB.open('dbBookingInfo');    //cuando no se especifica un número, se abre la última versión
        
        conexion.onerror = (e) => {
            console.log(`IndexDb: error opening IDb: ${e.target.error.message}`);
            reject(e.target.error);
        };

        conexion.onsuccess = (e) => {
            
            DB = e.target.result;
            
            try{
                
                const transaction = DB.transaction('tableBookingInfo', 'readonly');
                
                if(!transaction){
                    console.log('IndexDb: no hay transaction');
                }

                transaction.onerror = (e) => {
                    reject(`IndexDb: error reading IDb ${e.target.error.message}`);
                }

                const objectStore = transaction.objectStore('tableBookingInfo');

                const getRequest = objectStore.get(1);

                getRequest.onsuccess = (e) => {//objectStore.openCursor().onsuccess = (e) => { //ya no necesita recorrer todos

                    const obj = e.target.result;
                    resolve(obj);
                };

                getRequest.onerror = (e) => {
                    console.log(`IndexDb: error reading IDb: ${e.target.error.message}`);
                    reject(e.target.error);
                }
            }catch(error){
                console.log('IndexDb: error: ',error.message);
            }
        };
    });
}