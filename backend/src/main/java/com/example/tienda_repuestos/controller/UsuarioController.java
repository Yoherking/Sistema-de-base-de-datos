package com.example.tienda_repuestos.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.example.tienda_repuestos.entity.Usuario;
import com.example.tienda_repuestos.repository.UsuarioRepository;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    private final UsuarioRepository repositorio;

    public UsuarioController(UsuarioRepository repositorio) {
        this.repositorio = repositorio;
    }

    @GetMapping
    public List<Usuario> listar() {
        return repositorio.findAll();
    }

    @PostMapping
    public Usuario crear(@RequestBody Usuario usuario) {
        return repositorio.save(usuario);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> credenciales) {
        String username = credenciales.get("username");
        String password = credenciales.get("password");

        if (username == null || password == null || username.isBlank() || password.isBlank()) {
            Map<String, Object> body = new HashMap<>();
            body.put("success", false);
            body.put("message", "Usuario y contraseña son obligatorios");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
        }

        return repositorio.findByUsernameAndPassword(username, password)
                .map(usuario -> {
                    Map<String, Object> body = new HashMap<>();
                    body.put("success", true);
                    body.put("message", "Inicio de sesión correcto");
                    body.put("rol", usuario.getRol());
                    return ResponseEntity.ok(body);
                })
                .orElseGet(() -> {
                    Map<String, Object> body = new HashMap<>();
                    body.put("success", false);
                    body.put("message", "Credenciales inválidas");
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(body);
                });
    }

    @PostMapping("/register")
    public Usuario registrar(@RequestBody Usuario usuario) {
        if (repositorio.findByUsername(usuario.getUsername()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "El usuario ya existe");
        }
        return repositorio.save(usuario);
    }
}
