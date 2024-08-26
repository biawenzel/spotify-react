import {useEffect, useState} from "react";
import './App.css';
import axios from "axios";

function App() {
  const CLIENT_ID = "06de108c206f487c866890d755c61186"
  const REDIRECT_URI = "http://localhost:3000"
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
  const RESPONSE_TYPE = "token"

  const [token, setToken] = useState("")
  const [searchKey, setSearchKey] = useState("")
  const [playlists, setPlaylists] = useState([])

  useEffect(() => {
    const hash = window.location.hash
    let token = window.localStorage.getItem("token")

    if(!token && hash) {
      token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]

      window.location.hash = ""
      window.localStorage.setItem("token", token)
    }
    
    setToken(token)
  }, [])

  const logout = () => {
    setToken("")
    window.localStorage.removeItem("token")
  }

  const searchPlaylist = async (e) => {
    e.preventDefault()
    const {data} = await axios.get("https://api.spotify.com/v1/search", {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        q: searchKey,
        type: "playlist"
      }
    })
      
    setPlaylists(data.playlists.items);
  }

  const renderplaylist = () => {
    return playlists.map(playlist => (
      <div class="itens" key={playlist.id}>
        {playlist.images.length ? <img width={"600px"} height={"600px"} src={playlist.images[0].url} alt=""/> : <div>No image to show</div>}
        {playlist.name}
      </div>
    ))
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Spotify React - Search your playlist</h1>
        {!token ? 
        <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}>
          Login to Spotify</a>
        : <button onClick={logout}>Logout</button>}

        {token ?
          <form onSubmit={searchPlaylist}>
            <input type="text" onChange={e => setSearchKey(e.target.value)}/>
            <button type={"submit"}>Search</button>
          </form>

          : <h2>Please, login</h2>
        }

        {renderplaylist()}

      </header>
    </div>
  );
}

export default App;
