import { NextFunction, Request, Response } from "express";
import { JwtAdapter } from "../../config";
import { UserModel } from "../../data";
import { UserEntity } from "../../domain";



export class AuthMiddlewares {

    static async validateJWT(req: Request, res: Response, next: NextFunction) {

        const authorization = req.headers['authorization'] as string;

        if ( !authorization ) return res.status(401).json({ error: 'Unauthorized' });
        if ( !authorization.startsWith('Bearer ') ) return res.status(401).json({ error: 'Invalid bearer token' });

        const token = authorization.split(' ').at(1);

        try {
            const payload = await JwtAdapter.validateToken<{ id: string }>(token!);
            if ( !payload ) return res.status(401).json({ error: 'Invalid token' });

            const user = await UserModel.findById(payload.id);
            if ( !user ) return res.status(401).json({ error: 'User not found' });

            //todo : validar si usuario esta activo o no

            req.body.user = UserEntity.fromObject(user);

            next();



        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }

    }


} 
