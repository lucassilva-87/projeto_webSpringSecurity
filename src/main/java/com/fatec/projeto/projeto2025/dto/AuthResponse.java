package com.fatec.projeto.projeto2025.dto;

public class AuthResponse {
    private String token;
    private String type = "Bearer";
    private String username;
    private Long expiresIn;
    
    public AuthResponse() {}
    
    public AuthResponse(String token, String username) {
        this.token = token;
        this.username = username;
    }
    
    public AuthResponse(String token, String username, Long expiresIn) {
        this.token = token;
        this.username = username;
        this.expiresIn = expiresIn;
    }
    
    public String getToken() {
        return token;
    }
    
    public void setToken(String token) {
        this.token = token;
    }
    
    public String getType() {
        return type;
    }
    
    public void setType(String type) {
        this.type = type;
    }
    
    public String getUsername() {
        return username;
    }
    
    public void setUsername(String username) {
        this.username = username;
    }
    
    public Long getExpiresIn() {
        return expiresIn;
    }
    
    public void setExpiresIn(Long expiresIn) {
        this.expiresIn = expiresIn;
    }
}
