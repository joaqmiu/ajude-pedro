# Aviso
- Isto é, somente uma versão de demonstração, por isso a simplicidade no funcionamento do "jogo" e a facilidade das perguntas.

1. **Declaração de Variáveis:**

    ```javascript
    const mapa = document.getElementById('mapa');
    let perguntas = [];
    let posicaoPedro = { x: 0, y: 0 };
    let escolaPosicao = { x: 15, y: 15 };
    let pontuacao = 0;
    let perguntaAtual = 0;
    ```
    - `mapa`: Seleciona o elemento HTML com o ID `mapa`, que será usado para representar o mapa do jogo.
    - `perguntas`: Armazena as perguntas do quiz.
    - `posicaoPedro`: Define a posição inicial de Pedro no mapa, começando em `(0,0)`.
    - `escolaPosicao`: Define a posição da escola em `(15,15)`, o destino de Pedro.
    - `pontuacao`: Mantém a pontuação do jogador.
    - `perguntaAtual`: Armazena o índice da pergunta atual.

2. **Construção do Mapa:**

    ```javascript
    for (let i = 0; i < 16; i++) {
        for (let j = 0; j < 16; j++) {
            const bloco = document.createElement('div');
            bloco.classList.add('bloco');
            bloco.dataset.x = j;
            bloco.dataset.y = i;
            mapa.appendChild(bloco);
        }
    }
    ```
    - Cria uma grade 16x16 dentro do elemento `mapa`.
    - Cada célula do mapa é representada por um `div` com a classe `bloco`, além de atributos `data-x` e `data-y` para indicar suas coordenadas.

3. **Função `atualizarMapa`:**

    ```javascript
    function atualizarMapa() {
        document.querySelectorAll('.bloco').forEach(bloco => {
            bloco.innerHTML = '';
            const x = parseInt(bloco.dataset.x);
            const y = parseInt(bloco.dataset.y);

            if (x === posicaoPedro.x && y === posicaoPedro.y) {
                bloco.id = 'pedro';
                bloco.innerHTML = '<img src="../assets/josiel.png" alt="Pedro">';
            } else if (x === escolaPosicao.x && y === escolaPosicao.y) {
                bloco.id = 'escola';
                bloco.innerHTML = '<img src="../assets/escola.png" alt="Escola">';
            } else {
                bloco.id = '';
            }
        });
    }
    ```
    - Atualiza o mapa, limpando o conteúdo de cada bloco.
    - Adiciona a imagem de Pedro no bloco que corresponde à posição atual de Pedro e a imagem da escola na posição da escola.
    - Os outros blocos permanecem vazios.

4. **Carregar Perguntas com `fetch`:**

    ```javascript
    fetch('/perguntas')
    .then(res => res.json())
    .then(data => {
        perguntas = data;
        mostrarPergunta();
    });
    ```
    - Faz uma requisição para o endpoint `/perguntas` e carrega as perguntas retornadas como um array JSON, armazenando-as em `perguntas`.
    - Após carregar as perguntas, chama `mostrarPergunta` para exibir a primeira pergunta.

5. **Função `mostrarPergunta`:**

    ```javascript
    function mostrarPergunta() {
        const perguntaObj = perguntas[perguntaAtual];
        document.getElementById('pergunta').textContent = perguntaObj.pergunta;
        const alternativasContainer = document.getElementById('alternativas');
        alternativasContainer.innerHTML = '';
        perguntaObj.alternativas.forEach((alt, index) => {
            const div = document.createElement('div');
            div.textContent = alt;
            div.classList.add('alternativa');
            div.onclick = () => verificarResposta(index, perguntaObj.correta);
            alternativasContainer.appendChild(div);
        });
    }
    ```
    - Exibe a pergunta atual no elemento com o ID `pergunta`.
    - Limpa e atualiza o container de alternativas com as novas opções da pergunta atual.
    - Cada alternativa tem um evento `onclick` que chama `verificarResposta` com o índice da alternativa e a resposta correta.

6. **Função `verificarResposta`:**

    ```javascript
    function verificarResposta(index, correta) {
        const alternativas = document.querySelectorAll('.alternativa');
        if (index === correta) {
            alternativas[index].classList.add('correta');
            pontuacao++;
            moverPedro();
        } else {
            alternativas[index].classList.add('incorreta');
        }
        setTimeout(proximaPergunta, 1000);
    }
    ```
    - Verifica se a alternativa selecionada está correta, com base no índice passado.
    - Se a resposta está correta, adiciona a classe `correta`, aumenta a pontuação e chama `moverPedro`.
    - Caso contrário, adiciona a classe `incorreta` na alternativa escolhida.
    - Após 1 segundo, chama `proximaPergunta` para carregar a próxima pergunta.

7. **Função `moverPedro`:**

    ```javascript
    function moverPedro() {
        const direcoes = [
            { dx: 1, dy: 0 },
            { dx: 0, dy: 1 },
            { dx: -1, dy: 0 },
            { dx: 0, dy: -1 }
        ];

        let movimentoValido = false;
        let tentativas = 0;

        while (!movimentoValido && tentativas < 10) {
            const direcao = direcoes[Math.floor(Math.random() * direcoes.length)];
            const novaX = posicaoPedro.x + direcao.dx;
            const novaY = posicaoPedro.y + direcao.dy;

            if (novaX >= 0 && novaX < 16 && novaY >= 0 && novaY < 16) {
                const distEscola = Math.abs(escolaPosicao.x - posicaoPedro.x) + Math.abs(escolaPosicao.y - posicaoPedro.y);
                const distNova = Math.abs(escolaPosicao.x - novaX) + Math.abs(escolaPosicao.y - novaY);

                if (distNova < distEscola) {
                    posicaoPedro.x = novaX;
                    posicaoPedro.y = novaY;
                    movimentoValido = true;
                }
            }
            tentativas++;
        }
        atualizarMapa();
    }
    ```
    - Tenta mover Pedro em uma direção aleatória, garantindo que ele se aproxime da escola.
    - Repete o movimento até encontrar uma direção válida (máximo de 10 tentativas).
    - Atualiza o mapa após mover Pedro.

8. **Função `proximaPergunta`:**

    ```javascript
    function proximaPergunta() {
        perguntaAtual++;
        if (perguntaAtual < perguntas.length) {
            mostrarPergunta();
        } else if (posicaoPedro.x === escolaPosicao.x && posicaoPedro.y === escolaPosicao.y) {
            document.getElementById('pergunta-container').innerHTML = `<p>Parabéns! Josiel chegou à escola com uma pontuação de ${pontuacao}!</p>`;
        } else {
            document.getElementById('pergunta-container').innerHTML = `<p>Fim do quiz! Josiel não conseguiu chegar à escola. Pontuação: ${pontuacao}</p>`;
        }
    }
    ```
    - Avança para a próxima pergunta. Caso existam perguntas restantes, exibe a próxima.
    - Se todas as perguntas acabaram, verifica se Pedro chegou à escola.
        - Se sim, exibe uma mensagem de sucesso com a pontuação.
        - Caso contrário, exibe uma mensagem informando que o quiz terminou sem que Pedro alcançasse o objetivo.
