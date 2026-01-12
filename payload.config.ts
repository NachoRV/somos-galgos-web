import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import path from "path";
import { buildConfig } from "payload";
import { fileURLToPath } from "url";
import sharp from "sharp";
import { s3Storage } from '@payloadcms/storage-s3';

import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Dogs } from "./collections/Dogs";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Dogs],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URL || "",
  }),
  sharp,
  plugins: [
    s3Storage({
      collections: {
        media: {
          // Disable Payload's access control to serve files directly from R2
          disablePayloadAccessControl: true,
          // Optional: add a prefix for organization
          // prefix: 'media',
        },
      },
      bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME!,
      config: {
        credentials: {
          accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
          secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
        },
        region: 'auto', // Cloudflare R2 uses 'auto' as region
        endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
        forcePathStyle: true, // Required for R2
      },
    }),
  ],
});
