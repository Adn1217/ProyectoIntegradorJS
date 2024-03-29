let valido = false;
let continua = true;
let monto = 0;
let calculo = [];
let calculoMoneda = [];
let cuotaBuscada = 0;
let valorReferencia = 0;
let [dolares, euros, pesos] = [null, null, null];
let dataIngresada = [];
let localRateData = [];
let moneda;
const DateTime = luxon.DateTime;
const settings = luxon.Settings;

settings.defaultLocale = 'es-ES';


window.onload = () => {
    initTooltips();
    addRadioEvents();
    exchangeFetch();
    let datosLocales = new dataLocal();
    let dataLocalCargada = datosLocales.cargarDataLocal("datosSimulacion");
    console.log(dataLocalCargada);
    dataLocalCargada.moneda == 'EUR' ? euro.checked=true : (dataLocalCargada.moneda == 'COP' ? peso.checked=true : dolar.checked=true);
    moneda = seleccionMoneda();
    let tasaLocalCargada = datosLocales.cargarDataLocal("tasasCambio");
    console.log(tasaLocalCargada);

    if (dataLocalCargada.length !== 0){
        inputMonths.value= dataLocalCargada.numCuotaLocal;
        inputRate.value= dataLocalCargada.tasaLocal;
        inputAmount.value= moneda.format(dataLocalCargada.montoLocal);
    }

    if (tasaLocalCargada.length !== 0){
        showExchange(tasaLocalCargada);
    }
}


setInterval( () => { //Actualiza la tasa de cambio cada 2 min.
    exchangeFetch();
}
, 120000)

function seleccionMoneda() {
    let monedaActual = dolar.checked ? 'en-US' : 'es-ES';
    let currencyFormato = currencyFormat();     
    moneda = new Intl.NumberFormat(monedaActual, currencyFormato );
    return moneda
}

function currencyFormat() {
    let seleccion = dolar.checked ? 'USD' : euro.checked ? 'EUR' : 'COP';
    let currencyFormat = {
        style: 'currency',
        currency: seleccion,
        minimumFractionDigits: 0
    }
    return currencyFormat
}

function initTooltips(){
    let tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    let tooltipList = tooltipTriggerList.map(
        function(tooltipTriggerEl){
            return new bootstrap.Tooltip(tooltipTriggerEl, {
                animation: true, 
                delay: 0, 
                placement: 'top'
            })
        })
    return tooltipList;
}

function Simular(cuotas, tasa, monto) {
    
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
        if (tasa/100>0 && tasa/100<=1){
            valido = true;
            inputRate.className="form-control";
        }else {
            inputRate.className="form-control error";
            errorLabel1.innerText="Debe ingresar un número positivo entre cero y uno.";
            MsgPopUp('Debe ingresar un número positivo entre cero y uno')
        }
    }

    if(valido){
        [tableHead.innerHTML, tableBody.innerHTML, fecha.innerText]=["","",""];
        spinner.classList.add(...["spinner-border","text-primary"]);
        // spinner.className = "spinner-border text-primary";
        toastMsgPopUp('',"Calculando...",'info',1500);
        setTimeout(() =>{
            spinner.classList.remove(...["spinner-border","text-primary"]);
            // spinner.className="";
            calcularTabla(cuotas, tasa, monto);
        },2000);
    }
}

function calcularFecha(){

    const ahora = DateTime.now();
    const diaSemana = ahora.toFormat('cccc');
    const fechaAhora = ahora.toFormat("dd'/'MM'/'yyyy") // Se puede usar toLocalString(DateTime.DATE_SHORT)
    const hora = ahora.toLocaleString(DateTime.TIME_24_WITH_SECONDS);
    return [ahora, diaSemana, fechaAhora, hora];
}

function calcularTabla(cuotas, tasa, monto){
    [ahora, diaSemana, fechaAhora, hora] = calcularFecha();
    valido = false;
    if (monto>0 && !isNaN(monto)){
        moneda = seleccionMoneda();
        let currency = moneda.resolvedOptions().currency;
        valido = true;
        calculoMoneda = [];
        fecha.className="";
        // dataIngresada = new dataLocal(tasa, cuotas, inputAmount.value, currency "datosSimulacion");
        dataIngresada = new dataLocal(tasa, cuotas, monto, currency, "datosSimulacion");
        // dataIngresada.guardarDataLocal(...Object.values(dataIngresada),"datosSimulacion");
        dataIngresada.guardarDataLocal();
        const prestamo = new Prestamo(tasa/100, cuotas, monto);
        calculo = prestamo.calcularPrestamo();
        // let dataLocalStr = JSON.stringify(prestamo);
        // localStorage.setItem("dataLocalPrestamo", dataLocalStr);
        calculo.forEach( col => {
            calculoMoneda.push(col.map(moneda.format))
            })
        console.table(prestamo);
       
        results.innerText = "Resultados";
        tableHead.innerHTML = 
        `<tr class="animate__animated animate__bounce">
            <th>#</th>
            <th>Intereses</th>
            <th>Cuota</th>
            <th>Saldo</th>
            <th>Pagado</th>
        </tr>`;
        tableBody.innerHTML = 
        `<tr id=cuota1 class="animate__animated animate__bounce">
            <td>${1}</td>
            <td id=${calculo[0][0]}>${calculoMoneda[0][0]}</td>
            <td id=${calculo[1][0]}>${calculoMoneda[1][0]}</td>
            <td id=${calculo[2][0]}>${calculoMoneda[2][0]}</td>
            <td id=${calculo[3][0]} class="pagado">${calculoMoneda[3][0]}</td>
        </tr>`;
        for(let i=1; i<calculo[0].length; i++){
            tableBody.innerHTML += 
            `<tr id=cuota${i+1} class="animate__animated animate__bounce">
                <td>${i+1}</td>
                <td id=${calculo[0][i]}>${calculoMoneda[0][i]}</td>
                <td id=${calculo[1][i]}>${calculoMoneda[1][i]}</td>
                <td id=${calculo[2][i]}>${calculoMoneda[2][i]}</td>
                <td id=${calculo[3][i]} class="pagado">${calculoMoneda[3][i]}</td>
            </tr>`
        }
        inputAmount.className="form-control";
        searchForm.disabled = false;
        toastMsgPopUp('','Cálculo realizado exitosamente','success',2000);
        valido = false;
        fecha.innerText= ["Cálculo realizado el", diaSemana, fechaAhora,"a las", hora].join(" ") + ".";
        // fecha.innerText="Cálculo realizado el " + diaSemana + ' ' + fechaAhora +" a las " + hora + ".";
        fecha.className="animate__animated animate__backInUp";
    }else {
        inputAmount.className="form-control error";
        errorLabel1.innerText="Debe ingresar un número positivo válido.";
        MsgPopUp('Debe ingresar un número positivo válido');
    }
}

function buscarCuota(cuotaBuscada) {

    let buscadoAntes = document.getElementsByClassName("cuotaEncontrada");
    Array.from(buscadoAntes).forEach( celda => celda.className = "");

    inputSearchMonth.className="form-control";
    inputSearchMonth.value = cuotaBuscada;
    msgLabel1.innerText="";

    if(cuotaBuscada<=0){
        inputSearchMonth.className="form-control error";
        errorLabel2.innerText="Debe ingresar un número mayor a cero.";
        MsgPopUp('Debe ingresar un número mayor a cero');
    }else{
        if(calculo[4]?.some((cuota) => cuota === cuotaBuscada) || document.getElementById(`cuota${cuotaBuscada}`)){
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
    let menores = calculo[3]?.filter(cuota => parseFloat(cuota) < valorReferencia);
    Array.from(celdas).forEach(celda => {
        let celdaIdFloat = parseFloat(celda.id);
        (menores?.includes(celdaIdFloat) && (celda.className = "cuotaMenor") || (celdaIdFloat < valorReferencia) && (celda.className = "cuotaMenor"));
        // if (menores?.includes(parseFloat(celda.id) || (celdaIdFloat < valorReferencia) )){
        //     celda.className = "cuotaMenor";
        // }
    });

    errorLabel2.className="infoLabel";
    errorLabel2.innerText="Valores de cuota menores en azul.";
    MsgPopUp(`Valores de cuota menores que ${moneda.format(valorReferencia)} resaltados en azul`,'Atención', 'info');
}

simuleForm.addEventListener("submit", (event) =>{
    event.preventDefault();
    let cuotas = parseInt(inputMonths.value);
    let tasa = parseFloat(inputRate.value);
    // let num = inputAmount.value.replace(/[^0-9\.-]+/g, "") // Quita caracteres no numéricos, manteniendo el punto.
    let currencyOptions = moneda.resolvedOptions();
    currencyOptions.currency == 'COP' ? monto = inputAmount.value.replace(/[^0-9,-]+/g, "") : monto = inputAmount.value.replace(/[^0-9.-]+/g, ""); // Quita caracteres no numéricos y el punto para COP o la coma para USD y EUR.
    console.log(monto);
    errorLabel1.innerText="";
    Simular(cuotas, tasa, monto)
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
    let dataEliminada = datosLocales.borrarDataLocal("datosSimulacion");
    if (dataEliminada.length !== 0){
        msgLabel1.innerText="Data local eliminada exitosamente";
        MsgPopUp('Data local eliminada exitosamente','Atención', 'success');
    }else{
        msgLabel1.innerText="No existen datos locales";
        MsgPopUp('No existen datos locales','Atención', 'info');
    }
})

function addRadioEvents(){
    radioButtons.forEach((radio) => {
        radio.addEventListener('change', ({target}) => {
            let currencyOptions = moneda.resolvedOptions();
            dataIngresada.nombre ?? (currencyOptions.currency == 'USD' ? monto = inputAmount.value.replace(/[^0-9.]+/g, "") : monto = inputAmount.value.replace(/[^0-9,]+/g, "")) // Quita caracteres no numéricos y el punto para COP o la coma para USD y EUR.
            dataIngresada.nombre ?? (currencyOptions.currency !== 'USD' && (monto = monto.replace(/,/g, "."))); // Reemplaza coma por punto para COP y EUR.
            if (euros){
                target.id == 'euro' ? (currencyOptions.currency == 'USD' ? monto = monto * euros : monto = (monto / pesos) * euros) : target.id == 'peso' ? (currencyOptions.currency == 'USD' ? monto = monto * pesos : monto = (monto / euros) * pesos) : target.id == 'dolar' && (currencyOptions.currency == 'EUR' ? monto = monto / euros : monto = monto / pesos);
            }
            seleccionMoneda();
            dataIngresada.nombre && Simular(dataIngresada.numCuotaLocal,dataIngresada.tasaLocal,monto);
            dataIngresada.nombre && (searchAmountInput.value = '');
            dataIngresada.nombre && (errorLabel2.innerText= '');
            inputAmount.value = moneda.format(monto);
        });
    })
}

searchAmountInput.addEventListener("keyup", ({key}) => {
    formatInput(key, searchAmountInput);
})

inputAmount.addEventListener("keyup", ({key}) => {
    formatInput(key, inputAmount);
})

function formatInput(eventKey, element) {

    let num = element.value.replace(/[\D\s\._\-]+/g, ""); // Limpia la entrada de caracteres no numéricos.
    let notInputKeys = ['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'];
    notInputKeys.includes(eventKey) ? "" : element.value = moneda.format(num);
}

btnFetch.addEventListener("click", async () => {
    let confirmationProm = await ConfMsgPopUp('Se cargará información fija de la API ¿Desea continuar?','Atención');
    if (confirmationProm.isConfirmed) {
        tableHead.innerHTML = '';
        tableBody.innerHTML = '';
        fecha.innerText = '';
        toastMsgPopUp('',"Recibiendo información...",'info',1500);
        spinner.classList.add(...["spinner-border","text-primary"]);
        setTimeout( async () =>{
            spinner.classList.remove(...["spinner-border","text-primary"]);
            let respuesta = await doFetch(1);
            respuesta=='error' ? MsgPopUp('Se ha presentado error en el servicio','Atención','error') : [data, dataMoneda] = mostrarDataFetch(respuesta);
            respuesta=='error' || toastMsgPopUp('', 'Data cargada exitosamente', 'success', 1500);
            searchForm.disabled = false;
        },2000);
    }
})

async function doFetch(poke){
    try{
    // fetch(`https://pokeapi.co/api/v2/pokemon/${poke}`)
        let resp = await fetch('js/datos.json')
        let data = await resp.json()
        return data;
    }catch(error){
        console.log('Ha ocurrido el siguiente error:', error.message)
        return 'error'
    }
}

function mostrarDataFetch(data){

    let dataMoneda = {};
    calculo = [];
    [ahora, diaSemana, fechaAhora, hora] = calcularFecha();
    Object.entries(data).forEach((key) => {
        Array.isArray(key[1]) ?? (dataMoneda[key[0]] = key[1]);
        Array.isArray(key[1]) && (dataMoneda[key[0]] = key[1]?.map((ele) =>moneda.format(ele.toString())));
    })
    // console.log(data)
    console.log("Se carga exitosamente la siguiente información:",dataMoneda);
    results.innerText = "Resultados";
    tableHead.innerHTML = 
    `<tr class="animate__animated animate__bounce">
        <th>#</th>
        <th>Intereses</th>
        <th>Cuota</th>
        <th>Saldo</th>
        <th>Pagado</th>
    </tr>`;
    tableBody.innerHTML = 
    `<tr id=cuota1 class="animate__animated animate__bounce">
        <td>${1}</td>
        <td id=${data["interesCuota"][0]}>${dataMoneda["interesCuota"][0]}</td>
        <td id=${data["cuota"][0]}>${dataMoneda["cuota"][0]}</td>
        <td id=${data["saldo"][0]}>${dataMoneda["saldo"][0]}</td>
        <td id=${data["pagado"][0]} class="pagado">${dataMoneda["pagado"][0]}</td>
    </tr>`;
    for(let i=1; i<data["interesCuota"].length; i++){
        tableBody.innerHTML += 
        `<tr id=cuota${i+1} class="animate__animated animate__bounce">
            <td>${i+1}</td>
            <td id=${data["interesCuota"][i]}>${dataMoneda["interesCuota"][i]}</td>
            <td id=${data["cuota"][i]}>${dataMoneda["cuota"][i]}</td>
            <td id=${data["saldo"][i]}>${dataMoneda["saldo"][i]}</td>
            <td id=${data["pagado"][i]} class="pagado">${dataMoneda["pagado"][i]}</td>
        </tr>`
    }
    inputMonths.className = inputRate.className = inputAmount.className = ("form-control actualizado");
    [inputMonths.value, inputRate.value, inputAmount.value] = [data["numCuotas"], data["tasa"], moneda.format(data["monto"])];
    fecha.innerText= ["Carga realizada el", diaSemana, fechaAhora,"a las", hora].join(" ") + ".";
    // fecha.innerText="Cálculo realizado el " + diaSemana + ' ' + fechaAhora +" a las " + hora + ".";
    fecha.className="animate__animated animate__backInUp";
    return [data, dataMoneda];
}

function ConfMsgPopUp(msg, title, confMsg) {
    return Swal.fire({
        title: title || '¿Está seguro?',
        text: msg || "Se sobreescribirá la información",
        icon: 'warning',
        showCancelButton: true,
        // confirmButtonColor: '#3085d6',
        // cancelButtonColor: '#d33',
        confirmButtonText: confMsg || 'Aceptar'
      })/*.then((result) => {
        if (result.isConfirmed) {
        //   Swal.fire(
        //     'Deleted!',
        //     'Your file has been deleted.',
        //     'success'
        //   )
            return true;
        }else{
            return false;
        }
      })*/
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

async function exchangeFetch(){
    try{
        let rates = await doExchangeFetch();
        let ratesJSON = await JSON.parse(rates);
        if (ratesJSON?.success) {
            showExchange(ratesJSON);
        }else{
            throw new Error(ratesJSON.message)
        }
    }catch(error) {
        console.error("Se presentó el siguiente error consumiendo el servicio:", error.message,". Verifique la consulta realizada.")
        fechaCR.className = "errorLabel";
        fechaCR.innerText = "Se presentó el siguiente error consumiendo el servicio: "+ error +". Verifique la consulta realizada.";
    }

}

function showExchange(ratesJSON){

    [ahora, diaSemana, fechaAhora, hora] = calcularFecha();
    fechaCR.innerText = "";
    fechaCR.className = "";
    currencySpinner.classList.add(...["spinner-border","text-primary", "margin-top-cSpinner"]);
    currencySpinner.classList.remove(...["spinner-border","text-primary","margin-top-cSpinner"]);
    let inicioLabel = "Vigente el";
    if (ratesJSON?.success || ratesJSON?.nombre == "tasasCambio") {
        ratesJSON?.nombre && (inicioLabel = "Cargado el");
        dolares = ratesJSON?.montoLocal || 1;
        euros = ratesJSON.rates?.EUR || ratesJSON.tasaLocal;
        pesos = ratesJSON.rates?.COP || ratesJSON.numCuotaLocal;
        dolarInput.value = dolares +" USD";
        euroInput.value = euros.toFixed(2)+ " EUR";
        pesoInput.value = pesos.toFixed(2) + " COP"
        console.log(ratesJSON);
        fechaCR.innerText= [inicioLabel, diaSemana, fechaAhora,"a las", hora].join(" ") + ".";
        fechaCR.className = "animate__animated animate__flash";
        const dataIngresada = new dataLocal(euros, pesos, dolares, moneda.resolvedOptions().currency, "tasasCambio");
        ratesJSON?.success && dataIngresada.guardarDataLocal();
    }
}

async function doExchangeFetch(){
    let myHeaders = new Headers();
    myHeaders.append("apikey", config.myApiKey);

    let requestOptions = {
    method: 'GET',
    redirect: 'follow',
    headers: myHeaders
    };

    let resp = await fetch(config.myURL, requestOptions);
    // console.log(resp)
    let respStr = await resp.text();
    console.log(respStr)
    return respStr;
}
