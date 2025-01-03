// src/types/express.d.ts

import { Auth } from "./src/entities/administration/Auth";
import { Request } from 'express';

declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}
