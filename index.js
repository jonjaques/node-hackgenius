var request = require('request-promise');
var cheerio = require('cheerio');
var _ = require('underscore');

var HOST = 'http://genius.com';
var SEARCH_PARSER = /(.+(?= – )) – (.+(?=\|\/))\|(.+(?=\|))\|(\d+)/i;

function search(str) {
  return buildSearchReq(str).then(parseAutoComplete);
}

function getContent(req) {
  if (typeof req === 'string') {
    return search(req)
      .then(getFirstResult)
      .then(buildSinglePageReq)
      .then(scrapePage)
  } else if (req.id && req.id.toString().length) {
    return buildSinglePageReq(req)
      .then(scrapePage);
  }
}

function parseAutoComplete(data) {
  return _(data.split('\n')).chain()
    .compact()
    .map(function(val) {
      var parsed = SEARCH_PARSER.exec(val.trim());
      if (parsed && parsed.length === 5) {
        return {
          artist: parsed[1],
          title: parsed[2],
          url: HOST + parsed[3],
          id: parseInt(parsed[4])
        };
      }
      return null;
    })
    .compact()
    .value()
}

function buildSearchReq(str) {
  var url = HOST + '/search/quick?&q=' + encodeURIComponent(str);
  return request({
    url: url,
    headers: {
      Referrer: HOST,
      Host: 'genius.com',
      Accept: 'application/x-javascript, text/javascript, text/html, application/xml, text/xml, */*'
    }
  })
}

function buildSinglePageReq(req) {
  if (!req.id && !req.url) return new Error('Can\'t build a request based on req object');
  var url = req.id ? 
    HOST + '/songs/' + req.id :
    HOST + req.url
  return request({
    url: url
  });
}

function scrapePage(data) {
  var $ = cheerio.load(data);
  var text = $('.lyrics_container').text();
  if (text.length) {
    return text.trim();
  }
  return '';
}

function getFirstResult(results) {
  return results && results.length ? results[0] : null
}

module.exports = {
  search: search,
  getContent: getContent
};