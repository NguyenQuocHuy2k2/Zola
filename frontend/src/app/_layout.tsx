import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRootNavigationState, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useEffect } from 'react';
import { View } from 'react-native';
import { Provider as PaperProvider, MD3LightTheme, Text } from 'react-native-paper';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { RealmProvider } from '@/storage/realm';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NotificationProvider } from '@/contexts/NotificationContext';

export const unstable_settings = {
    anchor: '(user)',
};

const customPaperTheme = {
    ...MD3LightTheme,
    colors: {
        ...MD3LightTheme.colors,
        primary: '#528F72', // Cart UI green
        secondary: '#2A2A2A', // Cart UI dark button
        background: '#FAFAFA',
        surface: '#FFFFFF',
        surfaceVariant: '#F5F5F5',
        onSurfaceVariant: '#666666',
        outline: '#EAEAEA',
        outlineVariant: '#F0F0F0',
        elevation: {
            level0: 'transparent',
            level1: '#FFFFFF',
            level2: '#FFFFFF',
            level3: '#FFFFFF',
            level4: '#FFFFFF',
            level5: '#FFFFFF',
        },
    },
};

function AppContent() {
    const { isLoading, user } = useAuth();
    const segments = useSegments();

    const isAdmin = user?.role === 'ADMIN';
    const isNavigationCorrect =
        (!user && segments[0] === '(auth)') ||
        (!!isAdmin && segments[0] === '(admin)') ||
        (!isAdmin && !!user && segments[0] === '(user)') ||
        (segments.length as number) === 0;

    const showLoader = isLoading || (!isNavigationCorrect && (segments.length as number) > 0);

    return (
        <>
            <Stack>
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                <Stack.Screen name="(user)" options={{ headerShown: false }} />
                <Stack.Screen name="(admin)" options={{ headerShown: false }} />
            </Stack>
            {showLoader && (
                <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' }}>
                    <Text style={{ fontSize: 48, fontWeight: 'bold', color: '#528F72', letterSpacing: 2 }}>Zola</Text>
                </View>
            )}
        </>
    );
}

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const navigationState = useRootNavigationState();

    useEffect(() => {
        if (!navigationState?.key) return;
    }, [navigationState?.key]);

    const MyDarkTheme = {
        ...DarkTheme,
        colors: {
            ...DarkTheme.colors,
            primary: Colors.dark.tint,
            background: Colors.dark.background,
            text: Colors.dark.text,
        },
    };

    const MyLightTheme = {
        ...DefaultTheme,
        colors: {
            ...DefaultTheme.colors,
            primary: Colors.light.tint,
            background: customPaperTheme.colors.background,
            text: Colors.light.text,
            card: customPaperTheme.colors.surface,
        },
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <ThemeProvider value={colorScheme === 'dark' ? MyDarkTheme : MyLightTheme}>
                <PaperProvider theme={customPaperTheme}>
                    <RealmProvider>
                        <AuthProvider>
                            <NotificationProvider>
                                <AppContent />
                            </NotificationProvider>
                        </AuthProvider>
                    </RealmProvider>
                </PaperProvider>
                <StatusBar style="auto" />
            </ThemeProvider>
        </GestureHandlerRootView>
    );
}
