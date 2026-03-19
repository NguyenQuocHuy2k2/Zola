import { View } from 'react-native';
import { Text, Button, Card, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';

interface StockSummaryProps {
    variantCount: number;
    productId: string;
}

export function StockSummary({ variantCount, productId }: StockSummaryProps) {
    const theme = useTheme();
    const router = useRouter();

    return (
        <Card
            style={[
                {
                    marginBottom: 16,
                    borderRadius: 12,
                    elevation: 2,
                    backgroundColor: theme.colors.primaryContainer,
                },
            ]}
        >
            <Card.Content
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <View>
                    <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>
                        Kho hàng & Biến thể
                    </Text>
                    <Text variant="bodySmall">
                        Sản phẩm hiện có {variantCount} biến thể
                    </Text>
                </View>
                <Button
                    mode="contained"
                    icon="package-variant"
                    onPress={() =>
                        router.push(`/products/${productId}/variant`)
                    }
                >
                    Nhập kho
                </Button>
            </Card.Content>
        </Card>
    );
}
