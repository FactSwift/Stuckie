from PIL import Image
import numpy as np
import os
from collections import Counter

sprites_dir = 'Stuckie-main/stuckie/public/sprites'

def remove_background(path):
    img = Image.open(path).convert('RGBA')
    data = np.array(img)

    # Sample border pixels to detect background color
    border = np.concatenate([
        data[0, :, :3], data[-1, :, :3],
        data[:, 0, :3], data[:, -1, :3],
    ])
    bg_color = Counter([tuple(p) for p in border]).most_common(1)[0][0]
    r, g, b = int(bg_color[0]), int(bg_color[1]), int(bg_color[2])

    # Remove pixels within tolerance of bg color
    mask = (
        (np.abs(data[:,:,0].astype(int) - r) < 30) &
        (np.abs(data[:,:,1].astype(int) - g) < 30) &
        (np.abs(data[:,:,2].astype(int) - b) < 30)
    )
    data[mask, 3] = 0

    result = Image.fromarray(data)
    bbox = result.getbbox()
    if bbox:
        result = result.crop(bbox)
    result.save(path)
    print(f'  {os.path.basename(path)}: bg={bg_color} -> {result.size}')

files = [f for f in os.listdir(sprites_dir) if f.endswith('.png')]
print(f'Processing {len(files)} sprites...')
for fname in files:
    remove_background(os.path.join(sprites_dir, fname))
print('Done.')
