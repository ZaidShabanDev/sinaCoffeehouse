export interface Point {
  x: number;
  y: number;
}

const SAMPLE_SCALE = 2;
const ALPHA_THRESHOLD = 128;

export async function sampleLogoPoints(svg: SVGSVGElement, count: number): Promise<Point[]> {
  const viewBox = svg.viewBox.baseVal;
  const width = Math.round(viewBox.width * SAMPLE_SCALE);
  const height = Math.round(viewBox.height * SAMPLE_SCALE);

  const pixels = await rasterizeSvg(svg, width, height);
  const inkedPixels = findInkedPixels(pixels, width * height);
  const picks = pickEvenly(inkedPixels, width, count);

  const toScreen = svg.getScreenCTM();
  if (!toScreen) throw new Error('Logo is not rendered');

  return picks.map((index) => {
    const userX = viewBox.x + (((index % width) + Math.random()) / width) * viewBox.width;
    const userY = viewBox.y + ((Math.floor(index / width) + Math.random()) / height) * viewBox.height;
    const screen = new DOMPoint(userX, userY).matrixTransform(toScreen);
    return { x: screen.x, y: screen.y };
  });
}

async function rasterizeSvg(svg: SVGSVGElement, width: number, height: number): Promise<Uint8ClampedArray> {
  const clone = svg.cloneNode(true) as SVGSVGElement;
  clone.setAttribute('width', String(width));
  clone.setAttribute('height', String(height));

  const markup = new XMLSerializer().serializeToString(clone);
  const url = URL.createObjectURL(new Blob([markup], { type: 'image/svg+xml' }));

  try {
    const image = new Image();
    image.src = url;
    await image.decode();

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    if (!context) throw new Error('2D canvas is not available');

    context.drawImage(image, 0, 0, width, height);
    return context.getImageData(0, 0, width, height).data;
  } finally {
    URL.revokeObjectURL(url);
  }
}

function findInkedPixels(pixels: Uint8ClampedArray, pixelCount: number): number[] {
  const inked: number[] = [];
  for (let i = 0; i < pixelCount; i++) {
    if (pixels[i * 4 + 3] > ALPHA_THRESHOLD) inked.push(i);
  }
  if (inked.length === 0) throw new Error('No filled pixels found in the logo');
  return inked;
}

// One random pixel per grid cell gives even coverage; cell size is chosen so cells ≈ count.
function pickEvenly(inkedPixels: number[], width: number, count: number): number[] {
  const cellSize = Math.max(1, Math.sqrt(inkedPixels.length / count));
  const cells = new Map<string, number[]>();

  for (const index of inkedPixels) {
    const key = `${Math.floor((index % width) / cellSize)},${Math.floor(Math.floor(index / width) / cellSize)}`;
    const members = cells.get(key);
    if (members) members.push(index);
    else cells.set(key, [index]);
  }

  const picks: number[] = [];
  for (const members of cells.values()) {
    picks.push(members[Math.floor(Math.random() * members.length)]);
  }

  shuffle(picks);
  while (picks.length < count) {
    picks.push(inkedPixels[Math.floor(Math.random() * inkedPixels.length)]);
  }
  return picks.slice(0, count);
}

function shuffle(items: number[]): void {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
}
