const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;

export const uploadToCloudinary = async (
  file: File,
  onProgress: (p: number) => void
): Promise<{ url: string; publicId: string }> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("folder", "home-services/services");

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(
      "POST",
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`
    );

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        const res = JSON.parse(xhr.responseText);
        resolve({ url: res.secure_url, publicId: res.public_id });
      } else {
        reject("Upload failed");
      }
    };

    xhr.onerror = () => reject("Network error");
    xhr.send(formData);
  });
};

export const deleteFromCloudinary = async (publicId: string) => {
  if (!publicId) return;
  try {
    await fetch("/api/provider/cloudinary", {
      method: "POST",
      body: JSON.stringify({ publicId }),
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Failed to cleanup image:", publicId);
  }
};