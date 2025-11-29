import { GoogleGenAI, Type, Modality } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- Chat & Thinking Mode ---
export const getThinkingCareerAdvice = async (
  prompt: string, 
  stage: string
): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `User Stage: ${stage}. Question: ${prompt}. Provide a detailed, structured career roadmap.`,
      config: {
        thinkingConfig: { thinkingBudget: 32768 }, // Max thinking for deep reasoning
      },
    });
    return response.text || "I couldn't generate a roadmap right now.";
  } catch (error) {
    console.error("Thinking API Error:", error);
    return "Sorry, I encountered an error while thinking through your request.";
  }
};

export const getQuickChatResponse = async (
  history: { role: string; parts: { text: string }[] }[],
  message: string
) => {
  try {
    const chat = ai.chats.create({
      model: "gemini-2.5-flash-lite", // Fast responses as requested
      history: history,
      config: {
        systemInstruction: "You are WiseBot, a helpful, encouraging career mentor on StepWise. Keep responses concise and motivating.",
      }
    });
    const result = await chat.sendMessage({ message });
    return result.text;
  } catch (error) {
    console.error("Chat Error:", error);
    throw error;
  }
};

// --- CompareWise (Text Comparison) ---
export const compareCareers = async (topicA: string, topicB: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Compare these two career/education paths in detail: ${topicA} vs ${topicB}. Structure with Pros, Cons, Salary Outlook, and Skills Required.`,
    });
    return response.text;
  } catch (error) {
    console.error("Comparison Error:", error);
    throw error;
  }
};

// --- Search & Maps Grounding ---
export const exploreCareersWithSearch = async (query: string, location?: {lat: number, lng: number}) => {
  try {
    const tools: any[] = [{ googleSearch: {} }];
    if (location) {
      tools.push({ googleMaps: {} });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Find up-to-date info about: ${query}. If asking for places/universities, list them.`,
      config: {
        tools: tools,
        toolConfig: location ? {
           retrievalConfig: {
             latLng: {
               latitude: location.lat,
               longitude: location.lng
             }
           }
        } : undefined
      }
    });
    
    return {
      text: response.text,
      groundingChunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks
    };
  } catch (error) {
    console.error("Search Error:", error);
    throw error;
  }
};

// --- Image Generation & Editing (Visualizer) ---
export const generateCareerImage = async (prompt: string, aspectRatio: string = "16:9", size: string = "1K") => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio,
          imageSize: size as any // Cast for valid 1K, 2K, 4K strings
        }
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image generated");
  } catch (error) {
    console.error("Image Gen Error:", error);
    throw error;
  }
};

export const editCareerImage = async (imageBase64: string, prompt: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image', // Nano Banana for editing
      contents: {
        parts: [
           { inlineData: { mimeType: 'image/png', data: imageBase64 } },
           { text: prompt }
        ],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No edited image generated");
  } catch (error) {
    console.error("Image Edit Error:", error);
    throw error;
  }
};

// --- Video Generation (Veo) ---
export const generateVeoVideo = async (imageBase64: string, prompt: string, aspectRatio: string = '16:9') => {
  try {
    // Ensure aspectRatio is supported by Veo (16:9 or 9:16)
    const validRatio = aspectRatio === '9:16' ? '9:16' : '16:9';
    
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      image: {
        imageBytes: imageBase64,
        mimeType: 'image/png', 
      },
      prompt: prompt,
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: validRatio
      }
    });

    // Polling
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      operation = await ai.operations.getVideosOperation({operation: operation});
    }

    const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!videoUri) throw new Error("Video generation failed");
    
    // Fetch actual bytes
    const res = await fetch(`${videoUri}&key=${process.env.API_KEY}`);
    const blob = await res.blob();
    return URL.createObjectURL(blob);

  } catch (error) {
    console.error("Veo Error:", error);
    throw error;
  }
};

// --- Vision Analysis (Multimodal) ---
export const analyzeInterviewFrame = async (imageBase64: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview", // Upgraded to Pro for analysis
      contents: {
        parts: [
          { inlineData: { mimeType: "image/jpeg", data: imageBase64 } },
          { text: "Analyze this webcam frame for an interview setting. Give 3 short bullet points on posture, lighting, and expression confidence. Be constructive." }
        ]
      }
    });
    return response.text;
  } catch (error) {
    console.error("Vision Error:", error);
    throw error;
  }
};

// --- Audio Transcription ---
export const transcribeAudio = async (audioBase64: string) => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: {
                parts: [
                    { inlineData: { mimeType: "audio/wav", data: audioBase64 } },
                    { text: "Transcribe this interview answer accurately." }
                ]
            }
        });
        return response.text;
    } catch (error) {
        console.error("Transcription Error", error);
        throw error;
    }
}

// --- Text-to-Speech ---
export const generateSpeech = async (text: string) => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: { parts: [{ text }] },
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
                }
            }
        });
        
        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (!base64Audio) throw new Error("No audio generated");
        return base64Audio;
    } catch (error) {
        console.error("TTS Error", error);
        throw error;
    }
}

// --- Live API Connect ---
export const connectToLiveAPI = (callbacks: any) => {
    return ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks,
        config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
                voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
            },
            systemInstruction: 'You are a friendly, encouraging career counselor on a voice call.',
        },
    });
}

// --- Interview Prep Features ---

export const getInterviewQuestion = async (topic: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate a challenging but realistic interview question for a candidate applying for a role related to: ${topic}. Keep it concise (under 20 words).`,
    });
    return response.text.trim();
  } catch (e) {
    return "Tell me about a time you overcame a significant challenge.";
  }
}

export const getInterviewFollowUp = async (previousQuestion: string, answer: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Previous Question: "${previousQuestion}". User Answer: "${answer}". 
      Generate a short, relevant follow-up question to dig deeper into their answer.`,
    });
    return response.text.trim();
  } catch (e) {
    return "Can you elaborate more on that?";
  }
}

export const analyzeInterviewPerformance = async (transcription: string, imageBase64: string | null) => {
    const parts: any[] = [{ text: `You are an expert interview coach. Analyze this interview answer based on the transcription: "${transcription}".
    If an image is provided, analyze the non-verbal cues (posture, eye contact, expression) from it.
    
    Provide a JSON response with the following structure:
    {
      "verbal": { "score": number (0-100), "advice": ["point 1", "point 2"] },
      "nonVerbal": { "score": number (0-100), "advice": ["point 1", "point 2"] },
      "content": { "score": number (0-100), "advice": ["point 1", "point 2"] },
      "confidence": { "score": number (0-100), "advice": ["point 1", "point 2"] },
      "strengths": ["strength 1", "strength 2"],
      "weaknesses": ["weakness 1", "weakness 2"],
      "pros": ["pro 1", "pro 2"],
      "cons": ["con 1", "con 2"],
      "overallSummary": "string"
    }
    ` }];

    if (imageBase64) {
        parts.push({ inlineData: { mimeType: "image/jpeg", data: imageBase64 } });
    }

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: { parts },
            config: {
                responseMimeType: "application/json",
                 responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        verbal: { type: Type.OBJECT, properties: { score: { type: Type.NUMBER }, advice: { type: Type.ARRAY, items: { type: Type.STRING } } } },
                        nonVerbal: { type: Type.OBJECT, properties: { score: { type: Type.NUMBER }, advice: { type: Type.ARRAY, items: { type: Type.STRING } } } },
                        content: { type: Type.OBJECT, properties: { score: { type: Type.NUMBER }, advice: { type: Type.ARRAY, items: { type: Type.STRING } } } },
                        confidence: { type: Type.OBJECT, properties: { score: { type: Type.NUMBER }, advice: { type: Type.ARRAY, items: { type: Type.STRING } } } },
                        strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                        weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
                        pros: { type: Type.ARRAY, items: { type: Type.STRING } },
                        cons: { type: Type.ARRAY, items: { type: Type.STRING } },
                        overallSummary: { type: Type.STRING }
                    }
                 }
            }
        });
        return JSON.parse(response.text);
    } catch (error) {
        console.error("Analysis Error", error);
        throw error;
    }
}