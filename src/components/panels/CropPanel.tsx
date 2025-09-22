"use client";

import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Grid,
  Typography,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Crop } from "@mui/icons-material";
import { CropSettings } from "@/types";

interface CropPanelProps {
  disabled?: boolean;
}

export const CropPanel: React.FC<CropPanelProps> = ({ disabled = false }) => {
  const [settings, setSettings] = useState<CropSettings>({
    x: 0,
    y: 0,
    width: 800,
    height: 600,
  });

  const [aspectRatio, setAspectRatio] = useState<string>("custom");

  const handleSettingChange = (key: keyof CropSettings, value: number) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleAspectRatioChange = (ratio: string) => {
    setAspectRatio(ratio);

    if (ratio !== "custom") {
      const [widthRatio, heightRatio] = ratio.split(":").map(Number);
      const currentWidth = settings.width;
      const newHeight = Math.round((currentWidth * heightRatio) / widthRatio);

      setSettings((prev) => ({ ...prev, height: newHeight }));
    }
  };

  const aspectRatios = [
    { label: "Custom", value: "custom" },
    { label: "Square (1:1)", value: "1:1" },
    { label: "Portrait (3:4)", value: "3:4" },
    { label: "Landscape (4:3)", value: "4:3" },
    { label: "Wide (16:9)", value: "16:9" },
    { label: "Ultra Wide (21:9)", value: "21:9" },
  ];

  const handleProcess = () => {
    // This would be connected to the main processing system
    console.log("Crop settings:", settings);
  };

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Crop Settings
          </Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Define the crop area for your images
          </Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            label="X Position"
            type="number"
            value={settings.x}
            onChange={(e) =>
              handleSettingChange("x", parseInt(e.target.value) || 0)
            }
            InputProps={{
              endAdornment: <InputAdornment position="end">px</InputAdornment>,
            }}
            fullWidth
            disabled={disabled}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            label="Y Position"
            type="number"
            value={settings.y}
            onChange={(e) =>
              handleSettingChange("y", parseInt(e.target.value) || 0)
            }
            InputProps={{
              endAdornment: <InputAdornment position="end">px</InputAdornment>,
            }}
            fullWidth
            disabled={disabled}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            label="Width"
            type="number"
            value={settings.width}
            onChange={(e) => {
              const width = parseInt(e.target.value) || 0;
              handleSettingChange("width", width);

              if (aspectRatio !== "custom") {
                const [widthRatio, heightRatio] = aspectRatio
                  .split(":")
                  .map(Number);
                const newHeight = Math.round(
                  (width * heightRatio) / widthRatio,
                );
                handleSettingChange("height", newHeight);
              }
            }}
            InputProps={{
              endAdornment: <InputAdornment position="end">px</InputAdornment>,
            }}
            fullWidth
            disabled={disabled}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            label="Height"
            type="number"
            value={settings.height}
            onChange={(e) =>
              handleSettingChange("height", parseInt(e.target.value) || 0)
            }
            InputProps={{
              endAdornment: <InputAdornment position="end">px</InputAdornment>,
            }}
            fullWidth
            disabled={disabled || aspectRatio !== "custom"}
          />
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Aspect Ratio</InputLabel>
            <Select
              value={aspectRatio}
              label="Aspect Ratio"
              onChange={(e) => handleAspectRatioChange(e.target.value)}
              disabled={disabled}
            >
              {aspectRatios.map((ratio) => (
                <MenuItem key={ratio.value} value={ratio.value}>
                  {ratio.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Box
            sx={{
              border: "2px dashed",
              borderColor: "grey.300",
              borderRadius: 1,
              p: 3,
              textAlign: "center",
              backgroundColor: "grey.50",
            }}
          >
            <Typography variant="body2" color="textSecondary">
              Crop Preview
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {settings.width} × {settings.height} px
            </Typography>
            <Box
              sx={{
                width: Math.min(200, settings.width / 4),
                height: Math.min(150, settings.height / 4),
                border: "2px solid",
                borderColor: "primary.main",
                margin: "16px auto",
                backgroundColor: "primary.light",
                opacity: 0.3,
              }}
            />
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Button
            variant="contained"
            onClick={handleProcess}
            disabled={disabled || settings.width <= 0 || settings.height <= 0}
            fullWidth
            startIcon={<Crop />}
          >
            Apply Crop
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};
