<template>
  <div class="flex gap-2 justify-center">
    <button
      id="download-button"
      class="rounded p-1 bg-white/10 hover:bg-white/20 transition-colors"
      :data-tooltip="'Save as file'"
      @click="downloadTextFile"
    >
      💾
    </button>

    <button
      id="upload-button"
      class="rounded p-1 bg-white/10 hover:bg-white/20 transition-colors"
      :data-tooltip="'Load from file'"
      @click="clickFileInput"
    >
      📂
    </button>

    <input
      ref="fileRef"
      type="file"
      class="hidden"
      @change="loadTextFile"
      accept=".emoji"
    />
  </div>
</template>

<script setup lang="ts">
import tippy from "tippy.js";
const store = useStore();

const fileRef = ref<HTMLInputElement>();

const clickFileInput = () => {
  fileRef.value?.click();
};

const signatureHeader = () => {
  // DrawMoji;
  // PaintMoji;
  // EmojiPaint;
  const project = "shape-to-emoji";
  const name = "Created By: Quentin Juarez";
  const github = "GitHub: https://github.com/quentinjuarez/shape-to-emoji";
  const version = `Version: ${__VERSION__}\n`;
  return [project, name, github, version].join("\n");
};

const downloadTextFile = () => {
  const text = `${signatureHeader()}\n${store.canvasToText()}`;
  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const random = Math.random().toString(36).substring(7);
  a.download = random + ".emoji";
  a.click();
  URL.revokeObjectURL(url);
};

const loadTextFile = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target?.files?.[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = async (e: any) => {
    let text = e.target.result;
    if (!text || typeof text !== "string") {
      console.warn("Invalid file content.");
      return;
    }

    console.log(text);

    if (!text.startsWith("shape-to-emoji")) {
      console.warn("Invalid file signature.");
      return;
    }
    // remove 4 first line
    text = text.split("\n").slice(4).join("\n");
    console.log(text);
    store.textToCanvas(text);
  };

  reader.onerror = (error) => {
    console.error("Error reading the file:", error);
  };

  reader.readAsText(file);
};

let tooltips = [] as any[];

onMounted(() => {
  initializeTooltips();
});

function initializeTooltips() {
  // Destroy existing tooltips
  tooltips.forEach((tooltip) => tooltip.destroy());
  tooltips = [];

  // Initialize new tooltips
  ["upload-button", "download-button"].forEach((id) => {
    // @ts-ignore
    const tooltip = tippy(document.getElementById(id), {
      content(reference) {
        return reference.getAttribute("data-tooltip");
      },
      theme: "light", // Specify the theme as 'light'
    });
    tooltips.push(tooltip);
  });
}

onUnmounted(() => {
  tooltips.forEach((tooltip) => tooltip.destroy());
});
</script>
