// src/global.d.ts
declare global {
    interface Window {
      YT: any;
      onYouTubeIframeAPIReady: () => void;
    }
  }
  
  export {};
  