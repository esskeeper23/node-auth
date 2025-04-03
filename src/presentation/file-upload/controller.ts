import { Request, Response } from "express" 
import { CustomError } from "../../domain"
import { FileUploadService } from "../services/file-upload.service"
import { UploadedFile } from "express-fileupload"




export class FileUploadController {

    // DI
    constructor(
        private readonly fileUploadService: FileUploadService
    ) {}

    private hanldeError = ( error: unknown, res: Response)  => {
        if ( error instanceof CustomError ) {
            return res.status(error.statusCode).json({ error: error.message })
        }


        console.log(`${error}`)
        return res.status(500).json({ error: 'Internal server error' })
    };


    uploadFile = (req: Request, res: Response) => {

        const type = req.params.type
        const validTypes = ['users', 'products', 'categories']
        if ( !validTypes.includes(type) ) {
            return res.status(400).json({ error: `Type ${type} not allowed` })
        }
        

        if ( !req.files || Object.keys(req.files).length === 0 ) {
            return res.status(400).json({ error: 'No files were uploaded.' });
        }

        const file = req.files.file as UploadedFile;

        this.fileUploadService.uploadSingleFile( file, `uploads/${type}` )
            .then( uploaded => res.json(uploaded))
            .catch( error => this.hanldeError(error, res) )

    };


    uploadFiles = (req: Request, res: Response) => {

        res.json('uploadFiles');

    };


}