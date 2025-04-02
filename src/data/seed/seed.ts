import { envs } from "../../config";
import { CategoryModel } from "../mongo/models/category.model";
import { ProductModel } from "../mongo/models/product.model";
import { UserModel } from "../mongo/models/user.model";
import { MongoDatabase } from "../mongo/mongo-db";
import { seedData } from "./data";




( async () => {
    await MongoDatabase.connect({
        dbName: envs.MONGO_DB_NAME,
        mongoUrl: envs.MONGO_URL
    });

    await maim();

    await MongoDatabase.disconnect();
})();

const randomBetween0and1 = ( x: number ) => {
    return Math.floor( Math.random() * x )
}


async function maim() {

    //0 eliminar todo
    await Promise.all([
        UserModel.deleteMany(),
        CategoryModel.deleteMany(),
        ProductModel.deleteMany()
    ]);

    //a crear usuarios
    const users = await UserModel.insertMany( seedData.users )

    //2 crear categorias

    const categories = await CategoryModel.insertMany(
        seedData.categories.map( category => {
            return { 
                ...category,
                user: users[0]._id
            }
        } )
    )


    //3 crear productos
    const product = await ProductModel.insertMany(
        seedData.products.map( product => {

            return { 
                ...product,
                user: users[ randomBetween0and1( seedData.users.length - 1 ) ]._id,
                category: categories[ randomBetween0and1( seedData.categories.length - 1) ]._id
            }

        } )
    )
    
}