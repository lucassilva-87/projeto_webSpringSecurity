package com.fatec.projeto.projeto2025.controllers;

import com.fatec.projeto.projeto2025.domain.cliente.ClienteService;
import com.fatec.projeto.projeto2025.entities.Cliente;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/clientes")
public class ClienteController {

    @Autowired
    private ClienteService clienteService;



    @PostMapping
    public ResponseEntity<Cliente> criarCliente(@RequestBody Cliente cliente) {
        Cliente novo = clienteService.criarCliente(cliente);
        return new ResponseEntity<>(novo, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Cliente>> listarClientes() {
        return new ResponseEntity<>(clienteService.listarClientes(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable Long id) {
        Optional<Cliente> cliente = clienteService.buscarUsuarioPorId(id);
        return cliente.<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("Cliente com ID " + id + " não encontrado."));
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> atualizar(@PathVariable Long id, @RequestBody Cliente clienteAtualizado) {
        boolean ok = clienteService.atualizarCliente(id, clienteAtualizado);
        return ok ?
            ResponseEntity.ok("Atualizado com sucesso!") :
            ResponseEntity.status(HttpStatus.NOT_FOUND).body("Cliente com ID " + id + " não encontrado.");
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletar(@PathVariable Long id) {
        boolean ok = clienteService.deletarCliente(id);
        return ok ?
            ResponseEntity.ok("Excluído com sucesso!") :
            ResponseEntity.status(HttpStatus.NOT_FOUND).body("Cliente com ID " + id + " não encontrado.");
    }

}

