const PORT = process.env.PORT || 8080
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const { response } = require('express');

const app = express()

app.get('/',  (req, res) => {
    res.send('Cryptocurrency News API')
})

const sites = [
    {
        name: 'coindesk',
        address: 'https://www.coindesk.com',
        url_base: 'https://www.coindesk.com',
        headline_prop: '.headline'
    },
    {
        name: 'cointelegraph',
        address: 'https://cointelegraph.com',
        url_base: 'https://cointelegraph.com',
        headline_prop: '.post-card__title-link'
    },
    {
        name: 'yahoo-finance',
        address: 'https://finance.yahoo.com/topic/crypto',
        url_base: 'https://finance.yahoo.com',
        headline_prop: '.js-content-viewer'
    },
    {
        name: 'crypto-news',
        address: 'https://cryptonews.com',
        url_base: 'https://cryptonews.com',
        headline_prop: '.story-package-module__story__headline-link'
    },
    {
        name: 'fortune',
        address: 'https://fortune.com/advanced-search/?query=crypto',
        url_base: 'https://fortune.com/advanced-search/?query=crypto',
        headline_prop: '.queryly_item_title'
    },
    {
        name: 'bloomberg',
        address: 'https://www.bloomberg.com/crypto',
        url_base: 'https://www.bloomberg.com',
        headline_prop: '.story-package-module__story__headline-link'
    }
]

const articles = []


sites.forEach(site => {
    axios.get(site.address)
        .then((response) => {
            const html = response.data
            
            const $ = cheerio.load(html)

            $(site.headline_prop, html).each(function() {
                const title = $(this).text()
                const url = $(this).attr('href')

                articles.push({
                    title,
                    url: site.url_base + url,
                    source: site.name
                })
            })

            
        }).catch((err) => console.log(err))

})

app.get('/news', (req, res) => {
    res.json(articles)
})


app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`))

