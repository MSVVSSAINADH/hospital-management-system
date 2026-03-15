package com.example.demo.controller;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.request.LoginRequest;
import com.example.demo.request.SignupRequest;
import com.example.demo.request.UpdateUserRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")

public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @Autowired
    private org.springframework.security.authentication.AuthenticationManager authenticationManager;

    @Autowired
    private com.example.demo.utils.JwtUtil jwtUtil;

    // ✅ Register endpoint
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody SignupRequest signupRequest) {

        if (userRepository.existsByEmail(signupRequest.getEmail())) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("{\"message\": \"Email already in use\"}");
        }

        if (userRepository.existsByUsername(signupRequest.getFullName())) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("{\"message\": \"Username already in use\"}");
        }

        User user = new User();
        user.setUsername(signupRequest.getFullName());
        user.setEmail(signupRequest.getEmail());
        // Hash the password before saving
        user.setPassword(passwordEncoder.encode(signupRequest.getPassword()));
        user.setRole(signupRequest.getRole());
        user.setStatus("Offline");
        user.setZone("N/A");
        user.setMobile(signupRequest.getMobile());
        user.setAddress(signupRequest.getAddress());

        userRepository.save(user);
        return ResponseEntity.ok("{\"message\": \"Registration successful\"}");
    }

    // ✅ Login endpoint
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
        try {
            authenticationManager.authenticate(
                    new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(), loginRequest.getPassword()
                    )
            );
        } catch (org.springframework.security.core.AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("{\"message\": \"Invalid credentials\"}");
        }

        Optional<User> optionalUser = userRepository.findByEmail(loginRequest.getEmail());
        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("{\"message\": \"User not found\"}");
        }

        User user = optionalUser.get();
        user.setStatus("Online");
        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        // Generate JWT Token
        final String jwt = jwtUtil.generateToken(user.getUsername(), user.getRole(), user.getId());

        // Return user data along with the token
        java.util.Map<String, Object> responseData = new java.util.HashMap<>();
        responseData.put("token", jwt);
        responseData.put("user", user);

        return ResponseEntity.ok(responseData);
    }

    // ✅ Logout endpoint
    @PostMapping("/logout")
    public ResponseEntity<?> logoutUser(@RequestParam String email) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("{\"message\": \"User not found\"}");
        }
        User user = optionalUser.get();
        user.setStatus("Offline");
        userRepository.save(user);
        return ResponseEntity.ok("{\"message\": \"Logged out successfully\"}");
    }

    // ✅ Get user by ID
    @GetMapping("/{id}")
    public ResponseEntity<Object> getUserById(@PathVariable Long id) {
        Optional<User> user = userRepository.findById(id);
        return user.<ResponseEntity<Object>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("{\"message\": \"User not found\"}"));
    }

    // ✅ Get user by email

    // ✅ Update user (profile + optional password)
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody UpdateUserRequest request, org.springframework.security.core.Authentication authentication) {
        // ✅ IDOR Protection: Users can only update their own profile
        String currentUsername = authentication.getName();
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        
        if (!isAdmin) {
            java.util.Optional<com.example.demo.entity.User> currentUser = userRepository.findByUsername(currentUsername);
            if (currentUser.isEmpty() || !currentUser.get().getId().equals(id)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("{\"message\": \"Access denied: You can only update your own profile.\"}");
            }
        }

        Optional<User> optionalUser = userRepository.findById(id);

        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("{\"message\": \"User not found\"}");
        }

        User existingUser = optionalUser.get();

        // ✅ Check if new email is already taken by someone else
        if (request.getEmail() != null && !request.getEmail().equals(existingUser.getEmail())) {
            if (userRepository.existsByEmail(request.getEmail())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("{\"message\": \"Email already in use\"}");
            }
            existingUser.setEmail(request.getEmail());
        }

        // ✅ Check if new username is already taken by someone else
        if (request.getUsername() != null && !request.getUsername().equals(existingUser.getUsername())) {
            if (userRepository.existsByUsername(request.getUsername())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("{\"message\": \"Username already in use\"}");
            }
            existingUser.setUsername(request.getUsername());
        }

        // Update other fields only if provided
        if (request.getMobile() != null) existingUser.setMobile(request.getMobile());
        if (request.getAddress() != null) existingUser.setAddress(request.getAddress());
        if (request.getZone() != null) existingUser.setZone(request.getZone());
        if (request.getStatus() != null) existingUser.setStatus(request.getStatus());

        // Handle password update if provided
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            if (request.getCurrentPassword() == null || 
                !passwordEncoder.matches(request.getCurrentPassword(), existingUser.getPassword())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("{\"message\": \"Current password is incorrect\"}");
            }
            existingUser.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        User savedUser = userRepository.save(existingUser);
        return ResponseEntity.ok(savedUser);
    }

    // ✅ Get all users
    @GetMapping("/all")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(users);
    }

    // ✅ Delete user
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        if (!userRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("{\"message\": \"User not found\"}");
        }

        userRepository.deleteById(id);
        return ResponseEntity.ok("{\"message\": \"User deleted successfully\"}");
    }
}
