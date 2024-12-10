/** @type {import('next').NextConfig} */

const nextConfig = {
	typescript: {
		// !! WARN !!
		// Dangerously allow production builds to successfully complete even if
		// your project has type errors.
		// !! WARN !!
		ignoreBuildErrors: true,
	},
	eslint: {
		// !! WARN !!
		// Warning: This allows production builds to successfully complete even if
		// your project has ESLint errors
		// !! WARN !!.
		ignoreDuringBuilds: true,
	},

	reactStrictMode: false,

	webpack: (config) => {
		config.externals.push('pino-pretty', 'lokijs', 'encoding')
		return config
	},

	images: {
		remotePatterns: [
			{
				hostname: '*.public.blob.vercel-storage.com',
				hostname: '97tjwcygbwqvo2fa.public.blob.vercel-storage.com',
				hostname: 'brown-broad-whitefish-602.mypinata.cloud',
			},
			{
				protocol: 'https',
				hostname: '*.vercel-storage.com',
			},
			{
				protocol: 'https',
				hostname: 'brown-broad-whitefish-602.mypinata.cloud',
			},
			{
				protocol: 'https',
				hostname: 'ui.shadcn.com',
			},
		],
	},
}

export default nextConfig
