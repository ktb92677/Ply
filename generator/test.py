import json
from pdf2image import convert_from_path
import pytesseract
from transformers import LayoutLMv3Processor, LayoutLMv3ForTokenClassification
from PIL import Image
import torch

# Step 1: Convert PDF to images
pdf_path = "main.pdf"  # Replace with your PDF path
images = convert_from_path(pdf_path)

# Define id2label mapping
id2label = {0: "O", 1: "B-KEY", 2: "I-KEY", 3: "B-VALUE", 4: "I-VALUE"}  # Example labels

# Store all results
all_results = []

# Process each page
for page_number, image in enumerate(images):
    print(f"Processing page {page_number + 1}...")

    # Step 2: Extract OCR data using pytesseract
    ocr_results = pytesseract.image_to_data(image, output_type=pytesseract.Output.DICT)

    # Filter valid words and bounding boxes
    valid_entries = [
        (ocr_results["text"][i], [ocr_results["left"][i], ocr_results["top"][i],
                                  ocr_results["left"][i] + ocr_results["width"][i],
                                  ocr_results["top"][i] + ocr_results["height"][i]])
        for i in range(len(ocr_results["text"]))
        if ocr_results["text"][i].strip()  # Exclude empty words
    ]

    # Separate words and boxes
    words = [entry[0] for entry in valid_entries]
    boxes = [entry[1] for entry in valid_entries]

    # Normalize bounding boxes to [0, 1000] for LayoutLM compatibility
    image_width, image_height = image.size
    normalized_boxes = [
        [
            int(1000 * (x / image_width)),
            int(1000 * (y / image_height)),
            int(1000 * (x2 / image_width)),
            int(1000 * (y2 / image_height)),
        ]
        for x, y, x2, y2 in boxes
    ]

    # Step 3: Load LayoutLM processor and model
    processor = LayoutLMv3Processor.from_pretrained("microsoft/layoutlmv3-base", apply_ocr=False)
    model = LayoutLMv3ForTokenClassification.from_pretrained("microsoft/layoutlmv3-base", num_labels=5)

    # Tokenize inputs
    encoding = processor(
        image,
        words,
        boxes=normalized_boxes,
        return_tensors="pt",
        truncation=True,
        padding="max_length",
        max_length=512,
    )

    # Step 4: Run inference
    outputs = model(**{k: v for k, v in encoding.items() if k in model.forward.__code__.co_varnames})
    logits = outputs.logits

    # Step 5: Interpret predictions
    predictions = torch.argmax(logits, dim=2)
    labels = predictions.squeeze().tolist()

    # Extract only B-KEY fields
    page_fields = [
        {
            "field": word,
            "bounding_box": box
        }
        for word, box, label in zip(words, normalized_boxes, labels)
        if id2label.get(label, "UNKNOWN") == "B-KEY"
    ]

    all_results.append({
        "page_number": page_number + 1,
        "fields": page_fields
    })

# Print results as JSON schema
output_json = {
    "document": pdf_path,
    "pages": all_results
}

# Pretty print JSON to console
print(json.dumps(output_json, indent=4))
