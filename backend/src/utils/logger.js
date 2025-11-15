import { env } from '../libs/env.js';

/**
 * Simple logger utility
 * In production, consider using a proper logging library like winston
 */
class Logger {
    log(level, message, ...args) {
        const timestamp = new Date().toISOString();
        const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

        switch (level) {
            case 'error':
                console.error(prefix, message, ...args);
                break;
            case 'warn':
                console.warn(prefix, message, ...args);
                break;
            case 'info':
                console.info(prefix, message, ...args);
                break;
            case 'debug':
                if (env.NODE_ENV === 'development') {
                    console.debug(prefix, message, ...args);
                }
                break;
            default:
                console.log(prefix, message, ...args);
        }
    }

    error(message, ...args) {
        this.log('error', message, ...args);
    }

    warn(message, ...args) {
        this.log('warn', message, ...args);
    }

    info(message, ...args) {
        this.log('info', message, ...args);
    }

    debug(message, ...args) {
        this.log('debug', message, ...args);
    }
}

export const logger = new Logger();

