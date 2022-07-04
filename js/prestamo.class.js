class Prestamo {

    constructor(tasa, numCuotas, monto){
        this.numCuota = [];
        this.tasa = tasa;
        this.numCuotas = numCuotas;
        this.interesCuota = [];
        this.cuota = [];
        this.monto = monto;
        this.saldo = [];
        this.pagado = [];
    }  

    calcularCuota(monto, tasa=this.tasa, plazo=this.numCuotas){
        let valorCuota= monto*(tasa*(1+tasa)**plazo) / ((1+tasa)**plazo - 1);
        return valorCuota;
    }

    calcularPrestamo(){
        let interesi = 0;
        let saldoi = this.monto;
        let cuotai = this.calcularCuota(saldoi, this.tasa, this.numCuotas);
        let pagadoi = 0;

        for(let i = 1; i<=this.numCuotas; i++){
            interesi = saldoi*(this.tasa);
            saldoi -= (cuotai-interesi);
            pagadoi += cuotai;

            console.log("Cuota ",i,": ",cuotai.toFixed(3));
            console.log("Interes ",i,": ",interesi.toFixed(3));
            console.log("Saldo ",i,": ",saldoi.toFixed(3));
            console.log("Pagado: ", pagadoi.toFixed(3));

            this.interesCuota.push(interesi);
            this.numCuota.push(i);
            this.cuota.push(cuotai);
            this.saldo.push(saldoi);
            this.pagado.push(pagadoi);
        }
        return [this.interesCuota, this.cuota, this.saldo, this.pagado, this.numCuota]
    }
}