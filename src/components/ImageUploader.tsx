"use client";

import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Box, Typography, Paper, Button } from "@mui/material";
import { CloudUpload, Image as ImageIcon } from "@mui/icons-material";

interface ImageUploaderProps {
  onImagesAdded: (files: File[]) => void;
  disabled?: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImagesAdded,
  disabled = false,
}) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onImagesAdded(acceptedFiles);
    },
    [onImagesAdded],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".bmp", ".webp"],
    },
    multiple: true,
    disabled,
  });

  return (
    <Paper
      {...getRootProps()}
      sx={{
        p: 4,
        border: "2px dashed",
        borderColor: isDragActive ? "primary.main" : "grey.300",
        backgroundColor: isDragActive ? "action.hover" : "background.paper",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "all 0.2s ease-in-out",
        textAlign: "center",
        opacity: disabled ? 0.6 : 1,
        "&:hover": {
          borderColor: disabled ? "grey.300" : "primary.main",
          backgroundColor: disabled ? "background.paper" : "action.hover",
        },
      }}
    >
      <input {...getInputProps()} />

      <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
        {isDragActive ? (
          <CloudUpload sx={{ fontSize: 48, color: "primary.main" }} />
        ) : (
          <ImageIcon sx={{ fontSize: 48, color: "grey.500" }} />
        )}

        <Typography
          variant="h6"
          color={isDragActive ? "primary" : "textSecondary"}
        >
          {isDragActive
            ? "Drop images here..."
            : "Drag & drop images here, or click to select"}
        </Typography>

        <Typography variant="body2" color="textSecondary">
          Supports PNG, JPG, JPEG, GIF, BMP, WebP
        </Typography>

        <Button
          variant="outlined"
          startIcon={<CloudUpload />}
          disabled={disabled}
          sx={{ mt: 1 }}
        >
          Choose Files
        </Button>
      </Box>
    </Paper>
  );
};
