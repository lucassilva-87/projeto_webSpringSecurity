package com.fatec.projeto.projeto2025.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String loja;
    private String cnpj;
    private String nome;
    private String nomeFantasia;
    private String tipo;
    private String dataAbertura;

    private String cep;
    private String logradouro;
    private String numero;
    private String complemento;
    private String bairro;
    private String municipio;
    private String estado;
    private String pais;

    private String telefone;
    private String telefone2;
    private String telefone3;
    private String email;
    private String site;

    private String inscricaoEstadual;
    private String inscricaoMunicipal;
    private String codCNAE;

    private Boolean statusToggle = false;
}
