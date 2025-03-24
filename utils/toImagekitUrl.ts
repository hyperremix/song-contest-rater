'use client';

import ImageKit from 'imagekit-javascript';
import {
  Transformation,
  TransformationPosition,
} from 'imagekit-javascript/dist/src/interfaces/Transformation';

const imagekit = new ImageKit({
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT ?? 'not-set',
});

export const toImagekitUrl = (
  path: string | undefined = '',
  transformation: Transformation[] = [],
  transformationPosition?: TransformationPosition,
) =>
  imagekit.url({
    path,
    transformation,
    transformationPosition,
  });
