package com.example.tienda_repuestos;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import com.example.tienda_repuestos.entity.Usuario;
import com.example.tienda_repuestos.repository.UsuarioRepository;

@SpringBootApplication
public class TiendaRepuestosApplication {
    public static void main(String[] args) {
        SpringApplication.run(TiendaRepuestosApplication.class, args);
    }

    @Bean
    CommandLineRunner initUsers(UsuarioRepository usuarioRepository) {
        return args -> {
            if (usuarioRepository.findByUsername("admin").isEmpty()) {
                Usuario admin = new Usuario();
                admin.setUsername("admin");
                admin.setPassword("admin123");
                admin.setRol("ADMIN");
                usuarioRepository.save(admin);
            }
        };
    }
}
