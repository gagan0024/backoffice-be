import { NextFunction, Request, Response } from 'express';
import { CloudStorageService} from '../../services/admin/CloudStorageService';
import { CustomError } from '../../exceptions/customError';
import { ClientError } from '../../exceptions/clientError';


class GcpController{
    static getStorageUrl = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Execute the query
            let writeFile:boolean =  req.query.uploadFile === 'true';
            let fileName :string =  req.query.fileName as string;
            let url: string = "";
            if(!fileName) {
                throw new ClientError("fileName is required");
            }

            if(!writeFile)
                url = await CloudStorageService.getSignedUrl(fileName, !writeFile);
            else
                url = await CloudStorageService.generateV4UploadSignedUrl(fileName);
       
            res.send({
                status: 200,
                message: writeFile?"upload/write url generated successfully":"download/read url generated successfully",
                data: {url}
            });
        } catch (e: any) {
            console.log(e);
            throw new ClientError(`error at getSignedUrl: ${e}`);
        }
    };
}

export default GcpController;