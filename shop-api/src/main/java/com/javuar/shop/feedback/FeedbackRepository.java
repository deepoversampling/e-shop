package com.javuar.shop.feedback;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional(readOnly = true)
public interface FeedbackRepository extends JpaRepository<Feedback, Integer> {
    Page<Feedback> findAllByProduct_Id(Integer productId, Pageable pageable);
    List<Feedback> findAllByCart_Id(Integer cartId);
}