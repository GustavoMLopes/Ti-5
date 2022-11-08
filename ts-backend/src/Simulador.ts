import Processo from './Processo';
import fs from 'fs';

interface ConfigDTO{
    processList: Processo[];
    contextSwitch: number;
    logPath?: string;
}

export enum tipoEscalonamento{
    fcfs = 'FirstComeFirstService', //escalonamento padrão
    sjf = 'ShortestJobFirst',
    sjf_np = 'ShortestJobFirstNaoPreemptivo',
    round_robin =  'RoundRobin'
}

export default class Simulador{
    private _simulationFrames: string[];
    private _processList: Processo[];
    private _arrivalTimes: number[];
    // métricas do escalonador
    private _contextSwitch: number;
    private _cpuUsage: number;
    private _trhoughput: number;
    private _simulationTime:number;
    private _nextArrivalIndex: number;
    // atributos de log
    private _logPath: string;
    private _currentAlgorithm: tipoEscalonamento;


    constructor({processList, contextSwitch, logPath}:ConfigDTO){
        this._processList = []
        this._arrivalTimes = []
        this._currentAlgorithm = tipoEscalonamento.fcfs;
        //atribuição e ordenação da lista de processo
        this._processList = this.cloneList(processList);
        this._processList.sort((a, b) => (a.arrivalTime < b.arrivalTime) ? -1 : 1);

        this._contextSwitch = contextSwitch;
        this._cpuUsage = 0;
        this._trhoughput = 0;
        this._simulationTime = 0;
        this._logPath = './log/';
        this._nextArrivalIndex = 0;
        this._simulationFrames = [];
    }
    
    public set contextSwitch(contextSwitch: number){
        this._contextSwitch = contextSwitch;
    }

    public set processList(processList: Processo[]){
        this._processList = this.cloneList(processList);
    }

    public changeCurrentAlgorithm(algorithm:any){
        if(algorithm != undefined){
            const choice = algorithm.toLowerCase();
            if(choice == tipoEscalonamento.sjf.toLowerCase()|| choice == 'sj' || choice == 'sjf'){
                this._currentAlgorithm = tipoEscalonamento.sjf;
            }    
            else if(choice == tipoEscalonamento.sjf_np.toLowerCase() || choice == 'sjfnp' || choice == 'sjf_np' || choice == 'sjf-np'){
                this._currentAlgorithm = tipoEscalonamento.sjf_np;
            }
            else if(choice == tipoEscalonamento.round_robin.toLowerCase() || choice == 'rr'){
                this._currentAlgorithm = tipoEscalonamento.round_robin;
            }
            else{
                this._currentAlgorithm = tipoEscalonamento.fcfs;
            }
        }
    }

    public get processList(){
        return this.cloneList(this._processList);
    }

    public exec(){
        this.reset();
        this.buildArrivalTimesList();
        if(this._processList.length > 0){
            if(this._currentAlgorithm == tipoEscalonamento.fcfs){
                //first come first service
                this.fcfs();
            }
            else if(this._currentAlgorithm == tipoEscalonamento.sjf){
                this.sjf(true);
            }   

            else if(this._currentAlgorithm == tipoEscalonamento.sjf_np){
                this.sjf(false);
            }
            else{
                this.roundRobin();
            }
            this.log();
        }
    }

    private fcfs(){
        let listaProntos:Processo[];
        listaProntos = [];
        let atual = this._processList[0]
        this._simulationTime = atual.arrivalTime;
        atual.executa();
        //sempre removemos o primeiro elemento a chegar
        this._arrivalTimes.splice(0, 1);
        this._nextArrivalIndex = 1;
        do{
            this.updateByArrival(listaProntos);
            if(atual.execTime >= atual.burstTime){
                atual = this.escalonate(atual, listaProntos);
            }
            this._simulationFrames.push(this.createFrame());
            atual.atualizaExecTime();
            this._simulationTime++;
        }while(!(this._arrivalTimes.length <= 0 && atual.finalizado()));
        this._simulationTime --;//remocao do tempo excedente
        this.computeMetrics();
    }

    private sjf(preemptive: boolean){
        //implementar o sjf aqui
    }

    private roundRobin(){
        //implementar o round robin aqui
    }

    private escalonate(atual: Processo, listaProntos:Processo[]){
        if(atual.execTime < atual.burstTime){
            atual.prontifica();
            listaProntos.push(atual);
        }
        else{
            atual.finaliza(this._simulationTime);
        }

        let proximo = (listaProntos.length > 0)
            ? this.selectNextProcess(this.nextIndex(listaProntos), listaProntos)
            : null;
        return (proximo == null) ? atual : proximo;
    }

    private computeMetrics(){
        console.log(this._simulationTime);
        console.log(this.computeRequestedTime())
        this._cpuUsage = (this.computeRequestedTime() / (this._simulationTime)) * 100;
        this._trhoughput = (this._simulationTime) / this._processList.length; 
    }

    private computeRequestedTime():number{
        let sum: number;
        sum = 0;
        this._processList.forEach((p: Processo)=>{
            sum = sum + p.burstTime;
        })

        return sum;
    }

    private nextIndex(listaProntos: Processo[]):number{
        if(this._currentAlgorithm == tipoEscalonamento.sjf){
            return listaProntos.indexOf(this.getMinorBurstTime(listaProntos));
        }
        else{
            return 0;
        }
    }

    private getMinorBurstTime(processosProntos: Processo[]):Processo{
        let min = processosProntos[0];
        processosProntos.forEach((p: Processo)=>{
            const tempoRestanteMenor = min.burstTime - min.execTime;
            const tempoRestanteP = p.burstTime - p.execTime;
    
            const temposRestantesIguais = tempoRestanteMenor == tempoRestanteP;
            const temposExecucaoIguais = p.execTime == min.execTime;
                
            if(tempoRestanteMenor > tempoRestanteP){
                min = p;   
            }
            //criterio de desmpate 1. Maior tempo de execucao
            else if(temposRestantesIguais && ! temposExecucaoIguais){
                min = (p.execTime >min.execTime)? p: min;
            }    
            //criterio de desempate 2. Processo que chegou primeiro
            else if(temposRestantesIguais && temposExecucaoIguais){
                min = (p.arrivalTime < min.arrivalTime)? p: min;                 
            } 
        })
        return min;
    }
    
    private selectNextProcess(indice: number, listaProntos: Processo[]){
        this._simulationTime += this._contextSwitch; 
        if(listaProntos.length > 0){
            let next = listaProntos.splice(indice, 1)[0];
            next.executa();
            return next;
        }
        return null;
    }

    public buildArrivalTimesList(){
        this._arrivalTimes = [];
        this._processList.forEach((p) =>{
            this._arrivalTimes.push(p.arrivalTime);
        })
    }

    public updateByArrival(listaProntos: Processo[]){
        while(this._arrivalTimes.length > 0 && this._simulationTime == this._arrivalTimes[0]){
            listaProntos.push(this._processList[this._nextArrivalIndex]);
            listaProntos[this._nextArrivalIndex - 1].prontifica();
            this._nextArrivalIndex++;
            this._arrivalTimes.splice(0,1);
        }
    }

    private reset(){
        this._simulationTime = 0;
        this._cpuUsage = 0;
        this._trhoughput = 0;
        this._simulationFrames = []
        //this._nextArrivalIndex = 0;
        this._processList.forEach((p:Processo)=>{
            p.resetaExecTime();
            p.removeDaCPU();
        })
    }

    public log(){
        const now = new Date();
        const momento_execucao = `-${now.getHours()}-${now.getMinutes()}-${now.getSeconds()}`
        const filename = `${this._logPath}${this._currentAlgorithm}${momento_execucao}.log`
        const filenameJSON = `${this._logPath}${this._currentAlgorithm}${momento_execucao}.json`
        let data = "****** SIMULAÇÂO ******\n";
        data += `Troca de contexto: ${this._contextSwitch}\n`;
        data += `Tempo de simulação: ${this._simulationTime}\n`;
        data += `Algoritmo de escalonamento: ${this._currentAlgorithm}\n\n`
        data +='Lista de Processos: \n';
        this._processList.forEach(p =>{
            data += p.stringRepresentation() + '\n' 
        });
                //Verifica se não existe
        if (!fs.existsSync(this._logPath)){
            //Efetua a criação do diretório
            fs.mkdirSync(this._logPath);
        }
        fs.writeFile(filename, data, (err) => {
            if (err) throw err;
            console.log('O arquivo de log criado!');
        });
    }
    
    public setAlgorithm(algoritmo: tipoEscalonamento){
        this._currentAlgorithm = algoritmo
    }
    
    private cloneList(arr: Processo[]):Processo[]{
        let clone: Processo[]
        clone = []
        arr.forEach((p) => {
            clone.push(new Processo({pid: p.pid,arrivalTime: p.arrivalTime,burstTime:p.burstTime, quantum: p.quantum}))      
        });
        return clone;
    }

    public getProcessList(): Processo[]{
        return this.cloneList(this._processList);
    }

    //console.log(createFrame(10, listaProcessos));
    private createFrame(){
        let frame: string; 
        frame = `{
            "currentTime": ${this._simulationTime},
            "processList":[${this._processList.map(p => p.objStringRepresentation())}]
        }`
        return frame;
    }

    public logJSONRepresentation(): JSON{
        return JSON.parse(`{
            ${this.statusOBJStringRepresentation()},
            "finalState": [${this._processList.map(p => p.objStringRepresentation())}],
            "simulationFrames":[ ${ this._simulationFrames }]
        }`);
    }

    public processListJSONRepresentation():JSON{
        return JSON.parse(`{"processList": [${this._processList.map(p => p.objStringRepresentation())}]}`)
    }

    public statusJSONRepresentation(): JSON{
        return JSON.parse(`{${this.statusOBJStringRepresentation()}}`);
    }

    private statusOBJStringRepresentation(): string{
        return `
            "currentAlgorithm" : "${this._currentAlgorithm}",
            "cpuUsage" :${this._cpuUsage},
            "throughput" : ${this._trhoughput},
            "contextSwitch" : ${this._contextSwitch},
            "simulationTime": ${this._simulationTime},
            "quantProcesses": ${this._processList.length}
        `;
    }

}