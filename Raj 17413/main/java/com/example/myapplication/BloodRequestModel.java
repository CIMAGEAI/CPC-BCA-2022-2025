package com.example.myapplication;

/**
 * BloodRequestModel.java
 * This class represents a Blood Request object with properties like name, phone, blood group, city, and reason.
 * It is used to store and retrieve blood request details from the database.
 */
public class BloodRequestModel {
    private String name;
    private String phone;
    private String bloodGroup;
    private String city;
    private String reason;

    public BloodRequestModel(String name, String phone, String bloodGroup, String city, String reason) {
        this.name = name;
        this.phone = phone;
        this.bloodGroup = bloodGroup;
        this.city = city;
        this.reason = reason;
    }

    // Getters
    public String getName() {
        return name;
    }

    public String getPhone() {
        return phone;
    }

    public String getBloodGroup() {
        return bloodGroup;
    }

    public String getCity() {
        return city;
    }

    public String getReason() {
        return reason;
    }

    // Setters (if needed)
    public void setName(String name) {
        this.name = name;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public void setBloodGroup(String bloodGroup) {
        this.bloodGroup = bloodGroup;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}
