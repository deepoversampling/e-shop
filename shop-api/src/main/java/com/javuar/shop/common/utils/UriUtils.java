package com.javuar.shop.common.utils;

import lombok.experimental.UtilityClass;

import java.net.URI;
import java.util.Arrays;
import java.util.stream.Collectors;

@UtilityClass
public class UriUtils {

    public URI createUri(UriProperties uriProperties, Object... resourcePathSegments) {
        String resourcePath = Arrays.stream(resourcePathSegments)
                .map(Object::toString)
                .collect(Collectors.joining("/"));

        // Context path is already wrapped in slashes -> /api/v1/
        return URI.create(uriProperties.getBackendBaseURL() + uriProperties.getContextPath() + resourcePath);
    }
}