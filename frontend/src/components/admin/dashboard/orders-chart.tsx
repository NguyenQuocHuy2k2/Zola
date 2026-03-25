import { useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text, Menu, Button } from 'react-native-paper';
import { LineChart } from 'react-native-chart-kit';
import { DailyOrderStat } from '@/services/dashboard.service';

interface OrdersChartProps {
    dailyOrders: DailyOrderStat[];
    dateRange: string;
    setDateRange: (val: string) => void;
}

export function OrdersChart({ dailyOrders, dateRange, setDateRange }: OrdersChartProps) {
    const [dateMenuVisible, setDateMenuVisible] = useState(false);

    const chartData = {
        labels: dailyOrders.length > 0 ? dailyOrders.map(o => {
            const d = new Date(o.date);
            return `${d.getDate()}/${d.getMonth() + 1}`;
        }) : [''],
        datasets: [
            {
                data: dailyOrders.length > 0 ? dailyOrders.map(o => o.count) : [0],
            }
        ]
    };

    return (
        <View style={styles.chartContainer}>
            <View style={styles.chartHeader}>
                <Text variant="titleMedium" style={styles.sectionTitle}>Biểu đồ đơn hàng</Text>
                <Menu
                    visible={dateMenuVisible}
                    onDismiss={() => setDateMenuVisible(false)}
                    anchor={
                        <Button mode="outlined" onPress={() => setDateMenuVisible(true)} compact>
                            {dateRange === '7' ? '7 ngày' : '30 ngày'}
                        </Button>
                    }
                >
                    <Menu.Item onPress={() => { setDateRange('7'); setDateMenuVisible(false); }} title="7 ngày" />
                    <Menu.Item onPress={() => { setDateRange('30'); setDateMenuVisible(false); }} title="30 ngày" />
                </Menu>
            </View>
            <LineChart
                data={chartData}
                width={Dimensions.get('window').width - 90} // padding adjustments
                height={220}
                chartConfig={{
                    backgroundColor: '#fff',
                    backgroundGradientFrom: '#fff',
                    backgroundGradientTo: '#fff',
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(102, 102, 102, ${opacity})`,
                    style: { borderRadius: 16 },
                    propsForDots: { r: "4", strokeWidth: "2", stroke: "#2563EB" },
                    propsForBackgroundLines: { strokeDasharray: "" },
                }}
                bezier
                style={{ marginVertical: 8, borderRadius: 16, marginLeft: -16 }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    chartContainer: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 24, elevation: 2 },
    chartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    sectionTitle: { fontWeight: 'bold' },
});
