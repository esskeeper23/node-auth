import { bcryptAdapter, envs, JwtAdapter } from "../../config";
import { UserModel } from "../../data";
import { CustomError, LoginUserDto, RegisterUserDto, UserEntity } from "../../domain";
import { EmailService } from "./email.service";



export class AuthService {

    // DI
    constructor(
        // DI - Email Service
        private readonly emailService: EmailService
    ) {}


    public async registerUser( registerUserDto: RegisterUserDto )  {
    
        const existUser = await UserModel.findOne({ email: registerUserDto.email });
        if ( existUser ) throw CustomError.badRequest('Email already exist');

        try {
            const user = new UserModel(registerUserDto)

            // Encriptar contraseña
            user.password = bcryptAdapter.hash( registerUserDto.password )


            await user.save();


            // Verificar email
            await this.sendEmailValidation(user.email)



            const {password, ...userEntity} = UserEntity.fromObject(user)

            const token = await JwtAdapter.generateToken({id: user.id});
            if ( !token ) throw CustomError.internalServer('Error generating token');

            return {
                user: userEntity,
                token: token
            };
        } catch (error) {
            throw CustomError.internalServer(`${ error }`)
        }

    }


    public async loginUser( loginUserDto: LoginUserDto) {

        const user = await UserModel.findOne({ email: loginUserDto.email });
        if ( !user ) throw CustomError.badRequest(`User with email: ${loginUserDto.email} not found`);

        const isMatch = bcryptAdapter.compare(loginUserDto.password, user.password )
        if ( !isMatch ) throw CustomError.badRequest('Wron password')
        
        const { password,  ...userEntity} = UserEntity.fromObject(user)

        const token = await JwtAdapter.generateToken({id: user.id});
        if ( !token ) throw CustomError.internalServer('Error generating token');
        
        return {
            user: userEntity,
            token: token
        }
    }

    private sendEmailValidation = async( email: string ) => {
        const token = await JwtAdapter.generateToken({email: email});
        if ( !token ) throw CustomError.internalServer('Error generating token');

        const link = `${ envs.WEBSERVICE_URL }/auth/validate-email/${ token }`;
        const html = `<a href="${ link }">Click here to validate your email</a>`;

        const options = {
            to: email,
            subject: 'Email validation',
            htmlBody: html
        }

        const result = await this.emailService.sendEmail(options);
        if ( !result ) throw CustomError.internalServer('Error sending email');

        return true;
    }

    public validateEmail = async (token: string) => {

        const payload = await JwtAdapter.validateToken(token);
        if ( !payload ) throw CustomError.unauthorized('Invalid token');
    
        const { email } = payload as { email: string } ;
        if ( !email ) throw CustomError.internalServer('Error validating email');
    
        const user = await UserModel.findOne({ email: email });
        if ( !user ) throw CustomError.internalServer('User not found');
    
        user.isValidated = true;
        await user.save();
    
        return true;
    
      }

}