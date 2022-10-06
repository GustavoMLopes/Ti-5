public class Processo implements Comparable<Processo>{
    
    private String pid;
    private int burstTime, arrivalTime;
    private int state;
    private int quantum;
    private int execTime;

    public Processo(String pid, int burstTime, int arrivalTime, int quantum) {
        this.pid = pid;
        this.burstTime = burstTime;
        this.arrivalTime = arrivalTime;
        this.state = 0;
        this.quantum = quantum;
        this.execTime = 0;
    }

    public String toString(){
        String rep = "PID: " + this.pid +"\n";
        rep += "Burst Time: " + this.burstTime + "\n";
        rep += "Arrival Time: " + this.arrivalTime + "\n";
        rep += "State: " + this.state + "\n";
        return rep;
    }

    /* getters */
    public String getPid(){ return this.pid; } 
    public int getBurstTime(){ return this.burstTime; } 
    public int getArrivalTime(){ return this.arrivalTime; } 
    public int getState(){ return this.state; } 
    public int getQuantum(){ return this.quantum; } 
    public int getExecTime(){ return this.execTime; }
    
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

    public void setState(int state){
        this.state = state;
    }

    public void setQuantum(int quantum){
        this.quantum = quantum;
    }

    public void incrementExecTime(){
        this.execTime = this.execTime + 1;
    }

    @Override
    public int compareTo(Processo p) {
        return (this.arrivalTime - p.arrivalTime);
    } 
}