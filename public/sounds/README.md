# Cherry MX Blue Sound Files

This directory contains the audio files for the mechanical keyboard button sounds.

## Required Files:

### `SpacePress.mp3`
- **Description**: Sound played when a key is pressed down (key-down event)
- **Timing**: Should be the initial "click" when the key is depressed
- **Duration**: Recommend 50-200ms
- **Format**: Any web-compatible audio format (wav, mp3, ogg, etc.)

### `SpaceRelease.mp3` 
- **Description**: Sound played when a key is released (key-up event)
- **Timing**: Should be the softer "clack" when the key returns to rest position
- **Duration**: Recommend 50-200ms  
- **Format**: Any web-compatible audio format (wav, mp3, ogg, etc.)

## Usage:
- **Mouse clicks**: Both press and release sounds play in quick succession (50ms apart)
- **Keyboard presses**: Press sound on keydown, release sound on keyup
- **Volume**: Set to 30% by default, adjust in code if needed
- **Fallback**: If files are missing, the console will log a message and no sound will play

## Recording Tips:
- Record actual Cherry MX Blue switches for authenticity
- Use high-quality recording equipment
- Keep background noise minimal
- Normalize audio levels
- Consider slight compression to ensure consistent volume 