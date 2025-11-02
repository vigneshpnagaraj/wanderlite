// dynamic-event-loader.js
// Dynamically loads event configs from JSON and attaches to DOM
// Add <script src="dynamic-event-loader.js"></script> to your HTML (after amzn.js)

(function() {
    const CONFIG_URL = 'https://raw.githubusercontent.com/vigneshpnagaraj/wanderlite/main/event-configs.json';

    async function loadAndAttachEvents() {
        try {
            const response = await fetch(CONFIG_URL);
            if (!response.ok) throw new Error('Failed to fetch configs');
            
            const configs = await response.json(); // Array of {selector, event, domSnippet}
            
            configs.forEach(config => {
                const element = document.querySelector(config.selector);
                if (element) {
                    // Attach click listener (remove if already bound)
                    if (!element.dataset.eventBound) {
                        element.dataset.eventBound = 'true';
                        element.addEventListener('click', (e) => {
                            // Prevent default if needed (e.g., for links)
                            // e.preventDefault(); // Uncomment if it should not navigate
                            
                            // Track via AAT (from event-tracker.js)
                            if (typeof amzn !== 'undefined' && amzn.trackEvent) {
                                amzn.trackEvent(config.event, {
                                    url: location.href,
                                    timestamp: new Date().toISOString(),
                                    domSnippet: config.domSnippet,
                                    elementId: element.id || 'no-id' // Extra context
                                });
                            } else {
                                console.log(`Tracked (fallback): ${config.event} on ${config.selector}`);
                            }
                        });
                        
                        console.log(`Attached ${config.event} to: ${config.selector}`);
                    }
                } else {
                    console.warn(`No element found for selector: ${config.selector}`);
                }
            });
        } catch (error) {
            console.error('Dynamic event load failed:', error);
        }
    }

    // Load after DOM and amzn.js are ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadAndAttachEvents);
    } else {
        loadAndAttachEvents();
    }
})();
