// COMIX - Chatbot de Comércio Exterior
// Sistema de mensagens para integração com backend



const inputMensagem = document.getElementById('input-mensagem');
const botaoEnviar = document.getElementById('botao-enviar');
const botaoLimpar = document.getElementById('botao-limpar');
const areaMensagens = document.getElementById('area-mensagens');

// Histórico de mensagens
let historicoMensagens = [];

// Estado do chat
let enviandoMensagem = false;

// Função para adicionar mensagem do usuário ao histórico e interface
function adicionarMensagemUsuario(mensagem) {
    const timestamp = new Date().toISOString();
    const mensagemUsuario = {
        tipo: 'usuario',
        conteudo: mensagem,
        timestamp: timestamp
    };

    // Adiciona ao histórico
    historicoMensagens.push(mensagemUsuario);

    // Cria elemento visual
    const divMensagem = document.createElement('div');
    divMensagem.className = 'mensagem-usuario';
    divMensagem.setAttribute('data-timestamp', timestamp);
    divMensagem.innerHTML = `
            <div class="avatar-usuario" style="padding: 1%;">
                <img src=img/icone-usuario.png style="width:40px;">
            </div>
            <div class="texto-mensagem-usuario">${mensagem}</div>
        `;

    areaMensagens.appendChild(divMensagem);
    rolarParaBaixo();
}

// Função para adicionar mensagem do bot ao histórico e interface
function adicionarMensagemBot(mensagem) {
    const timestamp = new Date().toISOString();
    const mensagemBot = {
        tipo: 'bot',
        conteudo: mensagem,
        timestamp: timestamp
    };

    // Adiciona ao histórico
    historicoMensagens.push(mensagemBot);

    // Cria elemento visual
    const divMensagem = document.createElement('div');
    divMensagem.className = 'mensagem-bot';
    divMensagem.setAttribute('data-timestamp', timestamp);
    divMensagem.innerHTML = `
            <div class="avatar-bot"><img src="img/earth.png" style="width: 40px;"></div>
            <div class="texto-mensagem">${mensagem}</div>
        `;

    areaMensagens.appendChild(divMensagem);
    rolarParaBaixo();
}

// Função para mostrar indicador de digitação
function mostrarDigitando() {
    const divDigitando = document.createElement('div');
    divDigitando.className = 'mensagem-bot digitando';
    divDigitando.id = 'mensagem-digitando';
    divDigitando.innerHTML = `
            <div class="avatar-bot">COMIX</div>
            <div class="texto-mensagem">
                <div class="pontos-digitando">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;

    areaMensagens.appendChild(divDigitando);
    rolarParaBaixo();
}

// Função para remover indicador de digitação
function removerDigitando() {
    const digitando = document.getElementById('mensagem-digitando');
    if (digitando) {
        digitando.remove();
    }
}

// Função para rolar para baixo automaticamente
function rolarParaBaixo() {
    setTimeout(() => {
        areaMensagens.scrollTop = areaMensagens.scrollHeight;
    }, 100);
}

// Função para simular digitação do bot
function simularDigitacao(mensagem) {
    const divMensagem = document.createElement('div');
    divMensagem.className = 'mensagem-bot';
    divMensagem.innerHTML = `
            <div class="avatar-bot">COMIX</div>
            <div class="texto-mensagem" id="mensagem-simulada"></div>
        `;
    areaMensagens.appendChild(divMensagem);

    const elementoTexto = document.getElementById('mensagem-simulada');
    let i = 0;
    const intervalo = setInterval(() => {
        if (i < mensagem.length) {
            elementoTexto.textContent += mensagem.charAt(i);
            i++;
            rolarParaBaixo();
        } else {
            clearInterval(intervalo);
            // Remove o ID temporário
            elementoTexto.removeAttribute('id');
        }
    }, 20);
}

// Função para enviar mensagem ao backend
async function enviarMensagemBackend() {


    axios.get('https://comix-fecart.onrender.com/perguntaUsuario', {
        params: { pergunta: inputMensagem.value }
    })
        .then(function (res) {
            adicionarMensagemBot(res.data);
        })
        .catch(function (error) {
            console.error('Erro ao enviar mensagem:', error);
            removerDigitando();
            adicionarMensagemBot('Erro na comunicação com o servidor.');
        });

}

// Função para processar mensagem
async function processarMensagem() {
    const mensagem = inputMensagem.value.trim();

    if (mensagem === '' || enviandoMensagem) {
        return;
    }

    // Marca como enviando
    enviandoMensagem = true;
    botaoEnviar.disabled = true;
    inputMensagem.disabled = true;

    // Adiciona mensagem do usuário
    adicionarMensagemUsuario(mensagem);


    try {
        // Envia para o backend
        await enviarMensagemBackend(mensagem);
        inputMensagem.value = "";
    } catch (error) {
        console.error('Erro no processamento:', error);
    } finally {
        // Libera o input
        enviandoMensagem = false;
        botaoEnviar.disabled = false;
        inputMensagem.disabled = false;
        inputMensagem.focus();
    }
}

// Função para limpar histórico (útil para resetar conversa)
function limparHistorico() {
    historicoMensagens = [];
    areaMensagens.innerHTML = `
            <div class="mensagem-bot">
                <div class="avatar-bot"><img src="img/earth.png" style="width: 40px;"></div>
                <div class="texto-mensagem">
                    Olá! Sou o COMIX, seu assistente especializado em comércio exterior. 
                    Como posso ajudá-lo hoje?
                </div>
            </div>
        `;

    // Adiciona mensagem de confirmação
    setTimeout(() => {
        adicionarMensagemBot('Conversa limpa! Como posso ajudá-lo agora?');
    }, 500);
}

// Função para confirmar limpeza
function confirmarLimpeza() {
    if (historicoMensagens.length > 1) { // Mais que 1 porque a primeira é sempre a mensagem inicial
        if (confirm('Tem certeza que deseja limpar toda a conversa?')) {
            limparHistorico();
        }
    } else {
        limparHistorico();
    }
}

// Event listeners
botaoEnviar.addEventListener('click', processarMensagem);
botaoLimpar.addEventListener('click', confirmarLimpeza);

inputMensagem.addEventListener('keypress', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        processarMensagem();
    }
});

// Foco automático no input
inputMensagem.focus();

// Navegação suave para âncoras
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Efeito de hover nos cards
const cards = document.querySelectorAll('.card');
cards.forEach(card => {
    card.addEventListener('mouseenter', function () {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });

    card.addEventListener('mouseleave', function () {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Animação de entrada dos elementos
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observa elementos para animação
document.querySelectorAll('.card, .destaque').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Função para exportar histórico (útil para debug)
window.exportarHistorico = function () {
    console.log('Histórico de mensagens:', historicoMensagens);
    return historicoMensagens;
};

// Função para limpar conversa (útil para reset)
window.limparConversa = function () {
    confirmarLimpeza();
};


// Estilos adicionais para mensagens e indicadores
const estilosAdicionais = `
    .mensagem-usuario {
        display: flex;
        align-items: center;
        margin-bottom: 1rem;
        gap: 0.5rem;
        justify-content: flex-end;
    }
    
    .avatar-usuario {
        background-image: linear-gradient(180deg,rgba(168, 230, 207, 0.77), #56C596, #379683);
        color: white;
        padding: 0.5rem;
        border-radius: 50%;
        font-weight: bold;
        font-size: 0.8rem;
        min-width: 40px;
        min-height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
    }
    
    .texto-mensagem-usuario {
        background-image: linear-gradient(180deg,rgba(168, 230, 207, 0.77), #56C596, #379683);
        color: white;
        padding: 1rem;
        border-radius: 8px;
        max-width: 70%;
        line-height: 1.5;
        word-wrap: break-word;
    }
    
    .digitando {
        opacity: 0.7;
    }
    
    .pontos-digitando {
        display: flex;
        gap: 4px;
        align-items: center;
    }
    
    .pontos-digitando span {
        width: 6px;
        height: 6px;
        background: #666;
        border-radius: 50%;
        animation: piscar 1.4s infinite ease-in-out;
    }
    
    .pontos-digitando span:nth-child(1) {
        animation-delay: -0.32s;
    }
    
    .pontos-digitando span:nth-child(2) {
        animation-delay: -0.16s;
    }
    
    @keyframes piscar {
        0%, 80%, 100% {
            transform: scale(0);
            opacity: 0.5;
        }
        40% {
            transform: scale(1);
            opacity: 1;
        }
    }
    
    .botao-enviar:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
    
    .input-chat:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;

// Adiciona os estilos ao documento
const styleSheet = document.createElement('style');
styleSheet.textContent = estilosAdicionais;
document.head.appendChild(styleSheet);


