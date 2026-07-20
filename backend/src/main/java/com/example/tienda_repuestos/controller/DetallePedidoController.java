package com.example.tienda_repuestos.controller;

import com.example.tienda_repuestos.entity.DetallePedido;
import com.example.tienda_repuestos.repository.DetallePedidoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/detalle-pedido")
@CrossOrigin(origins = "*")
public class DetallePedidoController {

    private final DetallePedidoRepository repositorio;

    public DetallePedidoController(DetallePedidoRepository repositorio) {
        this.repositorio = repositorio;
    }

    @GetMapping
    public List<DetallePedido> listar() {
        return repositorio.findAll();
    }

    @GetMapping("/{id}")
    public DetallePedido obtenerPorId(@PathVariable Integer id) {
        return repositorio.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Detalle de pedido no encontrado"));
    }

    @PostMapping
    public DetallePedido crear(@RequestBody DetallePedido detallePedido) {
        return repositorio.save(detallePedido);
    }

    @PutMapping("/{id}")
    public DetallePedido actualizar(@PathVariable Integer id, @RequestBody DetallePedido detallePedido) {
        DetallePedido existente = repositorio.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Detalle de pedido no encontrado"));
        existente.setIdPedido(detallePedido.getIdPedido());
        existente.setIdRepuesto(detallePedido.getIdRepuesto());
        existente.setCantidad(detallePedido.getCantidad());
        existente.setPrecioUnitario(detallePedido.getPrecioUnitario());
        return repositorio.save(existente);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        if (!repositorio.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Detalle de pedido no encontrado");
        }
        repositorio.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
