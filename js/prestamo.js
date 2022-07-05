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
    minimumFractionDigits: 0
}

let moneda = new Intl.NumberFormat('en-US', currencyFormat );

function Simular (cuotas, tasa, monto) {
    
    msgLabel1.innerText="";

    if (cuotas>0){
        valido = true;
        inputMonths.className="form-control";
    }else {
        inputMonths.className="form-control error";
        errorLabel1.innerText="Debe ingresar un número positivo válido.";
        MsgPopUp('Debe ingresar un número positivo válido')
    }

    if(valido){
        valido = false;
        if (tasa>0 && tasa<=1){
            valido = true;
            inputRate.className="form-control";
        }else {
            inputRate.className="form-control error";
            errorLabel1.innerText="Debe ingresar un número positivo entre cero y uno.";
            MsgPopUp('Debe ingresar un número positivo entre cero y uno')
        }
    }

    if(valido){
        valido = false;
        if (monto>0 && !isNaN(monto)){
            valido = true;
            const dataIngresada = new dataLocal(tasa, cuotas, inputAmount.value);
            dataIngresada.guardarDataLocal(...Object.values(dataIngresada));
            const prestamo = new Prestamo(tasa, cuotas, monto);
            calculo = prestamo.calcularPrestamo();
            calculo.forEach( col => {
                calculoMoneda.push(col.map(moneda.format))
                })
            console.table(prestamo);
            const table = document.querySelector("tbody");
            table.innerHTML = `<tr id=cuota1>
                <td>${1}</td>
                <td id=${calculo[0][0]}>${calculoMoneda[0][0]}</td>
                <td id=${calculo[1][0]}>${calculoMoneda[1][0]}</td>
                <td id=${calculo[2][0]}>${calculoMoneda[2][0]}</td>
                <td id=${calculo[3][0]} class="pagado">${calculoMoneda[3][0]}</td>
                </tr>`;
            for(let i=1; i<calculo[0].length; i++){
                table.innerHTML += `<tr id=cuota${i+1}>
                <td>${i+1}</td>
                <td id=${calculo[0][i]}>${calculoMoneda[0][i]}</td>
                <td id=${calculo[1][i]}>${calculoMoneda[1][i]}</td>
                <td id=${calculo[2][i]}>${calculoMoneda[2][i]}</td>
                <td id=${calculo[3][i]} class="pagado">${calculoMoneda[3][i]}</td>
                </tr>`
            }
            inputAmount.className="form-control";
            document.getElementById("searchFieldset").disabled = false;
            toastMsgPopUp('','Cálculo realizado exitosamente','success',1000);
            valido = false;
        }else {
            inputAmount.className="form-control error";
            errorLabel1.innerText="Debe ingresar un número positivo válido.";
            MsgPopUp('Debe ingresar un número positivo válido');
        }
    }
}

function buscarCuota(cuotaBuscada) {

    inputSearchMonth.className="form-control";
    inputSearchMonth.value = cuotaBuscada;
    msgLabel1.innerText="";

    if(cuotaBuscada<=0){
        inputSearchMonth.className="form-control error";
        errorLabel2.innerText="Debe ingresar un número mayor a cero.";
        MsgPopUp('Debe ingresar un número mayor a cero');
    }else{
        if(calculo[4].some((cuota) => cuota === cuotaBuscada)){
            const cuotaEncontrada = document.getElementById(`cuota${cuotaBuscada}`);
            cuotaEncontrada.className = "cuotaEncontrada";
            errorLabel2.className="infoLabel";
            errorLabel2.innerText="Cuota encontrada y resaltada en verde.";
            MsgPopUp('Cuota encontrada y resaltada en verde','Atención', 'info');
        }else{
            errorLabel2.innerText="El préstamo no tiene esa cuota";
            MsgPopUp('El préstamo no tiene esa cuota');
        }
    }
}

function resetMenoresClass () {
    const menoresAnteriores = document.getElementsByClassName("cuotaMenor"); 
    Array.from(menoresAnteriores).forEach( celda => celda.className = "pagado");
}

function pagoMayor(valorReferencia) {

    const celdas = document.getElementsByClassName("pagado");
    let menores = calculo[3].filter(cuota => parseFloat(cuota) < valorReferencia);
    Array.from(celdas).forEach(celda => {
        menores.includes(parseFloat(celda.id)) && (celda.className = "cuotaMenor");
        // if (menores.includes(parseFloat(celda.id))){
        //     celda.className = "cuotaMenor";
        // }
    });

    errorLabel2.className="infoLabel";
    errorLabel2.innerText="Valores de cuota menores en azul.";
    MsgPopUp(`Valores de cuota menores que $${valorReferencia} resaltados en azul`,'Atención', 'info');
}

simuleForm.addEventListener("submit", (event) =>{
    event.preventDefault();
    let cuotas = parseInt(inputMonths.value);
    let tasa = parseFloat(inputRate.value);
    let num = inputAmount.value.replace(/,/g, "") //Remueve la coma.
    let monto = parseFloat(num.substring(1)); // Remueve el símbolo de moneda.
    errorLabel1.innerText="";
    Simular(cuotas, tasa, monto);
})

btnBuscar.addEventListener("click", () => {
    let cuota = parseInt(inputSearchMonth.value);
    errorLabel2.innerText="";
    errorLabel2.className="errorLabel";
    if(isNaN(cuota)){
        inputSearchMonth.className="form-control error";
        errorLabel2.innerText="Digite una cuota";
        MsgPopUp(`Es necesario que digite una cuota`,'Atención');
    }else{
        buscarCuota(cuota);
    }
})

btnMonto.addEventListener("click", () => {
    let num = searchAmountInput.value.replace(/[\D\s\._\-]+/g, "")
    let monto = parseFloat(num);
    errorLabel2.innerText="";
    errorLabel2.className="errorLabel";
    if( isNaN(monto)){
        searchAmountInput.className="form-control error";
        errorLabel2.innerText="Digite un monto";
        resetMenoresClass();
        MsgPopUp(`Es necesario que digite un monto`,'Atención');
    }else{
        pagoMayor(monto);
    }
})

btnBorrarCache.addEventListener("click", () => {
    let datosLocales = new dataLocal();
    let dataEliminada = datosLocales.borrarDataLocal();
    if (dataEliminada.length !== 0){
        msgLabel1.innerText="Data local eliminada exitosamente";
        MsgPopUp('Data local eliminada exitosamente','Atención', 'success');
    }else{
        msgLabel1.innerText="No existen datos locales";
        MsgPopUp('No existen datos locales','Atención', 'info');
    }
})

searchAmountInput.addEventListener("keyup", (event) => {
    formatInput(event, searchAmountInput);
})

inputAmount.addEventListener("keyup", (event) => {
    formatInput(event, inputAmount);
})

function formatInput(event, element) {
    let num = element.value.replace(/[\D\s\._\-]+/g, ""); // Limpia la entrada de caracteres no numéricos.
    const notInputKeys = ['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'];
    notInputKeys.includes(event.key) ? "" : element.value = moneda.format(num);
}

function MsgPopUp(msg, title, type) {
    Swal.fire({
        icon: type || 'error',
        title: title || '',
        text: msg ||'Ha ocurrido un error',
      })
}

function toastMsgPopUp(msg, title, type, time) {
    Swal.fire({
        
        // background: '#2AE300',
        // color: 'white',
        icon: type || 'error',
        // iconColor: 'white',
        position: 'top-end',
        showConfirmButton: false,
        title: title || 'Ha ocurrido un error',
        text: msg ||'',
        timer: time || 3000,
        timerProgressBar: true,
        toast: true,didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
      })
}

window.onload = () => {
    let datosLocales = new dataLocal();
    let dataLocalCargada = datosLocales.cargarDataLocal();
    console.log(dataLocalCargada);
    if (dataLocalCargada.length !== 0){
        inputMonths.value= dataLocalCargada.numCuotaLocal;
        inputAmount.value= dataLocalCargada.montoLocal;
        inputRate.value= dataLocalCargada.tasaLocal;
    }
}
