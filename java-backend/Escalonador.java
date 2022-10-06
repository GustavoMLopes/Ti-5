import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;

public class Escalonador {
    public static double utilizacaoCpu = 0;
    public static double trhoughput = 0;
    public static int trocaContexto = 0;
    public static int tempoGlobal = 0;

    public static String descricaoExecucao = "Nenhum algoritmo executado ainda";
    public static String caminhoLog = "";
    public static String caminhoDiretorioLog = "logs/";
    public static BufferedWriter fr;
    public static ArrayList<Processo> listaProcessos;

    public static void main(String[] args){
        File file = new File(caminhoDiretorioLog);  
        if (!file.exists()) {
            file.mkdir();
        }
        listaProcessos = new ArrayList<>();
        String escolhaAlgoritmo = (args.length > 0) ? args[0]: "";
        
        Processo p1 = new Processo("1",10, 0, 10);
        Processo p2 = new Processo("2",10, 2, 10);
        Processo p3 = new Processo("3",40, 3, 5);
        Processo p4 = new Processo("4",10, 4, 1);
        
        
        listaProcessos.add(p1);
        listaProcessos.add(p2);
        listaProcessos.add(p3);
        listaProcessos.add(p4);
        Collections.sort(listaProcessos);

        try{
            validaEscolha(escolhaAlgoritmo);
            calculaMetricas();
            geraLog();
        } catch(Exception ex) {
            ex.printStackTrace();
        }
    }

    public static void validaEscolha(String escolha) throws IOException{
        
        if( escolha.equals("SJF") || escolha.equals("sjf")){
            System.out.println("****** SHORTEST JOB FIRST ******");
            descricaoExecucao = "";
            caminhoLog = "logs/sjf.log";
            sjf();

        }

        else if(escolha.equals("RR") || escolha.equals("ROUND-ROBIN") || escolha.equals("round-robin")){
            System.out.println("****** ROUND ROBIN ******");
            descricaoExecucao = "";
            caminhoLog = "logs/round_robin.log";
            //ainda a ser implementado
            //roundRobin();
        }

        else{
            System.out.println("****** FIRST COME FIRST SERVICE ******");
            descricaoExecucao = "";
            caminhoLog = "logs/fcfs.log";
            fifo();
        }
    }

    public static void mostraLista(ArrayList<Processo> lista){
        System.out.println("[\n");
        for(Processo p : lista){
            System.out.println(p);
        }
        System.out.println("]");
    }

    public static void geraLog() throws IOException{
        fr = new BufferedWriter(new FileWriter(caminhoLog));
        fr.write("*** Lista de Processos ***\n");
        for(Processo p : listaProcessos){
            fr.write("------------\n");
            fr.write(p.toString());
            
        }

        fr.write("\n*** Descrição da execução ***\n");
        fr.write(descricaoExecucao);

        fr.write(" \n*** Estatisticas do escalonador ***\n");
        fr.write("Utilizacao da cpu: " + utilizacaoCpu + "%\n");
        fr.write("Throughput: " + trhoughput + "\n");
        fr.write("Quantidade de processos: " + listaProcessos.size() + "\n");
        fr.write("Tempo gasto para a execucao do algoritmo: " + tempoGlobal + "\n");
        fr.write("Delay de troca de contexto: " + trocaContexto + "\n");
        fr.close();
    }

    public static void fifo() throws IOException {
        fr = new BufferedWriter(new FileWriter(caminhoLog));
        fr.write("***** FCFS *****\n");
        ArrayList<Processo> listaProntos = new ArrayList<Processo>();
        Processo atual = listaProcessos.get(0);
        //listaProntos.add(atual);
        tempoGlobal = atual.getArrivalTime();
        int []temposChegada = montaListaTemposChegada();
        int indiceChegada = 0;
        do{
            //chegada
            while(indiceChegada < temposChegada.length && tempoGlobal == temposChegada[indiceChegada]){
                descricaoExecucao += ("Processo " + listaProcessos.get(indiceChegada).getPid() + " chegou no tempo " + temposChegada[indiceChegada] + "\n");
                listaProntos.add(listaProcessos.get(indiceChegada));
                if(indiceChegada == 0){
                    atual.executa();
                    descricaoExecucao += ("-> Processo " + listaProntos.get(0).getPid() + " executando...\n");
                }
                indiceChegada++;
            }

            //escalonamento
            if(atual.getExecTime() >= atual.getBurstTime()){
                Processo removido = listaProntos.remove(0);
                removido.finalizaProcesso(tempoGlobal);
                removido.setAwaitTime();
                //listaProcessos.get(listaProcessos.indexOf(removido)).finalizaProcesso(tempoGlobal);
                
                descricaoExecucao += ("O processo " + removido.getPid() + " terminou de executar no tempo " + tempoGlobal + " e gastou " + atual.getExecTime() + " ut\n\n");
                
                tempoGlobal += trocaContexto; 
                if(listaProntos.size() > 0){
                    atual = listaProntos.get(0);
                    atual.executa();
                    descricaoExecucao += ("-> Processo " + listaProntos.get(0).getPid() + " executando...\n");
                }
            }

            if(listaProntos.size() > 0){
                tempoGlobal++;
                atual.incrementExecTime();
            }
            
        }while(listaProntos.size() > 0);
        fr.close();
    }

    public static void sjf(){
        ArrayList<Processo> listaProntos = new ArrayList<Processo>();
        Processo atual = listaProcessos.get(0);
        //listaProntos.add(atual);
        tempoGlobal = atual.getArrivalTime();
        int []temposChegada = montaListaTemposChegada();
        int indiceChegada = 0;
        do{
            while(indiceChegada < temposChegada.length && tempoGlobal == temposChegada[indiceChegada]){
                descricaoExecucao += ("Processo " + listaProcessos.get(indiceChegada).getPid() + " chegou no tempo " + temposChegada[indiceChegada] + "\n");
                listaProntos.add(listaProcessos.get(indiceChegada));
                indiceChegada++;
                
                if(indiceChegada == 0){
                    atual.executa();
                    descricaoExecucao += ("-> Processo " + atual.getPid() + " executando...\n");
                }
                //escalonamento se chegar outro processo
                else{
                    Processo menor = getMenorBurstTime(listaProntos);
                    if(menor != atual){
                        atual.prontificaProcesso();
                        listaProntos.add(atual);
                        atual = menor;
                        atual.executa();
                        descricaoExecucao += ("-> Processo " + atual.getPid() + " executando...\n");
                    }
                }
            }

            //escalonamento se o processo acabar
            if(atual.getExecTime() >= atual.getBurstTime()){
                Processo removido = listaProntos.remove(listaProntos.indexOf(atual));
                removido.finalizaProcesso(tempoGlobal);
                removido.setAwaitTime();
                //listaProcessos.get(listaProcessos.indexOf(removido)).finalizaProcesso(tempoGlobal);
                descricaoExecucao += ("O processo " + removido.getPid() + " terminou de executar no tempo " + tempoGlobal + " e gastou " + atual.getExecTime() + "\n");
                tempoGlobal += trocaContexto; 
                if(listaProntos.size() > 0){
                    atual = getMenorBurstTime(listaProntos);
                    atual.executa();
                    descricaoExecucao += ("-> Processo " + atual.getPid() + " executando...\n");
                }
            }

            if(listaProntos.size() > 0){
                tempoGlobal++;
                atual.incrementExecTime();
            }
        }while(listaProntos.size() > 0);
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
