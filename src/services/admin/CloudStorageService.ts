
import { Storage } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import config from '../../config';

export class CloudStorageService {
  static  defaultExpires = 60 * 60 * 2; // 2 hours
  static defaultContentType = 'application/octet-stream';
  
  private static __storage: Storage;
  static get storage() {
      if (!CloudStorageService.__storage)
          CloudStorageService.__storage = new Storage({ keyFilename: CloudStorageService.getGCPPrivateKey() });
      return CloudStorageService.__storage.bucket(CloudStorageService.getClientProjectBucketName());
  }

  static async getSignedUrl(fileName:string, isPublic = false,) {
      let returnUrl:string = "";
      const[ url ]= await CloudStorageService.storage
              .file(fileName)
              .getSignedUrl(CloudStorageService.getStorageOptions());
              returnUrl= url;
      return returnUrl;
  }

  static async generateV4UploadSignedUrl(fileName: string = uuidv4()) {
    let returnUrl:string = "";
    const [url] =  await CloudStorageService.storage
    .file(fileName)
    .getSignedUrl(CloudStorageService.getStorageOptions(false))
    returnUrl = url;
    return returnUrl;
  }


static getStorageOptions(readOnly = true) {
    return {
        version: 'v4' as 'v4',
        action: (readOnly? 'read':'write') as 'read' | 'write' | 'delete' | 'resumable',
        expires: Date.now() + CloudStorageService.defaultExpires,
        contentType: readOnly?'application/octet-stream' :'application/octet-stream',
      };
}

  static getBucketName() {
        return config.GCP_BUCKET_NAME || '';
  }

  static getClientProjectBucketName() {
        return (CloudStorageService.getBucketName() +"/client-projects")|| '';
  }
  static getGCPProjectId() {
        return config.GCP_PROJECT_ID || '';
  }

  static getGCPPrivateKey() {
      if (!config.GOOGLE_APPLICATION_CREDENTIALS) {
          throw new Error('GOOGLE_APPLICATION_CREDENTIALS is not defined in the environment variables.');
      }
      let keyPath = path.join(__dirname, (config.GOOGLE_APPLICATION_CREDENTIALS));
      return keyPath;
  }
}