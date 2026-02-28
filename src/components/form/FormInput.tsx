import React, { useState } from "react";
import { View, Text, TextInput } from "react-native";
import { cn } from "../../utils";
import { colors } from "../../constants/Colors";

export interface FormInputProps {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    multiline?: boolean;
    className?: string;
    error?: string;
    secureTextEntry?: boolean;
    keyboardType?: "default" | "email-address" | "numeric" | "phone-pad" | "number-pad" | "decimal-pad";
    maxLength?: number;
    autoCapitalize?: "none" | "sentences" | "words" | "characters";
    testID?: string;
}

export const FormInput: React.FC<FormInputProps> = ({
    label,
    value,
    onChangeText,
    placeholder,
    multiline = false,
    className,
    error,
    secureTextEntry,
    keyboardType = "default",
    maxLength,
    autoCapitalize = "none",
    testID,
}) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <View className={cn("w-full mb-lg", className)}>
            <Text className="text-text-tertiary text-body-sm font-semibold mb-xs ml-xs uppercase tracking-wider">
                {label}
            </Text>
            <View
                className={cn(
                    "w-full bg-background-secondary rounded-xl border px-md",
                    error ? "border-status-missed" : isFocused ? "border-primary" : "border-ui-border",
                    multiline ? "py-md min-h-[120px]" : "h-14 justify-center"
                )}
            >
                <TextInput
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor={colors.text.muted}
                    multiline={multiline}
                    secureTextEntry={secureTextEntry}
                    keyboardType={keyboardType}
                    maxLength={maxLength}
                    autoCapitalize={autoCapitalize}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    testID={testID}
                    style={{
                        color: colors.text.primary,
                        fontSize: 16,
                        textAlignVertical: multiline ? "top" : "center",
                    }}
                    className="text-text-primary text-body"
                />
            </View>
            {error && (
                <Text className="text-status-missed text-caption mt-xs ml-xs font-medium">
                    {error}
                </Text>
            )}
        </View>
    );
};
