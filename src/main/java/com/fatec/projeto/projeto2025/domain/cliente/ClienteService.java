package com.fatec.projeto.projeto2025.domain.cliente;

import com.fatec.projeto.projeto2025.entities.Cliente;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ClienteService {

    @Autowired
    private ClienteRepository repository;

    public Cliente criarCliente(Cliente cliente) {
        return repository.save(cliente);
    }

    public List<Cliente> listarClientes() {
        return repository.findAll();
    }

    public Optional<Cliente> buscarUsuarioPorId(Long id) {
        return repository.findById(id);
    }

    public boolean atualizarCliente(Long id, Cliente dadosAtualizados) {
        return repository.findById(id).map(cliente -> {
            dadosAtualizados.setId(cliente.getId());
            repository.save(dadosAtualizados);
            return true;
        }).orElse(false);
    }

    public boolean deletarCliente(Long id) {
        return repository.findById(id).map(cliente -> {
            repository.delete(cliente);
            return true;
        }).orElse(false);
    }
}

