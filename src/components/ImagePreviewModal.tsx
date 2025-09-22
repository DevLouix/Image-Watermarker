"use client";

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Chip,
  Grid,
} from "@mui/material";
import { Close, Download } from "@mui/icons-material";
import { ImageFile } from "@/types";

interface ImagePreviewModalProps {
  open: boolean;
  image: ImageFile | null;
  onClose: () => void;
}

export const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({
  open,
  image,
  onClose,
}) => {
  if (!image) return null;

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = image.preview;
    link.download = image.metadata.name;
    link.click();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: { maxHeight: "90vh" },
      }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" noWrap>
            {image.metadata.name}
          </Typography>
          <Button onClick={onClose} startIcon={<Close />} color="inherit">
            Close
          </Button>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box textAlign="center" mb={2}>
          <img
            src={image.preview}
            alt={image.metadata.name}
            style={{
              maxWidth: "100%",
              maxHeight: "60vh",
              objectFit: "contain",
              borderRadius: 8,
            }}
          />
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="textSecondary">
              Dimensions
            </Typography>
            <Chip
              label={`${image.metadata.width} × ${image.metadata.height} px`}
              variant="outlined"
              size="small"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="textSecondary">
              File Size
            </Typography>
            <Chip
              label={formatFileSize(image.metadata.size)}
              variant="outlined"
              size="small"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="textSecondary">
              File Type
            </Typography>
            <Chip label={image.metadata.type} variant="outlined" size="small" />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="textSecondary">
              Aspect Ratio
            </Typography>
            <Chip
              label={`${(image.metadata.width / image.metadata.height).toFixed(2)}:1`}
              variant="outlined"
              size="small"
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={handleDownload}
          startIcon={<Download />}
          variant="contained"
        >
          Download Original
        </Button>
      </DialogActions>
    </Dialog>
  );
};
