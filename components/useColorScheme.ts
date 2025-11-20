import { ColorSchemeName, useColorScheme as useColorSchemeNative } from 'react-native';

export function useColorScheme(): ColorSchemeName {
  return useColorSchemeNative();
}