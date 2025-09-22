import {
  ImageFile,
  ProcessingOptions,
  ProcessingProgress,
  BatchOperation,
} from "@/types";
import { imageProcessor } from "./imageProcessor";
import JSZip from "jszip";
import { saveAs } from "file-saver";

export class BatchProcessor {
  private onProgress?: (progress: ProcessingProgress) => void;

  setProgressCallback(callback: (progress: ProcessingProgress) => void) {
    this.onProgress = callback;
  }

  async processBatch(
    images: ImageFile[],
    operations: BatchOperation[],
    downloadAsZip: boolean = true,
  ): Promise<string[]> {
    const results: string[] = [];
    const enabledOperations = operations.filter((op) => op.enabled);

    this.updateProgress(
      0,
      images.length,
      "processing",
      "Starting batch processing...",
    );

    for (let i = 0; i < images.length; i++) {
      const image = images[i];

      try {
        this.updateProgress(
          i,
          images.length,
          "processing",
          `Processing ${image.metadata.name}...`,
        );

        const processedImage = await this.processImageWithOperations(
          image,
          enabledOperations,
        );
        results.push(processedImage);
      } catch (error) {
        console.error(`Error processing ${image.metadata.name}:`, error);
        this.updateProgress(
          i,
          images.length,
          "error",
          `Error processing ${image.metadata.name}`,
        );
      }
    }

    this.updateProgress(
      images.length,
      images.length,
      "completed",
      "Batch processing completed!",
    );

    if (downloadAsZip && results.length > 0) {
      await this.downloadAsZip(results, images);
    }

    return results;
  }

  private async processImageWithOperations(
    image: ImageFile,
    operations: BatchOperation[],
  ): Promise<string> {
    const options: ProcessingOptions = {};

    for (const operation of operations) {
      switch (operation.type) {
        case "watermark":
          options.watermark = operation.settings;
          break;
        case "crop":
          options.crop = operation.settings;
          break;
        case "resize":
          options.resize = operation.settings;
          break;
        case "filter":
          options.filters = operation.settings;
          break;
        case "format":
          options.format = operation.settings.format;
          options.quality = operation.settings.quality;
          break;
      }
    }

    return await imageProcessor.processImage(image, options);
  }

  private async downloadAsZip(
    processedImages: string[],
    originalImages: ImageFile[],
  ): Promise<void> {
    const zip = new JSZip();

    for (let i = 0; i < processedImages.length; i++) {
      const dataUrl = processedImages[i];
      const originalName = originalImages[i].metadata.name;
      const nameWithoutExt = originalName.replace(/\.[^/.]+$/, "");
      const extension = dataUrl.includes("data:image/png") ? "png" : "jpg";

      const base64Data = dataUrl.split(",")[1];
      zip.file(`processed_${nameWithoutExt}.${extension}`, base64Data, {
        base64: true,
      });
    }

    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, `processed_images_${new Date().getTime()}.zip`);
  }

  async processWatermarkBatch(
    images: ImageFile[],
    watermarkFile: File,
    settings: any,
  ): Promise<string[]> {
    const operations: BatchOperation[] = [
      {
        id: "watermark",
        name: "Watermark",
        type: "watermark",
        settings: { file: watermarkFile, settings },
        enabled: true,
      },
    ];

    return this.processBatch(images, operations);
  }

  async processResizeBatch(
    images: ImageFile[],
    resizeSettings: any,
  ): Promise<string[]> {
    const operations: BatchOperation[] = [
      {
        id: "resize",
        name: "Resize",
        type: "resize",
        settings: resizeSettings,
        enabled: true,
      },
    ];

    return this.processBatch(images, operations);
  }

  async processCropBatch(
    images: ImageFile[],
    cropSettings: any,
  ): Promise<string[]> {
    const operations: BatchOperation[] = [
      {
        id: "crop",
        name: "Crop",
        type: "crop",
        settings: cropSettings,
        enabled: true,
      },
    ];

    return this.processBatch(images, operations);
  }

  private updateProgress(
    current: number,
    total: number,
    status: ProcessingProgress["status"],
    message?: string,
  ) {
    if (this.onProgress) {
      this.onProgress({ current, total, status, message });
    }
  }
}

export const batchProcessor = new BatchProcessor();
