"use client";

import EmojiPicker, { Theme } from 'emoji-picker-react';
import { useTheme } from 'next-themes';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

interface IconPickerProps {
    asChild?: boolean;
    children: React.ReactNode;
    onChange: (icon: string) => void;
}

const IconPicker = ({
    asChild,
    children,
    onChange
}: IconPickerProps) => {
    const { resolvedTheme } = useTheme();
    const currentTheme = (resolvedTheme || "light") as keyof typeof themeMap;

    const themeMap = {
        "dark": Theme.DARK,
        "light": Theme.LIGHT,
    };

    const theme = themeMap[currentTheme];

    return ( 
        <Popover>
            <PopoverTrigger asChild={asChild}>
                {children}
            </PopoverTrigger>
            <PopoverContent className='p-0 w-full border-none shadow-none'>
                <EmojiPicker
                    height={350}
                    theme={theme}
                    onEmojiClick={(data) => onChange(data.emoji)}
                />
            </PopoverContent>
        </Popover>
     );
}
 
export default IconPicker;