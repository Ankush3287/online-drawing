const  imageDataToBase64=(imageData)=> {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = imageData.width;
    canvas.height = imageData.height;
    ctx.putImageData(imageData, 0, 0);
    return canvas.toDataURL('image/png');
  }
  function base64ToImageData(base64Data, callback) {
    const img = new Image();
    img.onload = function () {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
  
      // Ensure the canvas has the same dimensions as the image
      canvas.width = img.width;
      canvas.height = img.height;
  
      // Draw the image on the canvas
      ctx.drawImage(img, 0, 0);
  
      // Get the ImageData from the canvas
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  
      // Invoke the callback with the retrieved ImageData
      callback(imageData);
    };
  
    // Set the image source, triggering the onload event
    img.src = base64Data;
  }
  
  export {imageDataToBase64, base64ToImageData} ;