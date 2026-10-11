import type { GalleryImage } from "@/lib/gallery-types";
import { cn } from "@/lib/utils";
import { ImageCard } from "./ImageCard";

type Props = {
  images: GalleryImage[];
  onSelect: (index: number) => void;
  dimmed?: boolean;
};

export function ImageGrid({ images, onSelect, dimmed = false }: Props) {
  return (
    <ul
      className={cn(
        "grid grid-cols-2 gap-3 transition-opacity sm:grid-cols-3 sm:gap-4 lg:grid-cols-4",
        dimmed && "opacity-60",
      )}
    >
      {images.map((image, i) => (
        <li key={image.key}>
          <ImageCard image={image} priority={i < 4} onOpen={() => onSelect(i)} />
        </li>
      ))}
    </ul>
  );
}
