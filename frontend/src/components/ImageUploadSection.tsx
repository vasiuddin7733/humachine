import { useRef } from 'react'

import type { UploadedImage } from '../types/marketplace'

type ImageUploadSectionProps = {
  images: UploadedImage[]
  onAddImages: (files: FileList | File[]) => void
  onRemoveImage: (id: string) => void
}

export function ImageUploadSection({ images, onAddImages, onRemoveImage }: ImageUploadSectionProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) {
      return
    }

    onAddImages(fileList)
  }

  return (
    <section
      className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
      aria-label="Product images"
    >
      <div className="mb-5">
        <h2 className="text-2xl font-bold text-slate-900">Upload product images</h2>
        <p className="mt-2 text-slate-600">
          Add catalog photos first. These previews are used across Amazon, Flipkart, and Meesho
          listing blocks below.
        </p>
      </div>

      <div
        className="flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50/40 px-6 py-10 text-center transition hover:border-indigo-400 hover:bg-indigo-50"
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault()
          event.stopPropagation()
        }}
        onDrop={(event) => {
          event.preventDefault()
          event.stopPropagation()
          handleFiles(event.dataTransfer.files)
        }}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            inputRef.current?.click()
          }
        }}
        aria-label="Upload product images"
      >
        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100 text-2xl text-indigo-600">
          +
        </div>
        <p className="font-semibold text-slate-900">Drag and drop images here</p>
        <p className="mt-1 text-sm text-slate-500">or click to browse JPG, PNG, WEBP</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          aria-label="Choose product image files"
          onChange={(event) => {
            handleFiles(event.target.files)
            event.target.value = ''
          }}
        />
      </div>

      {images.length > 0 ? (
        <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {images.map((image, index) => (
            <li key={image.id} className="group relative overflow-hidden rounded-xl border border-slate-200">
              <img
                src={image.previewUrl}
                alt={`Product upload ${index + 1}`}
                className="aspect-square w-full object-cover"
              />
              {index === 0 ? (
                <span className="absolute left-2 top-2 rounded-full bg-slate-900/75 px-2 py-0.5 text-xs font-medium text-white">
                  Main
                </span>
              ) : null}
              <button
                type="button"
                className="absolute right-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-xs font-semibold text-slate-700 opacity-0 shadow transition group-hover:opacity-100"
                onClick={() => onRemoveImage(image.id)}
                aria-label={`Remove image ${index + 1}`}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  )
}
