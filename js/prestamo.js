let valido = false;
let continua = true;

function calcularPrestamo(monto, tasa, cuotas){
    let saldo = [];
    let cuota = [];
    let interes = [];
    let interesi = 0;
    let cuotai= monto*(tasa*(1+tasa)**plazo) / ((1+tasa)**plazo - 1);
    let saldoi = monto;
    let pagado = 0;

    for(let i = 1; i<=cuotas; i++){
        interesi = saldoi*(tasa);
        saldoi -= (cuotai-interesi);
        pagado += cuotai;
        console.log("Cuota ",i,": ",cuotai.toFixed(3));
        console.log("Interes ",i,": ",interesi.toFixed(3));
        console.log("Saldo ",i,": ",saldoi.toFixed(3));
        console.log("Pagado: ", pagado.toFixed(3));
        interes.push(interesi.toFixed(3));
        cuota.push(cuotai.toFixed(3));
        saldo.push(saldoi.toFixed(3));
    }
    return [interes, cuota, saldo]
}

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
            let calculo = calcularPrestamo(monto, tasa, plazo);
            console.log(calculo);
        }else {
            continua = confirm("Debe ingresar un número positivo válido")
        }
    }while(!valido && continua)
}

alert("Muchas gracias por usar nuestros servicios")

