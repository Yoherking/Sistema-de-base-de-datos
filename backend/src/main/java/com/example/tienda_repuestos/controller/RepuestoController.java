package com.example.tienda_repuestos.controller;

import com.example.tienda_repuestos.entity.Repuesto;
import com.example.tienda_repuestos.repository.RepuestoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/repuestos")
@CrossOrigin(origins = "*")
public class RepuestoController {

    private final RepuestoRepository repositorio;

    public RepuestoController(RepuestoRepository repositorio) {
        this.repositorio = repositorio;
    }

    @GetMapping
    public List<Repuesto> listar() {
        return repositorio.findAll();
    }

    @GetMapping("/{id}")
    public Repuesto obtenerPorId(@PathVariable Integer id) {
        return repositorio.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Repuesto no encontrado"));
    }

    @PostMapping
    public Repuesto crear(@RequestBody Repuesto repuesto) {
        return repositorio.save(repuesto);
    }

    @PutMapping("/{id}")
    public Repuesto actualizar(@PathVariable Integer id, @RequestBody Repuesto repuesto) {
        Repuesto existente = repositorio.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Repuesto no encontrado"));

        existente.setNombre(repuesto.getNombre());
        existente.setCodigoParte(repuesto.getCodigoParte());
        existente.setPrecio(repuesto.getPrecio());
        existente.setStock(repuesto.getStock());

        return repositorio.save(existente);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        if (!repositorio.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Repuesto no encontrado");
        }
        repositorio.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
