"use client";

import React from "react";
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Checkbox,
  IconButton,
  Box,
  Chip,
} from "@mui/material";
import { Delete, Visibility } from "@mui/icons-material";
import { ImageFile } from "@/types";

interface ImageGalleryProps {
  images: ImageFile[];
  selectedImages: string[];
  onToggleSelection: (id: string) => void;
  onRemoveImage: (id: string) => void;
  onPreviewImage?: (image: ImageFile) => void;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  selectedImages,
  onToggleSelection,
  onRemoveImage,
  onPreviewImage,
}) => {
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
  };

  if (images.length === 0) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight={200}
        bgcolor="grey.50"
        borderRadius={1}
      >
        <Typography variant="body1" color="textSecondary">
          No images uploaded yet
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={2}>
      {images.map((image) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={image.id}>
          <Card
            sx={{
              position: "relative",
              border: selectedImages.includes(image.id) ? 2 : 1,
              borderColor: selectedImages.includes(image.id)
                ? "primary.main"
                : "grey.300",
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                boxShadow: 3,
              },
            }}
          >
            <Box position="relative">
              <CardMedia
                component="img"
                height="200"
                image={image.preview}
                alt={image.metadata.name}
                sx={{ objectFit: "cover" }}
              />

              <Checkbox
                checked={selectedImages.includes(image.id)}
                onChange={() => onToggleSelection(image.id)}
                sx={{
                  position: "absolute",
                  top: 8,
                  left: 8,
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                  },
                }}
              />

              <Box position="absolute" top={8} right={8} display="flex" gap={1}>
                {onPreviewImage && (
                  <IconButton
                    size="small"
                    onClick={() => onPreviewImage(image)}
                    sx={{
                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                      },
                    }}
                  >
                    <Visibility fontSize="small" />
                  </IconButton>
                )}

                <IconButton
                  size="small"
                  onClick={() => onRemoveImage(image.id)}
                  sx={{
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                    },
                  }}
                >
                  <Delete fontSize="small" color="error" />
                </IconButton>
              </Box>
            </Box>

            <CardContent sx={{ p: 2 }}>
              <Typography
                variant="subtitle2"
                noWrap
                title={image.metadata.name}
                sx={{ mb: 1 }}
              >
                {image.metadata.name}
              </Typography>

              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Chip
                  label={`${image.metadata.width}×${image.metadata.height}`}
                  size="small"
                  variant="outlined"
                />
                <Typography variant="caption" color="textSecondary">
                  {formatFileSize(image.metadata.size)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};
