const generateForm = document.querySelector(".generate-form");
const generateBtn = generateForm.querySelector(".generate-btn");
const imageGallery = document.querySelector(".image-gallery");

// Replace 'YOUR_OPENAI_API_KEY' with your actual OpenAI API key
const OPENAI_API_KEY ="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";
let isImageGenerating = false;

const updateImageCard = (imgDataArray) => {
  imgDataArray.forEach((imgObject, index) => {
    const imgCard = imageGallery.querySelectorAll(".img-card")[index];
    const imgElement = imgCard.querySelector("img");
    const downloadBtn = document.createElement("a");
    
    const aiGeneratedImage = `data:image/jpeg;base64,${imgObject.b64_json}`;
    imgElement.src = aiGeneratedImage;
    
    imgElement.onload = () => {
      imgCard.classList.remove("loading");
      downloadBtn.setAttribute("href", aiGeneratedImage);
      downloadBtn.setAttribute("download", `${new Date().getTime()}.jpg`);
      downloadBtn.innerHTML = '<img src="images/download.svg" alt="download icon">';
      imgCard.appendChild(downloadBtn);
    }
  });
}
// ...
const generateAiImages = async (userPrompt, userImgQuantity) => {
    try {
      const response = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", 
          "Authorization": `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          prompt: userPrompt,
          n: userImgQuantity,
          size: "512x512",
          options: {
            response_format: "b64_json"
          }
        }),
      });
  
      // ...
    } catch (error) {
      alert(error.message);
    } finally {
      generateBtn.removeAttribute("disabled");
      generateBtn.innerText = "Generate";
      isImageGenerating = false;
    }
  }
  
  // ...
  

const handleImageGeneration = (e) => {
  e.preventDefault();
  if (isImageGenerating) return;

  const userPrompt = e.target[0].value;
  const userImgQuantity = parseInt(e.target[1].value);

  generateBtn.setAttribute("disabled", true);
  generateBtn.innerText = "Generating";
  isImageGenerating = true;

  const imgCardMarkup = Array.from({ length: userImgQuantity }, () =>
    `<div class="img-card loading">
        <img src="images/loader.svg" alt="AI generated image">
    </div>`
  ).join("");

  imageGallery.innerHTML = imgCardMarkup;
  generateAiImages(userPrompt, userImgQuantity);
}

generateForm.addEventListener("submit", handleImageGeneration);
