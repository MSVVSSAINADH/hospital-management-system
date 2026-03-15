package com.example.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import com.example.demo.filter.JwtRequestFilter;

@Configuration
@EnableWebSecurity
@org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity // ✅ Enables @PreAuthorize
public class SecurityConfig {

    @Value("${app.cors.allowedOrigins}")
    private String[] allowedOrigins;

    @Autowired
    private JwtRequestFilter jwtRequestFilter;

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public org.springframework.security.crypto.password.PasswordEncoder passwordEncoder() {
        return new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource())) // Enable CORS
            .csrf(csrf -> csrf.disable()) // Disable CSRF for testing
            .authorizeHttpRequests(auth -> auth
                // 1. CRITICAL: Allow "Pre-flight" OPTIONS checks from the browser
                .requestMatchers(new AntPathRequestMatcher("/**", "OPTIONS")).permitAll()
                
                // 2. Allow Public Endpoints (Login/Register/Doctor Viewing)
                .requestMatchers("/api/users/register", "/api/users/login", "/api/doctors/login").permitAll()
                .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/doctors", "/api/doctors/**").authenticated()
                .requestMatchers("/api/doctors", "/api/doctors/**").hasRole("ADMIN") // Only Admin can POST/DELETE/PATCH doctors
                .requestMatchers("/api/public/**").permitAll()
                .requestMatchers("/api/availability/blocked", "/api/contact-messages", "/api/system-config").permitAll()
                
                // 3. Role-based access for specific modules
                .requestMatchers("/api/users/all", "/api/users/all/**").hasRole("ADMIN")
                .requestMatchers(org.springframework.http.HttpMethod.DELETE, "/api/users/**").hasRole("ADMIN")
                .requestMatchers("/api/feedback", "/api/feedback/", "/api/feedback/**").authenticated()
                .requestMatchers("/api/bookings/by-doctor/**").hasAnyRole("ADMIN", "DOCTOR", "USER")
                .requestMatchers("/api/bookings/**").authenticated()
                .requestMatchers("/api/doctor/dashboard/**").hasAnyRole("DOCTOR", "ADMIN")
                .requestMatchers("/api/availability/**").hasAnyRole("DOCTOR", "ADMIN")
                .requestMatchers("/api/prescriptions/**").authenticated()
                
                // 4. Fallback: everything else MUST be authenticated.
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        // Add the JWT filter before standard authentication filter
        http.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // 1. Allow Frontend (Values injected from application.properties)
        configuration.setAllowedOrigins(Arrays.asList(allowedOrigins));
        
        // 2. Allow Methods
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")); // ✅ Added PATCH
        
        // 3. Allow All Headers (Simpler for troubleshooting)
        configuration.setAllowedHeaders(Arrays.asList("*"));
        
        // 4. Allow Credentials
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}