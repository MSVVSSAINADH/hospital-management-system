package com.example.demo.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "system_config")
public class SystemConfig {

    @Id
    private String configKey;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String configValue;

    public SystemConfig() {}
    public SystemConfig(String key, String value) {
        this.configKey = key;
        this.configValue = value;
    }

    // Getters and Setters
    public String getConfigKey() { return configKey; }
    public void setConfigKey(String configKey) { this.configKey = configKey; }
    public String getConfigValue() { return configValue; }
    public void setConfigValue(String configValue) { this.configValue = configValue; }
}
