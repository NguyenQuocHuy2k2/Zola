package com.zola.configuration;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.zola.entity.*;
import com.zola.enums.PredefinedRole;
import com.zola.enums.ProductStatus;
import com.zola.repository.*;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Configuration
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ApplicationInitConfig {

    PasswordEncoder passwordEncoder;
    ObjectMapper objectMapper;

    @NonFinal
    @Value("${init.admin.username}")
    String ADMIN_USERNAME;

    @NonFinal
    @Value("${init.admin.password}")
    String ADMIN_PASSWORD;

    @NonFinal
    @Value("${init.admin.email}")
    String ADMIN_EMAIL;

    @NonFinal
    @Value("${init.admin.phone}")
    String ADMIN_PHONE;

    @Bean
    @ConditionalOnProperty(prefix = "spring", value = "datasource.driver-class-name", havingValue = "org.postgresql.Driver")
    ApplicationRunner applicationRunner(
            UserRepository userRepository,
            RoleRepository roleRepository,
            CategoryRepository categoryRepository,
            SizeRepository sizeRepository,
            ColorRepository colorRepository,
            ProductRepository productRepository,
            ProductVariantRepository productVariantRepository,
            ProductImageRepository productImageRepository) {
        log.info("ApplicationInitConfig initialized - PostgreSQL detected");

        return args -> {
            // Seed Roles
            if (roleRepository.count() == 0) {
                log.info("Seeding roles...");
                roleRepository.save(Role.builder()
                        .name(PredefinedRole.ADMIN.name())
                        .roleName("CHỦ CỬA HÀNG")
                        .description("Admin role")
                        .build());
                roleRepository.save(Role.builder()
                        .name(PredefinedRole.USER.name())
                        .roleName("KHÁCH HÀNG")
                        .description("User role")
                        .build());
            }

            // Seed Admin User
            if (userRepository.findByUsername(ADMIN_USERNAME).isEmpty()) {
                log.info("Seeding admin user...");
                userRepository.save(User.builder()
                        .username(ADMIN_USERNAME)
                        .password(passwordEncoder.encode(ADMIN_PASSWORD))
                        .email(ADMIN_EMAIL)
                        .phone(ADMIN_PHONE)
                        .firstName("System")
                        .lastName("Administrator")
                        .role(roleRepository.findByRoleName(PredefinedRole.ADMIN))
                        .isActive(true)
                        .build());
                log.warn("Admin user has been created with default password: admin, please change it");
            }

            // Seed normal user
            if (userRepository.findByUsername("vuthevy1209").isEmpty()) {
                log.info("Seeding user vuthevy1209...");
                userRepository.save(User.builder()
                        .username("vuthevy1209")
                        .password(passwordEncoder.encode("Password123@"))
                        .email("vuthevy12092004@gmail.com")
                        .phone("0354802825")
                        .firstName("Vy")
                        .lastName("Vu")
                        .role(roleRepository.findByRoleName(PredefinedRole.USER))
                        .isActive(true)
                        .build());
            }

            // Seed Categories
            if (categoryRepository.count() == 0) {
                log.info("Seeding categories...");
                loadJson("seed/categories.json").forEach(c -> categoryRepository.save(Category.builder()
                        .name((String) c.get("name"))
                        .description((String) c.get("description"))
                        .imageUrl((String) c.get("imageUrl"))
                        .build()));
            }

            // Seed Sizes
            if (sizeRepository.count() == 0) {
                log.info("Seeding sizes...");
                loadJson("seed/sizes.json").forEach(s -> sizeRepository.save(
                        Size.builder().name((String) s.get("name")).build()));
            }

            // Seed Colors
            if (colorRepository.count() == 0) {
                log.info("Seeding colors...");
                loadJson("seed/colors.json").forEach(c -> colorRepository.save(Color.builder()
                        .name((String) c.get("name"))
                        .hexCode((String) c.get("hexCode"))
                        .build()));
            }

            // Seed Products
            if (productRepository.count() == 0) {
                log.info("Seeding products...");
                Map<String, Category> categoryMap = categoryRepository.findAll().stream()
                        .collect(Collectors.toMap(Category::getName, c -> c));
                Map<String, Size> sizeMap = sizeRepository.findAll().stream()
                        .collect(Collectors.toMap(Size::getName, s -> s));
                Map<String, Color> colorMap = colorRepository.findAll().stream()
                        .collect(Collectors.toMap(Color::getName, c -> c));

                loadJson("seed/products.json").forEach(pd -> {
                    Product product = productRepository.save(Product.builder()
                            .name((String) pd.get("name"))
                            .description((String) pd.get("description"))
                            .basePrice(new BigDecimal((String) pd.get("basePrice")))
                            .status(ProductStatus.valueOf((String) pd.get("status")))
                            .brand((String) pd.get("brand"))
                            .category(categoryMap.get(pd.get("category")))
                            .build());

                    @SuppressWarnings("unchecked")
                    List<Map<String, Object>> images = (List<Map<String, Object>>) pd.get("images");
                    if (images != null) {
                        images.forEach(img -> productImageRepository.save(ProductImage.builder()
                                .product(product)
                                .imageUrl((String) img.get("imageUrl"))
                                .isPrimary((Boolean) img.get("isPrimary"))
                                .build()));
                    }

                    @SuppressWarnings("unchecked")
                    List<Map<String, Object>> variants = (List<Map<String, Object>>) pd.get("variants");
                    if (variants != null) {
                        variants.forEach(v -> productVariantRepository.save(ProductVariant.builder()
                                .product(product)
                                .size(sizeMap.get(v.get("size")))
                                .color(colorMap.get(v.get("color")))
                                .stockQuantity((Integer) v.get("stockQuantity"))
                                .build()));
                    }
                });
            }
        };
    }

    private List<Map<String, Object>> loadJson(String classpathLocation) {
        try {
            var resource = new ClassPathResource(classpathLocation);
            return objectMapper.readValue(resource.getInputStream(),
                    new TypeReference<List<Map<String, Object>>>() {});
        } catch (Exception e) {
            log.error("Failed to load seed file: {}", classpathLocation, e);
            return List.of();
        }
    }
}