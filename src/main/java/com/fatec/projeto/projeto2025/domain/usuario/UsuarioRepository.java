package com.fatec.projeto.projeto2025.domain.usuario;

import com.fatec.projeto.projeto2025.entities.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Usuario findByNome(String nome);
}
