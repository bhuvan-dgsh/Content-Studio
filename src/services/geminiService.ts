import { GoogleGenAI, Type } from "@google/genai";

let aiInstance: GoogleGenAI | null = null;

function getAI(): GoogleGenAI {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY is not set. Please configure it in your environment variables.");
      // Fallback to a dummy key to prevent immediate crash, but it will fail on generation
      aiInstance = new GoogleGenAI({ apiKey: "MISSING_API_KEY" });
    } else {
      aiInstance = new GoogleGenAI({ apiKey });
    }
  }
  return aiInstance;
}

export interface RepurposedContent {
  step1_extraction: {
    videoTitle: string;
    videoDescription: string;
    videoTopic: string;
    coreMessage: string;
    keyInsights: string[];
    highlightMoments: string[];
    clipOpportunities: { timestamp: string; idea: string; type: string }[];
  };
  step2_trendPrediction: {
    trendingTopics: string[];
    trendingContentFormats: string[];
    trendingHooks: string[];
    contentOpportunities: string[];
  };
  step3_hooks: {
    curiosity: string;
    controversial: string;
    problem: string;
    story: string;
    boldStatement: string;
  };
  step4_scripts: {
    title: string;
    hook: string;
    curiosityBuild: string;
    mainValue: string;
    insightOrTwist: string;
    callToAction: string;
  }[];
  step5_thumbnails: {
    visualConcept: string;
    facialExpression: string;
    thumbnailText: string;
    colorPalette: string;
    layoutComposition: string;
    emotionTrigger: string;
  }[];
  step6_multiPlatform: {
    youtube: {
      caption: string;
      hashtags: string[];
      hookLine: string;
      suggestedPostingTime: string;
      bestFormat: string;
      viralTitles: string[];
      seoDescription: string;
    };
    instagram: {
      caption: string;
      hashtags: string[];
      hookLine: string;
      suggestedPostingTime: string;
      bestFormat: string;
    };
    tiktok: {
      caption: string;
      hashtags: string[];
      hookLine: string;
      suggestedPostingTime: string;
      bestFormat: string;
    };
    twitter: {
      thread: string[];
      suggestedPostingTime: string;
      bestFormat: string;
    };
    linkedin: {
      caption: string;
      hashtags: string[];
      hookLine: string;
      suggestedPostingTime: string;
      bestFormat: string;
    };
  };
  step7_calendar: {
    week: number;
    day: number;
    platform: string;
    contentType: string;
    topic: string;
    postingFrequency: string;
    viralHookIdea: string;
  }[];
  step8_viralScore: {
    hookStrength: number;
    engagementPotential: number;
    retentionPotential: number;
    viralityScore: number;
    explanation: string;
  };
}

export async function generateRepurposedContent(inputContent: string, inputType: string = 'text'): Promise<RepurposedContent> {
  const isUrl = inputContent.trim().startsWith('http');
  
  const prompt = `You are an advanced AI Content Engine that analyzes, predicts, generates, and publishes content across platforms.

INPUT CONTENT TYPE: ${inputType.toUpperCase()}
INPUT CONTENT:
${inputContent}

If the input is a YouTube URL, extract the video title, description, transcript, timestamps, and key segments.

Follow this pipeline:

STEP 1 – CONTENT EXTRACTION & ANALYSIS
Extract/Analyze: Video Title, Description, Video Topic, Core Message, Key Insights, Highlight Moments, and Clip Opportunities (with timestamps and ideas).

STEP 2 – TREND PREDICTION ENGINE
Analyze the niche and predict: Trending Topics, Trending Content Formats, Trending Hooks, and Content Opportunities.

STEP 3 – VIRAL HOOK GENERATION
Generate 5 viral hooks: Curiosity, Controversial, Problem, Story, Bold statement.

STEP 4 – SHORT VIDEO SCRIPT GENERATION
Generate 3 high-retention short video scripts (30-45s) using: Hook, Curiosity build, Main value, Insight or twist, Call to action.

STEP 5 – AI THUMBNAIL GENERATION
Generate 3 high-click YouTube thumbnail concepts including: Visual concept, Facial expression, Thumbnail text, Color palette, Layout composition, Emotion trigger.

STEP 6 – AUTOMATED SOCIAL MEDIA PUBLISHING
Prepare publish-ready packages for YouTube, Instagram, TikTok, Twitter/X, and LinkedIn. Include Caption, Hashtags, Hook line, Suggested posting time, and Best format for each. For YouTube, also include Viral Titles and SEO Description. For Twitter, generate a Thread.

STEP 7 – SMART CONTENT CALENDAR
Generate a 30-day (4 weeks) posting strategy. You MUST generate EXACTLY 30 items in the array, one for each day (Day 1 to Day 30). Include Platform, Content type, Topic, Posting frequency, and Viral hook idea for each day.

STEP 8 – VIRAL SCORE
Evaluate the content and provide scores (1-100) for: Hook Strength, Engagement Potential, Retention Potential, Virality Score, and a brief explanation.`;

  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      tools: isUrl ? [{ urlContext: {} }] : undefined,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          step1_extraction: {
            type: Type.OBJECT,
            properties: {
              videoTitle: { type: Type.STRING },
              videoDescription: { type: Type.STRING },
              videoTopic: { type: Type.STRING },
              coreMessage: { type: Type.STRING },
              keyInsights: { type: Type.ARRAY, items: { type: Type.STRING } },
              highlightMoments: { type: Type.ARRAY, items: { type: Type.STRING } },
              clipOpportunities: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    timestamp: { type: Type.STRING },
                    idea: { type: Type.STRING },
                    type: { type: Type.STRING }
                  }
                }
              }
            }
          },
          step2_trendPrediction: {
            type: Type.OBJECT,
            properties: {
              trendingTopics: { type: Type.ARRAY, items: { type: Type.STRING } },
              trendingContentFormats: { type: Type.ARRAY, items: { type: Type.STRING } },
              trendingHooks: { type: Type.ARRAY, items: { type: Type.STRING } },
              contentOpportunities: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          },
          step3_hooks: {
            type: Type.OBJECT,
            properties: {
              curiosity: { type: Type.STRING },
              controversial: { type: Type.STRING },
              problem: { type: Type.STRING },
              story: { type: Type.STRING },
              boldStatement: { type: Type.STRING }
            }
          },
          step4_scripts: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                hook: { type: Type.STRING },
                curiosityBuild: { type: Type.STRING },
                mainValue: { type: Type.STRING },
                insightOrTwist: { type: Type.STRING },
                callToAction: { type: Type.STRING }
              }
            }
          },
          step5_thumbnails: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                visualConcept: { type: Type.STRING },
                facialExpression: { type: Type.STRING },
                thumbnailText: { type: Type.STRING },
                colorPalette: { type: Type.STRING },
                layoutComposition: { type: Type.STRING },
                emotionTrigger: { type: Type.STRING }
              }
            }
          },
          step6_multiPlatform: {
            type: Type.OBJECT,
            properties: {
              youtube: {
                type: Type.OBJECT,
                properties: {
                  caption: { type: Type.STRING },
                  hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
                  hookLine: { type: Type.STRING },
                  suggestedPostingTime: { type: Type.STRING },
                  bestFormat: { type: Type.STRING },
                  viralTitles: { type: Type.ARRAY, items: { type: Type.STRING } },
                  seoDescription: { type: Type.STRING }
                }
              },
              instagram: {
                type: Type.OBJECT,
                properties: {
                  caption: { type: Type.STRING },
                  hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
                  hookLine: { type: Type.STRING },
                  suggestedPostingTime: { type: Type.STRING },
                  bestFormat: { type: Type.STRING }
                }
              },
              tiktok: {
                type: Type.OBJECT,
                properties: {
                  caption: { type: Type.STRING },
                  hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
                  hookLine: { type: Type.STRING },
                  suggestedPostingTime: { type: Type.STRING },
                  bestFormat: { type: Type.STRING }
                }
              },
              twitter: {
                type: Type.OBJECT,
                properties: {
                  thread: { type: Type.ARRAY, items: { type: Type.STRING } },
                  suggestedPostingTime: { type: Type.STRING },
                  bestFormat: { type: Type.STRING }
                }
              },
              linkedin: {
                type: Type.OBJECT,
                properties: {
                  caption: { type: Type.STRING },
                  hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
                  hookLine: { type: Type.STRING },
                  suggestedPostingTime: { type: Type.STRING },
                  bestFormat: { type: Type.STRING }
                }
              }
            }
          },
          step7_calendar: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                week: { type: Type.NUMBER },
                day: { type: Type.NUMBER },
                platform: { type: Type.STRING },
                contentType: { type: Type.STRING },
                topic: { type: Type.STRING },
                postingFrequency: { type: Type.STRING },
                viralHookIdea: { type: Type.STRING }
              }
            }
          },
          step8_viralScore: {
            type: Type.OBJECT,
            properties: {
              hookStrength: { type: Type.NUMBER },
              engagementPotential: { type: Type.NUMBER },
              retentionPotential: { type: Type.NUMBER },
              viralityScore: { type: Type.NUMBER },
              explanation: { type: Type.STRING }
            }
          }
        }
      }
    }
  });

  if (!response.text) {
    throw new Error("Failed to generate content");
  }

  return JSON.parse(response.text) as RepurposedContent;
}
