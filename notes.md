<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <!-- <meta http-equiv="X-UA-Compatible" content="IE=edge"> -->
        <!-- <meta name="viewport" content="width=device-width, initial-scale=1.0"> -->
        <title>Calculadora de Propinas y Consumos</title>
        <link rel="stylesheet" href="css/bootstrap.min.css">
        <!-- <link rel="stylesheet" href="css/app.css"> -->
    </head>
    <body>
    
        <header class="py-4 bg-primary">
            <h1 class="text-center text-white fs-3">Calculadora de Consumos y Propinas</h1>
        </header>
    
        <div class="d-flex mt-4 justify-content-center">
            <button  data-bs-toggle="modal" data-bs-target="#form" type="button" class="btn btn-success">Nueva Orden</button>
        </div>
    
    
        <main id="platillos" class="container bg-light mt-5 p-4 d-none">
            <h2  class="text-center my-4">Platillos</h2>
    
            <div class="contenido"></div>
        </main>
    
        
        <section id="resumen" class="resumen bg-light container mt-5 p-4 d-none">
            <h2 class="text-center my-4">Resumen De Consumo </h2>
    
            <div class="contenido row">
                <p class="text-center">Añade los elementos del pedido</p>
            </div>
        </section>
    
        <!-- Modal -->
            <div class="modal fade" id="form">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h2 class="modal-title">Restaurant App</h2>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <form>
                                <div class="mb-3">
                                    <label class="form-label ">Name</label>
                                    <input id="name" type="text" class="form-control">
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Email</label>
                                    <input id="email" type="email" class="form-control">
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Phone</label>
                                    <input id="phone" type="tel" pattern="[0-9]{10}" class="form-control">
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Table</label>
                                    <input id="table" type="number" class="form-control" min="1" max="20">
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Time</label>
                                    <input id="time" type="time" class="form-control">
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                            <button id="guardar-cliente" type="button" class="btn btn-primary">Crear Orden</button>
                        </div>
                    </div>
                </div>
            </div>
    
    <script src="js/bootstrap.bundle.min.js"></script>
    <script src="js/app.js"></script>
    </body>
</html>