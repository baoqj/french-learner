// Utility functions for text-to-speech
export const initializeSpeech = () => {
  if ("speechSynthesis" in window) {
    // Load voices
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices()
      console.log("Available voices:", voices.length)
    }

    // Voices might not be loaded immediately
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.addEventListener("voiceschanged", loadVoices)
    } else {
      loadVoices()
    }
  }
}

export const speakFrench = (
  text: string,
  rate = 0.75,
  onWordSpoken?: (word: string, index: number) => void,
  onEnd?: () => void,
) => {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = "fr-FR"
    utterance.rate = rate
    utterance.pitch = 1

    const voices = window.speechSynthesis.getVoices()
    const frenchVoice = voices.find(
      (voice) => voice.lang.startsWith("fr") || voice.name.toLowerCase().includes("french"),
    )

    if (frenchVoice) {
      utterance.voice = frenchVoice
    }

    // Handle word boundary events for follow-along highlighting
    if (onWordSpoken) {
      utterance.onboundary = (event) => {
        if (event.name === "word") {
          const wordPosition = event.charIndex
          const wordLength = event.charLength || 0
          const word = text.substring(wordPosition, wordPosition + wordLength)
          onWordSpoken(word, wordPosition)
        }
      }
    }

    // Handle end event
    if (onEnd) {
      utterance.onend = onEnd
    }

    window.speechSynthesis.speak(utterance)
    return true
  }
  return false
}

export const getAvailableVoices = () => {
  if ("speechSynthesis" in window) {
    return window.speechSynthesis.getVoices()
  }
  return []
}

// Split text into words for highlighting
export const splitTextIntoWords = (text: string) => {
  return text.split(/(\s+|[.,!?;:])/).filter((word) => word.trim() !== "")
}
