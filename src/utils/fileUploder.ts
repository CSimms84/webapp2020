
import fs from "fs";
import AWS from "aws-sdk";

export class FileUploader {
	constructor() {
	}



	public static async  uploadS3(fileName:any, fileContent:any, fileType:any) {

		
		
		
		const s3: any = new AWS.S3({
		});
		const params = {
			Bucket: 'spffiles',
			Key: fileName, // File name you want to save as in S3
			Body: fileContent,
			
			ContentEncoding: 'base64',
			ACL:'public-read',
			ContentType: fileType
		};
	
		// Uploading files to the bucket
		return await s3.putObject(params).promise();
	}

	public static createFileSync(path: string, base64: string) {
		const matches: any = base64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
		const imageBuffer = new Buffer(matches[2], 'base64');
		if (!fs.existsSync(path)) {
			var fd = fs.openSync(path, 'w');
			if (fd) {
				fs.writeSync(fd, imageBuffer);
				fs.closeSync(fd);
			}
		}
		return path;
	}

	public static createFirstFolder(path: string) {
		fs.access(path, (err) => {
			if (!err) {
				
				return;
			}

			fs.mkdir(path, function (e) {
				if (!e || (e && e.code === 'EEXIST')) {
					
				} else {
					//debug
					
				}
			});

		});
	}
}

