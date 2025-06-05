package com.fatec.projeto.projeto2025.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ExercicioController {
    
    @GetMapping("/")
    public String home() {
        return "redirect:/login.html";
    }
    
    @GetMapping("/login")
    public String login() {
        return "redirect:/login.html";
    }
    
    @GetMapping("/dashboard")
    public String dashboard() {
        return "redirect:/index.html";
    }
}
