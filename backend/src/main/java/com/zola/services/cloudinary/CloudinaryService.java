package com.zola.services.cloudinary;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CloudinaryService {

    Cloudinary cloudinary;

    public String uploadImage(MultipartFile file, String folder) throws IOException {
        return uploadImage(file, folder, null);
    }

    public String uploadImage(MultipartFile file, String folder, String publicId) throws IOException {
        Map<String, Object> options = ObjectUtils.asMap(
                "folder", folder,
                "overwrite", true,
                "resource_type", "image"
        );
        if (publicId != null) {
            options.put("public_id", publicId);
        }
        
        @SuppressWarnings("unchecked")
        Map<String, Object> uploadResult = cloudinary.uploader().upload(file.getBytes(), options);
        return uploadResult.get("secure_url") != null ? uploadResult.get("secure_url").toString() : uploadResult.get("url").toString();
    }

    public void deleteImage(String publicId) throws IOException {
        cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
    }
}
