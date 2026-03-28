package com.zola.services.chatbox;

import com.zola.converters.ProductConverter;
import com.zola.dto.response.chatbox.ChatBoxResponse;
import com.zola.dto.response.chatbox.ChatBoxResponseType;
import com.zola.dto.response.order.OrderResponse;
import com.zola.dto.response.product.ProductResponse;
import com.zola.enums.ChatIntent;
import com.zola.repository.ProductRepository;
import com.zola.services.order.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatBoxServiceImpl implements ChatBoxService {

    private final ChatClient chatClient;
    private final VectorStore vectorStore;
    private final ProductRepository productRepository;
    private final ProductConverter productConverter;
    private final OrderService orderService;

    @Override
    public ChatBoxResponse chat(String message, String userId) {
        ChatBoxResponseType responseType = this.determineIntent(message);

        switch (responseType.intent()) {
            case PRODUCT_SEARCH -> {
                return handleProductSearch(message, userId);
            }
            case POLICY_QA -> {
                String aiAnswer = handlePolicyQA(message, userId);
                return new ChatBoxResponse(ChatIntent.POLICY_QA, aiAnswer, null);
            }
            case ORDER_INQUIRY -> {
                return handleOrderInquiry(message, userId);
            }
            case GENERAL_CHAT -> {
                return handleGeneralChat(message, userId);
            }
            default -> {
                return new ChatBoxResponse(ChatIntent.GENERAL_CHAT,
                        "Xin lỗi, tôi không hiểu câu hỏi của bạn. Vui lòng hỏi về chính sách, sản phẩm hoặc đơn hàng.",
                        null);
            }
        }
    }

    @Override
    public ChatBoxResponseType determineIntent(String message) {
        String promptText = """
                Phân tích câu hỏi của người dùng: "%s"
                Giúp tôi xác định duy nhất một intent trong: POLICY_QA, PRODUCT_SEARCH, ORDER_INQUIRY, GENERAL_CHAT.
                1) Nếu câu hỏi liên quan đến chính sách, quy định, điều khoản, chọn POLICY_QA.
                2) Nếu là PRODUCT_SEARCH, tức người dùng đang tìm kiếm sản phẩm, chọn PRODUCT_SEARCH.
                3) Nếu người dùng hỏi về đơn hàng, tình trạng giao hàng, chọn ORDER_INQUIRY.
                4) Nếu không thuộc các loại trên, chọn GENERAL_CHAT.
                """.formatted(message);

        return chatClient.prompt()
                .user(promptText)
                .call()
                .entity(ChatBoxResponseType.class);
    }

    private ChatBoxResponse handleProductSearch(String message, String conversationId) {
        // 1. Thực hiện tìm kiếm semantic từ Vector Store
        List<Document> similarDocuments = vectorStore.similaritySearch(
                SearchRequest.builder()
                        .query(message)
                        .topK(5)
                        .filterExpression("docType == 'product'")
                        .build()
        );

        if (similarDocuments.isEmpty()) {
            String prompt = """
                Bạn là trợ lý AI của Zola. 
                Khách hàng đang tìm kiếm: "%s"
                Hiện tại Zola không tìm thấy sản phẩm nào phù hợp trực tiếp với từ khóa này.
                Hãy viết một lời xin lỗi lịch sự, chân thành (khoảng 1-2 câu) và gợi ý khách hàng thử tìm kiếm với từ khóa khác hoặc xem qua các danh mục sản phẩm khác nhé.
                """.formatted(message);

            String aiSorry = chatClient.prompt()
                    .user(prompt)
                    .advisors(a -> a.param(ChatMemory.CONVERSATION_ID, conversationId))
                    .call()
                    .content();

            return new ChatBoxResponse(ChatIntent.PRODUCT_SEARCH, aiSorry, null);
        }

        // 2. Trích xuất productId từ metadata
        List<String> productIds = similarDocuments.stream()
                .map(doc -> (String) doc.getMetadata().get("productId"))
                .filter(id -> id != null)
                .distinct()
                .collect(Collectors.toList());

        if (productIds.isEmpty()) {
            return new ChatBoxResponse(ChatIntent.PRODUCT_SEARCH,
                    "Zola rất tiếc vì hiện tại sản phẩm bạn tìm đang tạm hết hàng hoặc chưa có sẵn. Bạn có thể thử tìm kiếm một sản phẩm khác nhé!",
                    null);
        }

        // 3. Truy vấn thông tin chi tiết từ DB
        List<ProductResponse> productResponses = productRepository.findAllById(productIds)
                .stream()
                .map(productConverter::toProductResponse)
                .collect(Collectors.toList());

        // 4. Tạo phản hồi AI dẫn dắt
        String productInfo = productResponses.stream()
                .map(p -> "- " + p.getName() + " (Giá: " + p.getBasePrice() + " VNĐ)")
                .collect(Collectors.joining("\n"));

        String introPrompt = """
                Bạn là trợ lý AI của cửa hàng thời trang Zola. 
                Khách hàng đang tìm kiếm: "%s"
                Zola đã tìm thấy các sản phẩm sau:
                %s
                
                Hãy viết một lời dẫn dắt ngắn gọn (1-2 câu), hào hứng để giới thiệu danh sách sản phẩm này cho Khách hàng.
                Lưu ý: Không liệt kê lại danh sách sản phẩm trong câu trả lời vì chúng sẽ được hiển thị ngay bên dưới.
                """.formatted(message, productInfo);

        String aiResponse = chatClient.prompt()
                .user(introPrompt)
                .advisors(a -> a.param(ChatMemory.CONVERSATION_ID, conversationId))
                .call()
                .content();

        return new ChatBoxResponse(ChatIntent.PRODUCT_SEARCH, aiResponse, productResponses);
    }

    private ChatBoxResponse handleOrderInquiry(String message, String conversationId) {
        // 1. Lấy danh sách đơn hàng của người dùng thông qua OrderService
        List<OrderResponse> myOrders = orderService.getMyOrders();

        if (myOrders.isEmpty()) {
            String prompt = """
                Bạn là trợ lý AI của cửa hàng thời trang Zola. 
                Khách hàng đang hỏi về tình trạng đơn hàng nhưng hiện tại họ chưa có lịch sử đơn hàng nào trong hệ thống.
                Hãy trả lời một cách lịch sự, chân thành và gợi ý họ có thể bắt đầu mua sắm tại Zola để trải nghiệm dịch vụ nhé.
                """;

            String aiResponse = chatClient.prompt()
                    .user(prompt)
                    .advisors(a -> a.param(ChatMemory.CONVERSATION_ID, conversationId))
                    .call()
                    .content();

            return new ChatBoxResponse(ChatIntent.ORDER_INQUIRY, aiResponse, null);
        }

        // 2. Định dạng danh sách đơn hàng để AI hiểu context (Bao gồm cả danh sách sản phẩm)
        String orderSummary = myOrders.stream()
                .map(order -> {
                    String productNames = order.getItems().stream()
                            .map(item -> item.getProductName() + " (x" + item.getQuantity() + ")")
                            .collect(Collectors.joining(", "));
                    return "- Mã đơn: %s, Sản phẩm: [%s], Trạng thái: %s, Ngày đặt: %s, Tổng tiền: %s VNĐ"
                            .formatted(order.getOrderCode(),
                                       productNames,
                                       order.getStatus().name(),
                                       order.getCreatedAt().toString(),
                                       order.getTotalAmount().toString());
                })
                .collect(Collectors.joining("\n"));

        // 3. Xây dựng prompt để AI phân tích và trả lời câu hỏi cụ thể của người dùng
        String inquiryPrompt = """
                Bạn là trợ lý AI của cửa hàng thời trang Zola. 
                Dưới đây là thông tin thực tế về các đơn hàng của Khách hàng này:
                %s
                
                Người dùng vừa nói: "%s"
                
                Nhiệm vụ của bạn:
                1. Hãy đọc kỹ câu hỏi của người dùng để xem họ hỏi về một mã đơn cụ thể hay hỏi chung chung.
                2. Dựa trên dữ liệu đơn hàng cung cấp ở trên, hãy trả lời một cách chính xác tình trạng hiện tại.
                3. TRONG CÂU TRẢ LỜI, HÃY LIỆT KÊ TÊN CÁC SẢN PHẨM CÓ TRONG ĐƠN HÀNG (ví dụ: "Đơn hàng XXX gồm váy lụa, áo thun đã được xác nhận").
                4. Giải thích ngắn gọn ý nghĩa trạng thái nếu cần.
                5. Phong cách: Thân thiện, chuyên nghiệp, ngắn gọn.
                """.formatted(orderSummary, message);

        String aiAnswer = chatClient.prompt()
                .user(inquiryPrompt)
                .advisors(a -> a.param(ChatMemory.CONVERSATION_ID, conversationId))
                .call()
                .content();

        return new ChatBoxResponse(ChatIntent.ORDER_INQUIRY, aiAnswer, myOrders);
    }

    private String handlePolicyQA(String message, String conversationId) {
        List<Document> similarDocuments = vectorStore.similaritySearch(
                SearchRequest.builder()
                        .query(message)
                        .topK(1)
                        .filterExpression("docType == 'policy'")
                        .build()
        );

        String context = similarDocuments.stream()
                .map(Document::getText)
                .collect(Collectors.joining("\n\n"));

        String prompt = """
                NGỮ CẢNH: %s
                Dựa trên ngữ cảnh trên, hãy trả lời câu hỏi sau một cách chính xác, ngắn gọn và tập trung ĐÚNG vào nội dung được hỏi. Không trả lời lan man sang các phần không liên quan:
                Câu hỏi:  %s
                """.formatted(context, message);

        return chatClient.prompt()
                .user(prompt)
                .advisors(a -> a.param(ChatMemory.CONVERSATION_ID, conversationId))
                .call()
                .content();
    }

    private ChatBoxResponse handleGeneralChat(String message, String conversationId) {
        String prompt = """
                Bạn là trợ lý AI thông minh của cửa hàng thời trang Zola.
                Người dùng vừa nói: "%s"
                Hãy trả lời một cách thân thiện, lịch sự.
                Nếu người dùng chào hỏi, hãy chào lại và giới thiệu bạn có thể giúp tìm sản phẩm hoặc tra cứu chính sách.
                Nếu người dùng hỏi những thứ không liên quan, hãy khéo léo từ chối và hướng họ về các chủ đề: tìm sản phẩm, chính sách (đổi trả, bảo hành, vận chuyển), kiểm tra đơn hàng.
                """.formatted(message);

        String aiResponse = chatClient.prompt()
                .user(prompt)
                .advisors(a -> a.param(ChatMemory.CONVERSATION_ID, conversationId))
                .call()
                .content();

        return new ChatBoxResponse(ChatIntent.GENERAL_CHAT, aiResponse, null);
    }

}
