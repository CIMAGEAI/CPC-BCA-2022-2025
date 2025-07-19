package com.example.myapplication;

/**
 * DonationHistoryModel.java
 * A simple model class to represent a single donation record.
 * This can be expanded with more details like quantity, date, etc., if your database supports it.
 */
public class DonationHistoryModel {
    private String date;
    private String bloodGroup;
    private String location;

    public DonationHistoryModel(String date, String bloodGroup, String location) {
        this.date = date;
        this.bloodGroup = bloodGroup;
        this.location = location;
    }

    public String getDate() {
        return date;
    }

    public String getBloodGroup() {
        return bloodGroup;
    }

    public String getLocation() {
        return location;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public void setBloodGroup(String bloodGroup) {
        this.bloodGroup = bloodGroup;
    }

    public void setLocation(String location) {
        this.location = location;
    }
}
