package com.fatec.projeto.projeto2025.config;

import com.fatec.projeto.projeto2025.domain.usuario.UsuarioRepository;
import com.fatec.projeto.projeto2025.entities.Usuario;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class InicializadorDeUsuario {
    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostConstruct
    public void criarUsuarioPadrao() {
        if (usuarioRepository.count() == 0) {
            Usuario admin = new Usuario("admin", "admin@email.com", passwordEncoder.encode("1234"));
            usuarioRepository.save(admin);
            System.out.println("Usuário admin criado: nome=admin, senha=1234");
        }
    }
}