package com.sportsperformance.batch2.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
//import org.springframework.data.annotation.Id;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class Meet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long meetId;
    private String meetName;
}
