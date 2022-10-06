import java.util.ArrayList;
import java.util.Collections;

public class Escalonador {
    public static double utilizacaoCpu;
    public static double trhoughput;
    public static int trocaContexto;
    public static int tempoGlobal;
    public static ArrayList<Processo> listaProcessos;

    public static void main(String[] args){
        utilizacaoCpu = 0;
        trocaContexto = 0;
        trhoughput = 0;
        listaProcessos = new ArrayList<>();

        Processo p1 = new Processo("1",40, 10, 10);
        Processo p2 = new Processo("2",40, 0, 10);
        Processo p3 = new Processo("3",10, 20, 10);
        Processo p4 = new Processo("4",10, 0, 10);
        
        listaProcessos.add(p1);
        listaProcessos.add(p2);
        listaProcessos.add(p3);
        listaProcessos.add(p4);
        Collections.sort(listaProcessos);

        //fifo();

        sjf();
        calculaMetricas();
        mostraMetricas();
    }

    public static void mostraLista(ArrayList<Processo> lista){
        System.out.println("[\n");
        for(Processo p : lista){
            System.out.println(p);
        }
        System.out.println("]");
    }

    public static void mostraMetricas(){
        System.out.println(" \n\n*** Estatisticas do escalonador *** ");
        System.out.println("Utilizacao cpu: " + utilizacaoCpu + " %");
        System.out.println("Throughput: " + trhoughput);
        System.out.println("Quantidade de processos: " + listaProcessos.size());
        System.out.println("Tempo gasto para a execucao do algoritmo: " + tempoGlobal);
    }

    public static void fifo(){
        ArrayList<Processo> listaProntos = new ArrayList<Processo>();
        Processo atual = listaProcessos.get(0);
        listaProntos.add(atual);
        tempoGlobal = atual.getArrivalTime();
        int []temposChegada = montaListaTemposChegada();
        int indiceChegada = 1;
        System.out.println("Processo " + listaProntos.get(0).getPid() + " executando...");
        while(listaProntos.size() > 0){
            
            while(indiceChegada < temposChegada.length && tempoGlobal == temposChegada[indiceChegada]){
                System.out.println("Processo " + listaProcessos.get(indiceChegada).getPid() + " chegou no tempo " + temposChegada[indiceChegada]);
                listaProntos.add(listaProcessos.get(indiceChegada));
                indiceChegada++;
            }

            if(atual.getExecTime() >= atual.getBurstTime()){
                Processo removido = listaProntos.remove(0);
                System.out.println("O processo " + removido.getPid() + " terminou de executar no tempo " + tempoGlobal + " e gastou " + atual.getExecTime());
                
                tempoGlobal += trocaContexto; 
                if(listaProntos.size() > 0){
                    atual = listaProntos.get(0);
                    System.out.println("Processo " + listaProntos.get(0).getPid() + " executando...");
                }
            }
            if(listaProntos.size() > 0){
                tempoGlobal++;
                atual.incrementExecTime();
            }
        };
    }

    public static void sjf(){
        ArrayList<Processo> listaProntos = new ArrayList<Processo>();
        Processo atual = listaProcessos.get(0);
        listaProntos.add(atual);
        tempoGlobal = atual.getArrivalTime();
        int []temposChegada = montaListaTemposChegada();
        int indiceChegada = 1;
        System.out.println("Processo " + listaProntos.get(0).getPid() + " executando...");
        while(listaProntos.size() > 0){
            System.out.println("Atual: " + atual.getPid());
            while(indiceChegada < temposChegada.length && tempoGlobal == temposChegada[indiceChegada]){
                System.out.println("Processo " + listaProcessos.get(indiceChegada).getPid() + " chegou no tempo " + temposChegada[indiceChegada]);
                listaProntos.add(listaProcessos.get(indiceChegada));
                indiceChegada++;
                
                atual = getMenorBurstTime(listaProntos);
                
            }

            if(atual.getExecTime() >= atual.getBurstTime()){
                Processo removido = listaProntos.remove(listaProntos.indexOf(atual));
                System.out.println("O processo " + removido.getPid() + " terminou de executar no tempo " + tempoGlobal + " e gastou " + atual.getExecTime());
                tempoGlobal += trocaContexto; 
                if(listaProntos.size() > 0){
                    atual = getMenorBurstTime(listaProntos);
                    System.out.println("Processo " + listaProntos.get(0).getPid() + " executando...");
                }
            }

            if(listaProntos.size() > 0){
                tempoGlobal++;
                atual.incrementExecTime();
            }
        };
    }

    public static Processo getMenorBurstTime(ArrayList<Processo> listaProntos){
        Processo menor = listaProntos.get(0);
        for(Processo p : listaProntos){
            int tempoRestanteMenor = menor.getBurstTime() - menor.getExecTime();
            int tempoRestanteP = p.getBurstTime() - p.getExecTime();
            if(tempoRestanteMenor > tempoRestanteP)
                menor = p;         
        }
        return menor;
    }

    public static void calculaMetricas(){
        utilizacaoCpu = (calculaTempoTotalRequisitado() / (tempoGlobal)) * 100;
        trhoughput = (tempoGlobal) / listaProcessos.size(); 
    }

    public static double calculaTempoTotalRequisitado(){
        double soma = 0;
        for(Processo p : listaProcessos)
            soma+= p.getBurstTime();
        return soma;    
    }

    public static int [] montaListaTemposChegada(){
        int [] listaTempoChegada = new int[listaProcessos.size()];
        for (int i = 0; i < listaProcessos.size(); i++){
            listaTempoChegada[i] =  listaProcessos.get(i).getArrivalTime();
        }
        return listaTempoChegada;    
    }
}
