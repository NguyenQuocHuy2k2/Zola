import api from './api';
import { Product } from './product.service';

export enum ChatIntent {
    POLICY_QA = 'POLICY_QA',
    PRODUCT_SEARCH = 'PRODUCT_SEARCH',
    ORDER_INQUIRY = 'ORDER_INQUIRY',
    GENERAL_CHAT = 'GENERAL_CHAT'
}

export interface ChatMessage {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    intent?: ChatIntent;
    data?: any;
}

export interface ChatBoxResponse {
    intent: ChatIntent;
    message: string;
    data: any | Product[] | any[]; // data can be products, orders, etc.
}

let chatHistory: ChatMessage[] = [
    {
        id: '1',
        text: 'Chào bạn! Zola có thể giúp gì cho bạn hôm nay? Bạn có thể hỏi về sản phẩm, chính sách hoặc tra cứu đơn hàng nhé.',
        sender: 'ai',
    },
];

export const chatboxService = {
    async chat(message: string): Promise<ChatBoxResponse> {
        const response = await api.post('/chatbox/chat', null, {
            params: { message }
        });
        return response.data.result;
    },

    getHistory(): ChatMessage[] {
        return [...chatHistory];
    },

    addMessage(msg: ChatMessage) {
        chatHistory.push(msg);
    },

    clearHistory() {
        chatHistory = [
            {
                id: '1',
                text: 'Chào bạn! Zola có thể giúp gì cho bạn hôm nay? Bạn có thể hỏi về sản phẩm, chính sách hoặc tra cứu đơn hàng nhé.',
                sender: 'ai',
            },
        ];
    }
};
