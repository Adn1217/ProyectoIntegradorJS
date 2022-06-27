class dataLocal {

    constructor(tasa, numCuotas, monto){
        this.tasaLocal = tasa;
        this.numCuotaLocal = numCuotas;
        this.montoLocal = monto;
    }  

    guardarDataLocal(tasa=this.tasaLocal, plazo=this.numCuotaLocal, monto=this.montoLocal){
        let dataAGuardar = new dataLocal(tasa, plazo, monto);
        console.log(dataAGuardar);
        let dataLocalStr = JSON.stringify(dataAGuardar);
        localStorage.setItem("dataLocal", dataLocalStr);
        console.log("La siguiente información fue guardada localmente : ",dataLocalStr);
    }

    cargarDataLocal(){
        let localData = [];
        if (localStorage.getItem("dataLocal")){
            localData = JSON.parse(localStorage.getItem("dataLocal"));
            console.log("Data local cargada exitosamente");
        }else{
            console.log("No existen datos locales");
        }
        return localData;
    }

    borrarDataLocal(){
        let localData = [];
        if (localStorage.getItem("dataLocal")){
            localData = JSON.parse(localStorage.getItem("dataLocal"));
            localStorage.removeItem("dataLocal");
            console.log("Data local eliminada exitosamente");
        }else{
            console.log("No existen datos locales");
        }
        return localData;
    }
}