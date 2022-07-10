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
        localStorage.setItem("datosSimulacion", dataLocalStr);
        console.log("La siguiente información fue guardada localmente : ",dataLocalStr);
    }

    cargarDataLocal(){
        let localData = JSON.parse(localStorage.getItem("datosSimulacion")) || [];
        // localData = localData.length ? JSON.parse(localData) : [];
        localData.length ?? console.log("Data local cargada exitosamente");
        localData.length==0 && console.log("No existen datos locales");
        // let localData = [];
        // if (localStorage.getItem("datosSimulacion")){
        //     localData = JSON.parse(localStorage.getItem("datosSimulacion"));
        //     console.log("Data local cargada exitosamente");
        // }else{
        //     console.log("No existen datos locales");
        // }
        return localData;
    }

    borrarDataLocal(){
        let localData = JSON.parse(localStorage.getItem("datosSimulacion")) || [];
        localData.length==0 && console.log("No existen datos locales");
        localData.length ?? localStorage.removeItem("datosSimulacion");
        localData.length ?? (console.log("Data local eliminada exitosamente: ", JSON.stringify(localData)) && localStorage.removeItem("datosSimulacion"));
        // let localData = [];
        // if (localStorage.getItem("datosSimulacion")){
        //     localData = JSON.parse(localStorage.getItem("datosSimulacion"));
        //     localStorage.removeItem("datosSimulacion");
        //     console.log("Data local eliminada exitosamente: ", JSON.stringify(localData))
        // }else{
        //     console.log("No existen datos locales");
        // }
        return localData;
    }
}