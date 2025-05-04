import base64
from rembg import remove
import sys

def remove_background(base64_image):
    # Decode the base64 image
    image_data = base64.b64decode(base64_image)

    # Remove the background
    output_image = remove(image_data)

    # Encode the output image to base64
    result = base64.b64encode(output_image).decode('utf-8')
    return result

if( __name__ == "__main__"):
    # Read the base64 image from the command line argument
    base64_image = sys.stdin.read()

    # Remove the background and get the result
    result = remove_background(base64_image)
    sys.stdout.write(result)