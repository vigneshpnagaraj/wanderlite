// dynamic-event-loader.js
// Dynamically loads event configs from JSON and attaches to DOM
// Add <script src="dynamic-event-loader.js"></script> to your HTML (after amzn.js)

(function() {
    const CONFIG_URL = 'https://raw.githubusercontent.com/vigneshpnagaraj/wanderlite/main/event-configs.json';

    async function loadAndAttachEvents() {
        try {
            const response = await fetch(CONFIG_URL, { cache: 'no-store' }); // No cache for fresh fetches
            if (!response.ok) throw new Error(`Fetch failed: ${response.status}`);
            
            const configs = await response.json(); // Array of {selector, event, domSnippet}
            
            if (configs.length === 0) {
                console.warn('No configs found in event-configs.json – nothing to attach.');
                return;
            }
            
            configs.forEach(config => {
                const element = document.querySelector(config.selector);
                if (element) {
                    if (!element.dataset.eventBound) {
                        element.dataset.eventBound = 'true';
                        element.addEventListener('click', (e) => {
                            // e.preventDefault(); // Uncomment if you want to block the link's default (scroll)
                            
                            if (typeof amzn !== 'undefined' && amzn.trackEvent) {
                                amzn.trackEvent(config.event, {
                                    url: location.href,
                                    timestamp: new Date().toISOString(),
                                    domSnippet: config.domSnippet,
                                    elementId: element.id || 'no-id'
                                });
                                console.log(`Amazon tag fired: ${config.event} on ${config.selector}`);
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

    // Load after DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadAndAttachEvents);
    } else {
        loadAndAttachEvents();
    }
})();
