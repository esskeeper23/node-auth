import { CustomError } from "../error/custom.error";



export class UserEntity {

    constructor(
        public id: string,
        public name: string,
        public email: string,
        public isValidated: boolean,
        public password: string,
        public role: string[],
        public img?: string,
    ) {}


    static fromObject( object: {[key:string]:any} ) {

        const { id, _id, name, email, isValidated, password, role, img } = object;

        if ( !_id && !id ) {
            throw CustomError.badRequest('Missing id');
        }

        if ( !name ){ throw CustomError.badRequest('Mising name') }
        if ( !email ){ throw CustomError.badRequest('Mising email') }
        if ( isValidated === undefined ){ throw CustomError.badRequest('Mising isValidated') }
        if ( !password ){ throw CustomError.badRequest('Mising password') }
        if ( !role ){ throw CustomError.badRequest('Mising role') }


        return new UserEntity ( _id || id, email, name, password, isValidated, role, img );
    }

}