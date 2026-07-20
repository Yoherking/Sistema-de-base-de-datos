package com.example.tienda_repuestos.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.example.tienda_repuestos.entity.Venta;
import com.example.tienda_repuestos.repository.VentaRepository;

@RestController
@RequestMapping("/api/ventas")
@CrossOrigin(origins = "*")
public class VentaController {

    private final VentaRepository repositorio;

    public VentaController(VentaRepository repositorio) {
        this.repositorio = repositorio;
    }

    @GetMapping
    public List<Venta> listar() {
        return repositorio.findAll();
    }

    @GetMapping("/{id}")
    public Venta obtenerPorId(@PathVariable Integer id) {
        return repositorio.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Venta no encontrada"));
    }

    @PostMapping
    public Venta crear(@RequestBody Venta venta) {
        return repositorio.save(venta);
    }

    @PutMapping("/{id}")
    public Venta actualizar(@PathVariable Integer id, @RequestBody Venta venta) {
        Venta existente = repositorio.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Venta no encontrada"));
        existente.setIdPedido(venta.getIdPedido());
        existente.setFechaVenta(venta.getFechaVenta());
        existente.setMetodoPago(venta.getMetodoPago());
        existente.setMontoTotal(venta.getMontoTotal());
        return repositorio.save(existente);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        if (!repositorio.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Venta no encontrada");
        }
        repositorio.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
