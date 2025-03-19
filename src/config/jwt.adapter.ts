import jwt from 'jsonwebtoken';
import { envs } from './envs';


const JWT_SECRET = envs.JWT_SECRET


export class JwtAdapter {

    static async generateToken(payload: any) {

        return new Promise( (resolve) => { 
            jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
                
                if ( err ) return resolve(null);

                return resolve(token);

            });

        } )


    }
    static validateToken(token: string) {
        return ;
    }

}