// Returns value of the highest ID in the index signature object
import {StrictHttpResponse} from '../../services/strict-http-response';

export function getLastIndex(map: { [key: string]: any }): number {
  return Object.keys(map)
    .reduce((highestId: number, key: string): number => {
      const id: number = Number(key);
      return id > highestId
        ? id
        : highestId;
    }, 0);
}

export function lengthToArray(length: number): number[] {
  return Array.from(
    {length: length}, (_: unknown, i: number): number => i
  );
}

export function toNgSrc(src: string, imageSize: number, imageFit: string): string {
  return `${src}?width=${imageSize}&height=${imageSize}&fit=${imageFit}`;
}

export function getLocation(response: StrictHttpResponse<any>): string {
  return response.headers.get('Location')!;
}

// FIXME DONE
