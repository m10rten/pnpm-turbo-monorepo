export async function safetry<T>(callback: Promise<T> | (() => Promise<T>)) {
  try {
    const result = await (callback instanceof Function ? callback() : callback);
    return { data: result, success: true };
  } catch (error) {
    return { success: false, error };
  }
}
