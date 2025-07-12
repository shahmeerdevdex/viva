import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface AnalysisRequest {
  imageUrl: string;
  questionnaireData: any;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  let requestData: AnalysisRequest;
  
  try {
    requestData = await req.json();
    const { imageUrl, questionnaireData } = requestData;
    
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    console.log('=== OPENAI API SETUP ===');
    console.log('API Key check:', openaiApiKey ? `Found (starts with: ${openaiApiKey.substring(0, 10)}...)` : 'MISSING - THIS IS THE PROBLEM!');
    
    if (!openaiApiKey) {
      console.error('❌ OPENAI_API_KEY not found in environment variables');
      throw new Error('OpenAI API key not configured in Supabase secrets');
    }

    console.log('=== STARTING OPENAI ANALYSIS ===');
    console.log('Image URL length:', imageUrl.length);
    console.log('Questionnaire data:', JSON.stringify(questionnaireData, null, 2));

    // First, analyze the face
    const analysisPayload = {
      model: 'gpt-4o',
      max_tokens: 4000,
      response_format: { type: "json_object" },
      messages: [
        {
          role: 'system',
          content: `You are a board-certified dermatologist with 15+ years in aesthetic medicine specializing in facial aging analysis. 

CRITICAL ANALYSIS PRINCIPLES:
- ONLY describe what is objectively visible in the image
- Use specific anatomical terminology (periorbital, midface, nasolabial, etc.)
- Score based on deviation from age-matched norms (0-10 scale)
- Connect visible changes to specific lifestyle factors from quiz data

ASSESSMENT WORKFLOW:

STEP 1: PURE VISUAL ANALYSIS
Systematically examine:
- Upper third: forehead, glabella, temples
- Middle third: periorbital, midface, nasolabial
- Lower third: jawline, jowls, neck
- Overall: skin texture, pigmentation, symmetry

STEP 2: CLINICAL SCORING (0-10 scale)
- Volume integrity: facial fullness, structural support
- Dermal density: skin thickness, firmness, elasticity

STEP 3: AGE ASSESSMENT
Compare visible aging markers to age-matched norms:
- Identify 3-5 most prominent markers
- Calculate realistic skin age assessment (be accurate, not conservative)
- Consider photo quality in confidence scoring

STEP 4: QUIZ-SPECIFIC CORRELATION
Connect SPECIFIC lifestyle factors to visual findings:
- Poor sleep → periorbital puffiness, dark circles, dull complexion
- High stress → tension lines, accelerated collagen breakdown
- Sun exposure → pigmentation irregularities, texture changes, premature lines
- Smoking history → lip lines, sallow complexion, reduced elasticity
- Hormonal status → volume changes, skin thickness variations

You must respond with valid JSON only in this exact format:
{
  "assessment_confidence": 0.95,
  "chronological_age": ${questionnaireData?.age || 35},
  "assessed_skin_age": 48,
  "aging_acceleration": 5,
  "primary_concern": "periorbital_volume_loss",
  "clinical_metrics": {
    "volume_integrity": {
      "score": 6.5,
      "category": "concern",
      "description": "Assessment of facial volume and structural support"
    },
    "dermal_density": {
      "score": 7.0,
      "category": "normal", 
      "description": "Assessment of skin density and firmness"
    }
  },
  "findings": [
    {
      "area": "periorbital_region",
      "observation": "Specific visible aging signs observed",
      "lifestyle_factor": "Connection to specific lifestyle factors",
      "biological_factor": "Scientific explanation of aging mechanism"
    }
  ],
  "recommendations": [
    "Specific evidence-based recommendation 1",
    "Specific evidence-based recommendation 2"
  ]
}

Focus on accurate age assessment - don't be conservative. If you see significant aging markers, reflect that in the assessed_skin_age number.`
        },
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: {
                url: imageUrl
              }
            },
            {
              type: 'text',
              text: `Analyze this facial photograph and provide a comprehensive clinical evaluation. 

Patient Information:
- Age: ${questionnaireData?.age || 'Not provided'}
- Sleep Quality: ${questionnaireData?.sleepQuality || 'Not assessed'}
- Stress Level: ${questionnaireData?.stressLevel || 'Not assessed'}
- Sun Exposure: ${questionnaireData?.sunExposure || 'Not assessed'}
- Skincare Routine: ${questionnaireData?.skincareRoutine || 'Not assessed'}
- Hormone Status: ${questionnaireData?.hormoneStatus || 'Not assessed'}

Be accurate in your skin age assessment - if you observe significant aging markers, reflect this in your assessed_skin_age. Don't be overly conservative.

Provide only the JSON response, no additional text.`
            }
          ]
        }
      ]
    };

    console.log('=== MAKING OPENAI ANALYSIS REQUEST ===');

    const analysisResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify(analysisPayload)
    });

    console.log('=== OPENAI ANALYSIS RESPONSE ===');
    console.log('Response status:', analysisResponse.status);

    if (!analysisResponse.ok) {
      const errorText = await analysisResponse.text();
      console.error('❌ OpenAI API error response:', errorText);
      throw new Error(`OpenAI API error: ${analysisResponse.status} - ${errorText}`);
    }

    const analysisData = await analysisResponse.json();
    console.log('✅ OpenAI analysis response received successfully');
    
    if (!analysisData.choices || analysisData.choices.length === 0) {
      console.error('❌ No choices in OpenAI response:', analysisData);
      throw new Error('No choices returned from OpenAI API');
    }
    
    const analysisText = analysisData.choices[0].message.content;
    console.log('=== PARSING OPENAI ANALYSIS ===');
    console.log('Raw response length:', analysisText.length);
    
    // Parse the JSON response from OpenAI
    let analysisResult;
    try {
      let cleanedResponse = analysisText.trim();
      
      if (cleanedResponse.startsWith('```json')) {
        cleanedResponse = cleanedResponse.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      }
      
      if (cleanedResponse.startsWith('```')) {
        cleanedResponse = cleanedResponse.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }
      
      const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysisResult = JSON.parse(jsonMatch[0]);
        console.log('✅ Successfully parsed OpenAI analysis as JSON');
      } else {
        console.error('❌ No JSON found in OpenAI response');
        throw new Error('No JSON found in OpenAI response - response may be malformed');
      }
    } catch (parseError) {
      console.error('❌ Failed to parse OpenAI response as JSON:', parseError);
      throw new Error(`JSON parsing failed: ${parseError.message}`);
    }

    // Skip enhanced image generation for now since DALL-E 3 can't enhance actual photos
    console.log('=== SKIPPING ENHANCED IMAGE GENERATION ===');
    console.log('Note: Enhanced image generation disabled - DALL-E 3 cannot enhance actual photos');
    
    const enhancedImageUrl = null; // Temporarily disable enhanced image

    console.log('=== RETURNING SUCCESSFUL ANALYSIS ===');
    const finalResult = {
      ...analysisResult,
      enhanced_image_url: enhancedImageUrl
    };
    
    console.log('Final result has enhanced_image_url:', !!finalResult.enhanced_image_url);
    
    return new Response(JSON.stringify(finalResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('=== ERROR IN FACE ANALYSIS ===');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    console.log('=== GENERATING FALLBACK ASSESSMENT ===');
    const fallbackResult = generateEnhancedFallbackAssessment(requestData?.questionnaireData || {});
    
    console.log('Returning fallback assessment due to error');
    
    return new Response(JSON.stringify({
      ...fallbackResult,
      enhanced_image_url: null,
      error_info: {
        message: error.message,
        type: 'openai_api_failure',
        fallback_used: true
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  }
});

function generateEnhancedFallbackAssessment(questionnaireData: any) {
  let agingAcceleration = 0;
  let primaryConcern = 'general_wellness';
  const recommendations: string[] = [];
  
  // Enhanced analysis based on questionnaire
  if (questionnaireData?.sunExposure === 'high') {
    agingAcceleration += 6;
    primaryConcern = 'photoaging_prevention';
    recommendations.push('Critical: Apply broad-spectrum SPF 50+ sunscreen daily');
    recommendations.push('Consider professional IPL or laser treatment for photoaging');
  } else if (questionnaireData?.sunExposure === 'moderate') {
    agingAcceleration += 3;
    recommendations.push('Daily broad-spectrum SPF 30+ sunscreen application');
  }
  
  if (questionnaireData?.sleepQuality === 'poor') {
    agingAcceleration += 4;
    recommendations.push('Prioritize 7-9 hours of quality sleep for cellular repair');
    recommendations.push('Consider sleep study if chronic insomnia persists');
  }
  
  if (questionnaireData?.stressLevel === 'high') {
    agingAcceleration += 4;
    primaryConcern = 'stress_management';
    recommendations.push('Implement daily stress-reduction techniques');
    recommendations.push('Consider cortisol management through meditation or therapy');
  }
  
  // For middle-aged women, add realistic aging factors
  const ageRange = questionnaireData?.age || '41-45';
  let baseAging = 5; // Base aging acceleration for this age group
  
  if (ageRange.includes('41-45') || ageRange.includes('46-50')) {
    baseAging = 7;
  }
  
  // Always include evidence-based recommendations
  recommendations.push('Start retinoid therapy (consult dermatologist for prescription strength)');
  recommendations.push('Morning antioxidant serum (Vitamin C + E + Ferulic acid)');
  recommendations.push('Evening peptide moisturizer for collagen support');
  recommendations.push('Monthly professional facial treatments');
  recommendations.push('Annual comprehensive dermatological examination');
  
  const chronologicalAge = parseInt(ageRange.split('-')[0]) || 42;
  const assessedSkinAge = chronologicalAge + baseAging + agingAcceleration;
  
  return {
    assessment_confidence: 0.55, // Lower confidence to indicate fallback
    chronological_age: chronologicalAge,
    assessed_skin_age: Math.min(assessedSkinAge, 55), // Cap at reasonable maximum
    aging_acceleration: baseAging + agingAcceleration,
    primary_concern: primaryConcern,
    clinical_metrics: {
      volume_integrity: {
        score: questionnaireData?.stressLevel === 'high' ? 5.8 : 6.5,
        category: questionnaireData?.stressLevel === 'high' ? 'concern' : 'monitor',
        description: 'FALLBACK: Facial volume assessment based on lifestyle and hormonal factors'
      },
      dermal_density: {
        score: questionnaireData?.sleepQuality === 'poor' ? 5.5 : 
               questionnaireData?.sunExposure === 'high' ? 6.0 : 7.2,
        category: (questionnaireData?.sleepQuality === 'poor' || questionnaireData?.sunExposure === 'high') ? 'concern' : 'monitor',
        description: 'FALLBACK: Skin density evaluation incorporating environmental and lifestyle factors'
      }
    },
    findings: [
      {
        area: 'comprehensive_facial_assessment',
        observation: `FALLBACK ANALYSIS: Comprehensive evaluation indicates visible aging patterns consistent with chronological age ${chronologicalAge} plus environmental and lifestyle accelerating factors`,
        lifestyle_factor: `Key factors: ${questionnaireData?.sleepQuality || 'moderate'} sleep quality, ${questionnaireData?.stressLevel || 'moderate'} stress levels, ${questionnaireData?.sunExposure || 'moderate'} UV exposure history`,
        biological_factor: agingAcceleration > 5 ? 
          'Multiple accelerating factors detected - comprehensive intervention strategy recommended' :
          'Age-appropriate patterns with targeted preventive care indicated'
      }
    ],
    recommendations: recommendations
  };
}
