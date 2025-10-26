
import { GoogleGenAI } from "@google/genai";
import type { GroundingChunk } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const findDjsWithGoogleMaps = async (
  prompt: string,
  location: GeolocationCoordinates
) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are DJBook.in, an expert AI assistant helping a user find the perfect DJ. The user is looking for: "${prompt}". Based on their current location, find and recommend nearby DJs, clubs, or venues that host DJs using Google Maps data. Provide a friendly, engaging summary and highlight the best options. Be enthusiastic and use a modern, Gen-Z tone.`,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: location.latitude,
              longitude: location.longitude,
            },
          },
        },
      },
    });

    const text = response.text;
    const rawChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const groundingChunks = rawChunks.filter(chunk => 'maps' in chunk) as GroundingChunk[];

    return { text, groundingChunks };
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        return { error: `Failed to fetch from Gemini: ${error.message}` };
    }
    return { error: 'An unknown error occurred while fetching DJ data.' };
  }
};
