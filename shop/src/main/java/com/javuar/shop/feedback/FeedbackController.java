package com.javuar.shop.feedback;

import com.javuar.shop.common.pagination.PageResponse;
import com.javuar.shop.feedback.validation.group_sequence.NoteValidationSequence;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("feedbacks")
@RequiredArgsConstructor
public class FeedbackController {
    private final FeedbackService feedbackService;

    @PostMapping
    public ResponseEntity<FeedbackResponseDTO> createFeedback(
            @Validated(NoteValidationSequence.class) @RequestBody FeedbackRequestDTO feedbackRequestDTO,
            Authentication authentication
    ) {
        return ResponseEntity.ok(feedbackService.saveFeedback(feedbackRequestDTO, authentication));
    }

    @GetMapping
    public ResponseEntity<PageResponse<FeedbackResponseDTO>> getFeedbacksByProductId(
            @RequestParam(name = "page-number", defaultValue = "0", required = false) int pageNumber,
            @RequestParam(name = "page-size", defaultValue = "10", required = false) int pageSize,
            @RequestParam(name = "sort", defaultValue = "name", required = false) String sort,
            @RequestParam(name = "direction", defaultValue = "asc", required = false) String direction,
            @RequestParam(name = "product-id") Integer productId
    ) {
        return ResponseEntity.ok(feedbackService.fetchFeedbacksByProductId(
                pageNumber, pageSize, sort, direction, productId
        ));
    }

    @GetMapping("/pending/{cart-id}/cart")
    public ResponseEntity<List<Integer>> getPendingFeedbacksByCartId(
            @PathVariable("cart-id") Integer cartId,
            Authentication authentication
    ) {
        return ResponseEntity.ok(feedbackService.fetchPendingFeedbacksByCartId(cartId, authentication));
    }

    @GetMapping("/commited/{cart-id}/cart")
    public ResponseEntity<List<FeedbackResponseDTO>> getFeedbacksByCartId(
            @PathVariable("cart-id") Integer cartId,
            Authentication authentication
    ) {
        return ResponseEntity.ok(feedbackService.fetchFeedbacksByCartId(cartId, authentication));
    }
}