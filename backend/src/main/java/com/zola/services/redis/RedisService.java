package com.zola.services.redis;

import java.util.concurrent.TimeUnit;

public interface RedisService {
    void set(String key, String value, long timeout, TimeUnit unit);
    String get(String key);
    void delete(String key);
    boolean hasKey(String key);
}
