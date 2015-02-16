# Hack Genius
A very simple API for searching and retrieving content from Genius.com.
No support for annotations yet. Whats the point? Peer reviewed lyrics.

Returns [Bluebird](https://github.com/petkaantonov/bluebird) promises.

## API

**search(req: string): Promise&lt;GeniusSearchResult[]&gt;**

```
genius.search('adoration of the magi')
  .then(console.log)

// =>

[ { artist: 'Lupe Fiasco (Ft. Crystal Torres)',
    title: 'Adoration Of The Magi',
    url: 'http://genius.com/Lupe-fiasco-adoration-of-the-magi-lyrics',
    id: 663358 },
  { artist: 'Rap Genius',
    title: 'Top 10 Lines from Tetsuo & Youth',
    url: 'http://genius.com/Rap-genius-top-10-lines-from-tetsuo-and-youth-lyrics',
    id: 690434 },
  { artist: 'Lupe Fiasco',
    title: 'Tetsuo & Youth Tracklist and Album Cover',
    url: 'http://genius.com/Lupe-fiasco-tetsuo-and-youth-tracklist-and-album-cover-annotated',
    id: 601621 }, ... ]
```

**getContent(req: string|GeniusSearchResult): Promise&lt;string&gt;**

```
genius.getContent('adoration of the magi') // gets first result
  .then(console.log) // =>

... lupe ...

```

```
genius.search('sing about me')
  .then(function(results) {
    return genius.getContent(results[0]);
  })
  .then(function(result) {
    console.log(result) // ... kendrick ...
  })
```