import { useRef, useState } from "react";
import Loading from "../public/loading.gif";

function App() {
  const fileInput = useRef<HTMLInputElement>(null);
  const [asciiImageUrl, setAsciiImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as any);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async () => {
    const formData = new FormData();

    if (!fileInput.current || fileInput.current.files!.length === 0) {
      alert("Please select an image to upload.");
      return;
    }

    formData.append("image", fileInput.current.files![0]);

    setLoading(true);
    try {
      const response = await fetch("http://retro-filter.uk.to:3000/upload", {
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
    <div className="flex flex-col items-center w-full bg-yellow-100 h-screen">
      <div className="border-4 border-black px-10 py-5 bg-green-300 mt-10 mb-5 -skew-x-3 -skew-y-1 shadow-[6px_7px_0px_black]">
        <h1 className="text-3xl font-black text-black text-center">
          Retro Image <br /> Converter 📸
        </h1>
      </div>
      <div className="sm:border-4 border-[3px] border-black sm:px-16 px-6 sm:py-12 py-8 w-full sm:w-fit bg-blue-300 mt-8 mb-5 sm:shadow-[-5px_5px_0px_black]">
        <form
          id="uploadForm"
          className="flex flex-col items-center justify-center"
        >
          {/* images */}
          <div className="flex gap-3">
            <div className="sm:min-w-48 sm:max-w-56 w-40 sm:min-h-56 min-h-44 max-h-56 sm:max-h-64 flex items-center justify-center border-[3px] border-black relative group overflow-hidden bg-white">
              {!selectedImage && <span>select one</span>}
              {selectedImage && (
                <div>
                  <div className="absolute -bottom-8 opacity-0 blur-xl left-3 px-2 py-1 font-mono bg-black text-white group-hover:bottom-3 group-hover:opacity-90 group-hover:blur-0 transition-all">
                    Old
                  </div>
                  <img src={selectedImage} />
                </div>
              )}
            </div>
            <div className="sm:min-w-48 sm:max-w-56 w-40 sm:min-h-56 min-h-44 max-h-56 sm:max-h-64 flex items-center justify-center border-[3px] border-black relative group overflow-hidden bg-white">
              {!selectedImage && <span>select one first</span>}
              {(loading || asciiImageUrl) && (
                <div>
                  {loading && <img src={Loading} className="w-8" />}
                  {asciiImageUrl && !loading && (
                    <div>
                      <div className="absolute -bottom-8 opacity-0 blur-xl left-3 px-2 py-1 font-mono bg-black text-white group-hover:bottom-3 group-hover:opacity-90 group-hover:blur-0 transition-all">
                        New
                      </div>
                      <img
                        src={asciiImageUrl}
                        alt="ASCII Art"
                        className="max-h-72"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          {/* buttons */}
          <div className="flex gap-6 mt-5">
            <div>
              <label
                htmlFor="fileInput"
                className="cursor-pointer bg-purple-300 px-4 py-2 border-[3px] border-black shadow-[3px_3px_0px_black] hover:shadow-[0px_0px_0px_black] hover:translate-x-[5px] hover:translate-y-[5px] hover:bg-purple-400 sm:text-lg text-sm transition-all duration-300 font-bold block"
              >
                Choose an Image
              </label>
              <input
                type="file"
                id="fileInput"
                name="image"
                title="only png/jpg/jpeg"
                accept="image/png, image/jpg, image/jpeg"
                ref={fileInput}
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
            <button
              type="button"
              onClick={uploadImage}
              className="cursor-pointer bg-red-300 px-4 py-2 border-[3px] border-black shadow-[3px_3px_0px_black] hover:shadow-[0px_0px_0px_black] hover:translate-x-[5px] hover:translate-y-[5px] hover:bg-red-400 sm:text-lg text-sm transition-all duration-300 font-bold"
            >
              Convert
            </button>
          </div>
        </form>
      </div>
      <div className="mt-4 flex flex-col items-center justify-center">
        <h1 className="text-lg font-bold mb-2">Follow me on 𝕏</h1>
      <a href="https://twitter.com/tanavindev?ref_src=twsrc%5Etfw" className="twitter-follow-button" data-show-count="false">Follow @tanavindev</a>
      </div>
    </div>
  );
}

export default App;
