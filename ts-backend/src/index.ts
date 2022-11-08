import { tipoEscalonamento } from "./Simulador";
import Processo from "./Processo"
import Simulador from "./Simulador";

const p1 = new Processo ({pid: 'p1',arrivalTime:10,burstTime: 5,quantum: 10});
const p2 = new Processo ({pid: 'p2',arrivalTime:3,burstTime: 15,quantum: 10});
const p3 = new Processo ({pid: 'p3',arrivalTime:4,burstTime: 28,quantum: 10});
const p4 = new Processo ({pid: 'p4',arrivalTime:12,burstTime: 11,quantum: 10});


const listaProcessos = [p1, p2, p3, p4];

const simulador1 = new Simulador({processList: listaProcessos, contextSwitch: 2});
simulador1.exec();
// console.log(simulador1.getProcessList())