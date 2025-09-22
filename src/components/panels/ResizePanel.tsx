"use client";

import React, { useState } from "react";
import {
  Box,
  TextField,
  FormControlLabel,
  Checkbox,
  Slider,
  Typography,
  Button,
  Grid,
  InputAdornment,
} from "@mui/material";
import { AspectRatio } from "@mui/icons-material";
import { ResizeSettings } from "@/types";

interface ResizePanelProps {
  onProcess: (settings: ResizeSettings) => void;
  disabled?: boolean;
}

export const ResizePanel: React.FC<ResizePanelProps> = ({
  onProcess,
  disabled = false,
}) => {
  const [settings, setSettings] = useState<ResizeSettings>({
    width: 800,
    height: 600,
    maintainAspectRatio: true,
    quality: 0.9,
  });

  const handleSettingChange = (key: keyof ResizeSettings, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleProcess = () => {
    onProcess(settings);
  };

  const presetSizes = [
    { name: "Instagram Square", width: 1080, height: 1080 },
    { name: "Instagram Portrait", width: 1080, height: 1350 },
    { name: "Facebook Cover", width: 1200, height: 630 },
    { name: "Twitter Header", width: 1500, height: 500 },
    { name: "YouTube Thumbnail", width: 1280, height: 720 },
    { name: "HD", width: 1920, height: 1080 },
    { name: "4K", width: 3840, height: 2160 },
  ];

  const applyPreset = (width: number, height: number) => {
    setSettings((prev) => ({ ...prev, width, height }));
  };

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Resize Settings
          </Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            label="Width"
            type="number"
            value={settings.width}
            onChange={(e) =>
              handleSettingChange("width", parseInt(e.target.value) || 0)
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
            disabled={disabled}
          />
        </Grid>

        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={settings.maintainAspectRatio}
                onChange={(e) =>
                  handleSettingChange("maintainAspectRatio", e.target.checked)
                }
                disabled={disabled}
              />
            }
            label="Maintain aspect ratio"
          />
        </Grid>

        <Grid item xs={12}>
          <Typography gutterBottom>Quality</Typography>
          <Slider
            value={settings.quality}
            onChange={(_, value) => handleSettingChange("quality", value)}
            min={0.1}
            max={1}
            step={0.1}
            marks
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => `${Math.round(value * 100)}%`}
            disabled={disabled}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            Preset Sizes
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {presetSizes.map((preset) => (
              <Button
                key={preset.name}
                variant="outlined"
                size="small"
                onClick={() => applyPreset(preset.width, preset.height)}
                disabled={disabled}
                sx={{ mb: 1 }}
              >
                {preset.name}
                <br />
                <Typography variant="caption">
                  {preset.width}×{preset.height}
                </Typography>
              </Button>
            ))}
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Button
            variant="contained"
            onClick={handleProcess}
            disabled={disabled || settings.width <= 0 || settings.height <= 0}
            fullWidth
            startIcon={<AspectRatio />}
          >
            Resize Images
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};
