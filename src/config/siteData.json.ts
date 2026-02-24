export interface SiteDataProps {
	name: string;
	title: string;
	description: string;
	useViewTransitions?: boolean; // defaults to false. Set to true to enable some Astro 3.0 view transitions
	contactInfo: {
		name: string;
		phone: string;
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
	contactInfo: {
		name: "Conectar Naturaleza",
		phone: "+5493786414965",
	},

	// default image for meta tags if the page doesn't have an image already
	defaultImage: {
		src: "/images/logo-transparent.png",
		alt: "Conectar Naturaleza logo",
	},
};

export default siteData;
