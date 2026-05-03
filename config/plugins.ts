import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Plugin => ({
	upload: {
		config: {
			provider: 'strapi-provider-cloudflare-r2-aws',
			providerOptions: {
				credentials: {
					accessKeyId: env('R2_ACCESS_KEY_ID'),
					secretAccessKey: env('R2_ACCESS_SECRET'),
				},
				endpoint: env('R2_ENDPOINT'),
				params: { Bucket: env('R2_BUCKET') },
				cloudflarePublicAccessUrl: env('R2_PUBLIC_ACCESS_URL'),
				pool: true,
			},
			actionOptions: {
				upload: {},
				uploadStream: {},
				delete: {},
			},
		},
	},
});

export default config;
