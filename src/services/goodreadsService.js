const axios = require('axios');
const xml2js = require('xml2js');
const debug = require('debug')('app:goodreadsService');

const parser = xml2js.Parser({explicitArray: false});

function goodreadsService() {
    function getBookById(id) {
        return new Promise((resolve, reject) => {
            axios.get(`https://www.goodreads.com/book/show/${id}.xml?key=guAxiXo9l45AaQTobKzA`)
            .then((res) => {
                parser.parseString(res.data, (err, result) => {
                    if(err) {
                        debug(err);
                    } else {
                        debug(result);
                        resolve(result.GoodreadsResponse.book);
                    }
                })
            })
            .catch((err) =>{
                reject(err);
                debug(err);
            })
        });
    }

    function getBookByTitle(title) {
        return new Promise((resolve, reject) => {
            axios.get(`https://www.goodreads.com/search/index.xml?key=guAxiXo9l45AaQTobKzA&q=${title}`)
            .then((res) => {
                parser.parseString(res.data, (err, result) => {
                    if(err) {
                        debug(err);
                    } else {
                        debug(result);
                        resolve(result.GoodreadsResponse.search.results.work);
                    }
                })
            })
            .catch((err) =>{
                reject(err);
                debug(err);
            })
        });
    }

    return {getBookById, getBookByTitle};
}

module.exports = goodreadsService();