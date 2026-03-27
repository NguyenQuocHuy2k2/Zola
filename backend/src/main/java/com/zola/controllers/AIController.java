package com.zola.controllers;

import com.zola.dto.response.ai.UserInfoItem;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.chat.messages.SystemMessage;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.prompt.ChatOptions;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.content.Media;
import org.springframework.ai.document.Document;
import org.springframework.ai.reader.pdf.PagePdfDocumentReader;
import org.springframework.ai.transformer.splitter.TokenTextSplitter;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.util.MimeTypeUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("ai")
@RequiredArgsConstructor
public class AIController {

    private final ChatClient chatClient;
    private final VectorStore vectorStore;

    @PostMapping("/chat")
    public String chat(@RequestParam String message) {
        SystemMessage systemMessage = new SystemMessage("""
                You should response with a formal voice
                """);

        UserMessage userMessage = new UserMessage(message);

        Prompt prompt = new Prompt(systemMessage, userMessage);

        String conversationId = "0001";

        return chatClient
                .prompt(prompt)
                .advisors(a -> a.param(ChatMemory.CONVERSATION_ID, conversationId))
                .call()
                .content();

    }

    @PostMapping("/chat-with-image")
    String chatWithImage(@RequestParam("file") MultipartFile file,
                         @RequestParam("message") String message) {
        Media media = Media.builder()
                .mimeType(MimeTypeUtils.parseMimeType(file.getContentType()))
                .data(file.getResource())
                .build();

        ChatOptions chatOptions = ChatOptions.builder()
                .temperature(0D)
                .build();

        return chatClient.prompt()
                .options(chatOptions)
                .system("You are Zola")
                .user(promptUserSpec
                        -> promptUserSpec.media(media)
                        .text(message))
                .call()
                .content();
    }

    @PostMapping("/chat-with-pdf")
    List<UserInfoItem> chatWithPdf(
            @RequestParam("file") MultipartFile file,
            @RequestParam("message") String message) throws IOException {

        // 1. Đọc PDF thành Documents
        PagePdfDocumentReader pdfReader = new PagePdfDocumentReader(file.getResource());
        List<Document> documents = pdfReader.get();

        // 2. Chia nhỏ document (chunking) để embedding hiệu quả hơn
        TokenTextSplitter splitter = new TokenTextSplitter();
        List<Document> chunks = splitter.apply(documents);

        // 3. Lưu vào vector store (tự động embed với RETRIEVAL_DOCUMENT)
        vectorStore.add(chunks);

        // 4. Tìm các đoạn liên quan nhất với câu hỏi (semantic search)
        //    task-type lúc này nên là RETRIEVAL_QUERY
        List<Document> relevantDocs = vectorStore.similaritySearch(
                SearchRequest.builder()
                        .query(message)
                        .topK(5)          // lấy 5 đoạn liên quan nhất
                        .build()
        );

        // 5. Build context từ các đoạn liên quan
        String context = relevantDocs.stream()
                .map(Document::getText)
                .collect(Collectors.joining("\n---\n"));

        // 6. Gọi LLM với context đã lọc
        return chatClient.prompt()
                .system("You are Zola, an assistant. Use the following context from a PDF file to answer the user's question.\n\nContext:\n" + context)
                .user(message)
                .call()
                .entity(new ParameterizedTypeReference<List<UserInfoItem>>() {});
    }

}

