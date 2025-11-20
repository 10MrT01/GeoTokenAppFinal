import React from 'react';
import { Platform } from 'react-native';

// This is a simple implementation, often used to prevent hydration errors in Expo Router
// when a value should only be used on the client (like header visibility).
export function useClientOnlyValue<T, U>(client: T, server: U): T | U {
  // If running on web, use the server value until the client side loads.
  return Platform.OS !== 'web' ? client : server;
}