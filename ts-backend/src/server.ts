import express from 'express';
import Simulador, { tipoEscalonamento } from './Simulador';
import Processo, { ProcessDto } from './Processo';
const app = express();
const porta = 3000;

//simulador padrao
const simulador = new Simulador({processList:[], contextSwitch:0});

app.use(
    express.json()
)

app.get('/status',(req, res)=>{
    const status = simulador.statusJSONRepresentation();
    console.log(JSON.stringify(simulador.statusJSONRepresentation()))
    return res.status(200).send(status);
})

app.get('/listAll', (req, res)=>{
    return res.status(200).send(simulador.processListJSONRepresentation());
})

app.get('/log', (req, res)=>{
    return res.status(200).send(simulador.logJSONRepresentation());
})

app.get('/exec', (req, res) =>{
    const trocaContexto = (req.query.contextSwitch == undefined)?"0":req.query.contextSwitch.toString()
    simulador.contextSwitch = parseInt(trocaContexto);
    simulador.changeCurrentAlgorithm(req.query.scheduling);
    simulador.exec();
    return res.status(200).send(simulador.logJSONRepresentation());
})

app.post('/insertList', (req, res)=>{
    const lista = req.body;
    const listaProcessos = lista.map((elemento: ProcessDto) => new Processo(elemento));
    simulador.processList = listaProcessos
    return res.status(200).send(simulador.processList);
})

app.listen(porta);

console.log('Servidor rodando na porta http://localhost:3000');