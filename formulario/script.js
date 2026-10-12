
const form = document.getElementById("formCandidato");
const tabela = document.getElementById("tabelaCandidatos");
const contador = document.getElementById("contador");
const mensagem = document.getElementById("mensagem");
const vagaSelect = document.getElementById("vaga");

// Lista de candidatos cadastrados
let candidatos = [];

// Atualiza a tabela na página
function atualizarTabela() {
    contador.textContent =
        `${candidatos.length} ${
            candidatos.length === 1 ? "inscrição" : "inscrições"
        }`;

    // Se não houver candidatos, mostra a mensagem inicial
    if (candidatos.length === 0) {
        tabela.innerHTML = `
            <tr class="empty-row">
                <td colspan="6">
                    Nenhum candidato cadastrado ainda.
                </td>
            </tr>
        `;
        return;
    }

    // Limpa as linhas antigas da tabela
    tabela.innerHTML = "";

    // Cria uma linha para cada candidato
    candidatos.forEach((candidato, index) => {
        const linha = document.createElement("tr");

        const valores = [
            String(index + 1),
            candidato.nome,
            candidato.curso,
            candidato.vaga,
            candidato.email,
            candidato.data
        ];

        valores.forEach((valor, coluna) => {
            const celula = document.createElement("td");

            if (coluna === 3) {
                const etiqueta = document.createElement("span");

                etiqueta.className = "table-vaga";
                etiqueta.textContent = valor;

                celula.appendChild(etiqueta);
            } else {
                celula.textContent = valor;
            }

            linha.appendChild(celula);
        });

        tabela.appendChild(linha);
    });
}

// Evento de envio do formulário
form.addEventListener("submit", function(evento) {
    // Impede que a página recarregue
    evento.preventDefault();

    // Verifica se os campos são válidos
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    // Obtém os dados preenchidos
    const dados = new FormData(form);

    // Cria o objeto com as informações do candidato
    const candidato = {
        nome: String(dados.get("nome")).trim(),
        email: String(dados.get("email")).trim(),
        telefone: String(dados.get("telefone")).trim(),
        curso: String(dados.get("curso")).trim(),
        semestre: String(dados.get("semestre")).trim(),
        vaga: String(dados.get("vaga")).trim(),
        linkedin: String(dados.get("linkedin")).trim(),
        data: new Date().toLocaleDateString("pt-BR")
    };

    // Adiciona o novo candidato no início da lista
    candidatos.unshift(candidato);

    // Atualiza a tabela
    atualizarTabela();

    // Exibe mensagem de sucesso
    mensagem.textContent =
        `Inscrição de ${candidato.nome} cadastrada com sucesso!`;

    mensagem.className = "form-message success";

    // Limpa o formulário
    form.reset();

    // Leva o usuário até a tabela
    document.getElementById("candidatos").scrollIntoView({
        behavior: "smooth"
    });
});

// Botões "Tenho interesse" nas vagas
document.querySelectorAll(".job-apply").forEach(function(botao) {
    botao.addEventListener("click", function() {
        // Seleciona a vaga correspondente
        vagaSelect.value = botao.dataset.vaga;

        // Desce até o formulário
        document.getElementById("inscricao").scrollIntoView({
            behavior: "smooth"
        });

        // Coloca o cursor no campo de nome
        document.getElementById("nome").focus({
            preventScroll: true
        });

        mensagem.textContent =
            `Vaga selecionada: ${botao.dataset.vaga}`;

        mensagem.className = "form-message";
    });
});

// Formata o telefone enquanto o usuário digita
document.getElementById("telefone").addEventListener(
    "input",
    function(evento) {
        let numeros = evento.target.value
            .replace(/\D/g, "")
            .slice(0, 11);

        if (numeros.length > 10) {
            numeros = numeros.replace(
                /^(\d{2})(\d{5})(\d{4}).*/,
                "($1) $2-$3"
            );
        } else if (numeros.length > 6) {
            numeros = numeros.replace(
                /^(\d{2})(\d{4})(\d{0,4}).*/,
                "($1) $2-$3"
            );
        } else if (numeros.length > 2) {
            numeros = numeros.replace(
                /^(\d{2})(\d{0,5})/,
                "($1) $2"
            );
        }

        evento.target.value = numeros;
    }
);

// Mostra a tabela inicial ao abrir a página
atualizarTabela();
