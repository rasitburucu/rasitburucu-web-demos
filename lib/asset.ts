// Public-folder URLs are not rewritten by Next's basePath; prefix them here.
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const asset = (path: string) => `${BASE}${path}`;
