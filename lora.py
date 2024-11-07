import torch
from huggingface_hub import snapshot_download
from diffusers import DiffusionPipeline, AutoencoderKL
from PIL import Image

# Set up device
device = "cuda" if torch.cuda.is_available() else "cpu"
dtype = torch.bfloat16

# Base model and LoRA model path on Hugging Face
base_model = "black-forest-labs/FLUX.1-dev"
lora_model_repo = "prithivMLmods/Purple-Dreamy-Flux-LoRA"  # Replace with the actual path

# Download the LoRA model from Hugging Face
lora_path = snapshot_download(repo_id=lora_model_repo)
print(f"LoRA model downloaded to: {lora_path}")

# Load base model components
vae = AutoencoderKL.from_pretrained(base_model, subfolder="vae", torch_dtype=dtype).to(device)
pipe = DiffusionPipeline.from_pretrained(base_model, torch_dtype=dtype, vae=vae).to(device)

# Load the downloaded LoRA weights
pipe.load_lora_weights(lora_path)

# Generate an image with the LoRA model
def generate_image_with_lora(prompt, width=512, height=512, cfg_scale=7.5, steps=50, seed=None):
    seed = seed or torch.randint(0, 2**32 - 1, (1,)).item()
    generator = torch.manual_seed(seed)

    # Generate an image using the LoRA-enhanced model
    output_image = pipe(
        prompt=prompt,
        num_inference_steps=steps,
        guidance_scale=cfg_scale,
        width=width,
        height=height,
        generator=generator,
    ).images[0]
    return output_image

# Example prompt and image generation
prompt = "A vibrant cyberpunk city at night with neon lights"
output_image = generate_image_with_lora(prompt)
output_image.save("generated_with_lora.jpg")
print("Image saved as 'generated_with_lora.jpg'")
