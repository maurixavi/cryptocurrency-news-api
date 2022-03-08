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
        url_base: 'https://www.coindesk.com'
    },
    {
        name: 'cointelegraph',
        address: 'https://cointelegraph.com',
        url_base: 'https://cointelegraph.com'
    },
    {
        name: 'yahoo-finance',
        address: 'https://finance.yahoo.com/topic/crypto',
        url_base: 'https://finance.yahoo.com'
    },
    {
        name: 'crypto-news',
        address: 'https://cryptonews.com',
        url_base: 'https://cryptonews.com'
        
    },
    {
        name: 'fortune',
        address: 'https://fortune.com/advanced-search/?query=crypto',
        url_base: 'https://fortune.com/advanced-search/?query=crypto'
        
    },
    {
        name: 'bloomberg',
        address: 'https://www.bloomberg.com/crypto',
        url_base: 'https://www.bloomberg.com'
        
    }
]

const articles = []


sites.forEach(site => {
    axios.get(site.address)
        .then((response) => {
            const html = response.data
            
            const $ = cheerio.load(html)

            //coindesk
            $('.headline', html).each(function() {
                const title = $(this).text()
                const url = $(this).attr('href')

                articles.push({
                    title,
                    url: site.url_base + url,
                    source: site.name
                })
            })

            //cointelegraph
            $('.post-card__title-link', html).each(function() {
                const title = $(this).text()
                const url = $(this).attr('href')

                articles.push({
                    title,
                    url: site.url_base + url,
                    source: site.name
                })
            })

            //yahoo finance
            $('.js-content-viewer', html).each(function() {
                const title = $(this).text()
                const url = $(this).attr('href')
                //console.log($(this).attr('href'));
                console.log(site.url_base + url);
                articles.push({
                    title,
                    url: site.url_base + url,
                    source: site.name
                })
            })

            //crypto news
            $('.article__title article__title--lg article__title--featured  mb-20', html).each(function() {
                const title = $(this).text()
                const url = $(this).attr('href')

                articles.push({
                    title,
                    url: site.url_base + url,
                    source: site.name
                })
            })

            //crypto news
            $('.story-package-module__story__headline-link', html).each(function() {
                
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

