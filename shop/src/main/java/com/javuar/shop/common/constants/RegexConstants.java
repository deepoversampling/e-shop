package com.javuar.shop.common.constants;

import java.util.regex.Pattern;

public class RegexConstants {
    public static final Pattern CONTINUOUS_PATTERN = Pattern.compile("^-?(\\d*\\.\\d+|\\d+)\\|-?(\\d*\\.\\d+|\\d+)$");
}