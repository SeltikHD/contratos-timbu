import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    size = 'md',
}) => {
    const getButtonStyles = () => {
        const baseStyles = 'rounded-lg justify-center items-center';

        const variantStyles = {
            primary: 'bg-blue-600 active:bg-blue-700',
            secondary: 'bg-gray-600 active:bg-gray-700',
            outline:
                'border-2 border-blue-600 bg-transparent active:bg-blue-50',
        };

        const sizeStyles = {
            sm: 'px-3 py-2 min-h-[32px]',
            md: 'px-4 py-3 min-h-[44px]',
            lg: 'px-6 py-4 min-h-[52px]',
        };

        return `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]}`;
    };

    const getTextStyles = () => {
        const baseStyles = 'font-semibold text-center';

        const variantStyles = {
            primary: 'text-white',
            secondary: 'text-white',
            outline: 'text-blue-600',
        };

        const sizeStyles = {
            sm: 'text-sm',
            md: 'text-base',
            lg: 'text-lg',
        };

        return `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]}`;
    };

    return (
        <TouchableOpacity onPress={onPress}>
            <View className={getButtonStyles()}>
                <Text className={getTextStyles()}>{title}</Text>
            </View>
        </TouchableOpacity>
    );
};
