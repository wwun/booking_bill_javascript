let DB;

export function createIDb(){
    const createDb = window.indexedDB.open('bookingInfo', 1);

    createDb.onerror = (e) => {
        console.log(`error creating IDb ${e.target.error.message}`);
    }

    createDb.onsuccess = () => {
        console.log('IDb created');
        DB = createDb.result;
    }

    createDb.onupgradeneeded = (e) => {
        const db = e.target.result;

        const objectStore = db.createObjectStore('bookingInfo', {
            keyPath: 'id',  //keypathse utiliza para definir la clave primaria (o primary key) de un objeto almacenado en una base de datos. La clave primaria es un valor único que identifica de manera exclusiva cada registro en un almacén de objetos (object store)
            //al no ponerlo autoincremental, se debe definir al crear un registro
        });

        objectStore.createIndex('name', 'name', {unique: false});
        objectStore.createIndex('email', 'email', {unique: false});
        objectStore.createIndex('phone', 'phone', {unique: false});
        objectStore.createIndex('table', 'table', {unique: false});
        objectStore.createIndex('time', 'time', {unique: false});        
    }
}

export async function saveBookingIntoIDB(obj){
    const conexion = window.indexedDB.open('bookingInfo', 1);

    conexion.onsuccess = () => {
        DB = conexion.result;
    }

    const transaction = DB.transaction(['bookingInfo'], 'readwrite');
    const objectStore = await transaction.objectStore('bookingInfo');

    const objIDb = {id:1, ...obj};
    const addRequest = objectStore.put(objIDb);    //put inserta o actualiza un registro    //objectStore.add(obj) solo inserta un registro

    addRequest.onerror = function(e){
        console.log(`error: ${e.target.error.message}`);
    }

    transaction.onerror = (e) => {
        console.log(`DataBase error ${e.target.error.message}`);
    }

    transaction.oncomplete = () => {
        console.log('saved successful');
    }
    
}

export const loadBookingFromIDB = function(){
    
    return new Promise((resolve, reject) => {

        const conexion = window.indexedDB.open('bookingInfo', 1);

        conexion.onerror = (e) => {
            console.log(`error opening IDb: ${e.target.error.message}`);
            reject(e.target.error);
        };

        conexion.onsuccess = () => {
            DB = conexion.result;
            const transaction = DB.transaction('bookingInfo', 'readonly');

            transaction.onerror = (e) => {
                console.log(`error reading IDb ${e.target.error.message}`);
            }

            const objectStore = transaction.objectStore('bookingInfo');

            const getRequest = objectStore.get(1);

            getRequest.onsuccess = (e) => {//objectStore.openCursor().onsuccess = (e) => { //ya no necesita recorrer todos

                const obj = e.target.result;
                resolve(obj);
            };

            getRequest.onerror = (e) => {
                console.log(`error reading IDb: ${e.target.error.message}`);
                reject(e.target.error);
            }
        };
    });
}