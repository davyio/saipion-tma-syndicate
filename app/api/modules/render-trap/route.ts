import { NextRequest, NextResponse } from "next/server";
import { callDeepSeek } from "@/lib/ai";

export const dynamic = "force-dynamic";

/**
 * APP 4: THE VISUAL AMBUSH (FAL.AI GPU & DEEPSEEK COMMERCIAL LIGHTING ENGINE)
 * Pings Fal.ai serverless GPU or synthesizes studio commercial specs via DeepSeek.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, productType, style } = body;

    const userPrompt = (prompt || "").trim();
    const pType = (productType || "luxury fragrance or watch").trim();

    // Generate commercial studio photography lighting spec with DeepSeek
    const aiDirectorSpec = await callDeepSeek({
      messages: [
        {
          role: "system",
          content:
            "You are a master commercial studio photographer and 3D rendering director. In 2 concise sentences, describe the lighting setup, lens aperture (e.g. 85mm f/1.4), material reflections, and color grading for a luxury product commercial photoshoot.",
        },
        {
          role: "user",
          content: `Product: ${pType}. Concept: ${userPrompt || "minimalist ceramic finish on dark pedestal"}. Style: ${style || "monochrome sleek"}.`,
        },
      ],
      temperature: 0.6,
      max_tokens: 150,
    });

    const falKey = process.env.FAL_KEY;

    if (falKey) {
      try {
        const response = await fetch("https://fal.run/fal-ai/flux/schnell", {
          method: "POST",
          headers: {
            Authorization: `Key ${falKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: `Professional high-end commercial 4k studio photography of ${pType}: ${userPrompt || "sleek design on minimalist concrete pedestal with cinematic softbox lighting, 8k resolution, photorealistic, octane render"}`,
            image_size: "square_hd",
            num_images: 1,
            enable_safety_checker: true,
          }),
        });

        const data = await response.json();
        if (data.images && data.images.length > 0) {
          return NextResponse.json({
            ok: true,
            imageUrl: data.images[0].url,
            isLiveGpu: true,
            directorNotes: aiDirectorSpec || "Cinematic 85mm f/1.4 studio lighting with rim-fill bounce.",
            model: "fal:flux + deepseek:deepseek-chat",
          });
        }
      } catch (gpuErr) {
        console.warn("[RenderTrap] Fal.ai API execution failed:", gpuErr);
      }
    }

    // High-resolution curated studio renders
    const sampleRenders = [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
    ];

    const selected = sampleRenders[Math.floor(Math.random() * sampleRenders.length)];

    return NextResponse.json({
      ok: true,
      imageUrl: selected,
      isLiveGpu: false,
      directorNotes:
        aiDirectorSpec ||
        "Key light set at 45° with double-diffused octabox, negative fill on camera-right for high-contrast luxury contouring.",
      model: "deepseek:deepseek-chat",
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
