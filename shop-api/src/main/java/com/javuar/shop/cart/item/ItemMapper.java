package com.javuar.shop.cart.item;

import org.springframework.stereotype.Service;

@Service
public class ItemMapper {

    public ItemResponseDTO toItemResponseDTO(Item item) {
        return ItemResponseDTO.builder()
                .id(item.getId())
                .quantity(item.getQuantity())
                .productSnapshot(item.getProductVariantSnapshot())
                .present(item.isPresent())
                .available(item.isAvailable())
                .build();
    }
}