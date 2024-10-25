const mapa = document.getElementById('mapa');
let perguntas = [];
let posicaoPedro = { x: 0, y: 0 };
let escolaPosicao = { x: 15, y: 15 };
let pontuacao = 0;
let perguntaAtual = 0;

for (let i = 0; i < 16; i++) {
    for (let j = 0; j < 16; j++) {
        const bloco = document.createElement('div');
        bloco.classList.add('bloco');
        bloco.dataset.x = j;
        bloco.dataset.y = i;
        mapa.appendChild(bloco);
    }
}

function atualizarMapa() {
    document.querySelectorAll('.bloco').forEach(bloco => {
        bloco.innerHTML = '';
        const x = parseInt(bloco.dataset.x);
        const y = parseInt(bloco.dataset.y);

        if (x === posicaoPedro.x && y === posicaoPedro.y) {
            bloco.id = 'pedro';
            bloco.innerHTML = '<img src="../assets/pedro.png" alt="Pedro">';
        } else if (x === escolaPosicao.x && y === escolaPosicao.y) {
            bloco.id = 'escola';
            bloco.innerHTML = '<img src="../assets/escola.png" alt="Escola">';
        } else {
            bloco.id = '';
        }
    });
}

atualizarMapa();

fetch('/perguntas')
.then(res => res.json())
.then(data => {
    perguntas = data;
    mostrarPergunta();
});

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

function proximaPergunta() {
    perguntaAtual++;
    if (perguntaAtual < perguntas.length) {
        mostrarPergunta();
    } else if (posicaoPedro.x === escolaPosicao.x && posicaoPedro.y === escolaPosicao.y) {
        document.getElementById('pergunta-container').innerHTML = `<p>Parabéns! Pedro chegou à escola com uma pontuação de ${pontuacao}!</p>`;
    } else {
        document.getElementById('pergunta-container').innerHTML = `<p>Fim do quiz! Pedro não conseguiu chegar à escola. Pontuação: ${pontuacao}</p>`;
    }
}
