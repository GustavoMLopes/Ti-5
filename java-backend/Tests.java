import java.util.ArrayList;

public class Tests {
    private static ArrayList<Processo> listaTemposChegadaZero;
    private static ArrayList<Processo> listaTemposChegadaConcorrentes;
    private static ArrayList<Processo> listaTemposChegadaNaoConcorrentes;
    private static ArrayList<Processo> listaBurstTimeInversos;
    private static ArrayList<Processo> listaPreemptiva;
    public static void main(String[] args){
        criaListas(4);
        Simulador simulador = new Simulador(listaTemposChegadaZero, 0);

        testaArrivalTimeZero(simulador);
        testaChegadaInversa(simulador);
        testaChegadaConcorrente(simulador);
        testaChegadaNaoConcorrente(simulador);
        testaPreempcao(simulador);
    }

    private static void testaChegadaInversa(Simulador simulador) {
        simulador.setLista(listaBurstTimeInversos);
        try{            
            simulador.executa("sjf", true);
            simulador.geraLog();
            simulador.executa("sjf", false);
            simulador.geraLog();         
            simulador.executa("fcfs", true);
            simulador.geraLog();   
            simulador.executa("rr", true);
            simulador.geraLog();
        } catch(Exception ex) {
            ex.printStackTrace();
        }
    }

    public static void testaArrivalTimeZero(Simulador simulador){
        simulador.setLista(listaTemposChegadaZero);
        
        try{            
            simulador.executa("sjf", true);
            simulador.geraLog();
            simulador.executa("sjf", false);
            simulador.geraLog();         
            simulador.executa("fcfs", true);
            simulador.geraLog();   
            simulador.executa("rr", true);
            simulador.geraLog();
            
        } catch(Exception ex) {
            ex.printStackTrace();
        }
    } 

    private static void testaPreempcao(Simulador simulador) {
        simulador.setLista(listaPreemptiva);
        try{            
            simulador.executa("sjf", true);
            simulador.geraLog();
            simulador.executa("sjf", false);
            simulador.geraLog();         
            simulador.executa("fcfs", true);
            simulador.geraLog();   
            simulador.executa("rr", true);
            simulador.geraLog();
            
        } catch(Exception ex) {
            ex.printStackTrace();
        }
    }


    public static void testaChegadaConcorrente(Simulador simulador){
        simulador.setLista(listaTemposChegadaConcorrentes);
        try{            
            simulador.executa("sjf", true);
            simulador.geraLog();
            simulador.executa("sjf", false);
            simulador.geraLog();         
            simulador.executa("fcfs", true);
            simulador.geraLog();   
            simulador.executa("rr", true);
            simulador.geraLog();
            
        } catch(Exception ex) {
            ex.printStackTrace();
        }
    }

    public static void testaChegadaNaoConcorrente(Simulador simulador){
        simulador.setLista(listaTemposChegadaNaoConcorrentes);
        try{            
            simulador.executa("sjf", true);
            simulador.geraLog();
            simulador.executa("sjf", false);
            simulador.geraLog();         
            simulador.executa("fcfs", true);
            simulador.geraLog();   
            simulador.executa("rr", true);
            simulador.geraLog();
            
        } catch(Exception ex) {
            ex.printStackTrace();
        }
    }
    private static void criaListas(int quantidadeProcessos){
        listaTemposChegadaZero = new ArrayList<Processo>();
        listaTemposChegadaConcorrentes = new ArrayList<Processo>();
        listaTemposChegadaNaoConcorrentes = new ArrayList<Processo>();
        listaBurstTimeInversos = new ArrayList<Processo>();
        listaPreemptiva = new ArrayList<Processo>();
        
        for( int i = 0; i < quantidadeProcessos; i++){
            listaTemposChegadaZero.add(new Processo(("p" + i), (i + 1) * 10 , 0,5));
        }

        for( int i = 0; i < quantidadeProcessos; i++){
            listaTemposChegadaConcorrentes.add(new Processo(("p" + i), (i + 1) * 10 , i,5));
        }
        
        for( int i = 0; i < quantidadeProcessos; i++){
            listaBurstTimeInversos.add(new Processo(("p" + i), (quantidadeProcessos - i + 1), 0,5));
        }

        for( int i = 0; i < quantidadeProcessos; i++){
            listaTemposChegadaNaoConcorrentes.add(new Processo(("p" + i), (i+1) * 10, i*10,5));
        }
        listaPreemptiva.add(new Processo("p0", 10, 0, 10));
        listaPreemptiva.add(new Processo("p1", 3, 5, 10));
        listaPreemptiva.add(new Processo("p2", 1, 7, 10));
        listaPreemptiva.add(new Processo("p3", 4, 8, 10));
    }
}
