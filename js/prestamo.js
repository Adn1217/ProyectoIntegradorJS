let valido = false;
let continua = true;
let tasa = 0;
let monto = 0;
let cuotas = 0;

do {
    plazo = parseInt(prompt("Digite número de meses"));
    if (plazo>0){
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
            let calculo = prestamo.calcularPrestamo(monto, tasa, plazo);
            console.table(calculo);
        }else {
            continua = confirm("Debe ingresar un número positivo válido")
        }
    }while(!valido && continua)
}

alert("Muchas gracias por usar nuestros servicios")

