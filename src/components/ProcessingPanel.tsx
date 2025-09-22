"use client";

import React, { useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Paper,
  Typography,
  Button,
  LinearProgress,
  Alert,
} from "@mui/material";
import { PlayArrow, Stop } from "@mui/icons-material";
import { ProcessingProgress } from "@/types";
import { WatermarkPanel } from "./panels/WatermarkPanel";
import { ResizePanel } from "./panels/ResizePanel";
import { CropPanel } from "./panels/CropPanel";
import { FilterPanel } from "./panels/FilterPanel";
import { BatchOperationsPanel } from "./panels/BatchOperationsPanel";

interface ProcessingPanelProps {
  progress: ProcessingProgress;
  onProcessBatch: () => void;
  onProcessWatermark: (settings: any) => void;
  onProcessResize: (settings: any) => void;
  watermarkFile: File | null;
  onWatermarkFileChange: (file: File | null) => void;
  disabled?: boolean;
}

export const ProcessingPanel: React.FC<ProcessingPanelProps> = ({
  progress,
  onProcessBatch,
  onProcessWatermark,
  onProcessResize,
  watermarkFile,
  onWatermarkFileChange,
  disabled = false,
}) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const isProcessing = progress.status === "processing";

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Image Processing
      </Typography>

      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ mb: 3, borderBottom: 1, borderColor: "divider" }}
      >
        <Tab label="Watermark" />
        <Tab label="Resize" />
        <Tab label="Crop" />
        <Tab label="Filters" />
        <Tab label="Batch Operations" />
      </Tabs>

      <Box sx={{ mb: 3 }}>
        {activeTab === 0 && (
          <WatermarkPanel
            watermarkFile={watermarkFile}
            onWatermarkFileChange={onWatermarkFileChange}
            onProcess={onProcessWatermark}
            disabled={disabled || isProcessing}
          />
        )}

        {activeTab === 1 && (
          <ResizePanel
            onProcess={onProcessResize}
            disabled={disabled || isProcessing}
          />
        )}

        {activeTab === 2 && <CropPanel disabled={disabled || isProcessing} />}

        {activeTab === 3 && <FilterPanel disabled={disabled || isProcessing} />}

        {activeTab === 4 && (
          <BatchOperationsPanel
            onProcess={onProcessBatch}
            disabled={disabled || isProcessing}
          />
        )}
      </Box>

      {/* Progress Section */}
      {progress.status !== "idle" && (
        <Box sx={{ mb: 2 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={1}
          >
            <Typography variant="body2">
              {progress.message || "Processing..."}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {progress.current}/{progress.total}
            </Typography>
          </Box>

          <LinearProgress
            variant="determinate"
            value={
              progress.total > 0 ? (progress.current / progress.total) * 100 : 0
            }
            sx={{ mb: 1 }}
          />

          {progress.status === "error" && (
            <Alert severity="error" sx={{ mt: 1 }}>
              {progress.message || "An error occurred during processing"}
            </Alert>
          )}

          {progress.status === "completed" && (
            <Alert severity="success" sx={{ mt: 1 }}>
              Processing completed successfully!
            </Alert>
          )}
        </Box>
      )}

      {/* Action Buttons */}
      <Box display="flex" gap={2} justifyContent="flex-end">
        <Button
          variant="contained"
          startIcon={isProcessing ? <Stop /> : <PlayArrow />}
          onClick={onProcessBatch}
          disabled={disabled}
          color={isProcessing ? "error" : "primary"}
        >
          {isProcessing ? "Stop Processing" : "Start Batch Processing"}
        </Button>
      </Box>
    </Paper>
  );
};
