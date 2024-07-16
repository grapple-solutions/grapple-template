import { Getter, inject } from "@loopback/core";

import { repository } from "@loopback/repository";
import {
  post,
  Request,
  requestBody,
  Response,
  RestBindings,
} from "@loopback/rest";
import AWS from "aws-sdk";
import fetch from "node-fetch";
import { FILE_UPLOAD_SERVICE } from "../keys";
import { FileUploadHandler } from "../types";

// @ts-ignore
import imgToPDF from "image-to-pdf";

// @ts-ignore
import PDFMerger from "pdf-merger-js";

// @ts-ignore
import api from "api";
const sdk = api("@sensiblehq/v0#f3nnpyblno1pufi");

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
  signatureVersion: "v4",
  region: process.env.AWS_S3_REGION ?? "eu-central-1",
});

const skipDocumentProcessing = process.env.SKIP_DOCUMENT_PROCESSING === "true";

// sdk.auth(process.env.SENSIBLE_KEY);
const availableKeys = process.env.AVAILABLE_KEYS?.split(",") ?? [];

/**
 * A controller to handle file uploads using multipart/form-data media type
 */
export class SensibleController {
  /**
   * Constructor
   * @param handler - Inject an express request handler to deal with the request
   */
  constructor(
    @inject(FILE_UPLOAD_SERVICE) private handler: FileUploadHandler,
    @repository.getter("PurchasereceiptsRepository")
    protected purchaseReceiptRepositoryGetter: () => Promise<any>
  ) {}
  @post("/extractData", {
    responses: {
      200: {
        content: {
          "application/json": {
            schema: {
              type: "object",
            },
          },
        },
        description: "Files and fields",
      },
    },
  })
  async extractData(
    @requestBody.file()
    request: Request,
    @inject(RestBindings.Http.RESPONSE) response: Response
  ): Promise<object> {
    return new Promise<object>((resolve, reject) => {
      // eslint-disable-next-line @typescript-eslint/no-misused-promises

      this.handler(request, response, async (err: unknown) => {
        if (err) reject(err);
        else {
          const purchaseReceipt = await this.purchaseReceiptRepositoryGetter();

          let currentlyActiveKeyIndex = Math.floor(
            Math.random() * availableKeys.length
          );
          let tries = 0;
          while (currentlyActiveKeyIndex < availableKeys.length) {
            try {
              const files = await SensibleController.getFilesAndFields(
                request,
                availableKeys[currentlyActiveKeyIndex],
                purchaseReceipt
              );
              resolve(files ?? {});
              if (currentlyActiveKeyIndex < availableKeys.length - 1) {
                currentlyActiveKeyIndex++;
              } else {
                currentlyActiveKeyIndex = 0;
              }
              return;
            } catch (e) {
              console.log({ e });
              if (e.status === 429 && tries < 3) {
                console.log("rate limit exceeded");
                if (currentlyActiveKeyIndex < availableKeys.length - 1) {
                  currentlyActiveKeyIndex++;
                  tries++;
                } else {
                  currentlyActiveKeyIndex = 0;
                  tries++;
                }
                continue;
              }

              const response = await SensibleController.onlyUploadFiles(
                request,
                purchaseReceipt
              );

              resolve(response ?? {});
              return;
            }
          }
        }
      });
    });
  }

  private static async uploadFile(
    file: globalThis.Express.Multer.File,
    url: string
  ) {
    const response = await fetch(url, {
      method: "PUT",
      body: file.buffer,
    });

    await s3
      .upload({
        Bucket: process.env.AWS_S3_BUCKET_NAME ?? "mbd-staging",
        Key: `${process.pid}/${Math.floor(Math.random() * 1000000)}/${
          file.originalname
        }`,
        Body: file.buffer,
      })
      .promise();

    console.log({ response: await response.text() });
  }

  private static async processAndUploadFiles(
    receiptId: string,
    files: globalThis.Express.Multer.File[],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    response: any
  ) {
    try {
      const fileUrls: any = {
        singleFiles: [],
      };
      await Promise.all(
        files.map(async (file) => {
          // upload the files to s3 with the receiptId in the key
          const { Location: singleFileLocation } = await s3
            .upload({
              Bucket: process.env.AWS_S3_BUCKET_NAME ?? "mbd-staging",
              Key: `${receiptId}/${file.originalname}`,
              Body: file.buffer,
            })
            .promise();
          fileUrls.singleFiles = [...fileUrls.singleFiles, singleFileLocation];
        })
      );

      // response json saved
      const { Location: JSONResponseLocation } = await s3
        .upload({
          Bucket: process.env.AWS_S3_BUCKET_NAME ?? "mbd-staging",
          Key: `${receiptId}/parsed_document.json`,
          Body: Buffer.from(JSON.stringify(response)),
        })
        .promise();

      fileUrls.JSONResponse = JSONResponseLocation;

      // check if there is an image in the files array
      const imageFile = files.find((file) =>
        file.mimetype.startsWith("image/")
      );

      if (imageFile) {
        const { Location: mergedLocation } = await s3
          .upload({
            Bucket: process.env.AWS_S3_BUCKET_NAME ?? "mbd-staging",
            Key: `${receiptId}/merged.pdf`,
            Body: imgToPDF(
              files.map((file) => file.buffer),
              imgToPDF.sizes.A4
            ),
            ContentType: "application/pdf",
            // set the content disposition to inline so that the file is not downloaded
            ContentDisposition: "inline",
          })
          .promise();

        fileUrls.merged = mergedLocation;
      } else {
        let merger = new PDFMerger();
        for (let i = 0; i < files.length; i++) {
          await merger.add(files[i].buffer);
        }

        const { Location: mergedLocation } = await s3
          .upload({
            Bucket: process.env.AWS_S3_BUCKET_NAME ?? "mbd-staging",
            Key: `${receiptId}/merged.pdf`,
            Body: await merger.saveAsBuffer(),
            ContentType: "application/pdf",
            // set the content disposition to inline so that the file is not downloaded
            ContentDisposition: "inline",
          })
          .promise();

        fileUrls.merged = mergedLocation;
      }

      return fileUrls;
    } catch (e) {
      console.log(e);
    }
  }

  /**
   * Get files and fields for the request
   * @param request - Http request
   */
  private static async getFilesAndFields(
    request: Request,
    key: string,
    purchaseReceipt: any
  ) {
    console.log(`The current key being used is ${key} `);
    sdk.auth(key);

    const uploadedFiles = request.files;
    console.log({ uploadedFiles });

    let files: Express.Multer.File[] = [];
    if (Array.isArray(uploadedFiles)) {
      files = uploadedFiles;
    } else {
      for (const filename in uploadedFiles) {
        files.push(...uploadedFiles[filename]);
      }
    }

    const file = files[0];

    const { data } = await sdk.generateAnUploadUrl({
      environment: "development",
      // eslint-disable-next-line @typescript-eslint/naming-convention
      document_type: "purchase_receipt",
    });

    console.log({ data });

    await SensibleController.uploadFile(file, data.upload_url);

    let documentExtractedWaiting = true;
    let numberOfTries = 0;

    if (!skipDocumentProcessing) {
      console.log(
        "not skipping -- skipDocumentProcessing: ",
        skipDocumentProcessing
      );
      try {
        while (documentExtractedWaiting) {
          const { data: data1 } = await sdk.retrievingResults({ id: data.id });
          console.log({ retrival: data1 });
          if (data1.status === "COMPLETE") {
            documentExtractedWaiting = false;
            // eslint-disable-next-line @typescript-eslint/naming-convention
            console.log(
              JSON.stringify({ parsed_document: data1.parsed_document })
            );

            const receipt = await purchaseReceipt.create({});

            // eslint-disable-next-line no-void
            const fileUrls = await SensibleController.processAndUploadFiles(
              receipt.id,
              files,
              data1.parsed_document
            );

            return {
              extractedData: data1.parsed_document,
              receiptId: receipt.id,
              fileUrls,
            };
          }
          if (data1.status === "FAILED" || numberOfTries > 15) {
            const receipt = await purchaseReceipt.create({});

            // eslint-disable-next-line no-void
            const fileUrls = await SensibleController.processAndUploadFiles(
              receipt.id,
              files,
              {}
            );

            return {
              extractedData: {},
              receiptId: receipt.id,
              fileUrls,
            };
          }

          // sleep for a 2 sec
          await new Promise((resolve) => setTimeout(resolve, 5000));
          numberOfTries = numberOfTries + 1;
        }
      } catch (e) {
        console.log({
          e,
        });
        const receipt = await purchaseReceipt.create({});

        // eslint-disable-next-line no-void
        const fileUrls = await SensibleController.processAndUploadFiles(
          receipt.id,
          files,
          {}
        );

        return {
          extractedData: {},
          receiptId: receipt.id,
          fileUrls,
        };
      }
    } else {
      console.log("skipDocumentProcessing: ", skipDocumentProcessing);
      const receipt = await purchaseReceipt.create({});

      // eslint-disable-next-line no-void
      const fileUrls = await SensibleController.processAndUploadFiles(
        receipt.id,
        files,
        {}
      );

      return {
        extractedData: {},
        receiptId: receipt.id,
        fileUrls,
      };
    }
  }

  private static async onlyUploadFiles(request: Request, purchaseReceipt: any) {
    const uploadedFiles = request.files;
    console.log({ uploadedFiles });

    let files: Express.Multer.File[] = [];
    if (Array.isArray(uploadedFiles)) {
      files = uploadedFiles;
    } else {
      for (const filename in uploadedFiles) {
        files.push(...uploadedFiles[filename]);
      }
    }

    const receipt = await purchaseReceipt.create({});

    // eslint-disable-next-line no-void
    const fileUrls = await SensibleController.processAndUploadFiles(
      receipt.id,
      files,
      {}
    );

    return {
      extractedData: {},
      receiptId: receipt.id,
      fileUrls,
    };
  }

  @post("/get-presigned-url", {
    responses: {
      200: {
        content: {
          "application/json": {
            schema: {
              type: "object",
            },
          },
        },
        description: "test endpoint",
      },
    },
  })
  async getPreSignedUrl(
    @requestBody({
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              fileName: {
                type: "string",
              },
            },
          },
        },
      },
    })
    req: Request,
    @inject(RestBindings.Http.RESPONSE) res: Response
  ) {
    try {
      // @ts-ignore
      const { fileName } = req;

      const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME ?? "mbd-staging",
        Key: fileName,
        Expires: 60,
      };
      const url = await s3.getSignedUrlPromise("getObject", params);
      return res.status(200).json({
        message: "Presigned URL generated successfully",
        url,
      });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        message: "Internal Server Error",
        error: e,
      });
    }
  }
}
