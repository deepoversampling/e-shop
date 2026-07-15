package com.javuar.shop.common.stripe;

import com.javuar.shop.cart.item.Item;
import com.stripe.param.checkout.SessionCreateParams;
import lombok.experimental.UtilityClass;

import java.math.BigDecimal;
import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.regex.Pattern;

@UtilityClass
public class LineItemBuilder {
    // Non-ASCII from POSIX character classes in Pattern
    private final Pattern NON_ASCII_PATTERN = Pattern.compile("\\P{ASCII}");

    public SessionCreateParams.LineItem build(Item item) {
        return SessionCreateParams.LineItem.builder()
                .setQuantity(item.getQuantity())
                .setPriceData( // Data used to generate a new Price object inline
                        SessionCreateParams.LineItem.PriceData.builder()
                                .setCurrency("usd")
                                .setUnitAmountDecimal(
                                        item.getProductVariant().getPrice().multiply(BigDecimal.valueOf(100))
                                )
                                .setProductData( // Data used to generate a new Product object inline
                                        SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                .setName(
                                                        stripNonAscii(item.getProductVariant().getProduct().getName())
                                                )
                                                .setDescription(
                                                        stripNonAscii(item.getProductVariantSnapshot().getDescription())
                                                )
                                                .addImage(
                                                        percentEncodeUrl(item.getProductVariantSnapshot().getImageUrl())
                                                )
                                                .build()
                                )
                                .build())
                .build();
    }

    private String stripNonAscii(String s) {
        return NON_ASCII_PATTERN.matcher(s).replaceAll("");
    }

    private String percentEncodeUrl(String url) {
        try {
            URI uri = new URI(url);
            String encodedPath = URLEncoder.encode(uri.getPath(), StandardCharsets.UTF_8)
                    .replace("+", "%20") // Prevents URLEncoder.encode() from encoding a space as the plus character
                    .replace("%2F", "/"); // Prevents / from being encoded

            return uri.getScheme() + "://" + uri.getHost() + encodedPath;
        } catch (Exception e) {
            return url;
        }
    }
}