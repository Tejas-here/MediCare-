package com.medicare;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class MedicareApplication {

    public static void main(String[] args) {
        SpringApplication.run(MedicareApplication.class, args);
        System.out.println("=================================================");
        System.out.println(" MediCare+ Backend is running on port 8080!    ");
        System.out.println(" Access Frontend: http://localhost:8080/        ");
        System.out.println(" REST API Base:  http://localhost:8080/api      ");
        System.out.println(" Connected to:   MySQL Database (medicare_db)   ");
        System.out.println("=================================================");
    }
}
