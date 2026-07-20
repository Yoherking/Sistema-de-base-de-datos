package com.example.tienda_repuestos.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;

@Entity
@Table(name = "compatibilidad")
@IdClass(CompatibilidadId.class)
public class Compatibilidad {

    @Id
    @Column(name = "id_repuesto")
    private Integer idRepuesto;

    @Id
    @Column(name = "id_vehiculo")
    private Integer idVehiculo;

    public Compatibilidad() {}

    public Integer getIdRepuesto() { return idRepuesto; }
    public void setIdRepuesto(Integer idRepuesto) { this.idRepuesto = idRepuesto; }
    public Integer getIdVehiculo() { return idVehiculo; }
    public void setIdVehiculo(Integer idVehiculo) { this.idVehiculo = idVehiculo; }
}
