/**
 * @module Services
 */

/**
 * Service to handle image URL generation for different sizes.
 * Follows the convention: filename_size.extension
 * Sizes: 'thumb' (150w), 'medium' (400w), 'large' (800w), 'original'
 */
export const ImageService = {
    Sizes: {
        THUMB: 'thumb',
        ICON_THUMB: 'icon_thumb',
        MEDIUM: 'medium',
        LARGE: 'large',
        ORIGINAL: 'original'
    },

    /**
     * Returns the URL for the specified image size.
     * @param {string} originalPath - The path to the original image.
     * @param {string} size - One of ImageService.Sizes.
     * @returns {string} The path to the resized image.
     */
    getUrl: (originalPath, size = 'original') => {
        if (!originalPath) return '';
        if (originalPath.startsWith('http') || originalPath.startsWith('//')) return originalPath;
        if (size === 'original') return originalPath;

        const dotIndex = originalPath.lastIndexOf('.');
        if (dotIndex === -1) return originalPath;

        const basePath = originalPath.substring(0, dotIndex);
        const extension = originalPath.substring(dotIndex);

        return `${basePath}_${size}${extension}`;
    },

    /**
     * Generates srcset attribute value for responsive images.
     * @param {string} originalPath 
     * @returns {string} srcset string
     */
    getSrcSet: (originalPath) => {
        if (!originalPath) return '';
        const thumb = ImageService.getUrl(originalPath, 'thumb');
        const medium = ImageService.getUrl(originalPath, 'medium');
        const large = ImageService.getUrl(originalPath, 'large');
        const original = originalPath;

        // Assuming widths: thumb=150w, medium=400w, large=800w
        return `${thumb} 150w, ${medium} 400w, ${large} 800w, ${original} 1200w`;
    }
};
