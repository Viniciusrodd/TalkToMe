
// libs
import type { Config } from 'jest';

// config
const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/src/tests/**/*.test.ts'],
    moduleFileExtensions: ['ts', 'js', 'json'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest', // garante que arquivos .ts/.tsx sejam transformados
    },
    globals: {
        'ts-jest': {
            isolatedModules: true,
        },
    },
};

// exports
export default config;