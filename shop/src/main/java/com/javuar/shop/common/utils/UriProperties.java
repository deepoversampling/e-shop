package com.javuar.shop.common.utils;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@Getter
public class UriProperties {
    @Value("${application.backend-base-url}")
    private String backendBaseURL;
    @Value("${server.servlet.context-path}")
    private String contextPath;
}