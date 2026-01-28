import { Stack } from 'expo-router';

export default function ProductLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen
                name="[id]/index"
                options={{ tabBarStyle: { display: 'none' } }}
            />
            <Stack.Screen
                name="category/[id]/index"
                options={{ tabBarStyle: { display: 'none' } }}
            />
            <Stack.Screen
                name="search/index"
                options={{ tabBarStyle: { display: 'none' } }}
            />
        </Stack>
    );
}
