<script>
/* Inline dynamic-event-loader for testing – replace with src once GitHub fixed */
(function() {
    const CONFIGS = [  // Inline JSON for testing (replace with fetch later)
      {
        "selector": "nav .nav-links a[href='#book']",
        "event": "CheckOut",
        "domSnippet": "<a href=\"#book\">Book</a>"
      }
    ];

    function loadAndAttachEvents() {
        try {
            const configs = CONFIGS;  // Use inline for test
            
            if (configs.length === 0) {
                console.warn('No configs – nothing to attach.');
                return;
            }
            
            configs.forEach(config => {
                const element = document.querySelector(config.selector);
                if (element) {
                    if (!element.dataset.eventBound) {
                        element.dataset.eventBound = 'true';
                        element.addEventListener('click', (e) => {
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

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadAndAttachEvents);
    } else {
        loadAndAttachEvents();
    }
})();
</script>
