package com.example.demo.service;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private com.example.demo.repository.DoctorRepository doctorRepository;

    @Override
    public UserDetails loadUserByUsername(String identifier) throws UsernameNotFoundException {
        // 1. Try to find in UserRepository (Email or Username)
        java.util.Optional<User> userOpt = userRepository.findByEmail(identifier);
        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByUsername(identifier);
        }

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            List<GrantedAuthority> authorities = new ArrayList<>();
            if (user.getRole() != null && !user.getRole().isEmpty()) {
                authorities.add(new SimpleGrantedAuthority("ROLE_" + user.getRole().toUpperCase()));
            }
            return new org.springframework.security.core.userdetails.User(
                    user.getUsername(), // Use username as the primary identification
                    user.getPassword(),
                    authorities
            );
        }

        // 2. Try to find in DoctorRepository (Email or Username)
        java.util.Optional<com.example.demo.entity.Doctor> doctorOpt = doctorRepository.findByEmail(identifier);
        if (doctorOpt.isEmpty()) {
            doctorOpt = doctorRepository.findByUsername(identifier);
        }

        if (doctorOpt.isPresent()) {
            com.example.demo.entity.Doctor doctor = doctorOpt.get();
            List<GrantedAuthority> authorities = new ArrayList<>();
            authorities.add(new SimpleGrantedAuthority("ROLE_DOCTOR"));
            return new org.springframework.security.core.userdetails.User(
                    doctor.getUsername(), // Use username as the primary identification
                    doctor.getPassword(),
                    authorities
            );
        }

        throw new UsernameNotFoundException("User or Doctor not found with identifier: " + identifier);
    }
}
