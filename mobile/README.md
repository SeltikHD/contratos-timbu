# Mobile App - React Native com Expo

Este é o aplicativo mobile do projeto Contratos Timbu, desenvolvido com React Native, Expo e NativeWind (Tailwind CSS).

## 🚀 Tecnologias

- **React Native** - Framework para desenvolvimento mobile
- **Expo** - Plataforma para desenvolvimento React Native
- **TypeScript** - Linguagem de programação
- **NativeWind** - Tailwind CSS para React Native
- **ESLint** - Linter para qualidade de código
- **Prettier** - Formatador de código

## 📦 Instalação

```bash
# Instalar dependências
pnpm install

# Iniciar o servidor de desenvolvimento
pnpm start
```

## 🛠️ Scripts Disponíveis

```bash
# Desenvolvimento
pnpm start          # Iniciar Expo DevTools
pnpm android        # Executar no Android
pnpm ios            # Executar no iOS
pnpm web            # Executar no navegador

# Qualidade de código
pnpm lint           # Verificar problemas de linting
pnpm lint:fix       # Corrigir problemas de linting automaticamente
pnpm format         # Formatar código com Prettier
pnpm format:check   # Verificar formatação sem modificar arquivos
```

## 🎨 Estilização com NativeWind

Este projeto usa NativeWind, que permite usar classes do Tailwind CSS diretamente nos componentes React Native:

```tsx
import { View, Text } from 'react-native';

export default function MyComponent() {
    return (
        <View className='flex-1 bg-blue-500 justify-center items-center'>
            <Text className='text-white text-xl font-bold'>
                Hello NativeWind!
            </Text>
        </View>
    );
}
```

## 📁 Estrutura do Projeto

```text
mobile/
├── App.tsx              # Componente principal
├── global.css           # Estilos globais do Tailwind
├── babel.config.js      # Configuração do Babel
├── metro.config.js      # Configuração do Metro Bundler
├── tailwind.config.js   # Configuração do Tailwind CSS
├── .eslintrc.js         # Configuração do ESLint
├── .prettierrc          # Configuração do Prettier
└── package.json         # Dependências e scripts
```

## ⚙️ Configurações

### ESLint

Configurado com regras específicas para React Native e Expo, incluindo:

- Regras de TypeScript
- Regras do React e React Hooks
- Integração com Prettier
- Regras de qualidade de código

### Prettier

Configurado com formatação consistente:

- Aspas simples
- Semicolons
- Tab width: 2 espaços
- Trailing commas em ES5
- Quebra de linha em 80 caracteres

### NativeWind

Configurado para funcionar com:

- TypeScript (tipos incluídos)
- Metro Bundler
- Babel
- Expo

## 🔧 Desenvolvimento

1. **Formatação automática**: O código será formatado automaticamente ao salvar se você tiver a extensão do Prettier no VS Code
2. **Linting**: Execute `pnpm lint` para verificar problemas de código
3. **Classes Tailwind**: Use classes do Tailwind normalmente nos componentes React Native
4. **Hot Reload**: Alterações serão refletidas automaticamente no app

## 📱 Executando o App

1. Instale o Expo Go no seu dispositivo móvel
2. Execute `pnpm start`
3. Escaneie o QR Code com o Expo Go (Android) ou câmera do iPhone (iOS)

## 🎯 Próximos Passos

- [ ] Configurar navegação (React Navigation)
- [ ] Implementar temas escuro/claro
- [ ] Adicionar componentes UI reutilizáveis
- [ ] Configurar gerenciamento de estado
- [ ] Implementar autenticação
