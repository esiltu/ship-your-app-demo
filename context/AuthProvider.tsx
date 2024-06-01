import React, { createContext, useContext, useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { getItem } from 'store/storage';
import { useRouter } from 'expo-router';

// Create Auth Context
const AuthContext = createContext<{ isAuthenticated: boolean | null }>({ isAuthenticated: null });

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            const userId = await getItem('@user_id');
            const accessToken = await getItem('@access_token');

            if (userId && accessToken) {
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
            }
        };

        checkAuth();
    }, []);

    useEffect(() => {
        if (isAuthenticated !== null) {
            if (isAuthenticated) {
                router.replace('(dashboard)');
            } else {
                router.replace('(auth)');
            }
        }
    }, [isAuthenticated, router]);

    if (isAuthenticated === null) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
