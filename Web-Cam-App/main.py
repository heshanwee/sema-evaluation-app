import cv2
import numpy as np
import pygame
import time

# Load the pre-trained face detection model
face_cascade = cv2.CascadeClassifier('haarcascade_frontalface_default.xml')
# fullbody_cascade = cv2.CascadeClassifier("haarcascade_fullbody.xml")

pygame.init()

# Load audio tracks (replace filenames with your actual audio files)
audio_track_4 = pygame.mixer.Sound("fire-2.mp3")
audio_track_3 = pygame.mixer.Sound("fire-1.mp3")
audio_track_2 = pygame.mixer.Sound("water-1.mp3")
audio_track_1 = pygame.mixer.Sound("water-3.mp3")

# Capture video from webcam
cap = cv2.VideoCapture(0)

# State variables for tracking face position and audio playback
current_position = None
last_audio_played = None
last_change_time = None  # Variable to track time of last audio change

# Define delay in seconds
delay = 2  # Change to desired delay (e.g., 0.5 for half a second)

# Check if webcam is opened successfully
if not cap.isOpened():
    print("Error opening video capture object")
    exit()

while True:
    # Capture frame-by-frame
    ret, frame = cap.read()

    # Convert frame to grayscale (optional)
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    # Detect faces in the grayscale frame
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5)
    # faces = fullbody_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5)

    # Focus on the first detected face (if any)
    if len(faces) > 0:
        x, y, w, h = faces[0]  # Take only the first face
        center_x = int(x + w / 2)

        # Calculate frame width
        frame_width = frame.shape[1]

        # Define thresholds for dividing the frame
        threshold_1 = frame_width // 4
        threshold_2 = threshold_1 * 2
        threshold_3 = threshold_1 * 3

        # Determine position based on center x coordinate
        new_position = None
        if center_x < threshold_1:
            new_position = 1
        elif center_x < threshold_2:
            new_position = 2
        elif center_x < threshold_3:
            new_position = 3
        else:
            new_position = 4

        # Audio playback with delay
        if new_position != current_position and new_position != last_audio_played:
            current_position = new_position

            # Check if enough time has passed since last change
            if last_change_time is None or time.time() - last_change_time >= delay:
                # Stop any currently playing audio
                pygame.mixer.stop()

                if new_position == 1:
                    audio_track_1.play()
                    print("Position:", new_position)
                elif new_position == 2:
                    audio_track_2.play()
                    print("Position:", new_position)
                elif new_position == 3:
                    audio_track_3.play()
                    print("Position:", new_position)
                elif new_position == 4:
                    audio_track_4.play()
                    print("Position:", new_position)

                # Update last change time
                last_change_time = time.time()

        # Draw rectangle around the face
        cv2.rectangle(frame, (x, y), (x + w, y + h), (255, 0, 0), 2)

    # Display the frame
    cv2.imshow('Frame', frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Release resources
cap.release()
cv2.destroyAllWindows()
pygame.quit()
