/**
 * Utilities for serializing and validating 128-dimensional face descriptors.
 */

export const serializeDescriptor = (descriptor) => {
  if (!descriptor) return null;
  if (Array.isArray(descriptor)) {
    return JSON.stringify(descriptor);
  }
  if (descriptor instanceof Float32Array || ArrayBuffer.isView(descriptor)) {
    return JSON.stringify(Array.from(descriptor));
  }
  return JSON.stringify(descriptor);
};

export const parseDescriptor = (serialized) => {
  if (!serialized) return null;
  try {
    const parsed = typeof serialized === 'string' ? JSON.parse(serialized) : serialized;
    if (Array.isArray(parsed) && parsed.length === 128) {
      return new Float32Array(parsed);
    }
    return null;
  } catch {
    return null;
  }
};
