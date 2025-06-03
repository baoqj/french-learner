# French Learner

This repository contains an MVP for a cross-platform French learning application built with React Native. The goal is to help Chinese and English speakers learn French through everyday dialogues and gradually expanding grammar and cultural notes.

## Getting Started

1. **Install dependencies** (requires `node` and `npm`):
   ```bash
   npm install
   ```
2. **Run on mobile/web**
   ```bash
   npm run start      # start Metro bundler
   npm run android    # or ios / web
   ```

## Project Structure

- `src/App.tsx` – entry React component displaying sample scenes and stages.
- `src/data/scenes.json` – minimal example corpus with dialogues and vocabulary.
- `src/screens/Dictionary.tsx` – simple vocabulary lookup screen.
- `src/services/ai.ts` – placeholder for future LLM integration.

The dataset and components are intentionally simple at this stage. Future work will expand the corpus and connect to an LLM for dynamic content generation.
