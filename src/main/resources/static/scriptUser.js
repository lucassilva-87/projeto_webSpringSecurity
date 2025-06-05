let currentPage = 1;
const rowsPerPage = 10;
let usuarios = [];
let selectedRow = null;

async function loadUsuariosFromServer() {
    try {
        const response = await fetch('http://localhost:9856/api/usuarios');
        const data = await response.json();
        usuarios = data;
        loadTableData();
    } catch (error) {
        console.error("Erro ao carregar dados do servidor:", error);
    }
}

function cadastrarUsuario() {
    localStorage.removeItem('usuarioSelecionado');
    window.location.href = 'cadastro_usuario.html';  
}

function salvarUsuario(event) {
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

    const usuario = {
        nome: document.getElementById("nome").value,
        email: document.getElementById("email").value,
        senha: document.getElementById("senha").value
    };

    fetch('http://localhost:9856/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usuario)
    })
    .then(response => {
        if (!response.ok) throw new Error('Erro no servidor: ' + response.status);
        return response.text();
    })
    .then(text => {
        console.log('Resposta do servidor:', text);
    })
    .then(() => {
        alert('Usuario cadastrado com sucesso!');
        window.location.replace('indexUsuario.html');
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Erro ao cadastrar.');

        btnSalvar.disabled = false;
        btnSalvar.textContent = "Salvar";
    });
}

function accessUser() {
    if (selectedRow) {
        const codigoSelecionado = Number(selectedRow.cells[0].textContent.trim());
        const usuario = usuarios.find(c => c.id === codigoSelecionado);

        if (usuario) {
            localStorage.setItem('usuarioSelecionado', JSON.stringify(usuario));
            window.location.href = 'acessar_usuario.html';
        } else {
            alert("Usuario não encontrado!");
        }
    } else {
        alert('Selecione um usuario para acessar!');
    }
}

function cadastrarUsuario() {
    localStorage.removeItem('usuarioSelecionado');
    window.location.href = 'cadastro_usuario.html';  
}

function voltar() {
    window.history.back();
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function selectRow(row, usuario) {
    if (selectedRow) {
        selectedRow.classList.remove('selected');
    }
    selectedRow = row;
    row.classList.add('selected');
}

function loadFilteredTable(filtrados) {
    const tableBody = document.getElementById("usersData");
    tableBody.innerHTML = '';

    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedUsers = filtrados.slice(start, end);

    paginatedUsers.forEach(usuario => {
        const row = document.createElement('tr');
        row.classList.add('client-row');


        row.onclick = () => selectRow(row, usuario);
        row.innerHTML = `
            <td>${usuario.id}</td>
            <td>${usuario.nome}</td>
            <td>${usuario.email}</td>
        `;
        tableBody.appendChild(row);
    });
}

function filterTable() {
    const codFilter = document.getElementById('filterCod').value.toLowerCase();
    const nomeFilter = document.getElementById('filterNome').value.toLowerCase();
    const emailFilter = document.getElementById('filterEmail').value.toLowerCase();

    const filteredUsuarios = usuarios.filter(usuario => {
        return (
            (usuario.id.toString() === codFilter || codFilter === '')&&
            (usuario.email.toLowerCase().includes(emailFilter) || emailFilter === '') &&
            (usuario.nome.toLowerCase().includes(nomeFilter) || nomeFilter === '')
        );
    });

    currentPage = 1;
    loadFilteredTable(filteredUsuarios);
}

function loadTableData() {
    const tableBody = document.getElementById("usersData");
    tableBody.innerHTML = '';

    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedUsers = usuarios;

    paginatedUsers.forEach(usuario => {
        const row = document.createElement('tr');
        row.classList.add('client-row');
        if (usuario.statusToggle === false) {
            row.classList.add('inativo');
        }
        row.onclick = () => selectRow(row, usuario);
        row.innerHTML = `
            <td>${usuario.id}</td>
            <td>${usuario.nome}</td>
            <td>${usuario.email}</td>
        `;
        tableBody.appendChild(row);
    });
}

function alterarUsuario(event) {
    event.preventDefault();

    const form = document.getElementById('formAlterar');

    if (!form.checkValidity()) {
        form.reportValidity(); 
        return false;
    }


    const usuarioSelecionado = JSON.parse(localStorage.getItem('usuarioSelecionado'));
    if (!usuarioSelecionado || !usuarioSelecionado.id) {
        alert("Usuario inválido ou não selecionado.");
        return;
    }

    const usuarioAtualizado = {
        nome: document.getElementById("nome").value,
        email: document.getElementById("email").value,
        senha: document.getElementById("senha").value,
    };

    fetch(`http://localhost:9856/api/usuarios/${usuarioSelecionado.id}`, {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(usuarioAtualizado)
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
    alert("Usuario atualizado com sucesso!");
    localStorage.setItem('usuarioSelecionado', JSON.stringify(usuarioAtualizado));
    window.location.href = "indexUsuario.html";
})
.catch(error => {
    console.error("Erro na atualização:", error);
    alert("Falha ao atualizar usuario:\n" + error.message);
});
}

function excluirUsuario() {
    const usuarioSelecionado = JSON.parse(localStorage.getItem('usuarioSelecionado'));
    if (!usuarioSelecionado || !usuarioSelecionado.id) {
        alert("Usuario inválido ou não selecionado.");
        return;
    }

    if (!confirm("Tem certeza que deseja excluir este usuario?")) return;

    fetch(`http://localhost:9856/api/usuarios/${usuarioSelecionado.id}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) throw new Error("Erro ao excluir usuario.");
        alert("Usuario excluído com sucesso!");
        localStorage.removeItem('usuarioSelecionado');
        window.location.href = 'indexUsuario.html';
    })
    .catch(error => {
        console.error("Erro ao excluir:", error);
        alert("Falha ao excluir usuario.");
    });
}

function limparFormulario() {
    const fields = [
        "nome", "email", "senha"
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

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById("usersData")) {
        loadUsuariosFromServer();
        return;
    }

    const usuario = JSON.parse(localStorage.getItem('usuarioSelecionado'));
    if (!usuario) return;

    const fields = [
        'nome', 'email', 'senha'
    ];

    fields.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            if (input.type === 'checkbox') {
                input.checked = usuario[id];
            } else if (id === 'codigo') {
                input.value = usuario.id;
            } else {
                input.value = usuario[id] || '';
            }
        }
    });

    document.getElementById('codigo').value = usuario.id;

    
    if (document.getElementById("usersData")) {
        loadUsuariosFromServer();
    }
    
    usuarioSelecionado = JSON.parse(localStorage.getItem('usuarioSelecionado'));
    if (usuarioSelecionado && usuarioSelecionado.id !== undefined) {
        document.getElementById('id').value = usuarioSelecionado.id;
    }

    
});