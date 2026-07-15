package com.javuar.shop.config.aws;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "aws")
@Getter
@Setter
public class AwsProperties {
    private String region;
    private String accessKeyId;
    private String secretAccessKey;
    private S3 s3;
    private CloudFormation cloudFormation;

    @Getter
    @Setter
    public static class S3 {
        private String baseUrl;
        private String bucketName;
    }

    @Getter
    @Setter
    public static class CloudFormation {
        private String apiEndpoint;
    }
}