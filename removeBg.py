import sys          # For command line arguments and exit codes
import os           # For file system operations (checking if files exist)
from rembg import remove  # The AI model that removes backgrounds
exit(0)

def remove_background(input_path, output_path):
    # Print what we're doing (helpful for debugging)
    print(f"In rembg function - Input: {input_path}, Output: {output_path}")
    
    try:
        # OPTIONAL: Check if input file exists before trying to read it
        if not os.path.exists(input_path):
            raise FileNotFoundError(f"Input file not found: {input_path}")
        
        # Read the image file as binary data
        with open(input_path, 'rb') as image_file:
            image_data = image_file.read()  # This loads the entire image into memory
            print("Data converted to bytes")
        
        # This is the magic - AI removes the background
        print("Removing background...")
        output_image = remove(image_data)  # Returns processed image as bytes
        print("Background removed successfully")
        
        # Save the processed image to the output location
        with open(output_path, 'wb') as output_file:
            output_file.write(output_image)
        
        print(f"Output saved to: {output_path}")
        
    except Exception as e:
        # If anything goes wrong, print error and exit with error code
        error_msg = f"Error: {e}"
        sys.stderr.write(error_msg + "\n")  # Send to error stream
        print(error_msg)                    # Also print normally
        sys.exit(1)                         # Exit with error code 1

# This runs when the script is called directly (not imported)
if __name__ == "__main__":
    # Check if user provided exactly 2 arguments (input and output paths)
    if len(sys.argv) != 3:
        sys.stderr.write("Usage: python removeBg.py <input_path> <output_path>\n")
        sys.exit(1)
    
    # Get the file paths from command line arguments
    input_path = sys.argv[1]   # First argument: where to read from
    output_path = sys.argv[2]  # Second argument: where to save result
    
    # Do the actual work
    remove_background(input_path, output_path)
    sys.exit(0)  # Exit successfully