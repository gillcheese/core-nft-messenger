// components/ImagePreview.js
const ImagePreview = ({ imageUrl }) => (
  imageUrl && (
    <div className="mt-4">
      <img src={imageUrl} alt="Generated PNG" className="mx-auto border rounded-lg shadow-md w-full max-w-xs h-auto" />
    </div>
  )
);

export default ImagePreview;