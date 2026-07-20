package com.example.tienda_repuestos.controller;

import com.example.tienda_repuestos.entity.Vehiculo;
import com.example.tienda_repuestos.repository.VehiculoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/vehiculos")
@CrossOrigin(origins = "*")
public class VehiculoController {

    private final VehiculoRepository repositorio;

    public VehiculoController(VehiculoRepository repositorio) {
        this.repositorio = repositorio;
    }

    @GetMapping
    public List<Vehiculo> listar() {
        return repositorio.findAll();
    }

    @GetMapping("/{id}")
    public Vehiculo obtenerPorId(@PathVariable Integer id) {
        return repositorio.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Vehículo no encontrado"));
    }

    @PostMapping
    public Vehiculo crear(@RequestBody Vehiculo vehiculo) {
        return repositorio.save(vehiculo);
    }

    @PutMapping("/{id}")
    public Vehiculo actualizar(@PathVariable Integer id, @RequestBody Vehiculo vehiculo) {
        Vehiculo existente = repositorio.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Vehículo no encontrado"));
        existente.setMarca(vehiculo.getMarca());
        existente.setModelo(vehiculo.getModelo());
        return repositorio.save(existente);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        if (!repositorio.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Vehículo no encontrado");
        }
        repositorio.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
