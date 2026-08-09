package com.javuar.shop.security;

import com.javuar.shop.inteceptor.UserSynchronizerFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.oauth2.server.resource.web.authentication.BearerTokenAuthenticationFilter;
import org.springframework.security.web.SecurityFilterChain;

import static org.springframework.security.config.http.SessionCreationPolicy.STATELESS;

@Configuration
@EnableWebSecurity
public class Security {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http,
                                                   UserSynchronizerFilter userSynchronizerFilter) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests((authorize) -> authorize
                        // ADMIN
                        .requestMatchers(HttpMethod.GET, "/categories", "/categories/*").permitAll()
                        .requestMatchers(HttpMethod.POST, "/categories").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/categories/*").hasRole("ADMIN")

                        .requestMatchers(HttpMethod.GET, "/properties", "/properties/*").permitAll()
                        .requestMatchers(HttpMethod.POST, "/properties").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/properties/*").hasRole("ADMIN")

                        .requestMatchers(HttpMethod.GET, "/category-templates", "/category-templates/*", "/category-templates/category/*").permitAll()
                        .requestMatchers(HttpMethod.POST, "/category-templates").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/category-templates/*").hasRole("ADMIN")

                        // USER
                        .requestMatchers(HttpMethod.GET, "/products", "/products/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/products/search").permitAll()
                        .requestMatchers(HttpMethod.GET, "/products/owner").hasRole("USER")
                        .requestMatchers(HttpMethod.POST, "/products/**").hasRole("USER")
                        .requestMatchers(HttpMethod.DELETE, "/products/**").hasRole("USER")

                        .requestMatchers(HttpMethod.GET, "/carts", "/carts/*").hasRole("USER")
                        .requestMatchers(HttpMethod.POST, "/carts/**").hasRole("USER")
                        .requestMatchers(HttpMethod.DELETE, "/carts/**").hasRole("USER")
                        .requestMatchers(HttpMethod.PATCH, "/carts/**").hasRole("USER")

                        .requestMatchers(HttpMethod.GET, "/feedbacks").permitAll()
                        .requestMatchers(HttpMethod.GET, "/feedbacks/**").hasRole("USER")
                        .requestMatchers(HttpMethod.POST, "/feedbacks").hasRole("USER")

                        // Stripe
                        .requestMatchers(HttpMethod.POST, "/payments/**").hasRole("USER")
                        .requestMatchers(HttpMethod.POST, "/webhook").permitAll()

                        // Swagger
                        .requestMatchers(
                                "/v3/api-docs",
                                "/v3/api-docs/**",
                                "/swagger-resources",
                                "/swagger-resources/**",
                                "/configuration/ui",
                                "/configuration/security",
                                "/swagger-ui/**",
                                "/webjars/**",
                                "/swagger-ui.html")
                        .permitAll()
                        .anyRequest()
                        .authenticated()
                )
                .sessionManagement((session) -> session.sessionCreationPolicy(STATELESS))
                .addFilterAfter(userSynchronizerFilter, BearerTokenAuthenticationFilter.class)
                .oauth2ResourceServer((oauth2) -> oauth2
                        .jwt((jwt) -> jwt
                                .jwtAuthenticationConverter(new KeycloakJwtAuthenticationConverter())
                        ));

        return http.build();
    }
}