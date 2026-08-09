package com.javuar.shop.user;

import com.javuar.shop.common.auditing.BaseEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "_user")
public class User extends BaseEntity {

    @Id
    private String id;

    private String firstName;
    private String lastName;
    private String email;

    @Transient
    public String fullName() {
        return firstName + " " + lastName;
    }
}