package com.example.demo.request;

public class SignupRequest {
    private String fullName;
    private String email;
    private String password;
    private String mobile;
    private String address;
    private String role; // 👈 New field (user or doctor)

    public SignupRequest() {}

    public SignupRequest(String fullName, String email, String password, String mobile, String address, String role) {
        this.fullName = fullName;
        this.email = email;
        this.password = password;
        this.mobile = mobile;
        this.address = address;
        this.role = role;
    }

    // Getters and Setters
    public String getFullName() {
        return fullName;
    }
    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }

    public String getMobile() {
        return mobile;
    }
    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public String getAddress() {
        return address;
    }
    public void setAddress(String address) {
        this.address = address;
    }

    public String getRole() {
        return role;
    }
    public void setRole(String role) {
        this.role = role;
    }
}
