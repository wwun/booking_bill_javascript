import { cleanForm, createBooking, createIDbToSaveEntries, saveLastEntriesIntoIDb, loadLastEntries } from "./functions.js";

//json-server --watch "/media/wwun/Windows/Users/willi/OneDrive - Universidad Peruana de Ciencias/ucw/javascript/Curso+JS+Moderno/Curso JS Moderno/40-PROYECTO-Calculadora de Propinas con JSON-Server/db.json" --port 4000
//El comando que has mencionado sirve para iniciar un servidor JSON utilizando json-server, una herramienta que permite crear una API RESTful basada en un archivo JSON

(function(){
const form = document.querySelector('#form');
const createOrderButton = document.querySelector('#create-order');

const loadLastEntriesButton = document.querySelector('#load-last-entries');

document.addEventListener('DOMContentLoaded', () => {

    createIDbToSaveEntries();

    form.addEventListener('show.bs.modal', cleanForm);
    form.addEventListener('hide.bs.modal', saveLastEntriesIntoIDb);
    createOrderButton.addEventListener('click', createBooking);

    loadLastEntriesButton.addEventListener('click', () => {
        loadLastEntries(document.querySelector('.modal-body'));
    })
});
})();