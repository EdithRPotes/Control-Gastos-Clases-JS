//VARIABLES Y SELECTORES
const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');

//EVENTOS

eventListeners();
 function eventListeners(){
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto );

    formulario.addEventListener('submit',agregarGasto)
 }


// CLASES
class Presupuesto {
    constructor(presupuesto){ //Metodo
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    }

    nuevoGasto(gasto){
        // console.log(gasto);
        this.gastos =[...this.gastos, gasto];
        // console.log(this.gastos)
        this.calcularRestante();
    }

    calcularRestante(){
        const gastado = this.gastos.reduce((total, gasto)=>
        total + gasto.cantidad, 0);
        // console.log(gastado);
        this.restante = this.presupuesto - gastado;
        // console.log(this.restante)
    }

    eliminarGasto(id){
        this.gastos = this.gastos.filter(gasto => gasto.id !==id);
        this.calcularRestante();
    }
}

class UI{ 
 insertarPresupuesto(cantidad){
//  console.log(cantidad);
    // extrayendo los valores
    const{presupuesto, restante} = cantidad;

    //Agregando al HTML
    document.querySelector('#total').textContent = presupuesto;
    document.querySelector('#restante').textContent = restante;
 }

 imprimirAlerta(mensaje, tipo){
    //Crear el div 
    const divMensaje = document.createElement('div');
    divMensaje.classList.add('text-center', 'alert');

    if(tipo === 'error'){
        divMensaje.classList.add('alert-danger');
    }else{
        divMensaje.classList.add('alert-success');
    }

    //Mensaje de error
    divMensaje.textContent = mensaje;

    //Insertar en el HTML
    document.querySelector('.primario').insertBefore(divMensaje, formulario) 

    // Quitar del HTML el mensaje de error 
    setTimeout(() => {
        divMensaje.remove();
    }, 3000);
 }

 mostrarGastos(gastos){

     //Limpiar el html 
        this.limpiarHTML();
    //Iterar sobre los gastos
    gastos.forEach(gasto =>{
        const { cantidad, nombre, id } = gasto;

        //Crear un LI
        const nuevoGasto = document.createElement('li');
        nuevoGasto.className = 'list-group-item d-flex justify-content-between aling-items-center';
        nuevoGasto.dataset.id = id;

        // Agregar el HTML del gasto
        nuevoGasto.innerHTML = `${nombre}<span class="badge rounded-pill  bg-primary  position-relative">$ ${cantidad} </span>`;

        // Boton para borrar el gasto
        const btnBorrar = document.createElement('button');
        btnBorrar.classList.add('btn', 'btn-danger','borrar-gasto');
        btnBorrar.innerHTML = 'Borrar &times';
        btnBorrar.onclick = () =>{
            eliminarGasto(id);
        }
        nuevoGasto.appendChild(btnBorrar);

        // Agregar al HTML
        gastoListado.appendChild(nuevoGasto);

        

    })
 }

 limpiarHTML(){
    while(gastoListado.firstChild){
        gastoListado.removeChild(gastoListado.firstChild);
    }
 }

 actualizarRestante(restante){
    document.querySelector('#restante').textContent = restante;
 }

 comprobarPresupuesto(presupuestoObj){
    const {presupuesto, restante} = presupuestoObj;

    const restanteDiv = document.querySelector('.restante');

    //Comprobar 25%
    if((presupuesto/4)> restante){
        restanteDiv.classList.remove('alert-success', 'alert-warning');
        restanteDiv.classList.add('alert-danger');
    }else if((presupuesto / 2) > restante){
        restanteDiv.classList.remove('alert-success');
        restanteDiv.classList.add('alert-warning');
    }else{
        restanteDiv.classList.remove('alert-danger', 'alert-warning');
        restanteDiv.classList.add('alert-success');
    }

    //Si el total es 0 o menor
    if(restante<=0){
        ui.imprimirAlerta('El presupuesto se ha agotado', 'error');
        formulario.querySelector('button[type="submit"]').disabled = true;
    }
 }
}
//Instanciar 
const ui = new UI();
let presupuesto; //objeto

// FUNCIONES
function preguntarPresupuesto(){
    const presupuestoUsuario = prompt('¿Cual es tu presupuesto? ');

    // console.log(presupuestoUsuario);

    if(presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0 ){
        window.location.reload();
    }

    presupuesto = new Presupuesto(presupuestoUsuario)
    console.log(presupuesto);

    ui.insertarPresupuesto(presupuesto);
}

//Añade gastos 

function agregarGasto(e){
e.preventDefault();

//leer los datos del formulario 
const nombre = document.querySelector('#gasto').value;
const cantidad = Number(document.querySelector('#cantidad').value);
// console.log(nombre, cantidad)

// validar formulario
if(nombre === '' || cantidad === ''){
    ui.imprimirAlerta('Ambos campos son obligatorios', 'error');
    return;
}else if(cantidad <= 0 || isNaN(cantidad)){
    ui.imprimirAlerta('Cantidad no válida', 'error');
    return;
}

// console.log('agregando Gastos')

//generar un objeto con el gasto 
const gasto = {nombre, cantidad, id: Date.now()} // une nombre y cantidad a gasto es lo contrario a destructuring

//añade un nuevo gasto
presupuesto.nuevoGasto( gasto );

//Mensaje cuando se llena bien el formulario
ui.imprimirAlerta('Gasto Añadido Correctamente');

//Imprimir los gatos 
const {gastos, restante} = presupuesto;
ui.mostrarGastos(gastos);

ui.actualizarRestante(restante);

ui.comprobarPresupuesto(presupuesto);
//Reinicio de formulario
formulario.reset();
}

function eliminarGasto(id){

    //Elimina los gastos del objeto
    presupuesto.eliminarGasto(id);

    //Elimina los gastos del HTML
    const{ gastos,restante} = presupuesto;
     ui.mostrarGastos(gastos);

     ui.actualizarRestante(restante);

ui.comprobarPresupuesto(presupuesto);
}