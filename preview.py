import cv2
from rembg import remove
import numpy as np

import cv2
from rembg import remove
import numpy as np

def overlay_image_on_tshirt(tshirt_path, pic_path, output_path="output_tshirt.jpg"):
    # Load the t-shirt image
    tshirt_img = cv2.imread(tshirt_path)
    tshirt_h, tshirt_w, _ = tshirt_img.shape

    # Load and remove the background of the second image
    with open(pic_path, "rb") as input_file:
        pic_data = input_file.read()
    pic_without_bg = remove(pic_data)

    # Convert the resulting image into a format OpenCV can work with
    pic_np_array = np.frombuffer(pic_without_bg, np.uint8)
    pic_img = cv2.imdecode(pic_np_array, cv2.IMREAD_UNCHANGED)

    # Crop to the content by removing transparent edges
    if pic_img.shape[2] == 4:  # Check for alpha channel
        print("Alpha channel detected")
        alpha_channel = pic_img[:, :, 3]
        non_zero_coords = cv2.findNonZero(alpha_channel)  # Find all non-transparent pixels
        x, y, w, h = cv2.boundingRect(non_zero_coords)  # Get the bounding box around them
        pic_img_cropped = pic_img[y:y+h, x:x+w]  # Crop to this bounding box
    else:
        pic_img_cropped = pic_img  # No cropping needed if no alpha

    # Resize the cropped image to fit on the t-shirt
    scale_ratio = min(tshirt_w / pic_img_cropped.shape[1], tshirt_h / pic_img_cropped.shape[0]) * 0.48  # Adjust scale as needed
    pic_img_resized = cv2.resize(pic_img_cropped, (0, 0), fx=scale_ratio, fy=scale_ratio)

    # Find the center position to place the image on the t-shirt
    x_offset = (tshirt_w - pic_img_resized.shape[1]) // 2
    y_offset = (tshirt_h - pic_img_resized.shape[0]) // 2

    # If the resized image has an alpha channel, use it to blend the images
    if pic_img_resized.shape[2] == 4:
        alpha_channel = pic_img_resized[:, :, 3] / 255.0
        for c in range(3):  # Blend each color channel
            tshirt_img[y_offset:y_offset + pic_img_resized.shape[0], x_offset:x_offset + pic_img_resized.shape[1], c] = (
                alpha_channel * pic_img_resized[:, :, c] +
                (1 - alpha_channel) * tshirt_img[y_offset:y_offset + pic_img_resized.shape[0], x_offset:x_offset + pic_img_resized.shape[1], c]
            )
    else:
        # If no alpha channel, add the image directly
        tshirt_img[y_offset:y_offset + pic_img_resized.shape[0], x_offset:x_offset + pic_img_resized.shape[1]] = pic_img_resized

    # Save the result
    cv2.imwrite(output_path, tshirt_img)
    print(f"Saved the result to {output_path}")

# Example usage
overlay_image_on_tshirt("D:\Study\HK7\EC\E-Commerce\public\\assets\images\product-01.jpg",
                        "D:\Study\HK7\EC\E-Commerce\public\\assets\images\dragon.jpg",
                        "output_tshirt.jpg")

