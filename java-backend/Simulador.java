import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;

public class Simulador {
    //métricas do simulador
    private double utilizacaoCpu = 0;
    private double trhoughput = 0;
    private int trocaContexto = 0;
    private int tempoGlobal = 0;

    //atributos de documentacao
    private String algoritmoAtual = "";
    private String caminhoArquivoLog = "";
    private String caminhoDiretorioLog = "logs/";
    private int quantidadeExecucoes = 0;

    //atributos auxiliares
    private BufferedWriter fr;
    private ArrayList<Processo> listaProcessos;
    private ArrayList<Integer> listaTemposChegada;
    private int indiceProximaChegada;

    public  Simulador(ArrayList<Processo> listaProcessosRaw, int trocaContexto, String caminhoDiretorioLog){
        this.trocaContexto = trocaContexto;
        this.caminhoDiretorioLog = caminhoDiretorioLog;
        Collections.sort(listaProcessosRaw);
        this.listaProcessos = listaProcessosRaw;
    }

    public  Simulador(ArrayList<Processo> listaProcessosRaw, int trocaContexto){
        this.trocaContexto = trocaContexto;
        Collections.sort(listaProcessosRaw);
        this.listaProcessos = new ArrayList<Processo>(listaProcessosRaw);
    }

    public void setLista(ArrayList<Processo> listaProcessosRaw){
        Collections.sort(listaProcessosRaw);
        this.listaProcessos = new ArrayList<Processo>(listaProcessosRaw);
    }
    
    public void reset(){
        tempoGlobal = 0;
        utilizacaoCpu = 0;
        trhoughput = 0;
        indiceProximaChegada = 0;
        for(Processo p : listaProcessos){
            p.resetaExecTime();
            p.prontifica();
        }
    }

    public void executa(String escolha, boolean preemptivo) throws IOException{
        tempoGlobal = 0;
        reset();
        montaListalistaTemposChegada();
        if( escolha.equals("SJF") || escolha.equals("sjf")){
            System.out.println("****** SHORTEST JOB FIRST ******");
            algoritmoAtual = "sjf" + ((preemptivo)?" preemptivo":" nao preemptivo");
            sjf(preemptivo);
        }

        else if(escolha.equals("RR") || escolha.equals("ROUND-ROBIN") || escolha.equals("round-robin")){
            System.out.println("****** ROUND ROBIN ******");
            algoritmoAtual = "roundRobin";
        }

        else {
            System.out.println("****** FIRST COME FIRST SERVICE ******");
            algoritmoAtual = "fcfs";
            fcfs();
        }
    }

    public void geraLog() throws IOException{
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy_MM_dd_HH-mm-ss");
        caminhoArquivoLog = caminhoDiretorioLog + algoritmoAtual +  "_" + quantidadeExecucoes + "_" + dtf.format(LocalDateTime.now())  +".log";
        File file = new File(caminhoDiretorioLog);  
        if (!file.exists()) {
            file.mkdir();
        }
        fr = new BufferedWriter(new FileWriter(caminhoArquivoLog));
        fr.write("***** " + algoritmoAtual + " *****\n");
        fr.write("*** Lista de Processos ***\n");
        for(Processo p : listaProcessos){
            fr.write("------------\n");
            fr.write(p.toString());
            
        }

        //fr.write("\n*** Descrição da execução ***\n");
        //fr.write(descricaoExecucao);

        fr.write(" \n*** Estatisticas do escalonador ***\n");
        fr.write("Utilizacao da cpu: " + utilizacaoCpu + "%\n");
        fr.write("Throughput: " + trhoughput + "\n");
        fr.write("Quantidade de processos: " + listaProcessos.size() + "\n");
        fr.write("Tempo gasto para a execucao do algoritmo: " + tempoGlobal + "\n");
        fr.write("Delay de troca de contexto: " + trocaContexto + "\n");
        fr.close();
    }

    public Processo getMenorBurstTime(ArrayList<Processo> listaProntos){
        Processo menor = listaProntos.get(0);
        for(Processo p : listaProntos){
            
            int tempoRestanteMenor = menor.getBurstTime() - menor.getTempoExecucao();
            int tempoRestanteP = p.getBurstTime() - p.getTempoExecucao();
            
            boolean temposRestantesIguais = tempoRestanteMenor == tempoRestanteP;
            boolean temposExecucaoIguais = p.getTempoExecucao() == menor.getTempoExecucao();
            
            if(tempoRestanteMenor > tempoRestanteP){
                menor = p;   
            }
            //criterio de desmpate 1. Maior tempo de execucao
            else if(temposRestantesIguais && ! temposExecucaoIguais){
                menor = (p.getTempoExecucao() > menor.getTempoExecucao())? p: menor;
            }    
            //criterio de desempate 2. Processo que chegou primeiro
            else if(temposRestantesIguais && temposExecucaoIguais){
                menor = (p.getArrivalTime() < menor.getArrivalTime())? p: menor;                 
            } 
        }
        return menor;
    }

    private void calculaMetricas(){
        utilizacaoCpu = (calculaTempoTotalRequisitado() / (tempoGlobal)) * 100;
        trhoughput = (tempoGlobal) / listaProcessos.size(); 
    }

    private double calculaTempoTotalRequisitado(){
        double soma = 0;
        for(Processo p : listaProcessos)
            soma += p.getBurstTime();
        return soma;    
    }

    private void montaListalistaTemposChegada(){
        listaTemposChegada = new ArrayList<>();
        for (Processo p :  listaProcessos){
            listaTemposChegada.add(p.getArrivalTime());
        }   
    }

    private void fcfs(){
        ArrayList<Processo> listaProntos = new ArrayList<Processo>();
        Processo atual = listaProcessos.get(0);
        tempoGlobal = atual.getArrivalTime();
        atual.executa();
        listaTemposChegada.remove(0);
        indiceProximaChegada = 1;
        do{
            atualizaPorChegada(listaProntos);
            if(atual.getTempoExecucao() >= atual.getBurstTime()){
                atual = escalona(atual, listaProntos);
            }
            tempoGlobal++;
            atual.atualizaExecTime();
        }while(!(listaTemposChegada.size() <= 0 && atual.finalizado()));
        tempoGlobal --;//remocao do tempo excedente
        calculaMetricas();
        quantidadeExecucoes++;
    }

    private void sjf(boolean preemptivo){
        ArrayList<Processo> listaProntos = new ArrayList<Processo>();
        tempoGlobal = 0;
        atualizaPorChegada(listaProntos);
        int indicePrimeiroProcesso = listaProntos.indexOf(getMenorBurstTime(listaProntos));
        Processo atual = listaProntos.remove(indicePrimeiroProcesso);
        atual.executa();
        do{
            ArrayList<Integer> estadoAntesChegada = new ArrayList<Integer>(listaTemposChegada);
            atualizaPorChegada(listaProntos);
            boolean chegouAlguem = !(estadoAntesChegada.equals(listaTemposChegada));
            if(preemptivo && chegouAlguem){
                atual = escalonaSjf(atual, listaProntos, preemptivo);
            }
    
            else if(atual.getTempoExecucao() >= atual.getBurstTime()){
                atual = escalonaSjf(atual, listaProntos, preemptivo);
            }
            tempoGlobal++;
            atual.atualizaExecTime();
        }while(!(listaTemposChegada.size() <= 0 && atual.finalizado()));
        tempoGlobal --;//remocao do tempo excedente
        calculaMetricas();
        quantidadeExecucoes++;
    }

    private Processo escalona(Processo atual, ArrayList<Processo> listaProntos){
        atual.finaliza(tempoGlobal);

        if(listaProntos.size() > 0){
            Processo proximo = listaProntos.remove(0);
            proximo.executa();
            tempoGlobal += trocaContexto;
            return proximo;
        }

        return atual;
    }

    private Processo escalonaSjf(Processo atual, ArrayList<Processo> listaProntos, boolean preemptivo){
        if(preemptivo && atual.getBurstTime() > atual.getTempoExecucao()){
            atual.prontifica();
            listaProntos.add(atual);
        }
        else {
            atual.finaliza(tempoGlobal);
        }

        if(listaProntos.size() > 0){
            int indiceProximoProcesso = listaProntos.indexOf(getMenorBurstTime(listaProntos));
            Processo proximo = listaProntos.remove(indiceProximoProcesso);
            proximo.executa();
            return proximo;
        }
        return atual;
    }

    private void atualizaPorChegada(ArrayList<Processo> listaProntos){
        while(listaTemposChegada.size() > 0 && tempoGlobal == listaTemposChegada.get(0)){
            listaProntos.add(listaProcessos.get(indiceProximaChegada));
            listaProcessos.get(indiceProximaChegada).prontifica();
            //documentaChegada(listaProcessos.get(indiceProximaChegada));
            indiceProximaChegada++;
            listaTemposChegada.remove(0);
        }
    }
}
