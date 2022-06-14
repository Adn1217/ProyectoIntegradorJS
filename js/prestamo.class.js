class Prestamo {

    constructor(tasa, cuotas, saldo, pagado=0){
        this.interes = tasa;
        this.cuotas = cuotas;
        this.saldo = saldo;
        this.pagado = pagado;
    }  

    calcularCuota(monto, tasa=this.interes, plazo=this.cuotas){
        let valorCuota= monto*(tasa*(1+tasa)**plazo) / ((1+tasa)**plazo - 1);
        return valorCuota;
    }

    calcularPrestamo(monto, tasa, cuotas){
        const prestamo = new Prestamo(tasa, cuotas, monto);
        let saldo = [];
        let cuota = [];
        let interes = [];
        let interesi = 0;
        let cuotai= prestamo.calcularCuota(monto, tasa, cuotas) ;
        let saldoi = monto;
        let pagadoi = 0;
        let pagado = [];

        for(let i = 1; i<=cuotas; i++){
            interesi = saldoi*(tasa);
            saldoi -= (cuotai-interesi);
            pagadoi += cuotai;

            console.log("Cuota ",i,": ",cuotai.toFixed(3));
            console.log("Interes ",i,": ",interesi.toFixed(3));
            console.log("Saldo ",i,": ",saldoi.toFixed(3));
            console.log("Pagado: ", pagadoi.toFixed(3));

            interes.push(interesi.toFixed(3));
            cuota.push(cuotai.toFixed(3));
            saldo.push(saldoi.toFixed(3));
            pagado.push(pagadoi.toFixed(3));
        }
        return [interes, cuota, saldo, pagado]
    }
}