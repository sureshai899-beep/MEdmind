import React, { Component, ReactNode, ErrorInfo } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { captureException, setContext } from '../../services/sentry';

interface Props {
    children: ReactNode;
    fallback?: (error: Error, resetError: () => void) => ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    static getDerivedStateFromError(error: Error): State {
        return {
            hasError: true,
            error,
            errorInfo: null,
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // Log error to console
        console.error('ErrorBoundary caught an error:', error, errorInfo);

        // Update state with error info
        this.setState({
            error,
            errorInfo,
        });

        // Send error to Sentry
        setContext('errorInfo', {
            componentStack: errorInfo.componentStack,
        });
        captureException(error, {
            errorBoundary: true,
            componentStack: errorInfo.componentStack,
        });
    }

    resetError = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        });
    };

    render() {
        if (this.state.hasError && this.state.error) {
            // Use custom fallback if provided
            if (this.props.fallback) {
                return this.props.fallback(this.state.error, this.resetError);
            }

            // Default error UI
            return (
                <SafeAreaView className="flex-1 bg-background-primary">
                    <ScrollView className="flex-1 px-6 py-8">
                        <View className="items-center mb-8">
                            <Text className="text-6xl mb-4">⚠️</Text>
                            <Text className="text-text-primary text-2xl font-bold mb-2">
                                Oops! Something went wrong
                            </Text>
                            <Text className="text-text-secondary text-center">
                                We're sorry for the inconvenience. The app encountered an unexpected error.
                            </Text>
                        </View>

                        {__DEV__ && (
                            <View className="bg-background-secondary p-4 rounded-2xl mb-6 border border-ui-border">
                                <Text className="text-text-primary font-bold mb-2">Error Details:</Text>
                                <Text className="text-status-missed text-sm mb-2">
                                    {this.state.error.toString()}
                                </Text>
                                {this.state.errorInfo && (
                                    <Text className="text-text-secondary text-xs">
                                        {this.state.errorInfo.componentStack}
                                    </Text>
                                )}
                            </View>
                        )}

                        <TouchableOpacity
                            onPress={this.resetError}
                            className="bg-primary py-4 rounded-2xl items-center mb-4"
                        >
                            <Text className="text-background-primary font-bold text-lg">
                                Try Again
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => {
                                // TODO: Navigate to home or restart app
                                this.resetError();
                            }}
                            className="py-3 items-center"
                        >
                            <Text className="text-text-secondary font-medium">
                                Go to Home
                            </Text>
                        </TouchableOpacity>
                    </ScrollView>
                </SafeAreaView>
            );
        }

        return this.props.children;
    }
}
