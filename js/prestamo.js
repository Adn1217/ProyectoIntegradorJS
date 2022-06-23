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

    if(valido && confirm("¿Desea buscar valores de una cuota especifica?")){
        // cuotaBuscada = parseFloat(prompt("Digite la cuota a buscar"));
        document.getElementById("inputSearchMonth").className="form-control";
        if(cuotaBuscada<=0){
            alert("Debe digitar un número mayor a cero")
            document.getElementById("inputSearchMonth").className="form-control error";
            document.getElementById("errorLabel2").innerText="Debe digitar un número mayor a cero.";
        }
        document.getElementById("inputSearchMonth").value = cuotaBuscada;
        if(calculo[4].some((cuota) => cuota === cuotaBuscada)){
            const cuotaEncontrada = document.getElementById(`cuota${cuotaBuscada}`);
            cuotaEncontrada.className = "cuotaEncontrada";
            alert("Cuota encontrada y resaltada en verde.")
        }else{
            alert("El préstamo no tiene esa cuota")
            document.getElementById("errorLabel2").innerText="El préstamo no tiene esa cuota";
        }
    }

    if(valido && confirm("¿Desea resaltar pagos acumulados menores a uno puntual?")){

        valorReferencia = parseFloat(prompt("Digite valor de referencia"));
        const celdas = document.getElementsByClassName("pagado");
        let menores = calculo[3].filter((cuota) => parseFloat(cuota) < valorReferencia);
        Array.from(celdas).forEach(celda => {
            if (menores.includes(celda.textContent)){
                celda.className = "cuotaMenor";
            }
        });

        alert("Valores de cuota menores en azul.")
        document.getElementById("inputSearchAmount").value = valorReferencia;
    }
}

let btnSimular = document.getElementById("btnSimular");
btnSimular = addEventListener("submit", (event) =>{
    event.preventDefault();
    let cuotas = parseInt(document.getElementById("inputMonths").value);
    let tasa = parseFloat(document.getElementById("inputRate").value);
    let monto = parseFloat(document.getElementById("inputAmount").value);
    Simular(cuotas, tasa, monto);
    document.getElementById("searchFieldset").disabled = false;
})

let btnBuscar = document.getElementById("btnBuscar");
btnBuscar = addEventListener("click", () => {
    let cuota = parseInt(document.getElementById("inputSearchMonth").value)
    buscarCuota(cuota);
})