package com.example.myapplication; // <--- ENSURE THIS LINE IS EXACTLY AS SHOWN, NO TYPOS, NO EXTRA SPACES

/**
 * UserModel.java
 * This class represents a User object with properties like email, phone, blood group, city, latitude, and longitude.
 * It is used to store and retrieve user details from the database.
 */
public class UserModel {
    private String email;
    private String phone;
    private String bloodGroup;
    private String password; // Note: Password should ideally not be stored directly in a UserModel for display purposes.
    private String city;
    private double latitude;
    private double longitude;

    // Constructor for user details without password (e.g., for displaying donors)
    public UserModel(String email, String phone, String bloodGroup, String city) {
        this.email = email;
        this.phone = phone;
        this.bloodGroup = bloodGroup;
        this.city = city;
    }

    // Constructor for full user details (e.g., during registration or profile update)
    public UserModel(String email, String phone, String bloodGroup, String password, String city) {
        this.email = email;
        this.phone = phone;
        this.bloodGroup = bloodGroup;
        this.password = password;
        this.city = city;
    }

    // Getters
    public String getEmail() {
        return email;
    }

    public String getPhone() {
        return phone;
    }

    public String getBloodGroup() {
        return bloodGroup;
    }

    public String getPassword() {
        return password;
    }

    public String getCity() {
        return city;
    }

    public double getLatitude() {
        return latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    // Setters (if needed for updating individual fields)
    public void setEmail(String email) {
        this.email = email;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public void setBloodGroup(String bloodGroup) {
        this.bloodGroup = bloodGroup;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }
}
