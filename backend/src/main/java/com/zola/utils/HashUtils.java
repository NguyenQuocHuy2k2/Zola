package com.zola.utils;

import org.springframework.util.DigestUtils;
import java.nio.charset.StandardCharsets;

public class HashUtils {

    private HashUtils() {
        // Private constructor to hide the implicit public one
    }

    /**
     * Sinh mã băm MD5 cho đầu vào chuỗi văn bản.
     * Mặc định dùng mã hoá UTF-8.
     *
     * @param content Nội dung cần băm
     * @return Chuỗi Hash MD5 dạng Hex (32 ký tự)
     */
    public static String generateMD5Hash(String content) {
        if (content == null) {
            return null;
        }
        return DigestUtils.md5DigestAsHex(content.getBytes(StandardCharsets.UTF_8));
    }
}
