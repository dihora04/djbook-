
export interface MapPlace {
  uri: string;
  title: string;
  placeAnswerSources?: {
    reviewSnippets?: {
      text: string;
      author: string;
    }[];
  }[];
}

export interface GroundingChunk {
  maps: MapPlace;
}

export interface GeminiResponse {
  text: string;
  groundingChunks: GroundingChunk[];
}
