export enum processState{
    finalizado = 'Finalizado',
    pronto =  'Pronto',
    executando = 'Executando',
    bloqueado = 'Bloqueado',
    naoIniciado = 'NaoIniciado' 
}

export interface ProcessDto{
    pid: string,
    arrivalTime: number,
    burstTime: number,
    quantum: number
}

class Processo{
    private _pid: string;
    private _state: processState;
    private _burstTime: number;
    private _arrivalTime: number;
    private _quantum: number;
    private _execTime: number;
    private _finishTime: number;
    private _awaitTime: number;


    public constructor({pid, arrivalTime, burstTime, quantum}:ProcessDto){
        this._pid = pid;
        this._burstTime = burstTime;
        this._arrivalTime = arrivalTime;
        this._quantum = quantum;
        this._state = processState.naoIniciado;
        this._execTime = 0;
        this._finishTime = 0;
        this._awaitTime = 0;
    }
    //getters
    public get pid(){  return this._pid }
    public get state(){ return this._state }
    public get burstTime():number{ return this._burstTime }
    public get arrivalTime(){ return this._arrivalTime }
    public get quantum(){ return this._quantum }
    public get execTime(){ return this._execTime }
    public get finishTime(){ return this._finishTime }
    public get awaitTime(){ return this._awaitTime }
    
    //setters
    public set pid(pid: string){  this._pid  = pid }
    public set state(state: processState){ this._state = state }
    public set burstTime(burstTime: number){ this._burstTime = burstTime }
    public set arrivalTime(arrival_time: number){ this._arrivalTime = arrival_time }
    public set quantum(quantum: number){ this._quantum  = quantum}
    public set execTime(execTime: number){ this._execTime  = execTime}
    public set finishTime(finishTime: number){ this._finishTime = finishTime }
    public set awaitTime(awaitTime: number){ this._awaitTime = awaitTime }

    public bloqueia(){ this._state = processState.bloqueado; }
    public prontifica(){ this._state = processState.pronto; }
    public executa(){ this._state = processState.executando; }
    public removeDaCPU(){ this._state = processState.naoIniciado; }

    public finaliza(finishTime: number){ 
        if(this.finalizado() == false){
            this._state = processState.finalizado;
            this._finishTime = finishTime; 
            this.updateAwaitTime();
        }
    }

    public finalizado():boolean{ return this._state == processState.finalizado; }
    public bloqueado():boolean{ return this._state == processState.bloqueado; }
    public executando():boolean{ return this._state == processState.executando; }
    public pronto():boolean{ return this._state == processState.pronto; }
    public foraDaCPU():boolean{ return this._state == processState.naoIniciado; }

    public atualizaExecTime(){
        if(this.executando()){
            this.execTime = this.execTime + 1;
        }
    }

    public resetaExecTime(){
        this.execTime = 0;
    }

    public updateAwaitTime(){
        this._awaitTime = this.finishTime - this.arrivalTime - this.burstTime; 
    }
    
    public stringRepresentation() :string{
        let rep = "{ ";
        rep += "Pid: " + this._pid + ", ";
        rep += "Arrival Time: " + this._arrivalTime + ', ';
        rep += "Burst Time: " + this._burstTime + ', ';
        rep += "Total Execution Time: " + this._execTime + ', ' ;
        rep += "Quantum: " + this._quantum + ', ';
        rep+= "Process State: " + this._state;
        rep += " }"
        return rep;
    }
    
    public objStringRepresentation() :string{
        let rep = `{
            "pid": "${this.pid}",
            "arrivalTime": ${this._arrivalTime},
            "burstTime": ${this._burstTime},
            "quantum": ${this._quantum},
            "executionTime": ${this._execTime},
            "state": "${this._state}"
        }`;
        return rep;
    }

}

export default Processo