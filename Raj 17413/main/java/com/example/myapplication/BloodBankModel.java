package com.example.myapplication;

public class BloodBankModel {
    private String name;
    private String address;
    private String contact;

    public BloodBankModel(String name, String address, String contact) {
        this.name = name;
        this.address = address;
        this.contact = contact;
    }

    public String getName() {
        return name;
    }

    public String getAddress() {
        return address;
    }

    public String getContact() {
        return contact;
    }
}
