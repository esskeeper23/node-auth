import { UploadedFile } from "express-fileupload";
import path from "path";
import fs from "fs";



export class FileUploadService {

    constructor() {}

    private chechFolder( folderPath: string ) {
        if ( !fs.existsSync(folderPath) ) {
            fs.mkdirSync(folderPath)
        }
    }

    async uploadSingleFile(
        file: UploadedFile,
        folderPath: string = 'uploads',
        validExtensions: string[] = ['.jpg', '.png', '.jpeg'],
    ) {

        try {
            const fileExtension = file.mimetype.split('/').at(1);
            const destination = path.resolve( __dirname, '../../../', folderPath )
            this.chechFolder(destination)

            file.mv(destination + `/mi-image.${fileExtension}`)

        } catch (error) {
            console.log(error)
        }
        

    }

    uploadMultipleFiles(
        file: any[],
        folderPath: string = 'uploads',
        validExtensions: string[] = ['.jpg', '.png', '.jpeg'],
    ) {}

}