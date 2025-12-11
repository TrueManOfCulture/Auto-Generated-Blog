// Removed the @huggingface/inference library as we are using the HF Router endpoint
// The standard 'fetch' API is used directly.

// Router URL is constant for all compatible models
const AI_API_URL = "https://router.huggingface.co/v1/chat/completions";
const HF_TOKEN = process.env.HF_TOKEN; 

// The model you selected, which is compatible with the HF Router/OpenAI format
const MODEL_NAME = "deepseek-ai/DeepSeek-V3.2:novita"; 

/**
 * Generates a title and content for a new technical blog article using the HF Router API.
 * @param {string} topic - The topic to guide the AI generation.
 * @returns {Promise<{title: string, content: string}>} The generated article data.
 */
export async function generateArticle(topic = "A random technical topic suitable for a blog post") {
    
    if (!HF_TOKEN) {
        throw new Error("HF_TOKEN environment variable is not set. Cannot call AI API.");
    }
    
    // The prompt instructs the model to generate structured JSON output.
    const systemPrompt = `You are a helpful and engaging technical blog writer.
        Your task is to write a single, detailed blog article about the topic provided.
        Format your entire response as a JSON object with two fields: 'title' (string) and 'content' (string). 
        The content should be in Markdown format, at least 5 paragraphs long, using headings (##) and lists.
        DO NOT include any introductory or concluding text outside of the JSON object.`;
        
    const userContent = `Topic: ${topic}`;

    console.log(`🤖 Requesting article generation for topic: "${topic}" using model: ${MODEL_NAME}...`);

    // The request body matches the Python example's 'client.chat.completions.create' structure
    const requestBody = {
        model: MODEL_NAME,
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userContent },
        ],
        temperature: 0.7,
        max_tokens: 2500, // Generous token limit
        response_format: { type: "json_object" } // Optional, but helps ensure clean JSON output if supported by the model
    };

    try {
        const response = await fetch(AI_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Authorization header uses the HF Token
                'Authorization': `Bearer ${HF_TOKEN}` 
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HF Router API failed with status: ${response.status}. Response: ${errorText}`);
        }

        const data = await response.json();
        
        // --- 1. Extract and Parse the Content ---
        // Changed 'const' to 'let' so we can clean the string
        let rawJsonText = data.choices[0].message.content.trim(); 
        
        // FIX: Remove Markdown code fences (e.g., ```json\n...\n```) if present
        if (rawJsonText.startsWith("```json")) {
            rawJsonText = rawJsonText.substring(7); // Remove '```json'
        } else if (rawJsonText.startsWith("```")) {
            rawJsonText = rawJsonText.substring(3); // Remove '```'
        }
        if (rawJsonText.endsWith("```")) {
            rawJsonText = rawJsonText.slice(0, -3); // Remove trailing '```'
        }

        rawJsonText = rawJsonText.trim(); // Trim any remaining whitespace after cleaning
        
        let parsedArticle;
        try {
            // The model is instructed to output JSON, so we parse the content field.
            parsedArticle = JSON.parse(rawJsonText);
        } catch (e) {
            console.error("Failed to parse JSON response from AI:", rawJsonText);
            throw new Error("AI response was not valid JSON. Ensure the model follows instructions.");
        }

        if (!parsedArticle.title || !parsedArticle.content) {
             throw new Error("AI response missing 'title' or 'content' fields.");
        }

        console.log(`✅ Article generated with title: "${parsedArticle.title}"`);
        
        return {
            title: parsedArticle.title,
            content: parsedArticle.content,
        };
        
    } catch (error) {
        console.error("AI Generation Error:", error.message);
        throw new Error(`AI generation failed: ${error.message}`);
    }
}