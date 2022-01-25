import * as React from 'react'
import { useState } from 'react'
import * as ReactDOM from 'react-dom'
import { TwitchPlayer } from 'react-twitch-embed'

function TwitchStatus() {
  const [onlineClass, setOnlineClass] = useState("")
  const [offlineClass, setOfflineClass] = useState("")

  return (
    <div>
      <div id="twitch-online" className={onlineClass}>
        <h4>Jeff and Dom are <span className='live-label'>LIVE</span>
        </h4>

        <TwitchPlayer
          channel='maingauchelive'
          onOnline={() => {
            setOnlineClass("visible")
            setOfflineClass("")
          }}
          onOffline={() => {
            // BUG:
            // This does not appear to get called when a stream
            // goes from online to offline.
            setOnlineClass("")
            setOfflineClass("visible")
          }}
        />
      </div>

      <div id="twitch-offline" className={offlineClass}>
        <h4>
          Jeff and Dom are <span className='offline-label'>OFFLINE</span>
        </h4>

        <span>Watch our <a href='https://www.twitch.tv/maingauchelive'>Twitch stream</a> on Fridays at 1pm PT/4pm ET.</span>
      </div>
    </div>
  )
}

ReactDOM.render(
  <TwitchStatus />,
  document.getElementById('twitch-embed')
)
