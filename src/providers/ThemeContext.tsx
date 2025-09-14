import { createContext, useContext, useState } from "react";
import { ConfigProvider, theme, } from "antd";

interface ThemeContextType {
  isDark: boolean;
  switchTheme: (value: boolean) => void;
};

interface ThemeProviderType {
    children: React.ReactNode;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

const ThemeProvider = ({ children }: ThemeProviderType) => {
    const [isDark, setIsDark] = useState(localStorage.getItem('theme') === 'dark');

    const switchTheme = (value: boolean) => {
        setIsDark(value);
        localStorage.setItem('theme', value ? 'dark' : 'light');
    };

    return (
        <ConfigProvider
            theme={{
                algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
                components: {
                    Layout: {
                        headerBg: isDark ? '#141414' : '#fff',
                        headerColor: isDark ? '#ffffffd9' : '#000'
                    }
                }
            }}
        >
            <ThemeContext.Provider value={{ isDark, switchTheme }}>
                {children}
            </ThemeContext.Provider>
        </ConfigProvider>
    );
}

const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used inside Antd ThemeProvider");
  return context;
};

export {
    ThemeProvider,
    useTheme
}