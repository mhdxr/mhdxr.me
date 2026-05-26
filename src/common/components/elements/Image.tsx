'use client';

import clsx from 'clsx';
import NextImage, { ImageProps as NextImageProps } from 'next/image';
import { useState } from 'react';

import cn from '@/common/libs/cn';

type ImageProps = {
  rounded?: string;
} & NextImageProps;

/**
 * Wrapper around next/image that adds a soft blur-in skeleton effect.
 *
 * - `quality` defaults to 75 (next/image default) but can be overridden.
 * - `priority` and `loading` are NOT forced — callers control above-the-fold
 *   behavior. If both are unset, next/image will use lazy loading by default.
 */
const Image = (props: ImageProps) => {
  const { alt, src, className, rounded, quality, priority, loading, ...rest } =
    props;
  const [isLoading, setLoading] = useState(true);

  // Only set `loading` when the caller didn't pass `priority`. next/image
  // throws if both are specified.
  const loadingProp = priority ? undefined : loading;

  return (
    <div
      className={clsx(
        'overflow-hidden',
        isLoading ? 'animate-pulse' : '',
        rounded,
      )}
    >
      <NextImage
        className={cn(
          'duration-700 ease-in-out',
          isLoading
            ? 'scale-[1.02] blur-xl grayscale'
            : 'scale-100 blur-0 grayscale-0',
          rounded,
          className,
        )}
        src={src}
        alt={alt}
        quality={quality ?? 75}
        priority={priority}
        loading={loadingProp}
        onLoadingComplete={() => setLoading(false)}
        {...rest}
      />
    </div>
  );
};
export default Image;
