import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { AuthResponse } from '../services/auth.service';
import { useRouter, useSegments } from 'expo-router';
import { useRealm, useQuery } from '../storage/realm';
import { UserProfile as RealmUserProfile } from '../storage/realm';
import { UserProfile } from '@/services/profile.service';
import { cartService } from '@/services/cart.service';
import { DeviceEventEmitter } from 'react-native';

interface AuthContextType {
    user: UserProfile | null;
    isLoading: boolean;
    signIn: (data: AuthResponse) => Promise<void>;
    signOut: () => Promise<void>;
    updateUserContext: (user: UserProfile) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

function useProtectedRoute(user: UserProfile | null, isLoading: boolean) {
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        if (isLoading) return;

        const inAuthGroup = segments[0] === '(auth)';
        const inAdminGroup = segments[0] === '(admin)';
        const inUserGroup = segments[0] === '(user)';
        const isAdmin = user?.role === 'ADMIN';

        if (user && inAuthGroup) {
            // Check var returnTo locally since useEffect doesn't support async top-level well without then
            SecureStore.getItemAsync('returnTo').then(returnTo => {
                if (returnTo) {
                    SecureStore.deleteItemAsync('returnTo');
                    router.replace(returnTo as any);
                } else {
                    router.replace(isAdmin ? '/(admin)' : '/(user)');
                }
            });
        } else if (inAdminGroup && (!user || !isAdmin)) {
            // Không phải admin mà vào admin -> về trang chủ (user)
            router.replace('/(user)');
        } else if (user && isAdmin && inUserGroup) {
            // Admin cố truy cập màn hình user → về admin
            router.replace('/(admin)');
        }
    }, [user, segments, isLoading]);
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const realm = useRealm();
    const realmUser = useQuery(RealmUserProfile)[0]; // Realm is reactive, this updates automatically
    const [tokenChecked, setTokenChecked] = useState(false);
    const [realmChecked, setRealmChecked] = useState(false);
    const isLoading = !tokenChecked || !realmChecked;
    const [user, setUser] = useState<UserProfile | null>(null);

    // Sync realm user to local state for easier consumption
    useEffect(() => {
        if (realmUser) {
            setUser({
                id: realmUser.id,
                username: realmUser.username,
                firstName: realmUser.firstName,
                lastName: realmUser.lastName,
                email: realmUser.email,
                phone: realmUser.phone,
                avatarUrl: realmUser.avatarUrl,
                role: realmUser.role,
                createdAt: realmUser.createdAt,
            });
        } else {
            setUser(null);
        }
        setRealmChecked(true);
    }, [realmUser]);

    useEffect(() => {
        const loadSession = async () => {
            try {
                const storedToken = await SecureStore.getItemAsync('userToken');
                if (!storedToken) {
                    setUser(null);
                }
            } catch (error) {
                console.error('Failed to load session:', error);
            } finally {
                setTokenChecked(true);
            }
        };

        loadSession();
    }, []);

    useProtectedRoute(user, isLoading);

    const signIn = async (authData: AuthResponse) => {
        try {
            await SecureStore.setItemAsync('userToken', authData.accessToken);
            await SecureStore.setItemAsync('refreshToken', authData.refreshToken);

            // Save to Realm
            realm.write(() => {
                const previousSession = realm.objects('UserProfile');
                realm.delete(previousSession);

                const user = JSON.parse(JSON.stringify(authData.user));
                realm.create('UserProfile', {
                    id: user.id.toString(),
                    username: user.username,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    phone: user.phone || undefined,
                    avatarUrl: user.avatarUrl || undefined,
                    role: user.role,
                    createdAt: user.createdAt,
                });
            });

            // Merge any guest cart items to the newly logged in user account
            await cartService.mergeGuestCart();

            // Emit to force reload cart quantities in the UI
            DeviceEventEmitter.emit('cart_updated');

        } catch (error) {
            console.error('Failed to save session:', error);
            throw error;
        }
    };

    const signOut = async () => {
        try {
            await SecureStore.deleteItemAsync('userToken');
            await SecureStore.deleteItemAsync('refreshToken');

            realm.write(() => {
                const allUsers = realm.objects('UserProfile');
                realm.delete(allUsers);
            });

            // Emit to reset the cart badge back to 0 or guest cart
            DeviceEventEmitter.emit('cart_updated');
        } catch (error) {
            console.error('Failed to clear session:', error);
        }
    };

    const updateUserContext = async (updatedUser: UserProfile) => {
        try {
            realm.write(() => {
                realm.create('UserProfile', {
                    id: updatedUser.id.toString(),
                    username: updatedUser.username,
                    firstName: updatedUser.firstName,
                    lastName: updatedUser.lastName,
                    email: updatedUser.email,
                    phone: updatedUser.phone,
                    avatarUrl: updatedUser.avatarUrl || undefined,
                    role: updatedUser.role,
                    createdAt: updatedUser.createdAt,
                }, Realm.UpdateMode.Modified);
            });
        } catch (error) {
            console.error('Failed to update session:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, signIn, signOut, updateUserContext }}>
            {children}
        </AuthContext.Provider>
    );
}
