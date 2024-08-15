import { findAllDishes, saveBooking } from './API.js';
import { createIDb, saveBookingIntoIDB, loadBookingFromIDB } from './indexDb.js'

let order = {
    clientName: '',
    table: '',
    time: '',
    orders: []
}
export function cleanForm(){
    const inputModal = form.querySelectorAll('.form-control');
    inputModal.forEach(input => input.value='');
}

export function createBooking(){
    const name = document.querySelector('#name').value;
    const email = document.querySelector('#email').value;
    const phone = document.querySelector('#phone').value;
    const table = document.querySelector('#table').value;
    const time = document.querySelector('#time').value;

    const clientBooking = { name, email, phone, table, time };

    // if(validateFields(clientBooking)){
    //     showAlert(document.querySelector('.modal-body'), 'Any field could be empty');
    // }else{
        //saveBooking({...clientBooking, date : new Date() });
        
        order.clientName = name;
        order.table = table;
        order.time = time;

        const modalForm = document.querySelector('#form');
        const modalBootstrap = bootstrap.Modal.getInstance(modalForm);
        modalBootstrap.hide();

        showSections();

        loadAllDishes();
    // }

    console.log('save clientBooking');
}

function showSections(){
    const hideSections = document.querySelectorAll('.d-none');
    hideSections.forEach(section => section.classList.remove('d-none'));
}

export function showAlert(element, message){
    if(!document.querySelector("#messageDiv")){
        const messageDiv = document.createElement('DIV');
        messageDiv.id="messageDiv";
        messageDiv.classList.add('fw-bold', 'text-danger', 'text-center');
        messageDiv.textContent = message;
        element.appendChild(messageDiv);

        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }
}

export function validateFields(obj){
    return Object.values(obj).some(inputValue => inputValue === '');    //save clientBooking values in array
}

export async function loadLastEntries(form){
    const bookingInfo = await loadBookingFromIDB();

    if(bookingInfo){
        const { name, email, phone, table, time } = bookingInfo;

        document.querySelector('#name').value = name;
        document.querySelector('#email').value = email;
        document.querySelector('#phone').value = phone;
        document.querySelector('#table').value = table;
        document.querySelector('#time').value = time;
    }else{
        console.log('nothing to load');
        showAlert(form, 'Nothing to load');
    }
}

export function createIDbToSaveEntries(){
    createIDb();
}

export function saveLastEntriesIntoIDb(){
    
    const name = document.querySelector('#name').value;
    const email = document.querySelector('#email').value;
    const phone = document.querySelector('#phone').value;
    const table = document.querySelector('#table').value;
    const time = document.querySelector('#time').value;

    const entriesToSave = { name, email, phone, table, time };

    if(!Object.values(entriesToSave).every(inputValue => inputValue === '')){
        saveBookingIntoIDB(entriesToSave);
    }else{
        console.log('todo vacío');
    }
}

export async function loadAllDishes(){
    const dishesList = document.querySelector('#dishes-list');
    const allDishes = await findAllDishes();

    if(allDishes){

        const rowLabel = document.createElement('DIV');
        rowLabel.classList.add('row', 'py-4', 'border-top', 'fw-bold', 'fs-4');

        const nameLabel = document.createElement('DIV');
        nameLabel.classList.add('col-md-4');
        nameLabel.textContent = "Name";

        const priceLabel = document.createElement('DIV');
        priceLabel.classList.add('col-md-4');
        priceLabel.textContent = "Price";

        const quantityLabel = document.createElement('DIV');
        quantityLabel.classList.add('col-md-4');
        quantityLabel.textContent = "Quantity";

        rowLabel.appendChild(nameLabel);
        rowLabel.appendChild(priceLabel);
        rowLabel.appendChild(quantityLabel);

        dishesList.appendChild(rowLabel);

        allDishes.forEach(dish => {
            const row = document.createElement('DIV');
            row.classList.add('row', 'py-4', 'border-top');

            const name = document.createElement('DIV');
            name.classList.add('col-md-4');
            name.textContent = dish.name;

            const price = document.createElement('DIV');
            price.classList.add('col-md-3', 'fw-bold');
            price.textContent = `$ ${dish.price}`;

            const inputQuantity = document.createElement('INPUT');
            inputQuantity.type = 'number';
            inputQuantity.min = 0;
            inputQuantity.value = 0;
            inputQuantity.id = `product-${dish.id}`;
            inputQuantity.classList.add('form-control');

            inputQuantity.onchange = function(){
                const quantity = parseInt(inputQuantity.value);
                addDishToOrder({...dish, quantity});   /////////////////////////////////////////////////
            }

            const add = document.createElement('DIV');
            add.classList.add('col-md-4');
            add.appendChild(inputQuantity);

            row.appendChild(name);
            row.appendChild(price);
            row.appendChild(add);

            dishesList.appendChild(row);
        });
    }
}

function addDishToOrder(objDish){
    
    const ordersTemp = [...order.orders];

    const index = ordersTemp.findIndex(element => element.id === objDish.id);

    if(objDish.quantity<=0){
        index >= 0 ? order.orders = ordersTemp.filter(order => order.id !== objDish.id) : null;
    }else{
        index >= 0 ? ordersTemp[index] = objDish : ordersTemp.push(objDish);
        order.orders = [...ordersTemp];
    }

    showConsumptionSummary();

}

function showConsumptionSummary(){

    const consumptionSummary = document.querySelector('#consumption-summary');

    clearComponent(consumptionSummary);

    const summary = document.createElement('DIV');
    summary.classList.add('col-md-6', 'card', 'py-2', 'px-3', 'shadow');

    const table = document.createElement('P');
    table.textContent = 'Table: ';
    table.classList.add('fw-bold');

    const tableSpan = document.createElement('SPAN');
    tableSpan.textContent = order.table;
    tableSpan.classList.add('fw-normal');

    const time = document.createElement('P');
    time.textContent = 'Hour: ';
    time.classList.add('fw-bold');

    const timeSpan = document.createElement('SPAN');
    timeSpan.textContent = order.time;
    timeSpan.classList.add('fw-normal');

    table.appendChild(tableSpan);
    time.appendChild(timeSpan);

    const heading = document.createElement('H3');
    heading.textContent = 'Consumed Dishes';
    heading.classList.add('my-4', 'text-center');

    const group = document.createElement('UL');
    group.classList.add('list-group');

    const {orders} = order;
    orders.forEach(item => {
        const {name, quantity, price, id} = item;

        const list = document.createElement('LI');
        list.classList.add('list-group-item');

        const nameEl = document.createElement('H4');
        nameEl.classList.add('my-4');
        nameEl.textContent = name;

        //cantidad del artículo
        const quantityEl = document.createElement('P');
        quantityEl.classList.add('fw-bold');
        quantityEl.textContent = 'Quantity: ';
        
        const quantityValue = document.createElement('SPAN');
        quantityValue.classList.add('fw-normal');
        quantityValue.textContent = quantity;

        //precio del artículo
        const priceEl = document.createElement('P');
        priceEl.classList.add('fw-bold');
        priceEl.textContent = 'Price: ';
        
        const priceValue = document.createElement('SPAN');
        priceValue.classList.add('fw-normal');
        priceValue.textContent = `$ ${price}`;

        //subtotal del artículo
        const subtotalEl = document.createElement('P');
        subtotalEl.classList.add('fw-bold');
        subtotalEl.textContent = 'Subtotal: ';
        
        const subtotalValue = document.createElement('SPAN');
        subtotalValue.classList.add('fw-normal');
        subtotalValue.textContent = calculateSubTotal(quantity, price);

        //boton para eliminar
        const btnDelete = document.createElement('BUTTON');
        btnDelete.classList.add('btn', 'btn-danger');
        btnDelete.textContent = 'Delete order';

        //funcion para eliminar el pedido
        btnDelete.onclick = function(){
            deleteOrder(id);
            return;
        }

        //agregar valores a sus contenedores
        quantityEl.appendChild(quantityValue);
        priceEl.appendChild(priceValue);
        subtotalEl.appendChild(subtotalValue);

        //agregar elementos a li
        list.appendChild(nameEl);
        list.appendChild(quantityEl);
        list.appendChild(priceEl);
        list.appendChild(subtotalEl);
        list.appendChild(btnDelete);

        //agregar lista al grupo inicial
        group.appendChild(list);
    });

    summary.appendChild(heading);
    summary.appendChild(table);
    summary.appendChild(time);
    summary.appendChild(group);

    consumptionSummary.appendChild(summary);
}

function calculateSubTotal(quantity, price){
    return quantity * price;
}

function deleteOrder(id){
    const ordersTemp = [...order.orders];
    order.orders = [...ordersTemp.filter(order => order.id !== id)];
    showConsumptionSummary();
}

function clearComponent(component){
    while(component.firstChild){
        component.removeChild(component.firstChild);
    }
}

//con programación funcional
// function addDishToOrder(objDish, currentOrders) {
//     if (objDish.quantity <= 0) {
//         return currentOrders.filter(order => order.id !== objDish.id);
//     }

//     return currentOrders.some(order => order.id === objDish.id)
//         ? currentOrders.map(order => order.id === objDish.id ? objDish : order)
//         : [...currentOrders, objDish];
// }
// // Uso de la función:
// order.orders = addDishToOrder(objDish, order.orders);
// Esta versión:
// Es puramente funcional: No modifica el estado global y retorna un nuevo arreglo.
// Evita copias innecesarias: Solo se crean nuevas referencias cuando es necesario