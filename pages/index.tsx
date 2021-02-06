import { usePresence } from '@roomservice/react'
import { useEffect, useState } from 'react'
import Opponent from '../components/games/opponent'

export type Directions = {
  ArrowUp: boolean
  ArrowDown: boolean
  ArrowRight: boolean
  ArrowLeft: boolean
}

type Player = {
  x: string
  y: string
  name: string
}

export default function Home() {
  const [players, setMyPlayer] = usePresence<Player>("demo", "players");

  const directions: Directions = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowRight: false,
    ArrowLeft: false
  }

  const boxWidth = 3;

  const [left, setLeft] = useState<number>(0)
  const [top, setTop] = useState<number>(0)
  const [name, setName] = useState<string>('anon')
  const [gameSpeed, setGameSpeed] = useState<number>(20)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.body.addEventListener('keydown', function (e) {
        directions[e.key] = true;
      });

      document.body.addEventListener('keyup', function (e) {
        directions[e.key] = false;
      });

      const box = document.getElementById('box');
      const pane = document.getElementById('pane');
      const maxWidth = pane.offsetWidth - box.offsetWidth

      const newValue = (value: number, lowerArrowKeyName: string, upperArrowKeyName: string): number => {
        var n = value - (directions[lowerArrowKeyName] ? boxWidth : 0) + (directions[upperArrowKeyName] ? boxWidth : 0);
        return n < 0 ? 0 : n > maxWidth ? maxWidth : n;
      }

      const interval = setInterval(() => {
        setLeft((left) => newValue(left, 'ArrowLeft', 'ArrowRight'))
        setTop((top) => newValue(top, 'ArrowUp', 'ArrowDown'))
      }, gameSpeed);
      return () => clearInterval(interval);
    }
  }, [gameSpeed])

  useEffect(() => {
    if (!players) return

    setMyPlayer.set({
      x: left.toString(),
      y: top.toString(),
      name: name
    })
  }, [left, top, name])

  return (
    <div className='wrapper'>
      <p>
        Use the arrow keys to move
      </p>
      <label>
        UserName: &nbsp;
        <input onChange={(e) => setName(e.target.value)} />
      </label>
      <br />
      <div id="pane">
        <div id="box" className="player" style={{ left, top }} title="you" ></div>
        {
          Object.entries(players)
            .filter(([_, val]) => val.name !== name)
            .map(([key, val]) => <Opponent key={key} {...val} />)
        }
      </div>
      <div className="controls">
        <h3>{gameSpeed}</h3>
        <label>
          Set game speed: &nbsp;
          <input
            className="gameSpeedInput"
            type="number"
            min="1"
            max="50"
            onBlur={(e) => setGameSpeed(e.target.valueAsNumber)} />
        </label>
      </div>
    </div>
  )
}
