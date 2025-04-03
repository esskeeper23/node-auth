import { UploadedFile } from "express-fileupload";
import path from "path";
import fs from "fs";
import { Uuid } from "../../config";
import { CustomError } from "../../domain";



export class FileUploadService {

    constructor(
        private readonly uuid = Uuid.v4
    ) {}

    private chechFolder( folderPath: string ) {
        if ( !fs.existsSync(folderPath) ) {
            fs.mkdirSync(folderPath)
        }
    }

    async uploadSingleFile(
        file: UploadedFile,
        folderPath: string = 'uploads',
        validExtensions: string[] = ['jpg', 'png', 'jpeg'],
    ) {

        try {
            const fileExtension = file.mimetype.split('/').at(1) || '';
            if( !validExtensions.includes(fileExtension) ) {
                throw CustomError.badRequest(`File extension ${fileExtension} not allowed`)
            }


            const destination = path.resolve( __dirname, '../../../', folderPath )
            this.chechFolder(destination)

            const fileName = `${this.uuid()}.${fileExtension}`

            file.mv(`${destination}/${fileName}`)

            return { fileName }

        } catch (error) {
            throw error;
        }
        

    }

    uploadMultipleFiles(
        file: any[],
        folderPath: string = 'uploads',
        validExtensions: string[] = ['.jpg', '.png', '.jpeg'],
    ) {}

}