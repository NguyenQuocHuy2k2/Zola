package com.zola.configuration;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class RateLimitFilter extends OncePerRequestFilter {

    // Bộ nhớ cục bộ: Lưu Map với Key là IP -> Value là Mảng {Thời_gian_bắt_đầu, Số_lượng_request}
    private final Map<String, long[]> requestCounts = new ConcurrentHashMap<>();
    
    // Cấu hình: Tối đa 5 request mỗi phút cho các API Auth (chống spam / brute-force)
    private static final int MAX_REQUESTS_PER_MINUTE = 5;
    private static final long TIME_WINDOW_MS = 60000; // 1 phút (milliseconds)

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // Chỉ áp dụng Rate Limit cho các đường dẫn bắt đầu bằng /auth/
        if (request.getRequestURI().startsWith("/auth/")) {
            String clientIp = getClientIp(request);
            long currentTime = System.currentTimeMillis();

            requestCounts.compute(clientIp, (key, value) -> {
                // Nếu chưa có hoặc đã qua 1 phút -> Reset lại đếm từ 1
                if (value == null || (currentTime - value[0]) > TIME_WINDOW_MS) {
                    return new long[]{currentTime, 1}; 
                }
                // Nếu vẫn trong 1 phút -> Tăng số lượng request
                value[1]++;
                return value;
            });

            long[] stats = requestCounts.get(clientIp);
            if (stats[1] > MAX_REQUESTS_PER_MINUTE) {
                // Trả về lỗi HTTP 429 Too Many Requests
                response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
                response.setContentType("application/json");
                response.setCharacterEncoding("UTF-8");
                response.getWriter().write("{\"code\": \"429\", \"message\": \"Quá nhiều yêu cầu. Vui lòng đợi 1 phút rồi thử lại!\"}");
                return;
            }
        }
        
        // Cho qua nếu thoả mãn Rate Limit
        filterChain.doFilter(request, response);
    }

    // Hàm phụ trợ để lấy chính xác IP Client dù có đi qua Proxy
    private String getClientIp(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0];
    }
}
