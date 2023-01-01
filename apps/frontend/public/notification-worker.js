const log = (message) => {
	console.info(`[WORKER] ${message}`);
};

self.addEventListener("push", (event) => {
	log("Push received", event);

	const { title, body } = event.data.json();

	if (!title || !body) {
		log("Push data is invalid");
		return;
	}

	event.waitUntil(
		self.registration.showNotification(title, {
			body,
		})
	);
});

self.addEventListener("install", (event) => {
	log("Service worker installed");

	self.skipWaiting();
});

self.addEventListener("activate", (event) => {
	log("Service worker activated");

	self.clients.claim();
});
