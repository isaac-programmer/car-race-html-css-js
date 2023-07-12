// Inicia o jogo quando a página for carregada
document.addEventListener("DOMContentLoaded", iniciar);

// Variáveis
let carro;
let idInterval;
let obstaculos = [];
let nitros = [];
let postosCombustivel = [];
let pontuacao = 0;
let energia = 30;
let qtdConsumoPostoCombustivel = 0;
let fimDeJogo = false;
let consumiuCombustivel = false;
let larguraEstrada = 500;
let alturaEstrada = 700;
let larguraCarro = 45;
let alturaCarro = 90;
let larguraObstaculo = 45;
let alturaObstaculo = 90;
let larguraNitro = 60;
let alturaNitro = 50;
let larguraPostoCombustivel = 50;
let alturaPostoCombustivel = 50;
let deslocamentoEstrada = 20;
let velocidadeCarro = 5;
let velocidadeObstaculo = 3;
let velocidadePostoCombustivel = 3;
let velocidadeNitros = 3;
let teclaCimaPressionada = false;
let teclaDireitaPressionada = false;
let teclaEsquerdaPressionada = false;
let containerJogo = document.getElementById("estrada-jogo");

// Função de inicialização
function iniciar() {
  carro = document.createElement("div");
  carro.id = "carro";

  let img = document.createElement("img");
  img.src = "img/carro-01.svg";

  carro.appendChild(img);
  containerJogo.appendChild(carro);

  // Adiciona eventos de controle
  document.addEventListener("keydown", lidarComTeclaPressionada);
  document.addEventListener("keyup", lidarComTeclaSolta);

  // Adiciona eventos de mudança de cenário
  document.getElementById("btn-diario").addEventListener("click", exibirCenarioDiario);
  document.getElementById("btn-cerracao").addEventListener("click", exibirCenarioCerracao);
  document.getElementById("btn-noturno").addEventListener("click", exibirCenarioNoturno);
  document.getElementById("btn-neve").addEventListener("click", exibirCenarioNeve);

  idInterval = setInterval(() => {
    energia -= 1;
    atualizarEnergia();
  }, 1000);

  idIntervalSaiuPista = setInterval(() => {
    if(carro.offsetLeft < 11 || carro.offsetLeft > 440) {
      velocidadeCarro *= 0.85;
      velocidadeNitros *= 0.85;
      velocidadeObstaculo *= 0.85;
      velocidadePostoCombustivel *= 0.85;
    }
  }, 1000);

  // Inicia o loop do jogo
  loopJogo();
}

// Função principal do jogo
function loopJogo() {
  // Verifica se o jogo ainda não acabou
  if (!fimDeJogo) {
    if (pontuacao < 0) {
      fimDeJogo = true;
      clearInterval(idInterval);
      clearInterval(idIntervalSaiuPista);
      pontuacao = 0;
      exibirTelaFimDeJogo();
      return;
    }

    if (energia <= 0) {
      fimDeJogo = true;
      clearInterval(idInterval);
      clearInterval(idIntervalSaiuPista);
      exibirTelaFimDeJogo();
      return;
    }

    if (velocidadeObstaculo < 2) {
      fimDeJogo = true;
      clearInterval(idInterval);
      clearInterval(idIntervalSaiuPista);
      atualizarVelocidade();
      exibirTelaFimDeJogo();
      return;
    }

    moverCarro();
    moverObstaculos();
    moverPostosCombustivel();
    moverNitros();

    verificarConsumoCombustivel();
    verificarConsumoNitro();

    atualizarPontuacao();
    atualizarVelocidade();
    atualizarEnergia();

    verificarColisaoObstaculo();

    requestAnimationFrame(loopJogo);
  }
}


// Função para adicionar obstáculos
function adicionarObstaculo() {
  let obstaculo = document.createElement("div");
  obstaculo.id = "obstaculo";

  let img = document.createElement("img");
  img.src = "img/policia-01.svg";

  obstaculo.appendChild(img);

  let obstaculoEsquerda = Math.random() * (larguraEstrada - larguraObstaculo);
  let obstaculoTopo = 0;

  // Verifica colisão com outros obstáculos
  let colidiu = false;

  for (let i = 0; i < obstaculos.length; i++) {
    if (
      obstaculoEsquerda < obstaculos[i].offsetLeft + larguraObstaculo &&
      obstaculoEsquerda + larguraObstaculo > obstaculos[i].offsetLeft &&
      obstaculoTopo < obstaculos[i].offsetTop + alturaObstaculo &&
      obstaculoTopo + alturaObstaculo > obstaculos[i].offsetTop
    ) {
      colidiu = true;
      break;
    }
  }

  if (!colidiu) {
    obstaculo.style.left = obstaculoEsquerda + "px";
    obstaculo.style.top = obstaculoTopo + "px";
    document.getElementById("estrada-jogo").appendChild(obstaculo);
    obstaculos.push(obstaculo);
  }
}

// Função para adicionar posto de combustível
function adicionarPostoCombustivel() {
  let postoCombustivel = document.createElement("div");
  postoCombustivel.id = "postoCombustivel";

  let img = document.createElement("img");
  img.src = "img/gasolina.png";

  postoCombustivel.appendChild(img);

  let postoCombustivelEsquerda = Math.random() * (larguraEstrada - larguraPostoCombustivel);
  let postoCombustivelTopo = 0;

  // Verifica colisão com outros postos de combustível
  let colidiu = false;

  for (let i = 0; i < postosCombustivel.length; i++) {
    if (
      postoCombustivelEsquerda <
      postosCombustivel[i].offsetLeft + larguraPostoCombustivel &&
      postoCombustivelEsquerda + larguraPostoCombustivel >
      postosCombustivel[i].offsetLeft &&
      postoCombustivelTopo <
      postosCombustivel[i].offsetTop + alturaPostoCombustivel &&
      postoCombustivelTopo + alturaPostoCombustivel >
      postosCombustivel[i].offsetTop
    ) {
      colidiu = true;
      break;
    }
  }

  if (!colidiu) {
    postoCombustivel.style.left = postoCombustivelEsquerda + "px";
    postoCombustivel.style.top = postoCombustivelTopo + "px";
    document.getElementById("estrada-jogo").appendChild(postoCombustivel);
    postosCombustivel.push(postoCombustivel);
  }
}

// Função para adicionar nitro
function adicionarNitro() {
  let nitro = document.createElement("div");
  nitro.id = "nitro";

  let img = document.createElement("img");
  img.src = "img/nitro.webp";

  nitro.appendChild(img
  );

  let nitroEsquerda = Math.random() * (larguraEstrada - larguraNitro);
  let nitroTopo = 0;

  // Verifica colisão com outros nitros
  let colidiu = false;

  for (let i = 0; i < nitro.length; i++) {
    if (
      nitroEsquerda <
      nitro[i].offsetLeft + larguraNitro &&
      nitroEsquerda + larguraNitro >
      nitro[i].offsetLeft &&
      nitroTopo <
      nitro[i].offsetTop + alturaNitro &&
      nitroTopo + alturaNitro >
      nitro[i].offsetTop
    ) {
      colidiu = true;
      break;
    }
  }

  if (!colidiu) {
    nitro.style.left = nitroEsquerda + "px";
    nitro.style.top = nitroTopo + "px";
    document.getElementById("estrada-jogo").appendChild(nitro);
    nitros.push(nitro);
  }
}

// Função para mover o carro
function moverCarro() {
  if (teclaEsquerdaPressionada && !teclaDireitaPressionada && carro.offsetLeft > 0) {
    carro.style.left = carro.offsetLeft - velocidadeCarro + "px";
  }

  if (teclaDireitaPressionada && !teclaEsquerdaPressionada && carro.offsetLeft + carro.offsetWidth < larguraEstrada) {
    carro.style.left = carro.offsetLeft + velocidadeCarro + "px";
  }
}

// Função para mover os obstáculos
function moverObstaculos() {
  for (let i = 0; i < obstaculos.length; i++) {
    obstaculos[i].style.top =
      obstaculos[i].offsetTop + velocidadeObstaculo + "px";

    // Remove obstáculo quando sair da tela
    if (obstaculos[i].offsetTop > alturaEstrada) {
      obstaculos[i].remove();
      obstaculos.splice(i, 1);
      i--;
      // Aumenta 1 ponto ao ultrapassar o carro
      pontuacao += 1;
    }
  }

  // Adiciona novos obstáculos
  if (Math.random() < 0.006) {
    adicionarObstaculo();
  }
}

// Função para mover os postos de combustível
function moverPostosCombustivel() {
  for (let i = 0; i < postosCombustivel.length; i++) {
    postosCombustivel[i].style.top =
      postosCombustivel[i].offsetTop + velocidadePostoCombustivel + "px";

    // Remove quando sair da tela
    if (postosCombustivel[i].offsetTop > alturaEstrada) {
      postosCombustivel[i].remove();
      postosCombustivel.splice(i, 1);
      i--;
    }
  }

  // Adiciona novos postos de combustível
  if (Math.random() < 0.001) {
    adicionarPostoCombustivel();
  }
}

// Função para mover os nitros
function moverNitros() {
  for (let i = 0; i < nitros.length; i++) {
    nitros[i].style.top =
      nitros[i].offsetTop + velocidadeNitros + "px";

    // Remove quando sair da tela
    if (nitros[i].offsetTop > alturaEstrada) {
      nitros[i].remove();
      nitros.splice(i, 1);
      i--;
    }
  }

  // Adiciona novos postos de combustível
  if (Math.random() < 0.0005) {
    adicionarNitro();
  }
}

// Função para verificar colisões
function verificarColisaoObstaculo() {
  for (let i = 0; i < obstaculos.length; i++) {
    if (
      carro.offsetLeft < obstaculos[i].offsetLeft + larguraObstaculo &&
      carro.offsetLeft + larguraCarro > obstaculos[i].offsetLeft &&
      carro.offsetTop < obstaculos[i].offsetTop + alturaObstaculo &&
      carro.offsetTop + alturaCarro > obstaculos[i].offsetTop
    ) {
      velocidadeCarro -= 1;
      velocidadeObstaculo -= 1;
      velocidadePostoCombustivel -= 1;
      velocidadeNitros -= 1;
      obstaculos[i].remove();
      obstaculos.splice(i, 1);
      pontuacao -= 10;
      break;
    }
  }
}

// Função para verificar consumo de combustível
function verificarConsumoCombustivel() {
  for (let i = 0; i < postosCombustivel.length; i++) {
    if (
      carro.offsetLeft < postosCombustivel[i].offsetLeft + larguraPostoCombustivel &&
      carro.offsetLeft + larguraCarro > postosCombustivel[i].offsetLeft &&
      carro.offsetTop < postosCombustivel[i].offsetTop + alturaPostoCombustivel &&
      carro.offsetTop + alturaCarro > postosCombustivel[i].offsetTop
    ) {
      // Remove posto de combustivel quando o carro encostar nel
      energia += 30;
      qtdConsumoPostoCombustivel += 1;
      postosCombustivel[i].remove();
      postosCombustivel.splice(i, 1);
      break;
    }
  }
}

// Função para verificar consumo de combustível
function verificarConsumoNitro() {
  for (let i = 0; i < nitros.length; i++) {
    if (
      carro.offsetLeft < nitros[i].offsetLeft + larguraNitro &&
      carro.offsetLeft + larguraCarro > nitros[i].offsetLeft &&
      carro.offsetTop < nitros[i].offsetTop + alturaNitro &&
      carro.offsetTop + alturaCarro > nitros[i].offsetTop
    ) {
      // Remove nitro quando o carro encostar nele
      velocidadeCarro += 2;
      velocidadeObstaculo += 2;
      velocidadePostoCombustivel += 2;
      velocidadeNitros += 2;
      pontuacao += 20;

      nitros[i].remove();
      nitros.splice(i, 1);
      break;
    }
  }
}

// Função para atualizar a pontuação
function atualizarPontuacao() {
  document.getElementById("pontuacao").textContent = "Pontuação: " + pontuacao;
}

// Função para atualizar a energia
function atualizarEnergia() {
  document.getElementById("energia").textContent = "Energia: " + energia;
}

// Função para atualizar a velocidade
function atualizarVelocidade() {
  document.getElementById("velocidade").textContent = "Velocidade: " + velocidadeObstaculo.toFixed(2) + " Km/h";
}

// Função para lidar com evento de tecla pressionada
function lidarComTeclaPressionada(event) {
  if (event.key === "ArrowLeft") {
    teclaEsquerdaPressionada = true;
  }
  if (event.key === "ArrowRight") {
    teclaDireitaPressionada = true;
  }
}

// Função para lidar com evento de tecla solta
function lidarComTeclaSolta(event) {
  if (event.key === "ArrowLeft") {
    teclaEsquerdaPressionada = false;
  }
  if (event.key === "ArrowRight") {
    teclaDireitaPressionada = false;
  }
}

// Função para lidar com evento de click no botão - cenário diário
function exibirCenarioDiario() {
  document.body.style.backgroundImage = "url(img/cenario-diario.jpg)";
}

// Função para lidar com evento de click no botão - cenário cerração
function exibirCenarioCerracao() {
  document.body.style.backgroundImage = "url(img/cenario-cerracao.jpg)";
}

// Função para lidar com evento de click no botão - cenário noturno
function exibirCenarioNoturno() {
  document.body.style.backgroundImage = "url(img/cenario-noturno.jpg)";
}

// Função para lidar com evento de click no botão - cenário neve
function exibirCenarioNeve() {
  document.body.style.backgroundImage = "url(img/cenario-neve.jpg)";
}

// Função para exibir tela de fim de jogo
function exibirTelaFimDeJogo() {
  const telaFimDeJogo = document.createElement("div");
  telaFimDeJogo.id = "tela-fim-de-jogo";

  const textoFimDeJogo = document.createElement("h1");
  textoFimDeJogo.textContent = "Fim de Jogo!";

  const pontuacaoFinal = document.createElement("p");
  pontuacaoFinal.textContent = `Pontuação Final: ${pontuacao}`;

  const qtdConsumoPostoC = document.createElement("p")
  qtdConsumoPostoC.textContent = `Consumo de Combustível: ${qtdConsumoPostoCombustivel}`;

  const botaoReiniciar = document.createElement("button");
  botaoReiniciar.textContent = "Reiniciar";
  botaoReiniciar.addEventListener("click", reiniciarJogo);

  telaFimDeJogo.appendChild(textoFimDeJogo);
  telaFimDeJogo.appendChild(pontuacaoFinal);
  telaFimDeJogo.appendChild(qtdConsumoPostoC);
  telaFimDeJogo.appendChild(botaoReiniciar);
  document.body.appendChild(telaFimDeJogo);
}

// Função para reiniciar o jogo
function reiniciarJogo() {
  energia = 30;
  fimDeJogo = false;
  pontuacao = 0;
  qtdConsumoPostoCombustivel = 0;
  velocidadeCarro = 5;
  velocidadeObstaculo = 3;
  velocidadePostoCombustivel = 3;
  velocidadeNitros = 3;

  obstaculos.forEach((obstaculo) => obstaculo.remove());
  nitros.forEach((nitro) => nitro.remove());
  postosCombustivel.forEach((postoCombustivel) => postoCombustivel.remove());

  obstaculos = [];
  nitros = [];
  postosCombustivel = [];

  carro.remove();

  document.getElementById("tela-fim-de-jogo").remove();

  iniciar();
}