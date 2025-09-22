"use client";

import React, { useState } from "react";
import {
  Box,
  TextField,
  Slider,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Paper,
  Grid,
} from "@mui/material";
import { CloudUpload } from "@mui/icons-material";
import { WatermarkSettings } from "@/types";

interface WatermarkPanelProps {
  watermarkFile: File | null;
  onWatermarkFileChange: (file: File | null) => void;
  onProcess: (settings: WatermarkSettings) => void;
  disabled?: boolean;
}

export const WatermarkPanel: React.FC<WatermarkPanelProps> = ({
  watermarkFile,
  onWatermarkFileChange,
  onProcess,
  disabled = false,
}) => {
  const [settings, setSettings] = useState<WatermarkSettings>({
    opacity: 0.7,
    position: "bottom-right",
    scale: 0.2,
    rotation: 0,
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    onWatermarkFileChange(file);
  };

  const handleSettingChange = (key: keyof WatermarkSettings, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleProcess = () => {
    onProcess(settings);
  };

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, border: "2px dashed", borderColor: "grey.300" }}>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap={2}
            >
              <CloudUpload sx={{ fontSize: 48, color: "grey.500" }} />
              <Typography variant="body1">
                {watermarkFile ? watermarkFile.name : "Choose watermark image"}
              </Typography>
              <Button
                variant="outlined"
                component="label"
                startIcon={<CloudUpload />}
                disabled={disabled}
              >
                Upload Watermark
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </Button>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography gutterBottom>Opacity</Typography>
          <Slider
            value={settings.opacity}
            onChange={(_, value) => handleSettingChange("opacity", value)}
            min={0}
            max={1}
            step={0.1}
            marks
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => `${Math.round(value * 100)}%`}
            disabled={disabled}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography gutterBottom>Scale</Typography>
          <Slider
            value={settings.scale}
            onChange={(_, value) => handleSettingChange("scale", value)}
            min={0.1}
            max={1}
            step={0.1}
            marks
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => `${Math.round(value * 100)}%`}
            disabled={disabled}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Position</InputLabel>
            <Select
              value={settings.position}
              label="Position"
              onChange={(e) => handleSettingChange("position", e.target.value)}
              disabled={disabled}
            >
              <MenuItem value="center">Center</MenuItem>
              <MenuItem value="top-left">Top Left</MenuItem>
              <MenuItem value="top-right">Top Right</MenuItem>
              <MenuItem value="bottom-left">Bottom Left</MenuItem>
              <MenuItem value="bottom-right">Bottom Right</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography gutterBottom>Rotation (degrees)</Typography>
          <Slider
            value={settings.rotation}
            onChange={(_, value) => handleSettingChange("rotation", value)}
            min={-180}
            max={180}
            step={15}
            marks
            valueLabelDisplay="auto"
            disabled={disabled}
          />
        </Grid>

        <Grid item xs={12}>
          <Button
            variant="contained"
            onClick={handleProcess}
            disabled={disabled || !watermarkFile}
            fullWidth
          >
            Apply Watermark
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};
