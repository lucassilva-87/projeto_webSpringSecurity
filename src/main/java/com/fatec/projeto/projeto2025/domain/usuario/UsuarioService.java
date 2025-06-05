package com.fatec.projeto.projeto2025.domain.usuario;

import com.fatec.projeto.projeto2025.entities.Usuario;
import com.fatec.projeto.projeto2025.exception.RecursoNaoEncontradoException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public Usuario salvar(Usuario usuario) {
        Usuario usuarioExiste = usuarioRepository.findByNome(usuario.getNome());
        if (usuarioExiste != null) {
            throw new IllegalArgumentException("Usuario já existe.");
        }

        usuario.setId(null);
        return usuarioRepository.save(usuario);
    }

    public Usuario criarUsuario(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    public List<Usuario> listarTodos() {
        return usuarioRepository.findAll();
    }

    public Usuario buscarPorId(Long id) {

        return usuarioRepository.findById(id)
            .orElseThrow(() -> new RecursoNaoEncontradoException("Usuário com ID " + id + " não encontrado"));

    }

    public Usuario atualizar(Long id, Usuario novoUsuario) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Usuário não encontrado"));

        usuario.setNome(novoUsuario.getNome());
        usuario.setEmail(novoUsuario.getEmail());
        usuario.setSenha(novoUsuario.getSenha());

        return usuarioRepository.save(usuario);
    }

    public void deletar(Long id) {
        usuarioRepository.deleteById(id);
    }
}
