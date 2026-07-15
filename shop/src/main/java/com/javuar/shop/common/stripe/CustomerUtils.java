package com.javuar.shop.common.stripe;

import com.stripe.exception.StripeException;
import com.stripe.model.Customer;
import com.stripe.model.CustomerSearchResult;
import com.stripe.param.CustomerCreateParams;
import com.stripe.param.CustomerSearchParams;
import lombok.experimental.UtilityClass;

@UtilityClass
public class CustomerUtils {

    public Customer findOrCreateCustomer(String email, String name) throws StripeException {
        CustomerSearchParams params = CustomerSearchParams.builder()
                .setQuery("email:\"" + email + "\"")
                .build();

        CustomerSearchResult customers = Customer.search(params);

        Customer customer;
        if (customers.getData().isEmpty()) {
            CustomerCreateParams customerCreateParams = CustomerCreateParams.builder()
                    .setName(name)
                    .setEmail(email)
                    .build();
            customer = Customer.create(customerCreateParams);
        } else {
            customer = customers.getData().get(0);
        }
        return customer;
    }
}