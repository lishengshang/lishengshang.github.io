// 全局点击波纹指令 v-ripple
// 用法：在任意元素上添加 v-ripple 即可触发点击波纹效果
// 原理：监听 click 事件，在点击位置生成一个扩散的圆形元素，动画结束后移除

const createRipple = (event: MouseEvent): void => {
  const target = event.currentTarget as HTMLElement;
  const rect = target.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;

  const ripple = document.createElement("span");
  ripple.className = "ripple-effect";
  ripple.style.width = ripple.style.height = `${size}px`;
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;

  target.appendChild(ripple);
  ripple.addEventListener("animationend", () => ripple.remove());
};

export const ripple = {
  mounted(el: HTMLElement): void {
    // 确保宿主元素是相对定位，波纹才能绝对定位在内部
    const position = getComputedStyle(el).position;
    if (position === "static" || !position) {
      el.style.position = "relative";
    }
    // 隐藏溢出的波纹
    const overflow = getComputedStyle(el).overflow;
    if (overflow === "visible") {
      el.style.overflow = "hidden";
    }
    el.addEventListener("click", createRipple);
  },
  unmounted(el: HTMLElement): void {
    el.removeEventListener("click", createRipple);
  },
};
