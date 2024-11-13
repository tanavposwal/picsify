import { useRef, useState } from "react";
import Loading from "../public/loading.gif";

function App() {
  const fileInput = useRef<HTMLInputElement>(null);
  const [asciiImageUrl, setAsciiImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const uploadImage = async () => {
    const formData = new FormData();

    if (!fileInput.current || fileInput.current.files!.length === 0) {
      alert("Please select an image to upload.");
      return;
    }

    formData.append("image", fileInput.current.files![0]);

    setLoading(true);
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
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen">
      <h1 className="text-4xl font-black text-gray-700 mb-8">
        Retro Image Converter
      </h1>
      <form
        id="uploadForm"
        className="bg-white border rounded-xl px-8 pt-6 pb-8 mb-4 flex flex-col gap-4 w-96"
      >
        <input
          type="file"
          id="fileInput"
          name="image"
          accept="image/*"
          ref={fileInput}
          className="file:bg-white file:border-nonde file:text-xl file:font-bold file:rounded-xl file:p-6 file:cursor-pointer file:hover:bg-gray-100 file:transition-colors file:"
        />
        <button
          type="button"
          onClick={uploadImage}
          className="bg-white border border-blue-600 hover:bg-blue-600 text-blue-600 hover:text-white font-bold py-2 px-4 transition-colors rounded-xl active text-lg"
        >
          Convert
        </button>
      </form>

      {(loading || asciiImageUrl) && (
        <div className="rounded-xl border overflow-hidden w-96 min-h-48 flex items-center justify-center">
          {loading && <img src={Loading} className="w-8" />}
          {(asciiImageUrl && !loading) && <img src={asciiImageUrl} alt="ASCII Art" />}
        </div>
      )}
    </div>
  );
}

export default App;
