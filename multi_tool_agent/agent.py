import requests
import base64

from google.adk.agents import Agent

def parse_pdf(pdf_base64: str) -> dict:
    """Runs the parse pdf api endpoint.

    Args:
        pdf_base64 (str): The PDF file content encoded as base64 string.

    Returns:
        dict: Response containing extracted text or error message.
    """
    try:
        # Decode base64 string to bytes
        pdf_bytes = base64.b64decode(pdf_base64)
        
        # Prepare the file for upload to the API endpoint
        files = {'pdf': ('document.pdf', pdf_bytes, 'application/pdf')}
        
        # Make request to the Next.js API endpoint
        # Assuming the API server is running on localhost:3000
        response = requests.post('http://localhost:3000/api/pdf', files=files)
        
        if response.status_code == 200:
            data = response.json()
            return {
                "status": "success",
                "extracted_text": data.get("extractedText", "")
            }
        else:
            error_data = response.json() if response.content else {}
            return {
                "status": "error",
                "error_message": error_data.get("error", f"HTTP {response.status_code} error")
            }
            
    except requests.exceptions.RequestException as e:
        return {
            "status": "error",
            "error_message": f"Failed to connect to PDF parsing API: {str(e)}"
        }
    except Exception as e:
        return {
            "status": "error",
            "error_message": f"Unexpected error while parsing PDF: {str(e)}"
        }


root_agent = Agent(
    name="weather_time_agent",
    model="gemini-2.5-flash",
    description=(
        "Agent to that can run parse pdfs."
    ),
    instruction=(
        "You are a helpful agent that can parse pdfs."
    ),
    tools=[parse_pdf],
)
def my_after_model_callback(callback_context, llm_response):
    """Callback function that runs after the model generates a response."""
    print(f"After model callback - Response: {llm_response}")
    # You can modify the response here if needed
    return llm_response  # Return the response (modified or unmodified)

# Set the callback function
root_agent.after_model_callback = my_after_model_callback