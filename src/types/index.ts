export interface ImageFile {
  id: string;
  file: File;
  preview: string;
  processed?: string;
  metadata: {
    width: number;
    height: number;
    size: number;
    type: string;
    name: string;
  };
}

export interface WatermarkSettings {
  opacity: number;
  position:
    | "center"
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right";
  scale: number;
  rotation: number;
}

export interface CropSettings {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ResizeSettings {
  width: number;
  height: number;
  maintainAspectRatio: boolean;
  quality: number;
}

export interface FilterSettings {
  brightness: number;
  contrast: number;
  saturation: number;
  blur: number;
  sepia: number;
  grayscale: number;
}

export interface ProcessingOptions {
  watermark?: {
    file: File;
    settings: WatermarkSettings;
  };
  crop?: CropSettings;
  resize?: ResizeSettings;
  filters?: FilterSettings;
  format?: "png" | "jpeg" | "webp";
  quality?: number;
}

export interface BatchOperation {
  id: string;
  name: string;
  type: "watermark" | "crop" | "resize" | "filter" | "format";
  settings: any;
  enabled: boolean;
}

export interface ProcessingProgress {
  current: number;
  total: number;
  status: "idle" | "processing" | "completed" | "error";
  message?: string;
}
