import requests 

from decouple import config

ELEVEN_LABS_API_KEY  = config("ELEVEN_LABS_API_KEY")


#ELEVEN LABS
#Convert text to speech
def convert_text_to_speech(message):
    #define data
    body = {
        "text" : message,
        "voice_settings" : {
            "stability" : 0,
            "similarity_boost" : 0,
        }
    }

    #Define voice
    voice_bot = "cgSgspJ2msm6clMCkdW9"

    headers = {
    "xi-api-key" : ELEVEN_LABS_API_KEY, "Content-Type" : "application/json", "accept" : "audio/wav"
    }

    endpoint = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_bot}"

    try:
        response = requests.post(endpoint, json=body, headers = headers)
    except Exception as e:
        return
    
    # Handle response
    if response.status_code == 200:
        #with open("output.wav", "wb") as f:
        return response.content
    else:
        print(f"Failed to get audio: {response.status_code} - {response.text}")
        return