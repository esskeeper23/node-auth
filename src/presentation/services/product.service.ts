import { CategoryModel, ProductModel } from "../../data";
import { CreateProductDto } from '../../domain/dtos/products/create-product.dto';
import {
  CustomError,
  PaginationDto,
} from "../../domain";

export class ProductService {
  constructor() {}

  async createProduct(createProductDto: CreateProductDto) {


    try {
      const product = new ProductModel(createProductDto);
      await product.save();

      return product;
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  async getProducts(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    try {
      const [total, products] = await Promise.all([
        ProductModel.countDocuments(),
        ProductModel.find()
          .skip((page - 1) * limit)
          .limit(limit)
          .populate('user')
      ]);

      return {
        page: page,
        limit: limit,
        total: total,
        next: `/api/products?page=${page + 1}&limit=${limit}`,
        prev: page === 1 ? null : `/api/products?page=${page - 1}&limit=${limit}`,

        products: products
      };
    } catch (error) {
      throw CustomError.internalServer("Internal Server Error");
    }
  }
}
