declare module '*.module.css';
declare module '*.module.scss';
declare module '*.gif';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.mp3';
declare module '*.mp4';
declare module '*.ogg';
declare module '*.png';
declare module '*.svg' {
  import React = require('react')
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>
  const src: string
  export default src
} declare module '*.wav';
declare module '*.webp';
declare module '*.json' {
  const content: string;
  export default content;
}
