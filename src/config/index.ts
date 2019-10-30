import ConfigUtil from 'config';

export interface Config {
    server: {
        port: number,
        cors: {
            enable: boolean,
            origin: string,
        },
        version: string,
    }
}

const config: Config  = {
    server: ConfigUtil.get('server'),
};

export default config;
