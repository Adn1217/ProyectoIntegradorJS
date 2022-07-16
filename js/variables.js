//------------------LABELS-----------------
let msgLabel1 = document.getElementById("msgLabel");
let errorLabel1 = document.getElementById("errorLabel");
let errorLabel2 = document.getElementById("errorLabel2");
let fecha = document.getElementById("date");
let fechaCR = document.getElementById("currencyDate");
//------------------INPUTS-----------------
let inputMonths = document.getElementById("inputMonths");
let inputRate = document.getElementById("inputRate");
let inputAmount = document.getElementById("inputAmount");
let inputSearchMonth = document.getElementById("inputSearchMonth");
let searchAmountInput = document.getElementById("inputSearchAmount");
let dolarInput = document.getElementById("dolarActual");
let euroInput = document.getElementById("euroActual");
let pesoInput = document.getElementById("pesoActual");

//-----------------BUTTONS-----------------
let btnBuscar = document.getElementById("btnBuscar");
let btnMonto = document.getElementById("btnMonto");;
let btnBorrarCache = document.getElementById("btnBorrarCache");;
let btnFetch = document.getElementById("btnFetch");;

//-----------------RADIO BUTTONS-----------
let dolar = document.getElementById("dolar");
let euro = document.getElementById("euro");
let peso = document.getElementById("peso");
let radioButtons = document.getElementsByName('optradio');

//-----------------FORMS-------------------
let simuleForm = document.getElementById("simuleForm");
let searchForm = document.getElementById("searchFieldset");

//-----------------DIVS--------------------
let spinner = document.getElementById("spinner");
let currencySpinner = document.getElementById("currencySpinner");

//-----------------TABLE-------------------
const tableHead = document.querySelector("thead");
let tableBody = document.querySelector("tbody");