import { findAllDishes, saveBooking, saveOrderAndPayment } from './API.js';
import { createIDb, saveBookingIntoIDB, loadBookingFromIDB } from './indexDb.js'

let order = {
    clientName: '',
    clientEmail: '',
    table: '',
    time: '',
    orders: []
}
export function cleanForm(){
    const inputModal = form.querySelectorAll('.form-control');
    inputModal.forEach(input => input.value='');
}

export function createBooking(){
    const clientName = document.querySelector('#name').value;
    const clientEmail = document.querySelector('#email').value;
    const clientPhone = document.querySelector('#phone').value;
    const tableReserved = document.querySelector('#table').value;
    const timeReserved = document.querySelector('#time').value;

    const clientBooking = { clientName, clientEmail, clientPhone, tableReserved, timeReserved };

    if(validateFields(clientBooking)){
        
        showAlert(document.querySelector('.modal-body'), 'Any field could be empty');
        
    }else{
        
        const clientId = Number(Date.now());
        saveBooking({id : clientId, ...clientBooking });
        
        order.clientName = clientName;
        order.clientEmail = clientEmail;
        order.table = tableReserved;
        order.time = timeReserved;

        const modalForm = document.querySelector('#form');
        const modalBootstrap = bootstrap.Modal.getInstance(modalForm);
        modalBootstrap.hide();

        showSections();

        loadAllDishes();

        showConsumptionSummary();

        createDivTips();

    }

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
    try{
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
    }catch(error){
        console.log(`failed to load bookingInfo ${error.message}`);
    }
}

export async function createIDbToSaveEntries(){
    // await createIDb();
}

export async function saveLastEntriesIntoIDb(){
    
    const name = document.querySelector('#name').value;
    const email = document.querySelector('#email').value;
    const phone = document.querySelector('#phone').value;
    const table = document.querySelector('#table').value;
    const time = document.querySelector('#time').value;

    const entriesToSave = { name, email, phone, table, time };

    if(!Object.values(entriesToSave).every(inputValue => inputValue === '')){
        await saveBookingIntoIDB(entriesToSave);
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

                showHideTip();

                calculateTip();
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

    const summary = document.querySelector('#summary');

    clearComponent(summary);    
    
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

    console.log('showConsumptionSummary');
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

export function createDivTips(){
    const contenido = document.querySelector('#consumption-summary');

    const tipDiv = document.querySelector('#tipDiv');
    
    const divTipDiv = document.createElement('H3');
    divTipDiv.classList.add('card', 'py-2', 'px-3', 'shadow');

    const heading = document.createElement('H3');
    heading.classList.add('my-4', 'text-center');
    heading.textContent = 'tip';

    //radio button
    const radio10 = document.createElement('INPUT');
    radio10.type = 'radio';
    radio10.name = 'tip';
    radio10.value = '0.10';
    radio10.classList.add('form-check-input');
    radio10.onclick = calculateTip;

    const radio10Label = document.createElement('LABEL');
    radio10Label.textContent = '10%';
    radio10Label.classList.add('form-check-label');

    const radio10Div = document.createElement('DIV');
    radio10Div.classList.add('form-check', 'fs-5');

    radio10Div.appendChild(radio10);
    radio10Div.appendChild(radio10Label);

    //radio button
    const radio25 = document.createElement('INPUT');
    radio25.type = 'radio';
    radio25.name = 'tip';   //este name debe ser el mismo que el de 25 para que se seleccione uno u otro
    radio25.value = '0.25';
    radio25.classList.add('form-check-input');
    radio25.onclick = calculateTip;

    const radio25Label = document.createElement('LABEL');
    radio25Label.textContent = '25%';
    radio25Label.classList.add('form-check-label');

    const radio25Div = document.createElement('DIV');
    radio25Div.classList.add('form-check', 'fs-5');

    radio25Div.appendChild(radio25);
    radio25Div.appendChild(radio25Label);

    //radio button
    const radio50 = document.createElement('INPUT');
    radio50.type = 'radio';
    radio50.name = 'tip';   //este name debe ser el mismo que el de 25 para que se seleccione uno u otro
    radio50.value = '0.50';
    radio50.classList.add('form-check-input');
    radio50.onclick = calculateTip;

    const radio50Label = document.createElement('LABEL');
    radio50Label.textContent = '50%';
    radio50Label.classList.add('form-check-label');

    const radio50Div = document.createElement('DIV');
    radio50Div.classList.add('form-check', 'fs-5');

    radio50Div.appendChild(radio50);
    radio50Div.appendChild(radio50Label);

    //agrega al DIV principal
    divTipDiv.appendChild(heading);
    divTipDiv.appendChild(radio10Div);
    divTipDiv.appendChild(radio25Div);
    divTipDiv.appendChild(radio50Div);
    
    //agregar al formulario
    tipDiv.appendChild(divTipDiv);

    contenido.appendChild(tipDiv);

}

function calculateTip(){
    let subTotal = 0;
    
    order.orders.forEach(order => {
        subTotal+=(order.price*order.quantity);
    });

    const tipSelected = document.querySelector('[name="tip"]:checked');
    if(tipSelected){
        const valueTipSelected = Number(tipSelected.value);
        const tip = valueTipSelected*subTotal;
        subTotal*=(1+valueTipSelected);
        subTotal = Number(subTotal.toFixed(2));
    
    
    const tipDiv = document.querySelector('#tipDiv');
    let totalDiv; 
    totalDiv = document.querySelector('#totalDiv');
    if(!totalDiv){
        totalDiv = document.createElement('DIV');
        totalDiv.id = 'totalDiv';
        totalDiv.classList.add('card', 'py-2', 'px-3', 'shadow', 'fs-4', 'fw-bold');
        totalDiv.style.order=3;
        tipDiv.appendChild(totalDiv);

        if(!document.querySelector('#btnPay')){
            const btnDiv = document.createElement('DIV');
            btnDiv.classList.add('d-grid', 'gap-2');
            const btnPay = document.createElement('BUTTON');
            btnPay.id = 'btnPay';
            btnPay.classList.add('btn', 'btn-primary', 'mt-4', 'btn-lg');
            btnPay.textContent = 'Pay';
            btnDiv.appendChild(btnPay)
            tipDiv.appendChild(btnDiv);

            const orderDetail = {
                clientEmail : order.clientEmail,
                orderHour : order.time,
                table :  order.table,
                orders : order.orders,
                tip : tip,
                paymentAmount : subTotal
            }
            btnPay.addEventListener('click', saveOrderOnDB);

            function saveOrderOnDB(){
                saveOrderAndPayment(orderDetail);
            }
        }
    }
    totalDiv.textContent = `Total to pay: $${subTotal}`;
}
    
}

function showHideTip(){
    if(order.orders.length==1){
        if(order.orders[0].quantity==1 && document.querySelector('#tipDiv').style.display!='block'){
            document.querySelector('#tipDiv').style.display='block';
        }
    }else if(order.orders.length<1){
            document.querySelector('#tipDiv').style.display='none';
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