// ============================================
// 📁 EMPLACEMENT : src/services/AIService.ts
// 🤖 VERSION EXPO SDK 54 — Import legacy pour file-system
// ============================================

// SDK 54 : l'ancienne API est dans expo-file-system/legacy
import * as FileSystem from 'expo-file-system/legacy';
import { AIResponse, SolutionStep, MathCategory, Difficulty } from '../types';
import { ApiConstants } from '../constants';

/**
 * Convertir une image en base64
 */
const imageToBase64 = async (imageUri: string): Promise<string> => {
  try {
    const base64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: 'base64',
    });
    return base64;
  } catch (error) {
    console.error('Erreur conversion base64:', error);
    throw new Error("Impossible de lire l'image");
  }
};

/**
 * Envoyer l'image à OpenAI et obtenir la solution
 */
export const solveMathProblem = async (imageUri: string): Promise<AIResponse> => {
  try {
    const base64Image = await imageToBase64(imageUri);

    const systemPrompt = `Tu es un professeur de mathématiques expert et bienveillant. 
Quand on te montre une image d'un problème de maths, tu dois :

1. Identifier le problème mathématique dans l'image
2. Le résoudre étape par étape
3. Expliquer chaque étape clairement

IMPORTANT : Réponds UNIQUEMENT en JSON valide avec ce format exact :
{
  "question": "Le problème identifié (recopié en texte)",
  "solution": "La réponse finale",
  "steps": [
    {
      "stepNumber": 1,
      "title": "Titre de l'étape",
      "explanation": "Explication détaillée",
      "formula": "Formule utilisée (optionnel)"
    }
  ],
  "category": "algebra|geometry|calculus|statistics|trigonometry|arithmetic|other",
  "difficulty": "easy|medium|hard"
}

Réponds en français. Sois pédagogique et encourage l'élève.`;

    const response = await fetch(ApiConstants.openaiApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ApiConstants.openaiApiKey}`,
      },
      body: JSON.stringify({
        model: ApiConstants.visionModel,
        messages: [
          { role: 'system', content: systemPrompt },
          {
            role: 'user',
            content: [
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`,
                  detail: 'high',
                },
              },
              {
                type: 'text',
                text: 'Résous ce problème de maths étape par étape.',
              },
            ],
          },
        ],
        max_tokens: ApiConstants.maxTokens,
        temperature: ApiConstants.temperature,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `Erreur API: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error("Réponse vide de l'API");
    }

    return parseAIResponse(content);
  } catch (error: any) {
    console.error('Erreur AI Service:', error);
    return {
      success: false,
      question: '',
      solution: '',
      steps: [],
      category: 'other',
      difficulty: 'medium',
      error: error.message || "Une erreur est survenue lors de l'analyse.",
    };
  }
};

/**
 * Parser la réponse JSON de l'AI
 */
const parseAIResponse = (content: string): AIResponse => {
  try {
    let cleaned = content.trim();
    if (cleaned.startsWith('```json')) {
      cleaned = cleaned.replace(/```json\n?/, '').replace(/\n?```$/, '');
    } else if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/```\n?/, '').replace(/\n?```$/, '');
    }

    const parsed = JSON.parse(cleaned);

    const steps: SolutionStep[] = (parsed.steps || []).map((step: any, index: number) => ({
      stepNumber: step.stepNumber || index + 1,
      title: step.title || `Étape ${index + 1}`,
      explanation: step.explanation || '',
      formula: step.formula || undefined,
    }));

    return {
      success: true,
      question: parsed.question || 'Problème non identifié',
      solution: parsed.solution || 'Solution non disponible',
      steps,
      category: (parsed.category as MathCategory) || 'other',
      difficulty: (parsed.difficulty as Difficulty) || 'medium',
    };
  } catch (error) {
    return {
      success: true,
      question: 'Problème de maths',
      solution: content,
      steps: [{ stepNumber: 1, title: 'Solution', explanation: content }],
      category: 'other',
      difficulty: 'medium',
    };
  }
};

/**
 * Résoudre un problème entré en texte
 */
export const solveMathFromText = async (text: string): Promise<AIResponse> => {
  try {
    const systemPrompt = `Tu es un professeur de mathématiques expert et bienveillant.
Résous le problème suivant étape par étape.

Réponds UNIQUEMENT en JSON valide avec ce format :
{
  "question": "Le problème reformulé",
  "solution": "La réponse finale",
  "steps": [
    {
      "stepNumber": 1,
      "title": "Titre de l'étape",
      "explanation": "Explication détaillée",
      "formula": "Formule (optionnel)"
    }
  ],
  "category": "algebra|geometry|calculus|statistics|trigonometry|arithmetic|other",
  "difficulty": "easy|medium|hard"
}

Réponds en français.`;

    const response = await fetch(ApiConstants.openaiApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ApiConstants.openaiApiKey}`,
      },
      body: JSON.stringify({
        model: ApiConstants.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: text },
        ],
        max_tokens: ApiConstants.maxTokens,
        temperature: ApiConstants.temperature,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `Erreur API: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    return parseAIResponse(content);
  } catch (error: any) {
    return {
      success: false,
      question: text,
      solution: '',
      steps: [],
      category: 'other',
      difficulty: 'medium',
      error: error.message || 'Une erreur est survenue.',
    };
  }
};