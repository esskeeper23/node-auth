import { Validators } from "../../../config";



export class CreateProductDto {

    private constructor(
        public readonly name: string,
        public readonly price: number,
        public readonly description: string,
        public readonly available: boolean,
        public readonly user: string,//ID
        public readonly category: string,//ID
    ) {}


    static create( props: { [key:string]:any }): [string?, CreateProductDto? ] {

        const { 
            name, 
            price,
            description,
            available,
            user,
            category } = props;

        if ( !name ) return ['Missing name'];

        if ( !user ) return ['Missing user'];
        if ( !Validators.isMongoId(user) ) return ['User ID is not valid'];

        if ( !category ) return ['Missing category'];
        if ( !Validators.isMongoId(category) ) return ['Category ID is not valid'];

        return [
            undefined, 
            new CreateProductDto(
                name, 
                price, 
                description, 
                !!available, 
                user, 
                category)];

    }

}