import { AzureLogger, setLogLevel } from '@azure/logger'; // redirect log output

const logs: string[] = [];

export const initLogger = (): void => {
    AzureLogger.log = (...args): void => {
        logs.push(...args);
    };
    setLogLevel('info');
};

export const getLogs = (): string[] => {
    return logs;
};
