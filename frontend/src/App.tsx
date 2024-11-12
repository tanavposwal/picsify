import { useRef, useState } from "react";

function App() {
  const fileInput = useRef<HTMLInputElement>(null);
  const [asciiImageUrl, setAsciiImageUrl] = useState<string | null>(null);

  const uploadImage = async () => {
    const formData = new FormData();

    if (!fileInput.current || fileInput.current.files!.length === 0) {
      alert("Please select an image to upload.");
      return;
    }

    formData.append("image", fileInput.current.files![0]);

    try {
      const response = await fetch("http://localhost:3000/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        // Assuming the server responds with an image URL or ASCII image blob
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        setAsciiImageUrl(imageUrl);
      } else {
        console.error("Error response from server:", await response.text());
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  return (
    <>
      <form
        id="uploadForm"
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <input
          type="file"
          id="fileInput"
          name="image"
          accept="image/*"
          ref={fileInput}
          className="border-2 border-gray-300 rounded-md p-2"
        />
        <button
          type="button"
          onClick={uploadImage}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Upload Image
        </button>
      </form>

      {asciiImageUrl && (
        <img
          src={asciiImageUrl}
          alt="ASCII Art"
          className="mt-4 border border-gray-400 rounded"
        />
      )}
    </>
  );
}

export default App;
