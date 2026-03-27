package com.zola.configuration;

import com.zola.entity.DocumentHash;
import com.zola.repository.DocumentHashRepository;
import com.zola.utils.HashUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.document.Document;
import org.springframework.ai.transformer.splitter.TokenTextSplitter;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.util.DigestUtils;

import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Component
@RequiredArgsConstructor
@Slf4j
public class PolicyDataLoader implements ApplicationRunner {

    private final DocumentHashRepository documentHashRepository;
    private final VectorStore vectorStore;
    private final JdbcTemplate jdbcTemplate;

    @Override
    public void run(ApplicationArguments args) throws Exception {
        log.info("Checking Policy Markdown files for Vector Store indexing...");
        PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
        Resource[] resources = resolver.getResources("classpath:policys/*.md");

        TokenTextSplitter textSplitter = new TokenTextSplitter();

        for (Resource resource : resources) {
            String fileName = resource.getFilename();
            if (fileName == null) continue;

            try (InputStream is = resource.getInputStream()) {
                String content = new String(is.readAllBytes(), StandardCharsets.UTF_8);
                String currentHash = HashUtils.generateMD5Hash(content);

                Optional<DocumentHash> hashEntityOpt = documentHashRepository.findById(fileName);

                if (hashEntityOpt.isPresent() && hashEntityOpt.get().getHashValue().equals(currentHash)) {
                    log.info("Policy {} hasn't changed (hash match). Skipping vector indexing.", fileName);
                    continue;
                }

                log.info("Policy {} is new or has changed. Processing Vector indexing...", fileName);

                // 1. Delete old chunks if they exist (PgVector specific using jdbcTemplate)
                if (hashEntityOpt.isPresent()) {
                    try {
                        int deleted = jdbcTemplate.update("DELETE FROM vector_store WHERE metadata->>'name' = ?", fileName);
                        log.info("Deleted {} old vectors for {}", deleted, fileName);
                    } catch (Exception e) {
                        log.warn("Failed to delete old vectors for {}, table might not exist yet or no rows matched.", fileName);
                    }
                }

                // 2. Chunking the new content
                Document rawDocument = new Document(content, Map.of(
                        "name", fileName,
                        "docType", "policy"
                ));
                List<Document> chunkedDocs = textSplitter.apply(List.of(rawDocument));

                // 3. Save to Vector DB
                vectorStore.add(chunkedDocs);
                log.info("Successfully indexed {} chunks for policy {}", chunkedDocs.size(), fileName);

                // 4. Update the stored Hash
                documentHashRepository.save(DocumentHash.builder()
                        .name(fileName)
                        .hashValue(currentHash)
                        .build());

            } catch (Exception e) {
                log.error("Failed to process policy file: {}", fileName, e);
            }
        }
    }
}
