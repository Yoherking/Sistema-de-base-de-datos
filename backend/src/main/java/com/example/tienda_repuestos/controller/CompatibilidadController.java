package com.example.tienda_repuestos.controller;

import com.example.tienda_repuestos.entity.Compatibilidad;
import com.example.tienda_repuestos.entity.CompatibilidadId;
import com.example.tienda_repuestos.repository.CompatibilidadRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/compatibilidad")
@CrossOrigin(origins = "*")
public class CompatibilidadController {

    private final CompatibilidadRepository repositorio;

    public CompatibilidadController(CompatibilidadRepository repositorio) {
        this.repositorio = repositorio;
    }

    @GetMapping
    public List<Compatibilidad> listar() {
        return repositorio.findAll();
    }

    @PostMapping
    public Compatibilidad crear(@RequestBody Compatibilidad compatibilidad) {
        return repositorio.save(compatibilidad);
    }

    @PutMapping("/{idRepuesto}/{idVehiculo}")
    public Compatibilidad actualizar(@PathVariable Integer idRepuesto, @PathVariable Integer idVehiculo, @RequestBody Compatibilidad compatibilidad) {
        CompatibilidadId id = new CompatibilidadId(idRepuesto, idVehiculo);
        Compatibilidad existente = repositorio.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Compatibilidad no encontrada"));
        existente.setIdRepuesto(compatibilidad.getIdRepuesto());
        existente.setIdVehiculo(compatibilidad.getIdVehiculo());
        return repositorio.save(existente);
    }

    @DeleteMapping("/{idRepuesto}/{idVehiculo}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer idRepuesto, @PathVariable Integer idVehiculo) {
        CompatibilidadId id = new CompatibilidadId(idRepuesto, idVehiculo);
        if (!repositorio.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Compatibilidad no encontrada");
        }
        repositorio.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
