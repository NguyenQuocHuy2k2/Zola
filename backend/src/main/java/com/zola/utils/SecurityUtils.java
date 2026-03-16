package com.zola.utils;

import org.springframework.security.core.context.SecurityContextHolder;

public class SecurityUtils {

    private SecurityUtils() {}

    public static String getCurrentUserId() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }
}
