import { Router } from 'express';
import { AuthMiddlewares } from '../middlewares/auth.middlewares';
import { CategoryService } from '../services/category.service';
import { FileUploadController } from './controller';
import { FileUploadService } from '../services/file-upload.service';




export class FileUploadRoutes {


  static get routes(): Router {

    const router = Router();
    const service = new FileUploadService()
    const controller = new FileUploadController(service);
    
    // Definir las rutas
    router.post('/single/:type', controller.uploadFile );
    router.post('/multiple/:type', controller.uploadFiles );



    return router;
  }

}

