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
		remotePatterns: [{ hostname: '*.public.blob.vercel-storage.com' }],
	},
}

export default nextConfig
