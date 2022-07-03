let valido = false;
let continua = true;
let monto = 0;
let calculo = [];
let calculoMoneda = [];
let cuotaBuscada = 0;
let valorReferencia = 0;
let localData =[];

let currencyFormat = {
    style: 'currency',
    currency: 'USD',
}

let moneda = new Intl.NumberFormat('en-US', currencyFormat );

function Simular (cuotas, tasa, monto) {
    
    document.getElementById("msgLabel").innerText="";

    if (cuotas>0){
        valido = true;
        document.getElementById("inputMonths").className="form-control";
    }else {
        document.getElementById("inputMonths").className="form-control error";
        document.getElementById("errorLabel").innerText="Debe ingresar un número positivo válido.";
        MsgPopUp('Debe ingresar un número positivo válido')
    }

    if(valido){
        valido = false;
        if (tasa>0 && tasa<=1){
            valido = true;
            document.getElementById("inputRate").className="form-control";
        }else {
            document.getElementById("inputRate").className="form-control error";
            document.getElementById("errorLabel").innerText="Debe ingresar un número positivo entre cero y uno.";
            MsgPopUp('Debe ingresar un número positivo entre cero y uno')
        }
    }

    if(valido){
        valido = false;
        if (monto>0){
            valido = true;
            const dataIngresada = new dataLocal(tasa, cuotas, monto);
            dataIngresada.guardarDataLocal(...Object.values(dataIngresada));
            // dataIngresada.guardarDataLocal(dataIngresada.tasaLocal, dataIngresada.numCuotaLocal, dataIngresada.montoLocal);
            const prestamo = new Prestamo(tasa, cuotas, monto);
            calculo = prestamo.calcularPrestamo();
            calculo.forEach( col => {
                calculoMoneda.push(col.map(moneda.format))
                })
            console.table(prestamo);
            const table = document.querySelector("tbody");
            table.innerHTML = `<tr id=cuota1>
                <td>${1}</td>
                <td>${calculoMoneda[0][0]}</td>
                <td>${calculoMoneda[1][0]}</td>
                <td>${calculoMoneda[2][0]}</td>
                <td class="pagado">${calculoMoneda[3][0]}</td>
                </tr>`;
            for(let i=1; i<calculo[0].length; i++){
                table.innerHTML += `<tr id=cuota${i+1}>
                <td>${i+1}</td>
                <td>${calculoMoneda[0][i]}</td>
                <td>${calculoMoneda[1][i]}</td>
                <td>${calculoMoneda[2][i]}</td>
                <td class="pagado">${calculoMoneda[3][i]}</td>
                </tr>`
            }
        document.getElementById("inputAmount").className="form-control";
        }else {
            document.getElementById("inputAmount").className="form-control error";
            document.getElementById("errorLabel").innerText="Debe ingresar un número positivo válido.";
            MsgPopUp('Debe ingresar un número positivo válido');
        }
    }
}

function buscarCuota(cuotaBuscada) {

    document.getElementById("inputSearchMonth").className="form-control";
    document.getElementById("inputSearchMonth").value = cuotaBuscada;
    document.getElementById("msgLabel").innerText="";

    if(cuotaBuscada<=0){
        document.getElementById("inputSearchMonth").className="form-control error";
        document.getElementById("errorLabel2").innerText="Debe ingresar un número mayor a cero.";
        MsgPopUp('Debe ingresar un número mayor a cero');
    }else{
        if(calculo[4].some((cuota) => cuota === cuotaBuscada)){
            const cuotaEncontrada = document.getElementById(`cuota${cuotaBuscada}`);
            cuotaEncontrada.className = "cuotaEncontrada";
            document.getElementById("errorLabel2").className="infoLabel";
            document.getElementById("errorLabel2").innerText="Cuota encontrada y resaltada en verde.";
            MsgPopUp('Cuota encontrada y resaltada en verde','Atención', 'info');
        }else{
            document.getElementById("errorLabel2").innerText="El préstamo no tiene esa cuota";
            MsgPopUp('El préstamo no tiene esa cuota');
        }
    }
}

function pagoMayor(valorReferencia) {

    const menoresAnteriores = document.getElementsByClassName("cuotaMenor"); 
    Array.from(menoresAnteriores).forEach( celda => celda.className = "pagado");
    const celdas = document.getElementsByClassName("pagado");
    let menores = calculo[3].filter(cuota => parseFloat(cuota) < valorReferencia);
    Array.from(celdas).forEach(celda => {
        menores.includes(celda.textContent) && (celda.className = "cuotaMenor");
        // if (menores.includes(celda.textContent)){
        //     celda.className = "cuotaMenor";
        // }
    });

    document.getElementById("errorLabel2").className="infoLabel";
    document.getElementById("errorLabel2").innerText="Valores de cuota menores en azul.";
    MsgPopUp(`Valores de cuota menores que  ${valorReferencia} resaltados en azul`,'Atención', 'info');
}

let simuleForm = document.getElementById("simuleForm");
simuleForm.addEventListener("submit", (event) =>{
    event.preventDefault();
    let cuotas = parseInt(document.getElementById("inputMonths").value);
    let tasa = parseFloat(document.getElementById("inputRate").value);
    let monto = parseFloat(document.getElementById("inputAmount").value);
    document.getElementById("errorLabel").innerText="";
    Simular(cuotas, tasa, monto);
    document.getElementById("searchFieldset").disabled = false;
})

let btnBuscar = document.getElementById("btnBuscar");
btnBuscar.addEventListener("click", () => {
    let cuota = parseInt(document.getElementById("inputSearchMonth").value);
    document.getElementById("errorLabel2").innerText="";
    document.getElementById("errorLabel2").className="errorLabel";
    if(isNaN(cuota)){
        document.getElementById("inputSearchMonth").className="form-control error";
        document.getElementById("errorLabel2").innerText="Digite una cuota";
        MsgPopUp(`Es necesario que digite una cuota`,'Atención');
    }else{
        buscarCuota(cuota);
    }
})

let btnMonto = document.getElementById("btnMonto");
btnMonto.addEventListener("click", () => {
    let monto = parseFloat(document.getElementById("inputSearchAmount").value);
    document.getElementById("errorLabel2").innerText="";
    document.getElementById("errorLabel2").className="errorLabel";
    if( isNaN(monto)){
        document.getElementById("inputSearchAmount").className="form-control error";
        document.getElementById("errorLabel2").innerText="Digite un monto";
        MsgPopUp(`Es necesario que digite un monto`,'Atención');
    }else{
        pagoMayor(monto);
    }
})

let btnBorrarCache = document.getElementById("btnBorrarCache");
btnBorrarCache.addEventListener("click", () => {
    let datosLocales = new dataLocal();
    let dataEliminada = datosLocales.borrarDataLocal();
    if (dataEliminada.length !== 0){
        document.getElementById("msgLabel").innerText="Data local eliminada exitosamente";
        MsgPopUp('Data local eliminada exitosamente','Atención', 'success');
    }else{
        document.getElementById("msgLabel").innerText="No existen datos locales";
        MsgPopUp('No existen datos locales','Atención', 'info');
    }
})

function MsgPopUp(msg, title, type) {
    Swal.fire({
        icon: type || 'error',
        title: title || '',
        text: msg ||'Ha ocurrido un error',
      })
}

window.onload = () => {
    let datosLocales = new dataLocal();
    let dataLocalCargada = datosLocales.cargarDataLocal();
    console.log(dataLocalCargada);
    if (dataLocalCargada.length !== 0){
        document.getElementById("inputMonths").value= dataLocalCargada.numCuotaLocal;
        document.getElementById("inputAmount").value= dataLocalCargada.montoLocal;
        document.getElementById("inputRate").value= dataLocalCargada.tasaLocal;
    }
}
