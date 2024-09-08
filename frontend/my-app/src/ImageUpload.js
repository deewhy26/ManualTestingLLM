import React, { useState, useRef, useEffect } from "react";
import "./style.css";
import { useNavigate } from "react-router-dom"; 
import {BarLoader} from "react-spinners"
function ImageUpload() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const [images, setImages] = useState([]);
  const [textInput, setTextInput] = useState(""); // For text input
  const hiddenFileInput = useRef(null);
  const textareaRef = useRef(null);

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    files.forEach((file) => {
      const imgname = file.name;
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        const img = new Image();
        img.src = reader.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const maxSize = Math.max(img.width, img.height);
          canvas.width = maxSize;
          canvas.height = maxSize;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(
            img,
            (maxSize - img.width) / 2,
            (maxSize - img.height) / 2
          );
          canvas.toBlob(
            (blob) => {
              const newFile = new File([blob], imgname, {
                type: "image/png",
                lastModified: Date.now(),
              });

              setImages((prevImages) => [...prevImages, newFile]);
            },
            "image/jpeg",
            0.8
          );
        };
      };
    });
  };

  const handleUploadButtonClick = () => {
    hiddenFileInput.current.click();
  };

  const handleFileUpload = () => {
      setIsLoading(true); 
      var formdata = new FormData();

      // Assuming `images` is a list of image files (from input type="file" with multiple attribute)
      for (var i = 0; i < images.length; i++) {
          formdata.append("images", images[i]); // Append each image file
      }

      formdata.append("text_input", textInput); // Add text input to the form data

      var requestOptions = {
          method: "POST",
          body: formdata,
          redirect: "follow",
      };
      
      fetch("http://127.0.0.1:5000", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setIsLoading(false);
        navigate("/test-cases", { state: { results: result.results } }); // Navigate to the new page with data
      })
      .catch((error) => {
        setIsLoading(false);
        console.log("error", error);
      });
    
  };

  const handleRemoveImage = (indexToRemove) => {
    setImages((prevImages) =>
      prevImages.filter((_, index) => index !== indexToRemove)
    );
  };

  useEffect(() => {
    // Adjust textarea height based on content
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto"; // Reset height
      textarea.style.height = `${textarea.scrollHeight}px`; // Set new height based on content
    }
  }, [textInput]);

   return (
    <div className="image-upload-container">
      {isLoading ? (
        <div className="loading-spinner">
          {/* Loading Spinner */}
          <div className="spinner"></div>
          <BarLoader />
          <p>Loading...</p>
        </div>
      ) : (
        <div className="box-decoration">
          <label htmlFor="image-upload-input" className="image-upload-label">
            {images.length > 0
              ? `${images.length} image(s) selected`
              : "Choose images"}
          </label>

          <div className="image-preview">
            {images.length > 0 &&
              images.map((image, index) => (
                <div key={index} className="image-wrapper">
                  <img
                    src={URL.createObjectURL(image)}
                    alt="upload preview"
                    className="img-display-after"
                  />
                  <button
                    className="remove-button"
                    onClick={() => handleRemoveImage(index)}
                  >
                    &times;
                  </button>
                </div>
              ))}
          </div>

          <input
            id="image-upload-input"
            type="file"
            onChange={handleImageChange}
            ref={hiddenFileInput}
            style={{ display: "none" }}
            multiple
          />

          <div className="button-container">
            <button className="image-upload-button" onClick={handleUploadButtonClick}>
              Select Images
            </button>
          </div>

          <textarea
            ref={textareaRef}
            className="text-input-box"
            placeholder="Any other instructions..."
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            rows={2} // Start with two rows
          />

          <button className="image-upload-button" onClick={handleFileUpload}>
            Describe Testing Instructions
          </button>
        </div>
      )}
    </div>
  );
}

export default ImageUpload;
