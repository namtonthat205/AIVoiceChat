import json
import random


#Get recent messages

def get_recent_messages():

    file_name = "stored_data.json"
    learn_instruction = {
        "role" : "system",
        "content" : "You are interviewing the user for a job as a software engineer. Ask short questions that are relevant to the junior position. Your name is Jessica and you are a very mean and rude recruiter. Ask the user for their name. Keep your answer under 30 words."
    }

    #Intialise messages

    messages = []

    #Add a random element

    x = random.uniform(0,1)
    if x < 0.5:
        learn_instruction["content"] = learn_instruction["content"] + "Your response will include some dry humour"
    else:
        learn_instruction["content"] = learn_instruction["content"] + "Your response will include a rather challenging question"

    #Append instruction to message

    messages.append(learn_instruction)


    #Get last messages

    try:
        with open(file_name) as user_file:
            data = json.load(user_file)

            #Append last 5 items of data
            if data:
                if len(data) < 5:
                    for item in data:
                        messages.append(item)
                else:
                    for item in data[-5:]:
                        messages.append(item)
    except Exception as e:
        print(e)
        pass

    #Return messages
    return messages

#Store messages

def store_messages(request_message, response_message):

  # Define the file name
  file_name = "stored_data.json"

  # Get recent messages
  messages = get_recent_messages()[1:]

  # Add messages to data
  user_message = {"role": "user", "content": request_message}
  assistant_message = {"role": "assistant", "content": response_message}
  messages.append(user_message)
  messages.append(assistant_message)

  #print(messages)

  # Save the updated file
  with open(file_name, "w") as f:
    json.dump(messages, f)


# Save messages for retrieval later on
def reset_messages():

  # Define the file name
  file_name = "stored_data.json"

  # Write an empty file
  open(file_name, "w")