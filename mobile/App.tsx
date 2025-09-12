import { StatusBar } from 'expo-status-bar';
import { Alert, Text, View } from 'react-native';
import './global.css';
import { Button } from './src/components';

export default function App() {
    const handlePress = () => {
        Alert.alert(
            'NativeWind + Prettier + ESLint',
            'Configuração funcionando!'
        );
    };

    return (
        <View className='flex-1 bg-gradient-to-b from-blue-50 to-blue-100 items-center justify-center px-6'>
            <View className='bg-white rounded-xl shadow-lg p-8 w-full max-w-sm'>
                <Text className='text-2xl font-bold text-gray-800 text-center mb-2'>
                    Contratos Timbu
                </Text>
                <Text className='text-base text-gray-600 text-center mb-8'>
                    App Mobile configurado com NativeWind, Prettier e ESLint
                </Text>

                <View className='space-y-4'>
                    <Button
                        title='Testar Configuração'
                        onPress={handlePress}
                        variant='primary'
                        size='lg'
                    />

                    <Button
                        title='Botão Secundário'
                        onPress={handlePress}
                        variant='secondary'
                        size='md'
                    />

                    <Button
                        title='Botão Outline'
                        onPress={handlePress}
                        variant='outline'
                        size='md'
                    />
                </View>
            </View>

            <StatusBar style='auto' />
        </View>
    );
}
