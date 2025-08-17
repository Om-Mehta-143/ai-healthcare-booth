// Audio Alert System for Medical Events
class AudioAlertSystem {
  constructor() {
    this.audioContext = null;
    this.isEnabled = true;
    this.volume = 0.3;
    this.initAudioContext();
  }

  initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (error) {
      console.warn('Audio alerts not supported in this browser');
      this.isEnabled = false;
    }
  }

  // Generate different tones for different alert types
  generateTone(frequency, duration, type = 'sine') {
    if (!this.audioContext || !this.isEnabled) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    oscillator.type = type;

    // Envelope for smooth sound
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(this.volume, this.audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  // Critical alert - urgent beeping
  playCriticalAlert() {
    if (!this.isEnabled) return;
    
    // Triple beep pattern
    this.generateTone(800, 0.2);
    setTimeout(() => this.generateTone(800, 0.2), 300);
    setTimeout(() => this.generateTone(800, 0.2), 600);
  }

  // Warning alert - double beep
  playWarningAlert() {
    if (!this.isEnabled) return;
    
    this.generateTone(600, 0.15);
    setTimeout(() => this.generateTone(600, 0.15), 200);
  }

  // Info alert - single soft beep
  playInfoAlert() {
    if (!this.isEnabled) return;
    
    this.generateTone(400, 0.1, 'triangle');
  }

  // Heart rate alert - rhythmic beeping
  playHeartRateAlert(bpm) {
    if (!this.isEnabled) return;
    
    const interval = 60000 / bpm; // Convert BPM to milliseconds
    this.generateTone(500, 0.05);
    
    // Play a few beats to simulate heart rhythm
    setTimeout(() => this.generateTone(500, 0.05), interval);
    setTimeout(() => this.generateTone(500, 0.05), interval * 2);
  }

  // Success sound - ascending tones
  playSuccessAlert() {
    if (!this.isEnabled) return;
    
    this.generateTone(400, 0.1);
    setTimeout(() => this.generateTone(500, 0.1), 100);
    setTimeout(() => this.generateTone(600, 0.15), 200);
  }

  // Toggle audio alerts
  toggle() {
    this.isEnabled = !this.isEnabled;
    return this.isEnabled;
  }

  // Set volume (0-1)
  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
  }
}

export default new AudioAlertSystem();