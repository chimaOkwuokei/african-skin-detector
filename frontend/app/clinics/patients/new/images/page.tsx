"use client";

/* eslint-disable @next/next/no-img-element */
import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

// Each selected image is stored together with a temporary preview URL.
type SelectedImage = {
  id: string;
  file: File;
  previewUrl: string;
};

export default function LesionImagesPage() {
  const router = useRouter();

  const [images, setImages] = useState<SelectedImage[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Track upload state

  function handleImageSelection(event: ChangeEvent<HTMLInputElement>) {
    const selectedFiles = Array.from(event.target.files ?? []);
    setErrorMessage("");

    if (images.length + selectedFiles.length > 5) {
      setErrorMessage("You can upload a maximum of five images per case.");
      return;
    }

    const invalidFile = selectedFiles.find(
      (file) => !["image/jpeg", "image/png", "image/webp"].includes(file.type)
    );

    if (invalidFile) {
      setErrorMessage("Only JPG, PNG, and WebP images are supported.");
      return;
    }

    const oversizedFile = selectedFiles.find(
      (file) => file.size > 10 * 1024 * 1024
    );

    if (oversizedFile) {
      setErrorMessage("Each image must be smaller than 10 MB.");
      return;
    }

    const newImages = selectedFiles.map((file) => ({
      id: `${file.name}-${file.lastModified}-${Math.random()}`,
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    setImages((currentImages) => [...currentImages, ...newImages]);
    event.target.value = "";
  }

  function removeImage(imageId: string) {
    setImages((currentImages) => {
      const imageToRemove = currentImages.find((image) => image.id === imageId);

      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.previewUrl);
      }

      return currentImages.filter((image) => image.id !== imageId);
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (images.length === 0) {
      setErrorMessage("Upload a lesion image before continuing.");
      return;
    }

    // Retrieve the Case ID generated in Step 2
    const caseId = localStorage.getItem("current_case_id");

    if (!caseId) {
      setErrorMessage("Missing case record. Please go back and submit the clinical details first.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

      // ==========================================
      // 1. UPLOAD THE IMAGE
      // ==========================================
      const formData = new FormData();
      formData.append("file", images[0].file);

      const imageResponse = await fetch(`${baseUrl}/cases/${caseId}/images`, {
        method: "POST",
        body: formData, // No Content-Type header needed for FormData
      });

      if (!imageResponse.ok) {
        const errorData = await imageResponse.json().catch(() => ({}));
        // FastAPI often uses 'detail' for error messages
        const errMsg = errorData.detail || errorData.message || `Failed to upload image`;
        throw new Error(`Image Upload Error: ${errMsg}`);
      }

      console.log("Uploaded image successfully.");

      // ==========================================
      // 2. TRIGGER THE AI ANALYSIS
      // ==========================================
      const analysisResponse = await fetch(`${baseUrl}/cases/${caseId}/analyses`, {
        method: "POST",
        headers: {
          "Accept": "application/json",
        },
        // No body required according to the Swagger docs
      });

      if (!analysisResponse.ok) {
        const errorData = await analysisResponse.json().catch(() => ({}));
        const errMsg = errorData.detail || errorData.message || `Analysis failed`;
        throw new Error(`AI Analysis Error: ${errMsg}`);
      }

      const analysisResult = await analysisResponse.json();
      console.log("Analysis completed:", analysisResult);

      // Optional: Save the analysis result so the Triage page can display it immediately
      localStorage.setItem("current_analysis_data", JSON.stringify(analysisResult));

      // Clean up object URL
      URL.revokeObjectURL(images[0].previewUrl);

      // Proceed to the AI triage page
      router.push("/clinics/patients/new/triage");

    } catch (error) {
      const msg = error instanceof Error ? error.message : "Unknown error occurred";
      console.error("Pipeline failed:", msg);
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Page introduction */}
      <section>
        <p className="text-sm font-medium text-sky-600">
          Patient intake · Step 3
        </p>

        <h2 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">
          Add lesion images
        </h2>

        <p className="mt-2 max-w-2xl text-slate-500">
          Upload clear images of the affected skin area for preliminary AI
          triage and dermatologist review.
        </p>
      </section>

      {/* Workflow progress indicator */}
      <section className="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-sm font-semibold text-white">
            ✓
          </div>
          <div className="h-px flex-1 bg-sky-300" />
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-sm font-semibold text-white">
            ✓
          </div>
          <div className="h-px flex-1 bg-sky-300" />
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-500 text-sm font-semibold text-white">
            3
          </div>
        </div>

        <div className="mt-3 grid grid-cols-3 text-xs">
          <p className="font-medium text-emerald-600">Patient information</p>
          <p className="text-center font-medium text-emerald-600">
            Clinical details
          </p>
          <p className="text-right font-medium text-sky-600">
            Images and triage
          </p>
        </div>
      </section>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Upload instructions */}
        <section className="rounded-2xl border border-sky-100 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-950">
              Upload affected-area images
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Add up to five clear images. Include a wider view and a closer
              view where possible.
            </p>
          </div>

          {/* File input area */}
          <label
            htmlFor="lesionImages"
            className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-sky-200 bg-sky-50 px-6 py-12 text-center transition hover:border-sky-400 hover:bg-sky-100"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-2xl text-sky-500 shadow-sm">
              ↑
            </span>

            <span className="mt-4 text-sm font-semibold text-slate-950">
              Choose images from your device
            </span>

            <span className="mt-2 text-xs text-slate-500">
              JPG, PNG, or WebP · Maximum 10 MB per image
            </span>

            <input
              id="lesionImages"
              name="lesionImages"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              disabled={isLoading}
              onChange={handleImageSelection}
              className="sr-only"
            />
          </label>

          {/* Image-quality reminder */}
          <div className="mt-5 rounded-xl border border-amber-100 bg-amber-50 p-4">
            <p className="text-sm font-medium text-amber-800">
              Image quality reminder
            </p>

            <p className="mt-1 text-sm leading-6 text-amber-700">
              Use good lighting, keep the lesion in focus, avoid filters, and do
              not include unnecessary identifying information.
            </p>
          </div>
        </section>

        {/* Selected image previews */}
        <section className="rounded-2xl border border-sky-100 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-950">
                Selected images
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                {images.length} of 5 images selected
              </p>
            </div>
          </div>

          {images.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-10 text-center">
              <p className="text-sm text-slate-500">No images selected yet.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {images.map((image, index) => (
                <div
                  key={image.id}
                  className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
                >
                  <div className="relative aspect-square">
                    <img
                      src={image.previewUrl}
                      alt={`Lesion image ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={() => removeImage(image.id)}
                      className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-slate-950/80 text-sm text-white transition hover:bg-red-600 disabled:opacity-50"
                      aria-label={`Remove image ${index + 1}`}
                    >
                      ×
                    </button>
                  </div>
                  <div className="p-3">
                    <p className="truncate text-xs font-medium text-slate-700">
                      {image.file.name}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      {(image.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Validation error message */}
        {errorMessage && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {errorMessage}
          </div>
        )}

        {/* Form navigation */}
        <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
          <button
            type="button"
            disabled={isLoading}
            onClick={() => router.back()}
            className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-center text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
          >
            Back
          </button>

          <button
            type="submit"
            disabled={isLoading}
            className="rounded-xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-600 disabled:opacity-50"
          >
            {isLoading ? "Uploading..." : "Continue to AI triage"}
          </button>
        </div>
      </form>
    </div>
  );
}