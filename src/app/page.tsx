'use client';

import { useState } from 'react';
import { Button, Grid, Typography, Container, Box, Paper, Input } from '@mui/material';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const HomePage = () => {
  const [images, setImages] = useState<File[]>([]);
  const [watermark, setWatermark] = useState<File | null>(null);
  const [watermarkedImages, setWatermarkedImages] = useState<string[]>([]);

  // Handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setImages(Array.from(event.target.files));
    }
  };

  // Handle watermark upload
  const handleWatermarkUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setWatermark(event.target.files[0]);
    }
  };

  // Check if the image is portrait or landscape
  const getImageOrientation = (image: HTMLImageElement) => {
    return image.width > image.height ? 'landscape' : 'portrait';
  };

  // Apply watermark to image using Canvas
  const applyWatermark = (imageFile: File, watermarkFile: File) => {
    return new Promise<string>((resolve, reject) => {
      const image = new Image();
      const reader = new FileReader();
      reader.onload = () => {
        image.src = reader.result as string;
      };
      reader.readAsDataURL(imageFile);

      image.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject('Canvas context not found');

        const imageOrientation = getImageOrientation(image);
        const watermarkImage = new Image();
        const watermarkReader = new FileReader();
        watermarkReader.onload = () => {
          watermarkImage.src = watermarkReader.result as string;
        };
        watermarkReader.readAsDataURL(watermarkFile);

        watermarkImage.onload = () => {
          const watermarkWidth = watermarkImage.width;
          const watermarkHeight = watermarkImage.height;
          const imageWidth = image.width;
          const imageHeight = image.height;

          canvas.width = imageWidth;
          canvas.height = imageHeight;
          ctx.drawImage(image, 0, 0);

          // Calculate watermark position
          const x = (imageWidth - watermarkWidth) / 2;
          const y = (imageHeight - watermarkHeight) / 2;

          ctx.drawImage(watermarkImage, x, y, watermarkWidth, watermarkHeight);
          const watermarkedDataUrl = canvas.toDataURL();
          resolve(watermarkedDataUrl);
        };
      };
    });
  };

  // Process all images
  const handleWatermarkImages = async () => {
    if (!watermark) return;

    const watermarkedDataUrls = [];
    for (const imageFile of images) {
      const watermarkedImage = await applyWatermark(imageFile, watermark);
      watermarkedDataUrls.push(watermarkedImage);
    }
    setWatermarkedImages(watermarkedDataUrls);
  };

  // Download all watermarked images
  const handleDownloadAll = () => {
    const zip = new JSZip();
    watermarkedImages.forEach((dataUrl, index) => {
      zip.file(`watermarked_image_${index + 1}.png`, dataUrl.split(',')[1], { base64: true });
    });

    zip.generateAsync({ type: 'blob' }).then((content) => {
      saveAs(content, 'watermarked_images.zip');
    });
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom align="center">
        Watermark Photo Editor
      </Typography>
      
      <Box display="flex" justifyContent="center" mb={2}>
        <Input
          type="file"
          accept="image/*"
          inputProps={{ multiple: true }}
          onChange={handleImageUpload}
        />
      </Box>

      <Box display="flex" justifyContent="center" mb={2}>
        <Input
          type="file"
          accept="image/*"
          onChange={handleWatermarkUpload}
        />
      </Box>

      <Grid container spacing={2} justifyContent="center">
        {images.map((file, index) => (
          <Grid item key={index}>
            <Paper>
              <img
                src={URL.createObjectURL(file)}
                alt={`Image ${index + 1}`}
                width={150}
                height={150}
              />
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Box display="flex" justifyContent="center" mt={2}>
        <Button variant="contained" onClick={handleWatermarkImages} disabled={!watermark || images.length === 0}>
          Apply Watermark
        </Button>
      </Box>

      {watermarkedImages.length > 0 && (
        <Box display="flex" justifyContent="center" mt={2}>
          <Button variant="contained" onClick={handleDownloadAll}>
            Download All Watermarked Images
          </Button>
        </Box>
      )}

      <Grid container spacing={2} justifyContent="center" mt={3}>
        {watermarkedImages.map((imageUrl, index) => (
          <Grid item key={index}>
            <Paper>
              <img src={imageUrl} alt={`Watermarked Image ${index + 1}`} width={150} height={150} />
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default HomePage;
