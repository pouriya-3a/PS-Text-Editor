import { useState } from "react";
import { Stack, Button, Divider, Slider, TextField } from "@mui/material";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";

// Custom image extension with temp flag
const CustomImage = Image.extend({
  addAttributes() {
    return {
      src: {
        default: null,
      },
      alt: {
        default: "",
      },
      title: {
        default: "",
      },
      caption: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-caption"),
        renderHTML: (attrs) =>
          attrs.caption ? { "data-caption": attrs.caption } : {},
      },
      description: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-description"),
        renderHTML: (attrs) =>
          attrs.description ? { "data-description": attrs.description } : {},
      },
      width: {
        default: "100%",
        parseHTML: (element) => element.style.width || "100%",
        renderHTML: (attrs) => ({
          style: `width:${attrs.width}`,
        }),
      },
      align: {
        default: "none",
        parseHTML: (element) => element.getAttribute("data-align") || "none",
        renderHTML: (attrs) => {
          let style = `display:block;width:${attrs.width || "100%"};`;

          if (attrs.align === "center") {
            style += "margin-left:auto;margin-right:auto;";
          } else if (attrs.align === "right") {
            style += "margin-left:auto;margin-right:0;";
          } else {
            style += "margin-left:0;margin-right:auto;";
          }

          return {
            style,
            "data-align": attrs.align,
          };
        },
      },
    };
  },
});

export default function TextEditor({
  value = "",
  onChange,
  handleAddImage,
  handleRemoveImage,
}) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [altText, setAltText] = useState("");
  const [titleText, setTitleText] = useState("");
  const [imageAlign, setImageAlign] = useState("none");
  const [imageWidth, setImageWidth] = useState(100);

  const editor = useEditor({
    extensions: [
      StarterKit,
      CustomImage,
      Link.configure({ openOnClick: false }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: value,
    onUpdate: ({ editor }) => onChange?.(editor.getHTML()),
    onSelectionUpdate: ({ editor }) => {
      const node = editor.state.selection.$anchor.nodeAfter;

      if (node?.type?.name === "image") {
        setSelectedImage(node);
        setAltText(node?.attrs?.alt || "");
        setTitleText(node?.attrs?.title || "");
        setImageWidth(parseInt(node?.attrs?.width) || 100);
        setImageAlign(node?.attrs?.align || "none");
      } else {
        setSelectedImage(null);
      }
    },
  });
  if (!editor) return null;

  // when image Uploaded from Html
  const onUploadHandler = async (file) => {
    if (!file) return;
    console.log(file);
    editor
      .chain()
      .focus()
      .setImage({
        src: URL.createObjectURL(file),
        alt: file?.name,
        // caption: img?.caption,
        // title: img?.file_name,
        // description: img?.description,
      })
      .run();
    handleAddImage(file);
  };

  // Delete Image
  const deleteSelectedImage = () => {
    if (!selectedImage) return;

    // Extract filename from src
    const filename = selectedImage.attrs.title;

    // Remove from editor
    const { from, to } = editor.state.selection;
    editor.chain().focus().deleteRange({ from, to }).run();

    setSelectedImage(null);
    // Call parent handler
    handleRemoveImage(selectedImage);
  };

  // Image Styles Functions
  const changeImageWidth = (val) => {
    if (!selectedImage) return;
    editor
      .chain()
      .focus()
      .updateAttributes("image", { width: `${val}%` })
      .run();
    setImageWidth(val);
  };

  const changeImageAlign = (align) => {
    if (!selectedImage) return;
    editor.chain().focus().updateAttributes("image", { align }).run();
    setImageAlign(align);
  };

  const updateAltTitle = () => {
    if (!selectedImage) return;
    editor
      .chain()
      .focus()
      .updateAttributes("image", { alt: altText, title: titleText })
      .run();
  };

  const setImageLink = () => {
    if (!selectedImage) return;
    const url = window.prompt("آدرس لینک را وارد کنید");
    if (!url) return;
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <Stack
      sx={{
        border: "1px solid #424242ff",
        direction:"rtl" ,
        borderRadius: 2,
        overflow: "hidden",
        bgcolor: "#111",
        color: "white",
        fontWeight: "normal",
        // More Custom styles
        ".MuiButtonBase-root": {
          // bgcolor: "red",
        },
        "a" : {
          color:"lightBlue"
        },
        "strong" : {
          color:"lightBlue"
        },
        "italic" : {
          color:"lightBlue"
        },
        "h2" : {
          color:"lightBlue"
        },
        "h3" : {
          color:"lightBlue"
        },
        "li" : {
          color:"lightBlue"
        },
        "ul" : {
          color:"lightBlue"
        },
      }}
    >
      {/* Toolbar */}
      <Stack
        direction="row"
        gap={1}
        flexWrap="wrap"
        sx={{ p: 1, borderBottom: "1px solid #ffffffff" }}
      >
        <Button
          size="small"
          variant={editor.isActive("bold") ? "contained" : "text"}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          B
        </Button>
        <Button
          size="small"
          variant={editor.isActive("italic") ? "contained" : "text"}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          I
        </Button>
        <Button
          size="small"
          variant={
            editor.isActive("heading", { level: 2 }) ? "contained" : "text"
          }
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          H2
        </Button>
        <Button
          size="small"
          variant={
            editor.isActive("heading", { level: 3 }) ? "contained" : "text"
          }
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
        >
          H3
        </Button>
        <Button
          size="small"
          variant={editor.isActive("bulletList") ? "contained" : "text"}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          • List
        </Button>
        <Button
          size="small"
          variant={editor.isActive("blockquote") ? "contained" : "text"}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          ❝
        </Button>
        <Divider orientation="vertical" flexItem />
        <Button component="label" size="small">
          Image
          <input
            hidden
            type="file"
            accept="image/*"
            onChange={(e) => onUploadHandler(e.target.files?.[0])}
          />
        </Button>
        <Button
          size="small"
          onClick={() => {
            const url = window.prompt("آدرس لینک متن را وارد کنید");
            if (url)
              editor
                .chain()
                .focus()
                .extendMarkRange("link")
                .setLink({ href: url })
                .run();
          }}
        >
          Link
        </Button>
        <Divider orientation="vertical" flexItem />
      </Stack>

      {/* Image Options */}
      {selectedImage && (
        <Stack
          sx={{
            p: 2,
            borderTop: "1px solid #2c2c2c",
            gap: 1,
            bgcolor: "#1a1a1a",
          }}
        >
          <Stack direction="row" gap={1} flexWrap="wrap">
            <Button color="error" size="small" onClick={deleteSelectedImage}>
              Delete
            </Button>
            <Button size="small" onClick={setImageLink}>
              Link
            </Button>
          </Stack>
          <TextField
            size="small"
            label="Alt Text"
            variant="filled"
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
            onBlur={updateAltTitle}
            fullWidth
            sx={{
              "& .MuiInputBase-input": {
                color: "white",
              },
              "& .MuiFilledInput-root": {
                backgroundColor: "#222",
              },
            }}
          />
          <Stack direction="row" alignItems="center" gap={1}>
            <span>Width:</span>
            <Slider
              value={imageWidth}
              min={10}
              max={100}
              onChange={(e, val) => changeImageWidth(val)}
              sx={{ flex: 1 }}
            />
          </Stack>
          <Stack direction="row" gap={1}>
            <Button
              variant={imageAlign === "right" ? "contained" : "text"}
              onClick={() => changeImageAlign("right")}
            >
              Right
            </Button>
            <Button
              variant={imageAlign === "center" ? "contained" : "text"}
              onClick={() => changeImageAlign("center")}
            >
              Center
            </Button>
            <Button
              variant={imageAlign === "left" ? "contained" : "text"}
              onClick={() => changeImageAlign("left")}
            >
              Left
            </Button>
          </Stack>
        </Stack>
      )}

      {/* Editor */}
      <Stack sx={{ p: 2, maxHeight: 450, overflowY: "auto" }}>
        <EditorContent editor={editor} />
      </Stack>
    </Stack>
  );
}
