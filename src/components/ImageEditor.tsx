"use client";

import React, { useState } from "react";
import {
  Container,
  Grid,
  Typography,
  Box,
  AppBar,
  Toolbar,
  Button,
  Chip,
  Paper,
} from "@mui/material";
import {
  SelectAll,
  DeselectAll,
  Delete,
  Download,
  Image as ImageIcon,
} from "@mui/icons-material";
import { useImageEditor } from "@/hooks/useImageEditor";
import { ImageUploader } from "./ImageUploader";
import { ImageGallery } from "./ImageGallery";
import { ProcessingPanel } from "./ProcessingPanel";
import { ImagePreviewModal } from "./ImagePreviewModal";
import { ImageFile } from "@/types";

export const ImageEditor: React.FC = () => {
  const [previewImage, setPreviewImage] = useState<ImageFile | null>(null);

  const {
    images,
    selectedImages,
    watermarkFile,
    processedImages,
    progress,
    hasImages,
    hasSelectedImages,
    selectedImageCount,
    totalImageCount,
    addImages,
    removeImage,
    clearImages,
    toggleImageSelection,
    selectAllImages,
    deselectAllImages,
    setWatermarkFile,
    processBatch,
    processWatermarkBatch,
    processResizeBatch,
  } = useImageEditor();

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header */}
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <ImageIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Advanced Image Editor
          </Typography>
          <Chip
            label={`${totalImageCount} images`}
            color="secondary"
            variant="outlined"
            sx={{ color: "white", borderColor: "white" }}
          />
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Grid container spacing={3}>
          {/* Left Panel - Image Management */}
          <Grid item xs={12} lg={8}>
            <Box mb={3}>
              <ImageUploader
                onImagesAdded={addImages}
                disabled={progress.status === "processing"}
              />
            </Box>

            {/* Selection Controls */}
            {hasImages && (
              <Paper sx={{ p: 2, mb: 3 }}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box display="flex" alignItems="center" gap={2}>
                    <Typography variant="subtitle1">
                      {hasSelectedImages
                        ? `${selectedImageCount} of ${totalImageCount} selected`
                        : `${totalImageCount} images`}
                    </Typography>
                    {hasSelectedImages && (
                      <Chip label="Selected" color="primary" size="small" />
                    )}
                  </Box>

                  <Box display="flex" gap={1}>
                    <Button
                      size="small"
                      startIcon={<SelectAll />}
                      onClick={selectAllImages}
                      disabled={selectedImageCount === totalImageCount}
                    >
                      Select All
                    </Button>
                    <Button
                      size="small"
                      startIcon={<DeselectAll />}
                      onClick={deselectAllImages}
                      disabled={!hasSelectedImages}
                    >
                      Deselect All
                    </Button>
                    <Button
                      size="small"
                      startIcon={<Delete />}
                      onClick={clearImages}
                      color="error"
                      disabled={!hasImages}
                    >
                      Clear All
                    </Button>
                  </Box>
                </Box>
              </Paper>
            )}

            {/* Image Gallery */}
            <ImageGallery
              images={images}
              selectedImages={selectedImages}
              onToggleSelection={toggleImageSelection}
              onRemoveImage={removeImage}
              onPreviewImage={setPreviewImage}
            />

            {/* Processed Images */}
            {processedImages.length > 0 && (
              <Box mt={4}>
                <Typography variant="h6" gutterBottom>
                  Processed Images
                </Typography>
                <Grid container spacing={2}>
                  {processedImages.map((imageUrl, index) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={`processed-${index}`}>
                      <Paper sx={{ p: 1 }}>
                        <img
                          src={imageUrl}
                          alt={`Processed ${index + 1}`}
                          style={{
                            width: "100%",
                            height: 200,
                            objectFit: "cover",
                            borderRadius: 4,
                          }}
                        />
                        <Box mt={1} textAlign="center">
                          <Button
                            size="small"
                            startIcon={<Download />}
                            onClick={() => {
                              const link = document.createElement("a");
                              link.href = imageUrl;
                              link.download = `processed_image_${index + 1}.png`;
                              link.click();
                            }}
                          >
                            Download
                          </Button>
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </Grid>

          {/* Right Panel - Processing Controls */}
          <Grid item xs={12} lg={4}>
            <ProcessingPanel
              progress={progress}
              onProcessBatch={processBatch}
              onProcessWatermark={processWatermarkBatch}
              onProcessResize={processResizeBatch}
              watermarkFile={watermarkFile}
              onWatermarkFileChange={setWatermarkFile}
              disabled={!hasImages}
            />
          </Grid>
        </Grid>
      </Container>

      {/* Image Preview Modal */}
      <ImagePreviewModal
        open={!!previewImage}
        image={previewImage}
        onClose={() => setPreviewImage(null)}
      />
    </Box>
  );
};
