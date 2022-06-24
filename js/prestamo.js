let valido = false;
let continua = true;
let monto = 0;
let calculo = [];
let cuotaBuscada = 0;
let valorReferencia = 0;

function Simular (cuotas, tasa, monto) {
    if (cuotas>0){
        valido = true;
        document.getElementById("inputMonths").className="form-control";
    }else {
        document.getElementById("inputMonths").className="form-control error";
        document.getElementById("errorLabel").innerText="Debe ingresar un número positivo válido.";
    }

    if(valido){
        valido = false;
        if (tasa>0 && tasa<=1){
            valido = true;
            document.getElementById("inputRate").className="form-control";
        }else {
            document.getElementById("inputRate").className="form-control error";
            document.getElementById("errorLabel").innerText="Debe ingresar un número positivo entre cero y uno.";
        }
    }

    if(valido){
        valido = false;
        if (monto>0){
            valido = true;
            const prestamo = new Prestamo(tasa, cuotas, monto);
            calculo = prestamo.calcularPrestamo();
            console.table(prestamo);
            const table = document.querySelector("tbody");
            // console.log(table);
            table.innerHTML = `<tr id=cuota1>
                <td>${1}</td>
                <td>${calculo[0][0]}</td>
                <td>${calculo[1][0]}</td>
                <td>${calculo[2][0]}</td>
                <td class="pagado">${calculo[3][0]}</td>
                </tr>`;
            for(let i=1; i<calculo[0].length;i++){
                table.innerHTML += `<tr id=cuota${i+1}>
                <td>${i+1}</td>
                <td>${calculo[0][i]}</td>
                <td>${calculo[1][i]}</td>
                <td>${calculo[2][i]}</td>
                <td class="pagado">${calculo[3][i]}</td>
                </tr>`
            }
        document.getElementById("inputAmount").className="form-control";
        }else {
            document.getElementById("inputAmount").className="form-control error";
            document.getElementById("errorLabel").innerText="Debe ingresar un número positivo válido.";
        }
    }
}

function buscarCuota(cuotaBuscada) {

        document.getElementById("inputSearchMonth").className="form-control";
        if(cuotaBuscada<=0){
            document.getElementById("inputSearchMonth").className="form-control error";
            document.getElementById("errorLabel2").innerText="Debe digitar un número mayor a cero.";
        }
        document.getElementById("inputSearchMonth").value = cuotaBuscada;
        if(calculo[4].some((cuota) => cuota === cuotaBuscada)){
            const cuotaEncontrada = document.getElementById(`cuota${cuotaBuscada}`);
            cuotaEncontrada.className = "cuotaEncontrada";
            document.getElementById("errorLabel2").className="infoLabel";
            document.getElementById("errorLabel2").innerText="Cuota encontrada y resaltada en verde.";
        }else{
            document.getElementById("errorLabel2").innerText="El préstamo no tiene esa cuota";
        }
}

function pagoMayor(valorReferencia) {

        const celdas = document.getElementsByClassName("pagado");
        let menores = calculo[3].filter((cuota) => parseFloat(cuota) < valorReferencia);
        Array.from(celdas).forEach(celda => {
            if (menores.includes(celda.textContent)){
                celda.className = "cuotaMenor";
            }
        });

        document.getElementById("errorLabel2").className="infoLabel";
        document.getElementById("errorLabel2").innerText="Valores de cuota menores en azul.";
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
    }else{
        pagoMayor(monto);
    }
})