let currentPage = 1;
const rowsPerPage = 10;
let clientes = [];
let selectedRow = null;

async function loadClientesFromServer() {
    try {
        const response = await fetch('http://localhost:9856/clientes');
        const data = await response.json();
        clientes = data;
        loadTableData();
    } catch (error) {
        console.error("Erro ao carregar dados do servidor:", error);
    }
}

function loadTableData() {
    const tableBody = document.getElementById("clientsData");
    tableBody.innerHTML = '';

    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedClients = clientes;

    paginatedClients.forEach(cliente => {
        const row = document.createElement('tr');
        row.classList.add('client-row');
        if (cliente.statusToggle === false) {
            row.classList.add('inativo');
        }
        row.onclick = () => selectRow(row, cliente);
        row.innerHTML = `
            <td>${cliente.id}</td>
            <td>${cliente.cnpj}</td>
            <td>${cliente.nome}</td>
            <td>${cliente.municipio}</td>
        `;
        tableBody.appendChild(row);
    });
}

function filterTable() {
    const codFilter = document.getElementById('filterCod').value.toLowerCase();
    const cnpjFilter = document.getElementById('filterCnpj').value.toLowerCase();
    const nomeFilter = document.getElementById('filterNome').value.toLowerCase();

    const filteredClientes = clientes.filter(cliente => {
        return (
            (cliente.id.toString() === codFilter || codFilter === '')&&
            (cliente.cnpj.toLowerCase().includes(cnpjFilter) || cnpjFilter === '') &&
            (cliente.nome.toLowerCase().includes(nomeFilter) || nomeFilter === '')
        );
    });

    currentPage = 1;
    loadFilteredTable(filteredClientes);
}

function loadFilteredTable(filtrados) {
    const tableBody = document.getElementById("clientsData");
    tableBody.innerHTML = '';

    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedClients = filtrados.slice(start, end);

    paginatedClients.forEach(cliente => {
        const row = document.createElement('tr');
        row.classList.add('client-row');
        if (cliente.statusToggle === false) {
            row.classList.add('inativo');
        }

        row.onclick = () => selectRow(row, cliente);
        row.innerHTML = `
            <td>${cliente.id}</td>
            <td>${cliente.cnpj}</td>
            <td>${cliente.nome}</td>
            <td>${cliente.municipio}</td>
        `;
        tableBody.appendChild(row);
    });
}


function selectRow(row, cliente) {
    if (selectedRow) {
        selectedRow.classList.remove('selected');
    }
    selectedRow = row;
    row.classList.add('selected');
}

function accessClient() {
    if (selectedRow) {
        const codigoSelecionado = Number(selectedRow.cells[0].textContent.trim());
        const cliente = clientes.find(c => c.id === codigoSelecionado);

        if (cliente) {
            localStorage.setItem('clienteSelecionado', JSON.stringify(cliente));
            window.location.href = 'acessar_cliente.html';
        } else {
            alert("Cliente não encontrado!");
        }
    } else {
        alert('Selecione um cliente para acessar!');
    }
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function alterarCadastro(event) {
    event.preventDefault();

    const form = document.getElementById('formAlterar');

    if (!form.checkValidity()) {
        form.reportValidity();
        return false;
    }


    const clienteSelecionado = JSON.parse(localStorage.getItem('clienteSelecionado'));
    if (!clienteSelecionado || !clienteSelecionado.id) {
        alert("Cliente inválido ou não selecionado.");
        return;
    }

    const clienteAtualizado = {
        id: clienteSelecionado.id,
        loja: document.getElementById('loja').value,
        cnpj: document.getElementById('cnpj').value,
        nome: document.getElementById('nome').value,
        nomeFantasia: document.getElementById('nomeFantasia').value,
        tipo: document.getElementById('tipo').value,
        dataAbertura: document.getElementById('dataAbertura').value,
        cep: document.getElementById('cep').value,
        logradouro: document.getElementById('logradouro').value,
        numero: document.getElementById('numero').value,
        complemento: document.getElementById('complemento').value,
        bairro: document.getElementById('bairro').value,
        municipio: document.getElementById('municipio').value,
        estado: document.getElementById('estado').value,
        pais: document.getElementById('pais').value,
        telefone: document.getElementById('telefone').value,
        email: document.getElementById('email').value,
        site: document.getElementById('site').value,
        telefone2: document.getElementById('telefone2').value,
        telefone3: document.getElementById('telefone3').value,
        inscricaoEstadual: document.getElementById('inscricaoEstadual').value,
        inscricaoMunicipal: document.getElementById('inscricaoMunicipal').value,
        codCNAE: document.getElementById('codCNAE').value,
        statusToggle: document.getElementById("statusToggle").checked
    };

    fetch(`http://localhost:9856/clientes/${clienteSelecionado.id}`, {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(clienteAtualizado)
})
.then(response => {
    if (!response.ok) {
        return response.text().then(msg => {
            throw new Error("Erro do servidor: " + msg);
        });
    }

    if (response.status === 204) {
        return null;
    }

    return response.text();
})
.then(() => {
    alert("Cadastro atualizado com sucesso!");
    localStorage.setItem('clienteSelecionado', JSON.stringify(clienteAtualizado));
    window.location.href = "indexCliente.html";
})
.catch(error => {
    console.error("Erro na atualização:", error);
    alert("Falha ao atualizar cliente:\n" + error.message);
});
}

function excluirCadastro() {
    const clienteSelecionado = JSON.parse(localStorage.getItem('clienteSelecionado'));
    if (!clienteSelecionado || !clienteSelecionado.id) {
        alert("Cliente inválido ou não selecionado.");
        return;
    }

    if (!confirm("Tem certeza que deseja excluir este cliente?")) return;

    fetch(`http://localhost:9856/clientes/${clienteSelecionado.id}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) throw new Error("Erro ao excluir cliente.");
        alert("Cliente excluído com sucesso!");
        localStorage.removeItem('clienteSelecionado');
        window.location.href = 'indexCliente.html';
    })
    .catch(error => {
        console.error("Erro ao excluir:", error);
        alert("Falha ao excluir cliente.");
    });
}

function voltar() {
    window.history.back();
}

function cadastrarCliente() {
    localStorage.removeItem('clienteSelecionado');
    window.location.href = 'cadastro_cliente.html';  
}

function salvarCliente(event) {
    const btnSalvar = document.querySelector('button[type="submit"]');
    btnSalvar.disabled = true;
    btnSalvar.textContent = "Salvando...";

    event.preventDefault();

    const form = document.getElementById('formCadastro');

    if (!form.checkValidity()) {
        form.reportValidity(); 
        btnSalvar.disabled = false;
        btnSalvar.textContent = "Salvar";
        return false;
    }

    const cliente = {
        loja: document.getElementById("loja").value,
        cnpj: document.getElementById("cnpj").value,
        nome: document.getElementById("nome").value,
        nomeFantasia: document.getElementById("nomeFantasia").value,
        tipo: document.getElementById("tipo").value,
        dataAbertura: document.getElementById("dataAbertura").value,
        cep: document.getElementById("cep").value,
        logradouro: document.getElementById("logradouro").value,
        numero: document.getElementById("numero").value,
        complemento: document.getElementById("complemento").value,
        bairro: document.getElementById("bairro").value,
        municipio: document.getElementById("municipio").value,
        estado: document.getElementById("estado").value,
        pais: document.getElementById("pais").value,
        telefone: document.getElementById("telefone").value,
        email: document.getElementById("email").value,
        site: document.getElementById("site").value,
        telefone2: document.getElementById("telefone2").value,
        telefone3: document.getElementById("telefone3").value,
        inscricaoEstadual: document.getElementById("inscricaoEstadual").value,
        inscricaoMunicipal: document.getElementById("inscricaoMunicipal").value,
        codCNAE: document.getElementById("codCNAE").value,
        statusToggle: document.getElementById("statusToggle").checked
    };

    fetch('http://localhost:9856/clientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cliente)
    })
    .then(response => {
        if (!response.ok) throw new Error('Erro no servidor: ' + response.status);
        return response.text();
    })
    .then(text => {
        console.log('Resposta do servidor:', text);
    })
    .then(() => {
        alert('Cliente cadastrado com sucesso!');
        window.location.replace('indexCliente.html');
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Erro ao cadastrar.');

        btnSalvar.disabled = false;
        btnSalvar.textContent = "Salvar";
    });
}

function limparFormulario() {
    const fields = [
        "loja", "cnpj", "nome", "nomeFantasia", "tipo", "dataAbertura",
        "cep", "logradouro", "numero", "complemento", "bairro", "municipio", "estado", "pais",
        "telefone", "email", "site", "telefone2", "telefone3",
        "inscricaoEstadual", "inscricaoMunicipal", "codCNAE"
    ];

    fields.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
        el.value = '';
    } else {
        console.warn(`Campo não encontrado: ${id}`);
    }
    });

}

function buscarCEP() {
    let cep = document.getElementById("cep").value.replace(/\D/g, '');

    if(cep.length !== 8) {
        alert("CEP inválido.");
        return;
    }

    fetch(`https://viacep.com.br/ws/${cep}/json/`)
    .then(response => response.json())
    .then(data => {

    if (data.erro) {
        alert("CEP não encontrado.");
        return;
    }
    document.getElementById("logradouro").value = data.logradouro || "";
    document.getElementById("bairro").value = data.bairro || "";
    document.getElementById("municipio").value = data.localidade || "";
    document.getElementById("estado").value = data.uf || "";
    })
    .catch(error => {
        console.error("Erro:", error);
        alert("Erro ao buscar o CEP.");
    });

}

function buscarCNPJ() {
    let cnpj = document.getElementById("cnpj").value.replace(/\D/g, '');

    if (cnpj.length !== 14) {
        alert("CNPJ inválido. O CNPJ deve ter 14 dígitos.");
        return;
    }

    const url = `https://www.receitaws.com.br/v1/cnpj/${cnpj}`;
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;

    fetch(proxyUrl)
        .then(response => {
            if (!response.ok) throw new Error('Erro na resposta do proxy');
            return response.json();
        })
        .then(data => {
            const parsedData = JSON.parse(data.contents);

            if (parsedData.status === "ERROR") {
                alert("CNPJ não encontrado ou inválido.");
                return;
            }

            const statusEmpresa = parsedData.situacao || "";

            if (statusEmpresa.toLowerCase() !== "ativa") {
                let confirmar = confirm("CNPJ com situação diferente de ativa. Deseja continuar?");
                if (!confirmar) {
                    document.getElementById("cnpj").value = '';
                    document.getElementById("nome").value = '';
                    document.getElementById("dataAbertura").value = '';
                    return;
                }
            }

            document.getElementById("nome").value = parsedData.nome || "";
            document.getElementById("dataAbertura").value = parsedData.abertura || "";
        })
        .catch(error => {
            console.error("Erro:", error);
            alert("Erro ao buscar o CNPJ. Tente novamente mais tarde.");
        });
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById("clientsData")) {
        loadClientesFromServer();
        return;
    }

    const cliente = JSON.parse(localStorage.getItem('clienteSelecionado'));
    if (!cliente) return;

    const fields = [
        'codigo', 'loja', 'cnpj', 'nome', 'nomeFantasia', 'tipo', 'dataAbertura',
        'cep', 'logradouro', 'numero', 'complemento', 'bairro', 'municipio', 'estado', 'pais',
        'telefone', 'telefone2', 'telefone3', 'email', 'site',
        'inscricaoEstadual', 'inscricaoMunicipal', 'codCNAE', 'statusToggle'
    ];

    fields.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            if (input.type === 'checkbox') {
                input.checked = cliente[id];
            } else if (id === 'codigo') {
                input.value = cliente.id;
            } else {
                input.value = cliente[id] || '';
            }
        }
    });

    if (cliente && cliente.active !== undefined) {
        document.getElementById('statusToggle').checked = cliente.active;
    }

    document.getElementById('codigo').value = cliente.id;


    
    const clienteSelecionado = JSON.parse(localStorage.getItem('clienteSelecionado'));
    if (clienteSelecionado && clienteSelecionado.active !== undefined) {
        document.getElementById('statusToggle').checked = clienteSelecionado.active;
    }
    
    if (document.getElementById("clientsData")) {
        loadClientesFromServer();
    }
    
    clienteSelecionado = JSON.parse(localStorage.getItem('clienteSelecionado'));
    if (clienteSelecionado && clienteSelecionado.id !== undefined) {
        document.getElementById('id').value = clienteSelecionado.id;
    }    
});

