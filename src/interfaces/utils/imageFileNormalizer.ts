export function imageFileNormalizer(
  files: Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] } | undefined
): Express.Multer.File[] {
  try {
    if (!files) return [];

    if (Array.isArray(files)) {
      return files; // single field upload
    }

    if ("images" in files) {
      return files["images"];
    }

    return [];
  } catch (error) {
    throw new Error("Something happened in imageFileNormalizer");
  }
}
