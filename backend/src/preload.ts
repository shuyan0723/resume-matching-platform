import * as dotenv from 'dotenv';
import * as path from 'path';

/**
 * 在任何其他模块之前同步加载 .env 文件
 * 这样 JwtModule.register() 等同步装饰器就能正确读取 process.env.*
 */
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
