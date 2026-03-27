import api from './api';
import { Product } from './product.service';

export enum ChatIntent {
    POLICY_QA = 'POLICY_QA',
    PRODUCT_SEARCH = 'PRODUCT_SEARCH',
    ORDER_INQUIRY = 'ORDER_INQUIRY',
    GENERAL_CHAT = 'GENERAL_CHAT'
}

export interface ChatBoxResponse {
    intent: ChatIntent;
    message: string;
    data: any | Product[] | any[]; // data can be products, orders, etc.
}

export const chatboxService = {
    async chat(message: string): Promise<ChatBoxResponse> {
        const response = await api.post('/chatbox/chat', null, {
            params: { message }
        });
        return response.data.result;
    }
};
