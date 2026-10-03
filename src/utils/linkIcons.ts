import type { Component } from "vue";
import { Blog, Cloud, CompactDisc, Compass, Book, Fire, LaptopCode, Image, Envelope } from "@vicons/fa";

// 站点列表与友链页共用的图标映射（JSON icon 字段 → xicons 组件）
export const linkIcons: Record<string, Component> = {
  Blog,
  Cloud,
  CompactDisc,
  Compass,
  Book,
  Fire,
  LaptopCode,
  Image,
  Envelope,
};
