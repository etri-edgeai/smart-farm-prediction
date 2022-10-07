import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { promises as fs } from 'fs';
import * as path from 'path';
import { LogWrapper } from './log-wrapper';

export interface DbConfig {
  type: any;
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

export interface RedisConfig {
  host: string;
  port: number;
  password?: string;
  retryAttempts?: number;
  retryDelay?: number;
}

@Injectable()
export class CommonConfigService {
  root: string; // running path
  logLevel: string;
  typeormLogEnabled: boolean;
  serverId: number; // global unique id
  apiUrl: string; // global cloud api url. default: https://api.farmcloud.kr
  localApiPort: number; // local api server port. default: 8100

  db: DbConfig;
  redis: RedisConfig;
  apiRedis: RedisConfig;

  constructor(public config: ConfigService) {
    this.root = CommonConfigService.getRoot();
    this.serverId = +this.config.get("SERVER_ID");
    this.apiUrl = this.config.get("API_URL", "https://api.farmcloud.kr");
    this.localApiPort = +this.config.get("LOCAL_API_PORT", 8100);
    this.logLevel = this.config.get("LOG_LEVEL", "info");
    LogWrapper.setLogLevel(this.logLevel);
    this.typeormLogEnabled = this.config.get("TYPEORM_LOG_ENABLED", false);
    this.typeormLogEnabled = this.typeormLogEnabled && this.config.get("TYPEORM_LOG_ENABLED", false) != 'false';

    this.db = {
      type: this.config.get("DB_TYPE"),
      host: this.config.get("DB_HOST"),
      port: this.config.get("DB_PORT"),
      username: this.config.get("DB_USER"),
      password: this.config.get("DB_PASSWORD"),
      database: this.config.get("DB_DATABASE")
    };

    this.redis = {
      host: this.config.get("REDIS_HOST", "localhost"),
      port: +this.config.get("REDIS_PORT", 6379),
      password: this.config.get("REDIS_PASS", ".fc12#$"),
      retryAttempts: 100,
      retryDelay: 2000
    };

    this.apiRedis = {
      host: this.config.get("API_REDIS_HOST", "api.farmcloud.kr"),
      port: +this.config.get("API_REDIS_PORT", 6379),
      password: this.config.get("API_REDIS_PASS", ".fc12#$"),
      retryAttempts: 100,
      retryDelay: 2000
    }
  }

  static getAppName() {
    const appName = __dirname.substring(__dirname.lastIndexOf(path.sep) + 1);
    return appName;
  }

  static getRoot() {
    const sep =  path.sep;
    let root = path.join(__dirname, "..");
    const pos = root.indexOf(sep + "dist");
    if (pos > 0) {  // for debugging, set devenv as running root path
      root = path.join(root.substring(0, pos), "devenv");
    } else if (root.endsWith(sep + "config")) { // for testing 
      root = path.join(root, "..", "..", "devenv");
    }
    return root;
  }

  static getConfigFile() {
    let PARAM_CONFIG_FILE = process.argv.slice(2)[0];
    if (PARAM_CONFIG_FILE && !PARAM_CONFIG_FILE.endsWith(".conf")) {
      PARAM_CONFIG_FILE = null;
    }

    const file = PARAM_CONFIG_FILE ? PARAM_CONFIG_FILE : path.join(CommonConfigService.getRoot(), 'config', 'common.conf');
    Logger.log("Common config file: " + file);
    return file;
  }

  static getAppConfigFile() {
    const file = path.join(CommonConfigService.getRoot(), 'config', CommonConfigService.getAppName() + '.conf')
    Logger.log("App config file: " + file);
    return file;
  }

  getTypeOrmCacheOption(): {type: any, options: any} {
    return {
      type: "ioredis",
      options: this.redis
    };
  }

  /**
   * load json with filename
   * @param fileName except parents path in config directory
   * @returns json object
   */
  async loadJsonFile(fileName: string) {
    const file = path.join(this.root, 'config', fileName);
    const jsonFile = await fs.readFile(file, 'utf8');
    return JSON.parse(jsonFile);
  }

  async saveJsonFile(fileName: string, data: unknown) {
    const file = path.join(this.root, 'config', fileName);
    await fs.writeFile(file, JSON.stringify(data));
  }
}