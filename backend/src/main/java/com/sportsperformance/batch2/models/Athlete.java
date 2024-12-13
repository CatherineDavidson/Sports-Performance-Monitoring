package com.sportsperformance.batch2.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.Date;
import java.util.List;

//@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "athletes")
@Data
public class Athlete extends BaseUser {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long athleteId;

    @ManyToOne
    @JoinColumn(name = "coachId", insertable = false, updatable = false)
    @JsonIgnoreProperties("athletes")
    private Coach coach;

    private String firstName;
    private String lastName;
    private Date birthDate;
    private String gender;
    private float height;
    private float weight;
    private String category;
    private String photoUrl;
    @Lob
    @Column(name = "photo", columnDefinition = "LONGBLOB")
    private byte[] photo;
    @JsonIgnoreProperties({"athlete", "eventResults"})
    @OneToMany(mappedBy = "athlete")
    private List<EventResult> eventResults;

    @OneToMany(mappedBy = "athlete")
    @JsonIgnoreProperties("athlete")
    private List<Registration> registrations;

    @OneToMany(mappedBy = "athlete")
    @JsonIgnoreProperties("athlete")
    private List<DailyDiet> dailyDiets;

    @OneToOne(mappedBy = "athlete")
    @JsonIgnoreProperties("athlete")
    private AssistanceRequest assistanceRequests;

    @OneToOne(mappedBy = "athlete")
    @JsonIgnoreProperties("athlete")
    private WeightPlan weightPlan;


    // Getters and Setters

}