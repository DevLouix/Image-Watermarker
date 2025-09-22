"use client";

import React from "react";
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Switch,
  Chip,
  Alert,
} from "@mui/material";
import { Delete, Add, PlayArrow } from "@mui/icons-material";

interface BatchOperationsPanelProps {
  onProcess: () => void;
  disabled?: boolean;
}

export const BatchOperationsPanel: React.FC<BatchOperationsPanelProps> = ({
  onProcess,
  disabled = false,
}) => {
  // This would be connected to the batch operations state
  const operations = [
    {
      id: "1",
      name: "Watermark",
      type: "watermark",
      enabled: true,
      description: "Apply watermark with 70% opacity",
    },
    {
      id: "2",
      name: "Resize",
      type: "resize",
      enabled: true,
      description: "Resize to 1920x1080",
    },
    {
      id: "3",
      name: "Filters",
      type: "filter",
      enabled: false,
      description: "Apply vintage filter",
    },
  ];

  const getOperationColor = (type: string) => {
    switch (type) {
      case "watermark":
        return "primary";
      case "resize":
        return "secondary";
      case "crop":
        return "success";
      case "filter":
        return "warning";
      default:
        return "default";
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Batch Operations
      </Typography>

      <Typography variant="body2" color="textSecondary" paragraph>
        Configure multiple operations to be applied to all selected images in
        sequence.
      </Typography>

      {operations.length === 0 ? (
        <Alert severity="info" sx={{ mb: 2 }}>
          No batch operations configured. Use the other tabs to set up
          operations, then they will appear here.
        </Alert>
      ) : (
        <List sx={{ mb: 2 }}>
          {operations.map((operation, index) => (
            <ListItem
              key={operation.id}
              sx={{
                border: 1,
                borderColor: "grey.200",
                borderRadius: 1,
                mb: 1,
                backgroundColor: operation.enabled ? "action.hover" : "grey.50",
              }}
            >
              <ListItemText
                primary={
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="subtitle2">
                      {index + 1}. {operation.name}
                    </Typography>
                    <Chip
                      label={operation.type}
                      size="small"
                      color={getOperationColor(operation.type) as any}
                      variant="outlined"
                    />
                  </Box>
                }
                secondary={operation.description}
              />
              <ListItemSecondaryAction>
                <Box display="flex" alignItems="center" gap={1}>
                  <Switch
                    checked={operation.enabled}
                    onChange={() => {
                      // Toggle operation
                    }}
                    disabled={disabled}
                  />
                  <IconButton
                    edge="end"
                    onClick={() => {
                      // Remove operation
                    }}
                    disabled={disabled}
                  >
                    <Delete />
                  </IconButton>
                </Box>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}

      <Box display="flex" gap={2} mb={3}>
        <Button
          variant="outlined"
          startIcon={<Add />}
          disabled={disabled}
          onClick={() => {
            // Add new operation
          }}
        >
          Add Operation
        </Button>
      </Box>

      <Alert severity="info" sx={{ mb: 2 }}>
        Operations will be applied in the order shown above. You can reorder
        them by dragging.
      </Alert>

      <Button
        variant="contained"
        onClick={onProcess}
        disabled={
          disabled || operations.filter((op) => op.enabled).length === 0
        }
        fullWidth
        startIcon={<PlayArrow />}
        size="large"
      >
        Execute Batch Operations
      </Button>
    </Box>
  );
};
