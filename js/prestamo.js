let valido = false;
let continua = true;
let tasa = 0;
let monto = 0;
let cuotas = 0;

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
            let calculo = prestamo.calcularPrestamo();
            console.table(prestamo);
            const table = document.querySelector("tbody");
            console.log(table);
            table.innerHTML = `<tr>
                <td>${1}</td>
                <td>${calculo[0][0]}</td>
                <td>${calculo[1][0]}</td>
                <td>${calculo[2][0]}</td>
                <td>${calculo[3][0]}</td>
                </tr>`;
            for(let i=1; i<calculo[0].length;i++){
                table.innerHTML += `<tr>
                <td>${i+1}</td>
                <td>${calculo[0][i]}</td>
                <td>${calculo[1][i]}</td>
                <td>${calculo[2][i]}</td>
                <td>${calculo[3][i]}</td>
                </tr>`
            }
        }else {
            continua = confirm("Debe ingresar un número positivo válido")
        }
    }while(!valido && continua)
}

alert("Muchas gracias por usar nuestros servicios")

