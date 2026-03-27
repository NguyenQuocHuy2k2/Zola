package com.zola.controllers;

import com.zola.utils.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.messages.SystemMessage;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/chatbox")
@RequiredArgsConstructor
public class ChatBoxController {

    private final ChatClient chatClient;
    private final VectorStore vectorStore;

    @PostMapping("/chat")
    public String chat(@RequestParam String message) {

        String userId = SecurityUtils.getCurrentUserId();
        String conversationId = userId;

        // 1. Tìm kiếm các chunk liên quan nhất từ Vector Store dựa trên message
        // Filter theo metadata nếu cần (ví dụ chỉ tìm trong docType = "policy")
        List<Document> similarDocuments = vectorStore.similaritySearch(
                SearchRequest.builder()
                        .query(message)
                        .topK(1)
                        .filterExpression("docType == 'policy'")
                        .build()
        );

        // 2. Trích xuất nội dung văn bản từ các chunk tìm được
        String context = similarDocuments.stream()
                .map(Document::getText)
                .collect(Collectors.joining("\n\n"));

        // 3. Xây dựng Prompt với ngữ cảnh đã tìm thấy
        String prompt = """
        NGỮ CẢNH: %s
        Dựa trên ngữ cảnh trên, hãy trả lời câu hỏi sau một cách chính xác, ngắn gọn và tập trung ĐÚNG vào nội dung được hỏi. Không trả lời lan man sang các phần không liên quan:
        Câu hỏi:  %s
        """.formatted(context, message);

        System.out.println("Final Prompt sent to ChatClient:\n" + prompt);

        return chatClient.prompt()
                .user(prompt)
                .advisors(a -> a.param(ChatMemory.CONVERSATION_ID, conversationId))
                .call()
                .content();
    }
}
