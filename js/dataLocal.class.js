class dataLocal {

    constructor(tasa, numCuotas, monto, nombre){
        this.nombre = nombre;
        this.tasaLocal = tasa;
        this.numCuotaLocal = numCuotas;
        this.montoLocal = monto;
    }  

    guardarDataLocal(tasa=this.tasaLocal, plazo=this.numCuotaLocal, monto=this.montoLocal, nombre=this.nombre){
        let dataAGuardar = new dataLocal(tasa, plazo, monto, nombre);
        console.log(dataAGuardar);
        let dataLocalStr = JSON.stringify(dataAGuardar);
        localStorage.setItem(nombre, dataLocalStr);
        console.log("La siguiente información fue guardada localmente : ",dataLocalStr);
    }

    cargarDataLocal(nombre=this.nombre){
        let localData = JSON.parse(localStorage.getItem(nombre)) || [];
        // localData = localData.length ? JSON.parse(localData) : [];
        localData.length ?? console.log("Data local cargada exitosamente");
        localData.length==0 && console.log("No existen datos locales");
        // let localData = [];
        // if (localStorage.getItem(nombre)){
        //     localData = JSON.parse(localStorage.getItem(nombre));
        //     console.log("Data local cargada exitosamente");
        // }else{
        //     console.log("No existen datos locales");
        // }
        return localData;
    }

    borrarDataLocal(nombre=this.nombre){
        let localData = JSON.parse(localStorage.getItem(nombre)) || [];
        localData.length==0 && console.log("No existen datos locales");
        localData.length ?? localStorage.removeItem(nombre);
        localData.length ?? (console.log("Data local eliminada exitosamente: ", JSON.stringify(localData)) && localStorage.removeItem(nombre));
        // let localData = [];
        // if (localStorage.getItem(nombre)){
        //     localData = JSON.parse(localStorage.getItem(nombre));
        //     localStorage.removeItem(nombre);
        //     console.log("Data local eliminada exitosamente: ", JSON.stringify(localData))
        // }else{
        //     console.log("No existen datos locales");
        // }
        return localData;
    }
}