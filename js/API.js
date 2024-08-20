const url = "http://localhost:8080";

export const saveBooking = async (clientBooking) => {
    try{
        await fetch(`${url}/clientBooking`, {
            method: "POST",
            body: JSON.stringify(clientBooking),
            headers: {
                'Content-Type' : 'application/json'
            }
        });
    }catch(error){
        console.log(error);
    }
}

export const findAllDishes = async () => {
    try{
        const response = await fetch(`${url}/dishes`);
        const dishes = await response.json();
        return dishes;
    }catch(error){
        console.log(`error loading dishes: ${error}`);
    }
}

export const saveOrderAndPayment = (orderDetail) => {
    console.log('saving');
}