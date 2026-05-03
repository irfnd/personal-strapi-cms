import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Middlewares => [
	'strapi::logger',
	'strapi::errors',
	{
		name: 'strapi::security',
		config: {
			contentSecurityPolicy: {
				useDefaults: true,
				directives: {
					'connect-src': ["'self'", 'https:'],
					'script-src': ["'self'", "'sha256-ero8UXAkU1ApFpaoNAFLsJ/4eL6eZLCaTL7dtGYRFNE='", 'https://*.cloudflareinsights.com'],
					'img-src': [
						"'self'",
						'data:',
						'blob:',
						'market-assets.strapi.io',
						'https://*.cloudflareinsights.com',
						env('R2_PUBLIC_ACCESS_URL') ? env('R2_PUBLIC_ACCESS_URL').replace(/^https?:\/\//, '') : '',
					],
					'media-src': [
						"'self'",
						'data:',
						'blob:',
						'market-assets.strapi.io',
						'https://*.cloudflareinsights.com',
						env('R2_PUBLIC_ACCESS_URL') ? env('R2_PUBLIC_ACCESS_URL').replace(/^https?:\/\//, '') : '',
					],
					upgradeInsecureRequests: null,
				},
			},
		},
	},
	'strapi::cors',
	'strapi::poweredBy',
	'strapi::query',
	'strapi::body',
	'strapi::session',
	'strapi::favicon',
	'strapi::public',
];

export default config;
