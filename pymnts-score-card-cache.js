const cheerio = require('cheerio');
const axios = require('axios');

const topLevelLinks = [
"https://www.pymnts.com/mobile-order-ahead-rankings/",
"https://www.pymnts.com/personal-finance/",
"https://www.pymnts.com/personal-loans/",
"https://www.pymnts.com/aggregators/",
"https://www.pymnts.com/shopping-apps/",
"https://www.pymnts.com/gig-economy-apps/",
"https://www.pymnts.com/coupon-apps/",
"https://www.pymnts.com/telemedicine-apps/",
"https://www.pymnts.com/prescription-apps/",
"https://www.pymnts.com/credit-card-apps/",
"https://www.pymnts.com/streaming-apps/",
"https://www.pymnts.com/bnpl-ranking/",
"https://www.pymnts.com/digital-banking-apps-ranked/",
"https://www.pymnts.com/insurance-apps/",
"https://www.pymnts.com/fitness-apps/",
"https://www.pymnts.com/travel-apps/",
"https://www.pymnts.com/payroll-apps/",
"https://www.pymnts.com/cryptocurrency-apps/",
"https://www.pymnts.com/cryptocurrency-wallet/"
]

const fetchHtml = async (url) => {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (err) {
        console.error(err);
        return false;
    }
}

const getLinksFromHtml = html => {
    // Load the HTML string into Cheerio
    const $ = cheerio.load(html);

    // Find all anchor tags and extract href attributes
    const links = [];
    $('a').each(function() {
    const link = $(this).attr('href');
    if (link) {
        try {
            const url = new URL(link);
            const loc = link.indexOf('score-card');
            if (loc !== -1) links.push(link);
        } catch (err) {
            //console.log('not a url: ', link)
        }
        
    }
    });
    console.log('links', links);
    return links;
}

const getStaticPages = async (url, curPages) => {
    const pages = [];
    
    let html = await fetchHtml(url);

    pages.push({url, html});

    const links = getLinksFromHtml(html);

    for (let i = 0; i < links.length; ++i) {
        const test = curPages.find(page => page.url === links[i]);
        if (test) {
            console.log('skipping', links[i]);
            continue;
        }
        console.log('fetching', links[i]);
        html = await fetchHtml(links[i]);
        pages.push({url: links[i], html});
    }

    return pages;
   
}

const getAllPages = async () => {
    let pages = [];
    for (let i = 0; i < topLevelLinks.length; ++i) {
        const newPages = await getStaticPages(topLevelLinks[i], pages);
        pages = [...pages, ...newPages]
        console.log('pages length', pages.length);
    }

    
}

getAllPages();