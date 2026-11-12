"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FoodListing } from "@/types";
import Image from "next/image";
import { validatePhotos } from "@/lib/photo-utils";

type EditForm = {
  title: string;
  description: string;
  price: string;
  originalPrice: string;
  quantityAvailable: string;
};

type AlertMessage = {
  title: string;
  message: string;
  type: "success" | "error" | "warning";
} | null;

type EditListingProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editForm: EditForm;
  setEditForm: React.Dispatch<React.SetStateAction<EditForm>>;
  alertMessage: AlertMessage;
  setAlertMessage: React.Dispatch<React.SetStateAction<AlertMessage>>;
  onSave: () => void;
  selectedListing: FoodListing | null;
  existingPhotos: NonNullable<FoodListing["images"]>;
  setExistingPhotos: React.Dispatch<
    React.SetStateAction<NonNullable<FoodListing["images"]>>
  >;

  newPhotos: File[];
  setNewPhotos: React.Dispatch<React.SetStateAction<File[]>>;

  newPhotoPreviews: string[];
  setNewPhotoPreviews: React.Dispatch<React.SetStateAction<string[]>>;

  photoError: string | null;
  setPhotoError: React.Dispatch<React.SetStateAction<string | null>>;

  photoOrder: string[];
  setPhotoOrder: React.Dispatch<React.SetStateAction<string[]>>;
};

export default function EditListing({
  open,
  onOpenChange,
  //selectedListing,
  editForm,
  setEditForm,
  alertMessage,
  setAlertMessage,
  onSave,
  existingPhotos,
  setExistingPhotos,
  newPhotos,
  setNewPhotos,
  newPhotoPreviews,
  setNewPhotoPreviews,
  photoError,
  setPhotoError,
  photoOrder,
  setPhotoOrder,
}: EditListingProps) {
  const [draggedPhoto, setDraggedPhoto] = useState<string | null>(null);

  const handlePhotoSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files ?? []);
    const remainingSlots = 5 - existingPhotos.length - newPhotos.length;

    const validationError = validatePhotos(selectedFiles, remainingSlots);

    if (validationError) {
      setPhotoError(validationError);
      e.target.value = "";
      return;
    }

    const startIndex = newPhotos.length;

    setNewPhotos((prev) => [...prev, ...selectedFiles]);

    setNewPhotoPreviews((prev) => [
      ...prev,
      ...selectedFiles.map((file) => URL.createObjectURL(file)),
    ]);

    setPhotoOrder((prev) => [
      ...prev,
      ...selectedFiles.map((_, index) => `new-${startIndex + index}`),
    ]);

    setPhotoError(null);
    e.target.value = "";
  };

  const orderedExistingPhotos = [...existingPhotos].sort((a, b) => {
    const aIndex = photoOrder.indexOf(`existing-${a.id}`);
    const bIndex = photoOrder.indexOf(`existing-${b.id}`);

    return aIndex - bIndex;
  });

  const orderedNewPhotoPreviews = newPhotoPreviews
    .map((preview, index) => ({ preview, index }))
    .sort((a, b) => {
      const aIndex = photoOrder.indexOf(`new-${a.index}`);
      const bIndex = photoOrder.indexOf(`new-${b.index}`);

      return aIndex - bIndex;
    });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="overflow-y-auto border-l border-[#E8E2D8] bg-[#FFF9F0] text-[#26332D]"
      >
        <SheetHeader>
          <SheetTitle className="text-xl font-bold text-[#173D32]">
            Edit listing
          </SheetTitle>
          <SheetDescription className="text-sm text-[#718078]">
            Update the details of your food listing.
          </SheetDescription>
        </SheetHeader>

        {alertMessage && (
          <Alert
            className={`relative m-2 ${
              alertMessage.type === "success"
                ? "border-green-200 bg-green-50 text-green-900"
                : alertMessage.type === "error"
                  ? "border-red-200 bg-red-50 text-red-900"
                  : "border-yellow-200 bg-yellow-50 text-yellow-900"
            }`}
          >
            <AlertTitle>{alertMessage.title}</AlertTitle>
            <AlertDescription>{alertMessage.message}</AlertDescription>

            <button
              type="button"
              onClick={() => {
                setAlertMessage(null);
                onOpenChange(false);
              }}
              className="absolute right-3 top-3 text-current opacity-60 hover:opacity-100"
              aria-label="Close alert and drawer"
            >
              ✕
            </button>
          </Alert>
        )}

        <div className="m-2 space-y-2">
          <label className="text-sm font-medium">Listing title</label>
          <input
            type="text"
            value={editForm.title}
            onChange={(e) =>
              setEditForm({ ...editForm, title: e.target.value })
            }
            className="w-full rounded-lg border border-[#D8DED8] bg-white px-3 py-2 text-sm text-[#26332D] outline-none focus:border-[#173D32] focus:ring-2 focus:ring-[#173D32]/10"
          />
        </div>

        <div className="m-2 space-y-2">
          <label className="text-sm font-medium">Description</label>
          <textarea
            value={editForm.description}
            onChange={(e) =>
              setEditForm({ ...editForm, description: e.target.value })
            }
            placeholder="Describe your food listing"
            rows={3}
            className="w-full rounded-lg border border-[#D8DED8] bg-white px-3 py-2 text-sm text-[#26332D] outline-none focus:border-[#173D32] focus:ring-2 focus:ring-[#173D32]/10"
          />
        </div>

        <div className="m-2 space-y-2">
          <label className="text-sm font-medium">Selling price (R)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={editForm.price}
            onChange={(e) =>
              setEditForm({ ...editForm, price: e.target.value })
            }
            placeholder="0.00"
            className="w-full rounded-lg border border-[#D8DED8] bg-white px-3 py-2 text-sm text-[#26332D] outline-none focus:border-[#173D32] focus:ring-2 focus:ring-[#173D32]/10"
          />
        </div>

        <div className="m-2 space-y-2">
          <label className="text-sm font-medium">Original price (R)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={editForm.originalPrice}
            onChange={(e) =>
              setEditForm({ ...editForm, originalPrice: e.target.value })
            }
            placeholder="0.00"
            className="w-full rounded-lg border border-[#D8DED8] bg-white px-3 py-2 text-sm text-[#26332D] outline-none focus:border-[#173D32] focus:ring-2 focus:ring-[#173D32]/10"
          />
        </div>

        <div className="m-2 space-y-2">
          <label className="text-sm font-medium">Quantity available</label>
          <input
            type="number"
            min="0"
            value={editForm.quantityAvailable}
            onChange={(e) =>
              setEditForm({
                ...editForm,
                quantityAvailable: e.target.value,
              })
            }
            className="w-full rounded-lg border border-[#D8DED8] bg-white px-3 py-2 text-sm text-[#26332D] outline-none focus:border-[#173D32] focus:ring-2 focus:ring-[#173D32]/10"
          />
        </div>

        <div className="m-2 space-y-3">
          <label className="text-sm font-medium">Listing photos</label>

          <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
            {orderedExistingPhotos.map((photo) => (
              <div
                key={photo.id}
                draggable
                onDragStart={() => {
                  setDraggedPhoto(`existing-${photo.id}`);
                }}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => {
                  const targetPhoto = `existing-${photo.id}`;

                  if (!draggedPhoto || draggedPhoto === targetPhoto) return;

                  setPhotoOrder((prev) => {
                    const updated = [...prev];

                    const draggedIndex = updated.indexOf(draggedPhoto);
                    const targetIndex = updated.indexOf(targetPhoto);

                    if (draggedIndex === -1 || targetIndex === -1) return prev;

                    updated.splice(draggedIndex, 1);
                    updated.splice(targetIndex, 0, draggedPhoto);

                    return updated;
                  });

                  setDraggedPhoto(null);
                }}
                className="relative overflow-hidden rounded-lg border cursor-grab"
              >
                <Image
                  src={photo.url}
                  alt={photo.name}
                  width={400}
                  height={300}
                  className="h-24 w-full object-cover"
                />

                <button
                  type="button"
                  onClick={() => {
                    setExistingPhotos((prev) =>
                      prev.filter((item) => item.id !== photo.id),
                    );
                  }}
                  className="absolute right-1 top-1 rounded-full bg-red-600 px-2 py-1 text-xs font-semibold text-white hover:bg-red-700"
                  aria-label={`Remove ${photo.name}`}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Add photos ({existingPhotos.length + newPhotos.length}/5)
            </label>

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              disabled={existingPhotos.length + newPhotos.length >= 5}
              onChange={handlePhotoSelection}
              className="w-full rounded-lg border border-[#D8DED8] bg-white p-2 text-sm"
            />
          </div>
          {photoError && <p className="text-xs text-red-600">{photoError}</p>}

          <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
            {orderedNewPhotoPreviews.map(({ preview, index }) => (
              <div
                key={preview}
                draggable
                onDragStart={() => {
                  setDraggedPhoto(`new-${index}`);
                }}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => {
                  const targetPhoto = `new-${index}`;

                  if (!draggedPhoto || draggedPhoto === targetPhoto) return;

                  setPhotoOrder((prev) => {
                    const updated = [...prev];

                    const draggedIndex = updated.indexOf(draggedPhoto);
                    const targetIndex = updated.indexOf(targetPhoto);

                    if (draggedIndex === -1 || targetIndex === -1) return prev;

                    updated.splice(draggedIndex, 1);
                    updated.splice(targetIndex, 0, draggedPhoto);

                    return updated;
                  });

                  setDraggedPhoto(null);
                }}
                className="relative overflow-hidden rounded-lg border cursor-grab"
              >
                <Image
                  src={preview}
                  alt={`New photo ${index + 1}`}
                  width={400}
                  height={300}
                  unoptimized
                  className="h-24 w-full object-cover"
                />

                <button
                  type="button"
                  onClick={() => {
                    setNewPhotos((prev) => prev.filter((_, i) => i !== index));

                    setNewPhotoPreviews((prev) =>
                      prev.filter((_, i) => i !== index),
                    );

                    URL.revokeObjectURL(preview);
                  }}
                  className="absolute right-1 top-1 rounded-full bg-red-600 px-2 py-1 text-xs font-semibold text-white hover:bg-red-700"
                  aria-label={`Remove new photo ${index + 1}`}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="m-2 flex gap-3">
          <button
            type="button"
            onClick={() => {
              setAlertMessage(null);
              onOpenChange(false);
            }}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onSave}
            className="flex-1 rounded-lg bg-forest px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#245344]"
          >
            Save Changes
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
