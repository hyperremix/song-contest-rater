'use client';

import { X } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';

type ImageViewerProps = {
  baseUri: string;
  zoomableImageUri: string;
  alt?: string;
};

export const ImageViewer = ({
  baseUri,
  zoomableImageUri,
  alt = 'Image',
}: ImageViewerProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <>
      <div
        className="relative cursor-pointer overflow-hidden rounded-lg"
        onClick={() => setIsFullscreen(true)}
      >
        <Image
          src={baseUri}
          alt={alt}
          width={128}
          height={128}
          className="rounded-lg object-cover"
        />
      </div>

      {isFullscreen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <button
            className="absolute right-4 top-4 z-10 rounded-full bg-black/50 p-2 text-white"
            onClick={() => setIsFullscreen(false)}
          >
            <X size={24} />
          </button>

          <TransformWrapper
            initialScale={1}
            minScale={0.5}
            maxScale={4}
            centerOnInit
          >
            {({ zoomIn, zoomOut, resetTransform }) => (
              <div className="flex h-full w-full flex-col items-center justify-center">
                <TransformComponent wrapperClass="w-full h-full">
                  <Image
                    src={zoomableImageUri}
                    alt={alt}
                    width={1024}
                    height={1024}
                    className="object-contain"
                  />
                </TransformComponent>

                <div className="absolute bottom-4 flex gap-2">
                  <button
                    onClick={() => zoomIn()}
                    className="rounded-full bg-black/50 p-2 text-white"
                  >
                    +
                  </button>
                  <button
                    onClick={() => zoomOut()}
                    className="rounded-full bg-black/50 p-2 text-white"
                  >
                    -
                  </button>
                  <button
                    onClick={() => resetTransform()}
                    className="rounded-full bg-black/50 p-2 text-white"
                  >
                    Reset
                  </button>
                </div>
              </div>
            )}
          </TransformWrapper>
        </div>
      )}
    </>
  );
};
