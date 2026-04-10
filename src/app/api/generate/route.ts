const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;
const MODEL_VERSION =
  "6c4ebdf049df552f8c02b3a7bbb3afec3d37b20924282bab8744f1168b6de470";

export async function POST(request: Request) {
  try {
    const { word } = await request.json();

    if (!word || typeof word !== "string") {
      return Response.json({ error: "A word is required" }, { status: 400 });
    }

    // Use the HTTP API directly to get a clean URL string
    const createRes = await fetch(
      `https://api.replicate.com/v1/predictions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${REPLICATE_API_TOKEN}`,
          Prefer: "wait",
        },
        body: JSON.stringify({
          version: MODEL_VERSION,
          input: {
            prompt: `${word} in the style of TOK a trtcrd, tarot style`,
            num_outputs: 1,
            aspect_ratio: "2:3",
          },
        }),
      }
    );

    if (!createRes.ok) {
      const errBody = await createRes.text();
      console.error("Replicate API error:", createRes.status, errBody);
      return Response.json(
        { error: "Failed to generate tarot card" },
        { status: 500 }
      );
    }

    const prediction = await createRes.json();
    console.log("Prediction status:", prediction.status);
    console.log("Prediction output:", prediction.output);

    // Output is typically an array of URL strings
    const imageUrl =
      Array.isArray(prediction.output) && prediction.output.length > 0
        ? prediction.output[0]
        : prediction.output;

    if (!imageUrl || typeof imageUrl !== "string") {
      console.error("Unexpected output:", prediction);
      return Response.json(
        { error: "Unexpected model output" },
        { status: 500 }
      );
    }

    return Response.json({ imageUrl });
  } catch (error) {
    console.error("Replicate tarot generation error:", error);
    return Response.json(
      { error: "Failed to generate tarot card" },
      { status: 500 }
    );
  }
}
