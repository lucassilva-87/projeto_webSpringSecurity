package com.fatec.projeto.projeto2025.security;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    @Autowired
    private JwtFiltro jwtFiltro;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
        .csrf(csrf -> csrf.disable())
        .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .authorizeHttpRequests(authz -> authz
            // liberar só login e API de autenticação
            .requestMatchers("/auth/login", "/login", "/login.html", "/", "/index.html", "/indexCliente.html", "/cadastro_cliente.html", "/acessar_cliente.html").permitAll()
            .requestMatchers("/styles.css", "/script.js", "/images/**", "/favicon.ico", "/maicosoft_logo.jpg", "/clientes", "/h2-console", "/clientes/**").permitAll()
            .requestMatchers("/acessar_usuario.html", "/cadastro_usuario.html", "/indexUsuario.html", "/scriptUser.js", "/api/usuarios/**").permitAll()
            // tudo o resto precisa estar autenticado via token
            .anyRequest().authenticated()
        );

    // seu filtro JWT deve estar registrado aqui, antes do UsernamePasswordAuthenticationFilter
    http.addFilterBefore(jwtFiltro, UsernamePasswordAuthenticationFilter.class);

    return http.build();
}

}
