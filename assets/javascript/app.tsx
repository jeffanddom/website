import React, { useEffect, useState } from 'react'
import { render } from 'react-dom';
import PlaylistSummary from 'youtube-playlist-summary'

// Insecure - replace with better key solution later; can only access non-private 
// Youtube APIs but someone could abuse our rate limit if they wanted
const GOOGLE_API_KEY = 'AIzaSyAl5adrV1ofcfO_PjaawFgG4iujfYv4UBU'
const PLAYLIST_ID = 'PL2v4JaPz_wp9qYGsG1IWoOFnz1VY45Fg7'

const ps = new PlaylistSummary({
  GOOGLE_API_KEY,
  PLAYLIST_ITEM_KEY: ['publishedAt', 'title', 'description', 'videoUrl', 'thumbnails'],
})

const Playlist = () => {
  const [pastBroadcasts, setPastBroadcasts] = useState([])
  useEffect(() => {
    ps.getPlaylistItems(PLAYLIST_ID).then(channelData => setPastBroadcasts(channelData.items.splice(0, 6)))
  }, [])

  console.log(pastBroadcasts)

  return <>
    <h1>Past Broadcasts</h1>

    <div className="past-broadcasts">
      {pastBroadcasts.map(b => <div className="broadcast" key={b.videoId}>
        <a href={b.videoUrl} target="_blank">
          <div className="thumbnail" style={{backgroundImage: `url(${(b.thumbnails.maxres || b.thumbnails.high).url})`}} />
          <p>{b.title}</p>
        </a>
      </div>)}
    </div>

    <a href="https://www.youtube.com/channel/UCPMLP_iuTLQWxCVYFNt40WA" target="_blank">View more on YouTube -></a>
  </>
}

render(<Playlist />, document.getElementById('playlist'));
