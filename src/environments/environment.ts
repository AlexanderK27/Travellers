import { AppEnvironment } from './interface';
import { ENV_CONFIG } from './env_constants';

export const environment: AppEnvironment = {
    ...ENV_CONFIG,
    production: false,
};
