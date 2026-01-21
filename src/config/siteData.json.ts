export interface SiteDataProps {
	name: string;
	title: string;
	description: string;
	useViewTransitions?: boolean; // defaults to false. Set to true to enable some Astro 3.0 view transitions
	author: {
		name: string;
		email: string;
		twitter: string; // used for twitter cards when sharing a blog post on twitter
	};
	defaultImage: {
		src: string;
		alt: string;
	};
}

// Update this file with your site specific information
const siteData: SiteDataProps = {
	name: "Conectar Naturaleza",
	// Your website's title and description (meta fields)
	title: "Conectar Naturaleza - Web oficial",
	description:
		"Desconéctate de la rutina y sumérgete en la tranquilidad que te mereces, te ofrecemos un contacto excepcional con la naturaleza en un ambiente tranquilo y reservado, con bajada propia a la playa tanto para lanchas como peatones.",
	useViewTransitions: true,
	// Your information!
	author: {
		name: "Cosmic Themes",
		email: "creator@cosmicthemes.com",
		twitter: "Cosmic_Themes",
	},

	// default image for meta tags if the page doesn't have an image already
	defaultImage: {
		src: "/images/logo-transparent.png",
		alt: "Conectar Naturaleza logo",
	},
};

export default siteData;
