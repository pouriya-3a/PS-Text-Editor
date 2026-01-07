# PS-Text-Editor

A simple and reusable text editor built with **Tiptap** and **Material UI**.  
Designed to be easily plugged into any React project and easily extended.

Enjoy 🚀

---

## 🚀 Usage

Create a state in your component and pass both `value` and `setValue` to the editor.  
The editor handles the rest.

The editor also provides:
- `handleUploadImage` → returns the uploaded image file
- `handleRemoveImage` → returns the current Tiptap state when an image is deleted

This makes it easy to sync images with your backend or storage.

!!! In updates, make sure your data is stored in your state before rendering the Text Editor !!!

### Example

```jsx
const [value, setValue] = useState("");

<TextEditor
  value={value}
  onChange={setValue}
  handleAddImage={handleUploadImage}
  handleRemoveImage={handleRemoveImage}
/>
```
##  Installation

To use this editor, make sure you install the required dependencies:

### Core dependencies
```bash
npm install @tiptap/react @tiptap/core
npm install @mui/material @mui/icons-material @emotion/react @emotion/styled

npm install \
@tiptap/starter-kit \
@tiptap/extension-image \
@tiptap/extension-link \
@tiptap/extension-text-align

