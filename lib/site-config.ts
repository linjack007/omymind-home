// Set to the final HTTPS origin when deploying; never guess a production domain.
const configuredOrigin = process.env.NEXT_PUBLIC_SITE_URL;
export const siteOrigin = configuredOrigin ? new URL(configuredOrigin).origin : undefined;
export const siteTitle = "Omymind — Focus, Meditation & Sleep";
export const siteDescription = "Omymind helps you focus, meditate, relax and sleep with calming sounds and mindful experiences.";
