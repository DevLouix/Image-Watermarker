"use client";

import React, { useState } from "react";
import {
  Box,
  Slider,
  Typography,
  Button,
  Grid,
  Paper,
  Divider,
} from "@mui/material";
import { FilterAlt, Refresh } from "@mui/icons-material";
import { FilterSettings } from "@/types";

interface FilterPanelProps {
  disabled?: boolean;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  disabled = false,
}) => {
  const [settings, setSettings] = useState<FilterSettings>({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    blur: 0,
    sepia: 0,
    grayscale: 0,
  });

  const handleSettingChange = (key: keyof FilterSettings, value: number) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setSettings({
      brightness: 100,
      contrast: 100,
      saturation: 100,
      blur: 0,
      sepia: 0,
      grayscale: 0,
    });
  };

  const handleProcess = () => {
    // This would be connected to the main processing system
    console.log("Filter settings:", settings);
  };

  const presets = [
    {
      name: "Vintage",
      settings: {
        brightness: 110,
        contrast: 120,
        saturation: 80,
        blur: 0,
        sepia: 30,
        grayscale: 0,
      },
    },
    {
      name: "Black & White",
      settings: {
        brightness: 100,
        contrast: 110,
        saturation: 0,
        blur: 0,
        sepia: 0,
        grayscale: 100,
      },
    },
    {
      name: "High Contrast",
      settings: {
        brightness: 105,
        contrast: 150,
        saturation: 120,
        blur: 0,
        sepia: 0,
        grayscale: 0,
      },
    },
    {
      name: "Soft",
      settings: {
        brightness: 110,
        contrast: 90,
        saturation: 90,
        blur: 1,
        sepia: 0,
        grayscale: 0,
      },
    },
    {
      name: "Dramatic",
      settings: {
        brightness: 95,
        contrast: 140,
        saturation: 130,
        blur: 0,
        sepia: 0,
        grayscale: 0,
      },
    },
  ];

  const applyPreset = (presetSettings: FilterSettings) => {
    setSettings(presetSettings);
  };

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Image Filters
          </Typography>
        </Grid>

        {/* Filter Presets */}
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            Presets
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
            {presets.map((preset) => (
              <Button
                key={preset.name}
                variant="outlined"
                size="small"
                onClick={() => applyPreset(preset.settings)}
                disabled={disabled}
              >
                {preset.name}
              </Button>
            ))}
            <Button
              variant="outlined"
              size="small"
              onClick={resetFilters}
              disabled={disabled}
              startIcon={<Refresh />}
            >
              Reset
            </Button>
          </Box>
          <Divider sx={{ mb: 2 }} />
        </Grid>

        {/* Brightness */}
        <Grid item xs={12} md={6}>
          <Typography gutterBottom>
            Brightness: {settings.brightness}%
          </Typography>
          <Slider
            value={settings.brightness}
            onChange={(_, value) =>
              handleSettingChange("brightness", value as number)
            }
            min={0}
            max={200}
            step={5}
            marks={[
              { value: 0, label: "0%" },
              { value: 100, label: "100%" },
              { value: 200, label: "200%" },
            ]}
            valueLabelDisplay="auto"
            disabled={disabled}
          />
        </Grid>

        {/* Contrast */}
        <Grid item xs={12} md={6}>
          <Typography gutterBottom>Contrast: {settings.contrast}%</Typography>
          <Slider
            value={settings.contrast}
            onChange={(_, value) =>
              handleSettingChange("contrast", value as number)
            }
            min={0}
            max={200}
            step={5}
            marks={[
              { value: 0, label: "0%" },
              { value: 100, label: "100%" },
              { value: 200, label: "200%" },
            ]}
            valueLabelDisplay="auto"
            disabled={disabled}
          />
        </Grid>

        {/* Saturation */}
        <Grid item xs={12} md={6}>
          <Typography gutterBottom>
            Saturation: {settings.saturation}%
          </Typography>
          <Slider
            value={settings.saturation}
            onChange={(_, value) =>
              handleSettingChange("saturation", value as number)
            }
            min={0}
            max={200}
            step={5}
            marks={[
              { value: 0, label: "0%" },
              { value: 100, label: "100%" },
              { value: 200, label: "200%" },
            ]}
            valueLabelDisplay="auto"
            disabled={disabled}
          />
        </Grid>

        {/* Blur */}
        <Grid item xs={12} md={6}>
          <Typography gutterBottom>Blur: {settings.blur}px</Typography>
          <Slider
            value={settings.blur}
            onChange={(_, value) =>
              handleSettingChange("blur", value as number)
            }
            min={0}
            max={10}
            step={0.5}
            marks={[
              { value: 0, label: "0px" },
              { value: 5, label: "5px" },
              { value: 10, label: "10px" },
            ]}
            valueLabelDisplay="auto"
            disabled={disabled}
          />
        </Grid>

        {/* Sepia */}
        <Grid item xs={12} md={6}>
          <Typography gutterBottom>Sepia: {settings.sepia}%</Typography>
          <Slider
            value={settings.sepia}
            onChange={(_, value) =>
              handleSettingChange("sepia", value as number)
            }
            min={0}
            max={100}
            step={5}
            marks={[
              { value: 0, label: "0%" },
              { value: 50, label: "50%" },
              { value: 100, label: "100%" },
            ]}
            valueLabelDisplay="auto"
            disabled={disabled}
          />
        </Grid>

        {/* Grayscale */}
        <Grid item xs={12} md={6}>
          <Typography gutterBottom>Grayscale: {settings.grayscale}%</Typography>
          <Slider
            value={settings.grayscale}
            onChange={(_, value) =>
              handleSettingChange("grayscale", value as number)
            }
            min={0}
            max={100}
            step={5}
            marks={[
              { value: 0, label: "0%" },
              { value: 50, label: "50%" },
              { value: 100, label: "100%" },
            ]}
            valueLabelDisplay="auto"
            disabled={disabled}
          />
        </Grid>

        {/* Preview */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, backgroundColor: "grey.50" }}>
            <Typography variant="subtitle2" gutterBottom>
              Filter Preview
            </Typography>
            <Box
              sx={{
                width: 200,
                height: 150,
                backgroundColor: "primary.light",
                borderRadius: 1,
                margin: "0 auto",
                filter: `brightness(${settings.brightness}%) contrast(${settings.contrast}%) saturate(${settings.saturation}%) blur(${settings.blur}px) sepia(${settings.sepia}%) grayscale(${settings.grayscale}%)`,
                transition: "filter 0.3s ease",
              }}
            />
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Button
            variant="contained"
            onClick={handleProcess}
            disabled={disabled}
            fullWidth
            startIcon={<FilterAlt />}
          >
            Apply Filters
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};
