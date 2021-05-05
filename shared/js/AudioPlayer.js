// import React, { useEffect, useRef, useState } from "react";
// import "./../../css/main.scss";
import { Component, render, h } from "preact";

import { useEffect, useRef, useState } from 'preact/hooks';

const AudioPlayer = (props) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [subsActive, setSubsActive] = useState(false);
    const [cueText, setCueText] = useState('');
    const [audio, setAudio] = useState(null);
    const [progress, setProgress] = useState(0);
    const progRef = useRef();
    const dasharray = 854;

    const audRef = useRef();
    
    useEffect( () => {
        const aud = audRef.current;
        // const aud = new Video(props.src || '<%= path %>/audio/clip_1_auspost.mp3');
        // console.log(aud);
        if (props.subs) {
            aud.textTracks[0].addEventListener('cuechange', e => {
                const track = aud.textTracks[0];
                if (track.activeCues.length) {
                    // console.log(e.target.activeCues[0].text);
                    // console.log(track.activeCues.join(''));
                    setCueText( Array.from(track.activeCues).map(i=>i.text).join() );
                } else {
                    setCueText('');
                }
            })
        }
        aud.addEventListener('timeupdate', e=>{
            setProgress(Math.round((aud.currentTime/aud.duration) * dasharray));
        })
        aud.addEventListener('ended', e=>{
            setIsPlaying( false );
        })
        setAudio( aud );
    },[]);

    const handlePlayPause = () => {
        if (isPlaying) audio.pause();
        else audio.play();

        setIsPlaying(!isPlaying);
    }
    const handleSubsToggle = () => {
        setSubsActive(!subsActive);
    }
    return (
        <div className="audio-player" >

            <div className="ap-container">
                <h1>
                    <svg className="AudioIcon " viewBox="0 0 300 300"><g><polygon points="143.5,89.7 108.2,125 84,125 77.6,131.3 77.6,167 83.4,172.7 107.9,172.7 143.5,208.3 150.2,208.3 150.2,89.7"></polygon><path d="M210.9,148.8c0,17.8-6.1,34.1-16.2,47.1l3.6,3.6c14.6-12,24-30.3,24-50.7c0-20.4-9.3-38.7-24-50.7l-3.6,3.6 C204.8,114.7,210.9,131.1,210.9,148.8"></path><path d="M177,148.8c0,10.3-3.1,19.8-8.4,27.8l4.2,4.2c8.2-8.2,13.3-19.5,13.3-32c0-12.5-5.1-23.8-13.3-32l-4.2,4.2 C173.9,129,177,138.6,177,148.8"></path></g></svg>
                    {props.title || 'Missing Title!'}
                </h1>

                { props.subs &&
                <button onClick={handleSubsToggle}  className={'btn-subs ' + (subsActive ? 'active' : '')}>
                    <svg viewBox="0 0 67 67">
                    <g id="Play-Button-Copy" transform="translate(0.5 0.5)">
                        <path d="M32.7289 0C14.653 0 0 14.655 0 32.7309C0 50.8017 14.653 65.4578 32.7289 65.4578C50.8048 65.4578 65.4578 50.8017 65.4578 32.7309C65.4578 14.655 50.8048 0 32.7289 0" transform="translate(1.7053026E-13 0.00020307692)" />
                        <path d="M9.68677 22.6938C12.3674 22.6938 14.1342 22.2065 15.5658 21.4449L15.5658 17.5154L15.1771 17.6894C14.1041 18.1547 12.7262 18.612 10.7225 18.612C6.66784 18.612 5.29769 16.6278 5.24122 12.5167L5.23938 9.80862C5.23938 5.48308 7.24985 4.08185 10.7834 4.08185C12.672 4.08185 13.9514 4.44738 15.3831 4.96523L15.3831 1.03569C14.1646 0.365538 12.4892 0 10.0523 0C4.44738 0 0 2.61969 0 10.296L0 12.4588C0 19.5868 3.68585 22.6938 9.68677 22.6938ZM27.0295 22.6938C21.0286 22.6938 17.3428 19.5868 17.3428 12.4588L17.3428 10.296C17.3428 2.61969 21.7902 0 27.3951 0C29.832 0 31.5074 0.365538 32.7258 1.03569L32.7258 4.96523C31.2942 4.44738 30.0148 4.08185 28.1262 4.08185C24.5926 4.08185 22.5822 5.48308 22.5822 9.80862L22.5822 12.2455C22.5822 16.5406 23.9225 18.612 28.0652 18.612C30.3194 18.612 31.7815 18.0332 32.9086 17.5154L32.9086 21.4449C31.4769 22.2065 29.7102 22.6938 27.0295 22.6938Z" transform="translate(15.403486 21.333231)" fill="#FFFFFF" stroke="none" />
                    </g>
                    </svg>
                
                </button>
                }

                <button onClick={handlePlayPause} className={'btn-play ' + (isPlaying ? 'active' : '')}>
                    <div className="controls">
                        <svg viewBox="0 0 300 300"><g><path className="st0" d="M150.2,5C70.2,5,5.2,69.9,5.2,150c0,80.1,64.9,145,145,145c80.1,0,145-64.9,145-145 C295.2,69.9,230.3,5,150.2,5"></path>
                        <circle ref={progRef} className="progress" cx="150" cy="150" r="136" stroke="white" strokeWidth="26" strokeOpacity="0.6" strokeDasharray={dasharray} strokeDashoffset={ dasharray - progress} />
                        {isPlaying && 
                        <g>
                        <polygon className="st1" points="136.3,195.1 110,195.1 110,109.5 116.6,102.9 136.3,102.9 "></polygon>
                        <polygon className="st1" points="189.1,188.6 182.5,195.2 162.7,195.2 162.7,102.9 189.1,102.9 "></polygon>
                        </g>
                        }
                        {!isPlaying && <polygon className="st1" points="217.2,147.7 114.3,105.4 110.7,108.1 110.7,192 114.3,194.7 217.2,152.3 	"></polygon>}
                        </g></svg>
                    </div>
                </button>

            </div>
                <video src={props.src} ref={audRef} playsInline width="100%" height="80">
                    { props.subs && <track src={props.subs} kind="subtitles" srcLang="en" label="English" default /> }
                </video>
                { props.subs && subsActive &&
            <div className='subs'>
                {cueText}&nbsp;
            </div>
                }
        </div>
    )
}

export default AudioPlayer;