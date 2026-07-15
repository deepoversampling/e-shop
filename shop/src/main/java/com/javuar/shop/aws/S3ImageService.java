package com.javuar.shop.aws;

import com.amazonaws.SdkClientException;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.javuar.shop.config.aws.AwsProperties;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class S3ImageService {
    private final AmazonS3 amazonS3;
    private final AwsProperties awsProperties;

    public void removeImageFromS3(String imageUrl) throws SdkClientException {
        amazonS3.deleteObject(awsProperties.getS3().getBucketName(), imageUrlToFileName(imageUrl));
    }

    public void createImageOnS3(String fileName, MultipartFile file) throws IOException, SdkClientException {
        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentLength(file.getSize());
        metadata.setContentType(file.getContentType());

        amazonS3.putObject(
                awsProperties.getS3().getBucketName(),
                fileName,
                file.getInputStream(),
                metadata
        );
    }

    //                             ApiEndpoint  /  Name
    // https://d2y2m9vdp01cgn.cloudfront.net/1769691092999_1769599819277_1768943155629_1240883.jpg
    private String imageUrlToFileName(String imageUrl) {
        return imageUrl.substring(awsProperties.getCloudFormation().getApiEndpoint().length() + 1);
    }

    public String fileNameToImageUrl(String fileName) {
        return awsProperties.getCloudFormation().getApiEndpoint() + "/" + fileName;
    }
}