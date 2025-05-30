class SoundHelper {
  /**
   * Creates an Audio object with specified volume and optional looping.
   * Calls a registration function if provided.
   *
   * @param {string} src - The source URL of the audio file.
   * @param {number} [volume=1] - The volume level of the audio (0.0 to 1.0).
   * @param {boolean} [loop=false] - Whether the audio should loop.
   * @param {Function|null} [registerFn=null] - Optional callback function to register the audio.
   * @returns {HTMLAudioElement} The created Audio object.
   */
  static createAudio(src, volume = 1, loop = false, registerFn = null) {
    const audio = new Audio(src);
    audio.volume = volume;
    audio.loop = loop;

    if (typeof registerFn === "function") {
      registerFn(audio);
    }

    return audio;
  }

  /**
   * Initializes multiple audio objects from a map and stores them in an object.
   *
   * @param {Object<string, [string, number]>} audios - Map of sound keys to arrays containing source URL and volume, e.g. { soundName: [src, volume] }.
   * @param {boolean} [isMuted=false] - Whether the audio objects should be muted.
   * @param {Function|null} [registerFn=null] - Optional function to register each created audio.
   * @returns {Object<string, HTMLAudioElement>} An object mapping sound keys to created Audio objects.
   */
  static initSounds(audios, isMuted = false, registerFn = null) {
    const sounds = {};

    if (isMuted || !audios) return sounds;

    for (let key in audios) {
      const [src, volume] = audios[key];
      const audio = this.createAudio(src, volume, false, registerFn);
      audio.muted = isMuted;
      sounds[key] = audio;
    }

    return sounds;
  }

  /**
   * Adds an audio object to a sound list array if not already present.
   *
   * @param {HTMLAudioElement} audio - The audio object to add.
   * @param {Array<HTMLAudioElement>} allSoundsArray - The array of audio objects.
   */
  static registerSound(audio, allSoundsArray) {
    if (!allSoundsArray) return;
    if (!allSoundsArray.includes(audio)) {
      allSoundsArray.push(audio);
    }
  }
}


