import { Stack } from 'expo-router';

export default function ProductLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen
                name="[id]/index"
            />
            <Stack.Screen
                name="category/[id]/index"
            />
            <Stack.Screen
                name="search/index"
            />
        </Stack>
    );
}
