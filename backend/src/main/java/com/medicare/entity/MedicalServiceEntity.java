package com.medicare.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "medical_services")
public class MedicalServiceEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(name = "service_type", nullable = false, length = 100)
    private String serviceType; // "Hospital", "Medical Store", "Diagnostic Lab"

    @Column(nullable = false, length = 50)
    private String distance;

    @Column(nullable = false, length = 50)
    private String phone;

    @Column(nullable = false)
    private String address;

    @Column(nullable = false, length = 20)
    private String icon = "🏥";

    public MedicalServiceEntity() {}

    public MedicalServiceEntity(String name, String serviceType, String distance, String phone, String address, String icon) {
        this.name = name;
        this.serviceType = serviceType;
        this.distance = distance;
        this.phone = phone;
        this.address = address;
        this.icon = icon;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getServiceType() { return serviceType; }
    public void setServiceType(String serviceType) { this.serviceType = serviceType; }

    public String getDistance() { return distance; }
    public void setDistance(String distance) { this.distance = distance; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }
}
