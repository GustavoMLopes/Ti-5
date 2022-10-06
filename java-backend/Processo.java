public class Processo implements Comparable<Processo>{
    
    private String pid;
    private int burstTime, arrivalTime;
    private String state;
    private int quantum;
    private int execTime;
    private int awaitTime;
    private int finishTime;

    public Processo(String pid, int burstTime, int arrivalTime, int quantum) {
        this.pid = pid;
        this.burstTime = burstTime;
        this.arrivalTime = arrivalTime;
        this.state = "Pronto";
        this.quantum = quantum;
        this.execTime = 0;
        this.awaitTime = 0;
        this.finishTime = 0;
    }

    public String toString(){
        String rep = "PID: " + this.pid +"\n";
        rep += "Tempo de chegada: " + this.arrivalTime + "\n";
        rep += "Burst Time: " + this.burstTime + "\n";
        if(this.state.equals("Finalizado")){
            rep += "Tempo de saida: " + this.finishTime + "\n";
            rep+= "Tempo de execucao: " + this.execTime + "\n";
            rep+= "Tempo de espera: " + this.awaitTime + "\n";
        }
        
        //rep += "Quantum: " + this.quantum + "\n"; 
        //rep += "State: " + this.state + "\n";
        return rep;
    }

    /* getters */
    public String getPid(){ return this.pid; } 
    public int getBurstTime(){ return this.burstTime; } 
    public int getArrivalTime(){ return this.arrivalTime; } 
    public String getState(){ return this.state; } 
    public int getQuantum(){ return this.quantum; } 
    public int getExecTime(){ return this.execTime; }
    public int getAwaitTime(){ return this.awaitTime; }
    public int getFinishTime(){ return this.finishTime; }
    
    /* setters */
    public void setPid(String pid){
        this.pid = pid;
    }
    
    public void setBurstTime(int burstTime){
        this.burstTime = burstTime;
    }

    public void setArrivalTime(int arrivalTime){
        this.arrivalTime = arrivalTime;
    }

    private void setState(String state){
        this.state = state;
    }

    public void setQuantum(int quantum){
        this.quantum = quantum;
    }

    public void incrementExecTime(){
        this.execTime = this.execTime + 1;
    }

    public void setAwaitTime(){
        System.out.println(this.finishTime + " - " + this.arrivalTime + " - " + this.burstTime);
        this.awaitTime = this.finishTime - this.arrivalTime - this.burstTime; 
    }

    private void setFinishTime(int finishTime){
        this.finishTime = finishTime;
    }

    // atualizadores do estado do processo
    public void finalizaProcesso(int tempoFinalizado){ 
        this.setState("Finalizado");
        this.setFinishTime(tempoFinalizado); 
    }

    public void bloqueiaProcesso(){ this.setState("Bloqueado"); }
    public void prontificaProcesso(){ this.setState("Pronto"); }
    public void executa(){ this.setState("Executando"); }

    @Override
    public int compareTo(Processo p) {
        return (this.arrivalTime - p.arrivalTime);
    } 
}