import ImageKit from 'imagekit-javascript';
import {
  Transformation,
  TransformationPosition,
} from 'imagekit-javascript/dist/src/interfaces/Transformation';
import { environment } from '../environment';

const imagekit = new ImageKit({ urlEndpoint: environment.imagekitUrlEndpoint });

export const toImagekitUrl = (
  path: string | undefined = '',
  transformation: Transformation[] = [],
  transformationPosition?: TransformationPosition,
) =>
  path?.includes(environment.imagekitUrlEndpoint)
    ? path
    : imagekit.url({
        urlEndpoint: environment.imagekitUrlEndpoint,
        path,
        transformation,
        transformationPosition,
      });
