package com.example.tienda_repuestos.controller;

import com.example.tienda_repuestos.entity.Pedido;
import com.example.tienda_repuestos.repository.PedidoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/pedidos")
@CrossOrigin(origins = "*")
public class PedidoController {

    private final PedidoRepository repositorio;

    public PedidoController(PedidoRepository repositorio) {
        this.repositorio = repositorio;
    }

    @GetMapping
    public List<Pedido> listar() {
        return repositorio.findAll();
    }

    @GetMapping("/{id}")
    public Pedido obtenerPorId(@PathVariable Integer id) {
        return repositorio.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pedido no encontrado"));
    }

    @PostMapping
    public Pedido crear(@RequestBody Pedido pedido) {
        return repositorio.save(pedido);
    }

    @PutMapping("/{id}")
    public Pedido actualizar(@PathVariable Integer id, @RequestBody Pedido pedido) {
        Pedido existente = repositorio.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pedido no encontrado"));
        existente.setIdCliente(pedido.getIdCliente());
        existente.setIdVehiculo(pedido.getIdVehiculo());
        existente.setFechaPedido(pedido.getFechaPedido());
        return repositorio.save(existente);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        if (!repositorio.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Pedido no encontrado");
        }
        repositorio.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
