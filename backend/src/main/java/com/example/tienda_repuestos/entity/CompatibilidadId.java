package com.example.tienda_repuestos.entity;

import java.io.Serializable;
import java.util.Objects;

public class CompatibilidadId implements Serializable {
    private Integer idRepuesto;
    private Integer idVehiculo;

    public CompatibilidadId() {}

    public CompatibilidadId(Integer idRepuesto, Integer idVehiculo) {
        this.idRepuesto = idRepuesto;
        this.idVehiculo = idVehiculo;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof CompatibilidadId that)) return false;
        return Objects.equals(idRepuesto, that.idRepuesto) && Objects.equals(idVehiculo, that.idVehiculo);
    }

    @Override
    public int hashCode() {
        return Objects.hash(idRepuesto, idVehiculo);
    }
}
