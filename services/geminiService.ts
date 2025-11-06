import { GoogleGenAI, Modality } from "@google/genai";

export const generatePlayerDetails = async (
  playerName: string,
  country: string
): Promise<{ imageUrl: string; bio: string }> => {
  // Use sessionStorage for a more persistent cache within a single browser session
  const cacheKey = `player_${playerName.replace(/\s+/g, '_')}`;
  try {
    const cachedData = sessionStorage.getItem(cacheKey);
    if (cachedData) {
      return JSON.parse(cachedData);
    }
  } catch (error) {
    console.error("Could not read from session storage", error);
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Generate Image
  const imagePromise = ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          text: `Generate a realistic, high-quality, portrait-style color photograph of the famous cricketer ${playerName} from ${country} in his prime, wearing his national team's jersey from his era. The image should be chest-up, with a neutral, slightly blurred background suitable for a sports trading card.`,
        },
      ],
    },
    config: {
      responseModalities: [Modality.IMAGE],
    },
  });

  // Generate Bio
  const bioPromise = ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `Write a short, engaging, one-paragraph biography (around 50-60 words) for the cricketer ${playerName} from ${country}, highlighting their primary role (e.g., batsman, bowler, all-rounder) and their most significant career achievements in ODI cricket.`,
  });
  
  try {
    const [imageResponse, bioResponse] = await Promise.all([imagePromise, bioPromise]);

    let imageUrl = '';
    for (const part of imageResponse.candidates[0].content.parts) {
      if (part.inlineData) {
        const base64ImageBytes: string = part.inlineData.data;
        imageUrl = `data:image/png;base64,${base64ImageBytes}`;
      }
    }

    const bio = bioResponse.text.trim();

    if (!imageUrl || !bio) {
        throw new Error("Failed to generate complete player details.");
    }

    const details = { imageUrl, bio };
    
    // Store in sessionStorage
    try {
        sessionStorage.setItem(cacheKey, JSON.stringify(details));
    } catch (error) {
        console.error("Could not write to session storage", error);
    }

    return details;
  } catch(error) {
    console.error(`Failed to generate details for ${playerName}`, error);
    // Return a default/error state if generation fails
    return {
        imageUrl: '', // You could have a default placeholder image URL here
        bio: 'Could not load biography.'
    };
  }
};