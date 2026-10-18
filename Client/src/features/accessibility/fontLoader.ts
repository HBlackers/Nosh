import bold from "@/assets/fonts/opendyslexic-latin-700-normal.woff2";
import regular from "@/assets/fonts/opendyslexic-latin-400-normal.woff2";

let loading: Promise<void> | undefined;

// Loaded on demand so the 235 KB of font files only download for people who ask for the font.
export function loadDyslexiaFont(): Promise<void> {
  loading ??= Promise.all(
    [
      { url: regular, weight: "400" },
      { url: bold, weight: "700" },
    ].map(({ url, weight }) => new FontFace("OpenDyslexic", `url(${url}) format("woff2")`, { weight, display: "swap" }).load()),
  )
    .then(faces => faces.forEach(face => document.fonts.add(face)))
    .catch(() => {
      loading = undefined;
    });
  return loading;
}
