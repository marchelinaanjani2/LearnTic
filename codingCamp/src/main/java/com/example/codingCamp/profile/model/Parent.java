package com.example.codingCamp.profile.model;

import java.util.List;

import com.example.codingCamp.profile.model.Student;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@DiscriminatorValue("PARENT")
public class Parent extends UserModel {

    @OneToMany(mappedBy = "orangTua", fetch = FetchType.EAGER)
    private List<Student> anak;

}