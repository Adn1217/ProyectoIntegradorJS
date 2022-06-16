let valido = false;
let continua = true;
let tasa = 0;
let monto = 0;
let cuotas = 0;
let calculo = [];
let cuotaBuscada = 0;
let valorReferencia = 0;

do {
    cuotas = parseInt(prompt("Digite número de meses"));
    if (cuotas>0){
        valido = true;
    }else {
        continua = confirm("Debe ingresar un número positivo válido")
    }
}while(!valido && continua)

if(valido){
    valido = false;
    do {
        tasa = parseFloat(prompt("Digite tasa de interés mensual"));
        if (tasa>0 && tasa<=1){
            valido = true;
        }else {
            continua = confirm("Debe ingresar un número positivo entre cero y uno")
        }
    }while(!valido && continua)
}

if(valido){
    valido = false;
    do {
        monto = parseFloat(prompt("Digite monto prestado"));
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
        }else {
            continua = confirm("Debe ingresar un número positivo válido")
        }
    }while(!valido && continua)
}

if(valido && confirm("¿Desea buscar valores de una cuota especifica?")){
    do {
        cuotaBuscada = parseFloat(prompt("Digite la cuota a buscar"));
        if(cuotaBuscada<=0){
            alert("Debe digitar un número mayor a cero")
        }
    } while (cuotaBuscada<=0)

    if(calculo[4].some((cuota) => cuota === cuotaBuscada)){
        const cuotaEncontrada = document.getElementById(`cuota${cuotaBuscada}`);
        cuotaEncontrada.className = "cuotaEncontrada";
        alert("Cuota encontrada y resaltada en rojo")
    }else{
        alert("El préstamo no tiene esa cuota")
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

    alert("Valores de cuota menores en azul")

}
alert("Muchas gracias por usar nuestros servicios")

