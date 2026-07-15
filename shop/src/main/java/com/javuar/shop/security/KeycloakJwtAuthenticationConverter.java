package com.javuar.shop.security;

import org.springframework.core.convert.converter.Converter;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;

import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class KeycloakJwtAuthenticationConverter implements Converter<Jwt, AbstractAuthenticationToken> {

    @Override
    public AbstractAuthenticationToken convert(@NonNull Jwt jwt) {
        Collection<GrantedAuthority> grantedAuthorities = Stream.concat(
                new JwtGrantedAuthoritiesConverter().convert(jwt).stream(),
                extractResourceRole(jwt)
        ).collect(Collectors.toSet());

        return new JwtAuthenticationToken(jwt, grantedAuthorities);
    }

    private Stream<GrantedAuthority> extractResourceRole(Jwt jwt) {
        Map<String, Object> resourceAccess = jwt.getClaim("resource_access");
        @SuppressWarnings("unchecked")
        Map<String, List<String>> eshop = (Map<String, List<String>>) resourceAccess.get("e-shop");
        @SuppressWarnings("unchecked")
        Map<String, List<String>> account = (Map<String, List<String>>) resourceAccess.get("account");

        return Stream.concat(eshop.get("roles").stream(), account.get("roles").stream())
                .map((String role) -> new SimpleGrantedAuthority("ROLE_" + role));
    }
}