
package com.example.demo.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

import com.example.demo.filter.JwtRequestFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Value("${app.cors.allowedOrigins}")
    private String[] allowedOrigins;

    @Autowired
    private JwtRequestFilter jwtRequestFilter;

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth

                // Allow the root endpoint without authentication
                .requestMatchers(HttpMethod.GET, "/").permitAll()

                // Allow browser preflight requests
                .requestMatchers(new AntPathRequestMatcher("/**", "OPTIONS")).permitAll()

                // Public authentication endpoints
                .requestMatchers(
                    "/api/users/register",
                    "/api/users/login",
                    "/api/doctors/login"
                ).permitAll()

                // Doctor endpoints
                .requestMatchers(HttpMethod.GET, "/api/doctors", "/api/doctors/**")
                    .authenticated()
                .requestMatchers("/api/doctors", "/api/doctors/**")
                    .hasRole("ADMIN")

                // Public API endpoints
                .requestMatchers("/api/public/**").permitAll()
                .requestMatchers(
                    "/api/availability/blocked",
                    "/api/contact-messages",
                    "/api/system-config"
                ).permitAll()

                // Role-based access control
                .requestMatchers("/api/users/all", "/api/users/all/**")
                    .hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/users/**")
                    .hasRole("ADMIN")
                .requestMatchers("/api/feedback", "/api/feedback/", "/api/feedback/**")
                    .authenticated()
                .requestMatchers("/api/bookings/by-doctor/**")
                    .hasAnyRole("ADMIN", "DOCTOR", "USER")
                .requestMatchers("/api/bookings/**")
                    .authenticated()
                .requestMatchers("/api/doctor/dashboard/**")
                    .hasAnyRole("DOCTOR", "ADMIN")
                .requestMatchers("/api/availability/**")
                    .hasAnyRole("DOCTOR", "ADMIN")
                .requestMatchers("/api/prescriptions/**")
                    .authenticated()

                // All remaining requests require authentication
                .anyRequest().authenticated()
            )
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            );

        // Add JWT authentication filter
        http.addFilterBefore(
            jwtRequestFilter,
            UsernamePasswordAuthenticationFilter.class
        );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(Arrays.asList(allowedOrigins));
        configuration.setAllowedMethods(
            Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
        );
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
            new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}
