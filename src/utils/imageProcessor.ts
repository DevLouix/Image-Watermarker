import {
  ProcessingOptions,
  ImageFile,
  WatermarkSettings,
  CropSettings,
  ResizeSettings,
  FilterSettings,
} from "@/types";

export class ImageProcessor {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor() {
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d")!;
  }

  async processImage(
    imageFile: ImageFile,
    options: ProcessingOptions,
  ): Promise<string> {
    const img = await this.loadImage(imageFile.preview);

    // Set initial canvas size
    this.canvas.width = img.width;
    this.canvas.height = img.height;

    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Apply filters first
    if (options.filters) {
      this.applyFilters(options.filters);
    }

    // Draw the base image
    this.ctx.drawImage(img, 0, 0);

    // Apply crop
    if (options.crop) {
      await this.applyCrop(img, options.crop);
    }

    // Apply resize
    if (options.resize) {
      await this.applyResize(img, options.resize);
    }

    // Apply watermark
    if (options.watermark) {
      await this.applyWatermark(
        options.watermark.file,
        options.watermark.settings,
      );
    }

    // Return processed image as data URL
    const format = options.format || "png";
    const quality = options.quality || 0.9;

    return this.canvas.toDataURL(`image/${format}`, quality);
  }

  private async loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  private applyFilters(filters: FilterSettings): void {
    const filterString = [
      `brightness(${filters.brightness}%)`,
      `contrast(${filters.contrast}%)`,
      `saturate(${filters.saturation}%)`,
      `blur(${filters.blur}px)`,
      `sepia(${filters.sepia}%)`,
      `grayscale(${filters.grayscale}%)`,
    ].join(" ");

    this.ctx.filter = filterString;
  }

  private async applyCrop(
    img: HTMLImageElement,
    crop: CropSettings,
  ): Promise<void> {
    const tempCanvas = document.createElement("canvas");
    const tempCtx = tempCanvas.getContext("2d")!;

    tempCanvas.width = crop.width;
    tempCanvas.height = crop.height;

    tempCtx.drawImage(
      img,
      crop.x,
      crop.y,
      crop.width,
      crop.height,
      0,
      0,
      crop.width,
      crop.height,
    );

    this.canvas.width = crop.width;
    this.canvas.height = crop.height;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(tempCanvas, 0, 0);
  }

  private async applyResize(
    img: HTMLImageElement,
    resize: ResizeSettings,
  ): Promise<void> {
    let { width, height } = resize;

    if (resize.maintainAspectRatio) {
      const aspectRatio = img.width / img.height;
      if (width / height > aspectRatio) {
        width = height * aspectRatio;
      } else {
        height = width / aspectRatio;
      }
    }

    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx.clearRect(0, 0, width, height);
    this.ctx.drawImage(img, 0, 0, width, height);
  }

  private async applyWatermark(
    watermarkFile: File,
    settings: WatermarkSettings,
  ): Promise<void> {
    const watermarkImg = await this.loadImage(
      URL.createObjectURL(watermarkFile),
    );

    const { width: canvasWidth, height: canvasHeight } = this.canvas;
    const watermarkWidth = watermarkImg.width * settings.scale;
    const watermarkHeight = watermarkImg.height * settings.scale;

    let x: number, y: number;

    switch (settings.position) {
      case "center":
        x = (canvasWidth - watermarkWidth) / 2;
        y = (canvasHeight - watermarkHeight) / 2;
        break;
      case "top-left":
        x = 20;
        y = 20;
        break;
      case "top-right":
        x = canvasWidth - watermarkWidth - 20;
        y = 20;
        break;
      case "bottom-left":
        x = 20;
        y = canvasHeight - watermarkHeight - 20;
        break;
      case "bottom-right":
        x = canvasWidth - watermarkWidth - 20;
        y = canvasHeight - watermarkHeight - 20;
        break;
      default:
        x = (canvasWidth - watermarkWidth) / 2;
        y = (canvasHeight - watermarkHeight) / 2;
    }

    this.ctx.save();
    this.ctx.globalAlpha = settings.opacity;

    if (settings.rotation !== 0) {
      this.ctx.translate(x + watermarkWidth / 2, y + watermarkHeight / 2);
      this.ctx.rotate((settings.rotation * Math.PI) / 180);
      this.ctx.translate(-watermarkWidth / 2, -watermarkHeight / 2);
      this.ctx.drawImage(watermarkImg, 0, 0, watermarkWidth, watermarkHeight);
    } else {
      this.ctx.drawImage(watermarkImg, x, y, watermarkWidth, watermarkHeight);
    }

    this.ctx.restore();
  }

  async getImageMetadata(file: File): Promise<{
    width: number;
    height: number;
    size: number;
    type: string;
    name: string;
  }> {
    const img = await this.loadImage(URL.createObjectURL(file));

    return {
      width: img.width,
      height: img.height,
      size: file.size,
      type: file.type,
      name: file.name,
    };
  }

  dataURLToBlob(dataURL: string): Blob {
    const arr = dataURL.split(",");
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new Blob([u8arr], { type: mime });
  }
}

export const imageProcessor = new ImageProcessor();
