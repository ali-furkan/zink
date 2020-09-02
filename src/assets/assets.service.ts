import "@firebase/storage";
import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as firebase from "firebase";
import { UsersService } from "src/api/users/user.service";
import * as sharp from "sharp";
import { v4 as uuidV4 } from "uuid";
import path from "path"
import * as mime from "mime-types"
import got from "got"

@Injectable()
export class AssetsService {
    private readonly FirebaseInstance = firebase.initializeApp(
        this.configService.get("Firebase"),
    );
    private readonly StorageInstance = this.FirebaseInstance.storage();
    private readonly FirebaseStorage = this.StorageInstance.ref();

    private readonly imgExt = ["jpeg","jpg","png","tiff","webp","bmp"]

    constructor(
        private readonly userService: UsersService,
        private readonly configService: ConfigService,
    ) {}

    async upload(
        file: {
            fieldname: string;
            originalname: string;
            encoding: string;
            buffer: Buffer;
        },
        priv?: boolean,
    ): Promise<Zink.Response> {
        const id = uuidV4()
        let ext = path.extname(file.originalname)
        const name = path.basename(file.originalname,ext)
        let buff = file.buffer
        const storagePath = `assets/${priv?"dev":"public"}/${id}/${name}.${ext}`
        const fileRef = this.FirebaseStorage.child(storagePath)
        if(this.imgExt.includes(ext)) {
            buff = await sharp(file.buffer)
                .webp({ quality: priv ? 100 : 70 })
                .toBuffer();
            ext = "webp"
        }
        await fileRef.put(buff,{ contentEncoding:file.encoding,contentType:mime.lookup(ext)||"text/plain; charset=utf-8" })
        
        return { message: "Successfully Uploaded Image", path: storagePath};
    }

    async get(rootPath:string,id:string,name:string): Promise<Buffer> {
        const ref = this.FirebaseStorage.child(`assets/${rootPath}/${id}/${name}`)
        try {
            const fileURI:string = await ref.getDownloadURL()
            const buff = (await got(fileURI)).rawBody
            return buff
        } catch (e) {
            throw new NotFoundException("File Not Found")
        }
    }

    async delete(path: string): Promise<Zink.Response> {
        const ref = this.FirebaseStorage.child(`assets/${path}`);
        try {
            await ref.delete();
            return { message: "Successfully Deleted File" };
        } catch (e) {
            throw new NotFoundException("File Not Found");
        }
    }
}
