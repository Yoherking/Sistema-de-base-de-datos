package com.example.tienda_repuestos.repository;

import com.example.tienda_repuestos.entity.Compatibilidad;
import com.example.tienda_repuestos.entity.CompatibilidadId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CompatibilidadRepository extends JpaRepository<Compatibilidad, CompatibilidadId> {
}
