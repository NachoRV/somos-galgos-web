import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: {
    disableLocalStorage: true,
    adminThumbnail: ({ doc }) => (doc.url as string) || null,
  },
  hooks: {
    afterRead: [
      ({ doc }) => {
        // Replace R2 endpoint URL with custom domain
        if (doc.url && process.env.CLOUDFLARE_R2_PUBLIC_URL) {
          const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
          const bucket = process.env.CLOUDFLARE_R2_BUCKET_NAME;
          
          // Replace the R2 endpoint URL with the custom domain
          doc.url = doc.url.replace(
            `https://${accountId}.r2.cloudflarestorage.com/${bucket}`,
            process.env.CLOUDFLARE_R2_PUBLIC_URL
          );
        }
        return doc;
      },
    ],
  },
}
