import cv2
import os
import numpy as np

def map_angle_to_frame(angle):
    keypoints = [
        (0, 90), (45, 120), (90, 150), (135, 175),
        (180, 200), (225, 215), (247.5, 239),
        (270, 275), (315, 305), (360, 330)
    ]
    for i in range(len(keypoints)-1):
        a1, f1 = keypoints[i]
        a2, f2 = keypoints[i+1]
        if a1 <= angle <= a2:
            return f1 + (f2 - f1) * (angle - a1) / (a2 - a1)
    return keypoints[-1][1]

cap = cv2.VideoCapture('D:\\port\\i_mean_add_a_cream_20260926190338.mp4')
frames = []
while True:
    ret, frame = cap.read()
    if not ret: break
    frames.append(frame)
cap.release()

os.makedirs('public/frames', exist_ok=True)

for i in range(64):
    angle = i * (360.0 / 64)
    frame_idx_unwrapped = map_angle_to_frame(angle)
    frame_idx = int(round(frame_idx_unwrapped)) % len(frames)
    cv2.imwrite(f'public/frames/{i:04d}.webp', frames[frame_idx], [cv2.IMWRITE_WEBP_QUALITY, 90])

cv2.imwrite('public/frames/center.webp', frames[0], [cv2.IMWRITE_WEBP_QUALITY, 90])
print("Done extracting frames!")
