import { useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { ImageFile, ProcessingProgress, BatchOperation } from "@/types";
import { imageProcessor } from "@/utils/imageProcessor";
import { batchProcessor } from "@/utils/batchProcessor";

export const useImageEditor = () => {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [watermarkFile, setWatermarkFile] = useState<File | null>(null);
  const [processedImages, setProcessedImages] = useState<string[]>([]);
  const [progress, setProgress] = useState<ProcessingProgress>({
    current: 0,
    total: 0,
    status: "idle",
  });
  const [batchOperations, setBatchOperations] = useState<BatchOperation[]>([]);

  const addImages = useCallback(async (files: File[]) => {
    const newImages: ImageFile[] = [];

    for (const file of files) {
      if (file.type.startsWith("image/")) {
        const metadata = await imageProcessor.getImageMetadata(file);
        const imageFile: ImageFile = {
          id: uuidv4(),
          file,
          preview: URL.createObjectURL(file),
          metadata,
        };
        newImages.push(imageFile);
      }
    }

    setImages((prev) => [...prev, ...newImages]);
  }, []);

  const removeImage = useCallback((id: string) => {
    setImages((prev) => {
      const image = prev.find((img) => img.id === id);
      if (image) {
        URL.revokeObjectURL(image.preview);
        if (image.processed) {
          URL.revokeObjectURL(image.processed);
        }
      }
      return prev.filter((img) => img.id !== id);
    });
    setSelectedImages((prev) => prev.filter((imgId) => imgId !== id));
  }, []);

  const clearImages = useCallback(() => {
    images.forEach((image) => {
      URL.revokeObjectURL(image.preview);
      if (image.processed) {
        URL.revokeObjectURL(image.processed);
      }
    });
    setImages([]);
    setSelectedImages([]);
    setProcessedImages([]);
  }, [images]);

  const toggleImageSelection = useCallback((id: string) => {
    setSelectedImages((prev) =>
      prev.includes(id) ? prev.filter((imgId) => imgId !== id) : [...prev, id],
    );
  }, []);

  const selectAllImages = useCallback(() => {
    setSelectedImages(images.map((img) => img.id));
  }, [images]);

  const deselectAllImages = useCallback(() => {
    setSelectedImages([]);
  }, []);

  const addBatchOperation = useCallback(
    (operation: Omit<BatchOperation, "id">) => {
      const newOperation: BatchOperation = {
        ...operation,
        id: uuidv4(),
      };
      setBatchOperations((prev) => [...prev, newOperation]);
    },
    [],
  );

  const removeBatchOperation = useCallback((id: string) => {
    setBatchOperations((prev) => prev.filter((op) => op.id !== id));
  }, []);

  const toggleBatchOperation = useCallback((id: string) => {
    setBatchOperations((prev) =>
      prev.map((op) => (op.id === id ? { ...op, enabled: !op.enabled } : op)),
    );
  }, []);

  const updateBatchOperation = useCallback(
    (id: string, updates: Partial<BatchOperation>) => {
      setBatchOperations((prev) =>
        prev.map((op) => (op.id === id ? { ...op, ...updates } : op)),
      );
    },
    [],
  );

  const processBatch = useCallback(async () => {
    const imagesToProcess =
      selectedImages.length > 0
        ? images.filter((img) => selectedImages.includes(img.id))
        : images;

    if (imagesToProcess.length === 0) {
      return;
    }

    batchProcessor.setProgressCallback(setProgress);

    try {
      const results = await batchProcessor.processBatch(
        imagesToProcess,
        batchOperations,
        true,
      );
      setProcessedImages(results);
    } catch (error) {
      console.error("Batch processing failed:", error);
      setProgress({
        current: 0,
        total: 0,
        status: "error",
        message: "Batch processing failed",
      });
    }
  }, [images, selectedImages, batchOperations]);

  const processWatermarkBatch = useCallback(
    async (settings: any) => {
      if (!watermarkFile) return;

      const imagesToProcess =
        selectedImages.length > 0
          ? images.filter((img) => selectedImages.includes(img.id))
          : images;

      if (imagesToProcess.length === 0) return;

      batchProcessor.setProgressCallback(setProgress);

      try {
        const results = await batchProcessor.processWatermarkBatch(
          imagesToProcess,
          watermarkFile,
          settings,
        );
        setProcessedImages(results);
      } catch (error) {
        console.error("Watermark batch processing failed:", error);
      }
    },
    [images, selectedImages, watermarkFile],
  );

  const processResizeBatch = useCallback(
    async (settings: any) => {
      const imagesToProcess =
        selectedImages.length > 0
          ? images.filter((img) => selectedImages.includes(img.id))
          : images;

      if (imagesToProcess.length === 0) return;

      batchProcessor.setProgressCallback(setProgress);

      try {
        const results = await batchProcessor.processResizeBatch(
          imagesToProcess,
          settings,
        );
        setProcessedImages(results);
      } catch (error) {
        console.error("Resize batch processing failed:", error);
      }
    },
    [images, selectedImages],
  );

  return {
    // State
    images,
    selectedImages,
    watermarkFile,
    processedImages,
    progress,
    batchOperations,

    // Actions
    addImages,
    removeImage,
    clearImages,
    toggleImageSelection,
    selectAllImages,
    deselectAllImages,
    setWatermarkFile,

    // Batch operations
    addBatchOperation,
    removeBatchOperation,
    toggleBatchOperation,
    updateBatchOperation,
    processBatch,
    processWatermarkBatch,
    processResizeBatch,

    // Computed
    hasImages: images.length > 0,
    hasSelectedImages: selectedImages.length > 0,
    selectedImageCount: selectedImages.length,
    totalImageCount: images.length,
  };
};
