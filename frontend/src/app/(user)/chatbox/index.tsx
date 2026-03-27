import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, FlatList, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, Dimensions, TextInput as RNTextInput, TouchableWithoutFeedback } from 'react-native';
import { TextInput, IconButton, Text, useTheme, ActivityIndicator, Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Markdown from 'react-native-markdown-display';
import { ChatIntent, chatboxService } from '@/services/chatbox.service';
import { Product } from '@/services/product.service';
import { ProductCard } from '@/components/products/product-card';
import { Order } from '@/services/order.service';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  intent?: ChatIntent;
  data?: any;
}

export default function ChatBoxScreen() {
  const theme = useTheme();
  const router = useRouter();
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Chào bạn! Zola có thể giúp gì cho bạn hôm nay? Bạn có thể hỏi về sản phẩm, chính sách hoặc tra cứu đơn hàng nhé.',
      sender: 'ai',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  
  const flatListRef = useRef<FlatList>(null);
  const inputRef = useRef<RNTextInput>(null);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input.trim(),
      sender: 'user',
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await chatboxService.chat(userMessage.text);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.message,
        sender: 'ai',
        intent: response.intent,
        data: response.data,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Rất tiếc, đã có lỗi xảy ra. Vui lòng thử lại sau.',
        sender: 'ai',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const renderProductData = (products: Product[]) => {
    if (!products || products.length === 0) return null;
    return (
      <View style={styles.productDataContainer}>
        <Text variant="labelMedium" style={styles.dataTitle}>Sản phẩm gợi ý:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.productScroll}>
          {products.map((item) => (
            <View key={item.id} style={styles.productItemWrapper}>
              <ProductCard product={item} width={160} />
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderOrderData = (orders: Order[]) => {
    if (!orders || orders.length === 0) return null;
    return (
      <View style={styles.orderDataContainer}>
        <Text variant="labelMedium" style={styles.dataTitle}>Đơn hàng của bạn:</Text>
        {orders.map((order) => (
          <TouchableOpacity 
            key={order.id} 
            style={[styles.orderLink, { backgroundColor: theme.colors.elevation.level2 }]}
            onPress={() => router.push(`/orders/${order.id}`)}
          >
            <View style={styles.orderLinkContent}>
              <View>
                <Text variant="titleSmall" style={{ fontWeight: 'bold' }}>{order.orderCode}</Text>
                <Text variant="bodySmall" style={{ opacity: 0.7 }}>Trạng thái: {order.status}</Text>
              </View>
              <IconButton icon="chevron-right" size={20} />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isAi = item.sender === 'ai';
    return (
      <View style={[styles.messageContainer, isAi ? styles.aiContainer : styles.userContainer]}>
        <View style={[
          styles.bubble, 
          isAi ? [styles.aiBubble, { backgroundColor: theme.colors.surfaceVariant }] : [styles.userBubble, { backgroundColor: theme.colors.primary }]
        ]}>
          <Markdown style={{
            body: { color: isAi ? '#333' : 'white', fontSize: 15 },
            paragraph: { marginBottom: 0 }
          }}>
            {item.text}
          </Markdown>
        </View>
        
        {isAi && item.intent === ChatIntent.PRODUCT_SEARCH && Array.isArray(item.data) && renderProductData(item.data)}
        {isAi && item.intent === ChatIntent.ORDER_INQUIRY && Array.isArray(item.data) && renderOrderData(item.data)}
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <IconButton icon="arrow-left" onPress={() => router.back()} />
        <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>Trợ lý AI Zola</Text>
        <IconButton icon="dots-vertical" />
      </View>
      <Divider />

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.messageList}
        ListFooterComponent={loading ? (
          <View style={styles.loadingBubble}>
            <ActivityIndicator size="small" />
          </View>
        ) : null}
      />

      {/* Input Section */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={90}>
        <View style={[styles.inputContainer, { borderTopColor: theme.colors.outlineVariant, backgroundColor: theme.colors.surface }]}>
          <TouchableWithoutFeedback onPress={() => inputRef.current?.focus()}>
            <View style={[styles.inputWrapper, { backgroundColor: theme.colors.surfaceVariant }]}>
              <RNTextInput
                ref={inputRef}
                placeholder="Nhập tin nhắn..."
                value={input}
                onChangeText={setInput}
                style={[styles.chatInput, { color: theme.colors.onSurfaceVariant }]}
                multiline
                placeholderTextColor={theme.colors.onSurfaceDisabled}
                selectionColor={theme.colors.primary}
              />
            </View>
          </TouchableWithoutFeedback>
          <IconButton
            icon="send"
            mode="contained"
            containerColor={input.trim() ? theme.colors.primary : theme.colors.surfaceDisabled}
            iconColor={input.trim() ? theme.colors.onPrimary : theme.colors.onSurfaceDisabled}
            disabled={!input.trim() || loading}
            onPress={sendMessage}
            size={24}
            style={styles.sendButton}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    height: 56,
  },
  messageList: {
    padding: 16,
    paddingBottom: 32,
  },
  messageContainer: {
    marginBottom: 20,
    maxWidth: '85%',
  },
  aiContainer: {
    alignSelf: 'flex-start',
  },
  userContainer: {
    alignSelf: 'flex-end',
  },
  bubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  aiBubble: {
    borderTopLeftRadius: 4,
  },
  userBubble: {
    borderTopRightRadius: 4,
  },
  loadingBubble: {
    alignSelf: 'flex-start',
    padding: 12,
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    marginLeft: 16,
    marginBottom: 20,
  },
  inputContainer: {
    padding: 12,
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderTopWidth: 1,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12, // More bottom padding for modern look
  },
  inputWrapper: {
    flex: 1,
    borderRadius: 24,
    paddingHorizontal: 16,
    marginRight: 8,
    minHeight: 48,
    justifyContent: 'center',
  },
  chatInput: {
    backgroundColor: 'transparent',
    fontSize: 16,
    maxHeight: 120,
    paddingVertical: 8,
  },
  sendButton: {
    margin: 0,
    width: 48,
    height: 48,
  },
  productDataContainer: {
    marginTop: 12,
    width: Dimensions.get('window').width - 32,
  },
  dataTitle: {
    marginBottom: 8,
    fontWeight: 'bold',
    opacity: 0.7,
  },
  productScroll: {
    paddingRight: 16,
    paddingBottom: 10, // Avoid clipping shadows
  },
  productItemWrapper: {
    marginRight: 16,
    width: 160, 
  },
  orderDataContainer: {
    marginTop: 12,
  },
  orderLink: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  orderLinkContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
