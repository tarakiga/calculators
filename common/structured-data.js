function generateCalculatorStructuredData(calculatorData) {
    return {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": calculatorData.name,
        "description": calculatorData.description,
        "url": calculatorData.url,
        "applicationCategory": "CalculatorApplication",
        "operatingSystem": "Any",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        "featureList": calculatorData.features,
        "author": {
            "@type": "Organization",
            "name": "Docket One",
            "url": "https://docket.one"
        },
        "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": calculatorData.breadcrumbs.map((item, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "name": item.name,
                "item": item.url
            }))
        }
    };
}

// Export the function
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { generateCalculatorStructuredData };
} 