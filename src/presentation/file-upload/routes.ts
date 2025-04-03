import { Router } from 'express';
import { AuthMiddlewares } from '../middlewares/auth.middlewares';
import { CategoryService } from '../services/category.service';
import { FileUploadController } from './controller';
import { FileUploadService } from '../services/file-upload.service';
import { FileUploadMiddleware } from '../middlewares/file-upload.middleware';
import { TypeMiddleware } from '../middlewares/type.middleware';




export class FileUploadRoutes {


  static get routes(): Router {

    const router = Router();
    const controller = new FileUploadController(
      new FileUploadService()
    );
    

    router.use( FileUploadMiddleware.containFiles )
    router.use( TypeMiddleware.validTypes(['users', 'products', 'categories']) )
    // Definir las rutas
    router.post('/single/:type', controller.uploadFile );
    router.post('/multiple/:type', controller.uploadFiles );



    return router;
  }

}

