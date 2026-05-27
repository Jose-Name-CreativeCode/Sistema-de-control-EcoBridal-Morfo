"use client";

import { useState } from "react";

type ModelPhotoZoomProps = {
  photoUrl: string;
  modelName: string;
};

export function ModelPhotoZoom({ photoUrl, modelName }: ModelPhotoZoomProps) {
  const [zoom, setZoom] = useState<{ x: number; y: number; active: boolean }>({
    x: 50,
    y: 50,
    active: false,
  });

  return (
    <div
      className="relative h-full w-full"
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;
        setZoom({ x, y, active: true });
      }}
      onMouseEnter={() => setZoom((current) => ({ ...current, active: true }))}
      onMouseLeave={() => setZoom((current) => ({ ...current, active: false }))}
    >
      <div
        className="absolute inset-0 scale-110 bg-cover bg-center opacity-30 blur-2xl"
        style={{ backgroundImage: `url(${photoUrl})` }}
      />
      <img
        src={photoUrl}
        alt={modelName}
        className="relative z-10 h-full w-full object-contain object-center"
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
              backgroundImage: `url(${photoUrl})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "180%",
              backgroundPosition: `${zoom.x}% ${zoom.y}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
