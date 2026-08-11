

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

  // Stores images selected from the clinician's computer or device.
  const [images, setImages] = useState<SelectedImage[]>([]);

  // Displays validation messages to the clinician.
  const [errorMessage, setErrorMessage] = useState("");

  // Handles images selected through the file input.
  function handleImageSelection(event: ChangeEvent<HTMLInputElement>) {
    const selectedFiles = Array.from(event.target.files ?? []);

    // Clear any previous error message.
    setErrorMessage("");

    // Do not allow more than five images for one case in this prototype.
    if (images.length + selectedFiles.length > 5) {
      setErrorMessage("You can upload a maximum of five images per case.");
      return;
    }

    // Check that every selected file is an accepted image type.
    const invalidFile = selectedFiles.find(
      (file) => !["image/jpeg", "image/png", "image/webp"].includes(file.type)
    );

    if (invalidFile) {
      setErrorMessage("Only JPG, PNG, and WebP images are supported.");
      return;
    }

    // Prevent very large files from being selected.
    const oversizedFile = selectedFiles.find(
      (file) => file.size > 10 * 1024 * 1024
    );

    if (oversizedFile) {
      setErrorMessage("Each image must be smaller than 10 MB.");
      return;
    }

    // Convert each selected file into a temporary preview item.
    const newImages = selectedFiles.map((file) => ({
      id: `${file.name}-${file.lastModified}-${Math.random()}`,
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    setImages((currentImages) => [...currentImages, ...newImages]);

    // Reset the input so the same file can be selected again if needed.
    event.target.value = "";
  }

  // Removes an image from the current case.
  function removeImage(imageId: string) {
    setImages((currentImages) => {
      const imageToRemove = currentImages.find((image) => image.id === imageId);

      // Release the temporary browser URL when the image is removed.
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.previewUrl);
      }

      return currentImages.filter((image) => image.id !== imageId);
    });
  }

  // Submits the selected images to the next frontend step.
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // A case must contain at least one image.
    if (images.length === 0) {
      setErrorMessage("Upload at least one lesion image before continuing.");
      return;
    }

    // The AI triage page will be created in the next step.
    router.push("/clinics/patients/new/triage");
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
          {/* Completed patient information step */}
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-sm font-semibold text-white">
            ✓
          </div>

          <div className="h-px flex-1 bg-sky-300" />

          {/* Completed clinical details step */}
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-sm font-semibold text-white">
            ✓
          </div>

          <div className="h-px flex-1 bg-sky-300" />

          {/* Current image step */}
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
            // Empty state shown before an image is selected.
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-10 text-center">
              <p className="text-sm text-slate-500">No images selected yet.</p>
            </div>
          ) : (
            // Preview grid shown after images are selected.
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

                    {/* Remove image button */}
                    <button
                      type="button"
                      onClick={() => removeImage(image.id)}
                      className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-slate-950/80 text-sm text-white transition hover:bg-red-600"
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
            onClick={() => router.back()}
            className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-center text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            Back
          </button>

          <button
            type="submit"
            className="rounded-xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-600"
          >
            Continue to AI triage
          </button>
        </div>
      </form>
    </div>
  );
}
