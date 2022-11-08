import express from 'express';
import Simulador from './Simulador';
import Processo, { ProcessDto } from './Processo';
const app = express();
const porta = 3000;

//simulador padrao
const simulador = new Simulador({processList:[], contextSwitch:0});

app.use(
    express.json()
)

app.get('/',(req, res)=>{
    return res.send('Hello World');
})

app.get('/status',(req, res)=>{
    const status = simulador.statusJSONRepresentation();
    console.log(JSON.stringify(simulador.statusJSONRepresentation()))
    return res.status(200).send(status);
})

app.get('/listaProcessos', (req, res)=>{
    return res.status(200).send(simulador.processListJSONRepresentation());
})

app.get('/log', (req, res)=>{
    return res.status(200).send(simulador.logJSONRepresentation());
})

app.get('/exec', (req, res) =>{
    simulador.exec();
    return res.status(200).send(simulador.logJSONRepresentation());
})

app.post('/simula', (req, res)=>{
    console.log(req.body);
    return res.status(200).send(req.body)
})

app.patch('/updateLista', (req, res)=>{
    const lista = req.body;
    const listaProcessos = lista.map((elemento: ProcessDto) => new Processo(elemento));
    simulador.processList = listaProcessos
    return res.status(200).send(simulador.processList);
})

app.listen(porta);

console.log('Servidor rodando na porta http://localhost:3000');