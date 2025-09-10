import React, { useEffect, useRef, useState } from 'react';
import { Room, RoomEvent, createLocalTracks } from 'livekit-client';
import Cookies from 'universal-cookie';
import './videoRoom.css';

const cookies = new Cookies();

export default function VideoRoom({ roomName, onClose }) {
  const [room, setRoom] = useState(null);
  const [connecting, setConnecting] = useState(false);
  const [participants, setParticipants] = useState([]); // list of RemoteParticipants
  const localVideoRef = useRef(null);

  // helper to attach a track to element
  const attachTrack = (track, element) => {
    if (!track || !element) return;
    // livekit track has attach() that returns a media element
    const mediaEl = track.attach();
    mediaEl.style.maxWidth = '100%';
    mediaEl.style.maxHeight = '100%';
    element.appendChild(mediaEl);
  };

  // detach / cleanup
  const detachAll = (el) => {
    if (!el) return;
    while (el.firstChild) el.removeChild(el.firstChild);
  };

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      try {
        setConnecting(true);
        const username =
          cookies.get('username') || cookies.get('fullName') || 'guest';
          // Call token endpoint from your Next.js server - adapt path if different
        const tokenResp = await fetch(
          `/api/livekit?room=${encodeURIComponent(
            roomName
          )}&username=${encodeURIComponent(username)}`
        );
        if (!tokenResp.ok) {
          console.error('Token fetch failed');
          setConnecting(false);
          return;
        }
        const { token } = await tokenResp.json();
        // read LiveKit WS url from env var if you exposed it to client, otherwise use the NEXT_PUBLIC one server provides
        const wsUrl =
          process.env.REACT_APP_LIVEKIT_URL ||
          process.env.NEXT_PUBLIC_LIVEKIT_URL;

        // connect to LiveKit
        const lkRoom = new Room({ autoSubscribe: true });
        await lkRoom.connect(wsUrl, token);
        if (!mounted) return;
        setRoom(lkRoom);

        // event: existing participants
        const updateParticipantsList = () => {
          setParticipants(Array.from(lkRoom.participants.values()));
        };
        updateParticipantsList();

        lkRoom.on(RoomEvent.ParticipantConnected, updateParticipantsList);
        lkRoom.on(RoomEvent.ParticipantDisconnected, updateParticipantsList);
        lkRoom.on(RoomEvent.TrackSubscribed, () => updateParticipantsList());

        const localTracks = await createLocalTracks({
          audio: true,
          video: { width: 640, height: 480 },
        });
        const localVideoTrack = localTracks.find((t) => t.kind === 'video');
        if (localVideoRef.current && localVideoTrack) {
          detachAll(localVideoRef.current);
          localVideoRef.current.appendChild(localVideoTrack.attach());
        }
        for (const t of localTracks) {
          await lkRoom.localParticipant.publishTrack(t);
        }

        setConnecting(false);
      } catch (err) {
        console.error('LiveKit init error', err);
        setConnecting(false);
      }
    };
    init();
    return () => {
      mounted = false;
      if (room) room.disconnect();
    };
  }, [roomName, room]);

  const leave = async () => {
    if (room) await room.disconnect();
    setRoom(null);
    onClose && onClose();
  };

  return (
    <div className="video-room__overlay">
      <div className="video-room__container">
        <div className="video-room__header">
          <h3># {roomName} — Video Room</h3>
          <button className="btn" onClick={leave}>
            Leave
          </button>
        </div>
        <div className="video-room__body">
          <div className="video-room__local" ref={localVideoRef}>
            {connecting && <p>Starting camera...</p>}
          </div>
          <div className="video-room__remotes">
            {participants.map((p) => (
              <div key={p.sid} className="video-room__participant">
                <div
                  id={`participant-${p.sid}`}
                  className="video-room__participant-video"
                />
                <div className="video-room__participant-name">
                  {p.identity || p.sid}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
