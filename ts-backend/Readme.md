# Backend Typescript
### Setup do projeto
O simulador sempre é criado sem nenhum processo ao iniciar o servidor. Portanto, para realizar simulações deve-se inserir a lista de processos pela rota ``/insertList`` e depois executar o escalonamento pela rota ``/exec``.
Para instalar o projeto basta utilizar o comando abaixo:
```
npm install
```

Para executar o servidor basta utilizar:
```
npm run dev:server
```
### Explicação das Rotas
#### Get
 - ``/status``: Retorna os status da simulação
 - ``/exec``: Faz a simulação podendo passar o tipo de algoritmo pelo parâmetro ``scheduling`` e o delay de troca de contexto pelo parâmetro ``contextSwitch``.Após executar o escalonamento a rota retorna as seguintes informações:
    - **currentAlgorithm**: Algoritmo utilizado para o escalonamento atual.
    - **cpuUsage**: Utilização da cpu em percentagem.
    - **throughput**: Vazão do simulador.
    - **contextSwitch**: Troca de contexto, definida por parâmetro no método exec.
    - **simulationTime**: Tempo total fictício gasto pela simulação.
    - **quantProcesses**: Quantidade de processos escalonados.
    - **finalState** : Lista de estado final com todos os processos finalizados.   
    - **simulatioFrames**:  Lista dos estados dos processos em cada etapa da simulação.
 - ``/log``: Retorna informações de documentação do simulador.
 - ``/listAll``: Retorna a lista de processos inseridas no simulador.
 #### Post
 - ``/insertList``: Insere uma nova lista de processos.
