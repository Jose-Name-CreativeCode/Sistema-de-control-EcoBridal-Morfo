"use client";

import { useMemo, useState } from "react";

type GalleryItem = {
  id: string;
  imageUrl: string;
  altText: string | null;
  photoType: string;
  sortOrder: number;
};

type DressProductGalleryProps = {
  dressName: string;
  photos: GalleryItem[];
  photoTypeLabels: Record<string, string>;
};

function isVideoAsset(source: string, photoType: string) {
  if (photoType === "VIDEO") {
    return true;
  }

  return (
    source.startsWith("data:video/") || /\.(mp4|mov|webm|ogg)$/i.test(source)
  );
}

export function DressProductGallery({
  dressName,
  photos,
  photoTypeLabels,
}: DressProductGalleryProps) {
  const usablePhotos = useMemo(
    () =>
      photos
        .filter((photo) => photo.imageUrl)
        .sort((a, b) => a.sortOrder - b.sortOrder),
    [photos],
  );

  const [selectedId, setSelectedId] = useState(usablePhotos[0]?.id ?? null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [zoom, setZoom] = useState<{ x: number; y: number; active: boolean }>({
    x: 50,
    y: 50,
    active: false,
  });

  const selectedPhoto =
    usablePhotos.find((photo) => photo.id === selectedId) ??
    usablePhotos[0] ??
    null;

  if (!selectedPhoto) {
    return (
      <div className="rounded-[28px] border border-line bg-white p-8">
        <div className="flex min-h-[420px] items-center justify-center rounded-[24px] bg-[linear-gradient(135deg,#eef3ff,#dce6fb)] p-8 text-center">
          <div>
            <p className="font-heading text-5xl text-accent-strong">
              {dressName}
            </p>
            <p className="mt-4 text-sm text-foreground/65">
              Todavía no hay fotos cargadas para este vestido.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const selectedIsVideo = isVideoAsset(
    selectedPhoto.imageUrl,
    selectedPhoto.photoType,
  );
  const visibleCount = Math.min(2, usablePhotos.length);
  const visiblePhotos =
    usablePhotos.length <= visibleCount
      ? usablePhotos
      : Array.from({ length: visibleCount }, (_, offset) => {
          const index = (carouselIndex + offset) % usablePhotos.length;
          return usablePhotos[index];
        });

  function goPrev() {
    if (usablePhotos.length <= visibleCount) {
      return;
    }

    setCarouselIndex(
      (current) => (current - 1 + usablePhotos.length) % usablePhotos.length,
    );
  }

  function goNext() {
    if (usablePhotos.length <= visibleCount) {
      return;
    }

    setCarouselIndex((current) => (current + 1) % usablePhotos.length);
  }

  return (
    <div className="rounded-[28px] border border-line bg-white p-5">
      <div className="grid gap-4">
        <div
          className="relative rounded-[24px] border border-line bg-[#f3eee8]"
          onMouseMove={(event) => {
            if (selectedIsVideo) {
              return;
            }

            const rect = event.currentTarget.getBoundingClientRect();
            const x = ((event.clientX - rect.left) / rect.width) * 100;
            const y = ((event.clientY - rect.top) / rect.height) * 100;
            setZoom({ x, y, active: true });
          }}
          onMouseEnter={() => {
            if (!selectedIsVideo) {
              setZoom((current) => ({ ...current, active: true }));
            }
          }}
          onMouseLeave={() =>
            setZoom((current) => ({ ...current, active: false }))
          }
        >
          {selectedIsVideo ? (
            <video
              src={selectedPhoto.imageUrl}
              controls
              className="h-[620px] w-full bg-black object-contain"
            />
          ) : (
            <>
              <div
                className="absolute inset-0 scale-110 bg-cover bg-center opacity-35 blur-2xl"
                style={{ backgroundImage: `url(${selectedPhoto.imageUrl})` }}
              />
              <img
                src={selectedPhoto.imageUrl}
                alt={selectedPhoto.altText ?? dressName}
                className="relative z-10 h-[620px] w-full object-contain object-[center_8%]"
              />
              <div className="pointer-events-none absolute inset-0 z-40 hidden xl:block">
                <div
                  className={`absolute right-6 top-6 h-[420px] w-[340px] overflow-hidden rounded-[22px] border border-line bg-white shadow-[0_18px_40px_rgba(0,0,0,0.28)] transition ${
                    zoom.active ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <div className="absolute inset-0 bg-white" />
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `url(${selectedPhoto.imageUrl})`,
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "180%",
                      backgroundPosition: `${zoom.x}% ${zoom.y}%`,
                    }}
                  />
                </div>
              </div>
            </>
          )}
        </div>

        <div className="rounded-[22px] border border-line bg-[#f7f3ee] px-4 py-3">
          <div className="mx-auto flex max-w-[420px] items-center justify-center gap-3">
            <button
              type="button"
              onClick={goPrev}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line bg-white text-lg text-foreground transition hover:border-accent hover:text-accent"
              aria-label="Foto anterior"
            >
              ←
            </button>

            <div className="grid w-full max-w-[420px] grid-cols-2 gap-2">
              {visiblePhotos.map((photo) => {
                const active = photo.id === selectedPhoto.id;
                const video = isVideoAsset(photo.imageUrl, photo.photoType);

                return (
                  <button
                    key={photo.id}
                    type="button"
                    onClick={() => setSelectedId(photo.id)}
                    className={`overflow-hidden rounded-2xl border transition ${
                      active
                        ? "border-accent-strong shadow-[0_8px_20px_rgba(63,111,198,0.18)]"
                        : "border-line hover:border-accent"
                    }`}
                  >
                    <div className="relative aspect-square overflow-hidden bg-[#f3eee8]">
                      {!video ? (
                        <div
                          className="absolute inset-0 scale-110 bg-cover bg-center opacity-35 blur-xl"
                          style={{ backgroundImage: `url(${photo.imageUrl})` }}
                        />
                      ) : null}
                      {video ? (
                        <video
                          src={photo.imageUrl}
                          className="relative z-10 h-full w-full object-contain"
                        />
                      ) : (
                        <img
                          src={photo.imageUrl}
                          alt={photo.altText ?? `${dressName} miniatura`}
                          className="relative z-10 h-full w-full object-contain"
                        />
                      )}
                      <div className="absolute inset-x-0 bottom-0 bg-black/45 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white">
                        {photoTypeLabels[photo.photoType] ?? photo.photoType}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={goNext}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line bg-white text-lg text-foreground transition hover:border-accent hover:text-accent"
              aria-label="Foto siguiente ->"
            ></button>
          </div>
        </div>
      </div>
    </div>
  );
}
